export type VerifyData = {
  legalName: string;
  country: string;
  documentType: string;
  documentNumber: string;
  frontIdFileName: string;
  backIdFileName: string;
  selfieFileName: string;
  consent: boolean;
};

export const mockVerifyData: VerifyData = {
  legalName: "Ahmed Samir",
  country: "Egypt",
  documentType: "",
  documentNumber: "",
  frontIdFileName: "",
  backIdFileName: "",
  selfieFileName: "",
  consent: false,
};

/*
REAL BACKEND READY

GET /api/verify
POST /api/verify/draft
POST /api/verify/submit

*/

export async function getVerifyData(): Promise<VerifyData> {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify`);
  // if (!res.ok) throw new Error("Failed to fetch verify data");
  // return res.json();

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockVerifyData), 300);
  });
}

export async function saveVerifyDraft(data: VerifyData) {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify/draft`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error("Failed to save verification draft");
  // return res.json();

  console.log("Verify draft:", data);
  return { success: true };
}

export async function submitVerify(data: VerifyData) {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify/submit`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error("Failed to submit verification");
  // return res.json();

  console.log("Verify submitted:", data);
  return { success: true, status: "pending_review" };
}