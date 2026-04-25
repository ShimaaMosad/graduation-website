"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

import SecoundNavbar from "@/src/_components/SecoundNavbar/SecoundNavbar";
import ProposalCard from "@/src/_components/ProposalCard";
import { getProposalsByJobId, Proposal } from "@/src/lib/proposals-api";
import { getJobById } from "@/src/lib/api";

type TabType = "All Proposals" | "Shortlisted" | "Interviewed" | "Rejected";
type SortType = "Best Match" | "Lowest Bid" | "Highest Rating" | "Fastest Delivery";

export default function ProposalsPage() {
  const params = useParams();
  const jobId = Number(params.id);

  const [proposals, setProposals] = useState<Proposal[]>(
    Number.isNaN(jobId) ? [] : getProposalsByJobId(jobId)
  );
  const [activeTab, setActiveTab] = useState<TabType>("All Proposals");
  const [sortBy, setSortBy] = useState<SortType>("Best Match");

  const job = Number.isNaN(jobId) ? undefined : getJobById(jobId);

  const counts = useMemo(() => {
    return {
      all: proposals.length,
      shortlisted: proposals.filter((p) => p.status === "Shortlisted").length,
      interviewed: proposals.filter((p) => p.status === "Interviewed").length,
      rejected: proposals.filter((p) => p.status === "Rejected").length,
    };
  }, [proposals]);

  const filtered = useMemo(() => {
    let result = [...proposals];

    if (activeTab === "Shortlisted") {
      result = result.filter((p) => p.status === "Shortlisted");
    } else if (activeTab === "Interviewed") {
      result = result.filter((p) => p.status === "Interviewed");
    } else if (activeTab === "Rejected") {
      result = result.filter((p) => p.status === "Rejected");
    }

    if (sortBy === "Lowest Bid") {
      result.sort((a, b) => a.bidAmount - b.bidAmount);
    } else if (sortBy === "Highest Rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Fastest Delivery") {
      result.sort((a, b) => a.deliveryDays - b.deliveryDays);
    } else {
      result.sort((a, b) => b.successRate - a.successRate);
    }

    return result;
  }, [proposals, activeTab, sortBy]);

  const changeStatus = (id: number, status: Proposal["status"]) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const handleShortlist = (id: number) => {
    changeStatus(id, "Shortlisted");
    alert("Added to shortlist");
  };

  const handleReject = (id: number) => {
    changeStatus(id, "Rejected");
    alert("Proposal rejected");
  };

  const handleHire = (id: number) => {
    changeStatus(id, "Interviewed");
    alert("Moved to interview / hired flow");
  };

  const tabs = [
    { label: "All Proposals" as TabType, count: counts.all },
    { label: "Shortlisted" as TabType, count: counts.shortlisted },
    { label: "Interviewed" as TabType, count: counts.interviewed },
    { label: "Rejected" as TabType, count: counts.rejected },
  ];

  return (

    <main className="min-h-screen bg-[#f5f6f8]">
      <SecoundNavbar />

      <section className="mx-auto max-w-[1500px] px-4 py-10 md:px-8">
        <div className="mb-8 flex items-center gap-3 text-[18px] text-slate-500">
          <Link href="/" className="hover:text-slate-900">
            My Jobs
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/jobs/${jobId}`} className="hover:text-slate-900">
            Job Details
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-slate-900">Proposals</span>
        </div>

        <h1 className="text-5xl font-bold text-slate-900">
          Proposals for: {job?.title ?? "Unknown Job"}
        </h1>
        <p className="mt-4 text-[22px] text-slate-500">
          {proposals.length} freelancers have submitted proposals
        </p>

        <div className="mt-10 rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-8">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.label;

                return (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(tab.label)}
                    className={`border-b-2 pb-3 text-[20px] font-medium ${
                      isActive
                        ? "border-blue-500 text-blue-500"
                        : "border-transparent text-slate-600"
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="rounded-2xl border border-slate-200 px-6 py-4 pr-12 text-[18px] outline-none"
              >
                <option>Best Match</option>
                <option>Lowest Bid</option>
                <option>Highest Rating</option>
                <option>Fastest Delivery</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {filtered.length > 0 ? (
            filtered.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onShortlist={handleShortlist}
                onReject={handleReject}
                onHire={handleHire}
              />
            ))
          ) : (
            <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-2xl text-slate-500 shadow-sm">
              No proposals found.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}