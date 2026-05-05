import type { Metadata } from "next";
import { AIInterviewClient } from "./components/AIInterviewClient";

export const metadata: Metadata = {
  title: "AI Skill Verification Interview | MySite",
  description: "Complete your AI-powered skill verification interview",
};

export default function AIInterviewPage() {
  return <AIInterviewClient />;
}