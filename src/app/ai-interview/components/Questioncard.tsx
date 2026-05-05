"use client";

import { cn } from "../lib/Utils";

interface QuestionCardProps {
  questionText: string;
  questionIndex: number;
  totalQuestions: number;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  interimTranscript: string;
}

export function QuestionCard({
  questionText,
  questionIndex,
  totalQuestions,
  isListening,
  isSpeaking,
  transcript,
  interimTranscript,
}: QuestionCardProps) {
  const displayTranscript = transcript + (interimTranscript ? " " + interimTranscript : "");

  return (
    <div className="flex flex-col gap-4">
      {/* Question Card */}
      <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 min-h-[200px] flex flex-col gap-4">
        {/* Badge */}
        <div className="flex justify-end">
          <span
            className="text-sm font-semibold px-4 py-1.5 rounded-full border"
            style={{
              background: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
              color: "#7C3AED",
              borderColor: "#C4B5FD",
            }}
          >
            Question {questionIndex + 1} of {totalQuestions}
          </span>
        </div>

        {/* Question text */}
        <p className="text-gray-800 text-[17px] font-medium leading-relaxed">
          {questionText}
        </p>

        {/* Mic section */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <button
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200",
              isListening
                ? "bg-green-100 shadow-[0_0_0_0_rgba(16,185,129,0.4)] animate-mic-pulse"
                : isSpeaking
                ? "bg-purple-100"
                : "bg-gray-100"
            )}
            aria-label="Microphone status"
            disabled
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={cn(
                isListening ? "text-green-600" : "text-gray-400"
              )}
            >
              <path
                d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
                fill="currentColor"
              />
              <path
                d="M19 10v2a7 7 0 0 1-14 0v-2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="12" y1="19" x2="12" y2="23"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              />
              <line
                x1="8" y1="23" x2="16" y2="23"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              />
            </svg>
          </button>

          <p
            className={cn(
              "text-sm font-medium",
              isListening ? "text-green-600" : "text-gray-400"
            )}
          >
            {isSpeaking
              ? "Alex is speaking..."
              : isListening
              ? "You may begin speaking now"
              : "Preparing next question..."}
          </p>
        </div>
      </div>

      {/* Live Transcript Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 min-h-[90px]">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Your Answer (Live Transcript)
        </p>
        <p className="text-[14px] text-gray-800 leading-relaxed">
          {displayTranscript ? (
            <>
              {displayTranscript}
              <span className="inline-block w-0.5 h-3.5 bg-purple-500 ml-0.5 animate-blink align-middle" />
            </>
          ) : (
            <span className="text-gray-400">
              {isListening
                ? "Start speaking and your answer will appear here..."
                : "Your spoken answer will appear here in real time..."}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}