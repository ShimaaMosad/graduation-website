"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  Folder,
  Calendar,
  FileText,
  MessageCircle,
  HelpCircle,
  User,
  Plus,
  Phone,
  Eye,
  Bell,
  Settings,
  MoreVertical,
  Upload,
  Filter,
  X,
  ChevronRight,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Search,
  LogOut,
  UserPlus,
  FolderOpen,
  Clock,
  Download,
  BarChart2,
  GitBranch,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type TaskStatus = "todo" | "inprogress" | "done";

interface Task {
  id: string;
  title: string;
  description?: string;
  tag: string;
  tagColor: string;
  status: TaskStatus;
  assignees: string[];
  views?: number;
  comments?: number;
  date?: string;
}

interface TeamMember {
  name: string;
  avatar: string;
  role: string;
  isLead: boolean;
}

// ─── API helpers ──────────────────────────────────────────────────────────────
const api = {
  async getTasks(): Promise<Task[]> {
    const res = await fetch("/api/tasks");
    if (!res.ok) throw new Error(`Tasks fetch failed: ${res.status}`);
    return res.json();
  },
  async createTask(task: Omit<Task, "id">): Promise<Task> {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error(`Create task failed: ${res.status}`);
    return res.json();
  },
  async updateTask(id: string, patch: Partial<Task>): Promise<Task> {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error(`Update task failed: ${res.status}`);
    return res.json();
  },
  async deleteTask(id: string): Promise<void> {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete task failed: ${res.status}`);
  },
  async getTeam(): Promise<TeamMember[]> {
    const res = await fetch("/api/team");
    if (!res.ok) throw new Error(`Team fetch failed: ${res.status}`);
    return res.json();
  },
  async addMember(member: Omit<TeamMember, "isLead">): Promise<TeamMember> {
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    });
    if (!res.ok) throw new Error(`Add member failed: ${res.status}`);
    return res.json();
  },
  async deleteMember(index: number): Promise<void> {
    const res = await fetch("/api/team", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index }),
    });
    if (!res.ok) throw new Error(`Delete member failed: ${res.status}`);
  },
};

// ─── Fallback data ────────────────────────────────────────────────────────────
const fallbackTasks: Task[] = [
  { id: "1", title: "Draft initial logo concepts", description: "Create 3 distinct concepts based on the brief...", tag: "Design", tagColor: "blue", status: "todo", assignees: ["AH"], views: 2 },
  { id: "2", title: "Competitor Analysis", tag: "Research", tagColor: "indigo", status: "todo", assignees: ["UN"] },
  { id: "3", title: "Review Brief Requirements", description: "Awaiting final confirmation on target audience demographics.", tag: "Client Comm", tagColor: "orange", status: "inprogress", assignees: ["MO"], comments: 3 },
  { id: "4", title: "Project Kickoff Meeting", tag: "Setup", tagColor: "gray", status: "done", assignees: [], date: "Oct 12" },
];

const tagColorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  indigo: "bg-indigo-50 text-indigo-600",
  orange: "bg-orange-50 text-orange-600",
  gray: "bg-gray-100 text-gray-500",
  green: "bg-green-50 text-green-600",
};

const tagOptions = [
  { label: "Design", color: "blue" },
  { label: "Research", color: "indigo" },
  { label: "Client Comm", color: "orange" },
  { label: "Setup", color: "gray" },
  { label: "Dev", color: "green" },
];

const columns: { id: TaskStatus; label: string; color: string; dot: string }[] = [
  { id: "todo", label: "TO DO", color: "text-gray-700", dot: "bg-red-500" },
  { id: "inprogress", label: "IN PROGRESS", color: "text-gray-700", dot: "bg-blue-500" },
  { id: "done", label: "DONE", color: "text-gray-700", dot: "bg-green-500" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Notification dropdown */
function NotificationPanel({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const notes = [
    { text: "Ahmed commented on 'Draft logo'", time: "2m ago", unread: true },
    { text: "New file uploaded: Brief_v3.pdf", time: "1h ago", unread: true },
    { text: "Task 'Kickoff Meeting' marked done", time: "3h ago", unread: false },
  ];

  return (
    <div ref={ref} className="absolute right-0 top-10 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-semibold text-gray-900 text-sm">Notifications</span>
        <button onClick={onClose}><X className="w-4 h-4 text-gray-400" /></button>
      </div>
      <div className="divide-y divide-gray-50">
        {notes.map((n, i) => (
          <div key={i} className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer ${n.unread ? "bg-purple-50/30" : ""}`}>
            {n.unread && <span className="mt-1.5 w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />}
            {!n.unread && <span className="mt-1.5 w-2 h-2 rounded-full bg-gray-200 flex-shrink-0" />}
            <div>
              <p className="text-xs text-gray-700">{n.text}</p>
              <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-gray-100">
        <button className="text-xs text-purple-600 hover:underline">Mark all as read</button>
      </div>
    </div>
  );
}

