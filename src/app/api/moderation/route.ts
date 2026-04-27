import { NextRequest, NextResponse } from "next/server";

// ── Seeded RNG ───────────────────────────────────────────────────
function seededRng(seed: number) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}
function rb(rng: () => number, min: number, max: number) {
  return Math.floor(min + rng() * (max - min + 1));
}

// ── Types ────────────────────────────────────────────────────────
export type CaseType = "CRITICAL" | "WARNING" | "DISPUTE" | "SPAM";

export interface ModerationCase {
  id: string;
  type: CaseType;
  refId: string;
  time: string;
  // CRITICAL
  gigTitle?: string;
  seller?: string;
  category?: string;
  aiConfidence?: number;
  aiReason?: string;
  // WARNING
  reviewText?: string;
  reviewer?: string;
  target?: string;
  flagCount?: number;
  // DISPUTE
  disputeTitle?: string;
  clientName?: string;
  clientClaim?: string;
  freelancerName?: string;
  freelancerClaim?: string;
  orderAmount?: number;
  resolutionHours?: number;
  timeline?: { label: string; color: string }[];
  // SPAM
  spamMessage?: string;
  spamReach?: number;
}

// ── Static content pools ─────────────────────────────────────────
const gigTitles = [
  "Pro Logo Design & Branding Solutions",
  "Full-Stack Web App Development",
  "SEO Optimization & Link Building",
  "Social Media Marketing Package",
  "Professional Video Editing Service",
];
const sellers = ["@creative_studio", "@dev_ninja", "@seo_master", "@social_guru", "@vid_pro"];
const categories = ["Graphic Design", "Development", "Digital Marketing", "Social Media", "Video & Animation"];
const criticalReasons = [
  "Suspicious contact details detected. Possible off-platform transaction attempt via Discord handle hidden in image metadata.",
  "External payment link detected in gig description. Violates TOS Section 4.2.",
  "Duplicate account activity detected. Same seller operating under 3 profiles.",
  "Fake review network identified — 14 connected accounts all reviewing within 2 hours.",
];
const reviewTexts = [
  '"The worst service ever, total scammer, avoid at all costs!!!"',
  '"Completely fake delivery, do not trust this seller AT ALL."',
  '"SCAM ARTIST!!! Never delivered and blocked me immediately."',
  '"Terrible quality, stolen work, reported to authorities."',
];
const reviewers = ["@angry_client", "@frustrated_user", "@unhappy_buyer", "@madcustomer"];
const targets = ["@web_pro", "@design_ace", "@code_wizard", "@pixel_master"];
const warningReasons = [
  'Language style matches "toxic harassment" pattern. User has flagged 12 other freelancers in the last 48 hours.',
  'Coordinated negative review pattern detected across 3 seller profiles.',
  'Repeated use of banned terms. Account previously warned twice.',
  'Review posted within 60 seconds of order completion — bot activity suspected.',
];
const disputeTitles = [
  'Payment Refund Dispute: "Frontend Dev Service"',
  'Delivery Dispute: "Logo Design Package"',
  'Scope Dispute: "SEO Audit & Report"',
  'Quality Dispute: "Mobile App UI Design"',
];
const clientNames = ["Mark Thompson", "Alice Johnson", "Robert Kim", "Sara Lee"];
const freelancerNames = ["Sarah Chen", "James Park", "Maria Santos", "David Brown"];
const clientClaims = [
  '"The code provided is unusable and contains multiple security vulnerabilities."',
  '"The logo does not match the approved mockup at all."',
  '"The SEO report is generic and not specific to my business."',
  '"UI designs were copied from a free template site."',
];
const freelancerClaims = [
  '"Client requested scope changes outside the original agreement without extra pay."',
  '"Client approved the design in writing before requesting a refund."',
  '"Full audit was delivered as described. Client wants extra services for free."',
  '"All designs are original. Client is attempting fraud."',
];
const spamMessages = [
  '"Hey check out this cool crypto site for free tokens!!! hxxp://scam-link-here.com/claim"',
  '"Make $5000/day from home!!! Click here: hxxp://easy-money-now.biz/signup"',
  '"Your account has been compromised. Verify now: hxxp://phish-site.net/verify"',
  '"FREE PREMIUM ACCESS — limited time: hxxp://fake-promo.io/redeem"',
];
const spamReasons = [
  "Known phishing URL detected. Account has sent this message to 450 users in 5 minutes.",
  "Mass messaging bot detected. 1,200 identical messages sent in under 10 minutes.",
  "URL matches known scam domain database. Account created 3 hours ago.",
  "Cryptocurrency scam pattern detected. IP linked to 47 banned accounts.",
];

