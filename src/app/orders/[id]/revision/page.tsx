"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Briefcase,
  Bug,
  ChevronRight,
  FileText,
  Grid2X2,
  ImageIcon,
  MessageSquare,
  Paintbrush,
  RotateCcw,
  UploadCloud,
  User,
  Wallet,
} from "lucide-react";
import { submitRevisionRequest } from "@/src/lib/orders-api";

type RevisionType = "Design" | "Content" | "Bug Fix";
type Priority = "Low" | "Medium" | "High";

function Sidebar({ orderId }: { orderId: string }) {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[235px] border-r border-violet-200 bg-white lg:block">
      <div className="flex h-[58px] items-center border-b border-violet-100 px-6">
        <Link href="/" className="text-[22px] font-bold text-violet-700">
          FreelanceFlow
        </Link>
      </div>

      <div className="px-6 py-8">
        <p className="mb-6 text-xs font-bold uppercase tracking-wide text-slate-500">
          Freelancer Hub
        </p>

        <nav className="space-y-3 text-[15px]">
          <Link href="/" className="flex items-center gap-4 rounded-xl px-4 py-3 text-slate-700">
            <Grid2X2 className="h-5 w-5" />
            Dashboard
          </Link>

          <Link href={`/orders/${orderId}/active`} className="flex items-center gap-4 rounded-xl px-4 py-3 text-slate-700">
            <Briefcase className="h-5 w-5" />
            Active Orders
          </Link>

          <Link href={`/orders/${orderId}/revision`} className="flex items-center gap-4 rounded-xl bg-violet-100 px-4 py-3 font-medium text-violet-700">
            <ImageIcon className="h-5 w-5" />
            Revision Queue
          </Link>

          <Link href="#" className="flex items-center gap-4 rounded-xl px-4 py-3 text-slate-700">
            <Wallet className="h-5 w-5" />
            Financials
          </Link>

          <Link href="#" className="flex items-center gap-4 rounded-xl px-4 py-3 text-slate-700">
            <User className="h-5 w-5" />
            Account
          </Link>
        </nav>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <button className="w-full rounded-lg bg-violet-700 py-3 text-white">
          Create New Order
        </button>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-20 h-[58px] border-b border-violet-100 bg-white lg:left-[235px]">
      <div className="flex h-full items-center justify-end gap-8 px-8">
        <Bell className="h-5 w-5 text-slate-700" />
        <MessageSquare className="h-5 w-5 text-slate-700" />
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-600 text-xs text-white">
          ?
        </span>
        <img src="https://i.pravatar.cc/100?img=5" className="h-8 w-8 rounded-full object-cover" />
      </div>
    </header>
  );
}

