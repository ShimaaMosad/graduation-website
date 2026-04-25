export type Job = {
  id: number;
  title: string;
  status: "Active" | "In Progress" | "Completed" | "Drafts" | "Closed";
  posted: string;
  category: string;
  price: string;
  description: string;
  proposals: number;
  views: number;
  hiredText: string;
  hiredSubLink: string;
  rightStatusTitle: string;
  rightStatusSub: string;
};

/*
========================================
 BACKEND INTEGRATION (IMPORTANT)
========================================

Replace the mock implementation below with real API calls.

Base URL:
http://localhost:5000/api

Expected endpoints:

GET     /jobs
GET     /jobs/:id
POST    /jobs
PUT     /jobs/:id
DELETE  /jobs/:id
PATCH   /jobs/:id/status

Example:

export async function getPostedJobs(): Promise<Job[]> {
  const res = await fetch("http://localhost:5000/api/jobs", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}
*/

// ================= MOCK DATA =================

export const jobs: Job[] = [
  {
    id: 1,
    title: "Full Stack Developer for SaaS Platform",
    status: "Active",
    posted: "2 days ago",
    category: "Web Development",
    price: "$2,500 - $3,500",
    description:
      "We're looking for an experienced Full Stack Developer to help build and scale our SaaS platform...",
    proposals: 8,
    views: 124,
    hiredText: "Not hired yet",
    hiredSubLink: "",
    rightStatusTitle: "Waiting for proposals",
    rightStatusSub: "Last activity: 2 hours ago",
  },
  {
    id: 2,
    title: "UI/UX Designer for Mobile App",
    status: "In Progress",
    posted: "1 week ago",
    category: "Design",
    price: "$1,500 - $2,000",
    description:
      "Looking for a talented UI/UX designer to create a modern, user-friendly mobile app design...",
    proposals: 12,
    views: 89,
    hiredText: "Sara Mohamed",
    hiredSubLink: "View progress",
    rightStatusTitle: "In progress",
    rightStatusSub: "Last activity: 5 hours ago",
  },
  {
    id: 3,
    title: "API Integration Specialist",
    status: "Completed",
    posted: "3 weeks ago",
    category: "Web Development",
    price: "$800 - $1,200",
    description:
      "Need an experienced developer to integrate third-party APIs into our existing platform...",
    proposals: 6,
    views: 67,
    hiredText: "Michael Chen",
    hiredSubLink: "View progress",
    rightStatusTitle: "Completed",
    rightStatusSub: "Last activity: Completed 2 days ago",
  },
  {
    id: 4,
    title: "Content Writer for Blog Articles",
    status: "Drafts",
    posted: "4 days ago",
    category: "Writing",
    price: "$300 - $500",
    description:
      "Draft job post for a content writer to produce weekly blog articles for our company website...",
    proposals: 0,
    views: 0,
    hiredText: "No applicants yet",
    hiredSubLink: "",
    rightStatusTitle: "Draft saved",
    rightStatusSub: "Last edit: yesterday",
  },
  {
    id: 5,
    title: "Customer Support Specialist",
    status: "Closed",
    posted: "1 month ago",
    category: "Support",
    price: "$700 - $1,000",
    description:
      "This job has been closed after reviewing all received proposals and completing the hiring process...",
    proposals: 17,
    views: 150,
    hiredText: "Closed by owner",
    hiredSubLink: "",
    rightStatusTitle: "Closed",
    rightStatusSub: "Last activity: 1 week ago",
  },
];

// ================= FUNCTIONS =================

export function getPostedJobs(): Job[] {
  return jobs;
}

export function getJobById(id: number): Job | undefined {
  return jobs.find((job) => job.id === id);
}