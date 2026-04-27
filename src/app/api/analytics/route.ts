import { NextRequest, NextResponse } from "next/server";

// ── Seeded RNG so same range param = consistent shape each reload ─
function seededRng(seed: number) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}
function rb(rng: () => number, min: number, max: number) {
  return Math.round(min + rng() * (max - min));
}
function fluct(rng: () => number, base: number, pct = 0.07) {
  return +(base * (1 + (rng() - 0.5) * 2 * pct)).toFixed(2);
}

type Range = "7d" | "30d" | "90d" | "12m";

const RANGES: Record<Range, { label: string; seed: number; scale: number }> = {
  "7d":  { label: "Last 7 Days",    seed: 1001, scale: 0.24 },
  "30d": { label: "Last 30 Days",   seed: 2002, scale: 1    },
  "90d": { label: "Last 90 Days",   seed: 3003, scale: 3.1  },
  "12m": { label: "Last 12 Months", seed: 4004, scale: 13.5 },
};

export async function GET(req: NextRequest) {
  const param  = (req.nextUrl.searchParams.get("range") ?? "30d") as Range;
  const cfg    = RANGES[param] ?? RANGES["30d"];
  const { label, scale: sc } = cfg;
  // add tiny daily drift so refresh gives slightly new numbers
  const rng = seededRng(cfg.seed + (Date.now() % 199));

  /* ── KPI Cards ─────────────────────────────────────────── */
  const revenue   = fluct(rng, 2.4  * sc, 0.07);
  const users     = Math.round(fluct(rng, 142 * sc, 0.06));
  const orders    = fluct(rng, 48.2 * sc, 0.06);
  const avgVal    = fluct(rng, 49.8,      0.05);   // avg order value doesn't scale with time
  const retention = fluct(rng, 92.4,      0.01);
  const nps       = rb(rng, 70, 78);

  const kpiCards = [
    { label: "Revenue",      value: `$${revenue.toFixed(1)}M`,   change: `+${fluct(rng,12.5,0.3).toFixed(1)}%`,  up: true  },
    { label: "Active Users", value: `${users}K`,                 change: `+${fluct(rng,8.2,0.3).toFixed(1)}%`,   up: true  },
    { label: "Orders",       value: `${orders.toFixed(1)}K`,     change: `-${fluct(rng,2.1,0.3).toFixed(1)}%`,   up: false },
    { label: "Avg Value",    value: `$${avgVal.toFixed(1)}`,     change: `+${fluct(rng,4.8,0.3).toFixed(1)}%`,   up: true  },
    { label: "Retention",    value: `${retention.toFixed(1)}%`,  change: "0.0%",                                  neutral: true },
    { label: "NPS",          value: `${nps}`,                    change: `+${rb(rng,10,20)}`,                     up: true  },
  ];

  /* ── Growth Chart ──────────────────────────────────────── */
  const growthLabels =
    param === "7d"  ? ["MON","TUE","WED","THU","FRI","SAT","SUN"] :
    param === "30d" ? ["JAN 01","JAN 05","JAN 10","JAN 15","JAN 20","JAN 25","JAN 30"] :
    param === "90d" ? ["WK 1","WK 2","WK 3","WK 4","WK 5","WK 6","WK 7","WK 8","WK 9"] :
                     ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

  const baseCur = [1100,1400,1200,1800,2200,3800,4200,2900,3500,4100,4800,5200];
  const basePrv = [800, 820, 850, 900, 870, 950,1000, 800, 900,1000,1100,1200];
  const growthChartData = growthLabels.map((date, i) => ({
    date,
    current:  Math.round(fluct(rng, (baseCur[i] ?? 2000) * sc * 0.2, 0.12)),
    previous: Math.round(fluct(rng, (basePrv[i] ??  900) * sc * 0.2, 0.08)),
  }));

  /* ── Funnel ────────────────────────────────────────────── */
  const visits       = rb(rng, Math.round(1_100_000*sc*0.15), Math.round(1_300_000*sc*0.15));
  const productViews = Math.round(visits * (rb(rng,34,40)/100));
  const addToCart    = Math.round(visits * (rb(rng,7,9)/100));
  const checkout     = Math.round(visits * (rb(rng,3,5)/100));
  const funnelData = [
    { label:"Visits",        value:visits,       pct:100,                                      bar:"100%" },
    { label:"Product Views", value:productViews, pct:Math.round(productViews/visits*100),      bar:`${Math.round(productViews/visits*100)}%` },
    { label:"Add to Cart",   value:addToCart,    pct:Math.round(addToCart   /visits*100),      bar:`${Math.round(addToCart   /visits*100)}%` },
    { label:"Checkout",      value:checkout,     pct:Math.round(checkout    /visits*100),      bar:`${Math.round(checkout    /visits*100)}%` },
  ];

  /* ── Revenue by Category ───────────────────────────────── */
  const entCloud  = rb(rng, Math.round(1_100_000*sc), Math.round(1_300_000*sc));
  const secSuite  = rb(rng, Math.round(  800_000*sc), Math.round(  900_000*sc));
  const apiAcc    = rb(rng, Math.round(  300_000*sc), Math.round(  350_000*sc));
  const consult   = rb(rng, Math.round(  100_000*sc), Math.round(  140_000*sc));
  const totalRev  = entCloud + secSuite + apiAcc + consult;
  const revenueByCategory = [
    { name:"Enterprise Cloud", value:entCloud, color:"#6366f1" },
    { name:"Security Suite",   value:secSuite, color:"#8b5cf6" },
    { name:"API Access",       value:apiAcc,   color:"#a78bfa" },
    { name:"Consulting",       value:consult,  color:"#c4b5fd" },
  ];

  /* ── Top Markets ───────────────────────────────────────── */
  const topMarkets = [
    { country:"USA",            pct:rb(rng,40,44), flag:"🇺🇸", color:"bg-indigo-600" },
    { country:"United Kingdom", pct:rb(rng,16,20), flag:"🇬🇧", color:"bg-indigo-400" },
    { country:"Germany",        pct:rb(rng,12,16), flag:"🇩🇪", color:"bg-indigo-300" },
    { country:"Japan",          pct:rb(rng,7,11),  flag:"🇯🇵", color:"bg-indigo-200" },
  ];

  /* ── Engagement ────────────────────────────────────────── */
  const days        = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
  const bSession    = [42,55,62,48,38,30,25];
  const bViews      = [180,220,260,200,160,130,110];
  const engMult     = Math.min(sc, 2);          // cap multiplier so bars stay visible
  const engagementData = days.map((day, i) => ({
    day,
    session: Math.round(fluct(rng, bSession[i] * engMult, 0.15)),
    views:   Math.round(fluct(rng, bViews[i]   * engMult, 0.12)),
  }));

  /* ── Retention Cohort ──────────────────────────────────── */
  const cohortData = [
    { cohort:"Sept 2023", months:[100, rb(rng,79,85), rb(rng,71,77), rb(rng,65,71), rb(rng,56,62)] },
    { cohort:"Oct 2023",  months:[100, rb(rng,86,92), rb(rng,78,84), rb(rng,69,75), null] },
    { cohort:"Nov 2023",  months:[100, rb(rng,81,87), rb(rng,76,82), null, null] },
    { cohort:"Dec 2023",  months:[100, rb(rng,88,94), null, null, null] },
  ];

  /* ── AI Features ───────────────────────────────────────── */
  const aiFeatures = [
    { name:"Smart Search",         desc:"NLP-driven workspace search",  pct:rb(rng,80,88), change:`+${rb(rng,10,14)}% WoW`, color:"bg-indigo-600" },
    { name:"Auto-Drafting",        desc:"AI-powered report generator",  pct:rb(rng,58,66), change:`+${rb(rng,4,7)}% WoW`,   color:"bg-purple-500" },
    { name:"Predictive Analytics", desc:"Churn & revenue forecasting",  pct:rb(rng,34,42), change:"Stable",                  color:"bg-violet-400" },
  ];

  /* ── Projections ───────────────────────────────────────── */
  const pBase = sc * 0.12;
  const q1 = +fluct(rng, 2.85*pBase, 0.05).toFixed(2);
  const q2 = +fluct(rng, 3.42*pBase, 0.05).toFixed(2);
  const q3 = +fluct(rng, 4.10*pBase, 0.05).toFixed(2);
  const q4 = +fluct(rng, 4.90*pBase, 0.05).toFixed(2);
  const projections = [
    { quarter:"Q1 2024", projected:`$${q1}M`, growth:`+${rb(rng,16,20)}%` },
    { quarter:"Q2 2024", projected:`$${q2}M`, growth:`+${rb(rng,18,22)}%` },
    { quarter:"Q3 2024", projected:`$${q3}M`, growth:`+${rb(rng,18,22)}%` },
  ];
  const projectionChart = [
    { q:"Q1",v:q1 },{ q:"Q2",v:q2 },{ q:"Q3",v:q3 },{ q:"Q4",v:q4 },
  ];

  /* ── Derived summary stats (computed from real data above) ─ */
  const conversionRate  = +((checkout / visits) * 100).toFixed(2);
  const cartAbandonRate = +(100 - (checkout / addToCart) * 100).toFixed(1);
  const avgSession      = +(engagementData.reduce((s,d)=>s+d.session,0)/7).toFixed(1);
  const totalViews      = engagementData.reduce((s,d)=>s+d.views,0);
  const peakDay         = engagementData.reduce((a,b)=>a.session>b.session?a:b).day;
  const revenuePerUser  = +(totalRev / (users * 1000)).toFixed(2);

  const summaryStats = {
    conversionRate,
    cartAbandonRate,
    avgSession,
    totalViews,
    peakDay,
    totalRevenue: totalRev,
    revenuePerUser,
    avgOrderValue: avgVal,
  };

  return NextResponse.json({
    kpiCards, growthChartData, funnelData,
    revenueByCategory, topMarkets, engagementData,
    cohortData, aiFeatures, projections, projectionChart,
    summaryStats,
    dateRange: label,
    rangeParam: param,
    generatedAt: new Date().toISOString(),
  });
}