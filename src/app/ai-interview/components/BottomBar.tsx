"use client";

import { cn } from "../lib/Utils";


interface BottomBarProps {
  onNext: () => void;
  onPause: () => void;
  onToggleMic: () => void;
  onToggleCam: () => void;
  isMicMuted: boolean;
  isCamOff: boolean;
  isNextDisabled: boolean;
  isPaused: boolean;
  className?: string;
}

export function BottomBar({
  onNext,
  onPause,
  onToggleMic,
  onToggleCam,
  isMicMuted,
  isCamOff,
  isNextDisabled,
  isPaused,
  className,
}: BottomBarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-3.5",
        "flex items-center justify-center gap-4 z-50",
        "shadow-[0_-4px_20px_rgba(0,0,0,0.06)]",
        className
      )}
    >
      {/* Mic toggle */}
      <button
        onClick={onToggleMic}
        title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
          isMicMuted
            ? "bg-red-100 text-red-500 hover:bg-red-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
      >
        {isMicMuted ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" fill="currentColor"/>
            <path d="M19 10v2a7 7 0 01-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {/* Camera toggle */}
      <button
        onClick={onToggleCam}
        title={isCamOff ? "Turn Camera On" : "Turn Camera Off"}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
          isCamOff
            ? "bg-red-100 text-red-500 hover:bg-red-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
      >
        {isCamOff ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34l1 1L23 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M23 7l-7 5 7 5V7z" fill="currentColor"/>
            <rect x="1" y="5" width="15" height="14" rx="2" fill="currentColor"/>
          </svg>
        )}
      </button>

      {/* Continue button */}
      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className={cn(
          "px-8 py-3.5 rounded-[14px] font-semibold text-[15px] text-white transition-all duration-200",
          "shadow-[0_4px_14px_rgba(124,58,237,0.35)]",
          isNextDisabled
            ? "opacity-50 cursor-not-allowed bg-purple-400"
            : "bg-gradient-to-r from-purple-600 to-purple-500 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.45)]"
        )}
        style={
          !isNextDisabled
            ? { background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" }
            : undefined
        }
      >
        Continue to Next Question
      </button>

      {/* Pause */}
      <button
        onClick={onPause}
        className="text-gray-500 font-medium text-[15px] hover:text-gray-700 transition-colors px-4 py-3.5"
      >
        {isPaused ? "Resume Interview" : "Pause Interview"}
      </button>
    </div>
  );
}