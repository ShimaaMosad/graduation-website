"use client";

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
}

export function PauseModal({ isOpen, onResume }: PauseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-10 text-center shadow-2xl max-w-sm w-full mx-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "linear-gradient(135deg, #EDE9FE, #DDD6FE)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#7C3AED">
            <rect x="6" y="4" width="4" height="16" rx="1"/>
            <rect x="14" y="4" width="4" height="16" rx="1"/>
          </svg>
        </div>
        <h2
          className="text-xl font-bold mb-2"
          style={{ fontFamily: "Sora, sans-serif", color: "#1F2937" }}
        >
          ⏸ Interview Paused
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Take a moment. Resume when you&apos;re ready.
        </p>
        <button
          onClick={onResume}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" }}
        >
          Resume Interview
        </button>
      </div>
    </div>
  );
}