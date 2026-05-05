"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useSpeech } from "../hooks/useSpeech";
import { useCamera } from "../hooks/useCamera";
import { useInterviewTimer } from "../hooks/useInterviewTimer";

import { AIAvatar } from "./AIAvatar";
import { InterviewData, InterviewResults, QAEntry, Question } from "../types/interview";
import { Toast, useToast } from "./Toast";
import { fetchInterviewData, sendCameraSnapshot, submitInterviewAnswers } from "../lib/Interviewapi";
import { ResultsPage } from "./ResultsPage";
import { QuestionCard } from "./Questioncard";
import { SkillsProgress } from "./Skillsprogress";
import { BottomBar } from "./BottomBar";
import { PauseModal } from "./Pausemodal";
import { CameraFeed } from "./Camerafeed";

type PageView = "interview" | "results";

export function AIInterviewClient() {
  const router = useRouter();

  // ── State ──────────────────────────────────────────────────────────────────
  const [isLoading,        setIsLoading]        = useState(true);
  const [interviewData,    setInterviewData]     = useState<InterviewData | null>(null);
  const [questions,        setQuestions]         = useState<Question[]>([]);
  const [currentIdx,       setCurrentIdx]        = useState(0);
  const [completedSkillIds,setCompletedSkillIds] = useState<Set<string>>(new Set());
  const [isPaused,         setIsPaused]          = useState(false);
  const [isMicMuted,       setIsMicMuted]        = useState(false);
  const [isNextEnabled,    setIsNextEnabled]      = useState(false);
  const [pageView,         setPageView]          = useState<PageView>("interview");
  const [results,          setResults]           = useState<InterviewResults | null>(null);
  const [isDone,           setIsDone]            = useState(false);

  // ── Refs — always-current values, safe inside any callback ────────────────
  const answerMapRef       = useRef<Map<string, string>>(new Map());
  const cameraAnalysisRef  = useRef<{ behavior: string; confidence: number }[]>([]);
  const questionStartRef   = useRef<number>(Date.now());

  // Mirror mutable state so callbacks never capture stale values
  const currentIdxRef    = useRef(0);
  const questionsRef     = useRef<Question[]>([]);
  const interviewDataRef = useRef<InterviewData | null>(null);
  const isMicMutedRef    = useRef(false);
  const isPausedRef      = useRef(false);
  const isDoneRef        = useRef(false);

  useEffect(() => { currentIdxRef.current    = currentIdx;    }, [currentIdx]);
  useEffect(() => { questionsRef.current     = questions;      }, [questions]);
  useEffect(() => { interviewDataRef.current = interviewData;  }, [interviewData]);
  useEffect(() => { isMicMutedRef.current    = isMicMuted;     }, [isMicMuted]);
  useEffect(() => { isPausedRef.current      = isPaused;        }, [isPaused]);
  useEffect(() => { isDoneRef.current        = isDone;          }, [isDone]);

  // ── Hooks ──────────────────────────────────────────────────────────────────
  const speech              = useSpeech();
  const camera              = useCamera();
  const { toast, showToast } = useToast();

  // Timer: onExpire reads from ref — no stale closure
  const timer = useInterviewTimer(() => {
    if (!isDoneRef.current) advanceQuestion();
  });

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentQuestion = questions[currentIdx];
  const currentSkillId  = currentQuestion?.skillId ?? "";

  // ── Load interview data ───────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchInterviewData();
        setInterviewData(data);
        setQuestions(data.questions.map((q) => ({ ...q, answer: "" })));
      } catch {
        showToast("Failed to load interview data. Using demo mode.");
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Start camera once data is ready ───────────────────────────────────────
  useEffect(() => {
    if (!isLoading) {
      camera.startCamera().catch(() => showToast("Camera unavailable"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // ── Begin interview when data loaded ──────────────────────────────────────
  useEffect(() => {
    if (!isLoading && questions.length > 0) {
      presentQuestion(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, questions.length]);

  // ── Auto camera capture every 5 s ─────────────────────────────────────────
  useEffect(() => {
    if (!isLoading && camera.isCameraActive && interviewData) {
      camera.startAutoCapture(5000, async (base64) => {
        if (isDoneRef.current || isPausedRef.current) return;
        const ctx = questionsRef.current[currentIdxRef.current]?.question ?? "";
        const res = await sendCameraSnapshot(interviewData.interviewId, base64, ctx);
        cameraAnalysisRef.current.push(res);
      });
    }
    return () => camera.stopAutoCapture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, camera.isCameraActive, isDone, isPaused]);

  // ── Voice command: say "next" to advance ──────────────────────────────────
  useEffect(() => {
    if (!speech.isListening || isDone || isPaused) return;

    const full     = speech.transcript.toLowerCase();
    const interim  = speech.interimTranscript.toLowerCase();
    const combined = (full + " " + interim).trim();

    const triggeredNext =
      combined === "next" ||
      combined.endsWith(" next") ||
      combined.endsWith("next.");

    if (triggeredNext) {
      const clean = speech.transcript.replace(/\bnext\.?\s*$/i, "").trim();
      const q     = questionsRef.current[currentIdxRef.current];
      if (q) answerMapRef.current.set(q.id, clean);
      speech.stopListening();
      setTimeout(() => advanceQuestion(), 400);
      return;
    }

    if (speech.transcript.trim().length > 5) {
      setIsNextEnabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.transcript, speech.interimTranscript, speech.isListening, isDone, isPaused]);

  // ── Core flow ─────────────────────────────────────────────────────────────

  /**
   * presentQuestion:
   *  1. Resets transcript for this question
   *  2. Starts countdown timer
   *  3. Speaks the question aloud (mic is muted during TTS)
   *  4. After speak() resolves, useSpeech has already scheduled mic resume
   *     (resumeRecognitionAfterSpeech, 500 ms after onDone).
   *     We do NOT call startListening again here — that would race and reset transcript.
   *     speak() always resumes mic unless isMutedRef is true.
   */
  const presentQuestion = useCallback(async (idx: number) => {
    const q = questionsRef.current[idx];
    if (!q) return;

    // Reset transcript for this question only — keep answerMapRef for previous answers
    speech.resetTranscript();
    setIsNextEnabled(false);
    questionStartRef.current = Date.now();

    const duration = interviewDataRef.current?.totalDuration ?? 120;
    timer.startTimer(duration);

    // speak() will:
    //   - pause the mic (pauseRecognitionForSpeech)
    //   - speak the question
    //   - then call resumeRecognitionAfterSpeech which re-opens mic after 500ms
    //     (skipped only if isMicMuted is true)
    await speech.speak(q.question);

    // speak() has resolved — mic will open in 500ms automatically via useSpeech.
    // Nothing more needed here. Do NOT call startListening/resumeListening —
    // that would reset finalTextRef or race with the internal resume.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * saveCurrentAnswer — reads from ref so it's never stale.
   * Priority: explicit override → existing answerMapRef entry → live transcript
   */
  const saveCurrentAnswer = useCallback((overrideText?: string) => {
    const q = questionsRef.current[currentIdxRef.current];
    if (!q) return;
    const ans =
      overrideText ??
      (speech.transcript.trim() || answerMapRef.current.get(q.id)) ??
      "[No answer recorded]";
    answerMapRef.current.set(q.id, ans);
    setQuestions((prev) =>
      prev.map((item, i) =>
        i === currentIdxRef.current ? { ...item, answer: ans } : item
      )
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishInterview = useCallback(async () => {
    setIsDone(true);
    isDoneRef.current = true;
    timer.stopTimer();
    speech.stopListening();
    camera.stopAutoCapture();

    const data = interviewDataRef.current;
    if (data) setCompletedSkillIds(new Set(data.skills.map((s) => s.id)));

    await speech.speak(
      "Great job! You have completed all interview questions. Please wait while we analyze your results."
    );

    const qs = questionsRef.current;
    const qaEntries: QAEntry[] = qs.map((q) => ({
      question: q.question,
      answer:   q.answer || answerMapRef.current.get(q.id) || "[No answer]",
      skill:    q.skill,
    }));

    try {
      const res = await submitInterviewAnswers(data?.interviewId ?? "demo", qaEntries);
      res.cameraAnalysis = cameraAnalysisRef.current.map((a, i) => ({
        timestamp:  i * 5000,
        behavior:   a.behavior as "attentive" | "looking_away" | "absent" | "suspicious",
        confidence: a.confidence,
      }));
      setResults(res);
      setPageView("results");
    } catch {
      showToast("Error submitting results. Please try again.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * advanceQuestion — always reads from refs, safe to call from timer or voice command.
   */
  const advanceQuestion = useCallback(() => {
    saveCurrentAnswer();
    speech.stopListening();
    timer.stopTimer();

    const idx     = currentIdxRef.current;
    const qs      = questionsRef.current;
    const nextIdx = idx + 1;

    const prevSkillId = qs[idx]?.skillId;
    const nextSkillId = qs[nextIdx]?.skillId;
    if (prevSkillId && nextSkillId !== prevSkillId) {
      setCompletedSkillIds((prev) => new Set([...prev, prevSkillId]));
    }

    if (nextIdx >= qs.length) {
      finishInterview();
    } else {
      setCurrentIdx(nextIdx);
      currentIdxRef.current = nextIdx;
      presentQuestion(nextIdx);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveCurrentAnswer, finishInterview, presentQuestion]);

  // ── Button handlers ───────────────────────────────────────────────────────

  const handleNext = () => {
    if (isDone || !isNextEnabled) return;
    advanceQuestion();
  };

  const handlePause = () => {
    if (isPaused) {
      // Resume
      setIsPaused(false);
      isPausedRef.current = false;
      if (!isMicMutedRef.current) speech.resumeListening();
      timer.resumeTimer();
    } else {
      // Pause
      setIsPaused(true);
      isPausedRef.current = true;
      speech.stopListening();
      speech.cancelSpeech();
      timer.pauseTimer();
    }
  };

  const handleToggleMic = () => {
    setIsMicMuted((prev) => {
      const muting = !prev;
      isMicMutedRef.current = muting;
      if (muting) {
        speech.stopListening();
        showToast("Microphone muted");
      } else {
        // Only resume if interview is active and AI isn't speaking
        if (!isPausedRef.current && !speech.isSpeaking) {
          speech.resumeListening(); // preserves existing transcript
        }
        showToast("Microphone active");
      }
      return muting;
    });
  };

  const handleToggleCam = () => {
    camera.toggleCamera();
    showToast(camera.isCameraOff ? "Camera on" : "Camera off");
  };

  // ── Skill progress ────────────────────────────────────────────────────────
  const currentSkillIdx = interviewData
    ? interviewData.skills.findIndex((s) => s.id === currentSkillId)
    : 0;

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-4"
        style={{ background: "#F5F3FF" }}
      >
        <div className="w-14 h-14 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="font-semibold text-purple-700 text-lg" style={{ fontFamily: "Sora, sans-serif" }}>
          Preparing your interview...
        </p>
        <p className="text-gray-400 text-sm">Loading skills and questions from API</p>
      </div>
    );
  }

  // ── Results view ───────────────────────────────────────────────────────────
  if (pageView === "results" && results) {
    return (
      <>
        <ResultsPage results={results} onGoToInterview={() => setPageView("interview")} />
        <Toast message={toast.message} visible={toast.visible} />
      </>
    );
  }

  // ── Interview view ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-24" style={{ background: "#F5F3FF" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-7 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)", fontFamily: "Sora, sans-serif" }}
          >
            M
          </div>
          <span className="font-semibold text-gray-800" style={{ fontFamily: "Sora, sans-serif" }}>
            MySite
          </span>
        </div>

        <h1 className="font-bold text-xl text-gray-800" style={{ fontFamily: "Sora, sans-serif" }}>
          AI Skill Verification Interview
        </h1>

        <div
          className="px-5 py-2 rounded-full font-semibold text-sm"
          style={{
            background: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
            color: timer.timeLeft < 30 ? "#EF4444" : "#7C3AED",
            border: "1px solid #C4B5FD",
            fontFamily: "Sora, sans-serif",
          }}
        >
          {timer.formattedTime}
        </div>
      </header>

      {/* Skill bar */}
      {interviewData && (
        <div className="bg-white border-b border-gray-200 py-2.5 text-center">
          <p className="text-gray-400 text-sm font-medium">
            Skill {currentSkillIdx + 1} of {interviewData.skills.length}
          </p>
          <p className="text-purple-600 font-semibold text-[15px]">
            {currentQuestion?.skill}
          </p>
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-2 gap-6 px-7 py-6 max-w-[1400px] mx-auto">
        {/* LEFT */}
        <div className="flex flex-col items-center gap-5">
          <AIAvatar isSpeaking={speech.isSpeaking} isListening={speech.isListening} />

          <CameraFeed
            videoRef={camera.videoRef}
            canvasRef={camera.canvasRef}
            isCameraActive={camera.isCameraActive}
            isCameraOff={camera.isCameraOff}
            error={camera.error}
          />

          {interviewData && (
            <SkillsProgress
              skills={interviewData.skills}
              currentSkillId={currentSkillId}
              completedSkillIds={completedSkillIds}
            />
          )}
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-5 pt-2">
          {currentQuestion && (
            <QuestionCard
              questionText={currentQuestion.question}
              questionIndex={currentIdx}
              totalQuestions={questions.length}
              isListening={speech.isListening}
              isSpeaking={speech.isSpeaking}
              transcript={speech.transcript}
              interimTranscript={speech.interimTranscript}
            />
          )}

          {!speech.isSupported && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
              ⚠️ Speech recognition requires Chrome. Other browsers may have limited functionality.
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <BottomBar
        onNext={handleNext}
        onPause={handlePause}
        onToggleMic={handleToggleMic}
        onToggleCam={handleToggleCam}
        isMicMuted={isMicMuted}
        isCamOff={camera.isCameraOff}
        isNextDisabled={!isNextEnabled && !isDone}
        isPaused={isPaused}
      />

      <PauseModal isOpen={isPaused} onResume={handlePause} />
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}