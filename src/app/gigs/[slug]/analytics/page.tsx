"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ChevronDown,
  ChevronRight,
  DollarSign,
  Eye,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

import Navbar from "@/src/_components/Navbar/Navbar";
import {
  AnalyticsMetric,
  GigAnalytics,
  getGigAnalytics,
}from "@/src/lib/analytics-api";
const metricLabels: Record<AnalyticsMetric, string> = {
  impressions: "Impressions",
  clicks: "Clicks",
  orders: "Orders",
  revenue: "Revenue",
};

function StatCard({
  icon,
  value,
  title,
  growth,
  bg,
}: {
  icon: React.ReactNode;
  value: string;
  title: string;
  growth: string;
  bg: string;
}) {
  return (
    <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
        {icon}
      </div>
      <h3 className="text-[28px] font-bold text-slate-900">{value}</h3>
      <p className="mt-1 text-[15px] text-slate-600">{title}</p>
      <p className="mt-3 text-[13px] font-medium text-emerald-600">{growth}</p>
    </div>
  );
}

export default function GigAnalyticsPage() {
  const params = useParams();
  const slug = String(params.slug);

  const [analytics, setAnalytics] = useState<GigAnalytics | null>(null);
  const [activeMetric, setActiveMetric] =
    useState<AnalyticsMetric>("impressions");
  const [range, setRange] = useState("Last 30 days");

  useEffect(() => {
    const loadAnalytics = async () => {
      const data = await getGigAnalytics(slug);
      setAnalytics(data);
    };

    loadAnalytics();
  }, [slug]);

  const maxValue = useMemo(() => {
    if (!analytics) return 800;
    return Math.max(
      ...analytics.performance.map((item) => item[activeMetric] as number),
      800
    );
  }, [analytics, activeMetric]);

  const chartPoints = useMemo(() => {
    if (!analytics) return "";

    const width = 900;
    const height = 300;

    return analytics.performance
      .map((item, index) => {
        const x = (index / (analytics.performance.length - 1)) * width;
        const y =
          height - ((item[activeMetric] as number) / maxValue) * height;
        return `${x},${y}`;
      })
      .join(" ");
  }, [analytics, activeMetric, maxValue]);

  if (!analytics) {
    return (
      <main className="min-h-screen bg-[#f5f6f8]">
        <Navbar />
        <div className="mx-auto max-w-[1400px] px-6 py-8">
          <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
            Loading analytics...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <Navbar />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-6">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-[15px] text-slate-500">
            <Link href="/gigs" className="hover:text-slate-900">
              My Gigs
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/gigs/${slug}`} className="hover:text-slate-900">
              Logo Design
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-slate-900">Analytics</span>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-[32px] font-bold text-slate-900">
                {analytics.gigTitle}
              </h1>
              <p className="mt-1 text-[17px] text-slate-600">
                Performance Analytics
              </p>
            </div>

            <div className="relative w-[210px]">
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="w-full appearance-none rounded-xl bg-slate-100 px-4 py-3 pr-10 text-[15px] outline-none"
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Eye className="h-5 w-5 text-blue-600" />}
            value={analytics.totals.impressions.toLocaleString()}
            title="Total Impressions"
            growth={analytics.growth.impressions}
            bg="bg-blue-100"
          />

          <StatCard
            icon={<Sparkles className="h-5 w-5 text-violet-600" />}
            value={`${analytics.totals.ctr}%`}
            title="Click-Through Rate"
            growth={analytics.growth.ctr}
            bg="bg-violet-100"
          />

          <StatCard
            icon={<ShoppingCart className="h-5 w-5 text-emerald-600" />}
            value={`${analytics.totals.conversionRate}%`}
            title="Conversion Rate"
            growth={analytics.growth.conversionRate}
            bg="bg-emerald-100"
          />

          <StatCard
            icon={<DollarSign className="h-5 w-5 text-amber-600" />}
            value={`$${analytics.totals.revenue.toLocaleString()}`}
            title="Total Revenue"
            growth={analytics.growth.revenue}
            bg="bg-amber-100"
          />
        </div>

        <div className="mb-8 rounded-[22px] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-[26px] font-bold text-slate-900">
              Performance Over Time
            </h2>

            <div className="flex rounded-full bg-slate-100 p-1">
              {(["impressions", "clicks", "orders", "revenue"] as AnalyticsMetric[]).map(
                (metric) => (
                  <button
                    key={metric}
                    onClick={() => setActiveMetric(metric)}
                    className={`rounded-full px-4 py-2 text-[14px] font-semibold transition ${
                      activeMetric === metric
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600"
                    }`}
                  >
                    {metricLabels[metric]}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="relative h-[360px] pl-12">
            <div className="absolute left-0 top-0 flex h-[300px] flex-col justify-between text-[14px] text-slate-400">
              <span>800</span>
              <span>600</span>
              <span>400</span>
              <span>200</span>
              <span>0</span>
            </div>

            <div className="absolute left-12 right-0 top-0 h-[300px]">
              {[0, 1, 2, 3, 4].map((line) => (
                <div
                  key={line}
                  className="absolute left-0 right-0 border-t border-dashed border-slate-200"
                  style={{ top: `${line * 25}%` }}
                />
              ))}

              <svg viewBox="0 0 900 300" className="h-full w-full overflow-visible">
                <polyline
                  points={chartPoints}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {analytics.performance.map((item, index) => {
                  const x =
                    (index / (analytics.performance.length - 1)) * 900;
                  const y =
                    300 - ((item[activeMetric] as number) / maxValue) * 300;

                  return (
                    <circle
                      key={item.date}
                      cx={x}
                      cy={y}
                      r="5"
                      fill="#6366f1"
                    />
                  );
                })}
              </svg>

              <div className="mt-3 grid grid-cols-7 text-[14px] text-slate-400">
                {analytics.performance.map((item) => (
                  <span key={item.date} className="text-center">
                    {item.date}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* الكاردات الأساسية جنب بعض */}
        <div className="grid gap-7 xl:grid-cols-2">
          <div className="rounded-[22px] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="mb-6 text-[24px] font-bold text-slate-900">
              Traffic Sources
            </h2>

            <div className="mx-auto mb-7 h-48 w-48 rounded-full border-[30px] border-violet-500 border-b-emerald-500 border-l-blue-500 border-r-amber-500" />

            <div className="space-y-4">
              {analytics.trafficSources.map((source) => (
                <div
                  key={source.name}
                  className="flex items-center justify-between text-[16px]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="font-semibold text-slate-900">
                      {source.name}
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900">
                      {source.value.toLocaleString()}
                    </span>
                    <span className="ml-2 text-slate-500">
                      ({source.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="mb-6 text-[24px] font-bold text-slate-900">
              Conversion Funnel
            </h2>

            <div className="space-y-6">
              {analytics.funnel.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-[16px]">
                    <span className="font-semibold text-slate-900">
                      {item.label}
                    </span>

                    <span>
                      <b>{item.value.toLocaleString()}</b>
                      <span className="ml-2 text-slate-500">
                        ({item.percentage}%)
                      </span>
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-violet-600"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="mb-6 text-[24px] font-bold text-slate-900">
              Top Search Keywords
            </h2>

            <div>
              <div className="grid grid-cols-[1fr_120px_100px] border-b border-slate-200 pb-3 text-[15px] font-semibold text-slate-500">
                <span>Keyword</span>
                <span className="text-right">Impressions</span>
                <span className="text-right">Clicks</span>
              </div>

              {analytics.keywords.map((keyword) => (
                <div
                  key={keyword.keyword}
                  className="grid grid-cols-[1fr_120px_100px] border-b border-slate-100 py-4 text-[15px]"
                >
                  <span className="text-slate-600">{keyword.keyword}</span>
                  <span className="text-right text-slate-500">
                    {keyword.impressions.toLocaleString()}
                  </span>
                  <span className="text-right font-bold text-slate-900">
                    {keyword.clicks}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="mb-6 text-[24px] font-bold text-slate-900">
              Buyer Demographics
            </h2>

            <h3 className="mb-4 text-[18px] font-semibold text-slate-900">
              Top Countries
            </h3>

            <div className="space-y-4">
              {analytics.countries.map((country) => (
                <div
                  key={country.code}
                  className="grid grid-cols-[36px_1fr_45px] items-center gap-4"
                >
                  <span className="font-semibold text-slate-700">
                    {country.code}
                  </span>

                  <div>
                    <div className="mb-1 text-[15px] text-slate-700">
                      {country.country}
                    </div>

                    <div className="h-2.5 rounded-full bg-slate-100">
                      <div
                        className="h-2.5 rounded-full bg-violet-600"
                        style={{ width: `${country.percentage}%` }}
                      />
                    </div>
                  </div>

                  <span className="text-right text-[15px] font-medium text-slate-700">
                    {country.percentage}%
                  </span>
                </div>
              ))}
            </div>

            <h3 className="mb-4 mt-8 text-[18px] font-semibold text-slate-900">
              Returning vs New Buyers
            </h3>

            <div className="flex items-center gap-7">
              <div className="h-36 w-36 rounded-full border-[30px] border-indigo-600 border-r-sky-500" />

              <div className="space-y-4">
                {analytics.buyers.map((buyer) => (
                  <div key={buyer.label} className="flex items-start gap-3">
                    <span
                      className="mt-1 h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: buyer.color }}
                    />

                    <div>
                      <p className="font-semibold text-slate-800">
                        {buyer.label}
                      </p>
                      <p className="text-[14px] text-slate-500">
                        {buyer.orders} orders ({buyer.percentage}%)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}