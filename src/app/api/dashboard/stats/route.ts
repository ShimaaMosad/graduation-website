import { NextResponse } from "next/server";

export async function GET() {
  // TODO: replace with your real DB query
  // Example with Prisma:
  //
  // const [earnings, orders, views, rating] = await Promise.all([
  //   prisma.order.aggregate({ _sum: { amount: true } }),
  //   prisma.order.count({ where: { status: "active" } }),
  //   prisma.profileView.count(),
  //   prisma.review.aggregate({ _avg: { rating: true }, _count: true }),
  // ]);

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