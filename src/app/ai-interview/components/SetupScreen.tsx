"use client";

import React from "react";
import type { Skill } from "../types/interview";

type PermStatus = "pending" | "ok" | "err";

interface Permissions {
  mic: PermStatus;
  cam: PermStatus;
  speech: PermStatus;
}

interface SetupScreenProps {
  skills: Skill[];
  permissions: Permissions;
  onStart: () => void;
  loading: boolean;
}

function CheckIcon({ status }: { status: PermStatus }) {
  const map = {
    pending: { bg: "bg-gray-100", text: "text-gray-400", icon: "⏳" },
    ok:      { bg: "bg-emerald-50", text: "text-emerald-600", icon: "✓" },
    err:     { bg: "bg-red-50", text: "text-red-500", icon: "✗" },
  };
  const { bg, text, icon } = map[status];
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 ${bg} ${text}`}>
      {icon}
    </span>
  );
}

export default function SetupScreen({ skills, permissions, onStart, loading }: SetupScreenProps) {
  const allReady = !loading && skills.length > 0 && permissions.mic !== "pending";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-fuchsia-50 to-blue-50 p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-violet-200">
          🎙️
        </div>
        <h1 className="font-bold text-2xl text-gray-900 mb-2 tracking-tight">AI Skill Verification Interview</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          You&apos;ll be interviewed by Alex, our AI interviewer. Answer questions verbally — no typing needed. Your camera and microphone will be active throughout.
        </p>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {skills.map((s) => (
              <span key={s.name} className="bg-violet-50 text-violet-700 border border-violet-200 text-xs font-semibold px-4 py-1.5 rounded-full">
                {s.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 mb-8 text-left">
          {([
            { key: "mic" as const, label: "Microphone access" },
            { key: "cam" as const, label: "Camera access" },
            { key: "speech" as const, label: "Speech recognition support" },
          ] as const).map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3 text-sm text-gray-600">
              <CheckIcon status={permissions[key]} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          disabled={!allReady}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-800 text-white font-semibold text-sm shadow-lg shadow-violet-300 hover:-translate-y-0.5 hover:shadow-violet-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? "Loading..." : "Start Interview"}
        </button>
      </div>
    </div>
  );
}