/** Settings dropdown */
function SettingsPanel({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
      {[
        { icon: User, label: "Profile" },
        { icon: Bell, label: "Notifications" },
        { icon: Users, label: "Team Settings" },
        { icon: GitBranch, label: "Integrations" },
        { icon: LogOut, label: "Sign Out", danger: true },
      ].map(({ icon: Icon, label, danger }) => (
        <button
          key={label}
          onClick={onClose}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${danger ? "text-red-500" : "text-gray-700"}`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}

/** View Order modal */
function ViewOrderModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900 text-lg">Order #2024-0091</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="space-y-3 mb-5">
          {[
            { label: "Project", value: "Modern Logo Design" },
            { label: "Client", value: "MySite" },
            { label: "Deadline", value: "Nov 15, 2024" },
            { label: "Budget", value: "$2,400" },
            { label: "Status", value: "In Progress" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">{label}</span>
              <span className="text-sm font-medium text-gray-900">{value}</span>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Overall Progress</span><span>42%</span></div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-[42%] bg-purple-500 rounded-full" />
          </div>
        </div>
        <button onClick={onClose} className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors">
          Close
        </button>
      </div>
    </div>
  );
}

/** Call modal */
function CallModal({ onClose }: { onClose: () => void }) {
  const [calling, setCalling] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setCalling(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Phone className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-1">{calling ? "Calling…" : "Connected"}</h3>
        <p className="text-sm text-gray-500 mb-6">MySite — Order #2024-0091</p>
        {calling && <Loader2 className="w-5 h-5 text-purple-500 animate-spin mx-auto mb-4" />}
        {!calling && <p className="text-xs text-green-600 mb-4 font-medium">Call in progress</p>}
        <button onClick={onClose} className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-colors">
          End Call
        </button>
      </div>
    </div>
  );
}

/** Team modal */
function TeamModal({ onClose }: { onClose: () => void }) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", role: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getTeam()
      .then(setMembers)
      .catch(() => setMembers([
        { name: "Ahmed Hassan", avatar: "AH", role: "Lead Designer", isLead: true },
        { name: "Lina Samir", avatar: "LS", role: "Illustrator", isLead: false },
      ]))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!form.name.trim() || !form.role.trim()) return;
    const initials = form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    setSaving(true);
    try {
      const member = await api.addMember({ name: form.name, avatar: initials, role: form.role });
      setMembers(prev => [...prev, member]);
      setForm({ name: "", role: "" });
      setAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add member");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (index: number) => {
    const prev = [...members];
    setMembers(m => m.filter((_, i) => i !== index));
    try {
      await api.deleteMember(index);
    } catch {
      setMembers(prev);
      setError("Failed to remove member");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900 text-lg">My Team</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        {error && <div className="mb-3 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg flex items-center gap-2"><AlertCircle className="w-3 h-3" />{error}</div>}
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-purple-500 animate-spin" /></div>
        ) : (
          <div className="space-y-2 mb-4">
            {members.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {m.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    {m.name}
                    {m.isLead && <span className="text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-md">Lead</span>}
                  </div>
                  <div className="text-xs text-gray-500">{m.role}</div>
                </div>
                {!m.isLead && (
                  <button onClick={() => handleDelete(i)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {adding ? (
          <div className="space-y-2 mb-3">
            <input
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Full name"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <input
              value={form.role}
              onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
              placeholder="Role"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <div className="flex gap-2">
              <button onClick={() => setAdding(false)} className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} disabled={saving} className="flex-1 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-60">
                {saving ? "Saving…" : "Add"}
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors">
            <UserPlus className="w-4 h-4" />
            Add Team Member
          </button>
        )}
      </div>
    </div>
  );
}

/** Task context menu */
function TaskMenu({ task, onEdit, onDelete, onClose }: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-6 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-40 overflow-hidden">
      <button onClick={() => { onEdit(); onClose(); }} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-700 hover:bg-gray-50">
        <Edit2 className="w-3.5 h-3.5" /> Edit Task
      </button>
      <button onClick={() => { onDelete(); onClose(); }} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-500 hover:bg-red-50">
        <Trash2 className="w-3.5 h-3.5" /> Delete
      </button>
    </div>
  );
}

/** Edit task modal */
function EditTaskModal({ task, onSave, onClose }: {
  task: Task;
  onSave: (patch: Partial<Task>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ title: task.title, description: task.description || "", tag: task.tag, status: task.status });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const tagColor = tagOptions.find(t => t.label === form.tag)?.color || "blue";
    await onSave({ ...form, tagColor });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Edit Task</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-gray-400" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 font-medium">Task Title</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2}
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Tag</label>
            <select value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))}
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300">
              {tagOptions.map(t => <option key={t.label}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as TaskStatus }))}
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300">
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.title.trim()} className="flex-1 px-3 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-60">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Filter popover */
function FilterPanel({ filter, onChange, onClose }: {
  filter: { tag: string; assignee: string };
  onChange: (f: { tag: string; assignee: string }) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-10 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-900">Filter</span>
        <button onClick={onClose}><X className="w-4 h-4 text-gray-400" /></button>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 font-medium">Tag</label>
          <select value={filter.tag} onChange={e => onChange({ ...filter, tag: e.target.value })}
            className="w-full mt-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300">
            <option value="">All Tags</option>
            {tagOptions.map(t => <option key={t.label}>{t.label}</option>)}
          </select>
        </div>
        <button onClick={() => { onChange({ tag: "", assignee: "" }); onClose(); }}
          className="w-full text-xs text-purple-600 hover:underline text-left">Clear filters</button>
      </div>
    </div>
  );
}

/** New Project modal */
function NewProjectModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", client: "", deadline: "" });
  const [saved, setSaved] = useState(false);

  const handleCreate = () => {
    if (!form.name.trim()) return;
    setSaved(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900 text-lg">New Project</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        {saved ? (
          <div className="flex flex-col items-center py-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Project created!</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs text-gray-500 font-medium">Project Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Brand Redesign 2025"
                  className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Client</label>
                <input value={form.client} onChange={e => setForm(p => ({ ...p, client: e.target.value }))}
                  placeholder="Client name"
                  className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} disabled={!form.name.trim()}
                className="flex-1 py-2.5 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-xl disabled:opacity-60 transition-colors">Create</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Tab content components ───────────────────────────────────────────────────

function FilesTab() {
  const files = [
    { name: "Brief_v2.pdf", size: "2.4 MB", date: "Today", ext: "PDF", color: "bg-red-100 text-red-500" },
    { name: "Moodboard.png", size: "5.1 MB", date: "Yesterday", ext: "PNG", color: "bg-blue-100 text-blue-500" },
    { name: "Logo_concept_1.ai", size: "8.3 MB", date: "Oct 14", ext: "AI", color: "bg-orange-100 text-orange-500" },
    { name: "Typography_guide.pdf", size: "1.1 MB", date: "Oct 13", ext: "PDF", color: "bg-red-100 text-red-500" },
  ];
  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Project Files</span>
          <button className="flex items-center gap-1.5 text-xs text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors">
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {files.map(f => (
            <div key={f.name} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
              <div className={`w-9 h-9 ${f.color.split(" ")[0]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <span className={`${f.color.split(" ")[1]} text-xs font-bold`}>{f.ext}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{f.name}</div>
                <div className="text-xs text-gray-400">{f.size} · {f.date}</div>
              </div>
              <button className="p-1.5 text-gray-300 hover:text-purple-600 transition-colors"><Download className="w-4 h-4" /></button>
              <button className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressTab() {
  const milestones = [
    { label: "Project Kickoff", done: true, date: "Oct 12" },
    { label: "Research & Brief", done: true, date: "Oct 15" },
    { label: "Logo Concepts", done: false, date: "Oct 22" },
    { label: "Client Review", done: false, date: "Oct 28" },
    { label: "Final Delivery", done: false, date: "Nov 15" },
  ];
  return (
    <div className="max-w-2xl space-y-5">
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4"><BarChart2 className="w-4 h-4 text-purple-500" /><span className="font-semibold text-gray-900 text-sm">Overall Progress</span></div>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-[42%] bg-purple-500 rounded-full" />
          </div>
          <span className="text-sm font-bold text-purple-600">42%</span>
        </div>
        <p className="text-xs text-gray-400">2 of 5 milestones completed</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4"><GitBranch className="w-4 h-4 text-purple-500" /><span className="font-semibold text-gray-900 text-sm">Milestones</span></div>
        <div className="space-y-3">
          {milestones.map((m, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${m.done ? "bg-green-500" : "bg-gray-100"}`}>
                {m.done ? <Check className="w-3.5 h-3.5 text-white" /> : <Clock className="w-3 h-3 text-gray-400" />}
              </div>
              <span className={`flex-1 text-sm ${m.done ? "line-through text-gray-400" : "text-gray-700"}`}>{m.label}</span>
              <span className="text-xs text-gray-400">{m.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineTab() {
  const events = [
    { date: "Oct 12", label: "Project Kickoff Meeting", tag: "Setup", done: true },
    { date: "Oct 14", label: "Moodboard uploaded", tag: "Design", done: true },
    { date: "Oct 15", label: "Competitor Analysis started", tag: "Research", done: false },
    { date: "Oct 18", label: "Brief Requirements Review", tag: "Client Comm", done: false },
    { date: "Oct 22", label: "Logo Concepts Due", tag: "Design", done: false },
  ];
  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-5"><Calendar className="w-4 h-4 text-purple-500" /><span className="font-semibold text-gray-900 text-sm">Sprint Timeline</span></div>
        <div className="relative pl-6 space-y-5">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-100" />
          {events.map((e, i) => (
            <div key={i} className="relative flex items-start gap-4">
              <div className={`absolute -left-4 w-3 h-3 rounded-full border-2 border-white ${e.done ? "bg-green-500" : "bg-gray-300"}`} style={{ top: 3 }} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{e.date}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${tagColorMap[tagOptions.find(t => t.label === e.tag)?.color || "gray"] || "bg-gray-100 text-gray-500"}`}>{e.tag}</span>
                </div>
                <p className={`text-sm mt-0.5 ${e.done ? "line-through text-gray-400" : "text-gray-800"}`}>{e.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function TeamHub() {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Tasks");
  const [activeNav, setActiveNav] = useState("Workspace");

  // Drag
  const [dragId, setDragId] = useState<string | null>(null);

  // Add task
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", tag: "Design", status: "todo" as TaskStatus });
  const [saving, setSaving] = useState(false);

  // Modals
  const [showOrder, setShowOrder] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);

  // Task actions
  const [menuTaskId, setMenuTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Header dropdowns
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Filter
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState({ tag: "", assignee: "" });
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // ── Fetch tasks ──────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await api.getTasks();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        setTasks(fallbackTasks);
        setError(err instanceof Error ? err.message : "Could not reach server — showing sample data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Add task ─────────────────────────────────────────────────────────────────
  const addTask = async () => {
    if (!newTask.title.trim()) return;
    const tagColor = tagOptions.find(t => t.label === newTask.tag)?.color || "blue";
    const optimistic: Task = {
      id: `temp-${Date.now()}`,
      title: newTask.title,
      tag: newTask.tag,
      tagColor,
      status: newTask.status,
      assignees: [],
    };
    setTasks(prev => [...prev, optimistic]);
    setNewTask({ title: "", tag: "Design", status: "todo" });
    setShowAddTask(false);
    try {
      setSaving(true);
      const saved = await api.createTask({ title: optimistic.title, tag: optimistic.tag, tagColor, status: optimistic.status, assignees: [] });
      setTasks(prev => prev.map(t => t.id === optimistic.id ? saved : t));
    } catch (err) {
      setTasks(prev => prev.filter(t => t.id !== optimistic.id));
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  // ── Update task ──────────────────────────────────────────────────────────────
  const updateTaskLocal = async (id: string, patch: Partial<Task>) => {
    const prev = [...tasks];
    setTasks(tasks.map(t => t.id === id ? { ...t, ...patch } : t));
    try {
      await api.updateTask(id, patch);
    } catch (err) {
      setTasks(prev);
      setError("Failed to update task");
    }
  };

  // ── Delete task ──────────────────────────────────────────────────────────────
  const deleteTask = async (id: string) => {
    const prev = [...tasks];
    setTasks(tasks.filter(t => t.id !== id));
    try {
      await api.deleteTask(id);
    } catch {
      setTasks(prev);
      setError("Failed to delete task");
    }
  };

  // ── Drag & drop ──────────────────────────────────────────────────────────────
  const handleDrop = async (status: TaskStatus) => {
    if (!dragId) return;
    await updateTaskLocal(dragId, { status });
    setDragId(null);
  };

  // ── Filtered tasks ───────────────────────────────────────────────────────────
  const filteredTasks = tasks.filter(t => {
    if (filter.tag && t.tag !== filter.tag) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getTasksByStatus = (status: TaskStatus) => filteredTasks.filter(t => t.status === status);

  const activeFilterCount = [filter.tag, filter.assignee].filter(Boolean).length;

  const navItems = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "My Team", icon: Users },
    { label: "Workspace", icon: Folder },
    { label: "Milestones", icon: Calendar },
    { label: "Files", icon: FileText },
    { label: "Chat", icon: MessageCircle },
  ];

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Modals */}
      {showOrder && <ViewOrderModal onClose={() => setShowOrder(false)} />}
      {showCall && <CallModal onClose={() => setShowCall(false)} />}
      {showTeam && <TeamModal onClose={() => setShowTeam(false)} />}
      {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} />}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={async (patch) => { await updateTaskLocal(editingTask.id, patch); }}
          onClose={() => setEditingTask(null)}
        />
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={e => {
          const names = Array.from(e.target.files || []).map(f => f.name);
          setUploadedFiles(prev => [...prev, ...names]);
          e.target.value = "";
        }}
      />

      {/* ── Sidebar ───────────────────────────────────────────────────────────── */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 flex-shrink-0">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-lg">🧑</div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Team Hub</div>
              <div className="text-xs text-gray-500">Lead Freelancer</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = item.label === activeNav;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveNav(item.label);
                  if (item.label === "My Team") setShowTeam(true);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            <User className="w-4 h-4" />
            Account
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={() => setShowNewProject(true)}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Header */}
        <header className="bg-gray-900 text-white px-5 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-purple-400">MySite</span>
            <div>
              <div className="text-sm font-semibold">Modern Logo Design</div>
              <div className="text-xs text-gray-400">Order #2024-0091</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saving && <span className="text-xs text-purple-300 animate-pulse">Saving…</span>}

            <div className="flex -space-x-2">
              {["AH", "MO", "LI"].map((a, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-purple-500 border-2 border-gray-900 flex items-center justify-center text-xs font-semibold text-white">
                  {a}
                </div>
              ))}
              <div className="w-7 h-7 rounded-full bg-gray-600 border-2 border-gray-900 flex items-center justify-center text-xs text-gray-300">+2</div>
            </div>

            <button
              onClick={() => setShowCall(true)}
              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call
            </button>

            <button
              onClick={() => setShowOrder(true)}
              className="flex items-center gap-1.5 bg-white text-gray-900 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Order
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(v => !v); setShowSettings(false); }}
                className="p-1.5 text-gray-400 hover:text-gray-200 relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-purple-500 rounded-full" />
              </button>
              {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
            </div>

            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => { setShowSettings(v => !v); setShowNotifications(false); }}
                className="p-1.5 text-gray-400 hover:text-gray-200"
              >
                <Settings className="w-5 h-5" />
              </button>
              {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
            </div>
          </div>
        </header>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-5 py-2 flex items-center justify-between flex-shrink-0">
            <span className="text-sm text-red-600 flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 text-xs underline">Dismiss</button>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* File Manager Panel */}
          <div className="w-56 bg-white border-r border-gray-100 flex-shrink-0 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">File Manager</h3>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Storage</span><span>24% Used</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/4 bg-purple-600 rounded-full" />
                </div>
                <div className="text-xs text-gray-400 mt-1">12 GB of 50 GB</div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">Folders</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-50 cursor-pointer">
                    <FolderOpen className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-800">Project Files</span>
                  </div>
                  {["Deliverables", "References", "Drafts"].map(f => (
                    <div key={f} className="flex items-center gap-2 p-2 pl-6 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Folder className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">Recent</div>
                <div className="space-y-2">
                  {[
                    { label: "Brief_v2.pdf", size: "2.4 MB", when: "Today", color: "bg-red-100 text-red-500", ext: "PDF" },
                    { label: "Moodboard.png", size: "5.1 MB", when: "Yesterday", color: "bg-blue-100 text-blue-500", ext: "PNG" },
                    ...uploadedFiles.map(name => ({
                      label: name,
                      size: "—",
                      when: "Just now",
                      color: "bg-green-100 text-green-500",
                      ext: name.split(".").pop()?.toUpperCase() || "FILE",
                    })),
                  ].map(file => (
                    <div key={file.label} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className={`w-8 h-8 ${file.color.split(" ")[0]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className={`${file.color.split(" ")[1]} text-xs font-bold`}>{file.ext}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-gray-800 truncate">{file.label}</div>
                        <div className="text-xs text-gray-400">{file.size} · {file.when}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xs font-medium text-gray-700">Drag files here</div>
                <div className="text-xs text-gray-400">or click to browse</div>
              </div>
            </div>
          </div>

          {/* Main Board Area */}
          <div className="flex-1 p-5 overflow-auto">

            {/* Tabs */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex gap-1">
                {["Tasks", "Files", "Progress", "Timeline"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "Files" && <FilesTab />}
            {activeTab === "Progress" && <ProgressTab />}
            {activeTab === "Timeline" && <TimelineTab />}

            {activeTab === "Tasks" && (
              <>
                {/* Board header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900">Sprint 1 Board</h2>
                    {showSearch && (
                      <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
                        <Search className="w-3.5 h-3.5 text-gray-400" />
                        <input
                          autoFocus
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          placeholder="Search tasks…"
                          className="text-sm outline-none w-36 text-gray-700 placeholder-gray-400"
                        />
                        {search && <button onClick={() => setSearch("")}><X className="w-3.5 h-3.5 text-gray-400" /></button>}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 relative">
                    <button
                      onClick={() => setShowSearch(v => !v)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white transition-colors"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowFilter(v => !v)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg bg-white transition-colors ${activeFilterCount ? "text-purple-600 border-purple-300" : "text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                      >
                        <Filter className="w-4 h-4" />
                        Filter
                        {activeFilterCount > 0 && (
                          <span className="w-4 h-4 text-xs bg-purple-600 text-white rounded-full flex items-center justify-center">{activeFilterCount}</span>
                        )}
                      </button>
                      {showFilter && (
                        <FilterPanel
                          filter={filter}
                          onChange={setFilter}
                          onClose={() => setShowFilter(false)}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => setShowAddTask(true)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Task
                    </button>
                  </div>
                </div>

                {/* Add Task Modal */}
                {showAddTask && (
                  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Add New Task</h3>
                        <button onClick={() => setShowAddTask(false)}><X className="w-4 h-4 text-gray-400" /></button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-500 font-medium">Task Title</label>
                          <input
                            value={newTask.title}
                            onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                            onKeyDown={e => e.key === "Enter" && addTask()}
                            className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                            placeholder="Enter task title…"
                            autoFocus
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 font-medium">Tag</label>
                          <select value={newTask.tag} onChange={e => setNewTask(p => ({ ...p, tag: e.target.value }))}
                            className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300">
                            {tagOptions.map(t => <option key={t.label}>{t.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 font-medium">Status</label>
                          <select value={newTask.status} onChange={e => setNewTask(p => ({ ...p, status: e.target.value as TaskStatus }))}
                            className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300">
                            <option value="todo">To Do</option>
                            <option value="inprogress">In Progress</option>
                            <option value="done">Done</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => setShowAddTask(false)} className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                        <button onClick={addTask} disabled={!newTask.title.trim() || saving}
                          className="flex-1 px-3 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-60">
                          {saving ? "Saving…" : "Add Task"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Skeleton */}
                {loading ? (
                  <div className="grid grid-cols-3 gap-4">
                    {columns.map(col => (
                      <div key={col.id} className="bg-gray-100/60 rounded-xl p-3 min-h-64">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-4" />
                        {[1, 2].map(i => (
                          <div key={i} className="bg-white rounded-xl p-3.5 mb-3 border border-gray-100">
                            <div className="h-3 w-16 bg-gray-100 rounded animate-pulse mb-2" />
                            <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-1" />
                            <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse" />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Kanban columns */
                  <div className="grid grid-cols-3 gap-4">
                    {columns.map(col => (
                      <div
                        key={col.id}
                        onDragOver={e => e.preventDefault()}
                        onDrop={() => handleDrop(col.id)}
                        className="bg-gray-100/60 rounded-xl p-3 min-h-64"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                            <span className="text-xs font-bold text-gray-600 tracking-wide">{col.label}</span>
                          </div>
                          <span className="text-xs font-semibold text-gray-500 bg-white rounded-full px-2 py-0.5">
                            {getTasksByStatus(col.id).length}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {getTasksByStatus(col.id).map(task => (
                            <div
                              key={task.id}
                              draggable
                              onDragStart={() => setDragId(task.id)}
                              className={`bg-white rounded-xl p-3.5 shadow-sm border cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
                                col.id === "inprogress" ? "border-l-4 border-l-purple-500 border-gray-100" : "border-gray-100"
                              } ${task.status === "done" ? "opacity-75" : ""} ${task.id.startsWith("temp-") ? "opacity-60" : ""}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${tagColorMap[task.tagColor] || "bg-gray-100 text-gray-600"}`}>
                                  {task.tag}
                                </span>
                                <div className="relative">
                                  <button
                                    onClick={() => setMenuTaskId(menuTaskId === task.id ? null : task.id)}
                                    className="text-gray-300 hover:text-gray-500"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                  {menuTaskId === task.id && (
                                    <TaskMenu
                                      task={task}
                                      onEdit={() => setEditingTask(task)}
                                      onDelete={() => deleteTask(task.id)}
                                      onClose={() => setMenuTaskId(null)}
                                    />
                                  )}
                                </div>
                              </div>

                              <div className={`text-sm font-medium text-gray-900 mb-1 ${task.status === "done" ? "line-through text-gray-400" : ""}`}>
                                {task.title}
                              </div>
                              {task.description && (
                                <div className="text-xs text-gray-500 mb-2 line-clamp-2">{task.description}</div>
                              )}
                              {col.id === "inprogress" && (
                                <div className="mb-2">
                                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full w-1/3 bg-purple-500 rounded-full" />
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex -space-x-1">
                                  {task.assignees.map((a, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-medium border border-white">
                                      {a}
                                    </div>
                                  ))}
                                </div>
                                <div className="flex items-center gap-2">
                                  {task.views !== undefined && (
                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                      <Eye className="w-3 h-3" />{task.views}
                                    </span>
                                  )}
                                  {task.comments !== undefined && (
                                    <span className="flex items-center gap-1 text-xs text-white bg-purple-500 px-1.5 py-0.5 rounded-md">
                                      <MessageCircle className="w-3 h-3" />{task.comments}
                                    </span>
                                  )}
                                  {task.date && <span className="text-xs text-gray-400">{task.date}</span>}
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Empty column prompt */}
                          {getTasksByStatus(col.id).length === 0 && (
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                              <p className="text-xs text-gray-400">Drop tasks here</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}