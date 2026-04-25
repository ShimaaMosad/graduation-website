// ─────────────────────────────────────────────────────────────────────────────
// app/api/gigs/route.ts   — GET /api/gigs?status=active
// ─────────────────────────────────────────────────────────────────────────────
// Replace the mock data below with real DB queries (Prisma, Drizzle, etc.)

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");

  // ── TODO: replace with your DB call ──────────────────────────────────────
  // Example with Prisma:
  //
  // const where = status ? { status: mapTabToStatus(status) } : {};
  // const gigs  = await prisma.gig.findMany({ where, include: { stats: true } });
  //
  // const counts = await prisma.gig.groupBy({
  //   by: ["status"],
  //   _count: { _all: true },
  // });
  // ─────────────────────────────────────────────────────────────────────────

  // Mock response — remove when DB is wired up
  const ALL_GIGS = getMockGigs();
  const filtered = status
    ? ALL_GIGS.filter((g) => g.status.toLowerCase() === mapTabToStatus(status))
    : ALL_GIGS;

  return NextResponse.json({
    gigs: filtered,
    counts: {
      active:  ALL_GIGS.filter((g) => g.status === "Active").length,
      paused:  ALL_GIGS.filter((g) => g.status === "Paused").length,
      pending: ALL_GIGS.filter((g) => g.status === "Pending").length,
      drafts:  ALL_GIGS.filter((g) => g.status === "Draft").length,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// app/api/gigs/[id]/status/route.ts   — PATCH /api/gigs/:id/status
// ─────────────────────────────────────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { status } = await req.json();

  if (!["Active", "Paused"].includes(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  // ── TODO: replace with your DB update ───────────────────────────────────
  // const updated = await prisma.gig.update({
  //   where: { id: params.id },
  //   data:  { status },
  // });
  // return NextResponse.json(updated);
  // ─────────────────────────────────────────────────────────────────────────

  // Mock response
  const gig = getMockGigs().find((g) => g.id === params.id);
  if (!gig) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ ...gig, status });
}

// ─────────────────────────────────────────────────────────────────────────────
// app/api/dashboard/stats/route.ts   — GET /api/dashboard/stats
// ─────────────────────────────────────────────────────────────────────────────

export async function GETStats() {
  // ── TODO: aggregate from DB ──────────────────────────────────────────────
  // const [earnings, orders, views, rating] = await Promise.all([
  //   prisma.order.aggregate({ _sum: { amount: true } }),
  //   prisma.order.count({ where: { status: "active" } }),
  //   prisma.profileView.count(),
  //   prisma.review.aggregate({ _avg: { rating: true }, _count: true }),
  // ]);
  // ─────────────────────────────────────────────────────────────────────────

  return NextResponse.json({
    totalEarnings:  "$12,400",
    earningsTrend:  "+$1,200 this month",
    activeOrders:   15,
    ordersDueSoon:  3,
    profileViews:   8245,
    viewsTrend:     "+245 this week",
    averageRating:  4.9,
    totalReviews:   234,
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapTabToStatus(tab: string): string {
  const map: Record<string, string> = {
    active:  "active",
    paused:  "paused",
    pending: "pending",
    drafts:  "draft",
  };
  return map[tab] ?? tab;
}

function getMockGigs() {
  return [
    {
      id: "1",
      title: "I will design a modern logo",
      category: "Logo Design",
      categoryColor: "text-violet-600 bg-violet-50",
      price: "$150",
      packages: "Basic, Standard, Premium",
      status: "Active",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80",
      stats: {
        impressions: 1245, impressionsTrend: "+12%",
        clicks: 342,      clickRate: "27%",
        orders: 45,       orderRate: "13%",
        revenue: "$6,750", revenueTrend: "+$450",
      },
    },
    {
      id: "2",
      title: "I will develop a responsive website",
      category: "Web Development",
      categoryColor: "text-sky-600 bg-sky-50",
      price: "$500",
      packages: "Basic, Standard, Premium",
      status: "Active",
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&q=80",
      stats: {
        impressions: 2156, impressionsTrend: "+8%",
        clicks: 487,      clickRate: "23%",
        orders: 28,       orderRate: "11%",
        revenue: "$14,000", revenueTrend: "+$1,200",
      },
    },
    {
      id: "3",
      title: "I will write SEO content",
      category: "Content Writing",
      categoryColor: "text-emerald-600 bg-emerald-50",
      price: "$75",
      packages: "Basic, Standard",
      status: "Paused",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80",
      stats: {
        impressions: 892, impressionsTrend: "+5%",
        clicks: 156,     clickRate: "17%",
        orders: 12,      orderRate: "8%",
        revenue: "$900", revenueTrend: "+$75",
      },
    },
  ];
}
