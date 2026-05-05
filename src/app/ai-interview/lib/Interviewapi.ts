import type {
  InterviewData,
  InterviewResults,
  QAEntry,
  SkillResult,
}  from "../types/interview";

// ============================================================
// Base API URL — set via environment variable


// ============================================================
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

// ============================================================
// Fetch interview skills + questions
// Replace mock with: const res = await fetch(`${API_BASE}/api/interview/start`);
// ============================================================
export async function fetchInterviewData(): Promise<InterviewData> {
  // ---------- MOCK (remove when backend is ready) ----------
  await new Promise((r) => setTimeout(r, 1400));

  return {
    interviewId: "iv_" + Math.random().toString(36).slice(2, 9),
    candidateName: "Ahmed Saleh",
    totalDuration: 120, // seconds per question
    skills: [
      { id: "js", name: "JavaScript", status: "pending" },
      { id: "react", name: "React.js", status: "pending" },
      { id: "node", name: "Node.js", status: "pending" },
      { id: "mongo", name: "MongoDB", status: "pending" },
    ],
    questions: [
      {
        id: "q1",
        skill: "JavaScript",
        skillId: "js",
        question:
          "Can you explain the difference between var, let, and const in JavaScript?",
        answer: "",
      },
      {
        id: "q2",
        skill: "JavaScript",
        skillId: "js",
        question: "What is event delegation and how does it work?",
        answer: "",
      },
      {
        id: "q3",
        skill: "JavaScript",
        skillId: "js",
        question: "Describe closures in JavaScript with a practical example.",
        answer: "",
      },
      {
        id: "q4",
        skill: "React.js",
        skillId: "react",
        question:
          "Explain the concept of React Hooks and how they differ from class components.",
        answer: "",
      },
      {
        id: "q5",
        skill: "React.js",
        skillId: "react",
        question:
          "What is the virtual DOM and how does React use it for performance?",
        answer: "",
      },
      {
        id: "q6",
        skill: "React.js",
        skillId: "react",
        question:
          "How do you manage state across components in a large React application?",
        answer: "",
      },
      {
        id: "q7",
        skill: "Node.js",
        skillId: "node",
        question:
          "Explain the event loop in Node.js and how asynchronous operations work.",
        answer: "",
      },
      {
        id: "q8",
        skill: "Node.js",
        skillId: "node",
        question:
          "What is middleware in Express.js? Give some common use cases.",
        answer: "",
      },
      {
        id: "q9",
        skill: "MongoDB",
        skillId: "mongo",
        question:
          "What is the difference between SQL and NoSQL databases? When would you choose MongoDB?",
        answer: "",
      },
      {
        id: "q10",
        skill: "MongoDB",
        skillId: "mongo",
        question:
          "Explain MongoDB aggregation pipelines and when you would use them.",
        answer: "",
      },
    ],
  };
  // ---------- END MOCK ----------

  // Real implementation:
  // const res = await fetch(`${API_BASE}/api/interview/start`, { cache: "no-store" });
  // if (!res.ok) throw new Error("Failed to fetch interview data");
  // return res.json();
}

// ============================================================
// Submit answers + receive results
// ============================================================
export async function submitInterviewAnswers(
  interviewId: string,
  answers: QAEntry[]
): Promise<InterviewResults> {
  // ---------- MOCK ----------
  await new Promise((r) => setTimeout(r, 1200));

  const skillMap: Record<string, QAEntry[]> = {};
  answers.forEach((a) => {
    if (!skillMap[a.skill]) skillMap[a.skill] = [];
    skillMap[a.skill].push(a);
  });

  const skillResultsData: Record<
    string,
    Omit<SkillResult, "skillName" | "isVerified">
  > = {
    JavaScript: {
      rating: 4.3,
      proficiencyScore: 87,
      level: "Advanced",
      questionsTotal: 3,
      questionsCorrect: 3,
      timeTaken: "7:45",
      strengths: [
        "Solid grasp of ES6+ features",
        "Good understanding of async/await",
        "Strong problem-solving approach",
      ],
      improvements: [
        "Deepen knowledge of prototypal inheritance",
        "Explore more advanced closure patterns",
      ],
      barColor: "#3B82F6",
    },
    "React.js": {
      rating: 4.5,
      proficiencyScore: 92,
      level: "Expert",
      questionsTotal: 3,
      questionsCorrect: 3,
      timeTaken: "8:32",
      strengths: [
        "Excellent understanding of hooks lifecycle",
        "Strong knowledge of component optimization",
        "Clear explanation of virtual DOM concepts",
      ],
      improvements: ["Consider exploring custom hooks patterns"],
      barColor: "#10B981",
    },
    "Node.js": {
      rating: 4.0,
      proficiencyScore: 82,
      level: "Advanced",
      questionsTotal: 2,
      questionsCorrect: 2,
      timeTaken: "6:15",
      strengths: [
        "Good understanding of event loop",
        "Clear explanation of middleware",
      ],
      improvements: [
        "Explore streams and buffers more deeply",
        "Study cluster module for scaling",
      ],
      barColor: "#10B981",
    },
    MongoDB: {
      rating: 3.8,
      proficiencyScore: 76,
      level: "Intermediate",
      questionsTotal: 2,
      questionsCorrect: 2,
      timeTaken: "8:55",
      strengths: [
        "Basic CRUD operations mastered",
        "Understanding of document structure",
      ],
      improvements: [
        "Learn more about aggregation pipelines",
        "Study indexing strategies",
        "Practice with complex queries",
      ],
      barColor: "#F97316",
    },
  };

  const skillResults: SkillResult[] = Object.keys(skillResultsData).map(
    (name) => ({
      skillName: name,
      isVerified: true,
      ...skillResultsData[name],
    })
  );

  const avgScore = Math.round(
    skillResults.reduce((s, r) => s + r.proficiencyScore, 0) /
      skillResults.length
  );
  const overallRating =
    Math.round(
      (skillResults.reduce((s, r) => s + r.rating, 0) / skillResults.length) *
        10
    ) / 10;

  return {
    overallRating,
    averageScore: avgScore,
    skillsVerified: skillResults.length,
    totalTimeTaken: "42 min",
    skillResults,
    cameraAnalysis: [],
    finalScore: `${overallRating} / 5.0`,
    candidateName: "Ahmed Saleh",
  };
  // ---------- END MOCK ----------

  // Real:
  // const res = await fetch(`${API_BASE}/api/interview/submit`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ interviewId, answers }),
  // });
  // return res.json();
}

// ============================================================
// Send camera snapshot for AI analysis
// ============================================================
export async function sendCameraSnapshot(
  interviewId: string,
  imageBase64: string,
  questionContext: string
): Promise<{ behavior: string; confidence: number }> {
  // ---------- MOCK ----------
  const behaviors = [
    "attentive",
    "attentive",
    "attentive",
    "looking_away",
    "attentive",
  ];
  return {
    behavior: behaviors[Math.floor(Math.random() * behaviors.length)],
    confidence: 0.85 + Math.random() * 0.15,
  };
  // ---------- END MOCK ----------

  // Real:
  // const res = await fetch(`${API_BASE}/api/interview/analyze-frame`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ interviewId, image: imageBase64, context: questionContext }),
  // });
  // return res.json();
}