// app/api/dashboard/route.ts
import { NextResponse } from "next/server";

// ── Raw DB types ──────────────────────────────────────────────────
export type UserType = "FREELANCER" | "CLIENT" | "PARTNER";
export type FlagSeverity = "URGENT" | "HIGH" | "MEDIUM";
export type FlagAction = "delete" | "hide" | "review";

export interface RawUser {
  id: string;
  name: string;
  email: string;
  type: UserType;
  registeredAt: string; // ISO-8601
  verified: boolean;
  active: boolean;
  hidden: boolean;
}

export interface RawGig {
  id: string;
  ownerId: string;
  active: boolean;
  hidden: boolean;
}

export interface RawTransaction {
  id: string;
  amountCents: number;
  month: string; // "Jan" | "Feb" …
  createdAt: string;
}

export interface RawFlaggedItem {
  id: string;
  title: string;
  refId: string;
  description: string;
  severity: FlagSeverity;
  type: "profile" | "gig" | "message";
  resolved: boolean;
  hidden: boolean;
  createdAt: string;
}

export interface RawDispute {
  id: string;
  resolved: boolean;
}

export interface RawMessage {
  id: string;
  read: boolean;
}

export interface RawFreelancer {
  id: string;
  name: string;
  title: string;
  earningsCents: number;
  rating: number;
  avatarGradient: string;
}

export interface SystemHealth {
  apiUptime: number;   // percent, e.g. 99.98
  cpuLoad: number;     // percent
  memoryGB: number;
  dbLatencyMs: number;
}

