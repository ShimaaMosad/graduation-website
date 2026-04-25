"use client";

import React, { useEffect } from "react";
import {
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  BadgeCheck,
  Heart,
  Share2,
  Bell,
  MessageSquare,
  Search,
  Eye,
  TrendingUp,
  Star,
  File,
  Briefcase,
  Users,
  Download,
  FileText,
  CheckCircle,
  Check,
  Sparkles,
  User,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import Navigation from "@/src/_components/Navigation/Navigation";
import SecoundNavbar from "@/src/_components/SecoundNavbar/SecoundNavbar";

/* ================= TYPES ================= */

type Client = {
  name: string;
  image: string;
  verified: boolean;
  location: string;
  postedAt: string;
  rating: number;
  reviews: number;
  spent?: number;
  hireRate?: number;
};

type Job = {
  id: number;
  title: string;
  description: string;
  postedAt: string;
  views: number;
  proposals: number;
  duration: string;
  deadline: string;
  experience: string;
  location: string;

  budget: {
    min: number;
    max: number;
  };

  client: Client;

  skills: string[];
  deliverables: string[];

  files: {
    name: string;
    size: string;
    url: string;
  }[];
};

type SimilarJob = {
  id: number;
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
  };
  proposals: number;
};

/* =================  DATA ================= */

const MOCK_JOB = {
  job: {
    id: 1,
    title: "Frontend Developer ",
    description: "We need a React developer for a dashboard project",
    postedAt: "2 hours ago",
    views: 120,
    proposals: 8,
    duration: "2 weeks",
    deadline: "2026-05-01",
    experience: "Intermediate",
    location: "Remote",

    budget: {
      min: 500,
      max: 1200,
    },

    client: {
      name: "Ahmed Ali",
      image: "/images/client2.jfif",
      location: "Cairo, Egypt",
      verified: true,
      postedAt: "Member since 2022",
      rating: 4.8,
      reviews: 120,
       spent: 18.5,
      hireRate: 75,
    },

    deliverables: ["Responsive UI", "API integration", "Dashboard charts"],

    skills: ["React", "Next.js", "Tailwind"],

    files: [
      {
        name: "Requirements.pdf",
        size: "2.4 MB",
        url: "#",
      },
    ],
  },

  similarJobs: [
    {
      id: 2,
      title: "UI Developer",
      description: "Build modern UI components",
      budget: { min: 300, max: 800 },
      proposals: 5,
    },
    {
      id: 3,
      title: "React Dashboard",
      description: "Admin dashboard project",
      budget: { min: 700, max: 1500 },
      proposals: 12,
    },
  ],
};

/* ================= PAGE ================= */

