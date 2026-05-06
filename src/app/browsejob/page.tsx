"use client";

import React from "react";
import Image from "next/image";
import { Heart, Bell, MessageSquare, Search, Star } from "lucide-react";

/* =========================
  TYPES
========================= */

type JobCard = {
  id: number;
  category: string;
  title: string;
  time: string;
  budget: string;
  type: "Fixed Price" | "Hourly";

  experience: "Entry Level" | "Intermediate" | "Expert";

  client: {
    name: string;
    avatar: string;
    stats: {
      rating: number;
      reviews: number;
    };
  };

  location: string;
  desc: string;
  skills: string[];
};

type Filters = {
  category: string[];
  projectType: string;
  experience: string[];
  posted: string;
};

/* =========================
  STATIC DATA
========================= */

const staticJobs: JobCard[] = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  category: "Web Development",
  title: "Full Stack Developer for SaaS Platform",
  time: "Posted 2 hours ago",
  budget: "$2,500 - $3,500",
  type: "Fixed Price",
  experience: "Entry Level",

  client: {
    name: "Ahmed Ali",
    avatar: "/images/client2.jfif",
    stats: {
      rating: 4.8,
      reviews: 12,
    },
  },

  location: "San Francisco, USA",
  desc: "We are looking for an experienced full stack developer.",
  skills: ["React", "Node.js", "PostgreSQL", "AWS"],
}));

/* =========================
  PAGE
========================= */

export default function BrowseJobsPage() {
  const [jobs, setJobs] = React.useState<JobCard[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [favorites, setFavorites] = React.useState<number[]>([]);
  const [search, setSearch] = React.useState("");

  const [filters, setFilters] = React.useState<Filters>({
    category: ["Web Development"],
    projectType: "All Types",
    experience: ["Entry Level"],
    posted: "Last 24 hours",
  });

  /* =========================
    FETCH
  ========================= */

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/jobs");
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setJobs(data);
        } else {
          setJobs(staticJobs);
        }
      } catch (err) {
        console.log(err);
        setJobs(staticJobs);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  /* =========================
    FILTERS
  ========================= */

  const filteredJobs = React.useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch = job.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        filters.category.length === 0 ||
        filters.category.includes(job.category);

      const matchProjectType =
        filters.projectType === "All Types" ||
        job.type === filters.projectType;

      const matchExperience =
        filters.experience.length === 0 ||
        filters.experience.includes(job.experience);

      return (
        matchSearch &&
        matchCategory &&
        matchProjectType &&
        matchExperience
      );
    });
  }, [jobs, search, filters]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading jobs...
      </div>
    );
  }

  /* =========================
    FAVORITES TOGGLE (Set optimized)
  ========================= */

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen">


      {/* HEADER */}
      <div className="w-full h-[200px] bg-gradient-to-r from-[#3B82F6] to-[#2563EB] flex items-center justify-center ">
  
  <div className="w-[1200px] h-full flex flex-col justify-center text-white gap-2">
          <h1 className="text-3xl font-bold">Find Your Next Opportunity</h1>
          <p className="opacity-90">
            Browse thousands of projects from verified clients
          </p>
<div className="mt-4 w-[600px] h-[56px] border border-gray-300 rounded-lg flex items-center px-4 focus-within:border-[#3B82F6] focus-within:ring-2 focus-within:ring-[#3B82F6]">
  
   <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none border-none text-black"
              placeholder="Search for jobs..."
            />

  <button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2 rounded-lg transition">
    Search
  </button>

