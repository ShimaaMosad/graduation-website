"use client";

import React, { useState } from "react";
import { Bell, Calendar, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/src/_components/Navigation/Navigation";
import SecoundNavbar from "@/src/_components/SecoundNavbar/SecoundNavbar";
export default function PostJobPage() {
  const [form, setForm] = useState({
  title: "",
  category: "",
  subcategory: "",
  description: "",
  skills: ["React", "Node.js"],
  budgetType: "fixed",
  budgetFrom: "",
  budgetTo: "",
  hourlyRate: "",
  duration: "",
  experience: "intermediate", 
  visibility: "public",         
  deadline: "",               
});
const handleFiles = (e: any) => {
  setFiles([...e.target.files]);
};
const [loading, setLoading] = useState(false);
const [skillInput, setSkillInput] = useState("");
const [files, setFiles] = useState<File[]>([]);
const addSkill = (e: any) => {
  if (e.key === "Enter") {
    e.preventDefault();

    if (!skillInput.trim()) return;

    setForm((prev) => ({
      ...prev,
      skills: [...new Set([...prev.skills, skillInput.trim()])],
    }));

    setSkillInput("");
  }
};
const removeSkill = (skill: string) => {
  setForm((prev) => ({
    ...prev,
    skills: prev.skills.filter((s) => s !== skill),
  }));
};
const handleChange = (key: string, value: any) => {
  setForm((prev) => ({
    ...prev,
    [key]: value,
  }));
};
const handleSubmit = async () => {
  setLoading(true);

const formData = new FormData();

Object.entries(form).forEach(([key, value]) => {
  if (key !== "skills") {
if (value !== undefined && value !== null) {
  formData.append(key, String(value));
}  }
});

form.skills.forEach((skill) => {
formData.append("skills", JSON.stringify(form.skills));});

files.forEach((file) => {
formData.append("files[]", file);})
  try {
    const res = await fetch("https://your-api.com/jobs", {
  method: "POST",
  body: formData,

  
    });

    if (!res.ok) throw new Error("Failed");

    await res.json();

    alert("Job posted successfully!");

// reset form
setForm({
  title: "",
  category: "",
  subcategory: "",
  description: "",
  skills: [],
  budgetType: "fixed",
  budgetFrom: "",
  budgetTo: "",
  hourlyRate: "",
  duration: "",
  experience: "intermediate",
  visibility: "public",
  deadline: "",
});

setFiles([]);
  } catch (err) {
    console.error(err);
    alert("Error posting job");
  } finally {
    setLoading(false);
  }
};
const isBasicFilled = form.title && form.category;

const isDetailsFilled =
  form.description && form.skills.length > 0;

const isBudgetFilled =
  form.budgetType === "fixed"
    ? form.budgetFrom && form.budgetTo
    : form.hourlyRate;

const isReviewReady =
  isBasicFilled && isDetailsFilled && isBudgetFilled;
  const steps = [
  { name: "Basic Info", active: isBasicFilled },
  { name: "Details", active: isDetailsFilled },
  { name: "Budget", active: isBudgetFilled },
  { name: "Review", active: isReviewReady },
];
const [activeStep, setActiveStep] = useState(0);
   const [search, setSearch] = React.useState("");
 
  return (
    <div className="bg-[#F9FAFB] min-h-screen">

        <SecoundNavbar/>
        
      {/* ================= HEADER ================= */}
             <div className="pt-[80px]">


      <div className="bg-white py-6 flex justify-center">
        <div className="w-[1200px]">
<div className="flex items-center gap-2 text-sm text-[#6B7280] mb-2">

  <Link href="/" className="hover:text-blue-500 transition">
    Home
  </Link>

  <span>&gt;</span>

  <span className="text-[#1F2937] font-medium">
    Post a Job
  </span>

</div>

          


          <h1 className="text-[32px] font-bold text-[#1F2937]">
            Post a New Job
          </h1>

          <p className="text-[#6B7280] mt-1">
            Find the perfect freelancer for your project
          </p>

        </div>
      </div>

      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex justify-center py-10">
                <Navigation/>
        
        <div className="w-[800px] bg-white rounded-2xl shadow p-10">

          {/* ================= STEPS ================= */}
          <div className="flex items-center justify-between mb-10">
{["Basic Info", "Details", "Budget", "Review"].map((step, i) => (
  <div key={i} className="flex-1 flex items-center">
    <div className="flex flex-col items-center flex-1">
      
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold
        ${activeStep === i ? "bg-[#3B82F6]" : "bg-[#E5E7EB] text-[#6B7280]"}`}
      >
        {i + 1}
      </div>

      <p
        className={`text-xs mt-2 ${
          activeStep === i ? "text-[#3B82F6]" : "text-gray-400"
        }`}
      >
        {step}
      </p>

    </div>

    {i !== 3 && (
      <div className="h-[2px] flex-1 bg-[#E5E7EB]"></div>
    )}
  </div>
))}
          </div>

          {/* ================= BASIC INFO ================= */}
<Section title="Basic Information" onFocus={() => setActiveStep(0)}>
<Input
  label="Job Title *"
  placeholder="Full Stack Developer..."
  value={form.title}
  onChange={(e: any) => handleChange("title", e.target.value)}
/>
<Select
  label="Category *"
  options={["Web Development","Mobile","Design"]}
  value={form.category}
  onChange={(e: any) => handleChange("category", e.target.value)}
/>
<Select
  label="Subcategory"
  options={["Frontend","Backend","Full Stack"]}
  value={form.subcategory}
  onChange={(e: any) => handleChange("subcategory", e.target.value)}
/>
          </Section>

          {/* ================= DESCRIPTION ================= */}
<Section title="Job Description" onFocus={() => setActiveStep(1)}>
<TextArea
  label="Description *"
  value={form.description}
  onChange={(e: any) => handleChange("description", e.target.value)}
/>
<TagInput
  skills={form.skills}
  skillInput={skillInput}
  setSkillInput={setSkillInput}
  addSkill={addSkill}
  removeSkill={removeSkill}
/>
<Upload files={files} setFiles={setFiles} />
          </Section>

          {/* ================= BUDGET ================= */}
<Section title="Budget & Timeline" onFocus={() => setActiveStep(2)}>
            <div className="mb-6">
              <label className="text-sm text-[#6B7280] mb-2 block">
                Budget Type *
              </label>

              <div className="flex gap-6">
             <Radio
  label="Fixed Price"
  checked={form.budgetType === "fixed"}
  onClick={() => handleChange("budgetType", "fixed")}
/>

<Radio
  label="Hourly Rate"
  checked={form.budgetType === "hourly"}
  onClick={() => handleChange("budgetType", "hourly")}
/>
              </div>
            </div>
{form.budgetType === "fixed" ? (
  <div className="flex gap-4 mb-6">
    
    <Input
      type="number"
      min="0"
      max="10000"
      placeholder="From $"
      value={form.budgetFrom}
      onChange={(e :any) => handleChange("budgetFrom", +e.target.value)}
    />

    <Input
      type="number"
      min="0"
      max="10000"
      placeholder="To $"
      value={form.budgetTo}
      onChange={(e :any) => handleChange("budgetTo", +e.target.value)}
    />

  </div>
) : (
  <Input
    type="number"
    min="0"
    placeholder="$ per hour"
    value={form.hourlyRate}
    onChange={(e :any) => handleChange("hourlyRate", +e.target.value)}
  />
)}
<Select
  label="Duration"
  options={["1-3 months", "3-6 months"]}
  value={form.duration}
  onChange={(e: any) => handleChange("duration", e.target.value)}
/>      <div>
      <label className="text-sm text-[#6B7280] mb-2 block">
        Project Deadline *
      </label>

      <div className="relative w-[350px]">
        
        <Calendar
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="date"
 value={form.deadline}
  onChange={(e) => handleChange("deadline", e.target.value)}

className="w-full h-[56px] border border-[#E5E7EB] rounded-lg pl-10 pr-4 outline-none focus:border-[#3B82F6]"
        />
      </div>
    </div>
  </Section>


<Section title="Additional Details" onFocus={() => setActiveStep(3)}>

     

      {/* ================= EXPERIENCE ================= */}
      <div className="mb-8">
        <label className="text-sm text-[#6B7280] mb-3 block">
          Freelancer Experience Level
        </label>

<div className="flex flex-col gap-3">

  <RadioOption
    label="Entry Level"
    checked={form.experience === "entry"}
    onClick={() => handleChange("experience", "entry")}
  />

  <RadioOption
    label="Intermediate"
    checked={form.experience === "intermediate"}
    onClick={() => handleChange("experience", "intermediate")}
  />

  <RadioOption
    label="Expert"
    checked={form.experience === "expert"}
    onClick={() => handleChange("experience", "expert")}
  />
</div>

      {/* ================= VISIBILITY ================= */}
      <div>
        <label className="text-sm text-[#6B7280] m-3 block">
          Who can see this job?
        </label>

     <div className="flex flex-col gap-3">

  <RadioOption
    label="Public (Anyone can view and apply)"
    checked={form.visibility === "public"}
    onClick={() => handleChange("visibility", "public")}
  />

  <RadioOption
    label="Invite Only (Only freelancers you invite)"
    checked={form.visibility === "invite"}
    onClick={() => handleChange("visibility", "invite")}
  />

</div>

        </div>
      </div>

    </Section>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex justify-center gap-4 mt-10">

            <button className="h-[56px] px-6 border border-gray-300 rounded-lg text-gray-600">
              Save Draft
            </button>

            <button className="h-[56px] px-6 border-2 border-[#3B82F6] text-[#3B82F6] rounded-lg">
              Preview
            </button>

<button
  disabled={loading}
  onClick={handleSubmit}
  className={`h-[56px] px-8 rounded-lg font-semibold text-white
  ${loading ? "bg-gray-400" : "bg-gradient-to-r from-[#3B82F6] to-[#2563EB]"}`}
>
  {loading ? "Posting..." : "Post Job →"}
</button>
          </div>

        </div>
      </div>
    </div>
  );
}function Section({ title, children, onFocus }: any) {
  return (
    <div
      className="mb-10"
onFocusCapture={onFocus}    >
      <h2 className="text-xl font-semibold mb-6 text-[#1F2937]">
        {title}
      </h2>
      <div className="space-y-6">{children}</div>
    </div>
  );

}function Input({ label, placeholder, value, onChange , type = "text" }: any) {
  return (
    <div>
      {label && <label className="text-sm text-[#6B7280] mb-2 block">{label}</label>}
      <input
       type={type} 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-[56px] border border-[#E5E7EB] rounded-lg px-4 focus:border-[#3B82F6] outline-none"
      />
    </div>
  );

}function Select({ label, options, value, onChange }: any) {
  return (
    <div>
      {label && (
        <label className="text-sm text-[#6B7280] mb-2 block">
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        className="w-full h-[56px] border border-[#E5E7EB] rounded-lg px-4"
      >
        {options.map((o: string) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}function TextArea({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm text-[#6B7280] mb-2 block">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        className="w-full h-[200px] border border-[#E5E7EB] rounded-lg  focus:border-[#3B82F6] outline-none  p-4"
        placeholder="Describe your project..."
      />
    </div>
  );

}function Radio({ label, checked, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2 cursor-pointer"
    >
      <div
        className={`w-5 h-5 rounded-full border-2 ${
          checked ? "border-[#3B82F6]" : "border-gray-300"
        } flex items-center justify-center`}
      >
        {checked && <div className="w-2.5 h-2.5 bg-[#3B82F6] rounded-full" />}
      </div>
      <span className="text-sm text-[#1F2937]">{label}</span>
    </div>
  );
}function TagInput({
  skills,
  setSkillInput,
  skillInput,
  addSkill,
  removeSkill,
}: any) {  return (
    <div>
      <label className="text-sm text-[#6B7280] mb-2 block">
        Required Skills *
      </label>

      <div className="border border-[#E5E7EB] rounded-lg p-3 flex flex-wrap gap-2">
{skills.map((tag: string) => (
  <span
    key={tag}
    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-2"
  >
    {tag}
    <button onClick={() => removeSkill(tag)}>✕</button>
  </span>
))}
<input
  value={skillInput}
  onChange={(e) => setSkillInput(e.target.value)}
  onKeyDown={addSkill}
  placeholder="Type..."
  className="outline-none flex-1"
/>      </div>
    </div>
  );
}
function Upload({ files, setFiles }: any) {
  const handleFiles = (e: any) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev: any) => [...prev, ...selected]);
  };
  const removeFile = (index: number) => {
    setFiles((prev: any) => prev.filter((_: any, i: number) => i !== index));
  };
  return (
    <div>
      <label className="text-sm text-[#6B7280] mb-2 block">
        Attachments
      </label>

      {/* Drop zone */}
      <label className="border-2 border-dashed border-[#E5E7EB] rounded-lg h-[120px] flex flex-col items-center justify-center text-gray-400 cursor-pointer">
        <p>Click or drag & drop files</p>
        <span className="text-xs">PDF, DOC, ZIP</span>

        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
      </label>

      {/* Preview files */}
      <div className="mt-3 space-y-2">
        {files.map((file: File, i: number) => (
          <div
            key={i}
            className="flex items-center justify-between border p-2 rounded"
          >
            <span className="text-sm">{file.name}</span>

            <button
              onClick={() => removeFile(i)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadioOption({ label, checked, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer"
    >
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
        ${checked ? "border-[#3B82F6]" : "border-[#E5E7EB]"}`}
      >
        {checked && (
          <div className="w-2.5 h-2.5 bg-[#3B82F6] rounded-full" />
        )}
      </div>

      <span className="text-sm text-[#1F2937]">
        {label}
      </span>
    </div>
  );
}