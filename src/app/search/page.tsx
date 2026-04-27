"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Bell,
  HelpCircle,
  UserCircle,
  Sparkles,
  Star,
  BadgeCheck,
} from "lucide-react";
import {
  getSearchResults,
  SearchData,
  SearchTab,
  GigItem,
  FreelancerItem,
} from "@/src/lib/searchApi";

const tabs: SearchTab[] = ["All", "Gigs", "Freelancers", "Jobs"];

const serviceOptions = ["Logo Design", "Brand Style Guides", "Business Cards"];

export default function SearchPage() {
  const [data, setData] = useState<SearchData | null>(null);
  const [query, setQuery] = useState("logo design");
  const [activeTab, setActiveTab] = useState<SearchTab>("All");
  const [aiMatch, setAiMatch] = useState(true);
  const [serviceTypes, setServiceTypes] = useState<string[]>([
    "Logo Design",
    "Brand Style Guides",
  ]);
  const [budget, setBudget] = useState(1000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getSearchResults(query, activeTab).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [query, activeTab]);

  const visibleCards = useMemo(() => {
    if (!data) return [];

    const filteredGigs = data.gigs.filter((gig) => {
      const matchesService =
        serviceTypes.length === 0 || serviceTypes.includes(gig.serviceType);

      const matchesBudget = gig.numericPrice <= budget;

      const matchesAi = !aiMatch || gig.match >= 85;

      return matchesService && matchesBudget && matchesAi;
    });

    const filteredFreelancers = data.freelancers.filter((freelancer) => {
      return !aiMatch || freelancer.match >= 85;
    });

    if (activeTab === "Gigs") {
      return filteredGigs;
    }

    if (activeTab === "Freelancers") {
      return filteredFreelancers;
    }

    if (activeTab === "Jobs") {
      return [];
    }

    return [...filteredGigs, ...filteredFreelancers];
  }, [data, activeTab, serviceTypes, budget, aiMatch]);

  function toggleService(value: string) {
    setServiceTypes((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }

  if (loading || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7fa]">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7fa] text-[#17151f]">
      <header className="flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-8">
        <div className="text-[26px] font-black">MySite</div>

        <div className="flex h-[44px] w-[430px] items-center gap-3 rounded-full border border-purple-200 bg-[#f2eaf8] px-4">
          <Search size={21} className="text-gray-600" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[16px] outline-none"
          />
        </div>

        <nav className="flex items-center gap-8 text-[15px]">
          <button className="border-b-2 border-purple-700 pb-2 text-purple-700">
            Explore
          </button>
          <button>Jobs</button>
          <button>Messages</button>
          <button>Support</button>
        </nav>

        <div className="flex items-center gap-5">
          <button className="text-purple-700">Login</button>
          <button className="rounded-lg bg-purple-700 px-5 py-3 font-semibold text-white">
            Post a Job
          </button>
          <Bell className="text-purple-700" size={22} />
          <HelpCircle className="text-purple-700" size={22} />
          <UserCircle className="text-purple-700" size={25} />
        </div>
      </header>

      <section className="px-8 py-10">
        <h1 className="text-[40px] font-bold">
          {data.totalResults.toLocaleString()} results for "{query}"
        </h1>

        <div className="mt-7 flex gap-12 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[16px] ${
                activeTab === tab
                  ? "border-b-2 border-purple-700 text-purple-700"
                  : "text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-7 flex items-center gap-4">
          <Sparkles className="text-blue-600" size={24} />
          <span className="text-sm text-gray-700">Related:</span>

          {data.related.map((item) => (
            <button
              key={item}
              onClick={() => setQuery(item.toLowerCase())}
              className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-9 grid grid-cols-[320px_1fr] gap-7">
          <aside className="space-y-7">
            <div className="flex items-center justify-between rounded-lg border border-purple-200 bg-[#fff7ff] p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="text-blue-600" size={22} />
                <p className="font-bold">AI Match Score</p>
              </div>

              <button
                onClick={() => setAiMatch(!aiMatch)}
                className={`flex h-6 w-11 items-center rounded-full px-1 ${
                  aiMatch
                    ? "justify-end bg-blue-600"
                    : "justify-start bg-gray-300"
                }`}
              >
                <span className="h-5 w-5 rounded-full bg-white" />
              </button>
            </div>

            <div className="rounded-lg border border-purple-200 bg-[#fff7ff] p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-bold tracking-widest">
                SERVICE TYPE
              </h3>

              {serviceOptions.map((item) => (
                <label
                  key={item}
                  className="mb-3 flex cursor-pointer items-center gap-3 text-[16px]"
                >
                  <input
                    type="checkbox"
                    checked={serviceTypes.includes(item)}
                    onChange={() => toggleService(item)}
                    className="h-5 w-5 accent-purple-700"
                  />
                  {item}
                </label>
              ))}

              <div className="my-7 border-t border-purple-100" />

              <h3 className="mb-4 text-sm font-bold tracking-widest">
                BUDGET
              </h3>

              <input
                type="range"
                min={10}
                max={1000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-purple-700"
              />

              <div className="mt-3 flex justify-between text-sm">
                <span>$10</span>
                <span>${budget >= 1000 ? "1k+" : budget}</span>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-8 flex min-h-[160px] items-center justify-between overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-r from-blue-600 to-blue-100 p-7 text-white shadow-sm">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={data.topMatch.avatar}
                    alt={data.topMatch.name}
                    className="h-24 w-24 rounded-full border-4 border-white object-cover"
                  />

                  <div className="absolute -bottom-3 left-0 rounded-full bg-blue-700 px-3 py-1 text-center text-sm font-bold text-white ring-2 ring-white">
                    ✨ {data.topMatch.match}% <br /> Match
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[24px] font-bold">
                      {data.topMatch.name}
                    </h2>
                    <BadgeCheck size={18} className="text-yellow-500" />
                  </div>

                  <p className="mt-1 text-[17px] text-blue-100">
                    {data.topMatch.title}
                  </p>

                  <p className="mt-3 max-w-[720px] text-[16px] leading-7">
                    "{data.topMatch.quote}"
                  </p>
                </div>
              </div>

              <button className="rounded-lg bg-white px-6 py-4 font-bold text-blue-700">
                View Profile
              </button>
            </div>

            {visibleCards.length === 0 ? (
              <div className="rounded-xl border border-purple-200 bg-[#fff7ff] p-10 text-center">
                <h3 className="text-xl font-bold">No results found</h3>
                <p className="mt-2 text-gray-600">
                  Try changing service type, budget, or tab filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-7">
                {visibleCards.map((item) =>
                  "seller" in item ? (
                    <GigCard key={`gig-${item.id}`} item={item as GigItem} />
                  ) : (
                    <FreelancerCard
                      key={`freelancer-${item.id}`}
                      item={item as FreelancerItem}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="mt-20 flex h-[120px] items-center justify-between border-t bg-white px-8">
        <h2 className="text-[22px] font-bold">MySite</h2>

        <div className="flex gap-8 text-sm text-gray-600">
          <button>Terms</button>
          <button>Privacy</button>
          <button>Cookies</button>
          <button>Security</button>
          <button>Contact</button>
        </div>

        <p className="text-sm text-gray-600">
          © 2024 MySite AI. Empowering the global workforce.
        </p>
      </footer>
    </main>
  );
}

function GigCard({ item }: { item: GigItem }) {
  return (
    <div className="overflow-hidden rounded-xl border border-purple-200 bg-[#fff7ff] shadow-sm">
      <div className="relative h-[210px] bg-gray-900">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />

        <span className="absolute left-4 top-4 rounded-md bg-white px-3 py-1 text-sm font-bold text-blue-700">
          ✨ {item.match}% Match
        </span>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <img
            src={`https://i.pravatar.cc/80?img=${item.id + 12}`}
            alt={item.seller}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="font-bold">{item.seller}</p>
            <p className="text-sm text-gray-600">{item.level}</p>
          </div>
        </div>

        <p className="min-h-[50px] text-[17px] leading-6">{item.title}</p>

        <div className="mt-5 flex items-center justify-between">
          <p className="flex items-center gap-1">
            <Star size={17} className="fill-yellow-600 text-yellow-600" />
            {item.rating} ({item.reviews})
          </p>

          <p className="font-bold">From {item.price}</p>
        </div>
      </div>
    </div>
  );
}

function FreelancerCard({ item }: { item: FreelancerItem }) {
  return (
    <div className="rounded-xl border border-purple-200 bg-[#fff7ff] p-7 text-center shadow-sm">
      <span className="ml-auto block w-fit rounded-md bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
        ✨ {item.match}% Match
      </span>

      <img
        src={item.avatar}
        alt={item.name}
        className="mx-auto mt-3 h-24 w-24 rounded-full border-4 border-blue-200 object-cover"
      />

      <h3 className="mt-5 text-[22px] font-bold">{item.name}</h3>
      <p className="mt-2 text-gray-600">{item.title}</p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {item.skills.map((skill) => (
          <span key={skill} className="rounded-md bg-purple-100 px-3 py-1 text-sm">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-9 flex justify-between border-t border-purple-100 pt-5">
        <p className="flex items-center gap-1">
          <Star size={17} className="fill-yellow-600 text-yellow-600" />
          {item.rating}
        </p>
        <p className="font-bold">{item.hourlyRate}</p>
      </div>
    </div>
  );
}