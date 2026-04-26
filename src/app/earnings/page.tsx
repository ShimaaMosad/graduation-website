"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  CreditCard,
  History,
  Landmark,
  Lock,
  ShoppingCart,
  Wallet,
  Zap,
} from "lucide-react";
import {
  EarningsData,
  EarningsOverviewPoint,
  getEarningsData,
  getEarningsOverview,
  submitWithdrawal,
  downloadTaxReport,
} from "@/src/lib/earnings-api";

export default function EarningsPage() {
  const [data, setData] = useState<EarningsData | null>(null);
  const [selectedMethod, setSelectedMethod] = useState("chase");
  const [amount, setAmount] = useState("2450");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [overview, setOverview] = useState<EarningsOverviewPoint[]>([]);
  const [showAllWithdrawals, setShowAllWithdrawals] = useState(false);

  useEffect(() => {
    getEarningsData().then(setData);
    getEarningsOverview().then(setOverview);
  }, []);

  if (!data) return <main className="p-10">Loading...</main>;

  const visibleWithdrawals = showAllWithdrawals
    ? data.withdrawals
    : data.withdrawals.slice(0, 4);

  const handleMax = () => {
    setAmount(String(data.availableBalance));
    setError("");
  };

  const handleWithdraw = async () => {
    setNotice("");
    setError("");

    const value = Number(amount);

    if (!amount || value <= 0) {
      setError("Please enter a valid withdrawal amount.");
      return;
    }

    if (value > data.availableBalance) {
      setError(`Amount cannot exceed $${data.availableBalance.toFixed(2)}.`);
      return;
    }

    if (!selectedMethod) {
      setError("Please select a transfer method.");
      return;
    }

    const res = await submitWithdrawal({
      amount: value,
      methodId: selectedMethod,
    });

    if (res.success) {
      const methodName =
        data.methods.find((m) => m.id === selectedMethod)?.name || "Transfer";

      setData({
        ...data,
        availableBalance: data.availableBalance - value,
        withdrawn: data.withdrawn + value,
        withdrawals: [
          {
            id: `w-${Date.now()}`,
            method: methodName,
            date: "Today",
            amount: value,
            status: "Completed",
          },
          ...data.withdrawals,
        ],
      });

      setAmount("");
      setNotice(res.message);
    }
  };

  const handleDownloadReport = async () => {
    setNotice("");
    setError("");

    const res = await downloadTaxReport();

    if (res.success) {
      setNotice(res.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbf5ff] text-slate-950">
      <aside className="fixed bottom-0 left-0 top-0 hidden w-[300px] border-r border-violet-100 bg-white lg:block">
        <div className="border-b border-violet-100 p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
              <Lock className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-[20px] font-bold">Freelancer Portal</h2>
              <p className="text-[16px] text-slate-700">Verified Account</p>
            </div>
          </div>

          <button className="mt-7 flex w-full items-center justify-center gap-3 rounded-lg bg-violet-700 py-4 text-[18px] font-bold text-white">
            <Wallet className="h-5 w-5" />
            Withdraw Funds
          </button>
        </div>

        <nav className="space-y-2 py-6 text-[18px]">
          <Link
            href="/checkout/payment"
            className="flex items-center gap-4 px-8 py-4 text-slate-700"
          >
            <ShoppingCart className="h-5 w-5" />
            Checkout
          </Link>

          <Link
            href="/escrow"
            className="flex items-center gap-4 px-8 py-4 text-slate-700"
          >
            <Wallet className="h-5 w-5" />
            Escrow
          </Link>

          <Link
            href="#"
            className="flex items-center gap-4 px-8 py-4 text-slate-700"
          >
            <History className="h-5 w-5" />
            History
          </Link>

          <Link
            href="/earnings"
            className="flex items-center gap-4 border-r-4 border-violet-700 bg-violet-100 px-8 py-4 font-semibold text-violet-700"
          >
            <Wallet className="h-5 w-5" />
            Earnings
          </Link>
        </nav>

        <div className="absolute bottom-7 left-8 text-[24px] font-bold text-violet-700">
          MySite
        </div>
      </aside>

      <section className="w-full px-8 py-12 lg:ml-[300px] lg:w-[calc(100%-300px)]">
        <div className="w-full max-w-none">
          {notice && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-emerald-700">
              {notice}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-red-600">
              {error}
            </div>
          )}

          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-[38px] font-bold">Earnings & Withdrawals</h1>

            <button
              onClick={() =>
                document
                  .getElementById("withdraw-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center gap-3 rounded-lg bg-violet-700 px-8 py-4 text-[18px] font-bold text-white"
            >
              <Landmark className="h-6 w-6" />
              Withdraw Funds
            </button>
          </div>

          <div className="mb-8 grid gap-5 lg:grid-cols-[1.6fr_0.75fr_0.75fr_0.75fr]">
            <div className="rounded-xl bg-violet-700 p-8 text-white shadow-sm">
              <p className="text-[20px]">Available Balance</p>
              <h2 className="mt-2 text-[42px] font-bold">
                ${data.availableBalance.toLocaleString()}.00
              </h2>
              <p className="mt-9 flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4" />
                Ready to withdraw
              </p>
            </div>

            <div className="rounded-xl border border-violet-200 bg-white p-8 shadow-sm">
              <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-slate-500">
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-[19px] text-slate-700">Pending</p>
              <h3 className="mt-2 text-[26px] font-bold">
                ${data.pending.toFixed(2)}
              </h3>
            </div>

            <div className="rounded-xl border border-violet-200 bg-white p-8 shadow-sm">
              <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-slate-500">
                <Wallet className="h-5 w-5" />
              </div>
              <p className="text-[19px] text-slate-700">Total Earned</p>
              <h3 className="mt-2 text-[26px] font-bold">
                ${data.totalEarned.toLocaleString()}.00
              </h3>
            </div>

            <div className="grid gap-5">
              <div className="rounded-xl border border-violet-200 bg-white p-5 shadow-sm">
                <p className="text-[16px]">This Month</p>
                <h3 className="text-[22px] font-bold">
                  ${data.thisMonth.toLocaleString()}
                </h3>
              </div>

              <div className="rounded-xl border border-violet-200 bg-white p-5 shadow-sm">
                <p className="text-[16px]">Withdrawn</p>
                <h3 className="text-[22px] font-bold">
                  ${data.withdrawn.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>

          <div className="grid gap-7 lg:grid-cols-[1.35fr_0.9fr]">
            <div className="space-y-7">
              <div
                id="withdraw-form"
                className="rounded-xl border border-violet-200 bg-white p-8 shadow-sm"
              >
                <h2 className="text-[30px] font-bold">Withdraw Funds</h2>

                <label className="mt-8 block">
                  <span className="text-[19px] text-slate-700">Amount</span>

                  <div className="mt-3 flex h-[90px] items-center rounded-lg border border-violet-200 bg-[#fbf5ff] px-6">
                    <span className="text-[44px] text-slate-500">$</span>

                    <input
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value.replace(/[^\d.]/g, ""));
                        setError("");
                      }}
                      className="w-full bg-transparent px-4 text-right text-[42px] font-bold outline-none"
                    />

                    <button
                      onClick={handleMax}
                      className="rounded-full bg-violet-100 px-4 py-1 text-sm font-semibold text-violet-700"
                    >
                      Max
                    </button>
                  </div>

                  <p className="mt-2 text-right text-slate-500">
                    Available: ${data.availableBalance.toFixed(2)}
                  </p>
                </label>

                <div className="mt-7 flex items-center justify-between">
                  <h3 className="text-[19px] text-slate-700">
                    Transfer Method
                  </h3>
                  <button
                    onClick={() => setNotice("Add transfer method flow opened.")}
                    className="text-violet-700"
                  >
                    + Add method
                  </button>
                </div>

                <div className="mt-3 grid gap-4 md:grid-cols-3">
                  {data.methods.map((method) => {
                    const active = selectedMethod === method.id;

                    return (
                      <button
                        key={method.id}
                        onClick={() => {
                          setSelectedMethod(method.id);
                          setError("");
                        }}
                        className={`relative min-h-[180px] rounded-lg border p-5 text-left transition ${
                          active
                            ? "border-violet-700 bg-violet-50"
                            : "border-violet-200 bg-white"
                        }`}
                      >
                        {active && (
                          <CheckCircle className="absolute right-4 top-4 h-5 w-5 text-violet-700" />
                        )}

                        {method.type === "bank" && (
                          <Landmark className="mb-4 h-6 w-6 text-violet-700" />
                        )}
                        {method.type === "instant" && (
                          <Zap className="mb-4 h-6 w-6 text-slate-800" />
                        )}
                        {method.type === "paypal" && (
                          <CreditCard className="mb-4 h-6 w-6 text-slate-800" />
                        )}

                        <h4 className="text-[18px] font-bold">{method.name}</h4>
                        <p className="mt-1 text-[17px] text-slate-600">
                          {method.details}
                        </p>
                        <p className="mt-3 text-[17px] text-slate-500">
                          {method.fee}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleWithdraw}
                  className="mt-7 w-full rounded-lg bg-violet-700 py-4 text-[21px] font-bold text-white shadow-lg"
                >
                  Confirm Withdrawal
                </button>
              </div>

              <div className="rounded-xl border border-violet-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-[24px] font-bold">Earnings Overview</h2>

                  <button className="rounded-lg border border-violet-200 px-4 py-2">
                    Last 6 Months
                  </button>
                </div>

                <div className="flex h-[300px] items-end gap-5 rounded-lg bg-violet-50 p-6">
                  {overview.map((item) => {
                    const maxAmount = Math.max(...overview.map((x) => x.amount));
                    const height = maxAmount ? (item.amount / maxAmount) * 230 : 0;

                    return (
                      <div
                        key={item.month}
                        className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                      >
                        <div
                          title={`$${item.amount}`}
                          className="w-full rounded-t-lg bg-violet-700 transition hover:bg-violet-800"
                          style={{ height: `${height}px` }}
                        />

                        <span className="text-xs text-slate-500">
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <aside className="space-y-7">
              <div className="rounded-xl border border-violet-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-violet-100 px-8 py-6">
                  <h2 className="text-[24px] font-bold">Recent Withdrawals</h2>
                  <button
                    onClick={() => setShowAllWithdrawals(!showAllWithdrawals)}
                    className="text-violet-700"
                  >
                    {showAllWithdrawals ? "View Less" : "View All"}
                  </button>
                </div>

                <div className="space-y-6 p-8">
                  {visibleWithdrawals.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
                        {item.method === "InstaPay" ? (
                          <Zap className="h-5 w-5" />
                        ) : item.method === "PayPal" ? (
                          <CreditCard className="h-5 w-5" />
                        ) : (
                          <Landmark className="h-5 w-5" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-[17px] font-bold">{item.method}</h3>
                        <p className="text-slate-600">{item.date}</p>
                      </div>

                      <div className="text-right">
                        <h3 className="font-bold">
                          -${item.amount.toFixed(2)}
                        </h3>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-violet-200 bg-white p-8 shadow-sm">
                <h2 className="mb-6 text-[24px] font-bold">
                  Earnings by Category
                </h2>

                <div className="flex items-center gap-8">
                  <div className="flex h-40 w-40 items-center justify-center rounded-full border-[20px] border-violet-100 shadow-[inset_28px_0_0_#057ca5]">
                    <div className="text-center">
                      <p className="text-slate-500">Total</p>
                      <b>$12.4k</b>
                    </div>
                  </div>

                  <div className="space-y-4 text-[18px]">
                    <p>🟣 Web Dev (60%)</p>
                    <p>🔵 Logo Design (25%)</p>
                    <p>⚪ Consulting (15%)</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-7">
                <h3 className="text-[22px] font-bold">Tax Year 2023</h3>
                <p className="mt-2 text-slate-700">
                  Download your earnings summary and withdrawal history for tax
                  reporting.
                </p>
                <button
                  onClick={handleDownloadReport}
                  className="mt-4 rounded-lg bg-yellow-500 px-5 py-3 font-bold text-white"
                >
                  Download Report
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}