import { useState, useCallback } from "react";
import { z } from "zod";

// ─── Schema ────────────────────────────────────────────────────────────────────
export const reviewSchema = z.object({
  overallRating: z.number().min(1).max(5),
  detailedRatings: z.object({
    communication: z.number().min(1).max(5),
    qualityOfWork: z.number().min(1).max(5),
    deliveryTime: z.number().min(1).max(5),
    valueForMoney: z.number().min(1).max(5),
    professionalism: z.number().min(1).max(5),
  }),
  review: z.string().min(10, "Review too short").max(1000),
  tags: z.array(z.string()),
  tip: z.union([z.number(), z.string()]).optional(),
});

// ─── Types ─────────────────────────────────────────────────────────────────────
type DetailedRatingsKey = "communication" | "qualityOfWork" | "deliveryTime" | "valueForMoney" | "professionalism";

type DetailedRatings = Record<DetailedRatingsKey, number>;

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const TAGS = ["Great communication", "Fast delivery", "Creative design", "Went above and beyond"];
const RATING_LABELS: Record<number, string> = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Very Good", 5: "Excellent!" };

const INITIAL_STATE = {
  overallRating: 5,
  detailedRatings: {
    communication: 5,
    qualityOfWork: 4,
    deliveryTime: 5,
    valueForMoney: 5,
    professionalism: 5,
  } as DetailedRatings,
  review:
    "Ahmed was incredible to work with. He understood my brand vision immediately and delivered a modern, sleek logo that exceeded my expectations. His communication was excellent throughout the process.",
  selectedTags: ["Great communication", "Fast delivery"],
  tip: 10 as number | null,
  customTip: "",
};

