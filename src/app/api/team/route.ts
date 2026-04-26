// app/api/team/route.ts
import { NextResponse } from "next/server";

let team = [
  { name: "Ahmed Hassan", avatar: "AH", role: "Lead Designer", isLead: true },
  { name: "Lina Samir", avatar: "LS", role: "Illustrator", isLead: false },
];

export async function GET() {
  return NextResponse.json(team);
}
export async function POST(req: Request) {
  const body = await req.json();

  const newMember = {
    name: body.name,
    avatar: body.avatar,
    role: body.role,
    isLead: false,
  };

  team.push(newMember);

  return NextResponse.json(newMember);
}export async function DELETE(req: Request) {
  const { index } = await req.json();

  team = team.filter((_, i) => i !== index);

  return NextResponse.json({ success: true });
}