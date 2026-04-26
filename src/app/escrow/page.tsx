"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  Check,
  Clock,
  CreditCard,
  Edit,
  FileText,
  History,
  Landmark,
  Lock,
  MessageSquare,
  PlusCircle,
  Settings,
  Wallet,
} from "lucide-react";
import {
  EscrowData,
  addEscrowFunds,
  approveMilestoneRelease,
  getEscrowData,
  raiseEscrowDispute,
  requestMilestoneRevision,
}  from "@/src/lib/payments-api";


type ModalType = "fund" | "release" | "revision" | "dispute" | null;

export default function EscrowPage() {
  const [data, setData] = useState<EscrowData | null>(null);
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [revisionReason, setRevisionReason] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getEscrowData().then(setData);
  }, []);

  if (!data) return <main className="p-10">Loading...</main>;

  const openFundModal = () => {
    setModal("fund");
    setAmount("");
    setError("");
  };

  const openReleaseModal = (id: number) => {
    setSelectedMilestone(id);
    setModal("release");
    setError("");
  };

  const openRevisionModal = (id: number) => {
    setSelectedMilestone(id);
    setRevisionReason("");
    setModal("revision");
    setError("");
  };

  const handleFund = async () => {
    const value = Number(amount);

    if (!amount || value <= 0) {
      setError("Please enter a valid funding amount.");
      return;
    }

    if (value > data.remainingToFund) {
      setError(`Amount cannot exceed $${data.remainingToFund.toFixed(2)}.`);
      return;
    }

    const res = await addEscrowFunds();
    setNotice(`${res.message} Amount: $${value.toFixed(2)}`);
    setModal(null);
  };

  const handleApprove = async () => {
    if (!selectedMilestone) return;

    const res = await approveMilestoneRelease(selectedMilestone);
    setNotice(res.message);
    setModal(null);
  };

  const handleRevision = async () => {
    if (!selectedMilestone) return;

    if (revisionReason.trim().length < 10) {
      setError("Please write at least 10 characters for the revision reason.");
      return;
    }

    const res = await requestMilestoneRevision(selectedMilestone);
    setNotice(`${res.message} Reason: ${revisionReason}`);
    setModal(null);
  };

  const handleDispute = async () => {
    if (disputeReason.trim().length < 15) {
      setError("Please write at least 15 characters for the dispute reason.");
      return;
    }

    const res = await raiseEscrowDispute();
    setNotice(`${res.message} Reason: ${disputeReason}`);
    setModal(null);
  };

  return (
    <main className="min-h-screen bg-[#fbf5ff] text-slate-950">
      <header className="fixed left-0 right-0 top-0 z-30 flex h-[56px] items-center justify-between border-b border-violet-100 bg-white px-5">
        <Link href="/" className="text-[20px] font-bold text-violet-700">
          MySite
        </Link>

        <div className="flex items-center gap-6">
          <Bell className="h-5 w-5 text-slate-600" />
          <Settings className="h-5 w-5 text-slate-600" />
          <img
            src="https://i.pravatar.cc/100?img=47"
            className="h-8 w-8 rounded-full object-cover"
            alt="profile"
          />
        </div>
      </header>
<aside className="fixed bottom-0 left-0 top-[56px] hidden w-[290px] border-r border-violet-100 bg-white lg:block">
        <div className="border-b border-violet-100 p-6 text-center">
          <img
            src="https://i.pravatar.cc/100?img=47"
            className="mx-auto h-16 w-16 rounded-full border-4 border-violet-700 object-cover"
            alt="freelancer"
          />

          <h2 className="mt-3 text-[18px] font-bold">Freelancer Portal</h2>
          <p className="mt-1 text-sm text-slate-500">✹ Verified Account</p>
        </div>

        <nav className="space-y-2 p-4 text-[15px]">
          <Link
            href="/checkout/payment"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-700"
          >
            <CreditCard className="h-5 w-5" />
            Checkout
          </Link>

          <Link
            href="/escrow"
            className="flex items-center gap-3 rounded-lg border-r-4 border-violet-700 bg-violet-100 px-4 py-3 font-semibold text-violet-700"
          >
            <Lock className="h-5 w-5" />
            Escrow
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-700"
          >
            <History className="h-5 w-5" />
            History
          </Link>

          <Link
            href="/gigs/modern-logo-brand/analytics"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-700"
          >
            <Wallet className="h-5 w-5" />
            Earnings
          </Link>
        </nav>

        <div className="absolute bottom-5 left-4 right-4">
          <button
            onClick={openFundModal}
            className="w-full rounded-lg bg-violet-700 py-3 font-bold text-white shadow-md"
          >
            <Landmark className="mr-2 inline h-5 w-5" />
            Withdraw Funds
          </button>
        </div>
      </aside>

<section className="w-full px-8 pt-[86px] lg:ml-[300px] lg:w-[calc(100%-300px)]">
<div className="w-[90%] min-w-[1150px]">
              {notice && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-emerald-700">
              {notice}
            </div>
          )}

          <div className="mb-3 flex items-center gap-3 text-[14px] text-slate-600">
            <Link href="#">Projects</Link>
            <span>›</span>
            <span>{data.projectTitle}</span>
            <span>›</span>
            <b className="text-slate-900">Escrow</b>
          </div>

          <h1 className="text-[30px] font-bold leading-tight">
            Escrow & Milestones
          </h1>

          <p className="mt-2 flex items-center gap-2 text-[16px] text-slate-700">
            <Lock className="h-5 w-5 text-blue-700" />
            Funds are held securely by MySite until milestones are approved.
          </p>

          <div className="mt-7 grid rounded-xl bg-[#047da8] p-6 text-white shadow-lg md:grid-cols-3">
            <div>
              <p className="text-[13px] uppercase tracking-[0.16em]">
                Total Released
              </p>
              <h2 className="mt-1 text-[34px] font-bold">
                ${data.totalReleased.toFixed(2)}
              </h2>
            </div>

            <div className="border-white/30 md:border-l md:px-6">
              <p className="text-[13px] uppercase tracking-[0.16em]">
                In Escrow (Pending)
              </p>
              <h2 className="mt-1 text-[34px] font-bold">
                ${data.inEscrow.toFixed(2)}
              </h2>
            </div>

            <div className="border-white/30 md:border-l md:px-6">
              <p className="text-[13px] uppercase tracking-[0.16em]">
                Remaining to Fund
              </p>
              <h2 className="mt-1 text-[34px] font-bold">
                ${data.remainingToFund.toFixed(2)}
              </h2>
            </div>
          </div>

          <div className="mt-7 grid gap-7 lg:grid-cols-[1.45fr_0.7fr]">
            <div className="space-y-7">
              <div className="rounded-xl border border-violet-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <h2 className="max-w-[230px] text-[20px] font-bold leading-7">
                      Website Redesign Phase 1
                    </h2>

                    <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                      <CalendarDays className="h-4 w-4" />
                      Started {data.started}
                    </p>
                  </div>

                  <div className="rounded-lg bg-violet-50 px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <img
                          src="https://i.pravatar.cc/50?img=12"
                          className="h-7 w-7 rounded-full border-2 border-white"
                          alt="client"
                        />
                        <img
                          src="https://i.pravatar.cc/50?img=47"
                          className="h-7 w-7 rounded-full border-2 border-white"
                          alt="talent"
                        />
                      </div>

                      <div>
                        <p>Client: {data.client}</p>
                        <p>Talent: {data.talent}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest">
                      Total Budget
                    </p>
                    <h3 className="text-[20px] font-bold">
                      ${data.totalBudget.toFixed(2)}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-violet-100 bg-white p-6 shadow-sm">
                <div className="mb-8 flex items-start justify-between">
                  <h2 className="text-[26px] font-bold">Milestones Timeline</h2>

                  <div className="text-sm">
                    <p>Overall Progress: 40%</p>
                    <div className="mt-2 h-2 w-32 rounded-full bg-violet-100">
                      <div className="h-2 w-[40%] rounded-full bg-violet-700" />
                    </div>
                  </div>
                </div>

                <div className="relative min-h-[680px]">
                  <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-violet-100" />

                  <div className="absolute left-1/2 top-[120px] z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                    <Check className="h-5 w-5" />
                  </div>

                  <div className="absolute left-1/2 top-[365px] z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-4 border-violet-100 bg-violet-700 text-white shadow-md">
                    2
                  </div>

                  <div className="absolute left-1/2 bottom-[90px] z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-2 border-dashed border-violet-200 bg-white text-violet-300">
                    3
                  </div>

                  <div className="absolute right-4 top-5 w-[250px] rounded-xl border border-emerald-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">
                        Completed
                      </span>
                      <span className="text-sm text-slate-600">Oct 15</span>
                      <b>$200.00</b>
                    </div>

                    <h3 className="text-[18px] font-bold">
                      Wireframes & Design System
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Initial wireframes for core pages and establishing the
                      Figma component library.
                    </p>

                    <button className="mt-4 text-sm font-semibold text-violet-700">
                      👁 View Deliverable
                    </button>
                  </div>

                  <div className="absolute left-0 top-[260px] w-[250px] rounded-xl border border-violet-700 bg-white p-4 shadow-xl">
                    <div className="mb-2 flex items-start justify-between">
                      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs text-violet-700">
                        In Progress
                      </span>

                      <div className="text-right text-sm">
                        <p>Due</p>
                        <p>Oct 22</p>
                      </div>

                      <b className="text-[18px]">$200.00</b>
                    </div>

                    <h3 className="text-[18px] font-bold leading-6">
                      Frontend Development (Home & Checkout)
                    </h3>

                    <p className="mt-2 text-sm leading-5 text-slate-600">
                      HTML/Tailwind implementation of the approved designs.
                    </p>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span>Task Progress</span>
                      <span>65%</span>
                    </div>

                    <div className="mt-1 h-2 rounded-full bg-violet-100">
                      <div className="h-2 w-[65%] rounded-full bg-violet-700" />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openReleaseModal(2)}
                        className="rounded-lg bg-violet-700 px-3 py-2 text-sm font-bold text-white"
                      >
                        Approve & Release
                      </button>

                      <button
                        onClick={() => openRevisionModal(2)}
                        className="rounded-lg border border-violet-200 px-3 py-2 text-sm font-semibold"
                      >
                        <Edit className="mr-1 inline h-4 w-4" />
                        Revision
                      </button>
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-4 w-[250px] rounded-xl border border-violet-100 bg-violet-50 p-5 opacity-70">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded bg-slate-200 px-3 py-1 text-xs text-slate-500">
                        🔒 Locked
                      </span>
                      <b className="text-[18px]">$100.00</b>
                    </div>

                    <h3 className="text-[18px] font-bold text-slate-500">
                      Backend Integration
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      API connection and final testing.
                    </p>

                    <button
                      onClick={openFundModal}
                      className="mt-5 w-full rounded-lg border border-violet-200 bg-white py-2 text-sm font-semibold"
                    >
                      <CreditCard className="mr-1 inline h-4 w-4" />
                      Fund Milestone
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    ⚠
                  </div>

                  <div>
                    <h3 className="text-[18px] font-bold">Having an issue?</h3>
                    <p className="text-sm text-slate-600">
                      Our moderation team can help mediate if expectations
                      aren't being met.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setModal("dispute");
                    setDisputeReason("");
                    setError("");
                  }}
                  className="rounded-lg border border-red-300 bg-white px-6 py-3 text-red-600"
                >
                  Raise a Dispute
                </button>
              </div>
            </div>

            <aside className="space-y-7">
              <div className="rounded-xl border border-violet-100 bg-white p-6 shadow-sm">
                <h2 className="mb-5 border-b pb-3 text-[24px] font-bold">
                  Escrow Breakdown
                </h2>

                <div className="mx-auto mb-6 flex h-40 w-40 items-center justify-center rounded-full border-[22px] border-violet-700 shadow-[inset_35px_0_0_#22c55e]">
                  <div className="text-center">
                    <p className="text-sm text-slate-600">Total Value</p>
                    <b>${data.totalBudget.toFixed(2)}</b>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>🟢 Released (40%)</span>
                    <span>${data.totalReleased.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>🟣 In Escrow (40%)</span>
                    <span>${data.inEscrow.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>⚪ Remaining (20%)</span>
                    <span>${data.remainingToFund.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-5 rounded-lg bg-violet-50 p-4">
                  <div className="flex justify-between text-sm">
                    <span>Platform Fee (5%)</span>
                    <span>-${data.platformFee.toFixed(2)}</span>
                  </div>

                  <div className="mt-3 flex justify-between text-[18px]">
                    <b>Net Freelancer Payout</b>
                    <b>${(data.totalBudget - data.platformFee).toFixed(2)}</b>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-violet-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-[20px] font-bold">Quick Actions</h2>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <button
                    onClick={openFundModal}
                    className="rounded-lg border border-violet-200 py-3"
                  >
                    <PlusCircle className="mx-auto h-5 w-5 text-blue-700" />
                    Add Funds
                  </button>

                  <button
                    onClick={() => setNotice("Edit milestones panel opened.")}
                    className="rounded-lg border border-violet-200 py-3"
                  >
                    <Edit className="mx-auto h-5 w-5 text-blue-700" />
                    Edit Milestones
                  </button>

                  <button
                    onClick={() => setNotice("Invoices page opened.")}
                    className="rounded-lg border border-violet-200 py-3"
                  >
                    <FileText className="mx-auto h-5 w-5 text-blue-700" />
                    Invoices
                  </button>

                  <button
                    onClick={() => setNotice("Message talent opened.")}
                    className="rounded-lg border border-violet-200 py-3"
                  >
                    <MessageSquare className="mx-auto h-5 w-5 text-blue-700" />
                    Message Talent
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-violet-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 border-b pb-3 text-[20px] font-bold">
                  Recent Activity
                </h2>

                <div className="space-y-5 text-sm">
                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      ↗
                    </span>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <b>Funds Released</b>
                        <span className="text-emerald-600">$200.00</span>
                      </div>
                      <p>Milestone 1</p>
                      <p className="text-xs text-slate-500">
                        Oct 15, 2023 • Visa ****4242
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                      🔒
                    </span>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <b>Funded Escrow</b>
                        <span>$200.00</span>
                      </div>
                      <p>Milestone 2</p>
                      <p className="text-xs text-slate-500">
                        Oct 12, 2023 • Visa ****4242
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                      🔒
                    </span>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <b>Funded Escrow</b>
                        <span>$200.00</span>
                      </div>
                      <p>Milestone 1</p>
                      <p className="text-xs text-slate-500">
                        Oct 12, 2023 • Visa ****4242
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[430px] rounded-2xl bg-white p-6 shadow-xl">
            {modal === "fund" && (
              <>
                <h2 className="text-[22px] font-bold">Add Funds</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Remaining to fund: ${data.remainingToFund.toFixed(2)}
                </p>

                <input
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value.replace(/[^\d.]/g, ""))
                  }
                  placeholder="Enter amount"
                  className="mt-5 h-12 w-full rounded-lg border border-violet-200 px-4 outline-none"
                />

                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => setModal(null)} className="px-5 py-2">
                    Cancel
                  </button>

                  <button
                    onClick={handleFund}
                    className="rounded-lg bg-violet-700 px-5 py-2 text-white"
                  >
                    Confirm Funding
                  </button>
                </div>
              </>
            )}

            {modal === "release" && (
              <>
                <h2 className="text-[22px] font-bold">Approve & Release?</h2>
                <p className="mt-3 text-slate-600">
                  This will approve milestone #{selectedMilestone} and release
                  the escrow funds to the freelancer.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => setModal(null)} className="px-5 py-2">
                    Cancel
                  </button>

                  <button
                    onClick={handleApprove}
                    className="rounded-lg bg-violet-700 px-5 py-2 text-white"
                  >
                    Approve Release
                  </button>
                </div>
              </>
            )}

            {modal === "revision" && (
              <>
                <h2 className="text-[22px] font-bold">Request Revision</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Explain what needs to be changed.
                </p>

                <textarea
                  value={revisionReason}
                  onChange={(e) => setRevisionReason(e.target.value)}
                  placeholder="Write revision details..."
                  className="mt-5 h-32 w-full rounded-lg border border-violet-200 p-4 outline-none"
                />

                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => setModal(null)} className="px-5 py-2">
                    Cancel
                  </button>

                  <button
                    onClick={handleRevision}
                    className="rounded-lg bg-violet-700 px-5 py-2 text-white"
                  >
                    Send Revision
                  </button>
                </div>
              </>
            )}

            {modal === "dispute" && (
              <>
                <h2 className="text-[22px] font-bold">Raise a Dispute</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Please describe the issue clearly.
                </p>

                <textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Write dispute reason..."
                  className="mt-5 h-32 w-full rounded-lg border border-red-200 p-4 outline-none"
                />

                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => setModal(null)} className="px-5 py-2">
                    Cancel
                  </button>

                  <button
                    onClick={handleDispute}
                    className="rounded-lg bg-red-600 px-5 py-2 text-white"
                  >
                    Submit Dispute
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
