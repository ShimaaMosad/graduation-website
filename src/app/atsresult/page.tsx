"use client";
import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
    Target,
  FileCheck,
  CheckCircle,
  Briefcase,
  Download,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

/* ================= REAL API RESPONSE ================= */

const apiResponse: APIResponse = {
  status: "success",
  data: {
    overall_score: 85,
    sections: {
      formatting: 90,
      keywords: 95,
      experience: 85,
      skills: 90,
      education: 70,
    },
    strengths: [
      "The resume clearly outlines relevant technical skills and experience with the MERN stack and cloud deployment.",
      "Quantifiable achievements are implicitly demonstrated through project descriptions and responsibilities.",
      "Strong emphasis on full-stack development capabilities and experience with RESTful APIs.",
      "Includes relevant certifications and personal projects that showcase practical application of skills.",
      "Clear and concise summary that highlights key proficiencies and experience level.",
    ],
    weaknesses: [
      "Education section indicates an expected graduation date, suggesting the candidate is still a student.",
      "Some project descriptions could benefit from quantifiable metrics to demonstrate impact.",
      "Experience section uses generic company names ('Freelance', 'Self-Employed') which could be further elaborated if possible.",
    ],
    recommendations: [
      "For the education section, consider adding a more specific graduation date or clarifying the expected graduation year for greater precision.",
      "To further strengthen the experience section, if possible, add details about the types of clients or projects undertaken during freelance work.",
      "Quantify achievements within project descriptions where possible.",
      "Consider adding a Contact Information section with LinkedIn and GitHub.",
      "Ensure keywords are naturally integrated within experience descriptions.",
    ],
    missing_keywords: [
      "CI/CD",
      "Docker",
      "Kubernetes",
      "Testing Frameworks (e.g., Jest, Mocha, Cypress)",
      "Agile Scrum",
      "Software Development Life Cycle (SDLC)",
      "Version Control (beyond Git/GitHub)",
    ],
  },
};

/* ================= PAGE ================= */

export default function ATSPage() {
  const { data } = apiResponse;
  
  // const [data, setData] = useState<APIResponse["data"] | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   async function fetchATS() {
  //     try {
  //       setLoading(true);
  //       setError(null);

  //       const res = await fetch("https://your-api.com/ats/analyze", {
  //         method: "GET", 
  //         headers: {
  //           "Content-Type": "application/json",
            
  //         },
  //       });

  //       if (!res.ok) {
  //         throw new Error("Failed to fetch ATS analysis");
  //       }

  //       const json: APIResponse = await res.json();
  //       setData(json.data);
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : "Something went wrong");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchATS();
  // }, []);

  // /* ================= STATES ================= */

  // if (loading) {
  //   return (
  //     <section className="py-20 flex justify-center text-gray-500">
  //       Analyzing your CV...
  //     </section>
  //   );
  // }

  // if (error) {
  //   return (
  //     <section className="py-20 flex justify-center text-red-500">
  //       {error}
  //     </section>
  //   );
  // }

  // if (!data) return null;



  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-12 px-6">

        <ATSHeader />

        {/* SCORE + SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ScoreCircle score={data.overall_score} />
          <AnalysisSummary sections={data.sections} />
        </div>

      {/* MISSING KEYWORDS */}
{data.missing_keywords && data.missing_keywords.length > 0 ? (
  <KeywordOptimization missingKeywords={data.missing_keywords} />
) : (
  <EmptyState
    title="Perfect Keyword Match"
    description="Your CV already contains all important ATS keywords."
    icon={ShieldCheck}
    tone="success"
  />
)}

{/* STRENGTHS */}
{data.strengths && data.strengths.length > 0 ? (
  <ExperienceAchievements strengths={data.strengths} />
) : (
  <EmptyState
    title="No Strengths Identified Yet"
    description="Try adding more detailed experience or skills to enhance your profile."
    icon={CheckCircle2}
    tone="success"
  />
)}

{/* WEAKNESSES */}
{data.weaknesses && data.weaknesses.length > 0 ? (
  <WeaknessesCard weaknesses={data.weaknesses} />
) : (
  <EmptyState
    title="No Major Weaknesses Detected"
    description="Your CV does not show critical weaknesses based on our analysis."
    icon={ShieldCheck}
    tone="warning"
  />
)}

{/* RECOMMENDATIONS */}
{data.recommendations && data.recommendations.length > 0 ? (
  <RecommendationsCard recommendations={data.recommendations} />
) : (
  <EmptyState
    title="No Recommendations Available"
    description="Your CV already meets most ATS requirements."
    icon={Lightbulb}
    tone="info"
  />
)}


    
      </div>
    </section>
  );
}

/* ================= HEADER ================= */

function ATSHeader() {
  return (
    <header className="h-[220px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl">
      <div className="h-full px-6 flex flex-col justify-between">
        <div className="flex justify-between items-center pt-6">
          <h1 className="text-xl font-bold">MySite</h1>
         <Link
            href="/"
            className="text-sm opacity-90 cursor-pointer hover:opacity-100 transition"
          >
            ← Back to Profile
          </Link>

        </div>

        <div className="flex flex-col items-center text-center pb-8">
          <FileCheck className="w-14 h-14 mb-3" />
          <h2 className="text-3xl font-bold">ATS Analysis Complete</h2>
          <p className="text-sm opacity-90">
            Your CV has been analyzed by our AI system
          </p>
        </div>
      </div>
    </header>
  );
}

/* ================= SCORE CIRCLE ================= */