// ─── StarRating ────────────────────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: "sm" | "md" | "lg";
}) {
  const [hovered, setHovered] = useState(0);
  const sz = size === "lg" ? "w-10 h-10" : size === "md" ? "w-6 h-6" : "w-5 h-5";

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
        >
          <svg
            className={`${sz} ${(hovered || value) >= star ? "text-yellow-400" : "text-gray-200"} transition-colors`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 transition-all ${
            t.type === "success"
              ? "bg-green-600 text-white"
              : t.type === "error"
              ? "bg-red-600 text-white"
              : "bg-gray-800 text-white"
          }`}
        >
          {t.type === "success" && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {t.type === "error" && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── SuccessScreen ─────────────────────────────────────────────────────────────
function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md w-full mx-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Submitted!</h2>
        <p className="text-gray-500 text-sm mb-8">
          Thank you for your feedback. Your review helps Ahmed and others in the FreelanceFlow community.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onReset}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Leave Another Review
          </button>
          <button className="px-6 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors shadow-sm">
            Back to Orders
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function LeaveReview() {
  const [overallRating, setOverallRating] = useState<number>(INITIAL_STATE.overallRating);
  const [detailedRatings, setDetailedRatings] = useState<DetailedRatings>(INITIAL_STATE.detailedRatings);
  const [review, setReview] = useState<string>(INITIAL_STATE.review);
  const [selectedTags, setSelectedTags] = useState<string[]>(INITIAL_STATE.selectedTags);
  const [tip, setTip] = useState<number | null>(INITIAL_STATE.tip);
  const [customTip, setCustomTip] = useState<string>(INITIAL_STATE.customTip);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // ── Toast helper ──────────────────────────────────────────────────────────
  const addToast = useCallback((message: string, type: ToastItem["type"] = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  // ── Rating helpers ────────────────────────────────────────────────────────
  const setDetailedRating = (key: DetailedRatingsKey, val: number) =>
    setDetailedRatings((prev) => ({ ...prev, [key]: val }));

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  // ── File helpers ──────────────────────────────────────────────────────────
  const validateFile = (f: File): string | null => {
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(f.type)) return "Invalid file type. Use PNG, JPG, or PDF.";
    if (f.size > 10 * 1024 * 1024) return "File too large. Max size is 10MB.";
    return null;
  };

  const addFiles = (incoming: File[]) => {
    const newFiles: File[] = [];
    let errCount = 0;
    for (const f of incoming) {
      const err = validateFile(f);
      if (err) { errCount++; continue; }
      // Deduplicate by name + size
      if (files.some((ex) => ex.name === f.name && ex.size === f.size)) continue;
      newFiles.push(f);
    }
    if (errCount) addToast(`${errCount} file(s) skipped — invalid type or too large.`, "error");
    if (newFiles.length) {
      setFiles((prev) => [...prev, ...newFiles]);
      addToast(`${newFiles.length} file(s) attached successfully`, "success");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    addFiles(Array.from(e.target.files));
    e.target.value = ""; // reset so same file can be re-added after removal
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer.files?.length) return;
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): string | null => {
    if (!overallRating) return "Please select an overall rating.";
    if (review.trim().length < 10) return "Review is too short (minimum 10 characters).";
    if (customTip && isNaN(Number(customTip))) return "Custom tip must be a valid number.";
    const tipValue = tip ?? (customTip ? Number(customTip) : undefined);
    if (tipValue !== undefined && tipValue < 0) return "Tip cannot be negative.";
    return null;
  };

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setOverallRating(INITIAL_STATE.overallRating);
    setDetailedRatings(INITIAL_STATE.detailedRatings);
    setReview(INITIAL_STATE.review);
    setSelectedTags(INITIAL_STATE.selectedTags);
    setTip(INITIAL_STATE.tip);
    setCustomTip(INITIAL_STATE.customTip);
    setFiles([]);
    setSubmitted(false);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const err = validate();
    if (err) { addToast(err, "error"); return; }

    const payload = {
      overallRating,
      detailedRatings,
      review,
      tags: selectedTags,
      tip: tip ?? (customTip ? Number(customTip) : undefined),
    };

    // Zod validation
    const parsed = reviewSchema.safeParse(payload);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid input";
      addToast(firstError, "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        addToast("Something went wrong ❌", "error");
      }
    } catch {
      addToast("Error submitting ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── AI Improve ────────────────────────────────────────────────────────────
  const handleImproveWithAI = async () => {
    if (review.trim().length < 5) {
      addToast("Write at least a few words before improving with AI.", "error");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are a helpful assistant. Improve the following freelancer review to make it more detailed, genuine, and helpful for other buyers. Keep the same overall sentiment (${RATING_LABELS[overallRating] || "positive"}). Return ONLY the improved review text, nothing else.\n\nOriginal review:\n${review}`,
            },
          ],
        }),
      });
      const data = await res.json();
      const improved: string | undefined = data?.content?.[0]?.text?.trim();
      if (improved) {
        setReview(improved.slice(0, 1000));
        addToast("Review improved with AI!", "success");
      } else {
        addToast("AI improvement failed. Try again.", "error");
      }
    } catch {
      addToast("Could not reach AI service.", "error");
    } finally {
      setAiLoading(false);
    }
  };

  // ── File icon helper ──────────────────────────────────────────────────────
  const getFileIcon = (file: File) => {
    if (file.type === "application/pdf") {
      return (
        <div className="w-7 h-7 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-7 h-7 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (submitted) return <SuccessScreen onReset={handleReset} />;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Toast toasts={toasts} />

     

      <div className="max-w-9xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <a href="#" className="hover:text-purple-600">Home</a>
          <span>›</span>
          <a href="#" className="hover:text-purple-600">Orders</a>
          <span>›</span>
          <a href="#" className="hover:text-purple-600">Order #2024-0091</a>
          <span>›</span>
          <span className="text-gray-800">Leave Review</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Share Your Experience</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Main Content ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Order Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-gray-800 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  AS
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">I will design a modern logo for your brand</p>
                  <p className="text-sm text-gray-500">Ahmed Saleh</p>
                  <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Completed
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Delivered On: Oct 24, 2024
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Duration: 4 Days
                    </span>
                  </div>
                </div>
                <div className="text-xl font-bold text-gray-900">$313.50</div>
              </div>
            </div>

            {/* Overall Rating */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="font-semibold text-gray-900 mb-4">How would you rate this delivery?</p>
              <div className="flex justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  >
                    <svg
                      className={`w-10 h-10 transition-colors ${overallRating >= star ? "text-yellow-400" : "text-gray-200"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              {overallRating > 0 && (
                <p className="text-green-500 font-semibold text-sm">{RATING_LABELS[overallRating]}</p>
              )}
            </div>

            {/* Detailed Ratings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Detailed Ratings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(
                  [
                    { label: "Communication", key: "communication" },
                    { label: "Quality of Work", key: "qualityOfWork" },
                    { label: "Delivery Time", key: "deliveryTime" },
                    { label: "Value for Money", key: "valueForMoney" },
                    { label: "Professionalism", key: "professionalism" },
                  ] as { label: string; key: DetailedRatingsKey }[]
                ).map(({ label, key }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 w-36">{label}</span>
                    <StarRating
                      value={detailedRatings[key]}
                      onChange={(v) => setDetailedRating(key, v)}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Write your review</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{review.length} / 1000</span>
                  <button
                    type="button"
                    onClick={handleImproveWithAI}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-medium hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiLoading ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Improving...
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Improve with AI
                      </>
                    )}
                  </button>
                </div>
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value.slice(0, 1000))}
                rows={4}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                placeholder="Share your experience..."
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95 ${
                      selectedTags.includes(tag)
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-600 border-gray-300 hover:border-purple-400"
                    }`}
                  >
                    {selectedTags.includes(tag) && <span className="mr-1">✓</span>}
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Attach Work Samples — multi-file upload */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900">
                Attach Work Samples{" "}
                <span className="text-gray-400 font-normal text-sm">(Optional)</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 mb-4">
                Share the final delivery to show others the quality of work.
              </p>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                  isDragging ? "border-purple-400 bg-purple-50" : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileUpload"
                  accept=".png,.jpg,.jpeg,.pdf"
                  multiple
                />
                <label htmlFor="fileUpload" className="cursor-pointer block">
                  <svg
                    className={`w-8 h-8 mx-auto mb-2 transition-colors ${isDragging ? "text-purple-500" : "text-purple-400"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 10MB — multiple files allowed</p>
                </label>
              </div>

              {/* Attached files list */}
              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${file.size}-${index}`}
                      className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {getFileIcon(file)}
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
                          <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-3 flex-shrink-0"
                        aria-label={`Remove ${file.name}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Tip */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">💛</span>
                <h3 className="font-semibold text-gray-900">Leave a Tip</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">Show extra appreciation for a job well done.</p>
              <div className="flex flex-wrap gap-2 items-center">
                {[5, 10, 15, 20].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => { setTip(amount); setCustomTip(""); }}
                    className={`px-5 py-2 rounded-lg border text-sm font-medium transition-all active:scale-95 ${
                      tip === amount
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-purple-400"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { setTip(null); setCustomTip(""); }}
                  className={`px-5 py-2 rounded-lg border text-sm font-medium transition-all active:scale-95 ${
                    tip === null && customTip === ""
                      ? "bg-gray-100 text-gray-700 border-gray-400"
                      : "bg-white text-gray-500 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  No tip
                </button>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="Custom"
                    value={customTip}
                    onChange={(e) => { setCustomTip(e.target.value); setTip(null); }}
                    className="pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 w-28"
                  />
                </div>
              </div>
              {(tip !== null || customTip) && (
                <p className="text-xs text-purple-600 font-medium mt-3">
                  You're tipping ${tip ?? customTip} 🎉
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 pb-8">
              <button
                type="button"
                onClick={handleReset}
                className="px-8 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-all shadow-sm disabled:opacity-50 active:scale-95 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Freelancer Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                AS
              </div>
              <h3 className="font-semibold text-gray-900">Ahmed Saleh</h3>
              <p className="text-sm text-gray-500 mb-4">Professional Logo Designer</p>
              <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-xs text-gray-400">Orders Completed</p>
                  <p className="font-bold text-gray-900">1,245</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Avg. Rating</p>
                  <p className="font-bold text-gray-900 flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    4.9
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Member Since</p>
                  <p className="font-bold text-gray-900">2021</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Response Time</p>
                  <p className="font-bold text-gray-900">~1 Hour</p>
                </div>
              </div>
            </div>

            {/* Live Review Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Review Preview</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg
                      key={s}
                      className={`w-3.5 h-3.5 ${overallRating >= s ? "text-yellow-400" : "text-gray-200"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-500 ml-1">{RATING_LABELS[overallRating]}</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-3">{review || "Your review will appear here..."}</p>
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedTags.map((t) => (
                      <span key={t} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Review Guidelines */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">Review Guidelines</h3>
              </div>
              <ul className="space-y-2">
                {[
                  "Be honest and objective about your experience.",
                  "Focus on the quality of work and communication.",
                  "Do not share personal or confidential information.",
                  "Reviews cannot be edited once submitted.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Your Review Matters */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Your Review Matters</h3>
              <p className="text-xs text-gray-500 mb-3">
                Your feedback helps maintain a high-quality community and directly impacts freelancer success.
              </p>
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-xs text-purple-700 font-medium">92% of clients read reviews before hiring.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
