"use client";

import Link from "next/link";
import {
  Eye,
  FileText,
  MoreVertical,
  Pencil,
  Rocket,
  Trash2,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Job } from "@/lib/api";

type JobCardProps = {
  job: Job;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, newStatus: Job["status"]) => void;
};

export default function JobCard({ job, onDelete, onStatusChange }: JobCardProps) {
  const [openMenu, setOpenMenu] = useState(false);

  const statusClasses: Record<Job["status"], string> = {
    Active: "bg-green-100 text-green-600",
    "In Progress": "bg-blue-100 text-blue-500",
    Completed: "bg-slate-200 text-slate-600",
    Drafts: "bg-amber-100 text-amber-600",
    Closed: "bg-rose-100 text-rose-600",
  };

  const handleToggleStatus = () => {
    if (job.status === "Closed") {
      onStatusChange(job.id, "Active");
    } else {
      onStatusChange(job.id, "Closed");
    }
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-9">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-4">
            <h2 className="text-3xl font-bold text-slate-900 md:text-[32px]">
              {job.title}
            </h2>
            <span
              className={`rounded-full px-5 py-2 text-lg font-medium ${statusClasses[job.status]}`}
            >
              {job.status}
            </span>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-4 text-[18px] text-slate-500">
            <span>Posted {job.posted}</span>
            <span>•</span>
            <span className="rounded-lg bg-slate-100 px-4 py-1.5">
              {job.category}
            </span>
            <span>•</span>
            <span className="font-semibold text-blue-500">{job.price}</span>
          </div>

          <p className="max-w-4xl text-[18px] leading-8 text-slate-600">
            {job.description}
          </p>
        </div>

        <div className="relative flex items-center gap-5 text-slate-400">
          <Link href={`/jobs/${job.id}/edit`} className="text-blue-500">
            <Pencil className="h-7 w-7" />
          </Link>

          <button onClick={() => onDelete(job.id)} className="text-red-500">
            <Trash2 className="h-7 w-7" />
          </button>

          <button onClick={() => setOpenMenu(!openMenu)} className="text-slate-500">
            <MoreVertical className="h-7 w-7" />
          </button>

          {openMenu && (
            <div className="absolute right-0 top-10 z-20 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
              <Link
                href={`/jobs/${job.id}`}
                className="block rounded-xl px-4 py-3 hover:bg-slate-50"
              >
                View Details
              </Link>
              <Link
                href={`/jobs/${job.id}/edit`}
                className="block rounded-xl px-4 py-3 hover:bg-slate-50"
              >
                Edit Job
              </Link>
              <Link
                href={`/jobs/${job.id}/boost`}
                className="block rounded-xl px-4 py-3 hover:bg-slate-50"
              >
                Boost Job
              </Link>
              <Link
                href={`/jobs/${job.id}/proposals`}
                className="block rounded-xl px-4 py-3 hover:bg-slate-50"
              >
                View Proposals
              </Link>
              <button
                onClick={handleToggleStatus}
                className="block w-full rounded-xl px-4 py-3 text-left hover:bg-slate-50"
              >
                {job.status === "Closed" ? "Reopen Job" : "Close Job"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-8 grid gap-8 border-b border-slate-200 pb-8 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-3 text-2xl font-semibold text-slate-900">
            <FileText className="h-6 w-6 text-blue-500" />
            <span>{job.proposals} proposals</span>
          </div>
          <Link href={`/jobs/${job.id}/proposals`} className="text-lg text-blue-500">
            View all
          </Link>
        </div>

        <div>
          <div className="flex items-center gap-3 text-2xl font-semibold text-slate-900">
            <Eye className="h-6 w-6 text-slate-500" />
            <span>{job.views} views</span>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-3 text-2xl font-semibold text-slate-900">
            <UserRound className="h-6 w-6 text-green-500" />
            <span>{job.hiredText}</span>
          </div>
          {job.hiredSubLink ? (
            <a href="#" className="text-lg text-blue-500">
              {job.hiredSubLink}
            </a>
          ) : null}
        </div>

        <div>
          <p className="mb-2 text-[20px] text-slate-600">{job.rightStatusTitle}</p>
          <p className="text-lg text-slate-400">{job.rightStatusSub}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Link
          href={`/jobs/${job.id}/proposals`}
          className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-8 py-4 text-2xl font-semibold text-white shadow"
        >
          View Proposals
        </Link>

        <Link
          href={`/jobs/${job.id}/edit`}
          className="rounded-2xl border-2 border-blue-500 px-8 py-4 text-2xl font-semibold text-blue-500"
        >
          Edit Job
        </Link>

        <button
          onClick={handleToggleStatus}
          className={`rounded-2xl border-2 px-8 py-4 text-2xl font-semibold ${
            job.status === "Closed"
              ? "border-green-500 text-green-500"
              : "border-slate-400 text-slate-500"
          }`}
        >
          {job.status === "Closed" ? "Reopen" : "Mark as Closed"}
        </button>

        <Link
          href={`/jobs/${job.id}/boost`}
          className="flex items-center gap-3 rounded-2xl border-2 border-amber-500 px-8 py-4 text-2xl font-semibold text-amber-500"
        >
          <Rocket className="h-6 w-6" />
          Boost Job
        </Link>
      </div>
    </div>
  );
}