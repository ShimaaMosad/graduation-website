"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Calendar, Bell, Settings, LayoutDashboard, BarChart2,
  ShieldAlert, UserCog, CreditCard, ScrollText, HelpCircle, LogOut,
  TrendingUp, TrendingDown, Minus, ChevronDown, Zap, RefreshCw,
  Search, X, CheckCircle, AlertCircle, Info, ChevronRight,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";

// ── Types ────────────────────────────────────────────────────────
type Range = "7d" | "30d" | "90d" | "12m";

interface KpiCard      { label: string; value: string; change: string; up?: boolean; neutral?: boolean }
interface GrowthPoint  { date: string; current: number; previous: number }
interface FunnelRow    { label: string; value: number; pct: number; bar: string }
interface CategoryRow  { name: string; value: number; color: string }
interface MarketRow    { country: string; pct: number; flag: string; color: string }
interface EngagRow     { day: string; session: number; views: number }
interface CohortRow    { cohort: string; months: (number | null)[] }
interface AiFeature    { name: string; desc: string; pct: number; change: string; color: string }
interface Projection   { quarter: string; projected: string; growth: string }
interface ProjChart    { q: string; v: number }
interface SummaryStats {
  conversionRate: number; cartAbandonRate: number; avgSession: number;
  totalViews: number; peakDay: string; totalRevenue: number;
  revenuePerUser: number; avgOrderValue: number;
}
interface AnalyticsData {
  kpiCards: KpiCard[]; growthChartData: GrowthPoint[]; funnelData: FunnelRow[];
  revenueByCategory: CategoryRow[]; topMarkets: MarketRow[]; engagementData: EngagRow[];
  cohortData: CohortRow[]; aiFeatures: AiFeature[]; projections: Projection[];
  projectionChart: ProjChart[]; summaryStats: SummaryStats;
  dateRange: string; rangeParam: Range; generatedAt: string;
}

// ── Helpers ──────────────────────────────────────────────────────
const cohortColor = (v: number | null) => {
  if (v === null) return "bg-gray-100 text-gray-300";
  if (v >= 90)    return "bg-green-500 text-white";
  if (v >= 75)    return "bg-green-400 text-white";
  if (v >= 60)    return "bg-green-300 text-green-800";
  return "bg-green-100 text-green-700";
};

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const RANGE_LABELS: Record<Range, string> = {
  "7d": "Last 7 Days", "30d": "Last 30 Days",
  "90d": "Last 90 Days", "12m": "Last 12 Months",
};

// ── Notification data ────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: 1, type: "success", title: "Revenue target hit", body: "Q1 revenue exceeded forecast by 8%.", time: "2m ago", read: false },
  { id: 2, type: "warning", title: "Order drop detected", body: "Orders down 2.1% vs last period.", time: "1h ago", read: false },
  { id: 3, type: "info",    title: "New cohort available", body: "Jan 2024 cohort data is ready.", time: "3h ago", read: true },
  { id: 4, type: "success", title: "NPS improved",        body: "Net Promoter Score up to 74.",     time: "1d ago", read: true },
];

// ── Nav pages (simple views for non-analytics pages) ─────────────
const PAGE_TITLES: Record<string, string> = {
  Dashboard:        "Dashboard",
  Analytics:        "Platform Analytics",
  Moderation:       "Content Moderation",
  "User Management":"User Management",
  Financials:       "Financials",
  "System Logs":    "System Logs",
};

const navItems = [
  { label: "Dashboard",        icon: LayoutDashboard },
  { label: "Analytics",        icon: BarChart2 },
  { label: "Moderation",       icon: ShieldAlert },
  { label: "User Management",  icon: UserCog },
  { label: "Financials",       icon: CreditCard },
  { label: "System Logs",      icon: ScrollText },
];