</div>
        </div>
      </div>

      {/* MAIN */}
      <div className="w-[1200px] mx-auto flex gap-6 mt-8">
        
        {/* SIDEBAR */}
        <div className="w-[280px] left-0 bottom-0">
          <div className="bg-white p-6 rounded-xl shadow-sm sticky top-4">
            <h2 className="font-semibold text-lg mb-4">Filters</h2>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Category</p>
        {[
  "Web Development",
  "Mobile Apps",
  "Graphic Design",
  "Writing",
  "Marketing",
].map((c) => (
  <label key={c} className="flex items-center gap-2 mb-2 text-sm">
    <input
      type="checkbox"
      checked={filters.category.includes(c)}
      onChange={() => {
        setFilters(prev => ({
          ...prev,
          category: prev.category.includes(c)
            ? prev.category.filter(item => item !== c)
            : [...prev.category, c]
        }));
      }}
    />
    {c}
  </label>
))}
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Budget Range (USD)</p>
              <div className="flex gap-2">
                <input className="w-1/2 border p-2 rounded" placeholder="$0" />
                <input className="w-1/2 border p-2 rounded" placeholder="$10000" />
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Project Type</p>
             {["All Types", "Fixed", "Hourly"].map((t) => (
  <label key={t} className="block text-sm mb-2">
    <input
      type="radio"
      name="projectType"
      checked={filters.projectType === t}
      onChange={() =>
        setFilters(prev => ({ ...prev, projectType: t }))
      }
    />
    {t}
  </label>
))}
            
            </div>
                      <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Experience Required</p>
             {["Entry Level", "Intermediate", "Expert"].map((c) => (
  <label key={c} className="flex items-center gap-2 mb-2 text-sm">
    <input
      type="checkbox"
      checked={filters.experience.includes(c)}
      onChange={() => {
        setFilters(prev => ({
          ...prev,
          experience: prev.experience.includes(c)
            ? prev.experience.filter(item => item !== c)
            : [...prev.experience, c]
        }));
      }}
    />
    {c}
  </label>
))}
            </div>
              <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Posted</p>
             {["Last 24 hours", "Last 7 days", "Last 30 days", "Any time"].map((t) => (
  <label key={t} className="block text-sm mb-2">
    <input
      type="radio"
      name="posted"
      checked={filters.posted === t}
      onChange={() =>
        setFilters(prev => ({ ...prev, posted: t }))
      }
    />
    {t}
  </label>
))}
            </div>

<button
className="text-[#3B82F6] text-sm hover:underline underline-offset-4 decoration-[#3B82F6]"  onClick={() => {
    setFilters({
      category: [],              // فاضي
      projectType: "All Types",  // default
      experience: [],            // فاضي
      posted: "Any time"         // زي ما طلبتي
    });
  }}
>
  Clear All Filters
</button>          </div>
        </div>

        {/* JOB LIST */}
        <div className="w-[920px]">
         <div className="flex justify-between mb-4">
<h2 className="font-semibold text-lg">  {filteredJobs.length} jobs found</h2>
  <select className="border rounded px-3 py-2 cursor-pointer">
    <option> Sort by: Most Recent</option>
    <option>Highest Budget</option>
    <option>Lowest Budget</option>
    <option>Most proposals</option>
  </select>
</div>

          <div className="flex flex-col gap-5">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
className="bg-white p-6 rounded-xl border hover:shadow-lg hover:-translate-y-1 transition duration-200"              >
                <div className="flex justify-between">
                  <div>
<h3 className="font-semibold text-lg hover:text-blue-600 cursor-pointer transition">
                      {job.title}
                    </h3>
                    <p className="text-xs text-gray-500">{job.time}</p>
                  </div>
<button
  onClick={() => {
    setFavorites(prev =>
      prev.includes(job.id)
        ? prev.filter(id => id !== job.id)
        : [...prev, job.id]
    );
  }}
  className="cursor-pointer  rounded-full hover:bg-purple-50 transition text-xs px-3 py-1"

>
<Heart
  className={`w-5 h-5 transition-all duration-200 ${
    favorites.includes(job.id)
      ? "text-purple-500 fill-purple-500 scale-110"
      : "text-gray-400 hover:text-purple-400 hover:scale-110"
  }`}
/>
</button>
                </div>

                <div className="mt-3 text-blue-600 font-semibold">
                  {job.budget}
                  <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {job.type}
                  </span>
                </div>

             <div className="flex items-center gap-3 mt-3">
  
  {/* Avatar */}
  <Image
    src={job.client?.avatar || "/default-avatar.png"}
    alt={job.client?.name}
    width={40}
    height={40}
    className="rounded-full object-cover border flex-shrink-0"
  />

  {/* Info */}
  <div className="flex flex-col justify-center">
    
    <span className="text-sm font-semibold leading-tight">
      {job.client?.name || "Unknown Client"}
    </span>

    <span className="text-xs text-gray-500 flex items-center gap-1">
      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
      {job.client?.stats?.rating || "N/A"} •{" "}
      {job.client?.stats?.reviews || 0} reviews
    </span>

  </div>


                  <p className="text-xs text-gray-500">{job.location}</p>
                </div>

                <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                  {job.desc}
                </p>

                <div className="flex gap-2 mt-3 flex-wrap">
                  {job.skills.map((s, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between mt-4 items-center">
                  <p className="text-xs text-gray-500">
                    8 proposals • 1-3 months • Intermediate
                  </p>

<button className="border border-purple-500 text-purple-500 px-4 py-1 rounded-lg hover:bg-purple-50 cursor-pointer transition">
  View Details
</button>                    
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center gap-2 mt-10">
            {[1, 2, 3,4].map((p) => (
              <button
                key={p}
                className={`w-10 h-10 rounded ${p === 1 ? "bg-blue-500 text-white" : "bg-white border"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  }
