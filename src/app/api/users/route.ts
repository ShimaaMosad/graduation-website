import { NextRequest, NextResponse } from "next/server";

export type Status = "Active" | "Pending" | "Suspended";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: Status;
  joinedMonth: string;
  initials: string;
  color: string;
  location: string;
  memberSince: string;
  lastLogin: string;
  jobSuccess: number;
  totalEarned: string;
  verified: boolean;
  twoFactor: boolean;
  identityVerified: boolean;
  plan: string;
}

// ── In-memory DB (replace with your real DB) ──────────────────────
let users: User[] = [
  {
    id: 1,
    name: "Ahmed Saleh",
    email: "ahmed.s@example.com",
    role: "Senior Freelancer",
    status: "Active",
    joinedMonth: "Oct",
    initials: "AS",
    color: "bg-indigo-500",
    location: "Dubai, UAE",
    memberSince: "October 24, 2023",
    lastLogin: "2 hours ago",
    jobSuccess: 98,
    totalEarned: "$12.4k",
    verified: true,
    twoFactor: true,
    identityVerified: true,
    plan: "Pro Plus",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@techcorp.com",
    role: "Enterprise Client",
    status: "Active",
    joinedMonth: "Nov",
    initials: "SJ",
    color: "bg-rose-500",
    location: "New York, USA",
    memberSince: "November 5, 2023",
    lastLogin: "1 day ago",
    jobSuccess: 94,
    totalEarned: "$8.1k",
    verified: true,
    twoFactor: false,
    identityVerified: true,
    plan: "Enterprise",
  },
  {
    id: 3,
    name: "Omar Hassan",
    email: "omar.h@studio.io",
    role: "UX Designer",
    status: "Pending",
    joinedMonth: "Dec",
    initials: "OH",
    color: "bg-amber-500",
    location: "Cairo, Egypt",
    memberSince: "December 12, 2023",
    lastLogin: "5 hours ago",
    jobSuccess: 88,
    totalEarned: "$3.2k",
    verified: false,
    twoFactor: true,
    identityVerified: false,
    plan: "Pro",
  },
  {
    id: 4,
    name: "Elena Fischer",
    email: "e.fischer@media.net",
    role: "Photographer",
    status: "Suspended",
    joinedMonth: "Jan",
    initials: "EF",
    color: "bg-gray-400",
    location: "Berlin, Germany",
    memberSince: "January 3, 2024",
    lastLogin: "3 days ago",
    jobSuccess: 76,
    totalEarned: "$5.7k",
    verified: true,
    twoFactor: false,
    identityVerified: true,
    plan: "Basic",
  },
  {
    id: 5,
    name: "Liam Moore",
    email: "liam.m@code.com",
    role: "DevOps Specialist",
    status: "Active",
    joinedMonth: "Feb",
    initials: "LM",
    color: "bg-teal-500",
    location: "London, UK",
    memberSince: "February 18, 2024",
    lastLogin: "30 minutes ago",
    jobSuccess: 99,
    totalEarned: "$21.0k",
    verified: true,
    twoFactor: true,
    identityVerified: true,
    plan: "Pro Plus",
  },
  {
    id: 6,
    name: "Isabella Chen",
    email: "i.chen@design.org",
    role: "Art Director",
    status: "Active",
    joinedMonth: "Feb",
    initials: "IC",
    color: "bg-purple-500",
    location: "Singapore",
    memberSince: "February 28, 2024",
    lastLogin: "4 hours ago",
    jobSuccess: 96,
    totalEarned: "$15.3k",
    verified: true,
    twoFactor: true,
    identityVerified: true,
    plan: "Pro Plus",
  },
];

// ── GET /api/users ─────────────────────────────────────────────────
// Query params: search, role, status
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const role = searchParams.get("role") ?? "All Roles";
  const status = searchParams.get("status") ?? "Active Status";

  let result = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search);
    const matchRole =
      role === "All Roles" || u.role.toLowerCase().includes(role.toLowerCase());
    const matchStatus = status === "Active Status" || u.status === status;
    return matchSearch && matchRole && matchStatus;
  });

  // Derived stats from full user list (not filtered)
  const total = users.length;
  const freelancers = users.filter((u) =>
    ["Freelancer", "Designer", "Photographer", "Specialist", "Director"].some(
      (kw) => u.role.includes(kw)
    )
  ).length;
  const clients = users.filter((u) => u.role.toLowerCase().includes("client")).length;

  return NextResponse.json({
    users: result,
    stats: {
      total,
      freelancers,
      clients,
    },
  });
}

// ── PATCH /api/users ───────────────────────────────────────────────
// Body: { ids: number[], action: "Suspend" | "Approve" | "SendEmail" }
// or:   { id: number, data: Partial<User> }   (single edit)
export async function PATCH(req: NextRequest) {
  const body = await req.json();

  // Batch action
  if (body.ids && body.action) {
    const { ids, action } = body as { ids: number[]; action: string };

    if (action === "Suspend") {
      users = users.map((u) =>
        ids.includes(u.id) ? { ...u, status: "Suspended" as Status } : u
      );
      return NextResponse.json({ ok: true, message: `Suspended ${ids.length} user(s)` });
    }

    if (action === "Approve") {
      users = users.map((u) =>
        ids.includes(u.id) ? { ...u, status: "Active" as Status } : u
      );
      return NextResponse.json({ ok: true, message: `Approved ${ids.length} user(s)` });
    }

    if (action === "Send Email") {
      // Integrate your email service here (e.g. Resend, SendGrid)
      return NextResponse.json({ ok: true, message: `Email sent to ${ids.length} user(s)` });
    }

    return NextResponse.json({ ok: false, message: "Unknown action" }, { status: 400 });
  }

  // Single user edit
  if (body.id && body.data) {
    const { id, data } = body as { id: number; data: Partial<User> };
    users = users.map((u) => (u.id === id ? { ...u, ...data } : u));
    const updated = users.find((u) => u.id === id);
    return NextResponse.json({ ok: true, user: updated });
  }

  return NextResponse.json({ ok: false, message: "Invalid request body" }, { status: 400 });
}

// ── DELETE /api/users ──────────────────────────────────────────────
// Body: { ids: number[] }
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { ids } = body as { ids: number[] };
  const before = users.length;
  users = users.filter((u) => !ids.includes(u.id));
  return NextResponse.json({ ok: true, deleted: before - users.length });
}