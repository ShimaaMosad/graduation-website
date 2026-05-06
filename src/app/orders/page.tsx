"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  Briefcase,
  CheckCircle,
  Filter,
  Grid2X2,
  Hourglass,
  Mail,
  MessageSquare,
  MoreVertical,
  Search,
  Settings,
  ShoppingCart,
} from "lucide-react";
import { getOrders, Order, OrderStatus,  } from "../../lib/orders-api";

const tabs = ["All Orders", "Active", "Late", "Delivered", "Completed", "Cancelled"];


function statusClass(status: OrderStatus) {
  if (status === "In Progress") return "bg-violet-100 text-slate-900";
  if (status === "Delivered") return "bg-blue-100 text-slate-900";
  if (status === "Completed") return "bg-emerald-100 text-emerald-700";
  if (status === "Late") return "bg-red-100 text-red-600";
  return "bg-slate-100 text-slate-700";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.buyer.toLowerCase().includes(search.toLowerCase()) ||
        order.gigTitle.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;
      if (activeTab === "All Orders") return true;
      if (activeTab === "Active") return order.status === "In Progress";
      return order.status === activeTab;
    });
  }, [orders, activeTab, search]);

  const activeCount = orders.filter((o) => o.status === "In Progress").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const completedCount = orders.filter((o) => o.status === "Completed").length;
  const totalEarnings = orders.reduce((sum, order) => sum + order.price, 0);

  return (
    <main className="min-h-screen bg-[#fcf5ff]">

      <section className="px-6 ">
        <div className="mx-auto w-full">
          <h1 className="text-[38px] font-bold">My Orders</h1>
          <p className="mt-2 text-[19px] text-slate-700">
            Manage and track your ongoing and completed projects.
          </p>

          <div className="mt-5 flex flex-wrap gap-4">
            <span className="rounded-full bg-violet-100 px-4 py-1 text-[15px]">{activeCount} Active</span>
            <span className="rounded-full bg-violet-100 px-4 py-1 text-[15px]">{deliveredCount} Delivered</span>
            <span className="rounded-full bg-violet-100 px-4 py-1 text-[15px]">{completedCount} Completed</span>
          </div>

          <div className="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[14px] border border-violet-200 bg-white p-7 shadow-sm">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-violet-100">
                <Briefcase className="h-7 w-7 text-violet-700" />
              </div>
              <p className="text-[17px] text-slate-700">Active Orders</p>
              <h2 className="text-[36px] font-bold">{activeCount}</h2>
            </div>

            <div className="rounded-[14px] border border-violet-200 bg-white p-7 shadow-sm">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100">
                <Hourglass className="h-7 w-7" />
              </div>
              <p className="text-[17px] text-slate-700">Awaiting Acceptance</p>
              <h2 className="text-[36px] font-bold">3</h2>
            </div>

            <div className="rounded-[14px] border border-violet-200 bg-white p-7 shadow-sm">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-violet-100">
                <CheckCircle className="h-7 w-7 text-violet-800" />
              </div>
              <p className="text-[17px] text-slate-700">Completed</p>
              <h2 className="text-[36px] font-bold">48</h2>
            </div>

            <div className="rounded-[14px] border border-violet-200 bg-white p-7 shadow-sm">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-orange-100">
                <Briefcase className="h-7 w-7 text-orange-700" />
              </div>
              <p className="text-[17px] text-slate-700">Total Earnings</p>
              <h2 className="text-[36px] font-bold">${totalEarnings.toLocaleString()}</h2>
            </div>
          </div>

          <div className="mt-9 overflow-x-auto rounded-[14px] border border-violet-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 border-b border-violet-200 p-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap gap-4">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg px-5 py-3 text-[16px] ${
                      activeTab === tab ? "bg-violet-100" : "text-slate-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <div className="flex h-12 w-[280px] items-center gap-3 rounded-lg border border-violet-200 px-4">
                  <Search className="h-5 w-5 text-slate-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search orders..."
                    className="w-full bg-transparent outline-none"
                  />
                </div>
                <button className="h-12 w-12 rounded-lg border border-violet-200">
                  <Filter className="mx-auto h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="min-w-[1050px]">
              <div className="grid grid-cols-[50px_140px_240px_1fr_100px_140px_130px_70px] border-b border-violet-200 px-5 py-4 text-[14px] font-semibold text-slate-700">
                <span><input type="checkbox" /></span>
                <span>ID</span>
                <span>Buyer</span>
                <span>Gig Title</span>
                <span>Price</span>
                <span>Status</span>
                <span>Deadline</span>
                <span>Action</span>
              </div>

              {filteredOrders.map((order) => (
                <Link
                  href={`/orders/${order.id}`}
                  key={order.id}
                  className="grid grid-cols-[50px_140px_240px_1fr_100px_140px_130px_70px] items-center border-b border-violet-100 px-5 py-5 text-[15px] transition hover:bg-violet-50"
                >
                  <span>
                    <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                  </span>

                  <span className="font-semibold text-violet-700">#{order.id}</span>

                  <div className="flex items-center gap-3">
                    <img src={order.buyerAvatar} className="h-8 w-8 rounded-full" />
                    <span>{order.buyer} ({order.buyerCountry})</span>
                  </div>

                  <span>{order.gigTitle}</span>
                  <span>${order.price}</span>

                  <span>
                    <span className={`rounded-full px-3 py-1 text-[14px] ${statusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </span>

                  <span className={order.deadline === "Overdue" ? "text-red-600" : ""}>
                    {order.deadline}
                  </span>

                  <span>
                    <MoreVertical className="h-5 w-5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}