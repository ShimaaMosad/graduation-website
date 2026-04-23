"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Upload,
  MapPin,
  Globe,
  Save,
  X,
  Plus,
} from "lucide-react";

export default function FreelancerProfileEdit() {
  const router = useRouter();

  const initialForm = {
    name: "Mostafa Ahmed",
    title: "Full Stack Developer",
    location: "Cairo, Egypt",
    languages: "English, Arabic",
    hourlyRate: 45,
    about:
      "I'm a passionate Full Stack Developer with over 5 years of experience...",
  };

  const [form, setForm] = useState(initialForm);

  const [skills, setSkills] = useState([
    "React",
    "Node.js",
    "AWS",
    "MongoDB",
  ]);

  const [newSkill, setNewSkill] = useState("");

  /* ================= CANCEL ================= */
  const handleCancel = () => {
    setForm(initialForm);
    setSkills(["React", "Node.js", "AWS", "MongoDB"]);
    setNewSkill("");
    router.push("/freelancer");
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
    console.log("FORM:", form);
    console.log("SKILLS:", skills);
    router.push("/freelancer/savechanges");
  };

  /* ================= ADD SKILL ================= */
  const handleAddSkill = () => {
    const skill = newSkill.trim();

    if (!skill) return;

    const exists = skills.some(
      (s) => s.toLowerCase() === skill.toLowerCase()
    );

    if (exists) {
      setNewSkill("");
      return;
    }

    setSkills((prev) => [...prev, skill]);
    setNewSkill("");
  };

  /* ================= REMOVE SKILL ================= */
  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  /* ================= INPUT STYLE (PURPLE FOCUS) ================= */
  const inputStyle =
    "w-full mt-1 h-11 px-4 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500";

  return (
    <main className="min-h-screen bg-[#F9FAFB]">

      {/* COVER */}
      <section className="h-[220px] bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] relative">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <div className="relative">
            <Image
              src="/images/profile.jfif"
              alt="profile"
              width={140}
              height={140}
              className="rounded-full border-4 border-white"
            />

            <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow">
              <Upload className="w-4 h-4 text-purple-600" />
            </button>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="max-w-[900px] mx-auto mt-24 bg-white p-8 rounded-2xl shadow-sm space-y-6">

        <h1 className="text-2xl font-bold text-gray-800">
          Edit Profile
        </h1>

        {/* NAME */}
        <div>
          <label className="text-sm text-gray-600">Full Name</label>
          <input
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className={inputStyle}
          />
        </div>

        {/* TITLE */}
        <div>
          <label className="text-sm text-gray-600">Title</label>
          <input
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className={inputStyle}
          />
        </div>

        {/* LOCATION + LANGUAGES */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="text-sm text-gray-600">Location</label>
            <div className="flex items-center gap-2 border rounded-lg px-3 mt-1 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
              <MapPin className="w-4 h-4 text-gray-400" />
              <input
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                className="w-full h-11 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Languages</label>
            <div className="flex items-center gap-2 border rounded-lg px-3 mt-1 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
              <Globe className="w-4 h-4 text-gray-400" />
              <input
                value={form.languages}
                onChange={(e) =>
                  setForm({ ...form, languages: e.target.value })
                }
                className="w-full h-11 outline-none"
              />
            </div>
          </div>
        </div>

        {/* HOURLY RATE */}
        <div>
          <label className="text-sm text-gray-600">Hourly Rate ($)</label>
          <input
            type="number"
            value={form.hourlyRate}
            onChange={(e) =>
              setForm({ ...form, hourlyRate: Number(e.target.value) })
            }
            className={inputStyle}
          />
        </div>

        {/* ABOUT */}
        <div>
          <label className="text-sm text-gray-600">About</label>
          <textarea
            rows={5}
            value={form.about}
            onChange={(e) =>
              setForm({ ...form, about: e.target.value })
            }
            className={`${inputStyle} h-auto py-3`}
          />
        </div>

        {/* SKILLS */}
        <div>
          <label className="text-sm text-gray-600">Skills</label>

          <div className="flex flex-wrap gap-2 mt-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleRemoveSkill(skill)}
                />
              </span>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddSkill();
              }}
              placeholder="Add new skill"
              className="border px-3 py-2 rounded-lg w-full 
              outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />

            <button
              onClick={handleAddSkill}
              className="bg-purple-600 text-white px-4 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={handleCancel}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </section>
    </main>
  );
}