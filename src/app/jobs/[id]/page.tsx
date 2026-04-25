import { getJobById } from "@/src/lib/api";
import Link from "next/link";

type JobDetailsPageProps = {
  params: {
    id: string;
  };
};

export default function JobDetailsPage({ params }: JobDetailsPageProps) {
  const job = getJobById(Number(params.id));

  if (!job) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] p-10">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-sm">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">Job not found</h1>
          <Link href="/" className="text-xl text-blue-500">
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8] p-6 md:p-10">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <Link href="/" className="mb-6 inline-block text-lg text-blue-500">
          ← Back to dashboard
        </Link>

        <h1 className="mb-4 text-4xl font-bold text-slate-900">{job.title}</h1>

        <div className="mb-6 flex flex-wrap items-center gap-4 text-lg text-slate-500">
          <span>Posted {job.posted}</span>
          <span>•</span>
          <span>{job.category}</span>
          <span>•</span>
          <span className="font-semibold text-blue-500">{job.price}</span>
        </div>

        <p className="mb-8 text-xl leading-9 text-slate-600">{job.description}</p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-6">
            <h2 className="mb-3 text-2xl font-semibold text-slate-900">Job Status</h2>
            <p className="text-lg text-slate-600">{job.status}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6">
            <h2 className="mb-3 text-2xl font-semibold text-slate-900">Proposals</h2>
            <p className="text-lg text-slate-600">{job.proposals} proposals received</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6">
            <h2 className="mb-3 text-2xl font-semibold text-slate-900">Views</h2>
            <p className="text-lg text-slate-600">{job.views} total views</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6">
            <h2 className="mb-3 text-2xl font-semibold text-slate-900">Hiring</h2>
            <p className="text-lg text-slate-600">{job.hiredText}</p>
          </div>
        </div>
      </div>
    </main>
  );
}