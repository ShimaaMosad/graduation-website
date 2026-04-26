"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  Settings,
  Users,
  User,
  PieChart,
  ShieldCheck,
  UserPlus,
  Receipt,
  Clock,
  Search,
  X,
  CheckCircle,
  ChevronRight,
  Pencil,
  Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Member {
  name: string;
  avatar: string;
  role: string;
  isLead: boolean;
}

interface MockUser {
  handle: string;
  initials: string;
  name: string;
  role: string;
}

interface PendingInvite {
  handle: string;
  initials: string;
  sentAt: string;
}

interface ActivityItem {
  text: string;
  time: string;
  done: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USERS: MockUser[] = [
  { handle: "@sara_ui",      initials: "SU", name: "Sara UI",      role: "UI Designer"      },
  { handle: "@john_dev",     initials: "JD", name: "John Dev",     role: "Frontend Dev"     },
  { handle: "@karim_design", initials: "KD", name: "Karim Design", role: "Graphic Designer" },
  { handle: "@mona_writes",  initials: "MW", name: "Mona Writes",  role: "Copywriter"       },
  { handle: "@ali_motion",   initials: "AM", name: "Ali Motion",   role: "Motion Designer"  },
  { handle: "@nadia_ux",     initials: "NU", name: "Nadia UX",     role: "UX Researcher"    },
  { handle: "@omar_pm",      initials: "OP", name: "Omar PM",      role: "Project Manager"  },
];

const COLORS = ["#7C3AED", "#2563EB", "#06B6D4", "#059669", "#D97706"];

const DEFAULT_ACTIVITY: ActivityItem[] = [
  { text: "Ahmed updated distribution", time: "2 hours ago",        done: true  },
  { text: "Lina accepted invitation",   time: "Yesterday, 4:30 PM", done: true  },
  { text: "Team created by Ahmed",      time: "Oct 24, 2024",       done: false },
];

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed", bottom: 24, right: 24,
        background: "#1f2937", color: "white",
        padding: "12px 20px", borderRadius: 10,
        fontSize: 13, zIndex: 200,
        animation: "slideIn 0.3s ease",
      }}
    >
      ✓ {msg}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TeamCollaboration() {
  const [members, setMembers]                   = useState<Member[]>([]);
  const [shares, setShares]                     = useState<number[]>([]);
  const [budget, setBudget]                     = useState(500);
  const [editingBudget, setEditingBudget]       = useState(false);
  const [budgetInput, setBudgetInput]           = useState("500");
  const [searchQuery, setSearchQuery]           = useState("");
  const [suggestedUsers, setSuggestedUsers]     = useState<MockUser[]>([]);
  const [pendingInvites, setPendingInvites]     = useState<PendingInvite[]>([
    { handle: "@karim_design", initials: "KD", sentAt: "2 hrs ago" },
  ]);
  const [activity, setActivity]                 = useState<ActivityItem[]>(DEFAULT_ACTIVITY);
  const [showCreateModal, setShowCreateModal]   = useState(false);
  const [newTeamName, setNewTeamName]           = useState("");
  const [showRemoveModal, setShowRemoveModal]   = useState<number | null>(null);
  const [toast, setToast]                       = useState<string | null>(null);
  const [activeTab, setActiveTab]               = useState("Teams");
  const [loading, setLoading]                   = useState(true);

  const platformFee      = budget * 0.1;
  const netDistributable = budget - platformFee;

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const addActivity = useCallback((text: string) =>
    setActivity((prev) => [{ text, time: "Just now", done: true }, ...prev]), []);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  const buildEqualShares = useCallback((count: number): number[] => {
    if (count === 0) return [];
    const equal = Math.floor(100 / count);
    const rem   = 100 - equal * count;
    return Array.from({ length: count }, (_, i) => (i === 0 ? equal + rem : equal));
  }, []);

  // ── Fetch Team from API ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("/api/team");
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data: Member[] = await res.json();
        setMembers(data);
        setShares(buildEqualShares(data.length));
      } catch (err) {
        console.error("Failed to fetch team:", err);
        // Graceful fallback so UI is never empty
        const fallback: Member[] = [
          { name: "Ahmed Hassan", avatar: "AH", role: "Lead Designer",    isLead: true  },
          { name: "Lina Samir",   avatar: "LS", role: "Illustrator",      isLead: false },
          { name: "Khaled Nour",  avatar: "KN", role: "Brand Strategist", isLead: false },
        ];
        setMembers(fallback);
        setShares(buildEqualShares(fallback.length));
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [buildEqualShares]);

  // ── Search ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!searchQuery.trim()) { setSuggestedUsers([]); return; }
    const pendingHandles = pendingInvites.map((p) => p.handle);
    const results = MOCK_USERS.filter(
      (u) =>
        (u.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
         u.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !pendingHandles.includes(u.handle) &&
        !members.find((m) => m.avatar === u.initials),
    );
    setSuggestedUsers(results.slice(0, 4));
  }, [searchQuery, members, pendingInvites]);

  // ── Sliders ───────────────────────────────────────────────────────────────────
  const handleSliderChange = (index: number, value: number) => {
    const newShares = [...shares];
    const diff      = value - newShares[index];
    newShares[index] = value;
    const others = members.map((_, i) => i).filter((i) => i !== index);
    let remaining = diff;
    for (let i = others.length - 1; i >= 0; i--) {
      const take = Math.min(remaining, newShares[others[i]]);
      newShares[others[i]] = Math.max(0, newShares[others[i]] - take);
      remaining -= take;
    }
    const total = newShares.reduce((a, b) => a + b, 0);
    if (total < 100) newShares[0] += 100 - total;
    setShares(newShares);
    addActivity("Ahmed updated distribution");
  };

  // ── Invite ────────────────────────────────────────────────────────────────────
  const sendInvite = (user: MockUser) => {
    if (pendingInvites.find((p) => p.handle === user.handle)) return;
    setPendingInvites((prev) => [
      ...prev,
      { handle: user.handle, initials: user.initials, sentAt: "Just now" },
    ]);
    setSearchQuery("");
    setSuggestedUsers([]);
    addActivity(`Invite sent to ${user.handle}`);
    showToast(`Invite sent to ${user.handle}`);
  };

  const cancelInvite = (handle: string) => {
    setPendingInvites((prev) => prev.filter((p) => p.handle !== handle));
    addActivity(`Invitation to ${handle} cancelled`);
    showToast("Invitation cancelled");
  };

  const acceptInvite = async (invite: PendingInvite) => {
    if (members.length >= 5) {
      showToast("Team is at full capacity (5/5)");
      return;
    }
    const user = MOCK_USERS.find((u) => u.handle === invite.handle);
    if (!user) return;

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user.name, avatar: user.initials, role: user.role }),
      });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const newMember: Member = await res.json();
      const newMembers: Member[] = [
        ...members,
        { ...newMember, isLead: newMember.isLead ?? false },
      ];
      setMembers(newMembers);
      setShares(buildEqualShares(newMembers.length));
      setPendingInvites((prev) => prev.filter((p) => p.handle !== invite.handle));
      addActivity(`${user.name} joined the team`);
      showToast(`${user.name} joined the team!`);
    } catch (err) {
      console.error("Failed to add member:", err);
      showToast("Failed to add member. Please try again.");
    }
  };

  // ── Remove Member ─────────────────────────────────────────────────────────────
  const removeMember = async (idx: number) => {
    const target = members[idx];
    if (!target) return;
    if (target.isLead) {
      showToast("Cannot remove the team lead");
      return;
    }

    try {
      const res = await fetch("/api/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index: idx }),
      });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const newMembers = members.filter((_, i) => i !== idx);
      setMembers(newMembers);
      setShares(buildEqualShares(newMembers.length));
      setShowRemoveModal(null);
      addActivity(`${target.name} was removed from the team`);
      showToast(`${target.name} removed`);
    } catch (err) {
      console.error("Failed to remove member:", err);
      showToast("Failed to remove member. Please try again.");
    }
  };

  // ── Create Team ───────────────────────────────────────────────────────────────
  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;
    showToast(`Team "${newTeamName}" created!`);
    addActivity(`New team "${newTeamName}" created`);
    setShowCreateModal(false);
    setNewTeamName("");
  };

  // ── Budget ────────────────────────────────────────────────────────────────────
  const handleBudgetSave = () => {
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val > 0) {
      setBudget(val);
      addActivity(`Budget updated to $${val}`);
      showToast(`Budget updated to $${val}`);
    }
    setEditingBudget(false);
  };

  // ── Loading State ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F0FF] flex items-center justify-center">
        <div className="text-purple-600 font-medium animate-pulse">Loading team…</div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F3F0FF]">

      {/* ── Navbar ── */}
      <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <span className="text-purple-600 font-bold text-lg">MySite</span>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
            {["Dashboard", "Teams", "Workspace", "Payments"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`hover:text-gray-800 transition-colors pb-0.5 border-b-2 ${
                  activeTab === tab
                    ? "text-purple-600 font-medium border-purple-600"
                    : "border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Create Team
          </button>
          <button
            className="p-2 text-gray-500 hover:text-gray-700"
            onClick={() => showToast("No new notifications")}
          >
            <Bell size={20} />
          </button>
          <button
            className="p-2 text-gray-500 hover:text-gray-700"
            onClick={() => showToast("Settings opened")}
          >
            <Settings size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-medium">
            AH
          </div>
        </div>
      </nav>

      {/* ── Breadcrumb ── */}
      <div className="px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          {["Dashboard", "Orders", "Order #2024-0091", "Team"].map((crumb, i, arr) => (
            <span key={crumb} className="flex items-center gap-2">
              <span
                className={
                  i === arr.length - 1
                    ? "text-gray-800 font-medium"
                    : "cursor-pointer hover:text-gray-700"
                }
                onClick={() => i < arr.length - 1 && showToast(`Navigating to ${crumb}`)}
              >
                {crumb}
              </span>
              {i < arr.length - 1 && <ChevronRight size={16} />}
            </span>
          ))}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Team Collaboration</h1>
      </div>

      {/* ── Project Header Card ── */}
      <div className="px-6 max-w-6xl mx-auto mb-5">
        <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <X size={20} className="text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Logo Design Project</div>
              <div className="text-sm text-gray-500">Client: TechNova Inc.</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Total Budget
              </div>
              {editingBudget ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleBudgetSave()}
                    autoFocus
                    className="w-20 border border-purple-400 rounded-md px-2 py-0.5 text-lg font-bold focus:outline-none"
                  />
                  <button
                    onClick={handleBudgetSave}
                    className="bg-purple-600 text-white px-2 py-1 rounded-md flex items-center"
                  >
                    <Check size={12} />
                  </button>
                </div>
              ) : (
                <div
                  className="flex items-center gap-1 text-xl font-bold text-gray-900 cursor-pointer hover:text-purple-600 transition-colors"
                  title="Click to edit budget"
                  onClick={() => { setEditingBudget(true); setBudgetInput(String(budget)); }}
                >
                  ${budget}.00 <Pencil size={14} />
                </div>
              )}
            </div>
            <span className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              In Progress
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5 pb-12">

        {/* ── Left 2 Cols ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Team Overview */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-purple-600" />
                <h2 className="font-semibold text-gray-900">Team Overview</h2>
              </div>
             <div className="flex items-center gap-2 text-sm text-gray-500">
  <span>Capacity:</span>

  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => {
      const isActive = i < members.length;

      return (
        <div
          key={i}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
            isActive ? "bg-purple-200" : "bg-gray-100"
          }`}
        >
          <User
            size={12}
            className={isActive ? "text-purple-600" : "text-gray-400"}
          />
        </div>
      );
    })}
  </div>

  <span className="text-gray-400">
    ({members?.length || 0}/5)
  </span>
