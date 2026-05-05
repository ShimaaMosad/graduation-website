"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
}

export function Toast({ message, visible }: ToastProps) {
  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[300] transition-all duration-300 pointer-events-none
        bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      {message}
    </div>
  );
}

// Hook for easy toast usage
export function useToast() {
  const [toast, setToast] = useState({ message: "", visible: false });
  const toastTimeout = { current: null as ReturnType<typeof setTimeout> | null };

  const showToast = (message: string, duration = 3000) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ message, visible: true });
    toastTimeout.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, duration);
  };

  return { toast, showToast };
}