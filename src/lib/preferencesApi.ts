export type PreferenceData = {
  categories: string[];
  projectTypes: string[];
  availability: string;
  experienceLevel: string;
  minBudget: string;
  maxBudget: string;
  workMode: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
};

export const mockPreferencesData: PreferenceData = {
  categories: ["Web Design", "UI/UX Design"],
  projectTypes: ["Fixed Price"],
  availability: "",
  experienceLevel: "",
  minBudget: "",
  maxBudget: "",
  workMode: "",
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
};

/*
REAL BACKEND READY

GET /api/preferences
POST /api/preferences/draft
POST /api/preferences/continue

*/

export async function getPreferencesData(): Promise<PreferenceData> {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preferences`);
  // if (!res.ok) throw new Error("Failed to fetch preferences");
  // return res.json();

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPreferencesData), 300);
  });
}

export async function savePreferencesDraft(data: PreferenceData) {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preferences/draft`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error("Failed to save draft");
  // return res.json();

  console.log("Preferences draft:", data);
  return { success: true };
}

export async function submitPreferences(data: PreferenceData) {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preferences/continue`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error("Failed to submit preferences");
  // return res.json();

  console.log("Preferences submitted:", data);
  return { success: true, nextStep: "/verify" };
}