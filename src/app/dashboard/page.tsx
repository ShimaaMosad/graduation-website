"use client";
import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from "react";
import {
  Users, Briefcase, DollarSign, AlertTriangle, Star, Clock,
  MessageSquare, BadgeCheck, TrendingUp, Search, Calendar, Bell,
  Settings, HelpCircle, LogOut, LayoutDashboard, BarChart2,
  ShieldAlert, UserCog, CreditCard, ScrollText, ChevronDown,
  ChevronLeft, ChevronRight, Trash2, EyeOff, X, CheckCircle,
  RefreshCw, LucideIcon,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────
type FlagSeverity = "URGENT" | "HIGH" | "MEDIUM";
type UserType = "FREELANCER" | "CLIENT" | "PARTNER";

interface StatCard {
  label: string; value: string; change: string;
  iconName: string; color: string; bg: string; urgent: boolean;
}
interface GrowthPoint { month: string; revenue: number; growth: number; }
interface DistPoint    { name: string; value: number; color: string; }
interface RegUser {
  id: string; name: string; email: string; joined: string;
  type: UserType; initials: string; verified: boolean;
}
interface FlaggedItem {
  id: string; title: string; refId: string;
  description: string; severity: FlagSeverity; type: string;
}
interface Freelancer {
  id: string; name: string; title: string;
  earned: string; rating: number; avatarGradient: string; initials: string;
}
interface SysHealth {
  apiStatus: string; cpuLoad: string; memory: string; dbLatency: string;
  cpuHealthy: boolean; memHealthy: boolean; dbHealthy: boolean;
}
interface ApiData {
  statsCards: StatCard[];
  growthData: GrowthPoint[];
  distributionData: DistPoint[];
  recentRegistrations: RegUser[];
  flaggedItems: FlaggedItem[];
  newFlaggedCount: number;
  topFreelancers: Freelancer[];
  totalUsers: number;
  systemHealth: SysHealth;
}

// ── Icon registry ─────────────────────────────────────────────────
const iconMap: Record<string, LucideIcon> = {
  Users, Briefcase, DollarSign, AlertTriangle, Star,
  Clock, MessageSquare, BadgeCheck, TrendingUp,
};

// ── Nav items ─────────────────────────────────────────────────────
const NAV = [
  { label: "Dashboard",       icon: LayoutDashboard },
  { label: "Analytics",       icon: BarChart2       },
  { label: "Moderation",      icon: ShieldAlert     },
  { label: "User Management", icon: UserCog         },
  { label: "Financials",      icon: CreditCard      },
  { label: "System Logs",     icon: ScrollText      },
];

const CATEGORIES = ["UI/UX DESIGN", "WEB DEV", "COPYWRITING", "MARKETING"];

// ── Skeleton ──────────────────────────────────────────────────────
function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

// ── Toast ─────────────────────────────────────────────────────────
function Toast({ msg, isError }: { msg: string; isError?: boolean }) {
  return (
    <div className={`fixed top-4 right-4 z-50 text-white text-sm px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 ${isError ? "bg-red-600" : "bg-green-600"}`}>
      {isError ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
      {msg}
    </div>
  );
}

// ── Notifications panel ───────────────────────────────────────────
const NOTIFS = [
  { id: 1, text: "12 new flagged items need review",        time: "2 min ago",  unread: true  },
  { id: 2, text: "Platform revenue hit $284k this month",   time: "18 min ago", unread: true  },
  { id: 3, text: "New verified freelancer: Mia Volkov",     time: "1 hr ago",   unread: true  },
  { id: 4, text: "System health: All services operational", time: "3 hr ago",   unread: false },
];
function NotifPanel({ onClose }: { onClose: () => void }) {
  const [notes, setNotes] = useState(NOTIFS);
  return (
    <div className="absolute top-12 right-10 z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl w-80 overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-bold text-gray-800 text-sm">Notifications</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setNotes((n) => n.map((x) => ({ ...x, unread: false })))} className="text-indigo-600 text-xs hover:underline">Mark all read</button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
        </div>
      </div>
      {notes.map((n) => (
        <div key={n.id} onClick={() => setNotes((p) => p.map((x) => x.id === n.id ? { ...x, unread: false } : x))}
          className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 flex items-start gap-3 ${n.unread ? "bg-indigo-50/40" : ""}`}>
          <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${n.unread ? "bg-indigo-500" : "opacity-0"}`} />
          <div>
            <p className={`text-xs ${n.unread ? "font-semibold text-gray-800" : "text-gray-600"}`}>{n.text}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
          </div>
        </div>
      ))}
      <div className="px-4 py-2 text-center">
        <button className="text-indigo-600 text-xs hover:underline">View all notifications</button>
      </div>
    </div>
  );
}

