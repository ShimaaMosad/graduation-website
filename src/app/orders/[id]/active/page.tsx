"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Briefcase,
  Check,
  ChevronRight,
  Clock,
  FileBox,
  Flag,
  Grid2X2,
  ImageIcon,
  MessageSquare,
  Rocket,
  User,
  Wallet,
} from "lucide-react";
import { acceptDelivery, extendDeadline,raiseDispute } from "../../../../lib/orders-api";

type ActionMessage = {
  type: "success" | "info" | "error";
  text: string;
};

function Sidebar({ orderId }: { orderId: string }) {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[265px] border-r border-violet-200 bg-white lg:block">
      <div className="flex h-[66px] items-center border-b border-violet-100 px-6">
        <Link href="/" className="text-[22px] font-bold text-violet-700">
          FreelanceFlow
        </Link>
      </div>

      <div className="border-b border-violet-100 px-6 py-9">
        <h2 className="text-[18px] font-bold">Freelancer Hub</h2>
        <p className="mt-2 text-[14px] text-slate-600">Manage your productivity</p>
        <button className="mt-5 w-full rounded-lg bg-violet-700 py-3 text-white">
          Create New Order
        </button>
      </div>

      <nav className="space-y-3 px-4 py-7 text-[15px]">
        <Link href="/" className="flex items-center gap-4 rounded-xl px-4 py-3 text-slate-700">
          <Grid2X2 className="h-5 w-5" /> Dashboard
        </Link>

        <Link href={`/orders/${orderId}/active`} className="flex items-center gap-4 rounded-xl bg-violet-100 px-4 py-3 font-medium text-violet-700">
          <Briefcase className="h-5 w-5" /> Active Orders
        </Link>

        <Link href={`/orders/${orderId}/revision`} className="flex items-center gap-4 rounded-xl px-4 py-3 text-slate-700">
          <ImageIcon className="h-5 w-5" /> Revision Queue
        </Link>

        <Link href="#" className="flex items-center gap-4 rounded-xl px-4 py-3 text-slate-700">
          <Wallet className="h-5 w-5" /> Financials
        </Link>

        <Link href="#" className="flex items-center gap-4 rounded-xl px-4 py-3 text-slate-700">
          <User className="h-5 w-5" /> Account
        </Link>
      </nav>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-20 h-[66px] border-b border-violet-100 bg-white lg:left-[265px]">
      <div className="flex h-full items-center justify-end gap-8 px-8">
        <Bell className="h-5 w-5 text-slate-600" />
        <MessageSquare className="h-5 w-5 text-slate-600" />
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-600 text-xs text-white">?</span>
        <img src="https://i.pravatar.cc/100?img=12" className="h-9 w-9 rounded-full" />
      </div>
    </header>
  );
}

