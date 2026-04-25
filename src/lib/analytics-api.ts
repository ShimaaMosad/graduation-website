// ================= TYPES =================

export type AnalyticsMetric = "impressions" | "clicks" | "orders" | "revenue";

export type AnalyticsPoint = {
  date: string;
  impressions: number;
  clicks: number;
  orders: number;
  revenue: number;
};

export type TrafficSource = {
  name: string;
  value: number;
  percentage: number;
  color: string;
};

export type FunnelItem = {
  label: string;
  value: number;
  percentage: number;
};

export type CountryStat = {
  code: string;
  country: string;
  percentage: number;
};

export type BuyerType = {
  label: string;
  orders: number;
  percentage: number;
  color: string;
};

export type SearchKeyword = {
  keyword: string;
  impressions: number;
  clicks: number;
};

export type GigAnalytics = {
  gigTitle: string;
  range: string;

  totals: {
    impressions: number;
    ctr: number;
    conversionRate: number;
    revenue: number;
  };

  growth: {
    impressions: string;
    ctr: string;
    conversionRate: string;
    revenue: string;
  };

  performance: AnalyticsPoint[];
  trafficSources: TrafficSource[];
  funnel: FunnelItem[];
  countries: CountryStat[];

  // 🔥 دول كانوا ناقصين
  keywords: SearchKeyword[];
  buyers: BuyerType[];
};


// ================= MOCK DATA =================

export const mockAnalytics: GigAnalytics = {
  gigTitle: "I will design a modern logo",
  range: "Last 30 days",

  totals: {
    impressions: 8245,
    ctr: 27,
    conversionRate: 13,
    revenue: 6750,
  },

  growth: {
    impressions: "↑ 12% vs last period",
    ctr: "↑ 3%",
    conversionRate: "↑ 2%",
    revenue: "+$450",
  },

  performance: [
    { date: "Apr 1", impressions: 250, clicks: 70, orders: 10, revenue: 300 },
    { date: "Apr 5", impressions: 310, clicks: 95, orders: 18, revenue: 600 },
    { date: "Apr 10", impressions: 290, clicks: 90, orders: 15, revenue: 500 },
    { date: "Apr 15", impressions: 450, clicks: 130, orders: 35, revenue: 900 },
    { date: "Apr 20", impressions: 520, clicks: 150, orders: 42, revenue: 1200 },
    { date: "Apr 25", impressions: 610, clicks: 180, orders: 55, revenue: 1500 },
    { date: "Apr 30", impressions: 740, clicks: 220, orders: 70, revenue: 1800 },
  ],

  trafficSources: [
    { name: "Search", value: 3710, percentage: 45, color: "#8b5cf6" },
    { name: "Browse", value: 2474, percentage: 30, color: "#3b82f6" },
    { name: "Direct", value: 1237, percentage: 15, color: "#10b981" },
    { name: "Social", value: 824, percentage: 10, color: "#f59e0b" },
  ],

  funnel: [
    { label: "Impressions", value: 8245, percentage: 100 },
    { label: "Clicks", value: 2226, percentage: 27 },
    { label: "Add to Cart", value: 445, percentage: 5.4 },
    { label: "Orders", value: 289, percentage: 3.5 },
  ],

  countries: [
    { code: "US", country: "United States", percentage: 35 },
    { code: "GB", country: "United Kingdom", percentage: 22 },
    { code: "CA", country: "Canada", percentage: 18 },
    { code: "AU", country: "Australia", percentage: 15 },
    { code: "DE", country: "Germany", percentage: 10 },
  ],

  // 🔥 Top Search Keywords
  keywords: [
    { keyword: "logo design", impressions: 1245, clicks: 342 },
    { keyword: "brand logo", impressions: 892, clicks: 245 },
    { keyword: "modern logo", impressions: 654, clicks: 178 },
    { keyword: "minimalist logo", impressions: 523, clicks: 156 },
    { keyword: "professional logo", impressions: 421, clicks: 134 },
  ],

  // 🔥 Returning vs New Buyers
  buyers: [
    { label: "Returning", orders: 188, percentage: 65, color: "#4f46e5" },
    { label: "New", orders: 101, percentage: 35, color: "#0ea5e9" },
  ],
};


// ================= API FUNCTION =================

export async function getGigAnalytics(slug: string): Promise<GigAnalytics> {

  // 🔴 لما الباك يشتغل
  // const res = await fetch(`http://localhost:5000/api/gigs/${slug}/analytics?range=30d`);
  // if (!res.ok) throw new Error("Failed to fetch analytics");
  // return res.json();

  return mockAnalytics;
}