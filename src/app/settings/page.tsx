"use client";

import { useState, useCallback, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Save,
  Camera,
  Shield,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  Plus,
  X,
  Smartphone,
  Monitor,
  Laptop,
  Check,
  AlertTriangle,
  Mail,
  BellRing,
  Volume2,
  Globe,
  Lock,
  Download,
  RefreshCw,
  Sun,
  Moon,
  ChevronRight,
  Clock,
  BadgeCheck,
  User,
  KeyRound,
  Trash2,
  ShieldOff,
  Loader2,
  Languages,
  DollarSign,
  MapPin,
  Phone,
  CalendarDays,
  AtSign,
  Pencil,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type BadgeColor = "green" | "purple" | "blue" | "red" | "amber";
type ThemeOption = "Light" | "Dark";
type GenderOption = "Male" | "Female" | "Non-binary" | "Prefer not to say";
type VisibilityOption = "Public" | "Private" | "Contacts only";
type ToastType = "success" | "error";

interface ToastState {
  msg: string;
  type: ToastType;
}

interface ProfileState {
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  dob: string;
  gender: GenderOption;
  location: string;
  timezone: string;
  bio: string;
  hourlyRate: string;
  languages: string[];
  avatar: string;
}

interface PrivacyState {
  visibility: VisibilityOption;
  showEarnings: boolean;
  showProjects: boolean;
  indexGoogle: boolean;
  readReceipts: boolean;
  directInvites: boolean;
}

type PrivacyBooleanKey = Exclude<keyof PrivacyState, "visibility">;

interface PrefsState {
  language: string;
  currency: string;
  theme: ThemeOption;
  weeklyDigest: boolean;
  autoReply: boolean;
}

type PrefsBooleanKey = "weeklyDigest" | "autoReply";

interface ChannelsState {
  inApp: boolean;
  email: boolean;
  push: boolean;
}

interface CategoriesState {
  orders: boolean;
  messages: boolean;
  payments: boolean;
  platform: boolean;
}

interface SessionDevice {
  device: string;
  loc: string;
  time: string;
  Icon: React.ElementType;
  current: boolean;
  id: string;
}

type PageId = "dashboard" | "invoices" | "payments" | "settings" | "notifications";
type CategoryKey = keyof CategoriesState;
type ChannelKey = keyof ChannelsState;

// ─── API Layer ────────────────────────────────────────────────────────────────

const api = {
  async fetchProfile(): Promise<ProfileState> {
    const res = await fetch("/api/profile");
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
  },
  async saveProfile(data: ProfileState): Promise<void> {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save profile");
  },
  async changePassword(
    current: string,
    next: string
  ): Promise<{ success: boolean; message: string }> {
    const res = await fetch("/api/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current, next }),
    });
    if (!res.ok) throw new Error("Failed to change password");
    return res.json();
  },
  async revokeSession(sessionId: string): Promise<void> {
    await fetch(`/api/sessions/${sessionId}`, { method: "DELETE" });
  },
  async deactivateAccount(): Promise<void> {
    await fetch("/api/account/deactivate", { method: "POST" });
  },
  async deleteAccount(): Promise<void> {
    await fetch("/api/account", { method: "DELETE" });
  },
  async downloadData(): Promise<Blob> {
    const res = await fetch("/api/account/export");
    if (!res.ok) throw new Error("Export failed");
    return res.blob();
  },
  async saveNotifications(data: object): Promise<void> {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
};

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  size = "md",
  disabled = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: "sm" | "md";
  disabled?: boolean;
}) {
  const track = size === "sm" ? "w-9 h-5" : "w-11 h-6";
  const knob = size === "sm" ? "w-3.5 h-3.5" : "w-[18px] h-[18px]";
  const on = size === "sm" ? "translate-x-4" : "translate-x-5";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2
        ${track}
        ${checked && !disabled ? "bg-violet-600" : "bg-gray-300"}
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block rounded-full bg-white shadow-sm transition-transform duration-200 ${knob} ${
          checked ? on : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({
  children,
  color = "green",
}: {
  children: React.ReactNode;
  color?: BadgeColor;
}) {
  const map: Record<BadgeColor, string> = {
    green: "bg-emerald-100 text-emerald-800",
    purple: "bg-violet-100 text-violet-800",
    blue: "bg-blue-100 text-blue-800",
    red: "bg-red-100 text-red-800",
    amber: "bg-amber-100 text-amber-800",
  };
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold tracking-wide ${map[color]}`}
    >
      {children}
    </span>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed right-6 top-16 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-2xl
        ${toast.type === "success" ? "bg-emerald-600" : "bg-red-500"}`}
    >
      <Check size={14} />
      {toast.msg}
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
        {Icon && <Icon size={11} className="text-gray-400" />}
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── shared input/select class strings ───────────────────────────────────────

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[13px] text-gray-900 placeholder-gray-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

const selectCls = `${inputCls} appearance-none pr-9 cursor-pointer`;

// ─── SectionCard / SectionTitle ───────────────────────────────────────────────

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-6 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center gap-2">
      <Icon size={17} className="text-violet-600" />
      <h2 className="text-[15px] font-bold text-gray-900">{children}</h2>
    </div>
  );
}




