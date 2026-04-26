"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarDays,
  CreditCard,
  Download,
  History,
  Landmark,
  Lock,
  RefreshCcw,
  Search,
  ShoppingCart,
  Wallet,
  XCircle,
  Hourglass,
} from "lucide-react";
import {  HistoryData,
  TransactionStatus,
  TransactionType,
  exportHistoryCSV,
  getHistoryData,
} from "@/src/lib/history";

const typeOptions = ["All Types", "Payment", "Escrow Release", "Refund", "Withdrawal"];
const statusOptions = ["All Status", "Completed", "Pending", "Failed", "Refunded"];

function transactionIcon(type: TransactionType, status: TransactionStatus) {
  if (status === "Failed") return <XCircle size={20} className="text-red-600" />;
  if (type === "Payment") return <CreditCard size={20} />;
  if (type === "Escrow Release") return <Lock size={20} className="text-violet-700" />;
  if (type === "Refund") return <RefreshCcw size={20} className="text-blue-700" />;
  return <Landmark size={20} />;
}

function iconBg(type: TransactionType, status: TransactionStatus) {
  if (status === "Failed") return "#fee2e2";
  if (type === "Escrow Release") return "#e9d5ff";
  if (type === "Refund") return "#dbeafe";
  return "#ede9fe";
}

function statusStyle(status: TransactionStatus) {
  if (status === "Completed") return "bg-sky-100 text-sky-700";
  if (status === "Pending") return "bg-violet-100 text-slate-700";
  if (status === "Failed") return "bg-red-100 text-red-600";
  return "bg-blue-100 text-blue-700";
}

