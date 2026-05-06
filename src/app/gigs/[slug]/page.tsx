"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageSquare,
  Share2,
  ShieldCheck,
  Star,
  ThumbsUp,
} from "lucide-react";
import { buildOrderQuery, getGigBySlug, GigPackageName, GigReview }from "../../../lib/gigs-api";


type ReviewSort = "Most Recent" | "Highest Rating";

export default function GigDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug);
  const gig = getGigBySlug(slug);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<GigPackageName>("Standard");
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const [reviewSort, setReviewSort] = useState<ReviewSort>("Most Recent");
  const [helpfulCounts, setHelpfulCounts] = useState<Record<number, number>>(
    Object.fromEntries((gig?.reviews || []).map((review) => [review.id, review.helpfulCount]))
  );
  const [isLiked, setIsLiked] = useState(false);

  if (!gig) {
    return (
      <main className="min-h-screen bg-[#f5f6f8]">
        <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-4xl font-bold text-slate-900">Gig not found</h1>
            <Link href="/gigs" className="mt-4 inline-block text-xl text-blue-500">
              Back to gigs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const selectedPackageData =
    gig.packages.find((pkg) => pkg.name === selectedPackage) || gig.packages[0];

  const extrasTotal = gig.extras
    .filter((extra) => selectedExtras.includes(extra.id))
    .reduce((sum, extra) => sum + extra.price, 0);

  const total = selectedPackageData.price * quantity + extrasTotal;

  const sortedReviews = useMemo(() => {
    const list = [...gig.reviews];
    if (reviewSort === "Highest Rating") {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [gig.reviews, reviewSort]);

  const ratingBreakdown = useMemo(() => {
    return {
      5: gig.reviews.filter((r) => r.rating >= 5).length,
      4: gig.reviews.filter((r) => r.rating >= 4 && r.rating < 5).length,
      3: gig.reviews.filter((r) => r.rating >= 3 && r.rating < 4).length,
      2: gig.reviews.filter((r) => r.rating >= 2 && r.rating < 3).length,
      1: gig.reviews.filter((r) => r.rating < 2).length,
    };
  }, [gig.reviews]);

  const totalReviewsCount = gig.reviews.length || 1;

  const toggleExtra = (extraId: number) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId]
    );
  };

  const handleHelpful = (reviewId: number) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  const handleContinue = () => {
    const query = buildOrderQuery({
      packageName: selectedPackageData.name,
      quantity,
      extraIds: selectedExtras,
    });

    router.push(`/gigs/${gig.slug}/order?${query}`);
  };

  const handleContactSeller = () => {
    alert(`Opening chat with ${gig.sellerName}`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert("Gig link copied successfully");
    } catch {
      alert("Unable to copy link");
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === gig.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? gig.gallery.length - 1 : prev - 1
    );
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < full ? "fill-amber-400 text-amber-400" : "text-amber-400"}`}
          />
        ))}
      </div>
    );
  };

  const renderReview = (review: GigReview) => (
    <div key={review.id} className="border-t border-slate-200 py-8 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <img
            src={review.avatar}
            alt={review.reviewer}
            className="h-14 w-14 rounded-full object-cover"
          />
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-[20px] font-bold text-slate-900">{review.reviewer}</h3>
              <span className="text-[16px] font-medium text-slate-500">{review.country}</span>
            </div>

            <div className="mt-2 flex items-center gap-3">
              {renderStars(review.rating)}
              <span className="text-[20px] font-semibold text-slate-900">{review.rating}</span>
            </div>
          </div>
        </div>

        <span className="text-[18px] text-slate-400">{review.timeAgo}</span>
      </div>

      <p className="mt-5 text-[20px] leading-9 text-slate-700">{review.text}</p>

      <button
        onClick={() => handleHelpful(review.id)}
        className="mt-5 inline-flex items-center gap-2 text-[18px] text-slate-600"
      >
        <ThumbsUp className="h-5 w-5" />
        Helpful ({helpfulCounts[review.id] || 0})
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f5f6f8]">

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-8">
          <div className="flex flex-wrap items-center gap-3 text-[18px] text-slate-500">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/gigs" className="hover:text-slate-900">Services</Link>
            <ChevronRight className="h-4 w-4" />
            <span>{gig.category}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-slate-900">{gig.title}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-10 md:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.8fr_0.95fr]">
          <div className="space-y-8">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="relative overflow-hidden rounded-[28px]">
                <img
                  src={gig.gallery[selectedImageIndex]}
                  alt={gig.title}
                  className="h-[560px] w-full object-cover"
                />

                {gig.gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white p-4 shadow"
                    >
                      <ChevronLeft className="h-8 w-8" />
                    </button>

                    <button
                      onClick={nextImage}
                      className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white p-4 shadow"
                    >
                      <ChevronRight className="h-8 w-8" />
                    </button>
                  </>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {gig.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`overflow-hidden rounded-[18px] border-2 ${
                      selectedImageIndex === index ? "border-violet-600" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`thumb-${index}`}
                      className="h-24 w-44 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-[28px] font-bold text-slate-900">About This Gig</h2>

              <div className="space-y-8">
                {gig.about.map((paragraph, index) => (
                  <p key={index} className="text-[20px] leading-10 text-slate-700">
                    {paragraph}
                  </p>
                ))}
              </div>

              <h3 className="mt-10 text-[28px] font-bold text-slate-900">What You'll Get</h3>
              <div className="mt-6 space-y-4">
                {gig.whatYouWillGet.map((item) => (
                  <div key={item} className="flex items-center gap-4 text-[18px] text-slate-800">
                    <Check className="h-5 w-5 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <h3 className="mt-10 text-[28px] font-bold text-slate-900">Skills & Expertise</h3>
              <div className="mt-6 flex flex-wrap gap-3">
                {gig.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-violet-100 px-4 py-2 text-[18px] font-medium text-violet-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <img
                  src={gig.sellerAvatar}
                  alt={gig.sellerName}
                  className="h-28 w-28 rounded-full object-cover"
                />

                <div className="flex-1">
                  <h2 className="text-[36px] font-bold text-slate-900">{gig.sellerName}</h2>

                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-white">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[16px] font-semibold">AI Verified</span>
                  </div>

                  <p className="mt-4 text-[22px] text-slate-600">{gig.sellerTitle}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {renderStars(gig.rating)}
                    <span className="text-[20px] font-bold text-slate-900">{gig.rating}</span>
                    <span className="text-[20px] text-slate-500">({gig.reviewsCount} reviews)</span>
                  </div>

                  <p className="mt-3 text-[18px] text-slate-500">
                    Avg. response time: {gig.sellerStats.avgResponse}
                  </p>

                  <div className="mt-8 grid gap-8 md:grid-cols-2">
                    <div>
                      <div className="text-[28px] font-bold text-slate-900">{gig.sellerStats.completed}</div>
                      <div className="text-[18px] text-slate-500">Completed</div>
                    </div>
                    <div>
                      <div className="text-[28px] font-bold text-slate-900">{gig.sellerStats.ratingText}</div>
                      <div className="text-[18px] text-slate-500">Rating</div>
                    </div>
                  </div>

                  <p className="mt-8 text-[20px] leading-9 text-slate-700">{gig.sellerBio}</p>

                  <div className="mt-8">
                    <Link
                      href={`/freelancers/${gig.sellerId}`}
                      className="rounded-2xl border-2 border-violet-600 px-8 py-4 text-2xl font-semibold text-violet-600"
                    >
                      View Full Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-[28px] font-bold text-slate-900">
                  Reviews ({gig.reviewsCount})
                </h2>

                <div className="relative w-full md:w-[200px]">
                  <select
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value as ReviewSort)}
                    className="w-full rounded-2xl bg-slate-100 px-5 py-4 pr-12 text-[18px] outline-none"
                  >
                    <option>Most Recent</option>
                    <option>Highest Rating</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              <div className="mb-10 grid gap-8 lg:grid-cols-[240px_1fr]">
                <div className="text-center">
                  <div className="text-[72px] font-bold text-slate-900">{gig.rating}</div>
                  <div className="mt-3 flex justify-center">{renderStars(gig.rating)}</div>
                  <div className="mt-3 text-[18px] text-slate-500">
                    Based on {gig.reviewsCount} reviews
                  </div>
                </div>

                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingBreakdown[star as 1 | 2 | 3 | 4 | 5];
                    const width = `${(count / totalReviewsCount) * 100}%`;

                    return (
                      <div key={star} className="grid grid-cols-[40px_1fr_40px] items-center gap-4">
                        <span className="text-[18px]">{star}★</span>
                        <div className="h-3 rounded-full bg-slate-200">
                          <div
                            className="h-3 rounded-full bg-violet-600"
                            style={{ width }}
                          />
                        </div>
                        <span className="text-[18px] text-slate-600">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                {sortedReviews.length > 0 ? (
                  sortedReviews.map(renderReview)
                ) : (
                  <div className="text-[20px] text-slate-500">No reviews yet.</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="sticky top-28 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-8 flex rounded-full bg-slate-100 p-2">
                {gig.packages.map((pkg) => {
                  const active = selectedPackage === pkg.name;
                  return (
                    <button
                      key={pkg.name}
                      onClick={() => setSelectedPackage(pkg.name)}
                      className={`flex-1 rounded-full px-6 py-3 text-[22px] font-semibold ${
                        active ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                      }`}
                    >
                      {pkg.name}
                    </button>
                  );
                })}
              </div>

              <h2 className="text-[34px] font-bold text-slate-900">
                {selectedPackageData.title}
              </h2>
              <p className="mt-3 text-[20px] text-slate-600">{selectedPackageData.description}</p>

              <p className="mt-8 text-[64px] font-bold text-slate-900">
                ${selectedPackageData.price}
              </p>

              <div className="mt-6 grid gap-5 text-[18px] text-slate-800">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500" />
                  <span>{selectedPackageData.deliveryDays} Days Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500" />
                  <span>{selectedPackageData.revisions} Revisions</span>
                </div>

                {selectedPackageData.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <label className="mb-3 block text-[20px] font-semibold text-slate-900">
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full rounded-2xl bg-slate-100 px-5 py-4 text-[22px] outline-none"
                />
              </div>

              <div className="mt-8 space-y-4">
                {gig.extras.map((extra) => (
                  <label key={extra.id} className="flex items-center gap-3 text-[18px] text-slate-900">
                    <input
                      type="checkbox"
                      checked={selectedExtras.includes(extra.id)}
                      onChange={() => toggleExtra(extra.id)}
                      className="h-5 w-5"
                    />
                    <span>
                      {extra.label} (+${extra.price})
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-10 border-t border-slate-200 pt-6">
                <div className="mb-6 flex items-center justify-between text-[26px] font-bold text-slate-900">
                  <span>Total:</span>
                  <span>${total}</span>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 to-blue-500 px-8 py-5 text-2xl font-semibold text-white"
                >
                  Continue (${total})
                </button>

                <button
                  onClick={handleContactSeller}
                  className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-violet-500 px-8 py-5 text-2xl font-semibold text-violet-600"
                >
                  <MessageSquare className="h-6 w-6" />
                  Contact Seller
                </button>

                <p className="mt-4 text-center text-[18px] text-slate-500">
                  Usually responds in {gig.sellerStats.avgResponse}
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-8 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="mb-5 h-16 w-16 text-emerald-500" />
                <h3 className="text-[32px] font-bold text-slate-900">Safe & Secure</h3>
                <p className="mt-4 text-[20px] leading-9 text-slate-700">
                  Your payment is protected. Only release funds when you're fully satisfied.
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-center text-[28px] font-bold text-slate-900">Share this gig</h3>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleShare}
                  className="rounded-full bg-slate-100 p-4"
                >
                  <Share2 className="h-7 w-7 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <button
                onClick={() => setIsLiked((prev) => !prev)}
                className="flex w-full items-center justify-center gap-3 text-[20px] font-semibold text-slate-700"
              >
                <Heart className={`h-6 w-6 ${isLiked ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} />
                {isLiked ? "Saved to favorites" : "Save this gig"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}