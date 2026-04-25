"use client";

import { useMemo, useState } from "react";
import SecoundNavbar from "@/src/_components/SecoundNavbar/SecoundNavbar";

import {

  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Check,
  CircleDollarSign,
  Clock3,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  Star,
  UserCheck,
  X,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

type ClientProfile = {
  fullName: string;
  companyName: string;
  location: string;
  website: string;
  memberSince: string;
  verifiedClient: boolean;
  tagline: string;
  about: string;
  industries: string[];
  skillsNeeded: string[];
  projectTypes: string;
  budgetRange: string;
  preferredLocation: string;
  totalJobs: number;
  hiredFreelancers: number;
  totalSpent: string;
  clientRating: number;
  avgResponse: string;
  paymentVerified: boolean;
  industry: string;
  companySize: string;
  founded: string;
  websiteLabel: string;
  companyLocation: string;
  trustItems: string[];
};

type JobPosting = {
  id: number;
  title: string;
  budget: string;
  postedAgo: string;
  proposalsSubmitted: number;
  tags: string[];
};

type Review = {
  id: number;
  reviewer: string;
  avatar: string;
  rating: number;
  timeAgo: string;
  text: string;
  projectFor: string;
};

const initialProfile: ClientProfile = {
  fullName: "John Williams",
  companyName: "TechStart Solutions",
  location: "San Francisco, USA",
  website: "https://techstart.com",
  memberSince: "Member since Jan 2023",
  verifiedClient: true,
  tagline: "TechStart Solutions",
  about:
    "TechStart Solutions is a leading technology company specializing in SaaS products for small and medium-sized businesses. We're passionate about innovation and building long-term partnerships with talented developers and designers.",
  industries: ["Technology", "SaaS", "B2B"],
  skillsNeeded: ["React", "Node.js", "Python", "AWS"],
  projectTypes: "Web Development, Mobile Apps, API Integration",
  budgetRange: "$500 - $5,000 per project",
  preferredLocation: "Remote, Global",
  totalJobs: 24,
  hiredFreelancers: 18,
  totalSpent: "$18,500",
  clientRating: 4.8,
  avgResponse: "4 hours",
  paymentVerified: true,
  industry: "Technology",
  companySize: "11-50 employees",
  founded: "2019",
  websiteLabel: "techstart.com",
  companyLocation: "San Francisco, CA",
  trustItems: [
    "Seriousness Deposit: Active",
    "Identity Verified",
    "Email Verified",
    "Payment Method Added",
  ],
};

const activeJobs: JobPosting[] = [
  {
    id: 1,
    title: "Full Stack Developer for SaaS Platform",
    budget: "$2,500 - $3,500",
    postedAgo: "2 days ago",
    proposalsSubmitted: 8,
    tags: ["React", "Node.js", "PostgreSQL"],
  },
  {
    id: 2,
    title: "UI/UX Designer for Mobile App",
    budget: "$1,500 - $2,000",
    postedAgo: "5 days ago",
    proposalsSubmitted: 12,
    tags: ["Figma", "UI Design", "Mobile"],
  },
];

const reviewsData: Review[] = [
  {
    id: 1,
    reviewer: "Ahmed Saleh",
    avatar: "https://i.pravatar.cc/100?img=15",
    rating: 5,
    timeAgo: "1 month ago",
    text: "Great client! Clear requirements, prompt payment, and excellent communication throughout the project. Would definitely work with again.",
    projectFor: "E-commerce Website Development",
  },
  {
    id: 2,
    reviewer: "Sara Mohamed",
    avatar: "https://i.pravatar.cc/100?img=20",
    rating: 5,
    timeAgo: "2 months ago",
    text: "John is an excellent client to work with. Professional, responsive, and pays on time. The project scope was well-defined and there were no surprises.",
    projectFor: "Mobile App Design",
  },
  {
    id: 3,
    reviewer: "Michael Chen",
    avatar: "https://i.pravatar.cc/100?img=12",
    rating: 4.5,
    timeAgo: "3 months ago",
    text: "Good experience overall. Communication was clear and payment was prompt. Would recommend.",
    projectFor: "API Integration",
  },
];

/*
BACKEND NOTES

Replace the mock state in this page with real API calls.

Suggested endpoints:

GET    /client/profile
PUT    /client/profile
GET    /client/jobs
GET    /client/reviews
POST   /client/report

Suggested report body:

{
  "reason": "Client requested suspicious payment flow"
}
*/

function SectionCard({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm ${className}`}>
      {title ? <h2 className="mb-6 text-[28px] font-bold text-slate-900">{title}</h2> : null}
      {children}
    </div>
  );
}

function Pill({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-blue-100 px-4 py-2 text-[15px] font-medium text-blue-600">
      {text}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full;
        const half = i === full && hasHalf;
        return (
          <Star
            key={i}
            className={`h-5 w-5 ${
              filled || half ? "fill-amber-400 text-amber-400" : "text-amber-400"
            }`}
          />
        );
      })}
    </div>
  );
}

function StatBox({
  icon,
  value,
  label,
  valueColor = "text-slate-900",
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  valueColor?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-center">
      <div>{icon}</div>
      <div className={`text-[22px] font-bold ${valueColor}`}>{value}</div>
      <div className="text-[15px] text-slate-500">{label}</div>
    </div>
  );
}

export default function ClientPage() {
  const [savedProfile, setSavedProfile] = useState<ClientProfile>(initialProfile);
  const [draftProfile, setDraftProfile] = useState<ClientProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(savedProfile) !== JSON.stringify(draftProfile);
  }, [savedProfile, draftProfile]);

  const visibleReviews = showAllReviews ? reviewsData : reviewsData.slice(0, 3);

  const handleChange =
    (field: keyof ClientProfile) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setDraftProfile((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSave = () => {
    setSavedProfile(draftProfile);
    setIsEditing(false);
    setShowSuccessModal(true);
  };

  const handleCancelEdit = () => {
    setDraftProfile(savedProfile);
    setIsEditing(false);
  };

  const handleDiscardChanges = () => {
    setDraftProfile(savedProfile);
  };

  const handleSubmitReport = () => {
    setShowReportModal(false);
    setReportReason("");
    setShowSuccessModal(true);
  };

  if (isEditing) {
    return (
      <main className="min-h-screen bg-[#f5f6f8]">
        <SecoundNavbar />

        <section className="border-b border-slate-200 pt-20 bg-slate-100">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
            <div className="flex items-center gap-3 text-[18px] font-semibold text-slate-900">
              <Pencil className="h-6 w-6 text-blue-500" />
              <span>Edit Mode - Update your client profile</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                className="rounded-2xl border-2 border-blue-500 bg-white px-8 py-4 text-xl font-semibold text-blue-500"
                onClick={() => setIsEditing(false)}
              >
                Preview Profile
              </button>

              <button
                className="rounded-2xl bg-blue-600 px-8 py-4 text-xl font-semibold text-white shadow-md"
                onClick={handleSave}
              >
                <span className="inline-flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Save Changes
                </span>
              </button>

              <button
                className="text-lg text-slate-500"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 py-8 md:px-8">
          <div className="mx-auto max-w-2xl space-y-6">
            <div>
              <label className="mb-2 block text-lg font-medium text-slate-600">Full Name *</label>
              <input
                value={draftProfile.fullName}
                onChange={handleChange("fullName")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-[18px] outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-lg font-medium text-slate-600">Company Name</label>
              <input
                value={draftProfile.companyName}
                onChange={handleChange("companyName")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-[18px] outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-lg font-medium text-slate-600">Location *</label>
              <input
                value={draftProfile.location}
                onChange={handleChange("location")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-[18px] outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-lg font-medium text-slate-600">Company Website</label>
              <input
                value={draftProfile.website}
                onChange={handleChange("website")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-[18px] outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-lg font-medium text-slate-600">About</label>
              <textarea
                value={draftProfile.about}
                onChange={handleChange("about")}
                rows={5}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-[18px] outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-lg font-medium text-slate-600">Budget Range</label>
              <input
                value={draftProfile.budgetRange}
                onChange={handleChange("budgetRange")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-[18px] outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-lg font-medium text-slate-600">Preferred Location</label>
              <input
                value={draftProfile.preferredLocation}
                onChange={handleChange("preferredLocation")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-[18px] outline-none"
              />
            </div>
          </div>
        </section>

        {hasUnsavedChanges && (
          <div className="sticky bottom-0 z-40 border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8">
              <div className="text-[18px] font-semibold text-amber-500">
                You have unsaved changes
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  className="rounded-2xl border-2 border-slate-400 px-8 py-4 text-xl font-semibold text-slate-600"
                  onClick={handleDiscardChanges}
                >
                  <span className="inline-flex items-center gap-2">
                    <X className="h-5 w-5" />
                    Discard Changes
                  </span>
                </button>

                <button
                  className="rounded-2xl bg-blue-600 px-8 py-4 text-xl font-semibold text-white shadow-md"
                  onClick={handleSave}
                >
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Save Changes
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-xl">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-center text-2xl font-bold text-slate-900">Success</h2>
              <p className="mt-3 text-center text-[18px] text-slate-500">
                Your changes were saved successfully.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="mt-6 w-full rounded-2xl bg-blue-600 px-6 py-4 text-xl font-semibold text-white"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <SecoundNavbar />

      <section className="border-b pt-20 border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-10 md:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg">
                <img
                  src="https://i.pravatar.cc/160?img=12"
                  alt="client"
                  className="h-full w-full object-cover"
                />
              </div>

              <h1 className="text-[52px] font-bold tracking-tight text-slate-900">
                {savedProfile.fullName}
              </h1>

              <p className="mt-2 text-[22px] text-slate-500">{savedProfile.tagline}</p>

              <div className="mt-3 flex items-center gap-2 text-[20px] text-slate-500">
                <MapPin className="h-5 w-5" />
                <span>{savedProfile.location}</span>
              </div>

              <p className="mt-2 text-[18px] text-slate-400">{savedProfile.memberSince}</p>

              {savedProfile.verifiedClient && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-white">
                  <BadgeCheck className="h-5 w-5" />
                  <span className="text-[17px] font-semibold">Verified Client</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end justify-center gap-5">
              <div className="text-right">
                <div className="text-[24px] font-bold text-blue-500">{savedProfile.totalSpent}</div>
                <div className="text-[18px] text-slate-500">{savedProfile.totalJobs} jobs</div>
              </div>

              <button
                className="rounded-2xl bg-blue-600 px-8 py-4 text-2xl font-semibold text-white shadow-md"
                onClick={() => setShowSuccessModal(true)}
              >
                <span className="inline-flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Message
                </span>
              </button>

              <button
                className="text-lg text-slate-500"
                onClick={() => setShowReportModal(true)}
              >
                Report
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-8 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.8fr_0.95fr]">
          <div className="space-y-8">
            <SectionCard title="About">
              <p className="text-[20px] leading-10 text-slate-600">{savedProfile.about}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {savedProfile.industries.map((item) => (
                  <Pill key={item} text={item} />
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Looking For">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-[18px] font-medium text-slate-500">Skills Needed</h3>
                  <div className="flex flex-wrap gap-3">
                    {savedProfile.skillsNeeded.map((skill) => (
                      <Pill key={skill} text={skill} />
                    ))}
                  </div>

                  <h3 className="mb-4 mt-8 text-[18px] font-medium text-slate-500">Project Types</h3>
                  <p className="text-[20px] leading-9 text-slate-600">{savedProfile.projectTypes}</p>
                </div>

                <div>
                  <h3 className="mb-4 text-[18px] font-medium text-slate-500">Budget Range</h3>
                  <p className="text-[20px] leading-9 text-slate-900">{savedProfile.budgetRange}</p>

                  <h3 className="mb-4 mt-8 text-[18px] font-medium text-slate-500">Preferred Location</h3>
                  <p className="text-[20px] leading-9 text-slate-600">{savedProfile.preferredLocation}</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <h2 className="text-[28px] font-bold text-slate-900">Active Job Postings</h2>
                <span className="rounded-full bg-blue-100 px-4 py-2 text-[16px] font-medium text-blue-600">
                  3 open positions
                </span>
              </div>

              <div className="space-y-5">
                {activeJobs.map((job) => (
                  <div key={job.id} className="rounded-[24px] border border-slate-200 p-6">
                    <h3 className="text-[24px] font-bold text-slate-900">{job.title}</h3>

                    <div className="mt-4 flex flex-wrap items-center gap-6 text-[18px] text-slate-400">
                      <span className="font-semibold text-blue-500">{job.budget}</span>
                      <span>{job.postedAgo}</span>
                      <span>{job.proposalsSubmitted} proposals submitted</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      {job.tags.map((tag) => (
                        <Pill key={tag} text={tag} />
                      ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button className="rounded-2xl border-2 border-blue-500 px-8 py-4 text-2xl font-semibold text-blue-500">
                        View Job
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button className="text-[22px] font-medium text-blue-500">
                  View All Jobs →
                </button>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-[28px] font-bold text-slate-900">Reviews</h2>

                <div className="flex items-center gap-3">
                  <span className="text-[20px] font-bold text-slate-900">{savedProfile.clientRating}</span>
                  <Stars rating={savedProfile.clientRating} />
                  <span className="text-[20px] text-slate-500">(42 reviews)</span>
                </div>
              </div>

              <div className="space-y-6">
                {visibleReviews.map((review, index) => (
                  <div key={review.id} className={index !== 0 ? "border-t border-slate-200 pt-6" : ""}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <img
                          src={review.avatar}
                          alt={review.reviewer}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-[20px] font-bold text-slate-900">{review.reviewer}</h3>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[18px] font-semibold text-slate-900">{review.rating}</span>
                            <Stars rating={review.rating} />
                          </div>
                        </div>
                      </div>

                      <span className="text-[18px] text-slate-400">{review.timeAgo}</span>
                    </div>

                    <p className="mt-4 text-[20px] leading-9 text-slate-600">{review.text}</p>
                    <p className="mt-2 text-[18px] text-slate-400">For: {review.projectFor}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <button
                  className="rounded-2xl bg-blue-600 px-8 py-4 text-2xl font-semibold text-white shadow-md"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>

                <button
                  className="rounded-2xl border-2 border-blue-500 px-10 py-4 text-2xl font-semibold text-blue-500"
                  onClick={() => setShowAllReviews((prev) => !prev)}
                >
                  {showAllReviews ? "Show Less Reviews" : "Load More Reviews"}
                </button>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-8">
            <SectionCard title="Client Statistics">
              <div className="grid grid-cols-2 gap-8">
                <StatBox
                  icon={<BriefcaseBusiness className="h-10 w-10 text-blue-500" />}
                  value={`${savedProfile.totalJobs}`}
                  label="Total Jobs"
                />
                <StatBox
                  icon={<UserCheck className="h-10 w-10 text-emerald-500" />}
                  value={`${savedProfile.hiredFreelancers} freelancers`}
                  label="Hired"
                />
                <StatBox
                  icon={<CircleDollarSign className="h-10 w-10 text-amber-500" />}
                  value={savedProfile.totalSpent}
                  label="Total Spent"
                />
                <StatBox
                  icon={<Star className="h-10 w-10 text-amber-500" />}
                  value={`${savedProfile.clientRating}★`}
                  label="Client Rating"
                />
                <StatBox
                  icon={<Clock3 className="h-10 w-10 text-blue-500" />}
                  value={savedProfile.avgResponse}
                  label="Avg Response"
                />
                <StatBox
                  icon={<Check className="h-10 w-10 text-emerald-500" />}
                  value={savedProfile.paymentVerified ? "Verified" : "Unverified"}
                  label="Payment Status"
                  valueColor="text-emerald-500"
                />
              </div>
            </SectionCard>

            <SectionCard className="border-emerald-100 bg-emerald-50">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-white">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[15px] font-semibold">Payment Verified</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="mb-4 h-16 w-16 text-emerald-500" />
                <p className="text-[22px] text-slate-800">
                  This client has verified payment methods
                </p>
              </div>
            </SectionCard>

            <SectionCard title="Company Details">
              <div className="space-y-5 text-[19px]">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Industry:</span>
                  <span className="font-semibold text-slate-900">{savedProfile.industry}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Company Size:</span>
                  <span className="font-semibold text-slate-900">{savedProfile.companySize}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Founded:</span>
                  <span className="font-semibold text-slate-900">{savedProfile.founded}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Website:</span>
                  <span className="font-semibold text-blue-500">{savedProfile.websiteLabel}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-900">{savedProfile.companyLocation}</span>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Trust & Safety">
              <div className="space-y-5">
                {savedProfile.trustItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[18px] text-slate-800">
                    {idx === 0 ? (
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    ) : idx === 1 ? (
                      <BadgeCheck className="h-5 w-5 text-blue-500" />
                    ) : idx === 2 ? (
                      <Mail className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Building2 className="h-5 w-5 text-emerald-500" />
                    )}
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard>
              <button
                onClick={() => setShowReportModal(true)}
                className="w-full text-center text-[20px] font-medium text-slate-500 transition hover:text-red-500"
              >
                Report this client
              </button>
            </SectionCard>
          </div>
        </div>
      </section>

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>

            <h2 className="mb-3 text-center text-2xl font-bold text-slate-900">
              Report Client
            </h2>

            <p className="mb-6 text-center text-[18px] text-slate-500">
              Are you sure you want to report this client?
            </p>

            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Optional: Describe the issue..."
              className="mb-6 h-28 w-full rounded-2xl border border-slate-200 p-4 outline-none"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowReportModal(false)}
                className="rounded-2xl border border-slate-300 px-6 py-3 text-slate-600"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitReport}
                className="rounded-2xl bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>

            <h2 className="text-center text-2xl font-bold text-slate-900">
              Success
            </h2>

            <p className="mt-3 text-center text-[18px] text-slate-500">
              Your action was completed successfully.
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-6 w-full rounded-2xl bg-blue-600 px-6 py-4 text-xl font-semibold text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}