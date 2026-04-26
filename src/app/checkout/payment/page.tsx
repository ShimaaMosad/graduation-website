"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  CreditCard,
  Landmark,
  Lock,
  Search,
  Settings,
  ShieldCheck,
  Tag,
} from "lucide-react";
import {
  CheckoutSummary,
  applyPromoCode,
  getCheckoutSummary,
  submitPayment,
} from "@/src/lib/payments-api";

type Method = "Credit Card" | "PayPal" | "Bank Transfer";

type Errors = {
  nameOnCard?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
};

export default function PaymentPage() {
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);
  const [method, setMethod] = useState<Method>("Credit Card");
  const [promo, setPromo] = useState("SUMMER10");
  const [notice, setNotice] = useState("");
  const [errorNotice, setErrorNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [form, setForm] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
    sameAsProfile: true,
  });

  useEffect(() => {
    getCheckoutSummary().then(setSummary);
  }, []);

  const cleanCardNumber = form.cardNumber.replace(/\s/g, "");

  const validateForm = () => {
    const newErrors: Errors = {};

    if (method === "Credit Card") {
      if (!form.nameOnCard.trim()) {
        newErrors.nameOnCard = "Name on card is required";
      }

      if (!/^\d{16}$/.test(cleanCardNumber)) {
        newErrors.cardNumber = "Card number must be 16 digits";
      }

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiryDate)) {
        newErrors.expiryDate = "Use MM/YY format";
      } else {
        const [month, year] = form.expiryDate.split("/").map(Number);
        const currentDate = new Date();
        const currentYear = Number(String(currentDate.getFullYear()).slice(2));
        const currentMonth = currentDate.getMonth() + 1;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          newErrors.expiryDate = "Card is expired";
        }
      }

      if (!/^\d{3,4}$/.test(form.cvv)) {
        newErrors.cvv = "CVV must be 3 or 4 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = useMemo(() => {
    if (method !== "Credit Card") return true;

    return (
      form.nameOnCard.trim().length > 0 &&
      /^\d{16}$/.test(cleanCardNumber) &&
      /^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiryDate) &&
      /^\d{3,4}$/.test(form.cvv)
    );
  }, [form, method, cleanCardNumber]);

  if (!summary) return <main className="p-10">Loading...</main>;

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handleApplyPromo = async () => {
    const res = await applyPromoCode(promo);
    setNotice(res.message);
    setErrorNotice("");
  };

  const handlePay = async () => {
    setNotice("");
    setErrorNotice("");

    if (!validateForm()) {
      setErrorNotice("Please complete all payment details correctly before paying.");
      return;
    }

    setLoading(true);

    const res = await submitPayment({
      method,
      ...form,
      promoCode: promo,
      total: summary.total,
    });

    setLoading(false);

    if (res.success) {
      setNotice(res.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#fcf5ff]">
      <header className="flex h-[68px] items-center justify-between border-b border-violet-100 bg-white px-7">
        <Link href="/" className="text-[25px] font-bold text-violet-700">
          MySite
        </Link>

        <div className="flex h-11 w-[280px] items-center gap-3 rounded-full bg-violet-100 px-5">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            placeholder="Search"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-6">
          <Bell className="h-5 w-5 text-slate-600" />
          <Settings className="h-5 w-5 text-slate-600" />
          <img
            src="https://i.pravatar.cc/100?img=13"
            className="h-9 w-9 rounded-full"
            alt="profile"
          />
        </div>
      </header>

      <section className="w-full px-[70px] py-9">
        {notice && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-emerald-700">
            {notice}
          </div>
        )}

        {errorNotice && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-red-600">
            {errorNotice}
          </div>
        )}

        <div className="mb-6 flex items-center gap-3 text-[15px] text-slate-800">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/gigs">Services</Link>
          <span>›</span>
          <span>Logo Design</span>
          <span>›</span>
          <span>Order</span>
          <span>›</span>
          <b>Payment</b>
        </div>

        <h1 className="text-[38px] font-bold text-slate-950">Secure Checkout</h1>

        <p className="mt-2 flex items-center gap-2 text-[18px] text-slate-700">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          Your payment is protected by MySite Escrow
        </p>

        <div className="my-8 flex max-w-[820px] items-center justify-between">
          <div className="text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border-2 border-emerald-600 text-emerald-600">
              <Check className="h-5 w-5" />
            </div>
            <p className="mt-2 text-sm">Order Details</p>
          </div>

          <div className="h-1 flex-1 bg-violet-100" />

          <div className="text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-violet-700 text-white">
              2
            </div>
            <p className="mt-2 text-sm font-semibold text-violet-700">Payment</p>
          </div>

          <div className="h-1 flex-1 bg-violet-100" />

          <div className="text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-slate-500">
              3
            </div>
            <p className="mt-2 text-sm text-slate-500">Review</p>
          </div>
        </div>

        <div className="grid w-full gap-7 lg:grid-cols-[1.35fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-xl border border-violet-200 bg-white p-7">
              <h2 className="mb-6 text-[22px] font-bold">Payment Method</h2>

              <div className="mb-5 flex gap-8 border-b border-violet-100">
                {(["Credit Card", "PayPal", "Bank Transfer"] as Method[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setMethod(item);
                      setErrors({});
                      setErrorNotice("");
                    }}
                    className={`pb-3 ${
                      method === item
                        ? "border-b-2 border-violet-700 text-violet-700"
                        : "text-slate-700"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {method === "Credit Card" ? (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm">Name on Card</span>
                    <input
                      value={form.nameOnCard}
                      onChange={(e) =>
                        setForm({ ...form, nameOnCard: e.target.value })
                      }
                      placeholder="John Doe"
                      className={`mt-1 h-12 w-full rounded-lg border px-4 text-[18px] outline-none ${
                        errors.nameOnCard ? "border-red-400" : "border-violet-200"
                      }`}
                    />
                    {errors.nameOnCard && (
                      <p className="mt-1 text-sm text-red-500">{errors.nameOnCard}</p>
                    )}
                  </label>

                  <label className="block">
                    <span className="text-sm">Card Number</span>
                    <div
                      className={`mt-1 flex h-12 items-center rounded-lg border px-4 ${
                        errors.cardNumber ? "border-red-400" : "border-violet-200"
                      }`}
                    >
                      <input
                        value={form.cardNumber}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            cardNumber: formatCardNumber(e.target.value),
                          })
                        }
                        placeholder="0000 0000 0000 0000"
                        className="w-full text-[18px] outline-none"
                      />
                      <CreditCard className="h-5 w-5 text-slate-400" />
                    </div>
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
                    )}
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label>
                      <span className="text-sm">Expiry Date</span>
                      <input
                        value={form.expiryDate}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            expiryDate: formatExpiry(e.target.value),
                          })
                        }
                        placeholder="MM/YY"
                        className={`mt-1 h-12 w-full rounded-lg border px-4 text-[18px] outline-none ${
                          errors.expiryDate ? "border-red-400" : "border-violet-200"
                        }`}
                      />
                      {errors.expiryDate && (
                        <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>
                      )}
                    </label>

                    <label>
                      <span className="text-sm">CVV</span>
                      <input
                        value={form.cvv}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                          })
                        }
                        placeholder="123"
                        className={`mt-1 h-12 w-full rounded-lg border px-4 text-[18px] outline-none ${
                          errors.cvv ? "border-red-400" : "border-violet-200"
                        }`}
                      />
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
                      )}
                    </label>
                  </div>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={form.saveCard}
                      onChange={(e) =>
                        setForm({ ...form, saveCard: e.target.checked })
                      }
                      className="h-4 w-4"
                    />
                    Save this card for future payments
                  </label>
                </div>
              ) : (
                <div className="rounded-lg bg-violet-50 p-5 text-slate-700">
                  {method} selected. The backend will provide the real redirect or
                  transfer instructions later.
                </div>
              )}
            </div>

            <div className="rounded-xl border border-violet-200 bg-white p-7">
              <div className="flex items-center justify-between">
                <h2 className="text-[22px] font-bold">Billing Address</h2>

                <div className="flex items-center gap-3">
                  <span className="text-sm">Same as profile</span>
                  <button
                    onClick={() =>
                      setForm({ ...form, sameAsProfile: !form.sameAsProfile })
                    }
                    className={`flex h-7 w-12 items-center rounded-full p-1 ${
                      form.sameAsProfile
                        ? "justify-end bg-violet-700"
                        : "justify-start bg-slate-300"
                    }`}
                  >
                    <span className="h-5 w-5 rounded-full bg-white" />
                  </button>
                </div>
              </div>

              <p className="mt-4 text-slate-500">
                {form.sameAsProfile
                  ? "Using default profile address. Toggle to enter a new address."
                  : "Custom billing address fields will appear here when backend is ready."}
              </p>
            </div>

            <div className="rounded-xl border border-violet-200 bg-white p-7">
              <h2 className="mb-5 text-[22px] font-bold">Promo Code</h2>

              <div className="flex gap-3">
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  className="h-12 flex-1 rounded-lg border border-violet-200 px-4 text-[18px] outline-none"
                />
                <button
                  onClick={handleApplyPromo}
                  className="rounded-lg bg-violet-100 px-8 font-semibold"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          <aside>
            <div className="overflow-hidden rounded-xl border border-violet-200 bg-white">
              <div className="flex gap-5 border-b border-violet-100 p-7">
                <img
                  src={summary.image}
                  className="h-20 w-28 rounded-lg object-cover"
                  alt="gig"
                />
                <div>
                  <h2 className="text-[20px] font-bold">{summary.gigTitle}</h2>
                  <p className="mt-2 text-slate-600">👤 {summary.seller}</p>
                </div>
              </div>

              <div className="space-y-4 p-7 text-[18px]">
                <div className="flex justify-between">
                  <span>{summary.packageName}</span>
                  <span>${summary.packagePrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Extra Revision</span>
                  <span>${summary.extraRevision.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-emerald-600">
                  <span className="flex items-center gap-2">
                    Promo ({summary.promoCode}) <Tag className="h-4 w-4" />
                  </span>
                  <span>-${summary.promoDiscount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>${summary.serviceFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-violet-100 p-7">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-[28px] font-bold">Total</h2>
                  <h2 className="text-[38px] font-bold">
                    ${summary.total.toFixed(2)}
                  </h2>
                </div>

                <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                  <Lock className="mr-2 inline h-4 w-4" />
                  Funds are held securely in MySite Escrow and only released when
                  you approve the final work.
                </div>

                <button
                  onClick={handlePay}
                  disabled={loading || !isFormValid}
                  className="w-full rounded-lg bg-gradient-to-r from-violet-500 to-violet-800 py-4 text-[20px] font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Lock className="mr-2 inline h-5 w-5" />
                  {loading ? "Processing..." : `Pay $${summary.total.toFixed(2)} Now`}
                </button>

                {!isFormValid && method === "Credit Card" && (
                  <p className="mt-3 text-center text-sm text-red-500">
                    Complete valid card details to enable payment.
                  </p>
                )}

                <div className="mt-5 flex justify-center gap-8 text-slate-300">
                  <CreditCard className="h-7 w-7" />
                  <Landmark className="h-7 w-7" />
                  <CreditCard className="h-7 w-7" />
                </div>
              </div>
            </div>

            <div className="mt-7 flex gap-4">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <div>
                <h3 className="text-[20px] font-bold">
                  100% Satisfaction Guarantee
                </h3>
                <p className="mt-2 text-slate-600">
                  If you're not happy with the delivery, our support team will help
                  you get a refund.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}