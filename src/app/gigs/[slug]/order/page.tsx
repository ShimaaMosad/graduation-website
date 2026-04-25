"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Check, ChevronDown, ChevronRight, CreditCard, ShieldCheck } from "lucide-react";
import { getGigBySlug, parseExtraIds } from "@/src/lib/gigs-api";
import Navbar from "@/src/_components/Navbar/Navbar";

export default function GigOrderPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const slug = String(params.slug);
  const gig = getGigBySlug(slug);

  const packageName = (searchParams.get("package") || "Standard") as "Basic" | "Standard";
  const queryQuantity = Number(searchParams.get("quantity") || 1);
  const queryExtras = parseExtraIds(searchParams.get("extras"));

  const [quantity, setQuantity] = useState(Math.max(1, queryQuantity));
  const [selectedExtras, setSelectedExtras] = useState<number[]>(queryExtras);
  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [colorPreferences, setColorPreferences] = useState("");
  const [requirements, setRequirements] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  if (!gig) {
    return (
      <main className="min-h-screen bg-[#f5f6f8]">
        <Navbar />
        <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-4xl font-bold text-slate-900">Order not found</h1>
            <Link href="/gigs" className="mt-4 inline-block text-xl text-blue-500">
              Back to gigs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const selectedPackage =
    gig.packages.find((pkg) => pkg.name === packageName) || gig.packages[0];

  const selectedExtrasData = gig.extras.filter((extra) => selectedExtras.includes(extra.id));
  const extrasTotal = selectedExtrasData.reduce((sum, extra) => sum + extra.price, 0);
  const packageTotal = selectedPackage.price * quantity;
  const subtotal = packageTotal + extrasTotal;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  const estimatedDeliveryDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + selectedPackage.deliveryDays);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedPackage.deliveryDays]);

  const toggleExtra = (extraId: number) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId]
    );
  };

  const handleContinuePayment = () => {
    if (!brandName.trim()) {
      alert("Please enter brand name");
      return;
    }

    setShowSuccess(true);
  };

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <Navbar />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-8">
          <div className="flex flex-wrap items-center gap-3 text-[18px] text-slate-500">
            <Link href="/gigs" className="hover:text-slate-900">Services</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/gigs/${gig.slug}`} className="hover:text-slate-900">
              {gig.title}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-slate-900">Order</span>
          </div>

          <h1 className="mt-6 text-5xl font-bold text-slate-900">Complete Your Order</h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-10 md:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.95fr]">
          <div className="space-y-8">
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-6 md:flex-row">
                <img
                  src={gig.image}
                  alt={gig.title}
                  className="h-28 w-36 rounded-[20px] object-cover"
                />

                <div className="flex-1">
                  <h2 className="text-[24px] font-bold text-slate-900">{gig.title}</h2>
                  <p className="mt-2 text-[18px] text-slate-500">
                    by <span className="text-violet-600">{gig.sellerName}</span>
                  </p>

                  <div className="mt-4 inline-flex rounded-full bg-violet-600 px-4 py-2 text-[16px] font-semibold text-white">
                    {selectedPackage.name} Package
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-200 pt-8">
                <h3 className="text-[28px] font-bold text-slate-900">What's Included</h3>

                <div className="mt-6 space-y-4">
                  {selectedPackage.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-4 text-[18px] text-slate-800">
                      <Check className="h-5 w-5 text-emerald-500" />
                      <span>{feature}</span>
                    </div>
                  ))}

                  <div className="flex items-center gap-4 text-[18px] text-slate-800">
                    <Check className="h-5 w-5 text-emerald-500" />
                    <span>Delivery in {selectedPackage.deliveryDays} days</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-200 pt-8">
                <h3 className="text-[28px] font-bold text-slate-900">Customize Your Order</h3>

                <div className="mt-6">
                  <label className="mb-3 block text-[20px] font-semibold text-slate-900">
                    Quantity
                  </label>
                  <div className="relative max-w-[260px]">
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full rounded-2xl bg-slate-100 px-5 py-4 pr-12 text-[20px] outline-none"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-[22px] font-semibold text-slate-900">Add Extras</h4>
                  <div className="mt-5 space-y-4">
                    {gig.extras.map((extra) => (
                      <label key={extra.id} className="flex items-center justify-between gap-4 text-[18px]">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedExtras.includes(extra.id)}
                            onChange={() => toggleExtra(extra.id)}
                            className="h-5 w-5"
                          />
                          <span>{extra.label}</span>
                        </div>
                        <span>+${extra.price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-8 border-t border-slate-200 pt-8">
                  <h4 className="text-[22px] font-semibold text-slate-900">Information Required</h4>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[18px] font-medium text-slate-900">
                        Brand name *
                      </label>
                      <input
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="Your brand name"
                        className="w-full rounded-2xl bg-slate-100 px-5 py-4 text-[18px] outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[18px] font-medium text-slate-900">
                        Tagline
                      </label>
                      <input
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="Your tagline"
                        className="w-full rounded-2xl bg-slate-100 px-5 py-4 text-[18px] outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="mb-2 block text-[18px] font-medium text-slate-900">
                      Color preferences
                    </label>
                    <textarea
                      value={colorPreferences}
                      onChange={(e) => setColorPreferences(e.target.value)}
                      placeholder="Describe your preferred colors..."
                      className="h-28 w-full rounded-2xl bg-slate-100 px-5 py-4 text-[18px] outline-none"
                    />
                  </div>

                  <div className="mt-6">
                    <label className="mb-2 block text-[18px] font-medium text-slate-900">
                      Any specific requirements?
                    </label>
                    <textarea
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="Share any additional details or requirements..."
                      className="h-32 w-full rounded-2xl bg-slate-100 px-5 py-4 text-[18px] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="sticky top-28 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-[28px] font-bold text-slate-900">Order Summary</h2>

              <div className="mt-8">
                <h3 className="text-[24px] font-bold text-slate-900">{selectedPackage.title}</h3>
                <p className="mt-2 text-[20px] text-slate-500">{gig.category} Service</p>
              </div>

              <div className="mt-8 space-y-4 text-[20px] text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Package price</span>
                  <span>${selectedPackage.price}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Quantity: {quantity}</span>
                  <span>{quantity > 1 ? `$${packageTotal}` : "-"}</span>
                </div>

                {selectedExtrasData.map((extra) => (
                  <div key={extra.id} className="flex items-center justify-between">
                    <span>{extra.label}</span>
                    <span>${extra.price}</span>
                  </div>
                ))}

                <div className="flex items-center justify-between">
                  <span>Service fee (10%)</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-200 pt-8">
                <div className="flex items-center justify-between">
                  <span className="text-[28px] font-bold text-slate-900">Total</span>
                  <span className="text-[48px] font-bold text-violet-600">${total.toFixed(2)}</span>
                </div>

                <p className="mt-5 text-center text-[20px] text-slate-500">
                  Estimated delivery: {estimatedDeliveryDate}
                </p>

                <button
                  onClick={handleContinuePayment}
                  className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-blue-500 px-8 py-5 text-2xl font-semibold text-white"
                >
                  Continue to Payment
                  <ChevronRight className="h-6 w-6" />
                </button>

                <div className="mt-5 flex items-center justify-center gap-2 text-[18px] text-slate-500">
                  <CreditCard className="h-5 w-5" />
                  <span>Visa • Mastercard • PayPal</span>
                </div>

                <div className="mt-8 border-t border-slate-200 pt-8 text-center">
                  <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
                  <h4 className="text-[28px] font-bold text-slate-900">100% Money-Back Guarantee</h4>
                  <p className="mt-3 text-[18px] text-slate-500">
                    Get refund if not satisfied
                  </p>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-[18px] text-slate-500">Questions?</p>
                  <button className="mt-2 text-[22px] font-medium text-violet-600">
                    Contact Seller
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>

            <h2 className="text-center text-2xl font-bold text-slate-900">
              Order Ready
            </h2>

            <p className="mt-3 text-center text-[18px] text-slate-500">
              Your order details are complete and ready for payment.
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              className="mt-6 w-full rounded-2xl bg-blue-600 px-6 py-4 text-xl font-semibold text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}