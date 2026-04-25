"use client";

import Link from "next/link";
import {
  Check,
  Clock3,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Proposal } from "@/lib/proposals-api";

type ProposalCardProps = {
  proposal: Proposal;
  onShortlist: (id: number) => void;
  onReject: (id: number) => void;
  onHire: (id: number) => void;
};

export default function ProposalCard({
  proposal,
  onShortlist,
  onReject,
  onHire,
}: ProposalCardProps) {
  const [expanded, setExpanded] = useState(false);

  const shortText =
    proposal.coverLetter.length > 250
      ? proposal.coverLetter.slice(0, 250) + "..."
      : proposal.coverLetter;

  const fullStars = Math.floor(proposal.rating);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">

      {/* ===== TOP ===== */}
      <div className="flex flex-col justify-between gap-8 lg:flex-row">

        {/* LEFT */}
        <div className="flex gap-5">
          <img
            src={proposal.avatar}
            alt={proposal.freelancerName}
            className="h-20 w-20 rounded-full object-cover"
          />

          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {proposal.freelancerName}
            </h2>

            <p className="mt-1 text-lg text-slate-500">
              {proposal.role}
            </p>

            {proposal.verified && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-white">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm font-semibold">AI Verified</span>
              </div>
            )}

            <div className="mt-3 flex items-center gap-2 text-slate-500">
              <MapPin className="h-5 w-5" />
              <span>{proposal.location}</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < fullStars ? "fill-current" : ""}`}
              />
            ))}
            <span className="ml-2 font-bold text-slate-900">
              {proposal.rating}
            </span>
          </div>

          <p className="mt-2 text-green-600 font-semibold">
            {proposal.successRate}% Success Rate
          </p>

          <p className="text-sm text-slate-500">
            Response: {proposal.responseTime}
          </p>
        </div>
      </div>

      {/* ===== INFO ===== */}
      <div className="mt-8 grid md:grid-cols-3 gap-6 border-b pb-6">

        <div>
          <p className="text-slate-500">Bid</p>
          <p className="text-3xl font-bold text-blue-500">
            ${proposal.bidAmount}
          </p>
        </div>

        <div className="flex gap-2">
          <Clock3 />
          <div>
            <p className="text-slate-500">Delivery</p>
            <p className="font-semibold">{proposal.deliveryDays} days</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Clock3 />
          <div>
            <p className="text-slate-500">Submitted</p>
            <p>{proposal.submittedText}</p>
          </div>
        </div>
      </div>

      {/* ===== COVER LETTER ===== */}
      <div className="mt-6">
        <h3 className="font-bold text-xl">Cover Letter</h3>

        <p className="mt-2 text-slate-600">
          {expanded ? proposal.coverLetter : shortText}
        </p>

        {proposal.coverLetter.length > 250 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-500 mt-2"
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>

      {/* ===== SKILLS ===== */}
      <div className="mt-6">
        <h3 className="font-bold text-xl">Skills</h3>

        <div className="flex flex-wrap gap-2 mt-2">
          {proposal.skills.map((skill) => (
            <span
              key={skill}
              className="bg-violet-100 text-violet-600 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* ===== WORK ===== */}
      <div className="mt-6">
        <h3 className="font-bold text-xl">Work Samples</h3>

        <div className="flex gap-3 mt-2">
          {proposal.workSamples.map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-24 h-20 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>

      {/* ===== ACTIONS ===== */}
      <div className="mt-6 flex flex-wrap gap-3">

        <Link
          href="/profile"
          className="border px-4 py-2 rounded-lg text-blue-500 border-blue-500"
        >
          View Profile
        </Link>

        <button
          onClick={() => alert("Message sent")}
          className="border px-4 py-2 rounded-lg text-violet-500 border-violet-500 flex gap-2"
        >
          <MessageCircle className="w-4" />
          Message
        </button>

        <button
          onClick={() => onShortlist(proposal.id)}
          className="border px-4 py-2 rounded-lg text-gray-600"
        >
          Shortlist
        </button>

        <button
          onClick={() => onReject(proposal.id)}
          className="border px-4 py-2 rounded-lg text-red-500 border-red-500"
        >
          Reject
        </button>

        <button
          onClick={() => onHire(proposal.id)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-lg flex gap-2"
        >
          <Check className="w-4" />
          Hire
        </button>

      </div>
    </div>
  );
}