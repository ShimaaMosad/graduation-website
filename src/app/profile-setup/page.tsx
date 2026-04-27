"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Check,
  Trash2,
  Sparkles,
  ShieldCheck,
  User,
} from "lucide-react";
import {
  getProfileSetupData,
  saveProfileDraft,
  submitProfileStep,
  generateBioWithAI,
  ProfileSetupData,
  LanguageItem,
} from "@/src/lib/profileSetupApi";

const languageOptions = ["Arabic", "English", "French", "German", "Spanish"];

const levelOptions = [
  "Native or Bilingual",
  "Fluent",
  "Professional",
  "Intermediate",
  "Basic",
];

export default function ProfileSetupPage() {
  const router = useRouter();

  const [data, setData] = useState<ProfileSetupData | null>(null);
  const [photo, setPhoto] = useState<string>("");
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfileSetupData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const selectedSkills = useMemo(() => {
    return data?.skills.filter((s) => s.selected) || [];
  }, [data]);

  function updateField<K extends keyof ProfileSetupData>(
    key: K,
    value: ProfileSetupData[K]
  ) {
    if (!data) return;

    setData({ ...data, [key]: value });
    setErrors({ ...errors, [key]: "" });
    setMessage("");
  }

  function validate() {
    if (!data) return false;

    const newErrors: Record<string, string> = {};

    if (!data.professionalTitle.trim()) {
      newErrors.professionalTitle = "Professional title is required";
    }

    if (!data.hourlyRate.trim()) {
      newErrors.hourlyRate = "Hourly rate is required";
    } else if (Number(data.hourlyRate) <= 0 || isNaN(Number(data.hourlyRate))) {
      newErrors.hourlyRate = "Hourly rate must be a valid number";
    }

    if (!data.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!data.bio.trim()) {
      newErrors.bio = "Professional bio is required";
    } else if (data.bio.length < 30) {
      newErrors.bio = "Bio must be at least 30 characters";
    } else if (data.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
    }

    if (selectedSkills.length === 0) {
      newErrors.skills = "Select at least one skill";
    }

    if (selectedSkills.length > 15) {
      newErrors.skills = "You can select up to 15 skills only";
    }

    if (data.languages.length === 0) {
      newErrors.languages = "Add at least one language";
    }

    data.languages.forEach((item) => {
      if (!item.language || !item.level) {
        newErrors.languages = "Every language must have language and level";
      }
    });

    Object.entries(data.socialLinks).forEach(([key, value]) => {
      if (value && !value.startsWith("http")) {
        newErrors[key] = "URL must start with http or https";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, photo: "Please upload a valid image" });
      return;
    }

    const url = URL.createObjectURL(file);
    setPhoto(url);
    setErrors({ ...errors, photo: "" });
  }

  function toggleSkill(id: number) {
    if (!data) return;

    const clicked = data.skills.find((s) => s.id === id);
    if (!clicked) return;

    if (!clicked.selected && selectedSkills.length >= 15) {
      setErrors({ ...errors, skills: "You can select up to 15 skills only" });
      return;
    }

    setData({
      ...data,
      skills: data.skills.map((skill) =>
        skill.id === id ? { ...skill, selected: !skill.selected } : skill
      ),
    });

    setErrors({ ...errors, skills: "" });
    setMessage("");
  }

  function addSkill() {
    if (!data) return;

    const value = skillInput.trim();
    if (!value) return;

    const selectedNow = data.skills.filter((s) => s.selected);

    if (selectedNow.length >= 15) {
      setErrors({ ...errors, skills: "You can select up to 15 skills only" });
      return;
    }

    const exists = data.skills.find(
      (skill) => skill.name.toLowerCase() === value.toLowerCase()
    );

    if (exists) {
      setData({
        ...data,
        skills: data.skills.map((skill) =>
          skill.id === exists.id ? { ...skill, selected: true } : skill
        ),
      });

      setSkillInput("");
      setErrors({ ...errors, skills: "" });
      setMessage("");
      return;
    }

    setData({
      ...data,
      skills: [
        ...data.skills,
        {
          id: Date.now(),
          name: value,
          selected: true,
        },
      ],
    });

    setSkillInput("");
    setErrors({ ...errors, skills: "" });
    setMessage("");
  }

  function updateLanguage(id: number, key: keyof LanguageItem, value: string) {
    if (!data) return;

    setData({
      ...data,
      languages: data.languages.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    });

    setErrors({ ...errors, languages: "" });
    setMessage("");
  }

  function addLanguage() {
    if (!data) return;

    setData({
      ...data,
      languages: [
        ...data.languages,
        {
          id: Date.now(),
          language: "English",
          level: "Intermediate",
        },
      ],
    });

    setMessage("");
  }

  function removeLanguage(id: number) {
    if (!data) return;

    setData({
      ...data,
      languages: data.languages.filter((item) => item.id !== id),
    });

    setMessage("");
  }

  async function handleGenerateBio() {
    if (!data) return;

    const bio = await generateBioWithAI(
      data.professionalTitle || "Professional Freelancer",
      selectedSkills.map((s) => s.name)
    );

    updateField("bio", bio);
  }

  async function handleSaveDraft() {
    if (!data) return;

    await saveProfileDraft(data);
    setMessage("Draft saved successfully.");
  }

  async function handleContinue() {
    if (!data) return;

    const isValid = validate();

    if (!isValid) {
      setMessage("Please complete all required information before continuing.");
      return;
    }

    const res = await submitProfileStep(data);
    setMessage("Profile step completed successfully.");

    router.push(res.nextStep);
  }

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7fa]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const filteredSkills = data.skills.filter((skill) =>
    skill.name.toLowerCase().includes(skillInput.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#f7f7fa] px-6 py-8 text-[#17151f]">
      <section className="mx-auto w-[85%] max-w-[1600px]">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-[36px] font-bold tracking-tight">
              Welcome to MySite, {data.fullName}!
            </h1>
            <p className="mt-2 text-[17px] text-gray-600">
              Let's build your professional profile to help clients find you.
            </p>
          </div>

          <div className="flex h-[100px] w-[230px] items-center gap-4 rounded-xl border border-purple-100 bg-[#fff7ff] px-5 shadow-sm">
            <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full border-[6px] border-purple-600 text-sm font-bold text-purple-700">
              {data.profileStrength}%
            </div>
            <div>
              <p className="text-[16px] font-semibold">Profile Strength</p>
              <p className="text-sm text-gray-500">Intermediate</p>
            </div>
          </div>
        </div>

        <div className="relative mb-9">
          <div className="absolute left-0 top-[15px] h-[4px] w-full bg-purple-100" />
          <div className="absolute left-0 top-[15px] h-[4px] w-[35%] bg-purple-700" />

          <div className="relative flex justify-between">
            {[
              ["Account", "✓", true],
              ["Profile", "2", true],
              ["Preferences", "3", false],
              ["Verify", "4", false],
            ].map(([label, number, active]) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    active
                      ? "bg-purple-700 text-white shadow-md"
                      : "bg-[#e6deeb] text-gray-600"
                  }`}
                >
                  {number === "✓" ? <Check size={16} /> : number}
                </div>
                <p
                  className={`text-sm ${
                    active ? "text-purple-700" : "text-gray-700"
                  }`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-[#fff7ff] p-8 shadow-sm">
          <h2 className="mb-8 text-[28px] font-bold">
            Step 2: Tell Us About Yourself
          </h2>

          <div className="flex gap-8 border-b border-purple-100 pb-9">
            <div className="relative h-[135px] w-[135px] shrink-0 rounded-full border-2 border-dashed border-purple-200 bg-[#e9e2f0]">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-gray-500" />
              )}

              <label className="absolute bottom-0 right-0 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-purple-700 text-white shadow-lg">
                <Camera size={18} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="pt-1">
              <h3 className="text-[22px] font-bold">Profile Photo</h3>
              <p className="mt-3 text-[15px] text-gray-600">
                A professional photo helps build trust with potential clients.
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] text-gray-700">
                <li>Use a clear, well-lit headshot.</li>
                <li>Ensure your face is clearly visible.</li>
                <li>Avoid busy backgrounds.</li>
              </ul>

              {errors.photo && (
                <p className="mt-2 text-sm text-red-600">{errors.photo}</p>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block text-[15px] font-medium">
                Professional Title <span className="text-red-500">*</span>
              </label>
              <input
                value={data.professionalTitle}
                onChange={(e) =>
                  updateField("professionalTitle", e.target.value)
                }
                className="h-11 w-full rounded-md border border-purple-200 bg-transparent px-4 text-[16px] outline-none focus:border-purple-600"
              />
              {errors.professionalTitle && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.professionalTitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-[15px] font-medium">
                  Hourly Rate ($USD) <span className="text-red-500">*</span>
                </label>
                <input
                  value={data.hourlyRate}
                  onChange={(e) => updateField("hourlyRate", e.target.value)}
                  className="h-11 w-full rounded-md border border-purple-200 bg-transparent px-4 text-[16px] outline-none focus:border-purple-600"
                />
                {errors.hourlyRate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.hourlyRate}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[15px] font-medium">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  value={data.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="h-11 w-full rounded-md border border-purple-200 bg-transparent px-4 text-[16px] outline-none focus:border-purple-600"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.location}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-[15px] font-medium">
                  Professional Bio <span className="text-red-500">*</span>
                </label>

                <button
                  type="button"
                  onClick={handleGenerateBio}
                  className="flex items-center gap-1 text-[15px] font-medium text-purple-700"
                >
                  <Sparkles size={16} />
                  Generate with AI
                </button>
              </div>

              <textarea
                value={data.bio}
                maxLength={500}
                onChange={(e) => updateField("bio", e.target.value)}
                placeholder="Describe your experience, skills, and what makes you unique..."
                className="h-[125px] w-full resize-none rounded-md border border-purple-200 bg-transparent px-4 py-3 text-[16px] outline-none focus:border-purple-600"
              />

              <div className="mt-2 flex justify-between">
                <p className="text-sm text-red-600">{errors.bio}</p>
                <p className="text-sm text-gray-700">
                  {data.bio.length} / 500 characters
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[15px] font-medium">
                Skills (Select up to 15)
              </label>

              <input
                value={skillInput}
                onChange={(e) => {
                  setSkillInput(e.target.value);
                  setErrors({ ...errors, skills: "" });
                  setMessage("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Search skills or press Enter to add..."
                className="h-11 w-full rounded-md border border-purple-200 bg-transparent px-4 text-[16px] outline-none focus:border-purple-600"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {filteredSkills.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleSkill(skill.id)}
                    className={`rounded-full px-3.5 py-1.5 text-[13px] ${
                      skill.selected
                        ? "bg-purple-700 text-white"
                        : "bg-[#e3dfe8] text-gray-700"
                    }`}
                  >
                    {skill.name} {skill.selected ? "×" : "+"}
                  </button>
                ))}
              </div>

              {skillInput && filteredSkills.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  Press Enter to add "{skillInput}"
                </p>
              )}

              {errors.skills && (
                <p className="mt-2 text-sm text-red-600">{errors.skills}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[15px] font-medium">
                Languages
              </label>

              <div className="space-y-3">
                {data.languages.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_1fr_34px] gap-3"
                  >
                    <select
                      value={item.language}
                      onChange={(e) =>
                        updateLanguage(item.id, "language", e.target.value)
                      }
                      className="h-11 rounded-md border border-purple-200 bg-transparent px-4 text-[16px] outline-none"
                    >
                      {languageOptions.map((lang) => (
                        <option key={lang}>{lang}</option>
                      ))}
                    </select>

                    <select
                      value={item.level}
                      onChange={(e) =>
                        updateLanguage(item.id, "level", e.target.value)
                      }
                      className="h-11 rounded-md border border-purple-200 bg-transparent px-4 text-[16px] outline-none"
                    >
                      {levelOptions.map((level) => (
                        <option key={level}>{level}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => removeLanguage(item.id)}
                      className="flex items-center justify-center text-red-600"
                    >
                      <Trash2 size={19} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addLanguage}
                className="mt-3 text-[15px] font-medium text-purple-700"
              >
                + Add Language
              </button>

              {errors.languages && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.languages}
                </p>
              )}
            </div>

            <div className="border-t border-purple-100 pt-7">
              <h3 className="text-[20px] font-bold">Social Links</h3>
              <p className="mt-1 text-[15px] text-gray-600">
                Connect your profiles to showcase your work.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                {[
                  ["linkedin", "link LinkedIn URL"],
                  ["github", "link GitHub URL"],
                  ["portfolio", "langPersonal Portfolio URL"],
                  ["twitter", "link Twitter URL"],
                ].map(([key, placeholder]) => (
                  <div key={key}>
                    <input
                      value={
                        data.socialLinks[key as keyof typeof data.socialLinks]
                      }
                      onChange={(e) =>
                        updateField("socialLinks", {
                          ...data.socialLinks,
                          [key]: e.target.value,
                        })
                      }
                      placeholder={placeholder}
                      className="h-11 w-full rounded-md border border-purple-200 bg-transparent px-4 text-[16px] outline-none focus:border-purple-600"
                    />
                    {errors[key] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {message && (
              <p
                className={`text-[15px] font-medium ${
                  message.includes("successfully")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <div className="flex justify-end gap-5 border-t border-purple-100 pt-6">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="rounded-md px-5 py-3 text-[15px] font-medium text-gray-800 hover:bg-purple-50"
              >
                Save as Draft
              </button>

              <button
                type="button"
                onClick={handleContinue}
                className="rounded-md bg-purple-700 px-8 py-3 text-[15px] font-semibold text-white shadow hover:bg-purple-800"
              >
                Continue
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-indigo-600">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h3 className="text-[19px] font-bold">
                Coming Up: AI Identity Verification
              </h3>
              <p className="text-[15px] text-gray-600">
                Get the "Verified" badge faster with our automated ID check in
                Step 4.
              </p>
            </div>
          </div>

          <button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-purple-700">
            Boost Visibility
          </button>
        </div>
      </section>
    </main>
  );
}