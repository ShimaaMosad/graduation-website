import Link from "next/link";
import { getPostedJobs } from "../../lib/api";
export default function JobsPage() {
  const jobs = getPostedJobs();

  return (
    <main className="min-h-screen bg-[#f5f6f8] p-6 md:p-10">
      <div className="mx-auto max-w-6xl">

        {/* Title */}
        <h1 className="mb-2 text-3xl font-bold">Manage all your job postings</h1>

        {/* Tabs */}
        <div className="mb-6 flex gap-6 rounded-full bg-white p-3 shadow-sm text-sm">
          <span className="font-semibold text-blue-600">Active Jobs (12)</span>
          <span>In Progress (8)</span>
          <span>Completed (45)</span>
          <span>Drafts (3)</span>
          <span>Closed (10)</span>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-5 md:grid-cols-4">
          <StatCard title="$18,500" subtitle="Total Spent" />
          <StatCard title="12" subtitle="Active Jobs" />
          <StatCard title="8" subtitle="Freelancers Hired" />
          <StatCard title="92%" subtitle="Project Success" />
        </div>

        {/* Jobs */}
        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">{job.title}</h2>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600">
                  Active
                </span>
              </div>

              {/* Info */}
              <div className="mb-3 flex flex-wrap gap-3 text-sm text-slate-500">
                <span>{job.posted}</span>
                <span>•</span>
                <span>{job.category}</span>
                <span>•</span>
                <span className="text-blue-500 font-semibold">{job.price}</span>
              </div>

              {/* Description */}
              <p className="mb-4 text-slate-600">{job.description}</p>

              {/* Stats Row */}
              <div className="mb-4 flex flex-wrap gap-6 text-sm text-slate-600">
                <span>{job.proposals} proposals</span>
                <span>{job.views} views</span>
                <span>Not hired yet</span>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/jobs/${job.id}/proposals`}
                  className="rounded-lg bg-purple-600 px-5 py-2 text-white"
                >
                  View Proposals
                </Link>

                <Link
                  href={`/jobs/${job.id}/edit`}
                  className="rounded-lg border px-5 py-2"
                >
                  Edit Job
                </Link>

                <button className="rounded-lg border px-5 py-2">
                  Mark as Closed
                </button>

                <Link
                  href={`/jobs/${job.id}/boost`}
                  className="rounded-lg border border-orange-400 px-5 py-2 text-orange-500"
                >
                  Boost Job
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}

function StatCard({ title, subtitle }: any) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-slate-500">{subtitle}</p>
    </div>
  );
}