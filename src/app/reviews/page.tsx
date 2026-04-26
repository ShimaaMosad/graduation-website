"use client";
import { useState } from "react";
import LeaveReview from "./leave-review/page";
import MyReviews from "./my-reviews/page";

export default function reviews() {
  const [page, setPage] = useState<"leave-review" | "my-reviews">("leave-review");

  return (
    <div>
      {/* Dev nav to switch pages */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setPage("leave-review")}
          className={`px-4 py-2 rounded-full text-xs font-semibold shadow-lg transition-colors ${
            page === "leave-review" ? "bg-purple-600 text-white" : "bg-white text-gray-700 border border-gray-300"
          }`}
        >
          Leave Review
        </button>
        <button
          onClick={() => setPage("my-reviews")}
          className={`px-4 py-2 rounded-full text-xs font-semibold shadow-lg transition-colors ${
            page === "my-reviews" ? "bg-purple-600 text-white" : "bg-white text-gray-700 border border-gray-300"
          }`}
        >
          My Reviews
        </button>
      </div>

      {page === "leave-review" ? <LeaveReview /> : <MyReviews />}
    </div>
  );
}