// ── Date range picker ─────────────────────────────────────────────
function DatePicker({ onClose }: { onClose: (r?: { from: string; to: string }) => void }) {
  const [from, setFrom] = useState(""); const [to, setTo] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Filter by Date Range</h3>
          <button onClick={() => onClose()} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>
        <div className="space-y-3">
          <div><label className="text-xs text-gray-500 mb-1 block">From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div>
          <div><label className="text-xs text-gray-500 mb-1 block">To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onClose()} className="flex-1 border border-gray-200 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => from && to ? onClose({ from, to }) : onClose()} className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded-lg hover:bg-indigo-700">Apply</button>
        </div>
      </div>
    </div>
  );
}

// ── Upgrade modal ─────────────────────────────────────────────────
function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Upgrade Plan</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>
        <p className="text-sm text-gray-600">Unlock the full power of MySite Admin with our Enterprise+ plan.</p>
        <ul className="space-y-2">
          {["Unlimited user management seats", "Advanced fraud detection AI", "Custom webhook & API access", "Dedicated 24/7 support line", "White-label reporting exports"].map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle size={14} className="text-indigo-500" />{f}</li>
          ))}
        </ul>
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
          Upgrade Now — $149/mo
        </button>
      </div>
    </div>
  );
}

// ── Time-range dropdown ───────────────────────────────────────────
const TIME_RANGES = ["Last 6 Months", "Last 3 Months", "Last Month", "This Week"];

