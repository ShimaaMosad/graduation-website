"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  BarChart3,
  Check,
  Clock,
  FileArchive,
  FileImage,
  Flag,
  Grid2X2,
  Info,
  Mail,
  MessageSquare,
  RotateCcw,
  Settings,
  ShoppingCart,
  UploadCloud,
} from "lucide-react";
import { useParams } from "next/navigation";
import { getOrderById, OrderDetails } from "@/src/lib/orders-api";

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-20 hidden h-screen w-[220px] border-r border-violet-200 bg-white lg:block">
      <div className="flex h-[54px] items-center border-b border-violet-200 px-5">
        <Link href="/" className="text-[20px] font-bold text-violet-700">
          ProLance
        </Link>
      </div>

      <div className="p-3">
        <div className="mb-7 rounded-lg bg-violet-50 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-700 text-white">
            P
          </div>
          <p className="mt-2 text-[14px] font-semibold">Workspace</p>
          <p className="text-[12px]">Professional Plan</p>
        </div>

        <nav className="space-y-2 text-[14px]">
          <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-3">
            <Grid2X2 className="h-4 w-4" /> Dashboard
          </Link>
          <Link href="/orders" className="flex items-center gap-3 rounded-lg bg-violet-100 px-3 py-3 text-violet-700">
            <ShoppingCart className="h-4 w-4" /> Orders
          </Link>
          <Link href="/messages" className="flex items-center gap-3 rounded-lg px-3 py-3">
            <Mail className="h-4 w-4" /> Messages
          </Link>
          <Link href="/gigs/modern-logo-brand/analytics" className="flex items-center gap-3 rounded-lg px-3 py-3">
            <BarChart3 className="h-4 w-4" /> Analytics
          </Link>
          <Link href="/settings" className="flex items-center gap-3 rounded-lg px-3 py-3">
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </nav>
      </div>

      <div className="absolute bottom-4 left-3 right-3">
        <Link href="/gigs/create" className="block rounded-lg bg-gradient-to-r from-violet-800 to-violet-500 py-3 text-center text-white">
          Post a Gig
        </Link>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-10 h-[54px] border-b border-violet-200 bg-white lg:left-[220px]">
      <div className="flex h-full items-center justify-between px-5">
        <div className="flex h-9 w-[380px] items-center gap-3 rounded-lg border border-violet-200 px-3">
          <span className="text-slate-500">⌕</span>
          <input placeholder="Search..." className="w-full bg-transparent text-sm outline-none" />
        </div>

        <div className="flex items-center gap-6">
          <Bell className="h-4 w-4" />
          <MessageSquare className="h-4 w-4" />
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-xs text-white">?</span>
          <img src="https://i.pravatar.cc/100?img=5" className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </header>
  );
}