export default function HistoryPage() {
  const [data, setData] = useState<HistoryData | null>(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Status");

  useEffect(() => {
    getHistoryData().then(setData);
  }, []);

  const filteredTransactions = useMemo(() => {
    if (!data) return [];

    const keyword = search.trim().toLowerCase();

    return data.transactions.filter((item) => {
      const matchesSearch =
        keyword === "" ||
        item.type.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.date.toLowerCase().includes(keyword);

      return (
        matchesSearch &&
        (type === "All Types" || item.type === type) &&
        (status === "All Status" || item.status === status)
      );
    });
  }, [data, search, type, status]);

  if (!data) return <main className="p-10">Loading...</main>;

  const handleExport = async () => {
    await exportHistoryCSV(filteredTransactions);
  };

  const maxMonthly = Math.max(
    1,
    ...data.monthlySummary.flatMap((m) => [m.earnings, m.spending])
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fbf5ff",
        color: "#12121a",
        display: "flex",
        width: "100%",
      }}
    >
      <aside
        style={{
          width: 300,
          minWidth: 300,
          height: "100vh",
          background: "#f8fafc",
          borderRight: "1px solid #e6dff0",
          position: "fixed",
          left: 0,
          top: 0,
        }}
      >
        <div style={{ padding: "32px 28px", borderBottom: "1px solid #e6dff0" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Freelancer Portal</h2>
          <p style={{ marginTop: 10, fontSize: 16, color: "#64748b" }}>
            Verified Account
          </p>
        </div>

        <nav style={{ paddingTop: 26, fontSize: 16, fontWeight: 500 }}>
          <Link href="/checkout/payment" className="flex items-center gap-4 px-8 py-4 text-slate-700">
            <ShoppingCart size={21} /> Checkout
          </Link>

          <Link href="/escrow" className="flex items-center gap-4 px-8 py-4 text-slate-700">
            <Wallet size={21} /> Escrow
          </Link>

          <Link
            href="/history"
            className="flex items-center gap-4 px-8 py-4 text-violet-700"
            style={{ background: "#f0ebff", borderRight: "4px solid #6d28d9" }}
          >
            <History size={21} /> History
          </Link>

          <Link href="/earnings" className="flex items-center gap-4 px-8 py-4 text-slate-700">
            <Wallet size={21} /> Earnings
          </Link>
        </nav>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 28,
            borderTop: "1px solid #e6dff0",
          }}
        >
          <button
            style={{
              width: "100%",
              height: 58,
              background: "#6d28d9",
              color: "white",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            Withdraw Funds
          </button>
        </div>
      </aside>

      <section
        style={{
          marginLeft: 300,
          width: "calc(100% - 300px)",
          padding: "54px 58px",
        }}
      >
        <div style={{ maxWidth: 1220, margin: "0 auto" }}>
          <div className="mb-10 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold leading-none">Transaction History</h1>
              <p className="mt-3 text-lg text-slate-700">
                Review your recent payments, withdrawals, and earnings.
              </p>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-3 border bg-white px-8 py-4 text-lg font-bold"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 28,
              marginBottom: 36,
            }}
          >
            {[
              ["Total Spent", data.totalSpent, <BriefcaseBusiness size={21} />, "#fee2e2"],
              ["Total Earned", data.totalEarned, <Wallet size={21} />, "#e0f2fe"],
              ["Pending", data.pending, <Hourglass size={21} />, "#dbeafe"],
              ["This Month", data.thisMonth, <CalendarDays size={21} />, "#ede9fe"],
            ].map(([label, value, icon, bg]) => (
              <div
                key={String(label)}
                style={{
                  height: 185,
                  background: "white",
                  border: "1px solid #d8cee7",
                  borderRadius: 18,
                  padding: 30,
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    background: String(bg),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 22,
                  }}
                >
                  {icon}
                </div>
                <p className="text-base text-slate-700">{label}</p>
                <h2 className="mt-1 text-4xl font-bold leading-none">
                  ${Number(value).toLocaleString()}
                </h2>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "white",
              border: "1px solid #d8cee7",
              borderRadius: 18,
              padding: 18,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 165px 165px 180px",
                gap: 16,
              }}
            >
              <div className="flex h-14 items-center gap-3 rounded-lg border border-[#d8cee7] px-4">
                <Search size={20} className="text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search transactions..."
                  className="w-full bg-transparent outline-none"
                />
              </div>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-14 rounded-lg border border-[#d8cee7] bg-white px-4 outline-none"
              >
                {typeOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-14 rounded-lg border border-[#d8cee7] bg-white px-4 outline-none"
              >
                {statusOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <button className="flex h-14 items-center justify-center gap-2 rounded-lg border border-[#d8cee7] bg-white">
                <CalendarDays size={20} />
                Date Range
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "760px 390px",
              gap: 28,
              alignItems: "start",
            }}
          >
            <div
              style={{
                background: "white",
                border: "1px solid #d8cee7",
                borderRadius: 18,
                overflow: "hidden",
              }}
            >
              <h2 className="px-8 py-8 text-3xl font-bold">Recent Transactions</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.45fr .68fr .72fr .75fr",
                  height: 52,
                  alignItems: "center",
                  background: "#f5eefc",
                  padding: "0 32px",
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                <span>Transaction</span>
                <span>Date</span>
                <span>Status</span>
                <span className="text-right">Amount</span>
              </div>

              {filteredTransactions.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.45fr .68fr .72fr .75fr",
                    alignItems: "center",
                    minHeight: 92,
                    borderTop: "1px solid #d8cee7",
                    padding: "18px 32px",
                  }}
                >
                  <div className="flex items-center gap-5">
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: iconBg(item.type, item.status),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {transactionIcon(item.type, item.status)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold leading-tight">{item.type}</h3>
                      <p className={item.status === "Failed" ? "text-sm text-red-600" : "text-sm text-slate-600"}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-800">{item.date}</p>

                  <span className={`w-fit rounded-full px-3 py-1 text-xs ${statusStyle(item.status)}`}>
                    {item.status}
                  </span>

                  <p
                    className={`text-right text-xl font-bold ${
                      item.amount > 0 ? "text-sky-800" : "text-slate-950"
                    } ${item.status === "Failed" ? "line-through text-slate-500" : ""}`}
                  >
                    {item.amount > 0 ? "+" : "-"}${Math.abs(item.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <aside
              style={{
                height: 646,
                background: "white",
                border: "1px solid #d8cee7",
                borderRadius: 18,
                padding: 34,
              }}
            >
              <h2 className="text-3xl font-bold leading-tight">Monthly Summary</h2>

              <div
                style={{
                  position: "relative",
                  marginTop: 42,
                  height: 445,
                  borderBottom: "1px solid #d8cee7",
                }}
              >
                {[0, 1, 2, 3].map((line) => (
                  <div
                    key={line}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      height: 1,
                      background: "#eee7f5",
                      top: line * 135,
                    }}
                  />
                ))}

                <div
                  style={{
                    position: "absolute",
                    left: 16,
                    right: 16,
                    bottom: 0,
                    height: 350,
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "space-between",
                    paddingBottom: 6,
                  }}
                >
                  {data.monthlySummary.map((item) => {
                    const earningHeight = (item.earnings / maxMonthly) * 270;
                    const spendingHeight = (item.spending / maxMonthly) * 270;

                    return (
                      <div key={item.month} className="flex flex-col items-center">
                        <div className="flex h-[295px] items-end gap-2">
                          <div className="w-4 rounded-t bg-sky-200" style={{ height: earningHeight }} />
                          <div className="w-4 rounded-t bg-violet-200" style={{ height: spendingHeight }} />
                        </div>
                        <span className="mt-3 text-sm">{item.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-6 text-sm text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-sky-200" />
                  Earnings
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-violet-200" />
                  Spending
                </span>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}