// ── In-memory "database" ──────────────────────────────────────────
const DB: {
  users: RawUser[];
  gigs: RawGig[];
  transactions: RawTransaction[];
  flagged: RawFlaggedItem[];
  disputes: RawDispute[];
  messages: RawMessage[];
  freelancers: RawFreelancer[];
  systemHealth: SystemHealth;
  prevMonthRevenueCents: number;
  prevMonthUsers: number;
} = {
  prevMonthRevenueCents: 7_500_000,
  prevMonthUsers: 43_120,

  systemHealth: {
    apiUptime: 99.98,
    cpuLoad: 42,
    memoryGB: 5.2,
    dbLatencyMs: 14,
  },

  users: [
    { id: "u1",  name: "Omar Hassan",     email: "omar.h@example.com",      type: "FREELANCER", registeredAt: new Date(Date.now() - 12 * 60_000).toISOString(),          verified: true,  active: true, hidden: false },
    { id: "u2",  name: "Sarah Johnson",   email: "s.johnson@workmail.com",   type: "CLIENT",     registeredAt: new Date(Date.now() - 45 * 60_000).toISOString(),          verified: false, active: true, hidden: false },
    { id: "u3",  name: "David Chen",      email: "dchen.dev@tech.io",        type: "FREELANCER", registeredAt: new Date(Date.now() - 60 * 60_000).toISOString(),          verified: true,  active: true, hidden: false },
    { id: "u4",  name: "Elena Rodriguez", email: "elena.r@designhub.com",    type: "FREELANCER", registeredAt: new Date(Date.now() - 3 * 60 * 60_000).toISOString(),      verified: false, active: true, hidden: false },
    { id: "u5",  name: "Marcus Wright",   email: "m.wright@global.net",      type: "CLIENT",     registeredAt: new Date(Date.now() - 5 * 60 * 60_000).toISOString(),      verified: false, active: true, hidden: false },
    { id: "u6",  name: "Lily Thompson",   email: "lily.t@artplace.org",      type: "FREELANCER", registeredAt: new Date(Date.now() - 24 * 60 * 60_000).toISOString(),     verified: true,  active: true, hidden: false },
    { id: "u7",  name: "James Bonden",    email: "j.bonden@data.ai",         type: "FREELANCER", registeredAt: new Date(Date.now() - 2 * 24 * 60 * 60_000).toISOString(), verified: true,  active: true, hidden: false },
    { id: "u8",  name: "Aisha Yusuf",     email: "aisha.y@connect.co",       type: "CLIENT",     registeredAt: new Date(Date.now() - 3 * 24 * 60 * 60_000).toISOString(), verified: false, active: true, hidden: false },
    // Partners / Internal
    { id: "u9",  name: "Internal Bot A",  email: "bot-a@mysite.internal",    type: "PARTNER",    registeredAt: new Date(Date.now() - 60 * 24 * 60 * 60_000).toISOString(), verified: true,  active: true, hidden: false },
    { id: "u10", name: "Internal Bot B",  email: "bot-b@mysite.internal",    type: "PARTNER",    registeredAt: new Date(Date.now() - 90 * 24 * 60 * 60_000).toISOString(), verified: true,  active: true, hidden: false },
  ],

  gigs: Array.from({ length: 12847 }, (_, i) => ({
    id: `g${i}`,
    ownerId: `u${(i % 10) + 1}`,
    active: i % 11 !== 0,
    hidden: false,
  })),

  transactions: [
    { id: "t1", amountCents: 3_800_000, month: "Jan", createdAt: "2024-01-15T00:00:00Z" },
    { id: "t2", amountCents: 5_200_000, month: "Feb", createdAt: "2024-02-15T00:00:00Z" },
    { id: "t3", amountCents: 4_600_000, month: "Mar", createdAt: "2024-03-15T00:00:00Z" },
    { id: "t4", amountCents: 6_100_000, month: "Apr", createdAt: "2024-04-15T00:00:00Z" },
    { id: "t5", amountCents: 7_500_000, month: "May", createdAt: "2024-05-15T00:00:00Z" },
    { id: "t6", amountCents: 8_800_000, month: "Jun", createdAt: "2024-06-15T00:00:00Z" },
  ],

  disputes: [
    { id: "d1", resolved: false },
    { id: "d2", resolved: false },
    { id: "d3", resolved: false },
    { id: "d4", resolved: false },
    { id: "d5", resolved: false },
    { id: "d6", resolved: false },
    { id: "d7", resolved: false },
  ],

  messages: Array.from({ length: 3720 }, (_, i) => ({
    id: `m${i}`,
    read: i >= 3492,
  })),

  flagged: [
    { id: "f1", title: "Fake Profile",       refId: "User ID: #8821",       description: "Suspicious activity detected.", severity: "URGENT", type: "profile", resolved: false, hidden: false, createdAt: new Date(Date.now() - 10 * 60_000).toISOString() },
    { id: "f2", title: "Inappropriate Gig",  refId: 'Gig: "Logo Design..."', description: "Image policy violation.",        severity: "HIGH",   type: "gig",     resolved: false, hidden: false, createdAt: new Date(Date.now() - 30 * 60_000).toISOString() },
    { id: "f3", title: "Spam Message",       refId: "Msg ID: #3341",         description: "Mass unsolicited messages.",    severity: "MEDIUM", type: "message", resolved: false, hidden: false, createdAt: new Date(Date.now() - 60 * 60_000).toISOString() },
    { id: "f4", title: "Fake Profile",       refId: "User ID: #9102",        description: "Duplicate account detected.",  severity: "URGENT", type: "profile", resolved: false, hidden: false, createdAt: new Date(Date.now() - 90 * 60_000).toISOString() },
    { id: "f5", title: "Inappropriate Gig",  refId: 'Gig: "Quick Fix..."',   description: "Terms of service violation.",  severity: "HIGH",   type: "gig",     resolved: false, hidden: false, createdAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString() },
    { id: "f6", title: "Payment Dispute",    refId: "Order #7722",           description: "Chargeback suspected.",         severity: "URGENT", type: "gig",     resolved: false, hidden: false, createdAt: new Date(Date.now() - 3 * 60 * 60_000).toISOString() },
    { id: "f7", title: "Misleading Listing", refId: 'Gig: "SEO Expert..."',  description: "False credentials claimed.",   severity: "HIGH",   type: "gig",     resolved: false, hidden: false, createdAt: new Date(Date.now() - 4 * 60 * 60_000).toISOString() },
    { id: "f8", title: "Spam Message",       refId: "Msg ID: #4410",         description: "Phishing link detected.",      severity: "URGENT", type: "message", resolved: false, hidden: false, createdAt: new Date(Date.now() - 5 * 60 * 60_000).toISOString() },
    { id: "f9", title: "Fake Review",        refId: "Review #221",           description: "Bot-generated review.",        severity: "HIGH",   type: "profile", resolved: false, hidden: false, createdAt: new Date(Date.now() - 6 * 60 * 60_000).toISOString() },
    { id: "f10", title: "Fake Profile",      refId: "User ID: #5501",        description: "Stolen identity detected.",    severity: "URGENT", type: "profile", resolved: false, hidden: false, createdAt: new Date(Date.now() - 7 * 60 * 60_000).toISOString() },
    { id: "f11", title: "Spam Message",      refId: "Msg ID: #8831",         description: "Repetitive spam content.",     severity: "MEDIUM", type: "message", resolved: false, hidden: false, createdAt: new Date(Date.now() - 8 * 60 * 60_000).toISOString() },
    { id: "f12", title: "Inappropriate Gig", refId: 'Gig: "Bulk Traffic..."', description: "Black-hat SEO offering.",     severity: "HIGH",   type: "gig",     resolved: false, hidden: false, createdAt: new Date(Date.now() - 9 * 60 * 60_000).toISOString() },
  ],

  freelancers: [
    { id: "fl1", name: "Alex Rivers",  title: "Illustrator",    earningsCents: 1_400_000, rating: 5.0, avatarGradient: "from-indigo-400 to-purple-500" },
    { id: "fl2", name: "Mia Volkov",   title: "Developer",      earningsCents: 2_200_000, rating: 4.9, avatarGradient: "from-rose-400 to-pink-500"    },
    { id: "fl3", name: "Samuel Lee",   title: "Motion Artist",  earningsCents: 1_800_000, rating: 5.0, avatarGradient: "from-sky-400 to-blue-500"     },
    { id: "fl4", name: "Zara Khalil",  title: "UX Designer",    earningsCents: 1_100_000, rating: 4.8, avatarGradient: "from-amber-400 to-orange-500" },
    { id: "fl5", name: "James Bonden", title: "Data Scientist", earningsCents: 2_900_000, rating: 5.0, avatarGradient: "from-teal-400 to-green-500"   },
    { id: "fl6", name: "Nina Patel",   title: "Copywriter",     earningsCents:   980_000, rating: 4.7, avatarGradient: "from-fuchsia-400 to-pink-500" },
    { id: "fl7", name: "Carlos Diaz",  title: "SEO Specialist", earningsCents: 1_250_000, rating: 4.8, avatarGradient: "from-lime-400 to-green-500"   },
    { id: "fl8", name: "Yuki Tanaka",  title: "3D Artist",      earningsCents: 1_650_000, rating: 5.0, avatarGradient: "from-cyan-400 to-blue-500"    },
    { id: "fl9", name: "Leila Souri",  title: "Marketer",       earningsCents:   870_000, rating: 4.6, avatarGradient: "from-red-400 to-rose-500"     },
    { id: "fl10", name: "Tom Bakker",  title: "Video Editor",   earningsCents: 2_050_000, rating: 4.9, avatarGradient: "from-violet-400 to-purple-500"},
  ],
};