function ScoreCircle({ score }: { score: number }) {
  const radius = 110;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-white rounded-2xl p-8 shadow flex flex-col items-center">
      <div className="relative w-[260px] h-[260px]">
        <svg className="w-full h-full">
          <circle
            cx="130"
            cy="130"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="18"
            fill="none"
          />
          <circle
            cx="130"
            cy="130"
            r={radius}
            stroke="#10B981"
            strokeWidth="18"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - (circumference * score) / 100
            }
            strokeLinecap="round"
            transform="rotate(-90 130 130)"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-green-500">
            {score}%
          </span>
          <span className="text-gray-500 mt-5">ATS Score</span>
        </div>
      </div>
    </div>
  );
}

/* ================= SUMMARY ================= */

function AnalysisSummary({ sections }: { sections: Sections }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow">
      <h2 className="text-2xl font-bold mb-6">Analysis Summary</h2>

      <div className="grid grid-cols-2 gap-6">
        <SummaryItem icon={Target} title={`${sections.keywords}%`} label="Keyword Match" />
        <SummaryItem icon={FileCheck} title={`${sections.formatting}%`} label="Format Quality" />
        <SummaryItem icon={CheckCircle} title={`${sections.skills}%`} label="Skills Score" />
        <SummaryItem icon={Briefcase} title={`${sections.experience}%`} label="Experience" />
         <SummaryItem icon={GraduationCap} title={`${sections.education}%`} label="Education" />
      </div>

      <button className="mt-8 w-full h-[48px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition flex items-center justify-center gap-2">
        <Download className="w-5 h-5" />
        Download Optimized CV
      </button>
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  title,
  label,
}: {
  icon: React.ElementType;
  title: string;
  label: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <Icon className="w-6 h-6 text-indigo-500 mb-2" />
<p className="text-2xl font-extrabold text-slate-800">
  {title}
</p>
<p className="text-xs uppercase tracking-wide text-slate-400">
  {label}
</p>
    </div>
  );
}
/* ================= KEYWORDS ================= */

function KeywordOptimization({ missingKeywords }: { missingKeywords: string[] }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow border-l-4 border-amber-500">
      <h3 className="text-xl font-bold mb-4 text-amber-700">Missing Keywords</h3>
      <div className="flex flex-wrap gap-3">
        {missingKeywords.map((word) => (
          <span
            key={word}
            className="px-4 py-1.5 rounded-full 
           bg-gradient-to-r from-amber-100 to-orange-100
           text-amber-800 text-sm font-medium
           shadow-sm"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ================= STRENGTHS ================= */

function ExperienceAchievements({ strengths }: { strengths: string[] }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow border-l-4 border-emerald-500">
      <h3 className="text-xl font-bold flex text-emerald-700 items-center gap-2 mb-4">
        <Briefcase className="w-6 h-6 text-emerald-600" />
        Strengths
      </h3>
      {strengths.map((item, i) => (
        <div
          key={i}
          className="relative flex gap-4 p-5 rounded-2xl 
               bg-gradient-to-r from-emerald-50 to-white
               border border-emerald-100
               text-emerald-800 text-sm"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>

          <div className="leading-relaxed">{item}</div>
        </div>
      ))}
    </div>
  );
}

/* ================= WEAKNESSES ================= */

function WeaknessesCard({ weaknesses }: { weaknesses: string[] }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow border-l-4 border-amber-500">
      <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-amber-700">
        <AlertTriangle className="w-6 h-6" />
        Weaknesses
      </h3>
      {weaknesses.map((item, i) => (
        <div
          key={i}
          className="flex gap-4 p-5 rounded-2xl 
               bg-gradient-to-r from-amber-50 to-white
               border border-amber-100
               text-amber-800 text-sm"
        >
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="leading-relaxed">{item}</div>
        </div>
      ))}
    </div>
  );
}

/* ================= RECOMMENDATIONS ================= */

function RecommendationsCard({ recommendations }: { recommendations: string[] }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow border-l-4 border-indigo-500">
      <h3 className="text-xl font-bold mb-4 text-indigo-700">
        Recommendations
      </h3>

      {recommendations.map((item, i) => (
        <div
          key={i}
          className="flex gap-4 p-5 rounded-2xl 
               bg-gradient-to-r from-indigo-50 to-white
               border border-indigo-100
               text-sm text-indigo-800"
        >
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-indigo-700" />
          </div>

          <div className="leading-relaxed">{item}</div>
        </div>
      ))}
    </div>
  );
}

/* ================= EMPTY STATE ================= */

function EmptyState({
  title,
  description,
  icon: Icon,
  tone,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  tone: "success" | "warning" | "info";
}) {
  const tones = {
    success: {
      border: "border-emerald-500",
      bg: "bg-emerald-50",
      icon: "bg-emerald-100 text-emerald-700",
      text: "text-emerald-800",
    },
    warning: {
      border: "border-amber-500",
      bg: "bg-amber-50",
      icon: "bg-amber-100 text-amber-700",
      text: "text-amber-800",
    },
    info: {
      border: "border-indigo-500",
      bg: "bg-indigo-50",
      icon: "bg-indigo-100 text-indigo-700",
      text: "text-indigo-800",
    },
  };

  const style = tones[tone];

  return (
    <div
      className={`bg-white rounded-2xl p-8 shadow border-l-4 ${style.border}`}
    >
      <div className="flex gap-4 items-start">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${style.icon}`}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div>
          <h3 className={`text-lg font-bold mb-1 ${style.text}`}>
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= TYPES ================= */

type APIResponse = {
  status: string;
  data: {
    overall_score: number;
    sections: Sections;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    missing_keywords: string[];
  };
};

type Sections = {
  formatting: number;
  keywords: number;
  experience: number;
  skills: number;
  education: number;
};