export default function RevisionPage() {
  const params = useParams();
  const id = String(params.id);

  const [revisionType, setRevisionType] = useState<RevisionType>("Content");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) return;

    setLoading(true);

    const response = await submitRevisionRequest({
      orderId: id,
      revisionType,
      priority,
      description,
      suggestedDeadline: deadline,
      files,
    });

    if (response.success) {
      setSuccess(response.message);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#fcf4ff]">
      <Sidebar orderId={id} />
      <Topbar />

      <section className="px-5 pt-[82px] lg:ml-[235px]">
        <div className="mx-auto max-w-[980px]">
          <Link href={`/orders/${id}/active`} className="mb-5 inline-flex items-center gap-2 text-[14px] text-violet-700">
            ← Back to Active Order #{id}
          </Link>

          <h1 className="mb-7 text-[32px] font-bold">Request a Revision</h1>

          {success && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
              {success}
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.75fr]">
            <div className="space-y-6">
              <div className="rounded-xl border border-violet-200 bg-white p-6 shadow-sm">
                <div className="mb-6 rounded-lg border border-orange-400 bg-orange-50 px-5 py-4">
                  <div className="flex gap-4">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-700 text-sm text-white">
                      i
                    </span>
                    <div>
                      <p className="font-medium text-orange-800">Revision limits apply</p>
                      <p className="mt-1 text-[14px] leading-6 text-slate-700">
                        You have 1 of 2 free revisions remaining for this order.
                      </p>
                    </div>
                  </div>
                </div>

                <label className="mb-3 block text-[14px] font-medium">Revision Type</label>

                <div className="mb-6 grid gap-4 md:grid-cols-3">
                  {[
                    { label: "Design" as RevisionType, icon: Paintbrush },
                    { label: "Content" as RevisionType, icon: FileText },
                    { label: "Bug Fix" as RevisionType, icon: Bug },
                  ].map((item) => {
                    const Icon = item.icon;
                    const active = revisionType === item.label;

                    return (
                      <button
                        key={item.label}
                        onClick={() => setRevisionType(item.label)}
                        className={`relative rounded-lg border px-6 py-5 text-center transition ${
                          active
                            ? "border-violet-700 bg-violet-50 text-violet-700"
                            : "border-violet-200 bg-white text-slate-700"
                        }`}
                      >
                        {active && <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-violet-700" />}
                        <Icon className="mx-auto mb-3 h-6 w-6" />
                        <span className="text-[14px]">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <label className="mb-3 block text-[14px] font-medium">Description of Changes</label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe exactly what needs to be changed..."
                  className="h-36 w-full rounded-lg border border-violet-200 p-4 text-[15px] outline-none focus:border-violet-600"
                />

                <label className="mb-3 mt-6 block text-[14px] font-medium">Priority</label>

                <div className="mb-6 flex gap-3">
                  {(["Low", "Medium", "High"] as Priority[]).map((item) => (
                    <button
                      key={item}
                      onClick={() => setPriority(item)}
                      className={`rounded-full border px-6 py-2 text-[14px] ${
                        priority === item
                          ? "border-violet-700 bg-violet-700 text-white"
                          : "border-violet-200 bg-white text-slate-700"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <label className="mb-3 block text-[14px] font-medium">Supporting Files</label>

                <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-violet-200 bg-white text-center text-[14px]">
                  <UploadCloud className="mb-2 h-8 w-8 text-slate-500" />
                  Drag & drop files here
                  <span className="mt-1 text-slate-500">or click to browse</span>

                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const selected = Array.from(e.target.files || []).map((file) => file.name);
                      setFiles((prev) => [...prev, ...selected]);
                    }}
                  />
                </label>

                {files.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {files.map((file) => (
                      <button
                        key={file}
                        onClick={() => setFiles((prev) => prev.filter((item) => item !== file))}
                        className="rounded-lg bg-violet-100 px-3 py-2 text-sm"
                      >
                        {file} ×
                      </button>
                    ))}
                  </div>
                )}

                <label className="mb-3 mt-6 block text-[14px] font-medium">Suggested Deadline</label>

                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full max-w-[270px] rounded-lg border border-violet-200 px-4 py-3 outline-none focus:border-violet-600"
                />

                <div className="mt-9 flex justify-end gap-3 border-t border-violet-100 pt-5">
                  <Link href={`/orders/${id}/active`} className="rounded-lg border border-slate-400 px-7 py-3 text-[14px]">
                    Cancel
                  </Link>

                  <button
                    onClick={handleSubmit}
                    disabled={!description.trim() || loading}
                    className="rounded-lg bg-gradient-to-r from-violet-700 to-blue-500 px-7 py-3 text-[14px] font-semibold text-white disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Revision Request"}
                    <ChevronRight className="ml-1 inline h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-violet-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 flex items-center gap-3 text-[20px] font-bold">
                  <RotateCcw className="h-5 w-5" />
                  Revision History
                </h2>

                <div className="relative border-l-2 border-violet-100 pl-7">
                  <span className="absolute -left-[7px] top-0 h-3 w-3 rounded-full bg-violet-100" />

                  <div className="rounded-lg border border-violet-200 bg-violet-50 p-5">
                    <div className="mb-3 flex justify-between">
                      <span className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                        ● RESOLVED
                      </span>
                      <span className="text-sm text-slate-500">Oct 24, 2023</span>
                    </div>

                    <p className="mb-2 font-medium">Update header navigation colors</p>
                    <p className="text-[14px] leading-6 text-slate-600">
                      The client requested a shift from the dark mode header to a lighter variation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="overflow-hidden rounded-xl border border-violet-200 bg-white shadow-sm">
                <div className="relative h-32 bg-slate-200">
                  <img src="https://picsum.photos/id/0/700/400" className="h-full w-full object-cover" />
                  <span className="absolute bottom-3 left-3 rounded bg-black/70 px-3 py-1 text-sm text-white">
                    #{id}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold">E-commerce UI Overhaul</h3>
                  <p className="mt-2 text-[14px] text-slate-600">
                    Milestone 2: Product Detail Pages
                  </p>

                  <div className="mt-4 border-t pt-4 text-[14px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Freelancer</span>
                      <span className="font-medium">Alex D.</span>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <span className="text-slate-500">Original Delivery</span>
                      <span className="font-medium">Oct 22, 2023</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-center shadow-sm">
                <p className="text-sm uppercase tracking-widest text-orange-700">Revisions Remaining</p>
                <h2 className="mt-3 text-[56px] font-bold text-orange-600">1</h2>

                <div className="mx-auto mt-2 h-2 w-full max-w-[230px] rounded-full bg-amber-200">
                  <div className="h-2 w-1/2 rounded-full bg-orange-500" />
                </div>

                <p className="mt-3 text-sm text-orange-700">
                  You have used 1 of 2 included revisions.
                </p>
              </div>

              <div className="border-l-4 border-violet-700 bg-violet-50 p-6">
                <h3 className="mb-4 font-semibold text-violet-700">Revision Tips</h3>

                <div className="space-y-4 text-[14px] leading-6 text-slate-700">
                  <p>✓ Be specific with your requested changes.</p>
                  <p>✓ Batch your requests into one revision.</p>
                  <p>✓ Provide examples or links if possible.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}