// ── Build cases ──────────────────────────────────────────────────
function buildCases(rng: () => number): ModerationCase[] {
  const types: CaseType[] = ["CRITICAL", "WARNING", "DISPUTE", "SPAM"];
  const timeLabels = ["12m ago", "45m ago", "2h ago", "5h ago", "1h ago", "30m ago", "3h ago", "7h ago"];
  const cases: ModerationCase[] = [];
  const count = rb(rng, 3, 6);

  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    const id = `case-${i}-${Date.now()}`;

    if (type === "CRITICAL") {
      const idx = rb(rng, 0, gigTitles.length - 1);
      cases.push({
        id, type,
        refId: `#GIG-${rb(rng, 10000, 99999)}`,
        time: `Flagged ${timeLabels[rb(rng, 0, 3)]}`,
        gigTitle: gigTitles[idx],
        seller: sellers[idx],
        category: categories[idx],
        aiConfidence: rb(rng, 90, 99),
        aiReason: criticalReasons[rb(rng, 0, criticalReasons.length - 1)],
      });
    } else if (type === "WARNING") {
      const idx = rb(rng, 0, reviewTexts.length - 1);
      cases.push({
        id, type,
        refId: `#REV-${rb(rng, 10000, 99999)}`,
        time: `Flagged ${timeLabels[rb(rng, 0, 3)]}`,
        reviewText: reviewTexts[idx],
        reviewer: reviewers[idx],
        target: targets[idx],
        flagCount: rb(rng, 8, 20),
        aiConfidence: rb(rng, 65, 85),
        aiReason: warningReasons[rb(rng, 0, warningReasons.length - 1)],
      });
    } else if (type === "DISPUTE") {
      const idx = rb(rng, 0, disputeTitles.length - 1);
      cases.push({
        id, type,
        refId: `#ORD-${rb(rng, 10000, 99999)}`,
        time: `Escalated ${timeLabels[rb(rng, 2, 5)]}`,
        disputeTitle: disputeTitles[idx],
        clientName: clientNames[idx],
        clientClaim: clientClaims[idx],
        freelancerName: freelancerNames[idx],
        freelancerClaim: freelancerClaims[idx],
        orderAmount: rb(rng, 50, 800),
        resolutionHours: rb(rng, 2, 8),
        timeline: [
          { label: `Sep ${rb(rng, 10, 15)}, 10:00 AM: Order Started`, color: "bg-green-500" },
          { label: `Sep ${rb(rng, 13, 18)}, 04:30 PM: 1st Milestone Delivered`, color: "bg-green-500" },
          { label: `Today, ${rb(rng, 10, 14)}:${rb(rng, 10, 59)} AM: Dispute Raised`, color: "bg-amber-500" },
        ],
      });
    } else {
      const idx = rb(rng, 0, spamMessages.length - 1);
      cases.push({
        id, type,
        refId: `#MSG-${rb(rng, 1000, 9999)}`,
        time: `Flagged ${timeLabels[rb(rng, 3, 7)]}`,
        spamMessage: spamMessages[idx],
        spamReach: rb(rng, 200, 1500),
        aiConfidence: 100,
        aiReason: spamReasons[rb(rng, 0, spamReasons.length - 1)],
      });
    }
  }
  return cases;
}

