"use client";

import { cn } from "../lib/Utils";
import { useRouter } from "next/navigation";
import { InterviewResults, SkillResult } from "../types/interview";

interface ResultsPageProps {
  results: InterviewResults;
  onGoToInterview: () => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const halfFilled = !filled && rating >= star - 0.5;
        return (
          <svg key={star} width="20" height="20" viewBox="0 0 24 24">
            {halfFilled ? (
              <>
                <defs>
                  <linearGradient id={`half-${star}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="50%" stopColor="#FBBF24" />
                    <stop offset="50%" stopColor="#D1D5DB" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={`url(#half-${star})`}
                />
              </>
            ) : (
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={filled ? "#FBBF24" : "#D1D5DB"}
              />
            )}
          </svg>
        );
      })}
      <span className="ml-1 text-gray-600 font-medium text-sm">{rating.toFixed(1)}</span>
    </div>
  );
}

function CircularScore({ score, label }: { score: number; label: string }) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 5) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-[220px] h-[220px] flex items-center justify-center">
        <svg width="220" height="220" className="-rotate-90">
          {/* Background ring */}
          <circle
            cx="110" cy="110" r={radius}
            fill="none" stroke="#E5E7EB" strokeWidth="12"
          />
          {/* Progress ring */}
          <circle
            cx="110" cy="110" r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold text-gray-800">{score.toFixed(1)}</span>
          <span className="text-gray-400 text-sm">/ 5.0</span>
        </div>
      </div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
    </div>
  );
}

function SkillCard({ result }: { result: SkillResult }) {
  const levelColors: Record<string, string> = {
    Expert: "bg-green-100 text-green-700",
    Advanced: "bg-blue-100 text-blue-700",
    Intermediate: "bg-orange-100 text-orange-700",
    Beginner: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 text-base">{result.skillName}</h3>
          <StarRating rating={result.rating} />
        </div>
        {result.isVerified && (
          <span
            className="flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-full"
            style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                fill="white" opacity="0.8"
              />
            </svg>
            AI Verified
          </span>
        )}
      </div>

      {/* Proficiency bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm text-gray-500 font-medium">Proficiency Score</span>
          <span className="text-sm font-semibold text-gray-700">{result.proficiencyScore}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${result.proficiencyScore}%`,
              backgroundColor: result.barColor,
            }}
          />
        </div>
      </div>

      {/* Level badge */}
      <span
        className={cn(
          "inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-4",
          levelColors[result.level] ?? "bg-gray-100 text-gray-600"
        )}
      >
        {result.level}
      </span>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100 mb-4">
        <div>
          <p className="text-sm text-gray-400 mb-0.5">Questions</p>
          <p className="font-semibold text-gray-800">{result.questionsTotal}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-0.5">Correct</p>
          <p className="font-semibold text-gray-800">{result.questionsCorrect}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-0.5">Time</p>
          <p className="font-semibold text-gray-800">{result.timeTaken}</p>
        </div>
      </div>

      {/* Strengths */}
      {result.strengths.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-semibold text-gray-800 text-sm">Strengths:</span>
          </div>
          <ul className="space-y-1.5 ml-1">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Areas to Improve */}
      {result.improvements.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full border-2 border-orange-400 flex items-center justify-center">
              <span className="text-orange-400 text-xs font-bold leading-none">!</span>
            </div>
            <span className="font-semibold text-gray-800 text-sm">Areas to Improve:</span>
          </div>
          <ul className="space-y-1.5 ml-1">
            {result.improvements.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ResultsPage({ results, onGoToInterview }: ResultsPageProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero banner */}
      <div
        className="relative flex flex-col items-center justify-center py-16 px-6 text-white text-center"
        style={{
          background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 50%, #818CF8 100%)",
          minHeight: "280px",
        }}
      >
        {/* Check circle */}
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4 shadow-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2">Verification Complete!</h1>
        <p className="text-white/85 text-base mb-1">
          Congratulations! You&apos;ve successfully completed the AI skill verification
        </p>
        <p className="text-white font-semibold text-lg">{results.candidateName}</p>
      </div>

      {/* Main content */}
      <div className="max-w-[900px] mx-auto px-6 py-10">
        {/* Score circle */}
        <div className="flex flex-col items-center mb-10">
          <CircularScore score={results.overallRating} label="Overall Performance Rating" />

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-12 mt-8 text-center">
            <div>
              <p className="text-purple-600 font-bold text-3xl">{results.skillsVerified}</p>
              <p className="text-gray-500 text-sm mt-1">Skills Verified</p>
            </div>
            <div>
              <p className="text-purple-600 font-bold text-3xl">{results.averageScore}%</p>
              <p className="text-gray-500 text-sm mt-1">Average Score</p>
            </div>
            <div>
              <p className="text-purple-600 font-bold text-3xl">{results.totalTimeTaken}</p>
              <p className="text-gray-500 text-sm mt-1">Time Taken</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-8" />

        {/* Skill breakdown */}
        <h2 className="text-gray-800 font-semibold text-lg mb-5">
          Skill-by-Skill Breakdown
        </h2>
        <div className="flex flex-col gap-5">
          {results.skillResults.map((result) => (
            <SkillCard key={result.skillName} result={result} />
          ))}
        </div>

        {/* Verified CTA card */}
        <div
          className="mt-10 rounded-2xl p-8 text-center"
          style={{ background: "#F5F3FF", border: "1px solid #EDE9FE" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 3l18 18M10.5 10.677a2 2 0 102.823-2.823" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7.362 7.561C5.68 8.74 4.5 10.495 4.5 12c0 4.5 7.5 8 7.5 8s7.5-3.5 7.5-8c0-3-2-5.5-5-6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="font-bold text-gray-800 text-base mb-1">
            Your Skills Are Now Verified!
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Your verified skills are visible to clients and will help you stand out
          </p>

          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90"
              style={{ background: "#0A66C2" }}
              onClick={() => window.open("https://linkedin.com", "_blank")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2" fill="white"/>
              </svg>
              Share on LinkedIn
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90"
              style={{ background: "#1DA1F2" }}
              onClick={() => window.open("https://twitter.com", "_blank")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
              Share on Twitter
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-8 py-3.5 rounded-2xl font-semibold text-white text-sm transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" }}
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push("/ai-interview")}
            className="px-8 py-3.5 rounded-2xl font-semibold text-purple-600 text-sm border-2 border-purple-600 hover:bg-purple-50 transition-all"
          >
            Add More Skills
          </button>
        </div>

        {/* Download certificate */}
        <div className="text-center mt-5">
          <button
            className="text-purple-600 font-medium text-sm flex items-center gap-2 mx-auto hover:text-purple-700 transition-colors"
            onClick={() => alert("Certificate download would be triggered here")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
}