// ── Helpers ───────────────────────────────────────────────────────
function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60)  return `${mins} Min Ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return hrs === 1 ? "1 Hour Ago" : `${hrs} Hours Ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days} Days Ago`;
}

function initials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function fmtUSD(cents: number): string {
  const d = cents / 100;
  if (d >= 1_000_000) return `$${(d / 1_000_000).toFixed(1)}M`;
  if (d >= 1_000)     return `$${(d / 1_000).toFixed(0)}k`;
  return `$${d.toFixed(0)}`;
}

function pctChange(current: number, previous: number): string {
  if (!previous) return "N/A";
  const p = ((current - previous) / previous) * 100;
  return `${p >= 0 ? "+" : ""}${p.toFixed(1)}%`;
}

// ── Core computation ──────────────────────────────────────────────
function computeDashboard() {
  const activeUsers     = DB.users.filter((u) => u.active && !u.hidden);
  const freelancers     = activeUsers.filter((u) => u.type === "FREELANCER");
  const clients         = activeUsers.filter((u) => u.type === "CLIENT");
  const partners        = activeUsers.filter((u) => u.type === "PARTNER");
  const verifiedUsers   = activeUsers.filter((u) => u.verified);
  const activeGigs      = DB.gigs.filter((g) => g.active && !g.hidden);
  const activeDisputes  = DB.disputes.filter((d) => !d.resolved);
  const unreadMessages  = DB.messages.filter((m) => !m.read);
  const activeFlagged   = DB.flagged.filter((f) => !f.resolved && !f.hidden);
  const newFlaggedCount = activeFlagged.length;

  // Revenue totals
  const currentMonthRevCents = DB.transactions.at(-1)?.amountCents ?? 0;
  const totalRevenueCents    = DB.transactions.reduce((s, t) => s + t.amountCents, 0);

  // Platform rating (computed from freelancer ratings)
  const avgRating = DB.freelancers.reduce((s, f) => s + f.rating, 0) / DB.freelancers.length;

  // Response time (simulated: based on unread ratio)
  const unreadRatio = unreadMessages.length / DB.messages.length;
  const responseTimeMin = Math.round(5 + unreadRatio * 30);

  // Read-rate percentage
  const readPct = Math.round(((DB.messages.length - unreadMessages.length) / DB.messages.length) * 100);

  // Growth data — derive growth % from month-over-month revenue change
  const growthData = DB.transactions.map((t, i) => {
    const prev = DB.transactions[i - 1]?.amountCents ?? t.amountCents;
    const growth = parseFloat(((t.amountCents - prev) / prev * 100).toFixed(1));
    return { month: t.month, revenue: t.amountCents / 100, growth: Math.max(0, growth) };
  });

  // User distribution %
  const total = activeUsers.length || 1;
  const distributionData = [
    { name: "Freelancers",         value: Math.round((freelancers.length / total) * 100), color: "#6366f1" },
    { name: "Clients",             value: Math.round((clients.length  / total) * 100), color: "#22c55e" },
    { name: "Internal/Partners",   value: Math.round((partners.length / total) * 100), color: "#e2e8f0" },
  ];

  // Stats cards
  const statsCards = [
    {
      label: "Total Users", value: activeUsers.length.toLocaleString(),
      change: pctChange(activeUsers.length, DB.prevMonthUsers),
      iconName: "Users", color: "text-blue-500", bg: "bg-blue-50", urgent: false,
    },
    {
      label: "Active Gigs", value: activeGigs.length.toLocaleString(),
      change: "+8.2%",
      iconName: "Briefcase", color: "text-blue-500", bg: "bg-blue-50", urgent: false,
    },
    {
      label: "Revenue", value: `$${(totalRevenueCents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      change: pctChange(currentMonthRevCents, DB.prevMonthRevenueCents),
      iconName: "DollarSign", color: "text-green-500", bg: "bg-green-50", urgent: false,
    },
    {
      label: "Active Disputes", value: String(activeDisputes.length),
      change: `+${activeDisputes.length}`,
      iconName: "AlertTriangle", color: "text-red-500", bg: "bg-red-50", urgent: true,
    },
    {
      label: "Platform Rating", value: avgRating.toFixed(2),
      change: `${(avgRating - 0.1).toFixed(1)} Avg`,
      iconName: "Star", color: "text-amber-500", bg: "bg-amber-50", urgent: false,
    },
    {
      label: "Avg. Response Time", value: `${responseTimeMin}m`,
      change: responseTimeMin < 20 ? "Fast" : "Moderate",
      iconName: "Clock", color: "text-blue-500", bg: "bg-blue-50", urgent: false,
    },
    {
      label: "New Messages", value: unreadMessages.length.toLocaleString(),
      change: `${readPct}%`,
      iconName: "MessageSquare", color: "text-purple-500", bg: "bg-purple-50", urgent: false,
    },
    {
      label: "Verified Pros", value: verifiedUsers.length.toLocaleString(),
      change: `+${verifiedUsers.length - 868}`,
      iconName: "BadgeCheck", color: "text-teal-500", bg: "bg-teal-50", urgent: false,
    },
  ];

  // Recent registrations (last 6, sorted newest first, not hidden)
  const recentRegistrations = [...activeUsers]
    .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
    .slice(0, 6)
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      joined: relativeTime(u.registeredAt),
      type: u.type as "FREELANCER" | "CLIENT" | "PARTNER",
      initials: initials(u.name),
      verified: u.verified,
    }));

  // Flagged items (unresolved, not hidden)
  const flaggedItems = activeFlagged.map((f) => ({
    id: f.id,
    title: f.title,
    refId: f.refId,
    description: f.description,
    severity: f.severity,
    type: f.type,
  }));

  // Top freelancers sorted by earnings
  const topFreelancers = [...DB.freelancers]
    .sort((a, b) => b.earningsCents - a.earningsCents)
    .map((f) => ({
      id: f.id,
      name: f.name,
      title: f.title,
      earned: fmtUSD(f.earningsCents),
      rating: f.rating,
      avatarGradient: f.avatarGradient,
      initials: initials(f.name),
    }));

  // System health
  const health = DB.systemHealth;

  return {
    statsCards,
    growthData,
    distributionData,
    recentRegistrations,
    flaggedItems,
    newFlaggedCount,
    topFreelancers,
    totalUsers: activeUsers.length,
    systemHealth: {
      apiStatus: `${health.apiUptime}%`,
      cpuLoad: `${health.cpuLoad}%`,
      memory: `${health.memoryGB}GB`,
      dbLatency: `${health.dbLatencyMs}ms`,
      cpuHealthy: health.cpuLoad < 75,
      memHealthy: health.memoryGB < 8,
      dbHealthy: health.dbLatencyMs < 50,
    },
  };
}

