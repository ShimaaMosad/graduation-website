// app/api/financials/route.ts
import { NextResponse } from "next/server";

// ── Types ─────────────────────────────────────────────────────────
export type RiskLevel = "LOW" | "HIGH RISK";
export type TxAction = "Review" | "Flag" | "Dismiss" | "Freeze Account";

interface RawTransaction {
  id: string;
  sender: string;
  receiver: string;
  amountCents: number;
  timestamp: string; // ISO-8601
  paymentMethod: "credit_card" | "crypto" | "bank_wire";
  senderInitials: string;
  flagged: boolean;
  frozen: boolean;
  reviewed: boolean;
}

interface RawEarner {
  name: string;
  earningsCents: number;
  category: string;
  avatarColor: string; // Tailwind bg- class
}

// ── In-memory "database" (swap for real DB in production) ─────────
const DB: {
  transactions: RawTransaction[];
  earners: RawEarner[];
  prevMonthVolumeCents: number;
  prevMonthRevenueCents: number;
} = {
  prevMonthVolumeCents: 252_455_200,
  prevMonthRevenueCents: 39_365_000,

  transactions: [
    {
      id: "#TX-94021", sender: "Sarah J.", receiver: "Ahmed S.",
      amountCents: 245000, timestamp: "2024-10-24T14:20:00Z",
      paymentMethod: "credit_card", senderInitials: "SJ",
      flagged: false, frozen: false, reviewed: false,
    },
    {
      id: "#TX-94022", sender: "Unknown", receiver: "@john_fake",
      amountCents: 1200000, timestamp: "2024-10-24T14:18:00Z",
      paymentMethod: "crypto", senderInitials: "?",
      flagged: true, frozen: false, reviewed: false,
    },
    {
      id: "#TX-94023", sender: "Michael L.", receiver: "DevCorp",
      amountCents: 84000, timestamp: "2024-10-24T14:15:00Z",
      paymentMethod: "credit_card", senderInitials: "ML",
      flagged: false, frozen: false, reviewed: false,
    },
    {
      id: "#TX-94024", sender: "Anna K.", receiver: "PixelStudio",
      amountCents: 420000, timestamp: "2024-10-24T14:02:00Z",
      paymentMethod: "bank_wire", senderInitials: "AK",
      flagged: false, frozen: false, reviewed: false,
    },
    {
      id: "#TX-94025", sender: "James R.", receiver: "UI Labs",
      amountCents: 310000, timestamp: "2024-10-24T13:50:00Z",
      paymentMethod: "credit_card", senderInitials: "JR",
      flagged: false, frozen: false, reviewed: false,
    },
    {
      id: "#TX-94026", sender: "Unknown", receiver: "shell_corp",
      amountCents: 980000, timestamp: "2024-10-24T13:40:00Z",
      paymentMethod: "crypto", senderInitials: "?",
      flagged: true, frozen: false, reviewed: false,
    },
    {
      id: "#TX-94027", sender: "Lena M.", receiver: "FreelanceHub",
      amountCents: 150000, timestamp: "2024-10-24T13:22:00Z",
      paymentMethod: "bank_wire", senderInitials: "LM",
      flagged: false, frozen: false, reviewed: false,
    },
    {
      id: "#TX-94028", sender: "Carlos V.", receiver: "PixelDen",
      amountCents: 62000, timestamp: "2024-10-24T13:10:00Z",
      paymentMethod: "credit_card", senderInitials: "CV",
      flagged: false, frozen: false, reviewed: false,
    },
  ],

  earners: [
    { name: "David Chen",    earningsCents: 4_520_000, category: "UX DESIGN",  avatarColor: "bg-indigo-500" },
    { name: "Marcus Wright", earningsCents: 3_890_000, category: "WEB DEV",    avatarColor: "bg-purple-500" },
    { name: "Elena Rossi",   earningsCents: 3_150_000, category: "CONSULTING", avatarColor: "bg-blue-500"   },
    { name: "Tomás Garcia",  earningsCents: 2_980_000, category: "MOBILE APP", avatarColor: "bg-teal-500"   },
    { name: "Sarah Jenkins", earningsCents: 2_740_000, category: "MARKETING",  avatarColor: "bg-rose-500"   },
  ],
};

// ── Revenue history (last 6 months) — stored in cents ─────────────
const REVENUE_HISTORY = [
  { month: "JAN", grossCents: 18_000_000, netCents: 12_000_000 },
  { month: "FEB", grossCents: 22_000_000, netCents: 15_000_000 },
  { month: "MAR", grossCents: 26_000_000, netCents: 18_000_000 },
  { month: "APR", grossCents: 30_000_000, netCents: 21_000_000 },
  { month: "MAY", grossCents: 38_000_000, netCents: 26_000_000 },
  { month: "JUN", grossCents: 42_600_000, netCents: 29_000_000 },
];

