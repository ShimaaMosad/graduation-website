"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Search, Calendar, Bell, Settings, LayoutDashboard, BarChart2,
  ShieldAlert, UserCog, CreditCard, ScrollText, HelpCircle, LogOut,
  Users, Briefcase, ChevronDown, X, Mail, CheckCircle, Ban,
  Edit, ShieldOff, MessageSquare, Filter, SortAsc, Loader2,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────
type Status = "Active" | "Pending" | "Suspended";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: Status;
  joinedMonth: string;
  initials: string;
  color: string;
  location: string;
  memberSince: string;
  lastLogin: string;
  jobSuccess: number;
  totalEarned: string;
  verified: boolean;
  twoFactor: boolean;
  identityVerified: boolean;
  plan: string;
}

interface Stats {
  total: number;
  freelancers: number;
  clients: number;
}

interface ApiResponse {
  users: User[];
  stats: Stats;
}

// ── Helpers ───────────────────────────────────────────────────────
const statusStyle: Record<Status, string> = {
  Active: "bg-green-100 text-green-600",
  Pending: "bg-amber-100 text-amber-600",
  Suspended: "bg-red-100 text-red-600",
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Analytics", icon: BarChart2 },
  { label: "Moderation", icon: ShieldAlert },
  { label: "User Management", icon: UserCog },
  { label: "Financials", icon: CreditCard },
  { label: "System Logs", icon: ScrollText },
];

