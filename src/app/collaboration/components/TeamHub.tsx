"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTask, fetchTasks, Task, TaskStatus, updateTask } from "@/src/lib/api/tasks";
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
  Pencil,
  Upload,
  Filter
} from "lucide-react";


// ─── Fallback data (shown only if API fails) ──────────────────────────────────
const fallbackTasks: Task[] = [
  { id: "1", title: "Draft initial logo concepts", description: "Create 3 distinct concepts based on the...", tag: "Design", tagColor: "blue", status: "todo", assignees: ["AH"], views: 2 },
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

const columns: { id: TaskStatus; label: string; color: string; dot: string }[] = [
  { id: "todo", label: "TO DO", color: "text-gray-700", dot: "bg-red-500" },
  { id: "inprogress", label: "IN PROGRESS", color: "text-gray-700", dot: "bg-blue-500" },
  { id: "done", label: "DONE", color: "text-gray-700", dot: "bg-green-500" },
];


// ─── Component ────────────────────────────────────────────────────────────────
export default function TeamHub() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Tasks");
  const [dragId, setDragId] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", tag: "Design", status: "todo" as TaskStatus });
  const [saving, setSaving] = useState(false);

  // ── 1. GET /api/tasks on mount ──────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
const data = await fetchTasks();
setTasks(Array.isArray(data) ? data : []);
      } catch (err) {

  console.error(err);
  setTasks(fallbackTasks);
  setError(err instanceof Error ? err.message : "Could not reach server");      } finally {
        setLoading(false);
      }
    })();

  }, []);

  // ── 2. POST /api/tasks ──────────────────────────────────────────────────────
  const addTask = async () => {
    if (!newTask.title.trim()) return;

    const optimisticTask: Task = {
      id: `temp-${Date.now()}`,   // Temporary id until server responds
      title: newTask.title,
      tag: newTask.tag,
      tagColor: "blue",
      status: newTask.status,
      assignees: [],
    };

    // Optimistic UI update
    setTasks(prev => [...prev, optimisticTask]);
    setNewTask({ title: "", tag: "Design", status: "todo" });
    setShowAddTask(false);

    try {
      setSaving(true);
const savedTask = await createTask({
  title: optimisticTask.title,
  tag: optimisticTask.tag,
  tagColor: optimisticTask.tagColor,
  status: optimisticTask.status,
  assignees: optimisticTask.assignees,
});     

      // Replace optimistic entry with the real server task (correct id, etc.)
      setTasks(prev =>
        prev.map(t => (t.id === optimisticTask.id ? savedTask : t))
      );
    } catch (err) {
      console.error(err);
      // Roll back the optimistic update on failure
      setTasks(prev => prev.filter(t => t.id !== optimisticTask.id));
setError(err instanceof Error ? err.message : "Something went wrong");      }
 
    finally {
      setSaving(false);
    }
  };

  // ── 3. PATCH /api/tasks/:id (drag & drop) ──────────────────────────────────
  const handleDragStart = (id: string) => setDragId(id);

 const handleDrop = async (status: TaskStatus) => {
const id = dragId;
if (!id) return;
  const previousTasks = [...tasks];

  // Optimistic UI
  setTasks(prev =>
    prev.map(t => (t.id === dragId ? { ...t, status } : t))
  );

  setDragId(null);

  try {
    await updateTask(id, { status });
  } catch (err) {
    console.error(err);
    setTasks(previousTasks);
    setError("Failed to update task status");
  }
};
  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter(t => t.status === status);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
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
          {[
            { label: "Overview", icon: LayoutDashboard, active: false },
            { label: "My Team", icon: Users , active: false },
            { label: "Workspace", icon: Folder, active: true },
            { label: "Milestones", icon: Calendar , active: false },
            { label: "Files", icon: FileText, active: false },
            { label: "Chat",icon: MessageCircle , active: false },
          ].map(item => {
  const Icon = item.icon;

  return (
    <button
      key={item.label}
      className="flex items-center gap-3 px-3 py-2.5"
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
  <button className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
    <Plus className="w-4 h-4" />
    New Project
  </button>
</div>

</aside>
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
    {/* Saving indicator */}
    {saving && (
      <span className="text-xs text-purple-300 animate-pulse">
        Saving…
      </span>
    )}

    {/* Avatars */}
    <div className="flex -space-x-2">
      {["AH", "MO", "LI"].map((a, i) => (
        <div
          key={i}
          className="w-7 h-7 rounded-full bg-purple-500 border-2 border-gray-900 flex items-center justify-center text-xs font-semibold text-white"
        >
          {a}
        </div>
      ))}
      <div className="w-7 h-7 rounded-full bg-gray-600 border-2 border-gray-900 flex items-center justify-center text-xs text-gray-300">
        +2
      </div>
    </div>

    {/* Call */}
    <button className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
      <Phone className="w-4 h-4" />
      Call
    </button>

    {/* View */}
    <button className="flex items-center gap-1.5 bg-white text-gray-900 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
      <Eye className="w-4 h-4" />
      View Order
    </button>

    {/* Notifications */}
    <button className="p-1.5 text-gray-400 hover:text-gray-200">
      <Bell className="w-5 h-5" />
    </button>

    {/* Settings */}
    <button className="p-1.5 text-gray-400 hover:text-gray-200">
      <Settings className="w-5 h-5" />
    </button>
  </div>
</header>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-5 py-2 flex items-center justify-between">
            <span className="text-sm text-red-600">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 text-xs underline">Dismiss</button>
          </div>
        )}

        {/* Content area with file manager + board */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* File Manager Panel */}
          <div className="w-56 bg-white border-r border-gray-100 flex-shrink-0 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">File Manager</h3>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Storage</span>
                  <span>24% Used</span>
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
                    <span className="text-yellow-500">📁</span>
                    <span className="text-sm font-medium text-gray-800">Project Files</span>
                  </div>
                  {["Deliverables", "References", "Drafts"].map(f => (
                    <div key={f} className="flex items-center gap-2 p-2 pl-6 rounded-lg hover:bg-gray-50 cursor-pointer">
<Folder className="w-3 h-3 text-gray-400" />                      <span className="text-sm text-gray-600">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">Recent</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-red-500 text-xs font-bold">PDF</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-gray-800 truncate">Brief_v2.pdf</div>
                      <div className="text-xs text-gray-400">2.4 MB • Today</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-500 text-xs font-bold">PNG</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-gray-800 truncate">Moodboard.png</div>
                      <div className="text-xs text-gray-400">5.1 MB • Yesterday</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
<Upload className="w-4 h-4 text-purple-600" />                </div>
                <div className="text-xs font-medium text-gray-700">Drag files here</div>
                <div className="text-xs text-gray-400">or click to browse</div>
              </div>
            </div>
          </div>

          {/* Kanban Board Area */}
          <div className="flex-1 p-5 overflow-auto">
            {/* Tabs */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex gap-1">
                {["Tasks", "Files", "Progress", "Timeline"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab
                        ? "text-purple-600 border-b-2 border-purple-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Board Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Sprint 1 Board</h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white transition-colors">
<Filter className="w-4 h-4" />
                  Filter
                </button>
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
                  <h3 className="font-semibold text-gray-900 mb-4">Add New Task</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 font-medium">Task Title</label>
                      <input
                        value={newTask.title}
                        onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder="Enter task title..."
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium">Tag</label>
                      <select
                        value={newTask.tag}
                        onChange={e => setNewTask(p => ({ ...p, tag: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                      >
                        <option>Design</option>
                        <option>Research</option>
                        <option>Client Comm</option>
                        <option>Setup</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium">Status</label>
                      <select
                        value={newTask.status}
                        onChange={e => setNewTask(p => ({ ...p, status: e.target.value as TaskStatus }))}
                        className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                      >
                        <option value="todo">To Do</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setShowAddTask(false)} className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button onClick={addTask} className="flex-1 px-3 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                      {saving ? "Saving…" : "Add Task"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading skeleton */}
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
              /* Columns */
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
                          onDragStart={() => handleDragStart(task.id)}
                          className={`bg-white rounded-xl p-3.5 shadow-sm border cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
                            col.id === "inprogress" ? "border-l-4 border-l-purple-500 border-gray-100" : "border-gray-100"
                          } ${task.status === "done" ? "opacity-75" : ""} ${task.id.startsWith("temp-") ? "opacity-60" : ""}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${tagColorMap[task.tagColor] || "bg-gray-100 text-gray-600"}`}>
                              {task.tag}
                            </span>
                            <button className="text-gray-300 hover:text-gray-500">
<MoreVertical className="w-4 h-4" />                            </button>
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
<Eye className="w-3 h-3" />                             
     {task.views}
                                </span>
                              )}
                              {task.comments !== undefined && (
                                <span className="flex items-center gap-1 text-xs text-white bg-purple-500 px-1.5 py-0.5 rounded-md">
<MessageCircle className="w-3 h-3" />
                                  {task.comments}
                                </span>
                              )}
                              {task.date && (
                                <span className="text-xs text-gray-400">{task.date}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
