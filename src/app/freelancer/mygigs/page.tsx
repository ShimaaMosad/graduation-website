"use client";
import { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingBag,
  Eye,
  TrendingUp,
  MousePointerClick,
  Star,
  Pencil,
  Rocket,
  BarChart2,
  ExternalLink,
  MoreVertical,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────


interface StatCard {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  sub: string;
  subColor: string;
}

interface Gig {
  id: number;
  title: string;
  category: string;
  categoryColor: string;
  price: string;
  packages: string;
  status: "Active" | "Paused" | "Pending" | "Draft";
  image: string;
  impressions: number;
  impressionsTrend: string;
  clicks: number;
  clickRate: string;
  orders: number;
  orderRate: string;
  revenue: string;
  revenueTrend: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "active", label: "Active" },
  { key: "paused", label: "Paused" },
  { key: "pending", label: "Pending Approval" },
  { key: "drafts", label: "Drafts" },
] as const;
type TabKey = typeof TABS[number]["key"];


const STAT_CARDS: StatCard[] = [
  {
    icon: <DollarSign size={20} />,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    value: "$12,400",
    label: "Total Earnings",
    sub: "+$1,200 this month",
    subColor: "text-green-500",
  },
  {
    icon: <ShoppingBag size={20} />,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    value: "15",
    label: "Active Orders",
    sub: "3 due this week",
    subColor: "text-orange-500",
  },
  {
    icon: <Eye size={20} />,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-500",
    value: "8,245",
    label: "Profile Views",
    sub: "+245 this week",
    subColor: "text-green-500",
  },
  {
    icon: <TrendingUp size={20} />,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
    value: "4.9★",
    label: "Average Rating",
    sub: "234 reviews",
    subColor: "text-gray-400",
  },
];

const GIGS: Gig[] = [
  {
    id: 1,
    title: "I will design a modern logo",
    category: "Logo Design",
    categoryColor: "text-violet-600 bg-violet-50",
    price: "$150",
    packages: "Basic, Standard, Premium",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80",
    impressions: 1245,
    impressionsTrend: "+12%",
    clicks: 342,
    clickRate: "27%",
    orders: 45,
    orderRate: "13%",
    revenue: "$6,750",
    revenueTrend: "+$450",
  },
  {
    id: 2,
    title: "I will develop a responsive website",
    category: "Web Development",
    categoryColor: "text-sky-600 bg-sky-50",
    price: "$500",
    packages: "Basic, Standard, Premium",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&q=80",
    impressions: 2156,
    impressionsTrend: "+8%",
    clicks: 487,
    clickRate: "23%",
    orders: 28,
    orderRate: "11%",
    revenue: "$14,000",
    revenueTrend: "+$1,200",
  },
  {
    id: 3,
    title: "I will write SEO content",
    category: "Content Writing",
    categoryColor: "text-emerald-600 bg-emerald-50",
    price: "$75",
    packages: "Basic, Standard",
    status: "Paused",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80",
    impressions: 892,
    impressionsTrend: "+5%",
    clicks: 156,
    clickRate: "17%",
    orders: 12,
    orderRate: "8%",
    revenue: "$900",
    revenueTrend: "+$75",
  },
];
// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Gig["status"] }) {
  const map: Record<Gig["status"], string> = {
    Active: "bg-green-500",
    Paused: "bg-orange-500",
    Pending: "bg-yellow-500",
    Draft: "bg-gray-400",
  };
  return (
    <span
      className={`absolute top-3 left-3 text-white text-xs font-semibold px-2.5 py-1 rounded-md ${map[status]}`}
    >
      {status}
    </span>
  );
}

