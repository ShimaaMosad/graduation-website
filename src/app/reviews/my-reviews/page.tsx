"use client";
import { useState, useMemo } from "react";
import {
  Star, CreditCard, BarChart2, Settings, HelpCircle, LogOut,
  Plus, Search, Share2, ThumbsUp, Reply, Edit2, Paperclip, Flag, Trash2,
  Bell, Check, LayoutDashboard, X, Loader2, Sparkles,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SubRatings = {
  communication: number;
  quality: number;
  speed: number;
  value: number;
};

type Review = {
  id: string;
  name: string;
  initials: string;
  rating: number;
  date: string;
  dateObj: Date;
  text: string;
  tags: string[];
  attachment?: string;
  reply: null | { text: string; date: string };
  pendingReply: boolean;
  helpful: number;
  helpfulClicked: boolean;
  avatarColor: string;
  menuOpen: boolean;
  subRatings: SubRatings;
};

type TemplateName = "Thank You (5★)" | "Constructive (3★)" | "Apology (1-2★)";

// ─── Static Data ──────────────────────────────────────────────────────────────

const initialReviews: Review[] = [
  {
    id: "1", name: "Sarah Johnson", initials: "SJ", rating: 5,
    date: "April 15, 2024", dateObj: new Date("2024-04-15"),
    text: "Exceptional work! Ahmed delivered the project ahead of schedule and the code quality was top-notch. Communication was clear throughout the entire process. Highly recommend for any complex web application needs.",
    tags: ["Web Development", "React", "On-time"],
    attachment: "project-requirements-v2.pdf",
    reply: { text: "Thank you so much Sarah! It was a pleasure working on this project with you. I appreciate the clear requirements and prompt feedback.", date: "April 16, 2024" },
    pendingReply: false, helpful: 4, helpfulClicked: false,
    avatarColor: "bg-teal-500", menuOpen: false,
    subRatings: { communication: 5, quality: 5, speed: 5, value: 5 },
  },
  {
    id: "2", name: "Mark Thompson", initials: "MT", rating: 4,
    date: "February 10, 2024", dateObj: new Date("2024-02-10"),
    text: "Solid work overall. The final deliverable met most of our expectations. There were a few minor bugs in the initial handover, but they were resolved quickly after I pointed them out. Good communication.",
    tags: [], reply: null, pendingReply: false, helpful: 1, helpfulClicked: false,
    avatarColor: "bg-gray-600", menuOpen: false,
    subRatings: { communication: 4, quality: 4, speed: 4, value: 4 },
  },
  {
    id: "3", name: "Carlos Rivera", initials: "CR", rating: 3,
    date: "November 2, 2023", dateObj: new Date("2023-11-02"),
    text: "The design work was okay, but it took longer than initially estimated. I felt like some of my feedback was missed in the second revision. We eventually got there, but the process could have been smoother.",
    tags: [], reply: null, pendingReply: true, helpful: 0, helpfulClicked: false,
    avatarColor: "bg-blue-600", menuOpen: false,
    subRatings: { communication: 3, quality: 3, speed: 2, value: 3 },
  },
  {
    id: "4", name: "Lena Fischer", initials: "LF", rating: 5,
    date: "January 22, 2024", dateObj: new Date("2024-01-22"),
    text: "Absolutely fantastic experience! Ahmed went above and beyond to ensure the project was delivered perfectly. The attention to detail was remarkable and the end product exceeded all our expectations.",
    tags: ["UI/UX", "Mobile", "Excellent Quality"],
    reply: null, pendingReply: false, helpful: 7, helpfulClicked: false,
    avatarColor: "bg-rose-500", menuOpen: false,
    subRatings: { communication: 5, quality: 5, speed: 5, value: 5 },
  },
  {
    id: "5", name: "James Okafor", initials: "JO", rating: 5,
    date: "March 15, 2024", dateObj: new Date("2024-03-15"),
    text: "Second time working with Ahmed and it keeps getting better. He understood the brief immediately and delivered clean, well-documented code. Will definitely hire again for future projects.",
    tags: ["Backend", "API", "Repeat Client"],
    reply: { text: "James, it's always a pleasure working with you! Looking forward to the next project.", date: "March 16, 2024" },
    pendingReply: false, helpful: 3, helpfulClicked: false,
    avatarColor: "bg-amber-500", menuOpen: false,
    subRatings: { communication: 5, quality: 5, speed: 4, value: 5 },
  },
  {
    id: "6", name: "Priya Nair", initials: "PN", rating: 2,
    date: "September 5, 2023", dateObj: new Date("2023-09-05"),
    text: "The work was below expectations. Several features didn't function as discussed, and revisions took too long. Communication could also be improved significantly.",
    tags: [], reply: null, pendingReply: true, helpful: 0, helpfulClicked: false,
    avatarColor: "bg-violet-600", menuOpen: false,
    subRatings: { communication: 2, quality: 2, speed: 1, value: 2 },
  },
  {
    id: "7", name: "Tom Hartley", initials: "TH", rating: 5,
    date: "December 28, 2023", dateObj: new Date("2023-12-28"),
    text: "Outstanding freelancer! Delivered a complex e-commerce solution with pixel-perfect design. Proactive communication and zero revisions needed on the final delivery.",
    tags: ["E-Commerce", "Full Stack"],
    reply: null, pendingReply: false, helpful: 5, helpfulClicked: false,
    avatarColor: "bg-cyan-600", menuOpen: false,
    subRatings: { communication: 5, quality: 5, speed: 5, value: 5 },
  },
  {
    id: "8", name: "Aisha Malik", initials: "AM", rating: 4,
    date: "October 20, 2023", dateObj: new Date("2023-10-20"),
    text: "Very professional and skilled. Minor delays due to scope changes but overall a positive experience. Would recommend for frontend development work.",
    tags: ["Frontend", "Vue.js"],
    reply: null, pendingReply: false, helpful: 2, helpfulClicked: false,
    avatarColor: "bg-emerald-600", menuOpen: false,
    subRatings: { communication: 4, quality: 4, speed: 3, value: 4 },
  },
  {
    id: "9", name: "Daniel Wu", initials: "DW", rating: 5,
    date: "July 8, 2023", dateObj: new Date("2023-07-08"),
    text: "Ahmed is one of the best freelancers I've worked with. The project was delivered flawlessly, and I was especially impressed by his initiative in suggesting improvements I hadn't even considered.",
    tags: ["Full Stack", "Node.js"],
    reply: { text: "Thank you Daniel! Your project was a great challenge. Happy we could deliver beyond expectations.", date: "July 9, 2023" },
    pendingReply: false, helpful: 9, helpfulClicked: false,
    avatarColor: "bg-sky-600", menuOpen: false,
    subRatings: { communication: 5, quality: 5, speed: 5, value: 5 },
  },
  {
    id: "10", name: "Sophie Laurent", initials: "SL", rating: 4,
    date: "May 14, 2023", dateObj: new Date("2023-05-14"),
    text: "Great experience overall. The design was clean and modern. A couple of iterations were needed but Ahmed was very receptive to feedback and made changes quickly.",
    tags: ["UI/UX", "Figma"],
    reply: null, pendingReply: false, helpful: 6, helpfulClicked: false,
    avatarColor: "bg-pink-500", menuOpen: false,
    subRatings: { communication: 4, quality: 5, speed: 4, value: 4 },
  },
  {
    id: "11", name: "Omar Khalid", initials: "OK", rating: 1,
    date: "March 3, 2023", dateObj: new Date("2023-03-03"),
    text: "Very disappointing. The project was delivered two weeks late with incomplete features. I had to hire someone else to finish the work. Would not recommend.",
    tags: [], reply: null, pendingReply: true, helpful: 0, helpfulClicked: false,
    avatarColor: "bg-red-600", menuOpen: false,
    subRatings: { communication: 1, quality: 1, speed: 1, value: 1 },
  },
  {
    id: "12", name: "Nina Petrov", initials: "NP", rating: 5,
    date: "January 30, 2023", dateObj: new Date("2023-01-30"),
    text: "Incredible work. Built our SaaS dashboard from scratch in record time. The code is clean, well-documented, and scalable. Already planning the next project with Ahmed.",
    tags: ["SaaS", "Dashboard", "React"],
    reply: { text: "Nina, working on your SaaS platform was a highlight! Can't wait to tackle phase 2 together.", date: "January 31, 2023" },
    pendingReply: false, helpful: 11, helpfulClicked: false,
    avatarColor: "bg-indigo-500", menuOpen: false,
    subRatings: { communication: 5, quality: 5, speed: 5, value: 5 },
  },
];

const KEYWORDS = [
  { label: "fast delivery", count: 24, color: "bg-purple-100 text-purple-700" },
  { label: "great communication", count: 18, color: "bg-gray-100 text-gray-700" },
  { label: "high quality", count: 15, color: "bg-gray-100 text-gray-700" },
  { label: "professional", count: 12, color: "bg-gray-100 text-gray-700" },
  { label: "exceeded expectations", count: 9, color: "bg-gray-100 text-gray-700" },
  { label: "bugs", count: 3, color: "bg-gray-100 text-gray-700" },
  { label: "creative", count: 7, color: "bg-gray-100 text-gray-700" },
];

// ─── StarsDisplay ─────────────────────────────────────────────────────────────

function StarsDisplay({ rating, small = false }: { rating: number; small?: boolean }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${small ? "w-3.5 h-3.5" : "w-4 h-4"} ${
            rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MyReviews() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [replyText, setReplyText] = useState<string>("");
  const [activeTemplate, setActiveTemplate] = useState<TemplateName | null>(null);
  const [activeNav, setActiveNav] = useState<string>("Reviews");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [ratingFilter, setRatingFilter] = useState<string>("All Ratings");
  const [sortOrder, setSortOrder] = useState<string>("Most Recent");
  const [timeFilter, setTimeFilter] = useState<string>("All Time");
  const [replyingToId, setReplyingToId] = useState<string | null>("3");
  const [shareToast, setShareToast] = useState<boolean>(false);
  const [postSuccess, setPostSuccess] = useState<boolean>(false);
  const [invoiceModal, setInvoiceModal] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [invoiceClient, setInvoiceClient] = useState<string>("");
  const [invoiceAmount, setInvoiceAmount] = useState<string>("");
  const [invoiceDesc, setInvoiceDesc] = useState<string>("");

  // ── Derived ────────────────────────────────────────────────────────────────
  const replyingTo: Review | null = reviews.find((r) => r.id === replyingToId) ?? null;

  // ── Memos ──────────────────────────────────────────────────────────────────

  const dynamicSubRatings = useMemo((): Record<keyof SubRatings, string> => {
    const keys: (keyof SubRatings)[] = ["communication", "quality", "speed", "value"];
    const result: Record<keyof SubRatings, string> = {
      communication: "0.0",
      quality: "0.0",
      speed: "0.0",
      value: "0.0",
    };
    for (const key of keys) {
      const total = reviews.reduce((sum: number, r: Review) => sum + r.subRatings[key], 0);
      result[key] = reviews.length ? (total / reviews.length).toFixed(1) : "0.0";
    }
    return result;
  }, [reviews]);

  const ratingStats = useMemo(() => {
    const total = reviews.length;
    const avg =
      total > 0
        ? reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / total
        : 0;
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      stars: star,
      count: reviews.filter((r: Review) => r.rating === star).length,
    }));
    return { avg: avg.toFixed(1), distribution, total };
  }, [reviews]);

  const analytics = useMemo(() => {
    const total = reviews.length;
    const withReply = reviews.filter((r: Review) => r.reply !== null).length;
    const replyRate = total > 0 ? Math.round((withReply / total) * 100) : 0;

    const monthMap: Record<string, number> = {};
    reviews.forEach((r: Review) => {
      const key = `${r.dateObj.getFullYear()}-${r.dateObj.getMonth()}`;
      monthMap[key] = (monthMap[key] || 0) + 1;
    });
    const monthCounts = Object.values(monthMap);
    const avgPerMonth =
      monthCounts.length > 0
        ? (monthCounts.reduce((a: number, b: number) => a + b, 0) / monthCounts.length).toFixed(1)
        : "0.0";

    const sortedDates = reviews
      .map((r: Review) => r.dateObj)
      .sort((a, b) => b.getTime() - a.getTime());
    const referenceDate = sortedDates[0] || new Date();
    const trendMonths: { month: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
      const label = d.toLocaleString("en-US", { month: "short" });
      const count = reviews.filter(
        (r: Review) =>
          r.dateObj.getFullYear() === d.getFullYear() &&
          r.dateObj.getMonth() === d.getMonth()
      ).length;
      trendMonths.push({ month: label, value: count });
    }
    const maxTrend = Math.max(...trendMonths.map((m) => m.value), 1);

    const positive = reviews.filter((r: Review) => r.rating >= 4).length;
    const neutral  = reviews.filter((r: Review) => r.rating === 3).length;
    const negative = reviews.filter((r: Review) => r.rating <= 2).length;
    const positivePct = total > 0 ? Math.round((positive / total) * 100) : 0;
    const neutralPct  = total > 0 ? Math.round((neutral  / total) * 100) : 0;
    const negativePct = total > 0 ? Math.round((negative / total) * 100) : 0;

    return {
      replyRate, avgPerMonth, trendMonths, maxTrend,
      positivePct, neutralPct, negativePct,
      posDA: `${positivePct} ${100 - positivePct}`,
      neuDA: `${neutralPct} ${100 - neutralPct}`,
      negDA: `${negativePct} ${100 - negativePct}`,
      neuOffset: -positivePct,
      negOffset: -(positivePct + neutralPct),
    };
  }, [reviews]);

  const filteredReviews = useMemo((): Review[] => {
    let result: Review[] = [...reviews];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.text.toLowerCase().includes(q) ||
          r.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    if (ratingFilter !== "All Ratings") {
      const stars = parseInt(ratingFilter);
      result = result.filter((r) => r.rating === stars);
    }

    if (timeFilter !== "All Time") {
      const now = new Date();
      let cutoff: Date | null = null;

      if (timeFilter === "Yesterday") {
        const start = new Date(now);
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        result = result.filter((r) => r.dateObj >= start && r.dateObj <= end);
      } else {
        if (timeFilter === "Last Week")      { cutoff = new Date(now); cutoff.setDate(cutoff.getDate() - 7); }
        else if (timeFilter === "Last Month")     { cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth() - 1); }
        else if (timeFilter === "Last 3 Months")  { cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth() - 3); }
        else if (timeFilter === "Last 6 Months")  { cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth() - 6); }
        else if (timeFilter === "Last Year")      { cutoff = new Date(now); cutoff.setFullYear(cutoff.getFullYear() - 1); }
        else if (timeFilter === "Last 2 Years")   { cutoff = new Date(now); cutoff.setFullYear(cutoff.getFullYear() - 2); }

        if (cutoff !== null) {
          const c: Date = cutoff;
          result = result.filter((r) => r.dateObj >= c);
        }
      }
    }

    if      (sortOrder === "Most Recent")   result.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
    else if (sortOrder === "Oldest First")  result.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    else if (sortOrder === "Highest Rated") result.sort((a, b) => b.rating - a.rating);
    else if (sortOrder === "Lowest Rated")  result.sort((a, b) => a.rating - b.rating);
    else if (sortOrder === "Most Helpful")  result.sort((a, b) => b.helpful - a.helpful);
    else if (sortOrder === "Least Helpful") result.sort((a, b) => a.helpful - b.helpful);

    return result;
  }, [reviews, searchQuery, ratingFilter, sortOrder, timeFilter]);

  // ── Templates ──────────────────────────────────────────────────────────────

  const templates: Record<TemplateName, string> = {
    "Thank You (5★)":    "Thank you so much for your kind words! It was a pleasure working with you and I'm thrilled the project exceeded your expectations. I look forward to working with you again!",
    "Constructive (3★)": "Thank you for your honest feedback. I apologize for any inconvenience during the process. I've taken note of your concerns and will work to improve my workflow. I hope we get to work together again.",
    "Apology (1-2★)":    "I sincerely apologize for your experience. This does not reflect my usual standards and I take full responsibility. I would love the opportunity to make this right for you.",
  };

  const applyTemplate = (name: TemplateName) => {
    setReplyText(templates[name]);
    setActiveTemplate(name);
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleAIGenerate = async () => {
    if (!replyingTo || isGenerating) return;
    setIsGenerating(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system:
            "You are Ahmed Samy, a professional freelancer. Write a warm, professional, concise reply (under 3 sentences) to a client review. Be genuine and specific. For 5-star: enthusiastic gratitude. For 3-4 star: acknowledge feedback professionally. For 1-2 star: sincere apology, take responsibility. Return ONLY the reply text, no quotes, no preamble.",
          messages: [
            {
              role: "user",
              content: `Client: ${replyingTo.name}\nRating: ${replyingTo.rating}/5 stars\nReview: "${replyingTo.text}"\n\nWrite my reply:`,
            },
          ],
        }),
      });
      const data = await response.json();
      const generated: string =
        (data?.content ?? [])
          .map((item: { type: string; text?: string }) =>
            item.type === "text" ? (item.text ?? "") : ""
          )
          .join("") ?? "";
      if (generated.trim()) {
        setReplyText(generated.trim());
        setActiveTemplate(null);
      }
    } catch (err) {
      console.error("AI generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHelpful = (id: string) => {
    setReviews((prev: Review[]) =>
      prev.map((r) =>
        r.id === id && !r.helpfulClicked
          ? { ...r, helpful: r.helpful + 1, helpfulClicked: true }
          : r
      )
    );
  };

  const handleReplyClick = (review: Review) => {
    setReplyingToId(review.id);
    setReplyText(review.reply ? review.reply.text : "");
    setActiveTemplate(null);
    setTimeout(() => {
      document
        .getElementById("quick-reply-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  };

  const handlePostReply = () => {
    if (!replyText.trim() || !replyingToId) return;
    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    setReviews((prev: Review[]) =>
      prev.map((r) =>
        r.id === replyingToId
          ? { ...r, reply: { text: replyText, date: today }, pendingReply: false }
          : r
      )
    );
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 2500);
    setReplyText("");
    setActiveTemplate(null);
    setReplyingToId(null);
  };

  const handleMenuToggle = (id: string) => {
    setReviews((prev: Review[]) =>
      prev.map((r) => ({ ...r, menuOpen: r.id === id ? !r.menuOpen : false }))
    );
  };

  const handleDeleteReview = (id: string) => {
    setReviews((prev: Review[]) => prev.filter((r) => r.id !== id));
  };

  const handleFlagReview = (id: string) => {
    setReviews((prev: Review[]) =>
      prev.map((r) => (r.id === id ? { ...r, menuOpen: false } : r))
    );
    alert("Review flagged for moderation.");
  };

  const handleShare = () => {
    navigator.clipboard
      ?.writeText("https://freelanceflow.app/profile/ahmed-samy/reviews")
      .catch(() => {});
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const handleCreateInvoice = () => {
    if (!invoiceClient.trim()) { alert("Please enter a client name."); return; }
    if (!invoiceAmount.trim()) { alert("Please enter an amount."); return; }
    setInvoiceModal(false);
    setInvoiceClient("");
    setInvoiceAmount("");
    setInvoiceDesc("");
    alert(`Invoice created for ${invoiceClient} — $${invoiceAmount}`);
  };

  const navItems = [
    { icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard" },
    { icon: <Star className="w-4 h-4" />,            label: "Reviews"   },
    { icon: <CreditCard className="w-4 h-4" />,      label: "Payments"  },
    { icon: <BarChart2 className="w-4 h-4" />,       label: "Analytics" },
    { icon: <Settings className="w-4 h-4" />,        label: "Settings"  },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex relative">

      {/* Toast: Share */}
      {shareToast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" />
          Profile link copied to clipboard!
        </div>
      )}

      {/* Toast: Reply posted */}
      {postSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4" />
          Reply posted successfully!
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Create Invoice</h2>
              <button onClick={() => setInvoiceModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Client Name</label>
                <input
                  value={invoiceClient}
                  onChange={(e) => setInvoiceClient(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="e.g. Sarah Johnson"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Amount ($)</label>
                <input
                  type="number"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={invoiceDesc}
                  onChange={(e) => setInvoiceDesc(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="Project description..."
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setInvoiceModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreateInvoice} className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside className="w-44 bg-white border-r border-gray-200 flex flex-col py-4 shrink-0">
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold">FH</div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Freelancer Hub</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                <span className="text-xs text-purple-600 font-medium">Verified Pro</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setInvoiceModal(true)}
          className="mx-3 mb-4 flex items-center justify-center gap-2 bg-purple-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Invoice
        </button>

        <nav className="flex-1 px-2 space-y-0.5">
          {navItems.map(({ icon, label }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeNav === label
                  ? "bg-purple-50 text-purple-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className={activeNav === label ? "text-purple-600" : "text-gray-400"}>
                {icon}
              </span>
              {label}
            </button>
          ))}
        </nav>

        <div className="px-2 mt-auto space-y-0.5">
          <button
            onClick={() => alert("Support center coming soon!")}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-gray-400" />
            Support
          </button>
          <button
            onClick={() => { if (confirm("Are you sure you want to log out?")) alert("Logged out."); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
            Log Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 overflow-auto">

        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 h-14 flex items-center justify-between">
            <span className="text-purple-600 font-bold text-lg tracking-tight">FreelanceFlow</span>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200 w-52"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-6">
              {["Marketplace", "Messages", "Projects"].map((label) => (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert(`${label} page coming soon!`); }}
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 relative"
                onClick={() => alert("No new notifications.")}
              >
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all">
                AS
              </div>
            </div>
          </div>
        </nav>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share Reviews
            </button>
          </div>

          {/* Rating overview banner */}
          <div className="bg-purple-600 rounded-xl p-6 mb-5 text-white">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold">{ratingStats.avg}</div>
                <div className="flex justify-center mt-2">
                  <StarsDisplay rating={Math.round(Number(ratingStats.avg))} />
                </div>
                <div className="text-xs text-purple-200 mt-1">
                  Based on {ratingStats.total} reviews
                </div>
              </div>

              <div className="flex-1 space-y-1.5">
                {ratingStats.distribution.map(({ stars, count }) => (
                  <div key={stars} className="flex items-center gap-2 text-xs">
                    <span className="w-8 text-purple-200 text-right">{stars} Star</span>
                    <div className="flex-1 bg-purple-500 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{
                          width: `${ratingStats.total ? (count / ratingStats.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="w-6 text-purple-200">{count}</span>
                  </div>
                ))}
              </div>

              <div className="border-l border-purple-500 pl-8 space-y-2">
                {(["communication", "quality", "speed", "value"] as (keyof SubRatings)[]).map((key) => (
                  <div key={key} className="flex items-center gap-3 text-sm">
                    <span className="text-purple-200 w-28 capitalize">{key}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold">{dynamicSubRatings[key]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* ── Reviews list ── */}
            <div className="lg:col-span-3 space-y-4">

              {/* Filters */}
              <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[140px]">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white text-gray-600"
                >
                  <option>All Ratings</option>
                  <option>5 Stars</option><option>4 Stars</option>
                  <option>3 Stars</option><option>2 Stars</option><option>1 Stars</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white text-gray-600"
                >
                  <option>Most Recent</option><option>Oldest First</option>
                  <option>Highest Rated</option><option>Lowest Rated</option>
                  <option>Most Helpful</option><option>Least Helpful</option>
                </select>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white text-gray-600"
                >
                  <option>All Time</option><option>Yesterday</option>
                  <option>Last Week</option><option>Last Month</option>
                  <option>Last 3 Months</option><option>Last 6 Months</option>
                  <option>Last Year</option><option>Last 2 Years</option>
                </select>
              </div>

              <p className="text-xs text-gray-400">
                Showing {filteredReviews.length} of {reviews.length} reviews
                {(sortOrder === "Most Helpful" || sortOrder === "Least Helpful") && (
                  <span className="ml-1 text-purple-500 font-medium">
                    · sorted by {sortOrder.toLowerCase()}
                  </span>
                )}
              </p>

              {filteredReviews.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
                  No reviews match your filters.
                </div>
              )}

              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className={`bg-white rounded-xl border p-5 transition-all ${
                    review.pendingReply ? "border-yellow-300" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm ${review.avatarColor}`}
                      >
                        {review.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarsDisplay rating={review.rating} small />
                          <span className="font-bold text-yellow-500 text-xs">{review.rating}.0</span>
                          <span className="text-gray-400 text-xs">·</span>
                          <span className="text-gray-400 text-xs">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {review.pendingReply && (
                        <span className="text-xs font-medium text-yellow-600 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full">
                          Pending Reply
                        </span>
                      )}
                      <div className="relative">
                        <button
                          onClick={() => handleMenuToggle(review.id)}
                          className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        {review.menuOpen && (
                          <div className="absolute right-0 top-7 z-20 bg-white border border-gray-200 rounded-lg shadow-lg w-36 py-1 text-xs">
                            <button
                              onClick={() => handleFlagReview(review.id)}
                              className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Flag className="w-3.5 h-3.5 text-yellow-500" />
                              Flag Review
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mt-3 leading-relaxed">{review.text}</p>

                  {review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {review.tags.map((tag: string) => (
                        <span key={tag} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {review.attachment && (
                    <div
                      className="mt-3 flex items-center gap-2 text-xs text-purple-600 bg-purple-50 rounded-lg px-3 py-2 w-fit cursor-pointer hover:bg-purple-100 transition-colors"
                      onClick={() => alert(`Opening: ${review.attachment}`)}
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      {review.attachment}
                    </div>
                  )}

                  {review.reply && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-3 border-l-2 border-purple-300">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Reply className="w-3 h-3" />
                          <span className="font-medium text-gray-700">Your Reply</span>
                        </div>
                        <span className="text-xs text-gray-400">{review.reply.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 italic">{review.reply.text}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleHelpful(review.id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${
                        review.helpfulClicked
                          ? "text-purple-600 font-medium"
                          : "text-gray-500 hover:text-purple-600"
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${review.helpfulClicked ? "fill-current" : ""}`} />
                      Helpful ({review.helpful})
                    </button>

                    {review.pendingReply ? (
                      <button
                        onClick={() => handleReplyClick(review)}
                        className="flex items-center gap-1.5 text-xs font-medium bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Reply Now
                      </button>
                    ) : review.reply ? (
                      <button
                        onClick={() => handleReplyClick(review)}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-600 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Reply
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReplyClick(review)}
                        className="flex items-center gap-1.5 text-xs text-purple-600 hover:underline transition-colors"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        Reply
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Right panel ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Quick Reply */}
              <div id="quick-reply-panel" className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Quick Reply</h3>

                {replyingTo ? (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3 text-xs text-gray-500 border border-gray-200">
                    <p className="font-medium text-gray-700 mb-0.5">
                      Replying to {replyingTo.name} ({replyingTo.rating}.0 Stars):
                    </p>
                    <p className="italic truncate">"{replyingTo.text.substring(0, 45)}..."</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3 text-xs text-gray-400 border border-gray-200 italic">
                    Select a review to reply to.
                  </div>
                )}

                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your professional response here..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg p-3 text-xs text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                />

                <button
                  onClick={handleAIGenerate}
                  disabled={!replyingTo || isGenerating}
                  className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Generating AI reply...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate AI Reply
                    </>
                  )}
                </button>

                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Templates:</p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(templates) as TemplateName[]).map((name) => (
                      <button
                        key={name}
                        onClick={() => applyTemplate(name)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          activeTemplate === name
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => {
                      setReplyText("");
                      setActiveTemplate(null);
                      setReplyingToId(null);
                    }}
                    className="px-4 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handlePostReply}
                    disabled={!replyText.trim() || !replyingToId}
                    className="px-4 py-2 text-xs font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Post Reply
                  </button>
                </div>
              </div>

              {/* Analytics */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-4">Review Analytics</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Avg. per Month</p>
                    <p className="text-xl font-bold text-gray-900">{analytics.avgPerMonth}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Reply Rate</p>
                    <p className="text-xl font-bold text-purple-600">{analytics.replyRate}%</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 font-medium mb-3">Sentiment Analysis</p>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22c55e" strokeWidth="3"
                        strokeDasharray={analytics.posDA} strokeDashoffset="0" />
                      {analytics.neutralPct > 0 && (
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#d1d5db" strokeWidth="3"
                          strokeDasharray={analytics.neuDA} strokeDashoffset={analytics.neuOffset} />
                      )}
                      {analytics.negativePct > 0 && (
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="3"
                          strokeDasharray={analytics.negDA} strokeDashoffset={analytics.negOffset} />
                      )}
                    </svg>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { label: "Positive", pct: `${analytics.positivePct}%`, color: "bg-green-500" },
                      { label: "Neutral",  pct: `${analytics.neutralPct}%`,  color: "bg-gray-300" },
                      { label: "Negative", pct: `${analytics.negativePct}%`, color: "bg-red-500" },
                    ].map(({ label, pct, color }) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${color}`} />
                        <span className="text-xs text-gray-600">{label}</span>
                        <span className="text-xs font-semibold text-gray-900">{pct}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-500 font-medium mt-4 mb-3">Monthly Trend (Last 6 Months)</p>
                <div className="flex items-end gap-1 h-16">
                  {analytics.trendMonths.map(({ month, value }) => (
                    <div key={month} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t bg-purple-200 hover:bg-purple-500 transition-colors cursor-pointer"
                        style={{
                          height: `${analytics.maxTrend > 0 ? (value / analytics.maxTrend) * 100 : 0}%`,
                          minHeight: value > 0 ? "4px" : "0",
                        }}
                        title={`${month}: ${value} reviews`}
                        onClick={() =>
                          alert(`${month}: ${value} review${value !== 1 ? "s" : ""} received`)
                        }
                      />
                      <span className="text-xs text-gray-400">{month}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 font-medium mt-4 mb-2">Most Helpful Reviews</p>
                <div className="space-y-1.5">
                  {[...reviews]
                    .sort((a, b) => b.helpful - a.helpful)
                    .slice(0, 3)
                    .map((r) => (
                      <div key={r.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs ${r.avatarColor}`}
                          >
                            {r.initials[0]}
                          </div>
                          <span className="text-gray-700 truncate">{r.name}</span>
                        </div>
                        <span className="text-purple-600 font-semibold ml-2 shrink-0">👍 {r.helpful}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Keywords */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Common Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {KEYWORDS.map(({ label, count, color }) => (
                    <button
                      key={label}
                      onClick={() => setSearchQuery(label)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all hover:scale-105 ${color} ${
                        searchQuery === label ? "ring-2 ring-purple-400" : ""
                      }`}
                    >
                      {label} ({count})
                    </button>
                  ))}
                </div>
                {searchQuery && KEYWORDS.some((k) => k.label === searchQuery) && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-xs text-purple-600 hover:underline"
                  >
                    Clear filter
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}