// ============================================================
// Interview Types
// ============================================================

export interface Skill {
  id: string;
  name: string;
  status: "pending" | "active" | "completed";
}

export interface Question {
  id: string;
  skill: string;
  skillId: string;
  question: string;
  answer: string;
  timeSpent?: number; // seconds
}

export interface InterviewData {
  interviewId: string;
  candidateName: string;
  skills: Skill[];
  questions: Question[];
  totalDuration: number; // seconds per question
}

export interface SkillResult {
  skillName: string;
  rating: number; // 0-5
  proficiencyScore: number; // 0-100
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  questionsTotal: number;
  questionsCorrect: number;
  timeTaken: string; // "8:32"
  strengths: string[];
  improvements: string[];
  barColor: string; // tailwind color
  isVerified: boolean;
}

export interface InterviewResults {
  overallRating: number; // 0-5
  averageScore: number; // percentage
  skillsVerified: number;
  totalTimeTaken: string;
  skillResults: SkillResult[];
  cameraAnalysis: CameraAnalysisResult[];
  finalScore: string; // "4.3 / 5.0"
  candidateName: string;
}

export interface CameraAnalysisResult {
  timestamp: number;
  behavior: "attentive" | "looking_away" | "absent" | "suspicious";
  confidence: number;
}

export interface QAEntry {
  question: string;
  answer: string;
  skill: string;
}

export interface SpeechState {
  isSpeaking: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
}