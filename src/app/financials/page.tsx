"use client";
import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from "react";
import {
  Search, Calendar, Bell, Settings, LayoutDashboard, BarChart2,
  ShieldAlert, UserCog, CreditCard, ScrollText, HelpCircle, LogOut,
  TrendingUp, DollarSign, Lock, Flag, AlertTriangle, MoreVertical,
  ChevronRight, X, CheckCircle, RefreshCw, ChevronDown, ChevronUp,
  LucideIcon,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { useRouter } from "next/navigation";
// ── Types ─────────────────────────────────────────────────────────
type RiskLevel = "LOW" | "HIGH RISK";
type TxAction = "Review" | "Flag" | "Dismiss" | "Freeze Account";

interface Transaction {
  id: string;
  sender: string;
  receiver: string;
  amount: string;
  date: string;
  time: string;
  risk: RiskLevel;
  senderInitials: string;
  flagged: boolean;
  reviewed: boolean;
}

interface FinancialStat {
  label: string;
  value: string;
  change: string;
  iconName: string;
  colorClass: string;
  bgClass: string;
  up: boolean;
  steady: boolean;
  alert: boolean;
}

interface ApiData {
  financialStats: FinancialStat[];
  revenueData: { month: string; gross: number; net: number }[];
  paymentMethods: { name: string; value: number; color: string }[];
  transactions: Transaction[];
  topEarners: { name: string; amount: string; category: string; color: string }[];
  alertBanner: { visible: boolean; message: string; detail: string };
  totalTxCount: number;
}

// ── Icon registry ─────────────────────────────────────────────────
const iconMap: Record<string, LucideIcon> = {
  TrendingUp, DollarSign, Lock, Flag,
};

// ── Nav items ─────────────────────────────────────────────────────
const navItems = [
  { label: "Dashboard",       icon: LayoutDashboard },
  { label: "Analytics",       icon: BarChart2       },
  { label: "Moderation",      icon: ShieldAlert     },
  { label: "User Management", icon: UserCog         },
  { label: "Financials",      icon: CreditCard      },
  { label: "System Logs",     icon: ScrollText      },
];

// ── Skeleton ──────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
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

// ── Date-range picker modal ───────────────────────────────────────
function DateRangePicker({ onClose }: { onClose: (range?: { from: string; to: string }) => void }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Filter by Date Range</h3>
          <button onClick={() => onClose()} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onClose()} className="flex-1 border border-gray-200 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => from && to ? onClose({ from, to }) : onClose()}
            className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded-lg hover:bg-indigo-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Notifications panel ───────────────────────────────────────────
const NOTIFICATIONS = [
  { id: 1, text: "2 new HIGH RISK transactions detected", time: "2 min ago", unread: true },
  { id: 2, text: "Escrow hold updated: $21,800.00",       time: "14 min ago", unread: true },
  { id: 3, text: "Platform revenue crossed $40k threshold", time: "1 hr ago", unread: false },
  { id: 4, text: "User @john_fake reported by 3 users",   time: "3 hr ago", unread: false },
];

function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const [notes, setNotes] = useState(NOTIFICATIONS);
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
        <div key={n.id} onClick={() => setNotes((prev) => prev.map((x) => x.id === n.id ? { ...x, unread: false } : x))}
          className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 flex items-start gap-3 ${n.unread ? "bg-indigo-50/40" : ""}`}>
          {n.unread && <span className="w-2 h-2 bg-indigo-500 rounded-full mt-1 flex-shrink-0" />}
          {!n.unread && <span className="w-2 h-2 flex-shrink-0" />}
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

// ── Upgrade modal ─────────────────────────────────────────────────
function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Upgrade to Pro</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>
        <p className="text-sm text-gray-600">Get access to advanced reporting, unlimited transaction history, custom alerts, and dedicated support.</p>
        <ul className="space-y-2">
          {["Advanced analytics & exports", "Real-time fraud detection AI", "Custom webhook integrations", "Priority support (24/7)"].map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle size={14} className="text-indigo-500" />{f}
            </li>
          ))}
        </ul>
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
          Upgrade Now — $49/mo
        </button>
      </div>
    </div>
  );
}

// ── Review modal (shows tx detail) ───────────────────────────────
function ReviewModal({ tx, onClose }: { tx: Transaction; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Review Transaction</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>
        <div className="space-y-2 text-sm">
          {[
            ["ID",       tx.id],
            ["Sender",   tx.sender],
            ["Receiver", tx.receiver],
            ["Amount",   tx.amount],
            ["Date",     `${tx.date} at ${tx.time}`],
            ["Risk",     tx.risk],
            ["Status",   tx.reviewed ? "Reviewed ✓" : tx.flagged ? "Flagged ⚠" : "Clear"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-gray-50 pb-1">
              <span className="text-gray-400 font-medium">{k}</span>
              <span className={`font-semibold ${v === "HIGH RISK" ? "text-red-600" : "text-gray-800"}`}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl text-sm">Close</button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function FinancialsPage() {
  const router = useRouter();
  const [activeNav, setActiveNav]       = useState("Financials");
  const [data, setData]                 = useState<ApiData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alertVisible, setAlertVisible] = useState(true);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [toast, setToast]               = useState<{ msg: string; isError?: boolean } | null>(null);
  const [openMenu, setOpenMenu]         = useState<string | null>(null);

  // UI state
  const [searchQuery, setSearchQuery]   = useState("");
  const [showAllTx, setShowAllTx]       = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showBell, setShowBell]         = useState(false);
  const [showUpgrade, setShowUpgrade]   = useState(false);
  const [reviewTx, setReviewTx]         = useState<Transaction | null>(null);
  const [dateRange, setDateRange]       = useState<{ from: string; to: string } | null>(null);
  const [sortCol, setSortCol]           = useState<"amount" | "date" | "risk" | null>(null);
  const [sortDir, setSortDir]           = useState<"asc" | "desc">("desc");

  const flaggedSectionRef = useRef<HTMLDivElement>(null);

  // ── Show toast ───────────────────────────────────────────────
  const showToast = (msg: string, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch data ───────────────────────────────────────────────
  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const res = await fetch("/api/financials");
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json: ApiData = await res.json();
      setData(json);
      setTransactions(json.transactions);
      setAlertVisible(json.alertBanner.visible);
      if (isRefresh) showToast("Data refreshed successfully");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      if (isRefresh) showToast(msg, true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Transaction action ───────────────────────────────────────
  const handleTxAction = useCallback(async (id: string, action: TxAction) => {
    setOpenMenu(null);
    if (action === "Review") {
      const tx = transactions.find((t) => t.id === id);
      if (tx) { setReviewTx(tx); return; }
    }
    try {
      const res = await fetch("/api/financials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const result = await res.json();
      if (result.success) {
        showToast(`${action} applied to ${id}`);
        // Sync from server's freshData
        const fresh: ApiData = result.freshData;
        setData(fresh);
        setTransactions(fresh.transactions);
        setAlertVisible(fresh.alertBanner.visible);
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Action failed", true);
    }
  }, [transactions]);

  // ── Search + date filter + sort ──────────────────────────────
  const filteredTx = useMemo(() => {
    let list = [...transactions];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.sender.toLowerCase().includes(q) ||
          t.receiver.toLowerCase().includes(q) ||
          t.amount.includes(q) ||
          t.risk.toLowerCase().includes(q)
      );
    }

    // Date range
    if (dateRange) {
      const from = new Date(dateRange.from).getTime();
      const to   = new Date(dateRange.to).getTime() + 86_400_000;
      list = list.filter((t) => {
        const d = new Date(`${t.date} 2024`).getTime();
        return d >= from && d <= to;
      });
    }

    // Sort
    if (sortCol) {
      list.sort((a, b) => {
        let av = 0, bv = 0;
        if (sortCol === "amount") {
          av = parseFloat(a.amount.replace(/[$,]/g, ""));
          bv = parseFloat(b.amount.replace(/[$,]/g, ""));
        } else if (sortCol === "date") {
          av = new Date(`${a.date} ${a.time}`).getTime();
          bv = new Date(`${b.date} ${b.time}`).getTime();
        } else if (sortCol === "risk") {
          av = a.risk === "HIGH RISK" ? 1 : 0;
          bv = b.risk === "HIGH RISK" ? 1 : 0;
        }
        return sortDir === "asc" ? av - bv : bv - av;
      });
    }

    return list;
  }, [transactions, searchQuery, dateRange, sortCol, sortDir]);

  const displayedTx = showAllTx ? filteredTx : filteredTx.slice(0, 4);

  const toggleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("desc"); }
  };

  const SortIcon = ({ col }: { col: typeof sortCol }) =>
    sortCol === col
      ? sortDir === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />
      : <ChevronDown size={10} className="opacity-30" />;

  // ── Scroll to flagged ────────────────────────────────────────
  const scrollToFlagged = () => {
    setAlertVisible(false);
    setSearchQuery("HIGH RISK");
    setShowAllTx(true);
    setTimeout(() => flaggedSectionRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden" onClick={() => { setOpenMenu(null); setShowBell(false); }}>

      {/* Modals */}
      {showCalendar && (
        <DateRangePicker onClose={(range) => { setShowCalendar(false); if (range) { setDateRange(range); showToast(`Date filter: ${range.from} → ${range.to}`); } }} />
      )}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      {reviewTx    && <ReviewModal tx={reviewTx} onClose={() => setReviewTx(null)} />}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} isError={toast.isError} />}

      {/* ── Sidebar ────────────────────────────────────────────── */}
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
  onClick={() => {
    setActiveNav(label);
    router.push(`/${label.toLowerCase().replace(" ", "")}`);
    showToast(`Navigated to ${label}`);
  }}              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${activeNav === label ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}>
              <Icon size={14} />{label}
            </button>
          ))}
        </nav>

        <div className="mt-4 bg-indigo-900/40 rounded-lg p-3 border border-indigo-800/30">
          <div className="text-indigo-300 text-[10px] mb-1 font-semibold">Upgrade Plan</div>
          <div className="text-gray-400 text-[10px] mb-2">Get advanced reporting tools</div>
          <button onClick={() => setShowUpgrade(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] py-1 rounded transition-colors">
            Upgrade
          </button>
        </div>

        <div className="mt-3 space-y-1">
          <button onClick={() => showToast("Opening Help Center…")}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-xs rounded-lg hover:bg-white/10">
            <HelpCircle size={13} />Help Center
          </button>
          <button onClick={() => showToast("Logging out…")}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-xs rounded-lg hover:bg-white/10">
            <LogOut size={13} />Logout
          </button>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto relative">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between z-10">
          <h1 className="text-xl font-bold text-gray-800">Transaction Monitoring</h1>
          <div className="flex items-center gap-3">

            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowAllTx(true); }}
                onKeyDown={(e) => e.key === "Escape" && setSearchQuery("")}
                className="pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 w-44 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Search transactions…"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Calendar */}
            <button onClick={(e) => { e.stopPropagation(); setShowCalendar(true); }}
              className={`p-2 rounded-lg transition-colors ${dateRange ? "bg-indigo-100 text-indigo-600" : "text-gray-500 hover:bg-gray-100"}`}
              title={dateRange ? `${dateRange.from} → ${dateRange.to}` : "Filter by date"}>
              <Calendar size={16} />
            </button>
            {dateRange && (
              <button onClick={() => { setDateRange(null); showToast("Date filter cleared"); }}
                className="text-[10px] text-indigo-600 hover:underline -ml-2">clear</button>
            )}

            {/* Bell */}
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setShowBell((b) => !b); }}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative">
                <Bell size={16} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              {showBell && <NotificationsPanel onClose={() => setShowBell(false)} />}
            </div>

            {/* Refresh / Settings */}
            <button onClick={() => fetchData(true)} disabled={refreshing}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              title="Refresh data">
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            </button>
            <button onClick={() => showToast("Settings panel coming soon")}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Settings size={16} />
            </button>

            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-gray-700"
              title="Admin User" onClick={() => showToast("Profile settings coming soon")}>
              AU
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm flex items-center gap-2">
              <AlertTriangle size={16} />
              {error} —{" "}
              <button onClick={() => fetchData()} className="underline font-semibold">Retry</button>
            </div>
          )}

          {/* Alert Banner */}
          {!loading && data?.alertBanner.visible && alertVisible && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-red-700">{data.alertBanner.message}</div>
                <div className="text-xs text-red-500">{data.alertBanner.detail}</div>
              </div>
              <button onClick={scrollToFlagged}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-lg font-semibold transition-colors">
                Review Alerts
              </button>
              <button onClick={() => setAlertVisible(false)} className="text-red-400 hover:text-red-600">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Stats Cards — fully computed from API */}
          <div className="grid grid-cols-4 gap-3">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))
              : (data?.financialStats ?? []).map((stat) => {
                  const Icon = iconMap[stat.iconName] ?? TrendingUp;
                  return (
                    <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-default">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{stat.label}</span>
                        <div className={`w-8 h-8 ${stat.bgClass} rounded-lg flex items-center justify-center`}>
                          <Icon size={15} className={stat.colorClass} />
                        </div>
                      </div>
                      <div className="text-xl font-bold text-gray-800 mb-1">{stat.value}</div>
                      <div className={`text-[11px] font-medium flex items-center gap-1 ${stat.alert ? "text-red-500" : stat.up ? "text-green-500" : "text-gray-400"}`}>
                        {stat.up && "↑"}{stat.alert && "⚠"} {stat.change}
                      </div>
                    </div>
                  );
                })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-4">

            {/* Revenue Chart */}
            <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800">Platform Revenue Overview</h2>
                <div className="flex gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded bg-indigo-500 inline-block" />Gross Volume</span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded bg-indigo-200 inline-block" />Net Revenue</span>
                </div>
              </div>
              {loading ? <Skeleton className="h-[200px] w-full" /> : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data?.revenueData ?? []} barGap={2}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      formatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    />
                    <Bar dataKey="gross" fill="#6366f1" radius={[3, 3, 0, 0]} name="Gross Volume" />
                    <Bar dataKey="net"   fill="#c7d2fe" radius={[3, 3, 0, 0]} name="Net Revenue"  />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-4">Payment Methods</h2>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-36 w-36 rounded-full mx-auto" />
                  {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
                </div>
              ) : (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="relative w-36 h-36">
                      <PieChart width={144} height={144}>
                        <Pie data={data?.paymentMethods ?? []} cx={68} cy={68} innerRadius={44} outerRadius={66} dataKey="value" strokeWidth={0}>
                          {(data?.paymentMethods ?? []).map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                      </PieChart>
                      {/* Center — real totalTxCount from API */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-lg font-bold text-gray-800">{data?.totalTxCount?.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400">TOTAL TX</span>
                      </div>
                    </div>
                  </div>
                  {(data?.paymentMethods ?? []).map(({ name, value, color }) => (
                    <div key={name} className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
                        <span className="text-xs text-gray-600">{name}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{value}%</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Live Transaction Stream */}
          <div ref={flaggedSectionRef} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-gray-800">Live Transaction Stream</h2>
                {searchQuery && (
                  <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">
                    {filteredTx.length} result{filteredTx.length !== 1 ? "s" : ""} for "{searchQuery}"
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowAllTx((v) => !v)}
                className="text-indigo-600 text-xs font-semibold flex items-center gap-1 hover:underline"
              >
                {showAllTx ? "Show Less" : `View All (${filteredTx.length})`}
                <ChevronRight size={12} className={`transition-transform ${showAllTx ? "rotate-90" : ""}`} />
              </button>
            </div>

            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                  <th className="px-4 py-3 text-left">Transaction ID</th>
                  <th className="px-4 py-3 text-left">Sender / Receiver</th>
                  <th className="px-4 py-3 text-left cursor-pointer hover:text-gray-600 select-none" onClick={() => toggleSort("amount")}>
                    <span className="flex items-center gap-1">Amount <SortIcon col="amount" /></span>
                  </th>
                  <th className="px-4 py-3 text-left cursor-pointer hover:text-gray-600 select-none" onClick={() => toggleSort("date")}>
                    <span className="flex items-center gap-1">Date <SortIcon col="date" /></span>
                  </th>
                  <th className="px-4 py-3 text-left cursor-pointer hover:text-gray-600 select-none" onClick={() => toggleSort("risk")}>
                    <span className="flex items-center gap-1">Risk Status <SortIcon col="risk" /></span>
                  </th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="border-t border-gray-50">
                        {Array.from({ length: 6 }).map((__, j) => (
                          <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                        ))}
                      </tr>
                    ))
                  : displayedTx.length === 0
                  ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                          No transactions match your search.
                        </td>
                      </tr>
                    )
                  : displayedTx.map((tx) => (
                      <tr key={tx.id}
                        className={`border-t border-gray-50 hover:bg-gray-50 transition-colors ${tx.flagged ? "bg-red-50" : tx.reviewed ? "bg-green-50/30" : ""}`}>
                        <td className="px-4 py-3 text-xs font-mono text-gray-600">{tx.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${tx.flagged ? "bg-red-500" : "bg-indigo-400"}`}>
                              {tx.senderInitials}
                            </div>
                            <span className={`text-xs ${tx.flagged ? "text-red-600 font-semibold" : "text-gray-600"}`}>
                              {tx.sender} → {tx.receiver}
                            </span>
                            {tx.reviewed && <span className="text-[9px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full">Reviewed</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-gray-800">{tx.amount}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{tx.date}, {tx.time}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${tx.risk === "HIGH RISK" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                            {tx.risk}
                          </span>
                        </td>
                        <td className="px-4 py-3 relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === tx.id ? null : tx.id); }}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          >
                            <MoreVertical size={14} />
                          </button>
                          {openMenu === tx.id && (
                            <div className="absolute right-4 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 w-44 py-1"
                              onClick={(e) => e.stopPropagation()}>
                              {(["Review", "Flag", "Dismiss", "Freeze Account"] as const).map((action) => (
                                <button key={action}
                                  onClick={() => handleTxAction(tx.id, action)}
                                  className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                                    action === "Freeze Account" ? "text-red-600" :
                                    action === "Flag"           ? "text-orange-600" :
                                    action === "Dismiss"        ? "text-green-600" :
                                    "text-gray-700"
                                  }`}>
                                  {action === "Review"         && <Search size={11} />}
                                  {action === "Flag"           && <Flag size={11} />}
                                  {action === "Dismiss"        && <CheckCircle size={11} />}
                                  {action === "Freeze Account" && <Lock size={11} />}
                                  {action}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>

            {/* Show more/less toggle at bottom */}
            {!loading && filteredTx.length > 4 && (
              <div className="border-t border-gray-100 p-3 text-center">
                <button onClick={() => setShowAllTx((v) => !v)}
                  className="text-indigo-600 text-xs font-semibold hover:underline flex items-center gap-1 mx-auto">
                  {showAllTx
                    ? <><ChevronUp size={12} /> Show less</>
                    : <><ChevronDown size={12} /> Show {filteredTx.length - 4} more transactions</>}
                </button>
              </div>
            )}
          </div>

          {/* Top Earners — sorted by earnings from API */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-4">Top Earning Freelancers</h2>
            <div className="grid grid-cols-5 gap-4">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="text-center space-y-2">
                      <Skeleton className="w-14 h-14 rounded-full mx-auto" />
                      <Skeleton className="h-3 w-20 mx-auto" />
                      <Skeleton className="h-4 w-16 mx-auto" />
                      <Skeleton className="h-3 w-14 mx-auto" />
                    </div>
                  ))
                : (data?.topEarners ?? []).map(({ name, amount, category, color }, idx) => (
                    <div key={name} className="text-center group cursor-pointer" onClick={() => showToast(`${name} — ${amount} in ${category}`)}>
                      <div className="relative inline-block mb-2">
                        {idx === 0 && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px]">🥇</span>
                        )}
                        <div className={`w-14 h-14 rounded-full ${color} text-white flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform`}>
                          {name.split(" ").map((n) => n[0]).join("")}
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-gray-800">{name}</div>
                      <div className="text-sm font-bold text-indigo-600 my-0.5">{amount}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">{category}</div>
                    </div>
                  ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}