// ── Formatting helpers ─────────────────────────────────────────────
function fmtUSD(cents: number): string {
  return (
    "$" +
    (cents / 100).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
}

function fmtUSDShort(cents: number): string {
  const d = cents / 100;
  if (d >= 1_000_000) return `$${(d / 1_000_000).toFixed(1)}M`;
  if (d >= 1_000) return `$${(d / 1_000).toFixed(1)}k`;
  return `$${d.toFixed(0)}`;
}

function pctChange(current: number, previous: number): string {
  if (previous === 0) return "N/A";
  const pct = ((current - previous) / previous) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}% from last month`;
}

function formatTimestamp(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    time: d.toTimeString().slice(0, 5),
  };
}

// ── Core computation — derive everything from DB ──────────────────
function computeStats() {
  const activeTx = DB.transactions.filter((t) => !t.frozen);

  const totalVolumeCents = activeTx.reduce((s, t) => s + t.amountCents, 0);

  // Platform revenue = 15% fee on clean (non-flagged) transactions
  const cleanTx = activeTx.filter((t) => !t.flagged);
  const platformRevenueCents = Math.round(
    cleanTx.reduce((s, t) => s + t.amountCents, 0) * 0.15
  );

  // Escrow = sum of flagged transactions
  const escrowCents = activeTx
    .filter((t) => t.flagged)
    .reduce((s, t) => s + t.amountCents, 0);

  const flaggedCount = activeTx.filter((t) => t.flagged).length;
  const total = activeTx.length;

  // Payment method percentages
  const cc     = activeTx.filter((t) => t.paymentMethod === "credit_card").length;
  const crypto  = activeTx.filter((t) => t.paymentMethod === "crypto").length;
  const wire   = activeTx.filter((t) => t.paymentMethod === "bank_wire").length;
  const paymentMethods = [
    { name: "Credit Card",   value: total ? Math.round((cc / total) * 100)    : 0, color: "#6366f1" },
    { name: "Crypto (USDT)", value: total ? Math.round((crypto / total) * 100) : 0, color: "#8b5cf6" },
    { name: "Bank Wire",     value: total ? Math.round((wire / total) * 100)   : 0, color: "#e2e8f0" },
  ];

  const financialStats = [
    {
      label: "Total Volume",
      value: fmtUSD(totalVolumeCents),
      change: pctChange(totalVolumeCents, DB.prevMonthVolumeCents),
      iconName: "TrendingUp",
      colorClass: "text-blue-500",
      bgClass: "bg-blue-50",
      up: totalVolumeCents >= DB.prevMonthVolumeCents,
      steady: false,
      alert: false,
    },
    {
      label: "Platform Revenue",
      value: fmtUSD(platformRevenueCents),
      change: pctChange(platformRevenueCents, DB.prevMonthRevenueCents),
      iconName: "DollarSign",
      colorClass: "text-green-500",
      bgClass: "bg-green-50",
      up: platformRevenueCents >= DB.prevMonthRevenueCents,
      steady: false,
      alert: false,
    },
    {
      label: "Escrow Hold",
      value: fmtUSD(escrowCents),
      change: escrowCents > 0 ? "Flagged funds on hold" : "No funds on hold",
      iconName: "Lock",
      colorClass: "text-indigo-500",
      bgClass: "bg-indigo-50",
      up: false,
      steady: true,
      alert: false,
    },
    {
      label: "Flagged Transactions",
      value: String(flaggedCount),
      change:
        flaggedCount > 0
          ? `${flaggedCount} require immediate review`
          : "No flagged transactions",
      iconName: "Flag",
      colorClass: "text-red-500",
      bgClass: "bg-red-50",
      up: false,
      steady: false,
      alert: flaggedCount > 0,
    },
  ];

  const revenueData = REVENUE_HISTORY.map((r) => ({
    month: r.month,
    gross: r.grossCents / 100,
    net: r.netCents / 100,
  }));

  const transactions = activeTx.map((t) => {
    const { date, time } = formatTimestamp(t.timestamp);
    return {
      id: t.id,
      sender: t.sender,
      receiver: t.receiver,
      amount:
        "$" +
        (t.amountCents / 100).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        }),
      date,
      time,
      risk: (t.flagged ? "HIGH RISK" : "LOW") as RiskLevel,
      senderInitials: t.senderInitials,
      flagged: t.flagged,
      reviewed: t.reviewed,
    };
  });

  const topEarners = [...DB.earners]
    .sort((a, b) => b.earningsCents - a.earningsCents)
    .slice(0, 5)
    .map((e) => ({
      name: e.name,
      amount: fmtUSDShort(e.earningsCents),
      category: e.category,
      color: e.avatarColor,
    }));

  const alertBanner = {
    visible: flaggedCount > 0,
    message: `Critical: ${flaggedCount} Flagged Transaction${flaggedCount !== 1 ? "s" : ""} detected in the last 2 hours.`,
    detail:
      "High-risk activity identified from IP range 192.168.x.x. Immediate review required.",
  };

  return {
    financialStats,
    revenueData,
    paymentMethods,
    transactions,
    topEarners,
    alertBanner,
    totalTxCount: total,
  };
}

// ── GET /api/financials ───────────────────────────────────────────
export async function GET() {
  return NextResponse.json(computeStats());
}

// ── POST /api/financials — apply a transaction action ─────────────
export async function POST(request: Request) {
  let body: { id?: string; action?: TxAction };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { id, action } = body;
  if (!id || !action) {
    return NextResponse.json(
      { success: false, message: "Missing id or action" },
      { status: 400 }
    );
  }

  const tx = DB.transactions.find((t) => t.id === id);
  if (!tx) {
    return NextResponse.json(
      { success: false, message: "Transaction not found" },
      { status: 404 }
    );
  }

  switch (action) {
    case "Flag":         tx.flagged   = true;  break;
    case "Dismiss":      tx.flagged   = false; break;
    case "Review":       tx.reviewed  = true;  break;
    case "Freeze Account": tx.frozen  = true;  break;
  }

  // Return fresh computed stats so client can fully sync
  return NextResponse.json({
    success: true,
    message: `${action} applied to ${id}`,
    id,
    action,
    freshData: computeStats(),
  });
}