// ── Component ──────────────────────────────────────────────────────
export default function UserManagementPage() {
  const [activeNav, setActiveNav] = useState("User Management");
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, freelancers: 0, clients: 0 });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("Active Status");
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Fetch users from API ─────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (roleFilter !== "All Roles") params.set("role", roleFilter);
      if (statusFilter !== "Active Status") params.set("status", statusFilter);

      const res = await fetch(`/api/users?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: ApiResponse = await res.json();
      setUsers(data.users);
      setStats(data.stats);

      // Keep profileUser in sync with latest data
      setProfileUser((prev) =>
        prev ? data.users.find((u) => u.id === prev.id) ?? null : null
      );
    } catch (err) {
      showNotif("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Notifications ────────────────────────────────────────────────
  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // ── Selection ────────────────────────────────────────────────────
  const toggleSelect = (id: number) => {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
  };

  const toggleAll = () => {
    setSelectedIds(selectedIds.length === users.length ? [] : users.map((u) => u.id));
  };

  // ── Batch Actions (API) ──────────────────────────────────────────
  const batchAction = async (action: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, action }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.message);
      showNotif(data.message);
      setSelectedIds([]);
      await fetchUsers();
    } catch (err: any) {
      showNotif(err.message ?? "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Single-user Actions (API) ────────────────────────────────────
  const restrictAccess = async (user: User) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, data: { status: "Suspended" } }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.message);
      showNotif(`Access restricted for ${user.name}`);
      await fetchUsers();
    } catch (err: any) {
      showNotif(err.message ?? "Failed to restrict access");
    } finally {
      setActionLoading(false);
    }
  };

  const messageUser = async (user: User) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [user.id], action: "Send Email" }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.message);
      showNotif(`Message sent to ${user.name}`);
    } catch (err: any) {
      showNotif(err.message ?? "Failed to send message");
    } finally {
      setActionLoading(false);
    }
  };

  const editProfile = async (user: User) => {
    // In a real app: open a modal/drawer. Here we toggle a dummy field change.
    setActionLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          data: { lastLogin: "Just now" },
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.message);
      showNotif("Profile edit opened");
      await fetchUsers();
    } catch (err: any) {
      showNotif(err.message ?? "Failed to edit");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Stats Cards derived from API data ───────────────────────────
  const statsCards = [
    {
      label: "Total Users",
      value: stats.total.toLocaleString(),
      change: "+12% from last month",
      icon: Users,
      bg: "bg-blue-50",
      color: "text-blue-500",
    },
    {
      label: "Freelancers",
      value: stats.freelancers.toLocaleString(),
      change: `${stats.total ? ((stats.freelancers / stats.total) * 100).toFixed(1) : 0}% of total base`,
      icon: Briefcase,
      bg: "bg-indigo-50",
      color: "text-indigo-500",
    },
    {
      label: "Clients",
      value: stats.clients.toLocaleString(),
      change: "+5.2% growth",
      icon: Users,
      bg: "bg-green-50",
      color: "text-green-500",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
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
        <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-1.5 rounded-md transition-colors">
          Upgrade Plan
        </button>
        <div className="mt-4 space-y-1">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-xs rounded-lg hover:bg-white/10">
            <HelpCircle size={13} />Help Center
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-xs rounded-lg hover:bg-white/10">
            <LogOut size={13} />Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 z-50 bg-green-600 text-white text-sm px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
            <CheckCircle size={14} />{notification}
          </div>
        )}

        {/* Global action loading overlay */}
        {actionLoading && (
          <div className="fixed inset-0 bg-black/10 z-40 flex items-center justify-center pointer-events-none">
            <div className="bg-white rounded-xl shadow-lg px-5 py-3 flex items-center gap-2 text-sm text-gray-700">
              <Loader2 size={16} className="animate-spin text-indigo-600" />
              Processing...
            </div>
          </div>
        )}

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between z-10">
          <h1 className="text-xl font-bold text-gray-800">User Management</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 w-44 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Global search..."
              />
            </div>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><Calendar size={16} /></button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><Bell size={16} /></button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><Settings size={16} /></button>
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-bold">AR</div>
          </div>
        </div>

        <div className="p-5 flex gap-4">
          {/* Left: Table Panel */}
          <div className="flex-1">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {statsCards.map(({ label, value, change, icon: Icon, bg, color }) => (
                <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</span>
                    <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}>
                      <Icon size={15} className={color} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{value}</div>
                  <div className="text-xs text-green-500 mt-1">↑ {change}</div>
                </div>
              ))}
            </div>

            {/* Filters + Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <div className="relative flex-1">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="Search by name or email..."
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                >
                  <option>All Roles</option>
                  <option>Freelancer</option>
                  <option>Client</option>
                  <option>Designer</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                >
                  <option>Active Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Suspended</option>
                </select>
                <button className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50">
                  <SortAsc size={12} /> Date Joined
                </button>
              </div>

              {/* Table */}
              {loading ? (
                <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm">Loading users...</span>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                      <th className="w-10 px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={users.length > 0 && selectedIds.length === users.length}
                          onChange={toggleAll}
                          className="rounded"
                        />
                      </th>
                      <th className="px-3 py-3 text-left">User</th>
                      <th className="px-3 py-3 text-left">Role</th>
                      <th className="px-3 py-3 text-left">Status</th>
                      <th className="px-3 py-3 text-left">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-sm text-gray-400">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user.id}
                          onClick={() => setProfileUser(user)}
                          className={`border-t border-gray-50 cursor-pointer transition-colors ${
                            profileUser?.id === user.id ? "bg-indigo-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <td
                            className="px-4 py-3"
                            onClick={(e) => { e.stopPropagation(); toggleSelect(user.id); }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(user.id)}
                              onChange={() => {}}
                              className="rounded"
                            />
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full ${user.color} text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>
                                {user.initials}
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-gray-800">{user.name}</div>
                                <div className="text-[10px] text-gray-400">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-xs text-gray-600">{user.role}</td>
                          <td className="px-3 py-3">
                            <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${statusStyle[user.status]}`}>
                              ● {user.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-xs text-gray-500">{user.joinedMonth}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {/* Batch Action Bar */}
              {selectedIds.length > 0 && (
                <div className="border-t border-gray-100 bg-gray-900 px-4 py-3 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {selectedIds.length}
                    </div>
                    <span className="text-white text-xs font-medium">Users selected</span>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    {[
                      { label: "Send Email", icon: Mail },
                      { label: "Approve", icon: CheckCircle },
                      { label: "Suspend", icon: Ban },
                    ].map(({ label, icon: Icon }) => (
                      <button
                        key={label}
                        onClick={() => batchAction(label)}
                        disabled={actionLoading}
                        className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Icon size={12} />{label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: User Profile Panel */}
          {profileUser && (
            <div className="w-72 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-sm">User Profile</h3>
                <button onClick={() => setProfileUser(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
              <div className="p-4">
                {/* Avatar */}
                <div className="text-center mb-4">
                  <div className={`w-20 h-20 rounded-full ${profileUser.color} text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3`}>
                    {profileUser.initials}
                  </div>
                  <div className="font-bold text-gray-800 text-lg">{profileUser.name}</div>
                  <div className="text-indigo-600 text-xs font-semibold mb-2">{profileUser.role}</div>
                  <div className="flex justify-center gap-2">
                    {profileUser.verified && (
                      <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-full font-semibold">
                        Verified Account
                      </span>
                    )}
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] px-2 py-1 rounded-full font-semibold">
                      {profileUser.plan}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-800">{profileUser.jobSuccess}%</div>
                    <div className="text-[10px] text-gray-400">Job Success</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-800">{profileUser.totalEarned}</div>
                    <div className="text-[10px] text-gray-400">Total Earned</div>
                  </div>
                </div>

                {/* Details */}
                <div className="mb-4">
                  <div className="text-[10px] uppercase text-gray-400 font-semibold mb-2">Account Details</div>
                  {[
                    { label: "Email", value: profileUser.email },
                    { label: "Location", value: profileUser.location },
                    { label: "Member Since", value: profileUser.memberSince },
                    { label: "Last Login", value: profileUser.lastLogin },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-xs text-gray-500">{label}</span>
                      <span className="text-xs font-medium text-gray-700 text-right max-w-[140px] truncate">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Security */}
                <div className="mb-4">
                  <div className="text-[10px] uppercase text-gray-400 font-semibold mb-2">Security & Logs</div>
                  {[
                    { label: "Two-factor authentication enabled", ok: profileUser.twoFactor },
                    { label: "Verified identity document", ok: profileUser.identityVerified },
                  ].map(({ label, ok }) => (
                    <div key={label} className="flex items-center gap-2 mb-1.5">
                      {ok
                        ? <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                        : <X size={12} className="text-red-400 flex-shrink-0" />
                      }
                      <span className="text-xs text-gray-600">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => messageUser(profileUser)}
                    disabled={actionLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <MessageSquare size={14} />Message User
                  </button>
                  <button
                    onClick={() => editProfile(profileUser)}
                    disabled={actionLoading}
                    className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Edit size={14} />Edit Profile
                  </button>
                  <button
                    onClick={() => restrictAccess(profileUser)}
                    disabled={actionLoading || profileUser.status === "Suspended"}
                    className="w-full border border-red-200 text-red-600 hover:bg-red-50 text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ShieldOff size={14} />
                    {profileUser.status === "Suspended" ? "Already Suspended" : "Restrict Access"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}