import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { sessionId } = await req.json();

  return NextResponse.json({
    success: true,
    message: `Session ${sessionId} revoked`,
  });
}