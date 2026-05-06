"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, Calendar, Bell, Settings, LayoutDashboard, BarChart2,
  ShieldAlert, UserCog, CreditCard, ScrollText, HelpCircle, LogOut,
  Megaphone, Star, MessageSquare, Scale, Clock, CheckCircle,
  XCircle, AlertTriangle, ChevronDown, MoreHorizontal, BookOpen,
  ExternalLink, Ban, Shield, RefreshCw, X, ChevronRight,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────
type CaseType = "CRITICAL" | "WARNING" | "DISPUTE" | "SPAM";

interface ModerationCase {
  id: string; type: CaseType; refId: string; time: string;
  gigTitle?: string; seller?: string; category?: string;
  aiConfidence?: number; aiReason?: string;
  reviewText?: string; reviewer?: string; target?: string; flagCount?: number;
  disputeTitle?: string; clientName?: string; clientClaim?: string;
  freelancerName?: string; freelancerClaim?: string;
  orderAmount?: number; resolutionHours?: number;
  timeline?: { label: string; color: string }[];
  spamMessage?: string; spamReach?: number;
}

interface ModStat {
  label: string; value: number | string; change: string;
  icon: string; color: string; bg: string; down?: boolean;
}

interface Moderator { name: string; role: string; task: string; initials: string }
interface RecentAction { text: string; time: string; icon: string; color: string }

interface ModerationData {
  modStats: ModStat[];
  cases: ModerationCase[];
  tabs: string[];
  resolvedToday: number;
  resolvedTarget: number;
  avgResponseMin: number;
  accuracyRate: number;
  onlineModerators: Moderator[];
  recentActions: RecentAction[];
  badgeCount: number;
  generatedAt: string;
}

// ── Style maps ───────────────────────────────────────────────────
const caseTypeStyle: Record<CaseType, string> = {
  CRITICAL: "bg-red-100 text-red-700",
  WARNING:  "bg-amber-100 text-amber-700",
  DISPUTE:  "bg-blue-100 text-blue-700",
  SPAM:     "bg-purple-100 text-purple-700",
};
const caseTypeBorder: Record<CaseType, string> = {
  CRITICAL: "border-l-red-500",
  WARNING:  "border-l-amber-500",
  DISPUTE:  "border-l-blue-500",
  SPAM:     "border-l-purple-500",
};

// ── Icon resolver (API returns string names) ──────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  Megaphone, Star, MessageSquare, Scale, CheckCircle,
  Ban, Shield, XCircle, AlertTriangle, Clock,
};
const ResolveIcon = ({ name, ...props }: { name: string } & React.ComponentProps<typeof Shield>) => {
  const Icon = ICON_MAP[name] ?? Shield;
  return <Icon {...props} />;
};

// ── Skeleton ─────────────────────────────────────────────────────
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// ── Nav items ─────────────────────────────────────────────────────
const BASE_NAV = [
  { label: "Dashboard",       icon: LayoutDashboard },
  { label: "Analytics",       icon: BarChart2 },
  { label: "Moderation",      icon: ShieldAlert },
  { label: "User Management", icon: UserCog },
  { label: "Financials",      icon: CreditCard },
  { label: "System Logs",     icon: ScrollText },
];

// ── Tab filter mapping ────────────────────────────────────────────
function filterCases(cases: ModerationCase[], tabIdx: number): ModerationCase[] {
  if (tabIdx === 0) return cases;
  const map: Record<number, CaseType> = { 1: "CRITICAL", 2: "WARNING", 3: "DISPUTE", 4: "SPAM" };
  return cases.filter(c => c.type === map[tabIdx]);
}

// ── Confirm action helper ─────────────────────────────────────────
function useConfirm() {
  return (msg: string) => window.confirm(msg);
}

