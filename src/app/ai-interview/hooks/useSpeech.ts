"use client";

import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface UseSpeechReturn {
  isSpeaking: boolean;
  isListening: boolean;
  isListeningRef: React.MutableRefObject<boolean>;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  speak: (text: string) => Promise<void>;
  startListening: () => void;
  resumeListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  cancelSpeech: () => void;
}

// ================= Helpers =================

function getVoicesReady(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    if (voices.length) return resolve(voices);

    const handler = () => {
      synth.removeEventListener("voiceschanged", handler);
      resolve(synth.getVoices());
    };

    synth.addEventListener("voiceschanged", handler);
    // Fallback: some browsers never fire voiceschanged
    setTimeout(handler, 1500);
  });
}

// ================= Hook =================

export function useSpeech(): UseSpeechReturn {
  const [isSpeaking, setIsSpeaking]               = useState(false);
  const [isListening, setIsListening]             = useState(false);
  const [transcript, setTranscript]               = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported]             = useState(false); // FIX: default false until confirmed

  const recognitionRef   = useRef<any>(null);
  const finalTextRef     = useRef("");
  const isListeningRef   = useRef(false);
  const shouldListenRef  = useRef(false);  // user intent: should mic be on?
  const isSpeakingRef    = useRef(false);  // FIX: ref mirror of isSpeaking for use inside callbacks
  const mountedRef       = useRef(true);
  const voicesPromiseRef = useRef<Promise<SpeechSynthesisVoice[]> | null>(null);
  const speakResolveRef  = useRef<(() => void) | null>(null); // FIX: track speak promise so cancelSpeech can resolve it

  // ================= INIT =================

  useEffect(() => {
    if (typeof window === "undefined") return;
    mountedRef.current = true;

    const hasSR  = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
    const hasTTS = "speechSynthesis" in window;
    setIsSupported(hasSR && hasTTS);

    if (hasTTS) {
      voicesPromiseRef.current = getVoicesReady();
    }

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ================= INTERNAL: START MIC =================

  // FIX: use a ref-based function so it can safely self-reference inside onend
  // without causing stale closures or infinite useCallback dependency loops
  const startListeningInternalRef = useRef<() => void>(() => {});

  startListeningInternalRef.current = () => {
    if (typeof window === "undefined") return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    // FIX: do not start if already physically listening
    if (isListeningRef.current) return;

    // FIX: do not start if TTS is still playing — this prevents mic picking up speaker output
    if (isSpeakingRef.current) return;

    // Kill any zombie session before creating a new one
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }

    const rec = new SR();
    recognitionRef.current = rec;

    rec.continuous     = true;
    rec.interimResults = true;
    rec.lang           = "en-US";

    rec.onstart = () => {
      if (!mountedRef.current) return;
      isListeningRef.current = true;
      setIsListening(true);
    };

    rec.onresult = (e: any) => {
      if (!mountedRef.current) return;
      let interim = "";

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const text = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalTextRef.current += text + " ";
        } else {
          interim += text;
        }
      }

      setTranscript(finalTextRef.current.trim());
      setInterimTranscript(interim);
    };

    rec.onerror = (e: any) => {
      // FIX: "aborted" fires when we call .abort() ourselves — not a real error
      if (e.error === "aborted") return;
      if (!mountedRef.current) return;

      console.error("SpeechRecognition error:", e.error);
      isListeningRef.current = false;
      setIsListening(false);
      setInterimTranscript("");
    };

    rec.onend = () => {
      if (!mountedRef.current) return;

      isListeningRef.current = false;
      setIsListening(false);
      setInterimTranscript("");

      // FIX: only auto-restart if user still wants mic AND TTS is not speaking
      if (shouldListenRef.current && !isSpeakingRef.current) {
        setTimeout(() => {
          if (shouldListenRef.current && !isSpeakingRef.current && mountedRef.current) {
            startListeningInternalRef.current();
          }
        }, 150);
      }
    };

    try {
      rec.start();
    } catch (err) {
      console.error("SpeechRecognition start failed:", err);
    }
  };

  const startListeningInternal = useCallback(() => {
    startListeningInternalRef.current();
  }, []);

  // ================= SPEAK =================

  const speak = useCallback(async (text: string): Promise<void> => {
    if (typeof window === "undefined") return;
    if (!text.trim()) return;

    const synth = window.speechSynthesis;

    // FIX: set shouldListen=false BEFORE aborting recognition
    // so onend doesn't immediately restart mic while TTS is about to play
    shouldListenRef.current = false;
    isSpeakingRef.current   = true;
    setIsSpeaking(true);

    // Stop recognition cleanly
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }
    isListeningRef.current = false;
    setIsListening(false);

    // Cancel any previous speech
    synth.cancel();

    // FIX: wait for cancel to fully flush before queuing new utterance
    await new Promise((r) => setTimeout(r, 120));

    if (!mountedRef.current) return;

    const voices = await (voicesPromiseRef.current ?? getVoicesReady());

    return new Promise<void>((resolve) => {
      // FIX: store resolve ref so cancelSpeech() can also resolve the promise cleanly
      speakResolveRef.current = resolve;

      const utter = new SpeechSynthesisUtterance(text);

      // Prefer cloud/natural voices over local robotic ones
      utter.voice =
        voices.find((v) => v.lang === "en-US" && !v.localService) ||
        voices.find((v) => v.lang === "en-US") ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0] ||
        null;

      utter.rate   = 0.92;
      utter.pitch  = 1;
      utter.volume = 1;

      utter.onstart = () => {
        if (!mountedRef.current) return;
        isSpeakingRef.current = true;
        setIsSpeaking(true);
      };

      utter.onend = () => {
        if (!mountedRef.current) return;

        isSpeakingRef.current = false;
        setIsSpeaking(false);
        speakResolveRef.current = null;
        resolve();

        // FIX: start mic immediately after AI stops speaking.
        // 80ms gap lets the audio device switch from output to input mode.
        shouldListenRef.current = true;
        setTimeout(() => {
          if (mountedRef.current && shouldListenRef.current) {
            startListeningInternalRef.current();
          }
        }, 80);
      };

      utter.onerror = (e) => {
        // FIX: "interrupted" / "canceled" fire when synth.cancel() is called — not real errors
        if (e.error === "interrupted" || e.error === "canceled") {
          isSpeakingRef.current = false;
          setIsSpeaking(false);
          speakResolveRef.current = null;
          resolve();
          return;
        }
        console.error("SpeechSynthesis error:", e.error);
        isSpeakingRef.current = false;
        setIsSpeaking(false);
        speakResolveRef.current = null;
        resolve(); // always resolve so callers never hang
      };

      synth.speak(utter);

      // FIX: Chrome bug — speechSynthesis silently pauses when tab loses focus.
      // Poke resume() every 5s to keep it alive.
      const keepAlive = setInterval(() => {
        if (!isSpeakingRef.current) { clearInterval(keepAlive); return; }
        if (synth.paused) synth.resume();
      }, 5000);
    });
  }, []);

  // ================= PUBLIC CONTROLS =================

  const startListening = useCallback(() => {
    // Full fresh start — resets transcript then opens mic
    finalTextRef.current = "";
    setTranscript("");
    setInterimTranscript("");

    shouldListenRef.current = true;
    startListeningInternalRef.current();
  }, []);

  const resumeListening = useCallback(() => {
    // Resume without resetting transcript (used after speak() ends if you manage it manually)
    shouldListenRef.current = true;
    startListeningInternalRef.current();
  }, []);

  const stopListening = useCallback(() => {
    // FIX: set shouldListen=false BEFORE abort so onend doesn't restart
    shouldListenRef.current = false;

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }

    isListeningRef.current = false;
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const resetTranscript = useCallback(() => {
    finalTextRef.current = "";
    setTranscript("");
    setInterimTranscript("");
  }, []);

  const cancelSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    // FIX: resolve the hanging speak() promise so the caller doesn't hang forever
    if (speakResolveRef.current) {
      speakResolveRef.current();
      speakResolveRef.current = null;
    }
  }, []);

  // ================= CLEANUP =================

  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      isSpeakingRef.current   = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  return {
    isSpeaking,
    isListening,
    isListeningRef,
    transcript,
    interimTranscript,
    isSupported,
    speak,
    startListening,
    resumeListening,
    stopListening,
    resetTranscript,
    cancelSpeech,
  };
}