"use client";

import { cn } from "../lib/Utils";


interface CameraFeedProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isCameraActive: boolean;
  isCameraOff: boolean;
  error: string | null;
  className?: string;
}

export function CameraFeed({
  videoRef,
  canvasRef,
  isCameraActive,
  isCameraOff,
  error,
  className,
}: CameraFeedProps) {
  return (
    <div
      className={cn(
        "relative w-full max-w-[280px] rounded-2xl overflow-hidden bg-gray-900",
        "aspect-video shadow-xl",
        className
      )}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={cn(
          "w-full h-full object-cover",
          isCameraOff && "brightness-0"
        )}
      />

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Placeholder when not active */}
      {!isCameraActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          {error ? (
            <>
              <span className="text-4xl">📵</span>
              <p className="text-gray-400 text-xs text-center px-4">{error}</p>
            </>
          ) : (
            <>
              {/* Blue circle placeholder like in screenshot */}
              <div className="w-16 h-16 rounded-full bg-blue-500" />
            </>
          )}
        </div>
      )}

      {/* "You" label */}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-md">
        You
      </div>

      {/* Recording indicator */}
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />

      {/* Camera off overlay */}
      {isCameraOff && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <span className="text-gray-400 text-sm">Camera Off</span>
        </div>
      )}
    </div>
  );
}