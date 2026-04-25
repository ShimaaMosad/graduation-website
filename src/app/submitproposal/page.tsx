"use client";
import { Bell, Lightbulb, MessageSquare, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import Navigation from "@/src/_components/Navigation/Navigation";
import SecoundNavbar from "@/src/_components/SecoundNavbar/SecoundNavbar";
type Work = {
  id: number;
  title: string;
  image: string;
};

export default function SubmitProposalPage() {

  // ================= STATE =================
  const [profile, setProfile] = useState({
    isVerified: true,
    hasCertifications: false,
  });

  const [selectedWorks, setSelectedWorks] = useState<number[]>([]);
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [bid, setBid] = useState<number>(3000);
  const fee = bid * 0.1;
const receive = bid - fee;
  const [delivery, setDelivery] = useState<string>("30 days");
  const [milestones, setMilestones] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // ================= DATA =================
  const works: Work[] = [
    { id: 1, title: "E-commerce Platform", image: "/images/work1.jpg" },
    { id: 2, title: "SaaS Dashboard", image: "/images/work2.jpg" },
    { id: 3, title: "API Integration Project", image: "/images/work3.jpg" },
  ];

  // ================= CALCULATE PROFILE STRENGTH =================
  const strength =
    (profile.isVerified ? 30 : 0) +
    (selectedWorks.length > 0 ? 40 : 0) +
    (profile.hasCertifications ? 30 : 0);

  // ================= HANDLERS =================
  const toggleWork = (id: number) => {
    setSelectedWorks((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newFiles = Array.from(selectedFiles);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!coverLetter.trim()) {
      alert("Cover letter is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("coverLetter", coverLetter);
      formData.append("bid", String(bid));
      formData.append("delivery", delivery);
      formData.append("milestones", String(milestones));
      formData.append("selectedWorks", JSON.stringify(selectedWorks));

      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("http://localhost:5000/api/proposals", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error");

      alert("Proposal submitted successfully 🚀");

      // reset
      setCoverLetter("");
      setBid(3000);
      setDelivery("30 days");
      setMilestones(false);
      setSelectedWorks([]);
      setFiles([]);

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen">

<SecoundNavbar/>
      {/* ================= HEADER ================= */}
             <div className="pt-[80px]">


      <div className="bg-white py-6 flex justify-center">
        <div className="w-[1200px]">
<div className="flex items-center gap-2 text-sm text-[#6B7280] mb-2">

  <Link href="/browsejob" className="hover:text-blue-500 transition">
    Browse Jobs &gt;
  </Link>

 

  <Link href="/jobdetails" className="hover:text-blue-500 transition">
    Job Details &gt;
  </Link>

  <span className="text-[#1F2937] font-medium">
    Submit Proposal
  </span>
  </div>
 <h2 className="text-2xl font-bold mt-8 text-gray-800">
            Submit Your Proposal
          </h2>
         
   </div>
  


   </div>
   </div>
   
      {/* ================= MAIN ================= */}
      <div className="w-[1200px] mx-auto py-10 flex gap-6">
<Navigation/>

        {/* ================= LEFT ================= */}
        <div className="w-[720px]">

          <div className="bg-white rounded-2xl shadow p-10">

            {/* Job Reference */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 text-sm">
                Full Stack Developer for SaaS Platform
              </h3>
              <p className="text-xs text-gray-500">TechStart Solutions</p>
              <p className="text-xs text-blue-500">$2,500 - $3,500</p>
            </div>

            {/* Divider */}
            <div className="my-6 border-t"></div>

            {/* Cover Letter */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Cover Letter *
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Explain why you're the best fit for this project
              </p>

              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                maxLength={2000}
                placeholder="Introduce yourself, highlight relevant experience..."
                className="w-full h-[280px] border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <p className="text-xs text-gray-400 text-right mt-1">
                {coverLetter.length}/2000
              </p>
            </div>

            {/* Bid + Delivery */}
            <div className="flex gap-6 mt-6">

              {/* Bid */}
<div className="flex-1">
  <label className="text-sm font-medium text-gray-700">
    Your Bid Amount (USD) *
  </label>

  <div className="relative mt-2 group">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition">
      $
    </span>

    <input
      type="number"
      value={bid}
      onChange={(e) => setBid(Number(e.target.value))}
      className="w-full h-14 border border-gray-300 rounded-xl pl-8 pr-4 
      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
      transition-all duration-200"
    />
  </div>

  <p className="text-xs text-gray-400 mt-1">
    This is how much you'll be paid
  </p>
  <p className="text-xs text-blue-500">
  Minimum bid: $100
</p>
</div>

              {/* Delivery */}
              <div className="flex-1">
                <label className="text-sm text-gray-600">
                  Delivery Time *
                </label>
                <select
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  className="w-full h-14 border rounded-lg px-4 mt-2 focus:ring-2 focus:ring-blue-400"
                >
                  {["7 days", "14 days", "30 days", "45 days", "60 days", "90 days"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

       <div className="mt-6">

<label className="flex items-center gap-2 text-sm text-gray-600">
  <input
    type="checkbox"
    checked={milestones}
    onChange={(e) => setMilestones(e.target.checked)}
  />
  Break project into milestones (Optional)
</label>

</div>
<div className="mt-6">
  <label className="text-sm text-gray-600">
    Relevant Work Samples
  </label>

  <div className="mt-4 grid grid-cols-1 gap-4">

    {works.map((work) => {
      const isSelected = selectedWorks.includes(work.id);

      return (
        <div
          key={work.id}
          onClick={() => toggleWork(work.id)}
          className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 
          ${isSelected 
            ? "border-blue-500 bg-blue-50 shadow-md" 
            : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
          }`}
        >

          {/* Top Row */}
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                 
                checked={isSelected}
                onChange={() => toggleWork(work.id)}
              />
              <span className="text-sm font-medium">
                {work.title}
              </span>
            </div>

          </div>

          {/* Image يظهر لما يتحدد */}
          {isSelected && (
            <div className="mt-3">
              
              <img
                src={work.image}
                className="w-full h-[160px] object-cover rounded-lg border"
              />
            </div>
          )}

        </div>
      );
    })}

  </div>
</div>
            {/* Upload */}
<div className="mt-6">
  <label className="text-sm text-gray-600">
    Additional Files (Optional)
  </label>

  {/* Upload Box */}
  <div
    onDrop={handleDrop}
    onDragOver={(e) => e.preventDefault()}
className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 
flex flex-col items-center justify-center text-gray-400 text-sm cursor-pointer 
hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"  >
    <input
      type="file"
      multiple
      className="hidden"
      id="fileUpload"
      onChange={(e) => handleFiles(e.target.files)}
    />

    <label htmlFor="fileUpload" className="cursor-pointer text-center">
      Drag & drop files here <br /> or <span className="text-blue-500">click to upload</span>
    </label>
  </div>

  {/* Files List */}
  {files.length > 0 && (
    <div className="mt-4 space-y-2">
      {files.map((file, index) => (
        <div
          key={index}
className="flex items-center justify-between bg-gray-100 p-3 rounded-lg 
hover:bg-gray-200 transition"        >
          <span className="text-sm text-gray-700">
            {file.name}
          </span>

          <button
            onClick={() => handleRemove(index)}
            className="text-red-500 text-sm hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )}
</div>

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              <button className="h-14 px-6 border rounded-lg text-gray-600">
                Save Draft
              </button>

 <button
  onClick={handleSubmit}
  disabled={loading}
  className={`h-14 px-8 rounded-lg text-white font-semibold transition-all
  ${loading 
    ? "bg-gray-400 cursor-not-allowed" 
    : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-105"
  }`}
>
  {loading ? "Submitting..." : "Submit Proposal →"}
</button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="w-[480px] space-y-4">

          {/* Tips */}

{/* Tips */}
<div className="bg-purple-50 p-6 rounded-xl">

  {/* Header */}
  <div className="flex items-center gap-2 mb-4">
    <Lightbulb size={22} className="text-purple-500" />
    <h3 className="font-semibold text-gray-800 text-lg">
      Tips for a Great Proposal
    </h3>
  </div>

  {/* List */}
  <ul className="text-sm text-gray-600 space-y-3">

    <li className="flex items-start gap-2">
      <CheckCircle size={16} className="text-purple-500 mt-0.5" />
      Personalize your cover letter
    </li>

    <li className="flex items-start gap-2">
      <CheckCircle size={16} className="text-purple-500 mt-0.5" />
      Highlight relevant experience
    </li>

    <li className="flex items-start gap-2">
      <CheckCircle size={16} className="text-purple-500 mt-0.5" />
      Be realistic with timeline
    </li>

    <li className="flex items-start gap-2">
      <CheckCircle size={16} className="text-purple-500 mt-0.5" />
      Competitive pricing
    </li>

    <li className="flex items-start gap-2">
      <CheckCircle size={16} className="text-purple-500 mt-0.5" />
      Include portfolio
    </li>

  </ul>
</div>


   
    


          {/* Profile Strength */}
        <div className="bg-white p-6 rounded-xl shadow">
  <h3 className="font-semibold text-gray-700 mb-2">
    Profile Strength
  </h3>

  <p className="text-2xl font-bold text-purple-500">
    {strength}%
  </p>

  {/* Progress Bar */}
  <div className="w-full bg-gray-200 h-2 rounded mt-2">
    <div
      className="bg-purple-500 h-2 rounded transition-all duration-500"
      style={{ width: `${strength}%` }}
    ></div>
  </div>

  {/* Details */}
  <ul className="text-sm mt-3 space-y-1">

    <li className={profile.isVerified ? "text-green-500" : "text-gray-400"}>
      {profile.isVerified ? "✓" : "✗"} AI Verified
    </li>

   <li className={selectedWorks.length > 0 ? "text-green-500" : "text-gray-400"}>
  {selectedWorks.length > 0 ? "✓" : "✗"} Portfolio added
</li>

    <li className={profile.hasCertifications ? "text-green-500" : "text-yellow-500"}>
      {profile.hasCertifications ? "✓" : "⚠"} Add certifications
    </li>

  </ul>
</div>
<div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
  
  <h3 className="font-semibold text-gray-700 mb-4">
    Estimated Earnings
  </h3>

  {/* Bid */}
  <div className="flex justify-between items-center text-sm mb-2">
    <span className="text-gray-500">Your Bid</span>
    <span className="font-semibold text-gray-800">
      ${bid}
    </span>
  </div>

  {/* Fee */}
  <div className="flex justify-between items-center text-sm mb-2">
    <span className="text-gray-500">Service Fee (10%)</span>
    <span className="text-red-500 font-medium">
      -${fee.toFixed(2)}
    </span>
  </div>

  {/* Divider */}
  <div className="border-t my-3"></div>

  {/* Receive */}
  <div className="flex justify-between items-center">
    <span className="text-gray-700 font-medium">
      You’ll Receive
    </span>
<span className="text-green-500 text-lg font-bold transition-all duration-300">
  ${receive.toFixed(2)}
</span>
  </div>

  {/* Note */}
  <p className="text-xs text-gray-400 mt-3">
    After successful completion
  </p>
</div>
        </div>

      </div>
    </div>
    
  );
  
}