export default function ActiveOrderPage() {
  const params = useParams();
  const id = String(params.id);

  const [message, setMessage] = useState<ActionMessage | null>(null);
  const [progress, setProgress] = useState(65);
  const [deliveryAccepted, setDeliveryAccepted] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const showMessage = (text: string, type: ActionMessage["type"] = "info") => {
    setMessage({ text, type });
  };

  const handleAcceptDelivery = async () => {
    setLoadingAction("accept");
    const res = await acceptDelivery(id);

    if (res.success) {
      setDeliveryAccepted(true);
      setProgress(100);
      showMessage(res.message, "success");
    }

    setLoadingAction(null);
  };

  const handleExtendDeadline = async () => {
    setLoadingAction("extend");
    const res = await extendDeadline(id);

    if (res.success) showMessage(res.message, "info");
    setLoadingAction(null);
  };

  const handleRaiseDispute = async () => {
    setLoadingAction("dispute");
    const res = await raiseDispute(id);

    if (res.success) showMessage(res.message, "error");
    setLoadingAction(null);
  };

  return (
    <main className="min-h-screen bg-[#fcf4ff]">
      <Sidebar orderId={id} />
      <Topbar />

      <section className="px-5 pt-[95px] lg:ml-[265px]">
        <div className="mx-auto max-w-[1030px]">
          <div className="mb-7 flex items-center gap-3 text-[15px] text-slate-700">
            <Link href="/orders">My Orders</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Order #{id}</span>
          </div>

          {message && (
            <div
              className={`mb-5 rounded-xl px-5 py-4 text-[15px] ${
                message.type === "success"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                  : message.type === "error"
                  ? "border border-red-200 bg-red-50 text-red-600"
                  : "border border-violet-200 bg-violet-50 text-violet-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="mb-6 rounded-xl bg-gradient-to-r from-violet-800 to-fuchsia-500 p-7 text-white shadow-lg">
            <div className="flex items-center justify-between gap-5">
              <div>
                <span className="rounded-full bg-white/20 px-4 py-2 text-[14px]">
                  ⚡ {deliveryAccepted ? "Completed" : "In Progress"}
                </span>

                <h1 className="mt-6 text-[34px] font-bold">
                  Full-Stack Web App Development
                </h1>

                <div className="mt-4 flex flex-wrap gap-5 text-[15px]">
                  <span>👤 Freelancer: Ahmed Saleh</span>
                  <span>📅 Deadline: Apr 28, 2026</span>
                </div>
              </div>

              <div className="flex h-24 w-24 items-center justify-center rounded-full border-[8px] border-white/70 text-[22px] font-bold">
                {progress}%
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.65fr]">
            <div className="space-y-6">
              <div className="rounded-xl border border-violet-200 bg-white p-7 shadow-sm">
                <h2 className="mb-8 flex items-center gap-3 text-[20px] font-bold">
                  <Flag className="h-5 w-5 text-violet-700" />
                  Delivery Milestones
                </h2>

                <div className="space-y-8">
                  {[
                    ["Requirements Gathered", "Project scope and initial assets approved.", true],
                    ["Design Mockups Delivered", "Figma files approved by client.", true],
                    ["Backend Development", "Setting up database and core API endpoints.", "current"],
                    ["Frontend Integration", "Connecting UI to backend services.", false],
                    ["Final Deployment", "Staging and production launch.", false],
                  ].map(([title, sub, state], index) => (
                    <div key={String(title)} className="flex gap-5">
                      <div className="relative">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full ${
                            state === true
                              ? "bg-blue-600 text-white"
                              : state === "current"
                              ? "bg-violet-700 text-white"
                              : "bg-violet-100 text-slate-500"
                          }`}
                        >
                          {state === true ? (
                            <Check className="h-5 w-5" />
                          ) : state === "current" ? (
                            <ChevronRight className="h-5 w-5" />
                          ) : index === 3 ? (
                            <Briefcase className="h-4 w-4" />
                          ) : (
                            <Rocket className="h-4 w-4" />
                          )}
                        </div>

                        {index < 4 && (
                          <div className="absolute left-1/2 top-9 h-12 w-px -translate-x-1/2 bg-violet-200" />
                        )}
                      </div>

                      <div>
                        <h3 className={`text-[18px] font-medium ${state === "current" ? "text-violet-700" : "text-slate-800"}`}>
                          {title}
                        </h3>
                        <p className="mt-2 text-[14px] text-slate-600">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-violet-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
                  <FileBox className="h-8 w-8 text-slate-600" />
                </div>

                <h2 className="mt-6 text-[20px] font-bold">No Files Delivered Yet</h2>
                <p className="mx-auto mt-3 max-w-[430px] text-[14px] leading-6 text-slate-600">
                  Ahmed is still working on the deliverables. You'll be notified here when files are ready for review.
                </p>

                <div className="mt-7 inline-flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-3 text-white">
                  <Clock className="h-4 w-4" />
                  Expected delivery in 12 days
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-xl border border-violet-200 bg-white p-6 text-center shadow-sm">
                <img src="https://i.pravatar.cc/120?img=14" className="mx-auto h-16 w-16 rounded-full object-cover" />
                <h2 className="mt-4 text-[20px] font-bold">Ahmed Saleh</h2>
                <p className="mt-1 text-[14px] text-slate-600">⭐ 4.8 (124 jobs)</p>

                <div className="mt-5 flex justify-center gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs">AI Verified</span>
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs">Top Rated</span>
                </div>

                <button
                  onClick={() => showMessage("Freelancer profile opened.")}
                  className="mt-6 w-full rounded-lg border border-violet-200 bg-violet-50 py-3"
                >
                  👤 View Profile
                </button>
              </div>

              <div className="rounded-xl border border-violet-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-[20px] font-bold">Order Actions</h2>

                <div className="space-y-4">
                  <button
                    disabled={deliveryAccepted || loadingAction === "accept"}
                    onClick={handleAcceptDelivery}
                    className="w-full rounded-lg bg-violet-100 py-3 text-slate-600 disabled:opacity-60"
                  >
                    <Check className="mr-2 inline h-4 w-4" />
                    {loadingAction === "accept" ? "Accepting..." : "Accept Delivery"}
                  </button>

                  <Link href={`/orders/${id}/revision`} className="block w-full rounded-lg border border-violet-200 py-3 text-center">
                    <ImageIcon className="mr-2 inline h-4 w-4" />
                    Request Revision
                  </Link>

                  <button
                    onClick={handleExtendDeadline}
                    disabled={loadingAction === "extend"}
                    className="w-full rounded-lg border border-violet-200 py-3 disabled:opacity-60"
                  >
                    <Clock className="mr-2 inline h-4 w-4" />
                    {loadingAction === "extend" ? "Sending..." : "Extend Deadline"}
                  </button>

                  <button
                    onClick={handleRaiseDispute}
                    disabled={loadingAction === "dispute"}
                    className="w-full py-3 text-red-600 disabled:opacity-60"
                  >
                    <Flag className="mr-2 inline h-4 w-4" />
                    {loadingAction === "dispute" ? "Submitting..." : "Raise Dispute"}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}