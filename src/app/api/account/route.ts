import { NextResponse } from "next/server";

export async function DELETE() {
  return NextResponse.json({ success: true, message: "Account deleted" });
}