export default function JobDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [search, setSearch] = React.useState("");
  const [job, setJob] = React.useState<Job | null>(null);
  const [similarJobs, setSimilarJobs] = React.useState<SimilarJob[]>([]);

  /* ================= static data ================= */
  
  useEffect(() => {
    const fetchMockJob = async () => {
      setTimeout(() => {
        setJob(MOCK_JOB.job);
        setSimilarJobs(MOCK_JOB.similarJobs);
      }, 500);
    };

    fetchMockJob();
  }, [params.id]); 
  /*
useEffect(() => {
  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/jobs/${params.id}`);

      if (!res.ok) {
        throw new Error("Failed to fetch job");
      }

      const data = await res.json();

      setJob(data.job);
      setSimilarJobs(data.similarJobs);
    } catch (error) {
      console.error(error);
    }
  };

  fetchJob();
}, [params.id]); */

  if (!job) {
  return (
    <div className="p-10 text-center text-gray-500">
      Loading job details...
    </div>
  );
}
  return (

    <div className="bg-[#F9FAFB] min-h-screen">
<SecoundNavbar/>

      {/* ================= HEADER ================= */}
        <div className="pt-[80px]">

<div className="w-full bg-white h-[80px] flex items-center justify-center border-b">
  <div className="w-[1200px] text-sm text-[#6B7280] flex items-center gap-2">
    
   <Link href="/browsejob" className="hover:text-purple-500 transition">
      Browse Jobs  &gt;
   </Link>
    
    
    <Link href="/jobs/" className="hover:text-purple-500 transition">
      {job.title} &gt;
    </Link>
    
    
    <span className="text-[#1F2937] font-medium">
      Job Details
    </span>

  </div>
</div>
</div>
      
      {/* ================= MAIN ================= */}
      <div className="w-full flex justify-center py-10">
               <Navigation/>
       
        <div className="w-[1200px] flex gap-6">

          {/* ================= LEFT ================= */}
          <div className="w-[800px] flex flex-col gap-6">

            {/* ================= JOB HEADER ================= */}
            <div className="bg-white rounded-2xl p-8 shadow">
              <h1 className="text-[28px] font-bold text-[#1F2937]">
                {job.title}            
                </h1>

              {/* Meta */}
<div className="flex gap-4 text-sm text-[#6B7280] mt-4 items-center">
  <span className="flex items-center gap-1">
    <Clock size={16} /> {job.postedAt}
  </span>

  <span>•</span>

  <span className="flex items-center gap-1">
    <Eye size={16} /> {job.views} views
  </span>

  <span>•</span>

  <span className="text-[#3B82F6] font-semibold">
                    {job.proposals} proposals
  </span>
</div>

{/* ================= CLIENT ================= */}
<div className="flex gap-4 mt-6 items-start">

  {/* Image */}
  <Image
    src={job.client.image}
  alt={job.client.name}
    width={56}
    height={56}
    className="rounded-full object-cover"
  />

  {/* Info */}
  <div className="flex flex-col">

    {/* Name + Verified */}
    <div className="flex items-center gap-2">
      <h3 className="text-lg font-semibold text-[#1F2937]">
    {job.client.name}
      </h3>

      <span className="bg-[#3B82F6] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
        <BadgeCheck size={14} /> Verified
      </span>
    </div>

    {/* Location */}
    <div className="text-sm text-[#6B7280] flex items-center gap-1 mt-1">
      <MapPin size={14} />   {job.client.location}

    </div>

    {/* Member */}
    <div className="text-xs text-[#9CA3AF] mt-1">
  {job.client.postedAt}
    </div>

    {/* Rating */}
    <div className="flex items-center gap-1 text-sm mt-2">
      <div className="flex text-[#F59E0B]">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14}  
           fill={i < Math.round(job.client.rating) ? "#F59E0B" : "none"}
        stroke="#F59E0B"
         />
        ))}
      </div>

      <span className="ml-1 text-[#1F2937] font-medium"> 
           {job.client.rating}
</span>
      <span className="text-gray-400 text-xs">
            ({job.client.reviews} Reviews)
</span>
    </div>
</div>

  </div>
  
{/* ================= ACTIONS ================= */}
<div className="flex border-t pt-3 gap-4 mt-6">


<Link href="/submitproposal">
  <button className="w-[200px] h-[56px] bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition cursor-pointer">
    Submit Proposal
  </button>
</Link>

 
<Link href="/saved-jobs">
  <button className="w-[140px] h-[56px] border-2 border-[#8B5CF6] text-[#8B5CF6] rounded-lg flex items-center justify-center gap-2 hover:bg-[#8B5CF6] hover:text-white transition">
    <Heart size={18} /> Save job
  </button>
</Link>
<Link href="/share">
  <button className="w-[48px] h-[48px] border rounded-lg flex items-center justify-center hover:bg-gray-100 transition">
    <Share2 size={18} />
  </button>
</Link>

</div>


</div>

{/* ================= DESCRIPTION ================= */}
<div className="bg-white rounded-2xl p-8 shadow space-y-8">

  {/* About */}
  <div>
    <h2 className="text-lg font-semibold text-[#1F2937] flex items-center gap-2">
      <FileText size={18} /> About the Project
    </h2>

    <p className="text-[#6B7280] leading-7 mt-3">
       {job.description}

    </p>
  </div>

  {/* Deliverables */}
  <div>
    <h2 className="text-lg font-semibold text-[#1F2937] flex items-center gap-2">
      <CheckCircle size={18} /> Deliverables
    </h2>

    <ul className="mt-3 space-y-2">
       {job.deliverables.map((item, i) => (
        <li key={i} className="flex items-center gap-2 text-[#6B7280]">
          <Check size={16} className="text-green-500" />
          {item}
        </li>
      ))}
    </ul>
  </div>

  {/* Skills */}
  <div>
    <h2 className="text-lg font-semibold text-[#1F2937] flex items-center gap-2">
      <Sparkles size={18} /> Required Skills
    </h2>

    <div className="flex flex-wrap gap-2 mt-3">
  {job.skills.map((skill) => (
        <span
          key={skill}
          className="bg-[#EEF2FF] text-[#6366F1] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#6366F1] hover:text-white transition"
        >
          {skill}
        </span>
      ))}
    </div>


