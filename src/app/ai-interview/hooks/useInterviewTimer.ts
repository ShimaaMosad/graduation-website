"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseInterviewTimerReturn {
  timeLeft: number;
  isRunning: boolean;
  elapsedTotal: number;
  formattedTime: string;
  startTimer: (durationSeconds: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: (durationSeconds: number) => void;
  stopTimer: () => void;
  resetElapsed: () => void;
}

export function useInterviewTimer(onExpire?: () => void): UseInterviewTimerReturn {
  const [timeLeft, setTimeLeft]         = useState(0);
  const [isRunning, setIsRunning]       = useState(false);
  const [elapsedTotal, setElapsedTotal] = useState(0);

  const intervalRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef   = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Refs mirror state — callbacks always read current values, no stale closures
  const timeLeftRef  = useRef(0);
  const isRunningRef = useRef(false);

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const next = timeLeftRef.current - 1;
    if (next <= 0) {
      timeLeftRef.current  = 0;
      isRunningRef.current = false;
      setTimeLeft(0);
      setIsRunning(false);
      clear();
      onExpireRef.current?.();
    } else {
      timeLeftRef.current = next;
      setTimeLeft(next);
      setElapsedTotal((p) => p + 1);
    }
  }, [clear]);

  const startTimer = useCallback((durationSeconds: number) => {
    clear();
    timeLeftRef.current  = durationSeconds;
    isRunningRef.current = true;
    setTimeLeft(durationSeconds);
    setIsRunning(true);
    intervalRef.current = setInterval(tick, 1_000);
  }, [clear, tick]);

  const pauseTimer = useCallback(() => {
    if (!isRunningRef.current) return;
    clear();
    isRunningRef.current = false;
    setIsRunning(false);
  }, [clear]);

  const resumeTimer = useCallback(() => {
    // Guard: already running or nothing left
    if (isRunningRef.current || timeLeftRef.current <= 0) return;
    isRunningRef.current = true;
    setIsRunning(true);
    intervalRef.current = setInterval(tick, 1_000);
  }, [tick]);

  const resetTimer = useCallback((durationSeconds: number) => {
    clear();
    timeLeftRef.current  = durationSeconds;
    isRunningRef.current = false;
    setTimeLeft(durationSeconds);
    setIsRunning(false);
  }, [clear]);

  const stopTimer = useCallback(() => {
    clear();
    isRunningRef.current = false;
    setIsRunning(false);
  }, [clear]);

  const resetElapsed = useCallback(() => setElapsedTotal(0), []);

  useEffect(() => () => clear(), [clear]);

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const formattedTime = `${m}:${String(s).padStart(2, "0")} remaining`;

  return { timeLeft, isRunning, elapsedTotal, formattedTime, startTimer, pauseTimer, resumeTimer, resetTimer, stopTimer, resetElapsed };
}