export default function ModerationPage() {
  const [activeNav,    setActiveNav]    = useState("Moderation");
  const [activeTab,    setActiveTab]    = useState(0);
  const [data,         setData]         = useState<ModerationData | null>(null);
  const [cases,        setCases]        = useState<ModerationCase[]>([]);
  const [resolvedCount,setResolvedCount]= useState(0);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [search,       setSearch]       = useState("");
  const [lastUpdated,  setLastUpdated]  = useState("");
  const [showMenu,     setShowMenu]     = useState<string | null>(null);    // case id for MoreHorizontal menu
  const [showNotifs,   setShowNotifs]   = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoRefresh,  setAutoRefresh]  = useState(true);
  const [dismissedSet, setDismissedSet] = useState<Set<string>>(new Set());
  const menuRef   = useRef<HTMLDivElement>(null);
  const confirm   = useConfirm();

  // ── Fetch ──────────────────────────────────────────────────
  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else           setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/moderation", { cache: "no-store" });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json: ModerationData = await res.json();
      setData(json);
      // Preserve local case removals across refreshes
      setCases(prev => {
        const removedIds = new Set(prev.length ? [] : []);
        // On first load, set from API; on refresh keep removed ones out
        if (prev.length === 0) return json.cases;
        const removedFromPrev = new Set(
          (data?.cases ?? []).filter(c => !prev.find(p => p.id === c.id)).map(c => c.id)
        );
        return json.cases.filter(c => !removedFromPrev.has(c.id));
      });
      setResolvedCount(json.resolvedToday);
      setLastUpdated(new Date(json.generatedAt).toLocaleTimeString());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => fetchData(true), 60_000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchData]);

  // Close menus on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(null);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Case actions ───────────────────────────────────────────
  const removeCase = useCallback((id: string, action: string, caseType: CaseType) => {
    const messages: Record<string, string> = {
      "Suspend Gig":         "Suspend this gig and notify the seller?",
      "Dismiss Flag":        "Dismiss this flag? This cannot be undone.",
      "Delete Review":       "Permanently delete this review?",
      "Request Context":     "Send a context request to the reviewer?",
      "Refund Client":       "Issue a full refund to the client?",
      "Release Funds":       "Release held funds to the freelancer?",
      "Escalate to Senior":  "Escalate this dispute to a senior moderator?",
      "Ban User Account":    "Permanently ban this user account?",
      "Shadow Ban":          "Shadow ban this user? They will not be notified.",
    };
    if (!confirm(messages[action] ?? `Perform "${action}"?`)) return;
    setCases(prev => prev.filter(c => c.id !== id));
    setResolvedCount(prev => Math.min((data?.resolvedTarget ?? 25), prev + 1));
    setShowMenu(null);
  }, [confirm, data]);

  const dismissCase = (id: string) => {
    if (!confirm("Dismiss this case without action?")) return;
    setCases(prev => prev.filter(c => c.id !== id));
  };

  // ── Search filter ──────────────────────────────────────────
  const searchLower = search.toLowerCase();
  const visibleCases = filterCases(cases, activeTab).filter(c => {
    if (!search) return true;
    return (
      c.refId.toLowerCase().includes(searchLower) ||
      c.type.toLowerCase().includes(searchLower) ||
      (c.gigTitle ?? "").toLowerCase().includes(searchLower) ||
      (c.seller ?? "").toLowerCase().includes(searchLower) ||
      (c.disputeTitle ?? "").toLowerCase().includes(searchLower) ||
      (c.reviewer ?? "").toLowerCase().includes(searchLower) ||
      (c.target ?? "").toLowerCase().includes(searchLower)
    );
  });

  const badgeCount = cases.length;

  // ── Non-moderation page placeholder ───────────────────────
  const renderOtherPage = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        {React.createElement(BASE_NAV.find(n => n.label === activeNav)?.icon ?? Shield, { size: 28, className: "text-gray-300" })}
      </div>
      <p className="text-sm font-medium text-gray-500">{activeNav}</p>
      <p className="text-xs text-gray-400">This section is under construction.</p>
      <button onClick={() => setActiveNav("Moderation")} className="mt-2 flex items-center gap-1 text-xs text-indigo-600 hover:underline">
        <ChevronRight size={12} />Back to Moderation
      </button>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

    

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto flex flex-col">

        {/* ── Header ── */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-800">Content Moderation</h1>
            {lastUpdated && <span className="text-[10px] text-gray-400">Updated {lastUpdated}</span>}
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 w-44 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Search logs or IDs..."
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                  <X size={12} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

      

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifs(v => !v); setShowSettings(false); }}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative"
              >
                <Bell size={16} />
                {badgeCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {badgeCount}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl w-72 z-30">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-800">Moderation Alerts</span>
                    <button onClick={() => setShowNotifs(false)} className="text-[10px] text-indigo-600 hover:underline">Dismiss all</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {cases.slice(0, 4).map(c => (
                      <div key={c.id} className="flex gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                        onClick={() => { setShowNotifs(false); setActiveTab(0); }}>
                        <Shield size={14} className={
                          c.type === "CRITICAL" ? "text-red-500" :
                          c.type === "WARNING"  ? "text-amber-500" :
                          c.type === "DISPUTE"  ? "text-blue-500" : "text-purple-500"
                        } />
                        <div>
                          <p className="text-xs font-semibold text-gray-800">{c.type} — {c.refId}</p>
                          <p className="text-[10px] text-gray-400">{c.time}</p>
                        </div>
                      </div>
                    ))}
                    {cases.length === 0 && (
                      <div className="px-4 py-6 text-center text-xs text-gray-400">No active alerts</div>
                    )}
                  </div>
                </div>
              )}
            </div>

       
          </div>
        </div>

        {/* ── Other pages ── */}
        {activeNav !== "Moderation" && <div className="flex-1">{renderOtherPage()}</div>}

        {/* ── Moderation content ── */}
        {activeNav === "Moderation" && (
          <div className="p-5 flex gap-4">

            {/* ── Left Panel ── */}
            <div className="flex-1 space-y-4 min-w-0">

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl flex items-center justify-between">
                  <span>⚠️ {error}</span>
                  <button onClick={() => fetchData()} className="underline ml-4">Retry</button>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {loading
                  ? Array.from({length:4}).map((_,i)=>(
                      <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2">
                        <Skeleton className="h-9 w-9" /><Skeleton className="h-3 w-20" /><Skeleton className="h-6 w-12" />
                      </div>
                    ))
                  : data?.modStats.map(({ label, value, change, icon, color, bg, down }) => (
                      <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
                            <ResolveIcon name={icon} size={18} className={color} />
                          </div>
                          <span className={`text-xs font-semibold ${down ? "text-red-500" : "text-green-600"}`}>{change}</span>
                        </div>
                        <div className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">{label}</div>
                        <div className="text-gray-800 text-xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</div>
                      </div>
                    ))
                }
              </div>

              {/* Tabs */}
              <div className="flex gap-1 border-b border-gray-200 bg-white px-4 pt-3 rounded-t-xl shadow-sm border border-gray-100">
                {(loading ? ["All Cases", "Gigs", "Reviews", "Disputes", "Spam"] : (data?.tabs ?? [])).map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                      activeTab === i ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search hint */}
              {search && (
                <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-4 py-2 rounded-xl flex items-center justify-between">
                  <span>Filtering for <strong>"{search}"</strong> — {visibleCases.length} result{visibleCases.length !== 1 ? "s" : ""}</span>
                  <button onClick={() => setSearch("")} className="underline ml-4">Clear</button>
                </div>
              )}

              {/* Cases */}
              <div className="space-y-3">
                {loading
                  ? Array.from({length:3}).map((_,i)=>(
                      <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2">
                        <Skeleton className="h-4 w-32" /><Skeleton className="h-16 w-full" /><Skeleton className="h-8 w-48" />
                      </div>
                    ))
                  : visibleCases.map(c => (
                      <div key={c.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 overflow-hidden ${caseTypeBorder[c.type]}`}>
                        <div className="p-4">
                          {/* Case header */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${caseTypeStyle[c.type]}`}>{c.type}</span>
                            <span className="text-xs text-gray-500 font-mono">{c.refId}</span>
                            <span className="ml-auto text-[11px] text-gray-400">{c.time}</span>
                            {/* More menu */}
                            <div className="relative" ref={showMenu === c.id ? menuRef : null}>
                              <button
                                onClick={() => setShowMenu(prev => prev === c.id ? null : c.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                              >
                                <MoreHorizontal size={16} />
                              </button>
                              {showMenu === c.id && (
                                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl w-44 z-30 py-1">
                                  {[
                                    { label: "View Details", action: () => { alert(`Viewing ${c.refId} — open detail modal here.`); setShowMenu(null); } },
                                    { label: "Assign to Me",  action: () => { alert(`${c.refId} assigned to you.`); setShowMenu(null); } },
                                    { label: "Escalate",      action: () => { alert(`${c.refId} escalated to senior moderator.`); setShowMenu(null); } },
                                    { label: "Dismiss",       action: () => dismissCase(c.id) },
                                  ].map(item => (
                                    <button key={item.label} onClick={item.action}
                                      className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors">
                                      {item.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* CRITICAL */}
                          {c.type === "CRITICAL" && (
                            <>
                              <div className="flex gap-3 mb-3">
                                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0">
                                  <UserCog size={24} className="text-gray-300" />
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800 text-sm mb-0.5">{c.gigTitle}</div>
                                  <div className="text-xs text-gray-400">Seller: <span className="text-indigo-600">{c.seller}</span> · Category: {c.category}</div>
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                <div className="flex justify-between mb-1">
                                  <span className="text-[10px] font-semibold text-gray-500 flex items-center gap-1"><Shield size={10} /> AI ANALYSIS</span>
                                  <span className="text-[10px] font-bold text-red-600">{c.aiConfidence}% CONFIDENCE</span>
                                </div>
                                <p className="text-xs text-gray-600">{c.aiReason}</p>
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                <button onClick={() => removeCase(c.id, "Suspend Gig", c.type)} className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-2 rounded-lg transition-colors font-semibold">Suspend Gig</button>
                                <button onClick={() => removeCase(c.id, "Dismiss Flag", c.type)} className="text-xs text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Dismiss Flag</button>
                              </div>
                            </>
                          )}

                          {/* WARNING */}
                          {c.type === "WARNING" && (
                            <>
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                                <div className="flex items-center gap-1 mb-1">
                                  <Star size={12} className="text-amber-500 fill-amber-500" />
                                  <span className="text-xs font-medium text-gray-700">{c.reviewText}</span>
                                </div>
                                <div className="text-[11px] text-gray-500">
                                  Reviewer: <span className="text-indigo-600">{c.reviewer}</span> · Target: <span className="text-indigo-600">{c.target}</span>
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                <div className="flex justify-between mb-1">
                                  <span className="text-[10px] font-semibold text-gray-500 flex items-center gap-1"><Shield size={10} /> AI ANALYSIS</span>
                                  <span className="text-[10px] font-bold text-amber-600">{c.aiConfidence}% CONFIDENCE</span>
                                </div>
                                <p className="text-xs text-amber-700">{c.aiReason}</p>
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                <button onClick={() => removeCase(c.id, "Delete Review", c.type)} className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-4 py-2 rounded-lg transition-colors font-semibold">Delete Review</button>
                                <button onClick={() => removeCase(c.id, "Request Context", c.type)} className="text-xs text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">Request Context</button>
                              </div>
                            </>
                          )}

                          {/* DISPUTE */}
                          {c.type === "DISPUTE" && (
                            <>
                              <div className="font-semibold text-gray-800 text-sm mb-3">{c.disputeTitle} — ${c.orderAmount}</div>
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="bg-blue-50 rounded-lg p-3">
                                  <div className="text-[10px] text-blue-500 uppercase font-semibold mb-1">CLIENT</div>
                                  <div className="font-semibold text-sm text-gray-800 mb-1">{c.clientName}</div>
                                  <p className="text-xs text-gray-600">{c.clientClaim}</p>
                                </div>
                                <div className="bg-indigo-50 rounded-lg p-3">
                                  <div className="text-[10px] text-indigo-500 uppercase font-semibold mb-1">FREELANCER</div>
                                  <div className="font-semibold text-sm text-gray-800 mb-1">{c.freelancerName}</div>
                                  <p className="text-xs text-gray-600">{c.freelancerClaim}</p>
                                </div>
                              </div>
                              <div className="mb-3">
                                <div className="flex justify-between text-[10px] text-gray-500 mb-2">
                                  <span className="font-semibold uppercase">Order Timeline</span>
                                  <span className="text-red-500 font-semibold">Resolution Target: {c.resolutionHours}h</span>
                                </div>
                                {c.timeline?.map(({ label, color }) => (
                                  <div key={label} className="flex items-center gap-2 mb-1">
                                    <div className={`w-2 h-2 rounded-full ${color}`} />
                                    <span className="text-xs text-gray-600">{label}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                <button onClick={() => removeCase(c.id, "Refund Client", c.type)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg transition-colors font-semibold">Refund Client</button>
                                <button onClick={() => removeCase(c.id, "Release Funds", c.type)} className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-4 py-2 rounded-lg transition-colors font-semibold">Release Funds</button>
                                <button onClick={() => removeCase(c.id, "Escalate to Senior", c.type)} className="text-xs text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">Escalate to Senior</button>
                              </div>
                            </>
                          )}

                          {/* SPAM */}
                          {c.type === "SPAM" && (
                            <>
                              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
                                <p className="text-xs text-gray-700 font-mono">{c.spamMessage}</p>
                                <p className="text-[10px] text-purple-500 mt-1.5 font-semibold">Sent to {c.spamReach?.toLocaleString()} users</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                <div className="flex justify-between mb-1">
                                  <span className="text-[10px] font-semibold text-gray-500 flex items-center gap-1"><Shield size={10} /> AI ANALYSIS</span>
                                  <span className="text-[10px] font-bold text-purple-600">{c.aiConfidence}% CONFIDENCE</span>
                                </div>
                                <p className="text-xs text-purple-700">{c.aiReason}</p>
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                <button onClick={() => removeCase(c.id, "Ban User Account", c.type)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg transition-colors font-semibold">Ban User Account</button>
                                <button onClick={() => removeCase(c.id, "Shadow Ban", c.type)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-lg transition-colors font-semibold">Shadow Ban</button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                }

                {!loading && visibleCases.length === 0 && (
                  <div className="bg-white rounded-xl p-10 text-center text-gray-400 shadow-sm border border-gray-100">
                    <CheckCircle size={32} className="mx-auto mb-2 text-green-400" />
                    <div className="text-sm font-medium">
                      {search ? `No results for "${search}"` : "All cases resolved!"}
                    </div>
                    {search && (
                      <button onClick={() => setSearch("")} className="mt-2 text-xs text-indigo-600 hover:underline">Clear search</button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Right Panel ── */}
            <div className="w-56 flex-shrink-0 space-y-4">

              {/* Performance */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 text-sm mb-3">Moderation Performance</h3>
                {loading ? (
                  <div className="space-y-2"><Skeleton className="h-3 w-full" /><Skeleton className="h-2 w-full" /><Skeleton className="h-16 w-full" /></div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">Resolved Today</span>
                      <span className="text-xs font-bold text-gray-700">{resolvedCount} / {data?.resolvedTarget ?? 25}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (resolvedCount / (data?.resolvedTarget ?? 25)) * 100)}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-[10px] text-gray-400 uppercase mb-1">Avg Response</div>
                        <div className="text-sm font-bold text-gray-800">{data?.avgResponseMin}m</div>
                        <div className="text-[10px] text-green-500">▲ 4.2%</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-[10px] text-gray-400 uppercase mb-1">Accuracy</div>
                        <div className="text-sm font-bold text-gray-800">{data?.accuracyRate}%</div>
                        <div className="text-[10px] text-amber-500">Target 99%</div>
                      </div>
                    </div>
                    <div className="text-[10px] uppercase text-gray-400 font-semibold mb-2">Moderators Online</div>
                    {data?.onlineModerators.map(({ name, role, task, initials }) => (
                      <div key={name} className="flex items-center gap-2 mb-2">
                        <div className="relative">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">{initials}</div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-700 truncate">{name}</div>
                          <div className="text-[10px] text-gray-400 truncate">{task}</div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">{role}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Mod Handbook */}
              <div className="bg-indigo-600 rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={16} />
                  <span className="font-bold text-sm">Mod Handbook</span>
                </div>
                <p className="text-xs text-indigo-200 mb-3">Quick reference for platform violation policies and escalation protocols.</p>
                {[
                  "TOS Section 4: Off-platform links",
                  "Policy: Review manipulation",
                  "Dispute resolution standards",
                ].map(item => (
                  <div key={item} className="flex items-start gap-2 mb-2">
                    <CheckCircle size={11} className="text-indigo-300 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-indigo-100">{item}</span>
                  </div>
                ))}
                <button
                  onClick={() => window.open("https://docs.example.com/moderation", "_blank")}
                  className="mt-2 w-full bg-white text-indigo-600 text-xs font-semibold py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1"
                >
                  Full Documentation <ExternalLink size={11} />
                </button>
              </div>

              {/* Recent Actions */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 text-sm mb-3">Recent Actions</h3>
                {loading
                  ? Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-10 w-full mb-2" />)
                  : data?.recentActions.map(({ text, time, icon, color }) => (
                      <div key={text} className="flex items-start gap-2 mb-3">
                        <ResolveIcon name={icon} size={14} className={`${color} mt-0.5 flex-shrink-0`} />
                        <div>
                          <div className="text-xs text-gray-700">{text}</div>
                          <div className="text-[10px] text-gray-400">{time}</div>
                        </div>
                      </div>
                    ))
                }
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Click-away overlay */}
      {(showNotifs || showSettings || showMenu) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => { setShowNotifs(false); setShowSettings(false); setShowMenu(null); }}
        />
      )}
    </div>
  );
}