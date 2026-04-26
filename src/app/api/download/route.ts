import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    profile: { name: "Ahmed Saleh", email: "ahmed.saleh@freelance.pro" },
    exportedAt: new Date().toISOString(),
  };

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=data.json",
    },
  });
}