function Toggle({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
        active ? "bg-violet-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          active ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function GigCard({
  gig,
  onEdit,
  onToggle,
}: {
  gig: Gig;
  onEdit: (g: Gig) => void;
  onToggle: (id: number) => void;
}) {   const router = useRouter(); 
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      {/* Top row */}
      <div className="flex gap-5">
        {/* Thumbnail */}
        <div className="relative w-44 h-28 flex-shrink-0 rounded-xl overflow-hidden">
          <img
            src={gig.image}
            alt={gig.title}
            className="w-full h-full object-cover"
          />
          <StatusBadge status={gig.status} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-gray-900 font-semibold text-base leading-snug">
                {gig.title}
              </h3>
              <span
                className={`inline-block mt-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${gig.categoryColor}`}
              >
                {gig.category}
              </span>
              <p className="mt-1 text-sm text-gray-500">
                <span className="text-violet-600 font-bold">
                  Starting at {gig.price}
                </span>{" "}
                <span className="text-gray-400">{gig.packages}</span>
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
  onClick={() => onEdit(gig)}
  className="text-violet-400 hover:text-violet-600 transition-colors"
>
  <Pencil size={16} />
</button>
<Toggle
                active={gig.status === "Active"}
                onToggle={() => onToggle(gig.id)}
              />
              <button onClick={() => alert("Menu for " + gig.title)}>
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-3 grid grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
                <Eye size={14} className="text-violet-500" />
{(gig.impressions ?? 0).toLocaleString()}              </div>
              <p className="text-xs text-gray-400">Impressions</p>
              <p className="text-xs text-green-500">{gig.impressionsTrend}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
                <MousePointerClick size={14} className="text-violet-400" />
                {gig.clicks}
              </div>
              <p className="text-xs text-gray-400">Clicks</p>
              <p className="text-xs text-gray-400">{gig.clickRate}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
                <ShoppingBag size={14} className="text-green-500" />
                {gig.orders}
              </div>
              <p className="text-xs text-gray-400">Orders</p>
              <p className="text-xs text-green-500">{gig.orderRate}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
                <DollarSign size={14} className="text-amber-500" />
{(gig.revenue ?? "$0").replace("$", "")}              </div>
              <p className="text-xs text-gray-400">Revenue</p>
              <p className="text-xs text-green-500">{gig.revenueTrend}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
<div className="flex gap-2 pt-1 border-t border-gray-50">
  <button
    onClick={() => router.push(`/gigs/${gig.id}/analytics`)}
    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-violet-500 text-violet-600 text-sm font-medium hover:bg-violet-50 transition-colors"
  >
    <BarChart2 size={14} />
    View Analytics
  </button>

  <button
    onClick={() =>router.push(`/freelancer/mygigs/${gig.id}/edit`)}
    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-violet-500 text-violet-600 text-sm font-medium hover:bg-violet-50 transition-colors"
  >
    <ExternalLink size={14} />
    View Gig
  </button>

  <button
    onClick={() => router.push(`/freelancer/mygigs/${gig.id}/edit`)}
    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-violet-500 text-violet-600 text-sm font-medium hover:bg-violet-50 transition-colors"
  >
    <Pencil size={14} />
    Edit Gig
  </button>

  <button
    onClick={() => router.push(`/gigs/${gig.id}/boost`)}
    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-orange-400 text-orange-500 text-sm font-medium hover:bg-orange-50 transition-colors"
  >
    <Rocket size={14} />
    Boost Gig
  </button>
</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MyGigs() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await fetch("/api/gigs");
        const data = await res.json();
setGigs(data.gigs)
  } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);
  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const handleEdit = (gig: Gig) => {
    alert("Editing: " + gig.title);
  };
  const handleToggle = (id: number) => {
    setGigs((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: g.status === "Active" ? "Paused" : "Active" }
          : g
      )
    );
  };
const tabCounts: Record<TabKey, number> = {
  active: gigs.filter((g) => g.status === "Active").length,
  paused: gigs.filter((g) => g.status === "Paused").length,
  pending: gigs.filter((g) => g.status === "Pending").length,
  drafts: gigs.filter((g) => g.status === "Draft").length,
};
  const filteredGigs = gigs.filter((g) => {
    if (activeTab === "active") return g.status === "Active";
    if (activeTab === "paused") return g.status === "Paused";
    if (activeTab === "pending") return g.status === "Pending";
    if (activeTab === "drafts") return g.status === "Draft";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Gigs</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Manage and track your service performance
            </p>
          </div>
             <button
      onClick={() => router.push("/freelancer/create-gig")}
      className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-md shadow-violet-200"
    >
      <Plus size={16} />
      Create New Gig
    </button>
        </div>

        {/* ── Tabs ── */}
<div className="flex gap-1 border-b border-gray-200 mb-6">
  {TABS.map((tab) => (
    <button
      key={tab.key}
      onClick={() => setActiveTab(tab.key)}
      className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
        activeTab === tab.key
          ? "border-violet-600 text-violet-600"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {tab.label} ({tabCounts[tab.key]})
    </button>
  ))}
</div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {STAT_CARDS.map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div
                className={`w-10 h-10 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center mb-3`}
              >
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-400 mt-0.5">{card.label}</p>
              <p className={`text-xs mt-1 font-medium ${card.subColor}`}>
                {card.sub}
              </p>
            </div>
          ))}
        </div>

        {/* ── Gig List ── */}
        <div className="flex flex-col gap-4">
 {filteredGigs.length > 0 ? (
    filteredGigs.map((gig) => (
  <GigCard
          key={gig.id}
          gig={gig}
          onEdit={handleEdit}
          onToggle={handleToggle}
        />          ))) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <p className="text-gray-400 text-sm">No gigs in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
