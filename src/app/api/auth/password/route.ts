import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { current, next } = await req.json();

  if (!current || current.length < 4) {
    return NextResponse.json(
      { success: false, message: "Current password is incorrect." },
      { status: 400 }
    );
  }

  if (next.length < 8) {
    return NextResponse.json(
      { success: false, message: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Password changed successfully!",
  });
}