// ── GET /api/moderation ──────────────────────────────────────────
export async function GET(_req: NextRequest) {
  const rng = seededRng(Date.now() % 9973);

  const cases = buildCases(rng);

  // ── Stats derived from cases ────────────────────────────────
  const criticalCount = cases.filter(c => c.type === "CRITICAL").length;
  const warningCount  = cases.filter(c => c.type === "WARNING").length;
  const disputeCount  = cases.filter(c => c.type === "DISPUTE").length;
  const spamCount     = cases.filter(c => c.type === "SPAM").length;

  const modStats = [
    { label: "Flagged Gigs",    value: rb(rng, 130, 160),  change: "+12%", icon: "Megaphone",    color: "text-red-500",    bg: "bg-red-50",    down: false },
    { label: "Flagged Reviews", value: rb(rng, 80,  100),  change: "-4%",  icon: "Star",         color: "text-amber-500",  bg: "bg-amber-50",  down: true  },
    { label: "Spam Detected",   value: rb(rng, 1100, 1400),change: "+8%",  icon: "MessageSquare",color: "text-purple-500", bg: "bg-purple-50", down: false },
    { label: "Active Disputes", value: disputeCount + rb(rng, 18, 22), change: "0%", icon: "Scale", color: "text-blue-500", bg: "bg-blue-50", down: false },
  ];

  // ── Resolved / performance ──────────────────────────────────
  const resolvedToday  = rb(rng, 14, 22);
  const resolvedTarget = 25;
  const avgResponseMin = rb(rng, 18, 30);
  const accuracyRate   = +(99 + rng() * 0.9).toFixed(1);

  // ── Tabs with live counts ───────────────────────────────────
  const totalCases = cases.length + rb(rng, 18, 22); // add background queue
  const tabs = [
    `All Cases (${totalCases})`,
    `Gigs (${criticalCount + rb(rng, 8, 12)})`,
    `Reviews (${warningCount + rb(rng, 3, 5)})`,
    `Disputes (${disputeCount + rb(rng, 2, 4)})`,
    `Spam (${spamCount + rb(rng, 1, 3)})`,
  ];

  // ── Online moderators ───────────────────────────────────────
  const modTasks = ["Handling: Phishing", "Handling: Reviews", "Handling: Disputes", "Reviewing: Gigs"];
  const onlineModerators = [
    { name: "Alex Rivera", role: "Admin", task: modTasks[rb(rng, 0, modTasks.length - 1)], initials: "AR" },
    { name: "Elena Sato",  role: "Mod 2", task: modTasks[rb(rng, 0, modTasks.length - 1)], initials: "ES" },
  ];

  // ── Recent actions ──────────────────────────────────────────
  const actionPool = [
    { text: `System auto-resolved Spam Case #${rb(rng, 900, 999)}`, time: `${rb(rng, 1, 5)}m ago`, icon: "CheckCircle", color: "text-green-500" },
    { text: `Alex Rivera banned user @hacker_${rb(rng, 1, 9)}`,      time: `${rb(rng, 10, 20)}m ago`, icon: "Ban",         color: "text-red-500"   },
    { text: `Elena Sato viewed Gig #${rb(rng, 8000, 9999)}`,         time: `${rb(rng, 15, 30)}m ago`, icon: "Shield",      color: "text-blue-500"  },
  ];

  // ── Badge count for sidebar ─────────────────────────────────
  const badgeCount = cases.length;

  return NextResponse.json({
    modStats,
    cases,
    tabs,
    resolvedToday,
    resolvedTarget,
    avgResponseMin,
    accuracyRate,
    onlineModerators,
    recentActions: actionPool,
    badgeCount,
    generatedAt: new Date().toISOString(),
  });
}