</div>
<div>
  <h2 className="text-lg font-semibold text-[#1F2937] flex items-center gap-2">
    <FileText size={18} /> Project Files
  </h2>
{job.files?.length > 0 && (
  <div className="mt-3 space-y-3">
    {job.files.map((file, index) => (
      <div key={index} className="flex items-center justify-between bg-[#F9FAFB] p-3 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <File size={18} className="text-[#3B82F6]" />
          <span>{file.name} ({file.size})</span>
        </div>

        <a href={file.url} download className="flex items-center gap-1 text-[#8B5CF6] hover:text-[#6366F1] font-medium text-sm">
          <Download size={16} /> Download
        </a>
      </div>
    ))}
  </div>
)}
</div>
            </div>

{/* ================= SIMILAR JOBS ================= */}
<div className="bg-white rounded-2xl p-8 shadow">
  
  <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[#1F2937]">
    <Briefcase size={18} /> Similar Jobs You Might Like
  </h2>

  <div className="grid gap-4">
    {similarJobs.map((job) => (
      
      <div
        key={job.id}
        className="border p-5 rounded-xl hover:border-[#8B5CF6] hover:shadow-md transition cursor-pointer group"
      >
        
        {/* Title */}
        <h3 className="font-semibold text-[#1F2937] group-hover:text-[#8B5CF6] transition">
          {job.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                {job.description}
  </p>

        {/* Bottom */}
        <div className="flex justify-between items-center mt-4">
          
          {/* Budget */}
          <span className="flex items-center gap-1 text-[#8B5CF6] font-medium">
            <DollarSign size={16} />          
              ${job.budget.min} - ${job.budget.max}

          </span>

          {/* Proposals */}
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Users size={14} /> {job.proposals} proposals
          </span>

        </div>

      </div>
    ))}
  </div>
</div>

          </div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <div className="w-[400px] flex flex-col gap-4">

            {/* Project Details */}
            <div className="bg-white rounded-xl p-6 shadow space-y-4">
              <h3 className="font-semibold text-lg">Project Details</h3>

              <Detail icon={<DollarSign />} label="Budget"       value={`$${job.budget.min} - $${job.budget.max}`} />
              <Detail icon={<Calendar />} label="Duration" value={job.duration} />
              <Detail icon={<Clock />} label="Deadline"       value={job.deadline} />
              <Detail icon={<BadgeCheck />} label="Experience"       value={job.experience}/>
              <Detail icon={<MapPin />} label="Location"       value={job.location} />

              <div className="border-t pt-3 ">
                {job.proposals} freelancers applied
              </div>
              <span className=" text-sm text-gray-500">Last proposal: {job.postedAt}

</span>
            </div>

{/* About Client */}
<div className="bg-white rounded-xl p-6 shadow space-y-5">

  <h3 className="font-semibold text-lg text-[#1F2937]">
    About Client
  </h3>

  <div className="grid grid-cols-2 gap-4 text-center">

    <Stat 
      icon={DollarSign} 
      title={`${job.client.spent ?? "0"}k`} 
      label="Spent" 
    />

    <Stat 
      icon={Briefcase} 
      title={job.client.reviews ?? 0} 
      label="Jobs" 
    />

    <Stat 
      icon={TrendingUp} 
      title={`${job.client.hireRate ?? 0}%`} 
      label="Hire Rate" 
    />

    <Stat 
      icon={Star} 
      title={job.client.rating ?? 0} 
      label="Rating" 
    />
  </div>
</div>
<button className="w-full border border-[#3B82F6] text-[#3B82F6] py-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-[#3B82F6] hover:text-white transition">
  <User size={18} />
  View Profile
</button>
            </div>
          </div>
        </div>
      </div>
  );
}
function Detail({ icon, label, value }: any) {
  return (
    <div className="flex gap-3 items-center">
      <div className="text-[#3B82F6]">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, title, label }: any) {
  return (
    <div className="bg-[#F9FAFB] p-4 rounded-xl flex flex-col items-center gap-2">
      
      {/* ICON */}
      <Icon size={18} className="text-[#8B5CF6]" />

      {/* VALUE */}
      <p className="font-bold text-[#1F2937]">{title}</p>

      {/* LABEL */}
      <p className="text-xs text-gray-500">{label}</p>

    </div>
  );
}