// ── Main Dashboard Page ───────────────────────────────────────────
export default function DashboardPage() {
    const router = useRouter();
  
  const [activeNav, setActiveNav]         = useState("Dashboard");
  const [data, setData]                   = useState<ApiData | null>(null);
  const [flaggedItems, setFlaggedItems]   = useState<FlaggedItem[]>([]);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [toast, setToast]                 = useState<{ msg: string; isError?: boolean } | null>(null);

  // Freelancer pagination
  const [flPage, setFlPage]               = useState(0);
  const FL_PER_PAGE = 5;

  // UI panels
  const [showBell, setShowBell]           = useState(false);
  const [showCalendar, setShowCalendar]   = useState(false);
  const [showUpgrade, setShowUpgrade]     = useState(false);
  const [showTimeRange, setShowTimeRange] = useState(false);
  const [selectedRange, setSelectedRange] = useState("Last 6 Months");
  const [dateRange, setDateRange]         = useState<{ from: string; to: string } | null>(null);

  // Search
  const [searchQuery, setSearchQuery]     = useState("");
  const [showAllUsers, setShowAllUsers]   = useState(false);

  const timeRangeRef = useRef<HTMLDivElement>(null);

  // ── Toast helper ────────────────────────────────────────────────
  const showToast = useCallback((msg: string, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Fetch data ──────────────────────────────────────────────────
  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError(null);
      const res = await fetch("/api/dashboard2");
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json: ApiData = await res.json();
      setData(json);
      setFlaggedItems(json.flaggedItems);
      if (isRefresh) showToast("Data refreshed successfully");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      if (isRefresh) showToast(msg, true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Mutations (POST) ─────────────────────────────────────────────
  const mutate = useCallback(async (type: string, id: string, successMsg: string) => {
    try {
      const res = await fetch("/api/dashboard2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const result = await res.json();
      if (result.success) {
        showToast(successMsg);
        const fresh: ApiData = result.freshData;
        setData(fresh);
        setFlaggedItems(fresh.flaggedItems);
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Action failed", true);
    }
  }, [showToast]);

  // ── Flagged actions ──────────────────────────────────────────────
  const deleteFlag  = (id: string) => mutate("resolve_flag", id, "Item resolved and removed");
  const hideFlag    = (id: string) => mutate("hide_flag",    id, "Item hidden from queue");
  const reviewFlag  = (id: string, title: string) => {
    mutate("review_flag", id, `"${title}" marked for review`);
  };

  // ── Search filter ────────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    const list = data?.recentRegistrations ?? [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.type.toLowerCase().includes(q)
    );
  }, [data?.recentRegistrations, searchQuery]);

  const displayedUsers = showAllUsers ? filteredUsers : filteredUsers.slice(0, 6);

  // ── Freelancer pagination ────────────────────────────────────────
  const allFreelancers = data?.topFreelancers ?? [];
  const maxFlPage = Math.max(0, Math.ceil(allFreelancers.length / FL_PER_PAGE) - 1);
  const visibleFreelancers = allFreelancers.slice(flPage * FL_PER_PAGE, flPage * FL_PER_PAGE + FL_PER_PAGE);

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden" onClick={() => { setShowBell(false); setShowTimeRange(false); }}>

      {/* Modals */}
      {showCalendar && (
        <DatePicker onClose={(r) => { setShowCalendar(false); if (r) { setDateRange(r); showToast(`Date filter: ${r.from} → ${r.to}`); } }} />
      )}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} isError={toast.isError} />}

    
      {/* ── Main ───────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
<div className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">

  {/* LEFT SIDE */}
  <div className="flex items-center gap-3">
    
    {/* Search */}
    <div className="relative">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setShowAllUsers(true);
        }}
        onKeyDown={(e) => e.key === "Escape" && setSearchQuery("")}
        className="pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 w-44 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        placeholder="Search records…"
      />

      {searchQuery && (
        <button
          onClick={() => {
            setSearchQuery("");
            setShowAllUsers(false);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={12} />
        </button>
      )}
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="flex items-center gap-3">

    {/* Calendar */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        setShowCalendar(true);
      }}
      className={`p-2 rounded-lg transition-colors ${
        dateRange
          ? "bg-indigo-100 text-indigo-600"
          : "text-gray-500 hover:bg-gray-100"
      }`}
      title={
        dateRange
          ? `${dateRange.from} → ${dateRange.to}`
          : "Filter by date"
      }
    >
      <Calendar size={16} />
    </button>

    {dateRange && (
      <button
        onClick={() => {
          setDateRange(null);
          showToast("Date filter cleared");
        }}
        className="text-[10px] text-indigo-600 hover:underline -ml-2"
      >
        clear
      </button>
    )}

    {/* Bell */}
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowBell((b) => !b);
        }}
        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative"
      >
        <Bell size={16} />

        {data && data.newFlaggedCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {showBell && (
        <NotifPanel onClose={() => setShowBell(false)} />
      )}
    </div>

    {/* Refresh */}
    <button
      onClick={() => fetchData(true)}
      disabled={refreshing}
      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50"
      title="Refresh data"
    >
      <RefreshCw
        size={16}
        className={refreshing ? "animate-spin" : ""}
      />
    </button>
  </div>
</div>

        <div className="p-5 space-y-5">

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm flex items-center gap-2">
              <AlertTriangle size={16} />{error} —{" "}
              <button onClick={() => fetchData()} className="underline font-semibold">Retry</button>
            </div>
          )}

          {/* ── Stats Grid ─────────────────────────────────────── */}
          <div className="grid grid-cols-4 gap-3">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
                    <Sk className="h-9 w-9 rounded-lg" />
                    <Sk className="h-3 w-24" />
                    <Sk className="h-6 w-20" />
                  </div>
                ))
              : (data?.statsCards ?? []).map((s) => {
                  const Icon = iconMap[s.iconName] ?? TrendingUp;
                  return (
                    <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center`}>
                          <Icon size={18} className={s.color} />
                        </div>
                        <span className={`text-xs font-semibold ${s.urgent ? "text-red-500 bg-red-50 px-2 py-0.5 rounded-full" : "text-green-600"}`}>
                          {s.change}
                        </span>
                      </div>
                      <div className="text-gray-500 text-xs mb-1">{s.label}</div>
                      <div className="text-gray-800 text-xl font-bold">{s.value}</div>
                    </div>
                  );
                })}
          </div>

          {/* ── Charts Row ─────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4">

            {/* Growth Chart */}
            <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h2 className="font-bold text-gray-800">Platform Growth & Revenue</h2>
                  <p className="text-xs text-gray-400">Comparison of user acquisition vs monthly recurring revenue</p>
                </div>
                {/* Time range dropdown */}
                <div className="relative" ref={timeRangeRef}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowTimeRange((v) => !v); }}
                    className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                  >
                    {selectedRange} <ChevronDown size={12} />
                  </button>
                  {showTimeRange && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 w-40 py-1" onClick={(e) => e.stopPropagation()}>
                      {TIME_RANGES.map((r) => (
                        <button key={r} onClick={() => { setSelectedRange(r); setShowTimeRange(false); showToast(`Showing: ${r}`); }}
                          className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition-colors ${selectedRange === r ? "text-indigo-600 font-semibold" : "text-gray-700"}`}>
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {loading ? <Sk className="h-[220px] w-full mt-2" /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data?.growthData ?? []} barGap={4}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                    <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Monthly Revenue" />
                    <Line type="monotone" dataKey="growth" stroke="#f59e0b" strokeWidth={2} dot={false} name="User Growth %" />
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div className="flex gap-4 mt-2 justify-center">
                <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />Monthly Revenue</span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />User Growth (%)</span>
              </div>
            </div>

            {/* User Distribution */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-4">User Distribution</h2>
              {loading ? (
                <div className="space-y-3">
                  <Sk className="h-36 w-36 rounded-full mx-auto" />
                  {Array.from({ length: 3 }).map((_, i) => <Sk key={i} className="h-4 w-full" />)}
                </div>
              ) : (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="relative w-36 h-36">
                      <PieChart width={144} height={144}>
                        <Pie data={data?.distributionData ?? []} cx={68} cy={68} innerRadius={44} outerRadius={66} dataKey="value" strokeWidth={0}>
                          {(data?.distributionData ?? []).map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                      </PieChart>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-lg font-bold text-gray-800">
                          {data ? (data.totalUsers >= 1000 ? `${(data.totalUsers / 1000).toFixed(1)}k` : data.totalUsers) : "—"}
                        </span>
                        <span className="text-xs text-gray-400">Total</span>
                      </div>
                    </div>
                  </div>
                  {(data?.distributionData ?? []).map(({ name, value, color }) => (
                    <div key={name} className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />
                        <span className="text-xs text-gray-600">{name}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{value}%</span>
                    </div>
                  ))}
                  <div className="mt-4">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">Top Categories</div>
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORIES.map((c) => (
                        <button key={c} onClick={() => { setSearchQuery(c.toLowerCase()); setShowAllUsers(true); showToast(`Filtering by: ${c}`); }}
                          className="bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 text-gray-600 text-[10px] px-2 py-1 rounded font-medium transition-colors cursor-pointer">
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Bottom Row ─────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4">

            {/* Recent Registrations */}
            <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-gray-800">Recent Registrations</h2>
                  {searchQuery && (
                    <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">
                      {filteredUsers.length} result{filteredUsers.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <button onClick={() => setShowAllUsers((v) => !v)}
                  className="text-indigo-600 text-xs font-semibold hover:underline flex items-center gap-1">
                  {showAllUsers ? "Show Less" : `View All Users (${filteredUsers.length})`}
                  <ChevronRight size={12} className={`transition-transform ${showAllUsers ? "rotate-90" : ""}`} />
                </button>
              </div>
              <div className="grid grid-cols-4 text-[10px] uppercase tracking-wider text-gray-400 font-semibold border-b border-gray-100 pb-2 mb-2">
                <span>User</span><span>Email</span><span>Date Joined</span><span>Type</span>
              </div>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 py-2.5 border-b border-gray-50">
                      {Array.from({ length: 4 }).map((__, j) => <Sk key={j} className="h-4 w-full" />)}
                    </div>
                  ))
                : displayedUsers.length === 0
                ? <div className="py-6 text-center text-sm text-gray-400">No users match your search.</div>
                : displayedUsers.map(({ id, name, email, joined, type, initials, verified }) => (
                    <div key={id} className="grid grid-cols-4 items-center py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg px-1 transition-colors cursor-pointer"
                      onClick={() => showToast(`Viewing profile: ${name}`)}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">{initials}</div>
                        <div>
                          <span className="text-xs font-medium text-gray-700 block">{name}</span>
                          {verified && <span className="text-[9px] text-teal-600 font-semibold">✓ Verified</span>}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 truncate pr-2">{email}</span>
                      <span className="text-xs text-gray-500">{joined}</span>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${type === "FREELANCER" ? "bg-blue-50 text-blue-600" : type === "CLIENT" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"}`}>
                          {type}
                        </span>
                        <button onClick={(e) => { e.stopPropagation(); mutate("hide_user", id, `${name} hidden`); }}
                          className="p-1 text-gray-300 hover:text-red-400 rounded transition-colors" title="Hide user">
                          <EyeOff size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
            </div>

            {/* Right Column */}
            <div className="space-y-4">

              {/* Flagged Content */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-bold text-gray-800">Flagged Content</h2>
                  {loading
                    ? <Sk className="h-5 w-14 rounded-full" />
                    : <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        {data?.newFlaggedCount ?? 0} NEW
                      </span>}
                </div>

                {/* Show first 2 active items */}
                {loading
                  ? Array.from({ length: 2 }).map((_, i) => <Sk key={i} className="h-20 w-full mb-2 rounded-xl" />)
                  : flaggedItems.slice(0, 2).map((item) => {
                      const borderColor = item.severity === "URGENT"
                        ? "border-red-500 bg-red-50"
                        : item.severity === "HIGH"
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-400 bg-gray-50";
                      return (
                        <div key={item.id} className={`border-l-4 p-3 rounded-r-lg mb-2 ${borderColor}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold text-gray-800">{item.title}</span>
                            <span className={`text-[10px] font-bold ${item.severity === "URGENT" ? "text-red-600" : item.severity === "HIGH" ? "text-amber-600" : "text-gray-600"}`}>
                              {item.severity}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-500 mb-2">{item.refId} · {item.description}</div>
                          <div className="flex gap-2">
                            <button onClick={() => deleteFlag(item.id)}
                              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-[10px] px-2.5 py-1 rounded transition-colors">
                              <Trash2 size={10} />Delete
                            </button>
                            <button onClick={() => hideFlag(item.id)}
                              className="flex items-center gap-1 bg-gray-400 hover:bg-gray-500 text-white text-[10px] px-2.5 py-1 rounded transition-colors">
                              <EyeOff size={10} />Hide
                            </button>
                            <button onClick={() => reviewFlag(item.id, item.title)}
                              className="text-[10px] text-gray-500 hover:text-gray-700 border border-gray-200 px-2.5 py-1 rounded transition-colors">
                              Review
                            </button>
                          </div>
                        </div>
                      );
                    })}

                {/* Remaining count */}
                {!loading && flaggedItems.length > 2 && (
                  <button onClick={() => { setActiveNav("Moderation"); showToast(`Navigating to Moderation — ${flaggedItems.length - 2} more items`); }}
                    className="w-full text-center text-[10px] text-indigo-600 hover:underline font-semibold py-1">
                    +{flaggedItems.length - 2} more flagged items → View in Moderation
                  </button>
                )}
              </div>

              {/* System Health */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-bold text-gray-800">System Health</h2>
                  <button onClick={() => fetchData(true)} className="text-[10px] text-indigo-600 hover:underline font-semibold">
                    Refresh
                  </button>
                </div>
                {loading
                  ? <div className="grid grid-cols-2 gap-2">{Array.from({ length: 4 }).map((_, i) => <Sk key={i} className="h-14 rounded-lg" />)}</div>
                  : (
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "API STATUS", value: data?.systemHealth.apiStatus ?? "—",    color: "text-green-600 bg-green-50" },
                        { label: "CPU LOAD",   value: data?.systemHealth.cpuLoad   ?? "—",    color: data?.systemHealth.cpuHealthy ? "text-gray-700 bg-gray-50" : "text-red-600 bg-red-50" },
                        { label: "MEMORY",     value: data?.systemHealth.memory    ?? "—",    color: data?.systemHealth.memHealthy ? "text-gray-700 bg-gray-50" : "text-amber-600 bg-amber-50" },
                        { label: "DB LATENCY", value: data?.systemHealth.dbLatency ?? "—",    color: data?.systemHealth.dbHealthy  ? "text-gray-700 bg-gray-50" : "text-amber-600 bg-amber-50" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className={`${color} rounded-lg p-2.5 text-center`}>
                          <div className="text-[9px] uppercase tracking-wider font-semibold opacity-60 mb-1">{label}</div>
                          <div className="text-sm font-bold">{value}</div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* ── Top Freelancers ─────────────────────────────────── */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-bold text-gray-800">Top Performing Freelancers</h2>
                {!loading && (
                  <p className="text-[10px] text-gray-400">
                    Page {flPage + 1} of {maxFlPage + 1} · {allFreelancers.length} total
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setFlPage((p) => Math.max(0, p - 1))} disabled={flPage === 0}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40">
                  <ChevronLeft size={14} />
                </button>
                <button onClick={() => setFlPage((p) => Math.min(maxFlPage, p + 1))} disabled={flPage >= maxFlPage}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Sk className="w-full aspect-square rounded-xl" />
                      <Sk className="h-3 w-3/4 mx-auto" />
                      <Sk className="h-3 w-1/2 mx-auto" />
                    </div>
                  ))
                : visibleFreelancers.map(({ id, name, title, earned, rating, avatarGradient, initials }) => (
                    <div key={id} className="text-center cursor-pointer group" onClick={() => showToast(`${name} — ${earned} earned · ★ ${rating}`)}>
                      <div className="relative mb-3">
                        <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white group-hover:scale-105 transition-transform`}>
                          <span className="text-2xl font-bold opacity-90">{initials}</span>
                        </div>
                        <div className="absolute top-2 right-2 bg-white text-xs font-bold text-gray-700 px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5">
                          <Star size={9} className="text-amber-400 fill-amber-400" />{rating}
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{name}</div>
                      <div className="text-[10px] text-gray-400">{title} · {earned} Earned</div>
                    </div>
                  ))}
            </div>
          </div>

        </div>

        <div className="text-center text-[11px] text-gray-400 py-4">
          © 2024 MySite Admin Console. All system parameters within normal operating range.
        </div>
      </main>
    </div>
  );
}