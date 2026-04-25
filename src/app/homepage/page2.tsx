"use client";
import { useState } from "react";
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

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "active" | "paused" | "pending" | "drafts";

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
  { key: "active", label: "Active", count: 8 },
  { key: "paused", label: "Paused", count: 2 },
  { key: "pending", label: "Pending Approval", count: 1 },
  { key: "drafts", label: "Drafts", count: 3 },
] as { key: TabKey; label: string; count: number }[];

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

const INITIAL_GIGS: Gig[] = [
  {
    id: 1,
    title: "I will design a modern logo",
    category: "Logo Design",
    categoryColor: "text-violet-600 bg-violet-50",
    price: "$150",
    packages: "Basic, Standard, Premium",
    status: "Active",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80",
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
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&q=80",
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
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80",
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
  const map = {
    Active: "bg-green-500",
    Paused: "bg-orange-500",
    Pending: "bg-yellow-500",
    Draft: "bg-gray-400",
  };
  return (
    <span className={`absolute top-3 left-3 text-white text-xs px-2.5 py-1 rounded-md ${map[status]}`}>
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
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
        active ? "bg-violet-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white ${
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
}) {
  return (
    <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
      <div className="flex gap-5">
        <div className="relative w-44 h-28 rounded-xl overflow-hidden">
          <img src={gig.image} className="w-full h-full object-cover" />
          <StatusBadge status={gig.status} />
        </div>

        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">{gig.title}</h3>
              <span className={`text-xs px-2 py-1 rounded ${gig.categoryColor}`}>
                {gig.category}
              </span>
              <p className="text-sm text-violet-600 font-bold">
                Starting at {gig.price}
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => onEdit(gig)}>
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
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => alert("Analytics " + gig.title)}>
          <BarChart2 size={14} /> Analytics
        </button>

        <button onClick={() => window.open("https://example.com")}>
          <ExternalLink size={14} /> View
        </button>

        <button onClick={() => onEdit(gig)}>
          <Pencil size={14} /> Edit
        </button>

        <button onClick={() => alert("Boost " + gig.title)}>
          <Rocket size={14} /> Boost
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function MyGigs() {
  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const [gigs, setGigs] = useState<Gig[]>(INITIAL_GIGS);

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

  const filteredGigs = gigs.filter((g) => {
    if (activeTab === "active") return g.status === "Active";
    if (activeTab === "paused") return g.status === "Paused";
    if (activeTab === "pending") return g.status === "Pending";
    if (activeTab === "drafts") return g.status === "Draft";
    return true;
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Gigs</h1>

      <div className="flex gap-3 mb-4">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      {filteredGigs.map((gig) => (
        <GigCard
          key={gig.id}
          gig={gig}
          onEdit={handleEdit}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}