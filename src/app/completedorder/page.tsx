"use client";

import { useEffect, useState } from "react";
import {
  Check,
  FileText,
  Star,
  Search,
  LayoutDashboard,
  Handshake,
  Circle,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

const TAGS = [
  "Clear Requirements",
  "Fast Responses",
  "Great Communication",
  "Fair Expectations",
];

// ⭐ Star Component
const StarRow = ({
  count,
  hover,
  onSet,
  onHover,
  onLeave,
  size = 20,
}: {
  count: number;
  hover: number;
  onSet: (v: number) => void;
  onHover: (v: number) => void;
  onLeave: () => void;
  size?: number;
}) => (
  <div className="flex gap-1" onMouseLeave={onLeave}>
    {[1, 2, 3, 4, 5].map((i) => (
      <button
        key={i}
        onClick={() => onSet(i)}
        onMouseEnter={() => onHover(i)}
        className="transition-transform hover:scale-110"
      >
        <Star
          size={size}
          className={
            i <= (hover || count)
              ? "fill-amber-500 text-amber-500"
              : "fill-amber-100 text-amber-200"
          }
        />
      </button>
    ))}
  </div>
);

export default function OrderCompleted() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id;

  const [order, setOrder] = useState<any>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  const [loading, setLoading] = useState(false);

  const [overallRating, setOverallRating] = useState(5);
  const [hoverOverall, setHoverOverall] = useState(0);
  const [commRating, setCommRating] = useState(5);
  const [hoverComm, setHoverComm] = useState(0);
  const [reqRating, setReqRating] = useState(4);
  const [hoverReq, setHoverReq] = useState(0);
  const [recRating, setRecRating] = useState(4);
  const [hoverRec, setHoverRec] = useState(0);

  const [feedback, setFeedback] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 🔥 Fetch Order Data
  // useEffect(() => {
  //   const fetchOrder = async () => {
  //     try {
  //       const res = await fetch(`/api/order/${orderId}`);
  //       const data = await res.json();
  //       setOrder(data);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoadingOrder(false);
  //     }
  //   };

  //   if (orderId) fetchOrder();
  // }, [orderId]);
useEffect(() => {
  const fakeOrder = {
    id: orderId || "ORD-001",
    clientName: "Ahmed Ali",
    deliveryDate: new Date(),
    serviceType: "Web Design",
    revisions: 2,
    status: "Cleared",
    orderValue: 100,
    fee: 10,
    net: 90,
  };

  setTimeout(() => {
    setOrder(fakeOrder);
    setLoadingOrder(false);
  }, 500); // بس شكل loading طبيعي
}, []);
  // 🔁 Toggle Tags
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const set = new Set(prev);
      set.has(tag) ? set.delete(tag) : set.add(tag);
      return Array.from(set);
    });
  };

  // 📤 Submit Review
  const handleSubmit = async () => {
    if (!feedback.trim()) {
      alert("Please write feedback");
      return;
    }

    setLoading(true);

    const reviewData = {
      orderId,
      overallRating,
      commRating,
      reqRating,
      recRating,
      feedback,
      selectedTags,
    };

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!res.ok) throw new Error("Failed");

      alert("Review submitted successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    { label: "Find More Work", icon: Search, path: "/jobs" },
    { label: "Back to Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "New Project", icon: Handshake, path: "/projects/new" },
  ];

  // ⏳ Loading State
  if (loadingOrder) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load order.
      </div>
    );
  }