// ── GET /api/dashboard ────────────────────────────────────────────
export async function GET() {
  return NextResponse.json(computeDashboard());
}

// ── POST /api/dashboard — handle mutations ────────────────────────
export interface DashboardAction {
  type: "resolve_flag" | "hide_flag" | "review_flag" | "resolve_dispute" | "hide_user";
  id: string;
}

export async function POST(request: Request) {
  let body: DashboardAction;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON" }, { status: 400 });
  }

  const { type, id } = body;
  if (!type || !id) {
    return NextResponse.json({ success: false, message: "Missing type or id" }, { status: 400 });
  }

  switch (type) {
    case "resolve_flag": {
      const item = DB.flagged.find((f) => f.id === id);
      if (!item) return NextResponse.json({ success: false, message: "Flag not found" }, { status: 404 });
      item.resolved = true;
      break;
    }
    case "hide_flag": {
      const item = DB.flagged.find((f) => f.id === id);
      if (!item) return NextResponse.json({ success: false, message: "Flag not found" }, { status: 404 });
      item.hidden = true;
      break;
    }
    case "review_flag": {
      // mark as reviewed (no state change — just acknowledge)
      break;
    }
    case "resolve_dispute": {
      const d = DB.disputes.find((x) => x.id === id);
      if (!d) return NextResponse.json({ success: false, message: "Dispute not found" }, { status: 404 });
      d.resolved = true;
      break;
    }
    case "hide_user": {
      const u = DB.users.find((x) => x.id === id);
      if (!u) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
      u.hidden = true;
      break;
    }
    default:
      return NextResponse.json({ success: false, message: "Unknown action type" }, { status: 400 });
  }

  return NextResponse.json({ success: true, type, id, freshData: computeDashboard() });
}