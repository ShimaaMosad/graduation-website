"use client";

import { useEffect, useState } from "react";
import { cn } from "../lib/Utils";

interface AIAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  className?: string;

  /*
    PASS YOUR REAL CAMERA STATE FROM PARENT
    Example:
    const [cameraEnabled, setCameraEnabled] = useState(true);

    When user clicks camera button:
    track.enabled = !track.enabled;
    setCameraEnabled(track.enabled);
  */
  cameraEnabled?: boolean;
}

export function AIAvatar({
  isSpeaking,
  isListening,
  className,
  cameraEnabled,
}: AIAvatarProps) {
  /*
    IMPORTANT:
    Browser cannot reliably detect YOUR custom UI button state automatically.
    So we sync with:
    1) Parent cameraEnabled prop (best / real)
    2) Browser track state fallback
  */
  const [cameraActive, setCameraActive] = useState(false);

  // Sync with parent button state instantly
  useEffect(() => {
    if (typeof cameraEnabled === "boolean") {
      setCameraActive(cameraEnabled);
    }
  }, [cameraEnabled]);

  // Fallback browser check if parent prop not provided
  useEffect(() => {
    if (typeof cameraEnabled === "boolean") return;

    let stream: MediaStream | null = null;

    const initCameraCheck = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        const track = stream.getVideoTracks()[0];

        const updateState = () => {
          const active =
            track.readyState === "live" &&
            track.enabled &&
            !track.muted;

          setCameraActive(active);
        };

        updateState();

        track.onended = updateState;
        track.onmute = updateState;
        track.onunmute = updateState;
      } catch {
        setCameraActive(false);
      }
    };

    initCameraCheck();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraEnabled]);

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Avatar Circle */}
      <div className="relative w-[220px] h-[220px] flex items-center justify-center">
        {/* Spinning gradient ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            isSpeaking && "animate-spin-slow"
          )}
          style={{
            background:
              "conic-gradient(#7C3AED, #EC4899, #A78BFA, #7C3AED)",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 4px), white calc(100% - 4px))",
            mask:
              "radial-gradient(farthest-side, transparent calc(100% - 4px), white calc(100% - 4px))",
            animation: isSpeaking
              ? "spin 3s linear infinite"
              : "spin 8s linear infinite",
          }}
        />

        {/* Inner circle */}
        <div
          className="w-[188px] h-[188px] rounded-full flex items-center justify-center z-10"
          style={{
            background: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
          }}
        >
          {/* Face */}
          <div
            className="w-[86px] h-[86px] rounded-[22px] flex flex-col items-center justify-center gap-[10px]"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
              boxShadow: "0 8px 24px rgba(124,58,237,0.4)",
            }}
          >
            {/* Eyes */}
            <div className="flex gap-[12px]">
              <div
                className={cn(
                  "w-[14px] h-[14px] bg-white rounded-full",
                  isSpeaking && "animate-blink"
                )}
              />
              <div
                className={cn(
                  "w-[14px] h-[14px] bg-white rounded-full",
                  isSpeaking && "animate-blink"
                )}
              />
            </div>

            {/* Mouth */}
            <div
              className={cn(
                "bg-white/80 rounded-full transition-all duration-150",
                isSpeaking
                  ? "w-[28px] h-[10px]"
                  : "w-[28px] h-[5px]"
              )}
            />
          </div>
        </div>

        {/* Listening Rings */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-30" />
            <div className="absolute inset-[-8px] rounded-full border border-green-300 animate-ping opacity-20" />
          </>
        )}
      </div>

      {/* Name */}
      <p className="font-semibold text-gray-800 text-[15px]">
        Alex - AI Interviewer
      </p>

      {/* Status */}
      <div className="flex items-center gap-5">
        {/* Mic */}
        <div className="flex items-center gap-[6px]">
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              isListening
                ? "bg-green-500 animate-pulse"
                : "bg-gray-400"
            )}
          />
          <span
            className={cn(
              "text-[13px] font-medium",
              isListening
                ? "text-green-600"
                : "text-gray-500"
            )}
          >
            {isListening ? "🎙 Recording" : "🎙 Mic Off"}
          </span>
        </div>

        {/* Camera */}
        <div className="flex items-center gap-[6px]">
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              cameraActive
                ? "bg-green-500 animate-pulse"
                : "bg-red-500"
            )}
          />
          <span
            className={cn(
              "text-[13px] font-medium",
              cameraActive
                ? "text-green-600"
                : "text-red-500"
            )}
          >
            {cameraActive ? "📹 Active" : "📹 Camera Off"}
          </span>
        </div>
      </div>

      {/* Sub-status */}
      <p className="text-gray-400 text-[13px]">
        {isSpeaking
          ? "Alex is speaking..."
          : isListening
          ? "Listening to your answer..."
          : "Your responses are being analyzed"}
      </p>
    </div>
  );
}