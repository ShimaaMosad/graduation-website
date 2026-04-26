import { NextResponse } from "next/server";

let profile = {
  fullName: "Ahmed Saleh",
  displayName: "ahmed_pro",
  email: "ahmed.saleh@freelance.pro",
  phone: "+1 (555) 000-1234",
  dob: "1992-05-15",
  gender: "Male",
  location: "Dubai, UAE",
  timezone: "GMT +04:00 (Dubai)",
  bio: "Senior Full-Stack Developer...",
  hourlyRate: "85",
  languages: ["English", "Arabic"],
  avatar: "",
};

export async function GET() {
  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  const body = await req.json();
  profile = { ...profile, ...body };
  return NextResponse.json({ success: true, profile });
}