// lib/profileSetupApi.ts

export type Skill = {
  id: number;
  name: string;
  selected: boolean;
};

export type LanguageItem = {
  id: number;
  language: string;
  level: string;
};

export type SocialLinks = {
  linkedin: string;
  github: string;
  portfolio: string;
  twitter: string;
};

export type ProfileSetupData = {
  fullName: string;
  profileStrength: number;
  professionalTitle: string;
  hourlyRate: string;
  location: string;
  bio: string;
  skills: Skill[];
  languages: LanguageItem[];
  socialLinks: SocialLinks;
};

/*
================ REAL BACKEND READY ================

GET /api/profile-setup
POST /api/profile-setup/draft
POST /api/profile-setup/continue
POST /api/profile-setup/generate-bio

Expected GET response:
{
  fullName: string,
  profileStrength: number,
  professionalTitle: string,
  hourlyRate: string,
  location: string,
  bio: string,
  skills: Skill[],
  languages: LanguageItem[],
  socialLinks: {
    linkedin: string,
    github: string,
    portfolio: string,
    twitter: string
  }
}

====================================================
*/

export const mockProfileSetupData: ProfileSetupData = {
  fullName: "Ahmed",
  profileStrength: 60,
  professionalTitle: "Senior UX/UI Designer",
  hourlyRate: "45",
  location: "Cairo, Egypt",
  bio: "",
  skills: [
    { id: 1, name: "UI Design", selected: true },
    { id: 2, name: "UX Research", selected: true },
    { id: 3, name: "Figma", selected: true },
    { id: 4, name: "Prototyping", selected: false },
    { id: 5, name: "Wireframing", selected: false },
    { id: 6, name: "Web Design", selected: false },
  ],
  languages: [
    { id: 1, language: "Arabic", level: "Native or Bilingual" },
    { id: 2, language: "English", level: "Fluent" },
  ],
  socialLinks: {
    linkedin: "",
    github: "",
    portfolio: "",
    twitter: "",
  },
};

export async function getProfileSetupData(): Promise<ProfileSetupData> {
  // REAL API:
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile-setup`);
  // if (!res.ok) throw new Error("Failed to fetch profile setup data");
  // return res.json();

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProfileSetupData), 300);
  });
}

export async function saveProfileDraft(data: ProfileSetupData) {
  // REAL API:
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile-setup/draft`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error("Failed to save draft");
  // return res.json();

  console.log("Draft saved:", data);
  return { success: true, message: "Draft saved successfully" };
}

export async function submitProfileStep(data: ProfileSetupData) {
  // REAL API:
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile-setup/continue`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error("Failed to submit profile step");
  // return res.json();

  console.log("Profile submitted:", data);
  return { success: true, nextStep: "/preferences" };
}

export async function generateBioWithAI(title: string, skills: string[]) {
  // REAL API:
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile-setup/generate-bio`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ title, skills }),
  // });
  // if (!res.ok) throw new Error("Failed to generate bio");
  // return res.json();

  return `I am a ${title} with strong experience in ${skills.join(
    ", "
  )}. I create clean, user-friendly digital products focused on usability, visual consistency, and business goals.`;
}