const statusColor =
  order.status === "Cleared"
    ? "text-green-600"
    : "text-yellow-600";
  return (
    <div className="min-h-screen bg-gray-50 font-sans py-10 px-4">
      {/* Decorative dots */}
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute top-0 left-16 w-3 h-3 rounded-full bg-blue-400 opacity-70" />
        <div className="absolute top-2 right-32 w-2 h-2 rounded-full bg-purple-400 opacity-60" />
        <div className="absolute top-1 right-16 w-4 h-4 rounded-full bg-amber-400 opacity-80" />
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-purple-700 flex items-center justify-center shadow-lg">
                <Check size={28} className="text-white" strokeWidth={3} />
              </div>
            </div>
          </div>
          <h1 className="mt-5 text-3xl font-bold text-gray-900">
            Order Completed! 🎉
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Your delivery has been approved and funds have been cleared.
          </p>
        </div>

        {/* Order Summary + Earnings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* Order Summary */}
          <div className="bg-[#f7f2ff] rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <FileText size={18} className="text-gray-500" />
              <h2 className="font-bold text-gray-800 text-base">Order Summary</h2>
            </div>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-1">Order ID</p>
                <p className="font-medium text-gray-800">{order.id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Client</p>
                <p className="font-medium text-gray-800">{order.clientName  || "—"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Delivery Date</p>
                <p className="font-medium text-gray-800">{order?.deliveryDate
  ? new Date(order.deliveryDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  : "—"}
</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Service Type</p>
                <p className="font-medium text-gray-800">{order.serviceType || "—"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Revisions Used</p>
                <p className="font-medium text-gray-800">{order.revisions || "—"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Status</p>
                <div className="flex items-center gap-1.5">
                <Circle size={8} className="fill-green-500 text-green-500" />
<span className={`font-medium ${statusColor}`}>
  {order.status}
</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Earnings */}
         <div className="bg-purple-700 rounded-2xl shadow-sm p-6 text-white">
  <p className="text-purple-200 text-sm mb-1">Total Earnings</p>

  <p className="text-4xl font-bold mb-5">
  ${(order?.net ?? 0).toFixed(2)}
  </p>

  <div className="bg-purple-600/50 rounded-xl p-4 space-y-3">

    {/* Order Value */}
    <div className="flex justify-between text-sm">
      <span className="text-purple-200">Order Value</span>
      <span className="font-medium">
  ${(order?.orderValue ?? 0).toFixed(2)}
      </span>
    </div>

    <hr className="border-purple-500/40" />

    {/* Fee */}
    <div className="flex justify-between text-sm">
      <span className="text-purple-200">Platform Fee</span>
      <span className="font-medium text-red-300">
  -${(order?.fee ?? 0).toFixed(2)}
   </span>
    </div>

    <hr className="border-purple-500/40" />

    {/* Net */}
    <div className="flex justify-between text-sm">
      <span className="text-purple-200">Net Cleared</span>
      <span className="font-bold">
  ${(order?.net ?? 0).toFixed(2)}
      </span>
    </div>


            </div>
          </div>
        </div>

        {/* Rate Your Experience */}
        <div className="bg-[#f7f2ff] rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-800 text-base">Rate Your Experience</h2>
            <StarRow
              count={overallRating}
              hover={hoverOverall}
              onSet={setOverallRating}
              onHover={setHoverOverall}
              onLeave={() => setHoverOverall(0)}
              size={22}
            />
          </div>

          {/* Sub-ratings */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "COMMUNICATION", count: commRating, hover: hoverComm, set: setCommRating, setHover: setHoverComm, clearHover: () => setHoverComm(0) },
              { label: "REQUIREMENT QUALITY", count: reqRating, hover: hoverReq, set: setReqRating, setHover: setHoverReq, clearHover: () => setHoverReq(0) },
              { label: "WOULD RECOMMEND", count: recRating, hover: hoverRec, set: setRecRating, setHover: setHoverRec, clearHover: () => setHoverRec(0) },
            ].map(({ label, count, hover, set, setHover, clearHover }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 font-semibold tracking-wide mb-2">{label}</p>
                <StarRow count={count} hover={hover} onSet={set} onHover={setHover} onLeave={clearHover} size={18} />
              </div>
            ))}
          </div>

          {/* Public Feedback */}
          <div className="mb-5">
            <p className="font-semibold text-gray-700 text-sm mb-2">Public Feedback</p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition"
            />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <p className="font-semibold text-gray-700 text-sm mb-3">Tags</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-purple-700 text-white border-purple-700"
                      : "bg-white text-gray-600 border-gray-300 hover:border-purple-400"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

            {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
className="mt-6 w-full bg-purple-700 text-white py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"          >
{loading ? "Submitting..." : "Submit Review"}          </button>
        
          </div>
       
    
         <div className=" space-y-6">

      {/* Title */}
      <h2 className="text-xl font-bold text-center text-gray-800">
        What's Next?
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
<button
  key={item.label}
  onClick={() => router.push(item.path)}
  className="group bg-[#f7f2ff] border border-gray-100 hover:border-purple-300 rounded-2xl p-5 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-all"
>
  <div className="w-10 h-10 rounded-xl bg-gray-200 group-hover:bg-purple-500 flex items-center justify-center transition">
    <Icon size={20} className="text-gray-600 group-hover:text-white transition" />
  </div>

  <span className="text-sm text-gray-700 font-medium text-center group-hover:text-purple-700 transition">
    {item.label}
  </span>
</button>
          );
        })}
      </div>
    </div>
    </div></div>
  );
}
