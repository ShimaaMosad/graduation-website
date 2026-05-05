"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isCameraActive: boolean;
  isCameraOff: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  toggleCamera: () => void;
  captureFrame: () => string | null;
  startAutoCapture: (intervalMs: number, onCapture: (base64: string) => void) => void;
  stopAutoCapture: () => void;
  error: string | null;
}

export function useCamera(): UseCameraReturn {
  const videoRef   = useRef<HTMLVideoElement | null>(null);
  const canvasRef  = useRef<HTMLCanvasElement | null>(null);
  const streamRef  = useRef<MediaStream | null>(null);
  const captureIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs mirror state — used inside callbacks to avoid stale closures
  const isCameraActiveRef = useRef(false);
  const isCameraOffRef    = useRef(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraOff, setIsCameraOff]       = useState(false);
  const [error, setError]                   = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    // Don't open a second stream if one is already running
    if (streamRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try { await videoRef.current.play(); }
        catch (playErr) { console.warn("video.play() rejected:", playErr); }
      }

      isCameraActiveRef.current = true;
      setIsCameraActive(true);
      setError(null);
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Camera permission denied"
          : "Camera not available";
      console.error("Camera error:", err);
      setError(msg);
      isCameraActiveRef.current = false;
      setIsCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    // Stop auto-capture before killing the stream
    if (captureIntervalRef.current !== null) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    isCameraActiveRef.current = false;
    setIsCameraActive(false);
  }, []);

  const toggleCamera = useCallback(() => {
    if (!streamRef.current) return;
    isCameraOffRef.current = !isCameraOffRef.current;
    const off = isCameraOffRef.current;
    // Toggle track.enabled — correct API, no DOM style manipulation
    streamRef.current.getVideoTracks().forEach((t) => { t.enabled = !off; });
    setIsCameraOff(off);
  }, []);

  /**
   * Reads from refs — always fresh, no stale-closure risk.
   * Zero deps so captureFrame identity never changes.
   */
  const captureFrame = useCallback((): string | null => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !isCameraActiveRef.current || video.readyState < 2) return null;

    const w = video.videoWidth  || 640;
    const h = video.videoHeight || 480;
    if (canvas.width !== w)  canvas.width  = w;
    if (canvas.height !== h) canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.5);
  }, []); // no deps — everything read from refs

  const startAutoCapture = useCallback(
    (intervalMs: number, onCapture: (base64: string) => void) => {
      if (captureIntervalRef.current !== null) clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = setInterval(() => {
        const frame = captureFrame();
        if (frame) onCapture(frame);
      }, intervalMs);
    },
    [captureFrame]
  );

  const stopAutoCapture = useCallback(() => {
    if (captureIntervalRef.current !== null) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => { stopAutoCapture(); stopCamera(); };
  }, [stopAutoCapture, stopCamera]);

  return { videoRef, canvasRef, isCameraActive, isCameraOff, startCamera, stopCamera, toggleCamera, captureFrame, startAutoCapture, stopAutoCapture, error };
}