// ─── Account Settings Page ────────────────────────────────────────────────────

function AccountSettingsPage() {
  const [profile, setProfile] = useState<ProfileState>({
    fullName: "",
    displayName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "Male",
    location: "",
    timezone: "GMT +04:00 (Dubai)",
    bio: "",
    hourlyRate: "",
    languages: [],
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [twoFactor, setTwoFactor] = useState(true);
  const [privacy, setPrivacy] = useState<PrivacyState>({
    visibility: "Public",
    showEarnings: true,
    showProjects: true,
    indexGoogle: false,
    readReceipts: true,
    directInvites: true,
  });
  const [prefs, setPrefs] = useState<PrefsState>({
    language: "English (US)",
    currency: "USD ($)",
    theme: "Light",
    weeklyDigest: true,
    autoReply: false,
  });
  const [sessions, setSessions] = useState<SessionDevice[]>([
    {
      id: "s1",
      device: "MacBook Pro",
      loc: "Dubai, UAE",
      time: "Active now",
      Icon: Laptop,
      current: true,
    },
    {
      id: "s2",
      device: "iPhone 15 Pro",
      loc: "Dubai, UAE",
      time: "2 hours ago",
      Icon: Smartphone,
      current: false,
    },
    {
      id: "s3",
      device: "Windows Desktop",
      loc: "London, UK",
      time: "Dec 12, 2023",
      Icon: Monitor,
      current: false,
    },
  ]);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [addLangInput, setAddLangInput] = useState("");
  const [showAddLang, setShowAddLang] = useState(false);

  const showToast = useCallback(
    (msg: string, type: ToastType = "success") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3500);
    },
    []
  );

  useEffect(() => {
    api
      .fetchProfile()
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.saveProfile(profile);
      showToast("Changes saved successfully!");
    } catch {
      showToast("Failed to save changes.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPw || !newPw) {
      showToast("Please fill in both password fields.", "error");
      return;
    }
    if (newPw !== confirmPw) {
      showToast("New passwords do not match.", "error");
      return;
    }
    setChangingPw(true);
    try {
      const result = await api.changePassword(currentPw, newPw);
      if (result.success) {
        showToast(result.message);
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
      } else {
        showToast(result.message, "error");
      }
    } catch {
      showToast("Password change failed.", "error");
    } finally {
      setChangingPw(false);
    }
  };

  const handleRevokeSession = async (session: SessionDevice) => {
    try {
      await api.revokeSession(session.id);
      setSessions((prev) => prev.filter((s) => s.id !== session.id));
      showToast(`Logged out from ${session.device}`);
    } catch {
      showToast("Failed to revoke session.", "error");
    }
  };

  const handleRevokeAll = async () => {
    const others = sessions.filter((s) => !s.current);
    for (const s of others) await api.revokeSession(s.id).catch(() => {});
    setSessions((prev) => prev.filter((s) => s.current));
    showToast("All other sessions revoked.");
  };

  const handleDeactivate = async () => {
    if (
      !window.confirm(
        "Deactivate your account? You can reactivate it later."
      )
    )
      return;
    try {
      await api.deactivateAccount();
      showToast("Account deactivated.", "error");
    } catch {
      showToast("Failed to deactivate account.", "error");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "This will permanently delete your account and all data. This CANNOT be undone."
      )
    )
      return;
    try {
      await api.deleteAccount();
      showToast("Account permanently deleted.", "error");
    } catch {
      showToast("Failed to delete account.", "error");
    }
  };

  const handleDownloadData = async () => {
    showToast("Preparing your data export…");
    try {
      const blob = await api.downloadData();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-freelancer-data.json";
      a.click();
      URL.revokeObjectURL(url);
      showToast("Data downloaded successfully!");
    } catch {
      showToast("Download failed.", "error");
    }
  };

  const handleAddLanguage = () => {
    const lang = addLangInput.trim();
    if (lang && !profile.languages.includes(lang))
      setProfile((p) => ({ ...p, languages: [...p.languages, lang] }));
    setAddLangInput("");
    setShowAddLang(false);
  };

  const pwStrength =
    newPw.length === 0
      ? 0
      : newPw.length < 6
      ? 30
      : newPw.length < 10
      ? 60
      : 85;
  const pwBar =
    pwStrength < 40
      ? "bg-red-500"
      : pwStrength < 70
      ? "bg-amber-400"
      : "bg-emerald-500";
  const pwLabel =
    pwStrength < 40 ? "Weak" : pwStrength < 70 ? "Moderate" : "Strong";
  const pwLabelColor =
    pwStrength < 40
      ? "text-red-500"
      : pwStrength < 70
      ? "text-amber-500"
      : "text-emerald-600";

  const privacyBooleanKeys: [PrivacyBooleanKey, string, React.ElementType][] =
    [
      ["showEarnings", "Show earnings history", DollarSign],
      ["showProjects", "Show active projects", FileText],
      ["indexGoogle", "Index my profile in Google", Globe],
      ["readReceipts", "Read receipts for messages", Check],
      ["directInvites", "Allow direct invites", Mail],
    ];

  const prefsBooleanKeys: [PrefsBooleanKey, string, React.ElementType][] = [
    ["weeklyDigest", "Email Weekly Digest", Mail],
    ["autoReply", "Auto-Reply (Out of office)", Bell],
  ];

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-violet-600" />
          <p className="text-[13px] text-gray-500">Loading your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <Toast toast={toast} />

      <div className="mx-auto max-w-[860px] px-8 py-7">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Account Settings
            </h1>
            <p className="mt-1 text-[13px] text-gray-500">
              Manage your profile information, security preferences, and account
              visibility.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>

        {/* ── Profile Card ── */}
        <SectionCard className="mb-6">
          {/* Avatar row */}
          <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-5">
            <div className="relative">
              <div className="h-[72px] w-[72px] overflow-hidden rounded-full bg-gray-200">
                <img
                  src={
                    profile.avatar || ""
                  }
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-violet-600 transition hover:bg-violet-700"
              >
                <Camera size={11} className="text-white" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfile((p) => ({
                        ...p,
                        avatar: URL.createObjectURL(file),
                      }));
                      showToast("Profile photo updated!");
                    }
                  }}
                />
              </label>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-gray-900">
                  Profile Information
                </span>
                <span className="flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-600">
                  <BadgeCheck size={11} /> AI VERIFIED
                </span>
              </div>
              <p className="mt-1 text-[13px] text-gray-500">
                Update your photo and personal details here.
              </p>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-2 gap-5">
            <Field label="Full Name" icon={User}>
              <input
                className={inputCls}
                value={profile.fullName}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, fullName: e.target.value }))
                }
              />
            </Field>
            <Field label="Display Name" icon={AtSign}>
              <input
                className={inputCls}
                value={profile.displayName}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, displayName: e.target.value }))
                }
              />
            </Field>
            <Field label="Email Address" icon={Mail}>
              <div className="relative">
                <input
                  className={`${inputCls} pr-24`}
                  value={profile.email}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, email: e.target.value }))
                  }
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <Badge color="green">VERIFIED</Badge>
                </span>
              </div>
            </Field>
            <Field label="Phone Number" icon={Phone}>
              <input
                className={inputCls}
                value={profile.phone}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </Field>
            <Field label="Date of Birth" icon={CalendarDays}>
              <input
                type="date"
                className={inputCls}
                value={profile.dob}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, dob: e.target.value }))
                }
              />
            </Field>
            <Field label="Gender" icon={User}>
              <div className="relative">
                <select
                  className={selectCls}
                  value={profile.gender}
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      gender: e.target.value as GenderOption,
                    }))
                  }
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </Field>
            <Field label="Location" icon={MapPin}>
              <input
                className={inputCls}
                value={profile.location}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, location: e.target.value }))
                }
              />
            </Field>
            <Field label="Timezone" icon={Globe}>
              <div className="relative">
                <select
                  className={selectCls}
                  value={profile.timezone}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, timezone: e.target.value }))
                  }
                >
                  <option>GMT +04:00 (Dubai)</option>
                  <option>GMT +00:00 (London)</option>
                  <option>GMT -05:00 (New York)</option>
                  <option>GMT +08:00 (Singapore)</option>
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Professional Bio" icon={Pencil}>
              <textarea
                className={`${inputCls} min-h-[96px] resize-y`}
                value={profile.bio}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, bio: e.target.value }))
                }
              />
            </Field>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-5">
            <Field label="Hourly Rate" icon={DollarSign}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  className={`${inputCls} pl-7`}
                  value={profile.hourlyRate}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, hourlyRate: e.target.value }))
                  }
                />
              </div>
            </Field>
            <Field label="Languages" icon={Languages}>
              <div className="flex flex-wrap items-center gap-2">
                {profile.languages.map((lang) => (
                  <span
                    key={lang}
                    className="flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-[13px] text-gray-700"
                  >
                    {lang}
                    <button
                      onClick={() =>
                        setProfile((p) => ({
                          ...p,
                          languages: p.languages.filter((l) => l !== lang),
                        }))
                      }
                      className="flex items-center text-gray-400 hover:text-gray-700"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
                {showAddLang ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      autoFocus
                      value={addLangInput}
                      onChange={(e) => setAddLangInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddLanguage();
                        if (e.key === "Escape") setShowAddLang(false);
                      }}
                      className="w-28 rounded-md border border-gray-200 px-2 py-1 text-[12px] outline-none focus:border-violet-500"
                      placeholder="e.g. French"
                    />
                    <button
                      onClick={handleAddLanguage}
                      className="rounded-md bg-violet-600 px-2.5 py-1 text-[12px] font-semibold text-white hover:bg-violet-700"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddLang(false)}
                      className="text-gray-400 hover:text-gray-700"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddLang(true)}
                    className="flex items-center gap-1 text-[13px] font-semibold text-violet-600 hover:text-violet-800"
                  >
                    <Plus size={13} /> Add Language
                  </button>
                )}
              </div>
            </Field>
          </div>
        </SectionCard>

        {/* ── Security + Privacy row ── */}
        <div className="mb-5 grid grid-cols-2 gap-5">
          {/* Security */}
          <SectionCard>
            <SectionTitle icon={Shield}>Security & Authentication</SectionTitle>

            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Change Password
            </p>
            <input
              type="password"
              placeholder="Current Password"
              className={`${inputCls} mb-2.5`}
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className={`${inputCls} mb-2`}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className={`${inputCls} mb-3`}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
            />

            {newPw && (
              <div className="mb-3">
                <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${pwBar}`}
                    style={{ width: `${pwStrength}%` }}
                  />
                </div>
                <p className={`mt-1 text-[11px] font-semibold ${pwLabelColor}`}>
                  {pwLabel} password
                </p>
              </div>
            )}

            <button
              onClick={handleChangePassword}
              disabled={changingPw}
              className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 py-2.5 text-[13px] font-bold text-white transition hover:bg-violet-700 disabled:opacity-60"
            >
              {changingPw ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <KeyRound size={13} />
              )}
              {changingPw ? "Changing…" : "Update Password"}
            </button>

            {/* 2FA */}
            <div className="border-t border-gray-100 pt-4">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Two-Factor Authentication
              </p>
              <div className="mb-3 flex items-center justify-between">
                <p className="max-w-[160px] text-[12px] text-gray-500">
                  Add an extra layer of security to your account.
                </p>
                <Toggle
                  checked={twoFactor}
                  onChange={(v) => {
                    setTwoFactor(v);
                    showToast(
                      v ? "2FA enabled!" : "2FA disabled.",
                      v ? "success" : "error"
                    );
                  }}
                />
              </div>
              {twoFactor && (
                <div className="flex items-center justify-between rounded-lg border border-violet-200 bg-violet-50 px-3.5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                      <Smartphone size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-gray-900">
                        Google Authenticator
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Enabled Oct 24, 2023
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      showToast("Redirecting to 2FA configuration…")
                    }
                    className="text-[13px] font-semibold text-violet-600 hover:text-violet-800"
                  >
                    Configure
                  </button>
                </div>
              )}
            </div>

            {/* Sessions */}
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Active Sessions
              </p>
              <div className="divide-y divide-gray-50">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <session.Icon size={17} className="text-gray-400" />
                      <div>
                        <p className="text-[13px] font-semibold text-gray-900">
                          {session.device}{" "}
                          <span className="font-normal text-gray-400">
                            — {session.loc}
                          </span>
                        </p>
                        <p
                          className={`flex items-center gap-1 text-[11px] ${
                            session.current
                              ? "text-emerald-500"
                              : "text-gray-400"
                          }`}
                        >
                          {session.current && (
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          )}
                          {session.time}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <button
                        onClick={() => handleRevokeSession(session)}
                        className="flex items-center gap-1 text-[12px] font-semibold text-red-500 hover:text-red-700"
                      >
                        <LogOut size={12} /> Logout
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {sessions.length > 1 && (
                <button
                  onClick={handleRevokeAll}
                  className="mt-2 flex items-center gap-1 text-[12px] font-semibold text-red-500 hover:text-red-700"
                >
                  <Trash2 size={12} /> Revoke all other sessions
                </button>
              )}
            </div>
          </SectionCard>

          {/* Privacy + Preferences column */}
          <div className="flex flex-col gap-5">
            {/* Privacy */}
            <SectionCard>
              <SectionTitle icon={Eye}>Privacy</SectionTitle>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[13px] text-gray-700">
                  Profile visibility
                </span>
                <div className="relative">
                  <select
                    className="cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-[12px] text-gray-700 outline-none focus:border-violet-500"
                    value={privacy.visibility}
                    onChange={(e) =>
                      setPrivacy((p) => ({
                        ...p,
                        visibility: e.target.value as VisibilityOption,
                      }))
                    }
                  >
                    <option>Public</option>
                    <option>Private</option>
                    <option>Contacts only</option>
                  </select>
                  <ChevronDown
                    size={12}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {privacyBooleanKeys.map(([key, label, Icon]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2.5"
                  >
                    <span className="flex items-center gap-2 text-[13px] text-gray-700">
                      <Icon size={13} className="text-gray-400" /> {label}
                    </span>
                    <Toggle
                      checked={privacy[key]}
                      onChange={(v) =>
                        setPrivacy((p) => ({ ...p, [key]: v }))
                      }
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Preferences */}
            <SectionCard>
              <SectionTitle icon={SlidersHorizontal}>Preferences</SectionTitle>
              <div className="mb-4 grid grid-cols-2 gap-3">
                <Field label="Language" icon={Languages}>
                  <div className="relative">
                    <select
                      className={selectCls}
                      value={prefs.language}
                      onChange={(e) =>
                        setPrefs((p) => ({ ...p, language: e.target.value }))
                      }
                    >
                      <option>English (US)</option>
                      <option>Arabic</option>
                      <option>French</option>
                    </select>
                    <ChevronDown
                      size={12}
                      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </Field>
                <Field label="Currency" icon={DollarSign}>
                  <div className="relative">
                    <select
                      className={selectCls}
                      value={prefs.currency}
                      onChange={(e) =>
                        setPrefs((p) => ({ ...p, currency: e.target.value }))
                      }
                    >
                      <option>USD ($)</option>
                      <option>EUR (euro)</option>
                      <option>AED</option>
                    </select>
                    <ChevronDown
                      size={12}
                      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </Field>
              </div>

              <Field label="Theme" icon={Sun}>
                <div className="mb-4 flex overflow-hidden rounded-lg border border-gray-200">
                  {(["Light", "Dark"] as ThemeOption[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setPrefs((p) => ({ ...p, theme: t }))}
                      className={`flex flex-1 items-center justify-center gap-1.5 py-2 text-[13px] transition-colors
                        ${
                          prefs.theme === t
                            ? "bg-violet-50 font-bold text-violet-700"
                            : "bg-white font-normal text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      {t === "Light" ? <Sun size={13} /> : <Moon size={13} />}{" "}
                      {t}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="divide-y divide-gray-50">
                {prefsBooleanKeys.map(([key, label, Icon]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2.5"
                  >
                    <span className="flex items-center gap-2 text-[13px] text-gray-700">
                      <Icon size={13} className="text-gray-400" /> {label}
                    </span>
                    <Toggle
                      checked={prefs[key]}
                      onChange={(v) =>
                        setPrefs((p) => ({ ...p, [key]: v }))
                      }
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>

        {/* ── Danger Zone ── */}
        <div className="rounded-xl border border-red-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle size={17} className="text-red-500" />
            <h2 className="text-[15px] font-bold text-red-500">Danger Zone</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <button
              onClick={handleDeactivate}
              className="flex w-full items-center justify-between py-3 text-left text-[14px] text-gray-700 hover:text-gray-900"
            >
              <span className="flex items-center gap-2">
                <ShieldOff size={15} className="text-gray-400" /> Deactivate
                Account
              </span>
              <ChevronRight size={15} className="text-gray-300" />
            </button>
            <button
              onClick={handleDownloadData}
              className="flex w-full items-center justify-between py-3 text-left text-[14px] text-gray-700 hover:text-gray-900"
            >
              <span className="flex items-center gap-2">
                <Download size={15} className="text-gray-400" /> Download Your
                Data
              </span>
              <Download size={14} className="text-gray-300" />
            </button>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 py-3 text-[14px] font-bold text-white transition hover:bg-red-600"
          >
            <Trash2 size={15} /> Delete Account Permanently
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Notification Settings Page ───────────────────────────────────────────────

function NotificationSettingsPage() {
  const [channels, setChannels] = useState<ChannelsState>({
    inApp: true,
    email: true,
    push: false,
  });
  const [muteAll, setMuteAll] = useState(false);
  const [categories, setCategories] = useState<CategoriesState>({
    orders: true,
    messages: true,
    payments: true,
    platform: false,
  });
  const [quietHours, setQuietHours] = useState(true);
  const [timeFrom, setTimeFrom] = useState("22:00");
  const [timeTo, setTimeTo] = useState("08:00");
  const [activeDays, setActiveDays] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [saving, setSaving] = useState(false);

  const showToast = useCallback(
    (msg: string, type: ToastType = "success") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.saveNotifications({
        channels,
        muteAll,
        categories,
        quietHours,
        timeFrom,
        timeTo,
        activeDays,
      });
      showToast("Notification settings saved!");
    } catch {
      showToast("Failed to save.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setChannels({ inApp: true, email: true, push: false });
    setMuteAll(false);
    setCategories({ orders: true, messages: true, payments: true, platform: false });
    setQuietHours(true);
    setTimeFrom("22:00");
    setTimeTo("08:00");
    setActiveDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
    showToast("Settings reset to defaults");
  };

  const toggleDay = (day: string) =>
    setActiveDays((d) =>
      d.includes(day) ? d.filter((x) => x !== day) : [...d, day]
    );

  const toggleChannel = (key: ChannelKey) => {
    if (!muteAll) setChannels((c) => ({ ...c, [key]: !c[key] }));
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const channelConfig: {
    key: ChannelKey;
    label: string;
    sub: string;
    Icon: React.ElementType;
  }[] = [
    { key: "inApp", label: "In-App", sub: "Browser & Desktop", Icon: BellRing },
    { key: "email", label: "Email", sub: "Daily Digest & Alerts", Icon: Mail },
    { key: "push", label: "Push", sub: "Mobile App Alerts", Icon: Smartphone },
  ];

  function NotifRow({
    label,
    mandatory = false,
  }: {
    label: string;
    mandatory?: boolean;
  }) {
    return (
      <div className="flex items-center justify-between border-b border-gray-50 py-2.5 last:border-0">
        <span className="text-[13px] text-gray-700">{label}</span>
        <div className="flex items-center gap-4">
          <Bell
            size={15}
            className={
              mandatory
                ? "text-violet-600"
                : "cursor-pointer text-violet-500 hover:text-violet-700"
            }
          />
          <Mail
            size={15}
            className={
              mandatory
                ? "text-violet-600"
                : "cursor-pointer text-gray-400 hover:text-gray-700"
            }
          />
          <Smartphone
            size={15}
            className={
              mandatory
                ? "text-violet-600"
                : "cursor-pointer text-gray-200 hover:text-gray-400"
            }
          />
        </div>
      </div>
    );
  }

  function CategorySection({
    title,
    description,
    Icon,
    catKey,
    accentColor,
    children,
    mandatory = false,
  }: {
    title: string;
    description: string;
    Icon: React.ElementType;
    catKey?: CategoryKey;
    accentColor: string;
    children?: React.ReactNode;
    mandatory?: boolean;
  }) {
    return (
      <div
        className={`mb-4 rounded-xl border p-5 ${
          mandatory
            ? "border-amber-200 bg-amber-50"
            : "border-gray-200 bg-white"
        }`}
      >
        <div
          className={`flex items-center justify-between ${
            children ? "mb-3" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ background: accentColor + "1a" }}
            >
              <Icon size={19} style={{ color: accentColor }} />
            </div>
            <div>
              <p className="text-[14px] font-bold text-gray-900">{title}</p>
              <p className="text-[12px] text-gray-500">{description}</p>
            </div>
          </div>
          {mandatory ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700">
              <Lock size={11} /> MANDATORY
            </span>
          ) : catKey ? (
            <Toggle
              checked={!muteAll && categories[catKey]}
              onChange={(v) => setCategories((c) => ({ ...c, [catKey]: v }))}
              size="sm"
              disabled={muteAll}
            />
          ) : null}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <Toast toast={toast} />

      <div className="mx-auto w-full px-8 py-7">
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Notification Settings
          </h1>
          <p className="mt-1 text-[13px] text-gray-500">
            Configure how and when you want to receive updates about your work
            and account activity.
          </p>
        </div>

        {/* Global Channels */}
        <SectionCard className="mb-5">
          <h2 className="mb-4 text-[15px] font-bold text-gray-900">
            Global Channels
          </h2>
          <div className="mb-5 grid grid-cols-3 gap-4">
            {channelConfig.map(({ key, label, sub, Icon }) => {
              const active = channels[key] && !muteAll;
              return (
                <button
                  key={key}
                  onClick={() => toggleChannel(key)}
                  disabled={muteAll}
                  className={`flex flex-col items-center rounded-xl border-2 px-4 py-4 text-center transition-all
                    ${
                      active
                        ? "border-violet-500 bg-violet-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }
                    ${muteAll ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                >
                  <Icon
                    size={26}
                    className={`mb-2 ${
                      active ? "text-violet-600" : "text-gray-400"
                    }`}
                  />
                  <p className="mb-0.5 text-[13px] font-bold text-gray-900">
                    {label}
                  </p>
                  <p className="mb-3 text-[11px] text-gray-400">{sub}</p>
                  {key === "inApp" && active ? (
                    <Badge color="green">ACTIVE</Badge>
                  ) : (
                    <Toggle
                      checked={active}
                      onChange={() => toggleChannel(key)}
                      size="sm"
                      disabled={muteAll}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <Volume2 size={14} className="text-red-500" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-900">
                  Mute All Notifications
                </p>
                <p className="text-[11px] text-gray-500">
                  Temporarily disable all notification channels
                </p>
              </div>
            </div>
            <Toggle
              checked={muteAll}
              onChange={(v) => {
                setMuteAll(v);
                showToast(
                  v ? "All notifications muted." : "Notifications unmuted!",
                  v ? "error" : "success"
                );
              }}
              size="sm"
            />
          </div>
        </SectionCard>

        <CategorySection
          title="Orders & Projects"
          description="Updates on milestones, deliverables, and timelines"
          Icon={FileText}
          catKey="orders"
          accentColor="#7C3AED"
        >
          <NotifRow label="New Order Placed" />
          <NotifRow label="Milestone Approved" />
        </CategorySection>

        <CategorySection
          title="Messages"
          description="Real-time chat and communication alerts"
          Icon={Mail}
          catKey="messages"
          accentColor="#2563EB"
        >
          <NotifRow label="New Direct Message" />
        </CategorySection>

        <CategorySection
          title="Payments"
          description="Earnings, withdrawals, and financial statements"
          Icon={CreditCard}
          catKey="payments"
          accentColor="#059669"
        >
          <NotifRow label="Payment Received" />
        </CategorySection>

        <CategorySection
          title="Account & Security"
          description="Critical security updates and login attempts"
          Icon={Shield}
          accentColor="#D97706"
          mandatory
        >
          <NotifRow label="New Login Attempt" mandatory />
          <NotifRow label="Password Changed" mandatory />
        </CategorySection>

        {/* Platform */}
        <div
          className={`mb-4 rounded-xl border border-gray-200 bg-white p-5 transition-opacity ${
            muteAll || !categories.platform ? "opacity-50" : "opacity-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <Globe size={19} className="text-gray-400" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-700">
                  Platform & Promotions
                </p>
                <p className="text-[12px] text-gray-400">
                  News, special offers, and platform tips
                </p>
              </div>
            </div>
            <Toggle
              checked={!muteAll && categories.platform}
              onChange={(v) =>
                setCategories((c) => ({ ...c, platform: v }))
              }
              size="sm"
              disabled={muteAll}
            />
          </div>
        </div>

        {/* Save & Schedule */}
        <SectionCard>
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">
                Save & Schedule
              </h2>
              <p className="mt-0.5 text-[12px] text-gray-500">
                Configure your Do Not Disturb window for a better work-life
                balance.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-gray-700">
                Quiet Hours
              </span>
              <Toggle
                checked={quietHours}
                onChange={setQuietHours}
                size="sm"
              />
            </div>
          </div>

          {quietHours && (
            <div className="mb-5 grid grid-cols-2 gap-6">
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Time Range
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="time"
                      value={timeFrom}
                      onChange={(e) => setTimeFrom(e.target.value)}
                      className={inputCls}
                    />
                    <Clock
                      size={13}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  <span className="text-[13px] text-gray-400">to</span>
                  <div className="relative flex-1">
                    <input
                      type="time"
                      value={timeTo}
                      onChange={(e) => setTimeTo(e.target.value)}
                      className={inputCls}
                    />
                    <Clock
                      size={13}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Active Days
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {days.map((day) => {
                    const on = activeDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`rounded-md border px-2.5 py-1.5 text-[12px] font-semibold transition-colors
                          ${
                            on
                              ? "border-violet-600 bg-violet-600 text-white"
                              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                          }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-[14px] font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <RefreshCw size={14} /> Reset Defaults
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-2.5 text-[14px] font-bold text-white transition hover:bg-violet-700 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activePage, setActivePage] = useState<PageId>("settings");

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
      <div className="flex flex-1 flex-col overflow-hidden">
        {activePage === "settings" && <AccountSettingsPage />}
        {activePage === "notifications" && <NotificationSettingsPage />}
        {!["settings", "notifications"].includes(activePage) && (
          <div className="flex flex-1 items-center justify-center text-[16px] text-gray-400">
            Navigate to Settings or Notifications to see the pages.
          </div>
        )}
      </div>
    </div>
  );
}