</div>
            </div>

            <div className="space-y-3">
              {members.map((m, i) => (
                <div
                  key={`${m.name}-${i}`}
                  className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                    style={{ background: COLORS[i % COLORS.length] }}
                  >
                    {m.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">{m.name}</span>
                      {m.isLead && (
                        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded">
                          LEAD
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{m.role}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!m.isLead && (
                      <CheckCircle size={16} className="text-blue-500" />
                    )}
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 text-sm">
                        {shares[i] ?? 0}%
                      </div>
                      <div className="text-xs text-gray-400">Share</div>
                    </div>
                    {!m.isLead && (
                      <button
                        onClick={() => setShowRemoveModal(i)}
                        className="bg-red-100 hover:bg-red-200 text-red-500 rounded-md w-7 h-7 flex items-center justify-center transition-colors"
                        title="Remove member"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Distribution */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChart size={20} className="text-purple-600" />
                <h2 className="font-semibold text-gray-900">Payment Distribution</h2>
              </div>
              <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                <CheckCircle size={16} className="text-green-500" />
                100% Allocated
              </span>
            </div>

            {/* Combined Bar */}
            <div className="h-3 rounded-full overflow-hidden flex mb-5">
              {shares.map((s, i) => (
                <div
                  key={i}
                  style={{
                    width: `${s}%`,
                    background: COLORS[i % COLORS.length],
                    transition: "width 0.2s",
                  }}
                />
              ))}
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              {members.map((m, i) => (
                <div key={`${m.name}-slider-${i}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-sm text-gray-700">
                        {m.name}
                        {m.isLead ? " (Lead)" : ""}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {shares[i] ?? 0}% ($
                      {Math.round(((shares[i] ?? 0) / 100) * netDistributable)}.00)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={shares[i] ?? 0}
                    onChange={(e) => handleSliderChange(i, Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${COLORS[i % COLORS.length]} ${shares[i] ?? 0}%, #E5E7EB ${shares[i] ?? 0}%)`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Team Rules */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={20} className="text-gray-600" />
              <h2 className="font-semibold text-gray-900">Team Rules & Settings</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: "🔒", title: "Lead Control",      desc: "Only Lead can submit final work to client."           },
                { icon: "🔐", title: "Client Privacy",    desc: "Members cannot communicate directly with client."     },
                { icon: "💳", title: "Payment Lock",      desc: "Funds held in escrow until milestone completion."     },
                { icon: "⚖️", title: "Distribution Lock", desc: "Changes require all member approval once accepted."   },
              ].map((rule) => (
                <div key={rule.title} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <span className="text-lg flex-shrink-0">{rule.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{rule.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{rule.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Col ── */}
        <div className="space-y-5">

          {/* Invite Member */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus size={20} className="text-purple-600" />
              <h2 className="font-semibold text-gray-900">Invite Member</h2>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search
                size={16}
                className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username or email..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
              />
            </div>

            {/* Suggestions */}
            {suggestedUsers.length > 0 && (
              <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                {suggestedUsers.map((u) => (
                  <button
                    key={u.handle}
                    onClick={() => sendInvite(u)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 transition-colors text-left border-b border-gray-100 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-semibold text-purple-700">
                      {u.initials}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{u.name}</div>
                      <div className="text-xs text-gray-500">
                        {u.handle} · {u.role}
                      </div>
                    </div>
                    <span className="text-xs text-purple-600 font-semibold">Invite</span>
                  </button>
                ))}
              </div>
            )}

            {/* Pending Invitations */}
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                Pending Invitations ({pendingInvites.length})
              </div>
              <div className="space-y-2">
                {pendingInvites.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-3">
                    No pending invitations
                  </p>
                )}
                {pendingInvites.map((inv) => (
                  <div
                    key={inv.handle}
                    className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-xs font-semibold text-purple-700">
                      {inv.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800">{inv.handle}</div>
                      <div className="text-xs text-gray-500">Sent {inv.sentAt}</div>
                    </div>
                    {/* Accept */}
                    <button
                      onClick={() => acceptInvite(inv)}
                      title="Accept — add to team"
                      className="w-6 h-6 rounded-md bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors mr-1"
                    >
                      <Check size={12} />
                    </button>
                    {/* Cancel */}
                    <button
                      onClick={() => cancelInvite(inv.handle)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Receipt size={20} className="text-purple-600" />
              <h2 className="font-semibold text-gray-900">Financial Summary</h2>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Project Budget</span>
                <span className="font-medium text-gray-900">${budget}.00</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Platform Fee (10%)</span>
                <span className="font-medium text-red-500">-${platformFee}.00</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Net Distributable</span>
                <span className="font-medium text-gray-900">${netDistributable}.00</span>
              </div>
              <div className="border-t border-gray-100 pt-2.5 space-y-2">
                {members.map((m, i) => (
                  <div key={`${m.name}-fin-${i}`} className="flex justify-between text-gray-600">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                      <span>{m.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      ${Math.round(((shares[i] ?? 0) / 100) * netDistributable)}.00
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                <span className="font-semibold text-gray-900">Total Allocated</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-gray-900">${netDistributable}.00</span>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-purple-600" />
                <h2 className="font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <button
                onClick={() => {
                  setActivity(DEFAULT_ACTIVITY);
                  showToast("Activity cleared");
                }}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="space-y-4 max-h-56 overflow-y-auto">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                      a.done ? "border-purple-400" : "border-gray-300"
                    }`}
                  />
                  <div>
                    <div className="text-sm text-gray-800">{a.text}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Create Team Modal ── */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-80 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Team</h3>
            <label className="text-sm font-medium text-gray-700">Team Name</label>
            <input
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateTeam()}
              placeholder="e.g. Brand Design Team"
              autoFocus
              className="w-full mt-1.5 mb-4 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 text-sm font-semibold transition-colors"
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Remove Member Modal ── */}
      {showRemoveModal !== null && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={() => setShowRemoveModal(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-80 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">Remove Member</h3>
            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to remove{" "}
              <strong>{members[showRemoveModal]?.name}</strong> from the team? Their share
              will be redistributed equally.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRemoveModal(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => removeMember(showRemoveModal)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 text-sm font-semibold transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        input[type=range] {
          -webkit-appearance: none;
          height: 6px;
          border-radius: 9999px;
          outline: none;
          cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #7C3AED;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,.2);
        }
      `}</style>
    </div>
  );
}