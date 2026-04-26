export type TaskStatus = "todo" | "inprogress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  tag: string;
  tagColor: string;
  status: TaskStatus;
  assignees: string[];
  comments?: number;
  views?: number;
  date?: string;
}

// ✅ GET all tasks
export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

// ✅ CREATE task
export async function createTask(
  task: Omit<Task, "id">
): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(task),
  });

  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

// ✅ UPDATE task
export async function updateTask(
  id: string,
  patch: Partial<Task>
): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(patch),
  });

  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}