// ── Main ─────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [activeNav,    setActiveNav]    = useState("Analytics");
  const [range,        setRange]        = useState<Range>("30d");
  const [showRange,    setShowRange]    = useState(false);
  const [data,         setData]         = useState<AnalyticsData | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [refreshing,   setRefreshing]   = useState(false);
  const [lastUpdated,  setLastUpdated]  = useState("");
  const [search,       setSearch]       = useState("");
  const [showSearch,   setShowSearch]   = useState(false);
  const [showNotifs,   setShowNotifs]   = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile,  setShowProfile]  = useState(false);
  const [notifs,       setNotifs]       = useState(NOTIFICATIONS);
  const [darkMode,     setDarkMode]     = useState(false);
  const [autoRefresh,  setAutoRefresh]  = useState(true);
  const [emailNotifs,  setEmailNotifs]  = useState(true);
  const searchRef  = useRef<HTMLInputElement>(null);
  const rangeRef   = useRef<HTMLDivElement>(null);

  const unreadCount = notifs.filter(n => !n.read).length;

  // ── Fetch ──────────────────────────────────────────────────
  const fetchData = useCallback(async (r: Range, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else           setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analytics?range=${r}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json: AnalyticsData = await res.json();
      setData(json);
      setLastUpdated(new Date(json.generatedAt).toLocaleTimeString());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(range); }, [range, fetchData]);

  // Auto-refresh every 60 s
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => fetchData(range, true), 60_000);
    return () => clearInterval(id);
  }, [range, fetchData, autoRefresh]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (rangeRef.current && !rangeRef.current.contains(e.target as Node)) setShowRange(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search input when opened
  useEffect(() => { if (showSearch) searchRef.current?.focus(); }, [showSearch]);

  // ── Handlers ───────────────────────────────────────────────
  const handleRangeSelect = (r: Range) => {
    setRange(r);
    setShowRange(false);
  };

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      alert("Logged out. Redirect to /login in a real app.");
    }
  };

  const handleHelpCenter = () => {
    window.open("https://help.example.com", "_blank");
  };

  // ── Non-analytics page placeholder ────────────────────────
  const renderOtherPage = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        {React.createElement(navItems.find(n => n.label === activeNav)?.icon ?? BarChart2, { size: 28, className: "text-gray-300" })}
      </div>
      <p className="text-sm font-medium text-gray-500">{PAGE_TITLES[activeNav]}</p>
      <p className="text-xs text-gray-400">This section is under construction.</p>
      <button
        onClick={() => setActiveNav("Analytics")}
        className="mt-2 flex items-center gap-1 text-xs text-indigo-600 hover:underline"
      >
        <ChevronRight size={12} />Back to Analytics
      </button>
    </div>
  );

  // ── Notification icon helper ───────────────────────────────
  const NotifIcon = ({ type }: { type: string }) => {
    if (type === "success") return <CheckCircle size={14} className="text-green-500 flex-shrink-0" />;
    if (type === "warning") return <AlertCircle size={14} className="text-yellow-500 flex-shrink-0" />;
    return <Info size={14} className="text-blue-500 flex-shrink-0" />;
  };

  // ── Search filter helper ───────────────────────────────────
  const matchesSearch = (text: string) =>
    !search || text.toLowerCase().includes(search.toLowerCase());

  const filteredKpi = data?.kpiCards.filter(k => matchesSearch(k.label)) ?? [];
  const filteredFunnel = data?.funnelData.filter(f => matchesSearch(f.label)) ?? [];
  const filteredCategories = data?.revenueByCategory.filter(c => matchesSearch(c.name)) ?? [];
  const filteredMarkets = data?.topMarkets.filter(m => matchesSearch(m.country)) ?? [];
  const filteredAi = data?.aiFeatures.filter(a => matchesSearch(a.name)) ?? [];

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-44 bg-[#1a1d2e] flex flex-col py-4 px-3 flex-shrink-0">
        <div className="flex items-center gap-2 mb-8 px-1">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">MySite</div>
            <div className="text-gray-400 text-[9px] uppercase tracking-wider">Admin Console</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                activeNav === label
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={14} />{label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => setShowSettings(true)}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-1.5 rounded-md transition-colors"
        >
          Upgrade Plan
        </button>
        <div className="mt-3 space-y-1">
          <button
            onClick={handleHelpCenter}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-xs rounded-lg hover:bg-white/10"
          >
            <HelpCircle size={13} />Help Center
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-xs rounded-lg hover:bg-white/10"
          >
            <LogOut size={13} />Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto flex flex-col">

        {/* ── Header ── */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-800">{PAGE_TITLES[activeNav] ?? activeNav}</h1>
            {lastUpdated && activeNav === "Analytics" && (
              <span className="text-[10px] text-gray-400">Updated {lastUpdated}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            {showSearch ? (
              <div className="flex items-center gap-1.5 border border-indigo-300 rounded-lg px-3 py-1.5 bg-white shadow-sm">
                <Search size={12} className="text-gray-400" />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search metrics…"
                  className="text-xs outline-none w-40 text-gray-700 placeholder-gray-400"
                />
                <button onClick={() => { setSearch(""); setShowSearch(false); }}>
                  <X size={12} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                title="Search"
              >
                <Search size={16} />
              </button>
            )}

            {/* Refresh */}
            {activeNav === "Analytics" && (
              <button
                onClick={() => fetchData(range, true)}
                disabled={refreshing}
                className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Refreshing…" : "Refresh"}
              </button>
            )}

            {/* Date range picker */}
            {activeNav === "Analytics" && (
              <div className="relative" ref={rangeRef}>
                <button
                  onClick={() => setShowRange(v => !v)}
                  className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  <Calendar size={13} />
                  {RANGE_LABELS[range]}
                  <ChevronDown size={11} className={`transition-transform ${showRange ? "rotate-180" : ""}`} />
                </button>
                {showRange && (
                  <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-44 z-30">
                    {(Object.entries(RANGE_LABELS) as [Range, string][]).map(([key, lbl]) => (
                      <button
                        key={key}
                        onClick={() => handleRangeSelect(key)}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition-colors ${
                          range === key ? "text-indigo-600 font-semibold bg-indigo-50" : "text-gray-700"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifs(v => !v); setShowSettings(false); setShowProfile(false); }}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl w-72 z-30">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-800">Notifications</span>
                    <button onClick={markAllRead} className="text-[10px] text-indigo-600 hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifs.map(n => (
                      <div
                        key={n.id}
                        onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                        className={`flex gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? "bg-indigo-50/40" : ""}`}
                      >
                        <NotifIcon type={n.type} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{n.title}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{n.body}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                        </div>
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0 mt-1" />}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowNotifs(false)}
                    className="w-full text-center text-[10px] text-indigo-600 py-2 hover:bg-gray-50"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => { setShowSettings(v => !v); setShowNotifs(false); setShowProfile(false); }}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                <Settings size={16} />
              </button>
              {showSettings && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl w-64 z-30">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-800">Settings</span>
                  </div>
                  <div className="p-4 space-y-4">
                    {/* Auto refresh toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-700">Auto Refresh</p>
                        <p className="text-[10px] text-gray-400">Refresh data every 60s</p>
                      </div>
                      <button
                        onClick={() => setAutoRefresh(v => !v)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${autoRefresh ? "bg-indigo-600" : "bg-gray-200"}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${autoRefresh ? "translate-x-4" : ""}`} />
                      </button>
                    </div>
                    {/* Email notifs toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-700">Email Notifications</p>
                        <p className="text-[10px] text-gray-400">Weekly digest emails</p>
                      </div>
                      <button
                        onClick={() => setEmailNotifs(v => !v)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${emailNotifs ? "bg-indigo-600" : "bg-gray-200"}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${emailNotifs ? "translate-x-4" : ""}`} />
                      </button>
                    </div>
                    {/* Dark mode toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-700">Dark Mode</p>
                        <p className="text-[10px] text-gray-400">Toggle dark theme</p>
                      </div>
                      <button
                        onClick={() => setDarkMode(v => !v)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${darkMode ? "bg-indigo-600" : "bg-gray-200"}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${darkMode ? "translate-x-4" : ""}`} />
                      </button>
                    </div>
                    <button
                      onClick={() => { fetchData(range); setShowSettings(false); }}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-2 rounded-lg transition-colors"
                    >
                      Save & Refresh Data
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setShowProfile(v => !v); setShowNotifs(false); setShowSettings(false); }}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">AR</div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-gray-700">Alex Rivera</div>
                  <div className="text-[10px] text-gray-400">SUPER-ADMIN</div>
                </div>
              </button>
              {showProfile && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl w-52 z-30">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">AR</div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Alex Rivera</p>
                      <p className="text-[10px] text-gray-400">alex@mysite.com</p>
                    </div>
                  </div>
                  <div className="py-1">
                    {[
                      { label: "My Profile",        action: () => { setActiveNav("User Management"); setShowProfile(false); } },
                      { label: "Account Settings",  action: () => { setShowProfile(false); setShowSettings(true); } },
                      { label: "Billing",           action: () => { setActiveNav("Financials"); setShowProfile(false); } },
                    ].map(item => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                    <div className="border-t border-gray-100 mt-1" />
                    <button
                      onClick={() => { setShowProfile(false); handleLogout(); }}
                      className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Non-analytics pages ── */}
        {activeNav !== "Analytics" && (
          <div className="flex-1">{renderOtherPage()}</div>
        )}

        {/* ── Analytics content ── */}
        {activeNav === "Analytics" && (
          <>
            {/* Error banner */}
            {error && (
              <div className="mx-5 mt-4 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl flex items-center justify-between">
                <span>⚠️ Failed to load data: {error}</span>
                <button onClick={() => fetchData(range)} className="underline ml-4">Retry</button>
              </div>
            )}

            {/* Search hint */}
            {search && (
              <div className="mx-5 mt-3 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-4 py-2 rounded-xl flex items-center justify-between">
                <span>Filtering results for <strong>"{search}"</strong></span>
                <button onClick={() => setSearch("")} className="underline ml-4">Clear</button>
              </div>
            )}

            <div className="p-5 space-y-4">

              {/* ── Summary derived stats ── */}
              {!loading && data?.summaryStats && !search && (
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Conversion Rate",   value: `${data.summaryStats.conversionRate}%`,       sub: "visits → checkout" },
                    { label: "Cart Abandon Rate", value: `${data.summaryStats.cartAbandonRate}%`,      sub: "cart → no purchase" },
                    { label: "Avg Session",       value: `${data.summaryStats.avgSession} min`,        sub: "across all days" },
                    { label: "Revenue / User",    value: `$${data.summaryStats.revenuePerUser}`,       sub: "total ÷ active users" },
                  ].map(s => (
                    <div key={s.label} className="bg-indigo-600 rounded-xl px-4 py-3">
                      <p className="text-[10px] text-indigo-200 uppercase tracking-wider mb-1">{s.label}</p>
                      <p className="text-lg font-bold text-white">{s.value}</p>
                      <p className="text-[10px] text-indigo-300 mt-0.5">{s.sub}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── KPI Row ── */}
              <div className="grid grid-cols-6 gap-3">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 space-y-2">
                        <Skeleton className="h-3 w-16" /><Skeleton className="h-6 w-20" /><Skeleton className="h-3 w-12" />
                      </div>
                    ))
                  : (search ? filteredKpi : data?.kpiCards ?? []).map(({ label, value, change, up, neutral }) => (
                      <div key={label} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{label}</div>
                        <div className="text-lg font-bold text-gray-800">{value}</div>
                        <div className={`text-[11px] font-semibold flex items-center gap-0.5 mt-1 ${neutral?"text-gray-400":up?"text-green-500":"text-red-500"}`}>
                          {neutral?<Minus size={10}/>:up?<TrendingUp size={10}/>:<TrendingDown size={10}/>}
                          {change}
                        </div>
                        <div className="mt-2 h-0.5 bg-gray-100 rounded-full">
                          <div className={`h-0.5 rounded-full ${up?"bg-indigo-500":neutral?"bg-gray-300":"bg-red-400"}`} style={{width:"70%"}} />
                        </div>
                      </div>
                    ))
                }
              </div>

              {/* ── Growth Chart ── */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h2 className="font-bold text-gray-800">Growth Overview</h2>
                    <p className="text-xs text-gray-400">Platform user acquisition vs previous period — {RANGE_LABELS[range]}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="w-3 h-1 rounded bg-indigo-500 inline-block" />Current Period
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="w-5 border-t-2 border-dashed border-gray-400 inline-block" />Previous Period
                    </span>
                  </div>
                </div>
                {loading ? <Skeleton className="h-[220px] w-full mt-3" /> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={data?.growthChartData ?? []}>
                      <defs>
                        <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{fontSize:10,fill:"#9ca3af"}} axisLine={false} tickLine={false}/>
                      <YAxis hide/>
                      <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:"none",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}/>
                      <Area type="monotone" dataKey="current"  stroke="#6366f1" strokeWidth={3}   fill="url(#gradCurrent)" name="Current Period"/>
                      <Area type="monotone" dataKey="previous" stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="4 4" fill="none" name="Previous Period"/>
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* ── Middle Row ── */}
              <div className="grid grid-cols-3 gap-4">

                {/* Conversion Funnel */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h3 className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider mb-4">Conversion Funnel</h3>
                  {loading
                    ? Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-9 w-full mb-3"/>)
                    : (search ? filteredFunnel : data?.funnelData ?? []).map(({label,value,pct,bar})=>(
                        <div key={label} className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-600">{label}</span>
                            <span className="text-xs text-gray-400">{(value/1000).toFixed(0)}K</span>
                          </div>
                          <div className="relative h-7 bg-indigo-50 rounded-lg overflow-hidden">
                            <div className="absolute left-0 top-0 h-full bg-indigo-600 rounded-lg transition-all" style={{width:bar}}/>
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white z-10">{pct}%</span>
                          </div>
                        </div>
                      ))
                  }
                </div>

                {/* Revenue by Category */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h3 className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider mb-4">Revenue by Category</h3>
                  {loading
                    ? Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-8 w-full mb-3"/>)
                    : (search ? filteredCategories : data?.revenueByCategory ?? []).map(({name,value,color})=>(
                        <div key={name} className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-700 font-medium">{name}</span>
                            <span className="text-xs font-semibold text-gray-700">${(value/1_000_000).toFixed(1)}M</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full">
                            <div className="h-1.5 rounded-full transition-all" style={{
                              width:`${(value/Math.max(...(data?.revenueByCategory.map(r=>r.value)??[1])))*100}%`,
                              background:color,
                            }}/>
                          </div>
                        </div>
                      ))
                  }
                </div>

                {/* Top Markets */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h3 className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider mb-4">Top Global Markets</h3>
                  {loading
                    ? Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-8 w-full mb-3"/>)
                    : (search ? filteredMarkets : data?.topMarkets ?? []).map(({country,pct,flag,color})=>(
                        <div key={country} className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{flag}</span>
                              <span className="text-xs font-medium text-gray-700">{country}</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-700">{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full">
                            <div className={`h-1.5 rounded-full ${color} transition-all`} style={{width:`${pct}%`}}/>
                          </div>
                        </div>
                      ))
                  }
                </div>
              </div>

              {/* ── Engagement + Retention ── */}
              <div className="grid grid-cols-2 gap-4">
                {/* User Engagement */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="font-bold text-gray-800">User Engagement</h2>
                      {data?.summaryStats && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Peak day: <span className="font-semibold text-indigo-600">{data.summaryStats.peakDay}</span>
                          {" · "}{data.summaryStats.totalViews.toLocaleString()} total views
                        </p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"/>Session (min)
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>Page Views
                      </span>
                    </div>
                  </div>
                  {loading ? <Skeleton className="h-[180px] w-full"/> : (
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={data?.engagementData??[]} barGap={2}>
                        <XAxis dataKey="day" tick={{fontSize:10,fill:"#9ca3af"}} axisLine={false} tickLine={false}/>
                        <YAxis hide/>
                        <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:"none",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}/>
                        <Bar dataKey="session" fill="#6366f1" radius={[3,3,0,0]} name="Session (min)"/>
                        <Bar dataKey="views"   fill="#86efac" radius={[3,3,0,0]} name="Page Views"/>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Retention Cohort */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h2 className="font-bold text-gray-800 mb-4">Retention Cohort</h2>
                  {loading ? <Skeleton className="h-[140px] w-full"/> : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-[10px] uppercase text-gray-400 font-semibold">
                            <th className="text-left pb-2 pr-3">Cohort</th>
                            {["Month 1","Month 2","Month 3","Month 4","Month 5"].map(m=>(
                              <th key={m} className="text-center pb-2 px-1">{m}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {data?.cohortData.map(({cohort,months})=>(
                            <tr key={cohort}>
                              <td className="text-xs text-gray-600 pr-3 py-1 font-medium whitespace-nowrap">{cohort}</td>
                              {months.map((v,i)=>(
                                <td key={i} className="px-1 py-1">
                                  <div className={`rounded text-center text-xs font-semibold py-1 px-2 ${cohortColor(v)}`}>
                                    {v!==null?`${v}%`:"-"}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* ── AI Adoption + Projections ── */}
              <div className="grid grid-cols-2 gap-4">
                {/* AI Features */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-gray-800">AI Feature Adoption</h2>
                    <span className="bg-indigo-100 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Zap size={9}/>New Updates
                    </span>
                  </div>
                  {loading
                    ? Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-14 w-full mb-4"/>)
                    : (search ? filteredAi : data?.aiFeatures??[]).map(({name,desc,pct,change,color})=>(
                        <div key={name} className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Zap size={16} className="text-indigo-600"/>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs font-semibold text-gray-800">{name}</span>
                              <span className="text-xs font-bold text-gray-700">{pct}%</span>
                            </div>
                            <div className="text-[10px] text-gray-400 mb-1.5">{desc}</div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full">
                              <div className={`h-1.5 rounded-full ${color}`} style={{width:`${pct}%`}}/>
                            </div>
                          </div>
                          <span className="text-[10px] text-green-500 font-semibold whitespace-nowrap">{change}</span>
                        </div>
                      ))
                  }
                </div>

                {/* Revenue Projections */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h2 className="font-bold text-gray-800 mb-4">Revenue Projections</h2>
                  {loading ? (
                    <><Skeleton className="h-[120px] w-full mb-4"/><Skeleton className="h-[80px] w-full"/></>
                  ) : (
                    <>
                      <div className="mb-4">
                        <ResponsiveContainer width="100%" height={120}>
                          <AreaChart data={data?.projectionChart??[]}>
                            <defs>
                              <linearGradient id="gradProj" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="q" tick={{fontSize:10,fill:"#9ca3af"}} axisLine={false} tickLine={false}/>
                            <YAxis hide/>
                            <Tooltip formatter={(v:number)=>`$${v}M`} contentStyle={{fontSize:12,borderRadius:8,border:"none"}}/>
                            <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2} fill="url(#gradProj)" strokeDasharray="5 3" name="Projected"/>
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <table className="w-full">
                        <thead>
                          <tr className="text-[10px] uppercase text-gray-400 font-semibold border-b border-gray-100">
                            <th className="text-left pb-2">Quarter</th>
                            <th className="text-center pb-2">Projected</th>
                            <th className="text-right pb-2">Growth</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.projections.map(({quarter,projected,growth})=>(
                            <tr key={quarter} className="border-b border-gray-50">
                              <td className="py-2 text-xs text-gray-600">{quarter}</td>
                              <td className="py-2 text-xs font-semibold text-gray-800 text-center">{projected}</td>
                              <td className="py-2 text-right">
                                <span className="text-[11px] font-bold text-green-500">{growth}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              </div>

            </div>
          </>
        )}
      </main>

      {/* ── Click-away overlay to close all dropdowns ── */}
      {(showNotifs || showSettings || showProfile || showRange) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => { setShowNotifs(false); setShowSettings(false); setShowProfile(false); setShowRange(false); }}
        />
      )}
    </div>
  );
}