export default function OrderDetailsPage() {
  const params = useParams();
  const id = String(params.id);

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [files, setFiles] = useState(["final_build_v1.zip", "documentation.pdf"]);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getOrderById(id).then(setOrder);
  }, [id]);

  if (!order) return <main className="p-10">Loading...</main>;

  const youEarn = order.price - order.platformFee;

  const handleSaveDraft = () => setSuccess("Draft saved successfully.");
  const handleDeliverOrder = () => setSuccess("Order delivered successfully.");
  const handleSaveNote = () => setSuccess("Note saved successfully.");
  const handleAction = (text: string) => setSuccess(text);

  return (
    <main className="min-h-screen bg-[#f5efff]">
      <Sidebar />
      <Topbar />

      <section className="px-5 pt-[72px] lg:ml-[220px]">
        <div className="mx-auto max-w-[1000px]">
          <div className="mb-3 text-[14px] text-slate-600">
            <Link href="/orders">← Back to Orders</Link>
            <span className="mx-2">/</span>
            <span>Order Details</span>
          </div>

          {success && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
              {success}
            </div>
          )}

          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-[30px] font-bold">Order #{order.id}</h1>
              <span className="rounded-full bg-violet-100 px-3 py-1 text-[13px] text-violet-700">
                ● {order.status}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-violet-200 bg-white px-5 py-3 text-[14px]">
              <Clock className="h-4 w-4 text-orange-500" />
              3 days remaining
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.95fr]">
            <div className="space-y-5">
              <div className="overflow-hidden rounded-xl border border-violet-200 bg-white shadow-sm">
                <div className="grid gap-5 p-6 md:grid-cols-[180px_1fr]">
                  <img src={order.image} className="h-[125px] w-full rounded-lg object-cover" />

                  <div>
                    <h2 className="text-[22px] font-bold">Full-Stack Web App Development</h2>

                    <div className="mt-4 grid grid-cols-3 gap-4 text-[13px]">
                      <div><p className="uppercase text-slate-500">Date Placed</p><b>{order.datePlaced}</b></div>
                      <div><p className="uppercase text-slate-500">Deadline</p><b>Oct 26, 2023</b></div>
                      <div><p className="uppercase text-slate-500">Package</p><b>{order.packageName}</b></div>
                      <div><p className="uppercase text-slate-500">Revisions</p><b>{order.revisions}</b></div>
                      <div><p className="uppercase text-slate-500">Format</p><b>{order.format}</b></div>
                      <div><p className="uppercase text-slate-500">Delivery Time</p><b>{order.deliveryTime}</b></div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-violet-700 bg-violet-50 p-6">
                  <h3 className="mb-3 font-semibold">Buyer Requirements</h3>
                  <p className="text-[14px] leading-6 text-slate-700">{order.requirements}</p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {order.attachments.map((file) => (
                      <span key={file} className="rounded-full border bg-white px-4 py-2 text-[13px]">
                        {file.includes(".fig") ? <FileImage className="mr-1 inline h-4 w-4" /> : <FileArchive className="mr-1 inline h-4 w-4" />}
                        {file}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-violet-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex justify-between">
                  <h2 className="text-[18px] font-bold">Delivery Progress</h2>
                  <span className="text-[14px]">{order.progress}% Complete</span>
                </div>

                <div className="h-2 rounded-full bg-violet-100">
                  <div className="h-2 rounded-full bg-violet-700" style={{ width: `${order.progress}%` }} />
                </div>

                <div className="mt-8 space-y-6">
                  {[
                    ["Order Placed", "Oct 12, 10:45 AM", true],
                    ["Requirements Submitted", "Oct 12, 11:30 AM", true],
                    ["Order in Progress", "Expected Delivery: Oct 26", "current"],
                    ["Deliver Order", "", false],
                    ["Order Completed", "", false],
                  ].map((step, i) => (
                    <div key={String(step[0])} className="flex gap-4">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                        step[2] === true ? "bg-emerald-500 text-white" : step[2] === "current" ? "bg-violet-700 text-white" : "bg-violet-100"
                      }`}>
                        {step[2] === true ? <Check className="h-4 w-4" /> : i + 1}
                      </div>
                      <div>
                        <p className="text-[15px] font-medium">
                          {step[0]} {step[2] === "current" && <span className="ml-2 rounded bg-violet-700 px-2 py-1 text-xs text-white">CURRENT</span>}
                        </p>
                        <p className="text-[13px] text-slate-600">{step[1]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-violet-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-[18px] font-bold">Submit Delivery</h2>

                <label className="mb-2 block text-[14px] font-medium">Message to Buyer</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe what you've delivered..."
                  className="h-28 w-full rounded-lg border border-violet-200 p-4 text-sm outline-none"
                />

                <label className="mt-5 flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-violet-200 bg-violet-50 text-center text-sm">
                  <UploadCloud className="mb-2 h-7 w-7 text-slate-500" />
                  Drag & drop files here
                  <span className="text-xs text-slate-500">Max size: 1GB per file</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const selected = Array.from(e.target.files || []).map((f) => f.name);
                      setFiles((prev) => [...prev, ...selected]);
                    }}
                  />
                </label>

                <div className="mt-4 flex flex-wrap gap-3">
                  {files.map((file) => (
                    <button
                      key={file}
                      onClick={() => setFiles((prev) => prev.filter((f) => f !== file))}
                      className="rounded-lg bg-violet-100 px-4 py-2 text-sm"
                    >
                      {file} ×
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t pt-5">
                  <button onClick={handleSaveDraft} className="rounded-lg bg-violet-50 px-6 py-3">
                    Save Draft
                  </button>
                  <button onClick={handleDeliverOrder} className="rounded-lg bg-violet-700 px-6 py-3 text-white">
                    Deliver Order
                  </button>
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-xl border border-violet-200 bg-white p-6 shadow-sm">
                <div className="flex gap-4">
                  <img src={order.buyerAvatar} className="h-16 w-16 rounded-full" />
                  <div>
                    <h2 className="text-[18px] font-bold">{order.buyer}</h2>
                    <p className="text-sm">⭐ {order.buyerRating} ({order.buyerReviews} reviews)</p>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <span className="rounded bg-emerald-50 px-3 py-1 text-xs">Verified Client</span>
                  <span className="rounded bg-violet-50 px-3 py-1 text-xs">Serious Deposit</span>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between"><span>From</span><b>{order.from}</b></div>
                  <div className="flex justify-between"><span>Member since</span><b>{order.memberSince}</b></div>
                  <div className="flex justify-between"><span>Orders from this buyer</span><b>{order.ordersFromBuyer}</b></div>
                </div>

                <button onClick={() => handleAction("Message opened.")} className="mt-6 w-full rounded-lg border border-blue-500 py-3 text-blue-600">
                  <MessageSquare className="mr-2 inline h-4 w-4" />
                  Message Buyer
                </button>
              </div>

              <div className="rounded-xl border border-violet-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-[18px] font-bold">Earnings Summary</h2>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between"><span>Order Value</span><span>${order.price.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Platform Fee (10%)</span><span>-${order.platformFee.toFixed(2)}</span></div>
                </div>
                <div className="mt-5 flex justify-between border-t pt-5">
                  <b>You Earn</b>
                  <b className="text-[24px] text-emerald-600">${youEarn.toFixed(2)}</b>
                </div>
                <div className="mt-5 rounded-lg bg-emerald-50 p-4 text-xs text-slate-700">
                  <Info className="mr-2 inline h-4 w-4 text-emerald-600" />
                  Funds are currently held securely in escrow and will be released upon buyer approval.
                </div>
              </div>

              <div className="rounded-xl border border-violet-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-[18px] font-bold">Quick Actions</h2>
                <div className="space-y-5 text-sm">
                  <button onClick={() => handleAction("Deadline extension requested.")} className="block">
                    <Clock className="mr-3 inline h-4 w-4" /> Deadline Extension
                  </button>
                 <Link href={`/orders/${order.id}/revision`} className="block">
  <RotateCcw className="mr-3 inline h-4 w-4" /> Request Revision
</Link>
                  <button onClick={() => handleAction("Issue reported.")} className="block text-red-600">
                    <Flag className="mr-3 inline h-4 w-4" /> Report Issue
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-violet-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-[18px] font-bold">Internal Notes</h2>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Private notes for yourself..."
                  className="h-24 w-full rounded-lg border border-violet-200 p-4 text-sm outline-none"
                />
                <button onClick={handleSaveNote} className="mt-4 w-full rounded-lg border border-violet-200 py-3">
                  Save Note
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}