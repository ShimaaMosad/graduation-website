"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Bell, Briefcase, ShieldCheck } from "lucide-react";
import {
  getPreferencesData,
  savePreferencesDraft,
  submitPreferences,
  PreferenceData,
} from  "../../lib/preferencesApi";

const categories = [
  "Web Design",
  "UI/UX Design",
  "Mobile App Design",
  "Brand Identity",
  "Frontend Development",
  "Product Design",
];

const projectTypes = ["Fixed Price", "Hourly", "Long Term", "One-time Project"];

const availabilityOptions = [
  "Less than 10 hrs/week",
  "10 - 20 hrs/week",
  "20 - 30 hrs/week",
  "More than 30 hrs/week",
];

const experienceOptions = ["Beginner", "Intermediate", "Expert"];

const workModes = ["Remote", "Hybrid", "On-site"];

export default function PreferencesPage() {
  const [data, setData] = useState<PreferenceData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getPreferencesData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  function toggleArrayItem(key: "categories" | "projectTypes", value: string) {
    if (!data) return;

    const exists = data[key].includes(value);

    setData({
      ...data,
      [key]: exists
        ? data[key].filter((item) => item !== value)
        : [...data[key], value],
    });

    setErrors({ ...errors, [key]: "" });
    setMessage("");
  }

  function updateField<K extends keyof PreferenceData>(
    key: K,
    value: PreferenceData[K]
  ) {
    if (!data) return;
    setData({ ...data, [key]: value });
    setErrors({ ...errors, [key]: "" });
    setMessage("");
  }

  function validate() {
    if (!data) return false;

    const newErrors: Record<string, string> = {};

    if (data.categories.length === 0) {
      newErrors.categories = "Please select at least one category.";
    }

    if (data.projectTypes.length === 0) {
      newErrors.projectTypes = "Please select at least one project type.";
    }

    if (!data.availability) {
      newErrors.availability = "Availability is required.";
    }

    if (!data.experienceLevel) {
      newErrors.experienceLevel = "Experience level is required.";
    }

    if (!data.workMode) {
      newErrors.workMode = "Work mode is required.";
    }

    if (!data.minBudget.trim()) {
      newErrors.minBudget = "Minimum budget is required.";
    } else if (Number(data.minBudget) <= 0 || isNaN(Number(data.minBudget))) {
      newErrors.minBudget = "Minimum budget must be a valid number.";
    }

    if (!data.maxBudget.trim()) {
      newErrors.maxBudget = "Maximum budget is required.";
    } else if (Number(data.maxBudget) <= 0 || isNaN(Number(data.maxBudget))) {
      newErrors.maxBudget = "Maximum budget must be a valid number.";
    }

    if (
      data.minBudget &&
      data.maxBudget &&
      Number(data.minBudget) >= Number(data.maxBudget)
    ) {
      newErrors.maxBudget =
        "Maximum budget must be greater than minimum budget.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSaveDraft() {
    if (!data) return;
    await savePreferencesDraft(data);
    setMessage("Draft saved successfully.");
  }

  async function handleContinue() {
    if (!data) return;

    if (!validate()) {
      setMessage("Please complete all required information before continuing.");
      return;
    }

    const res = await submitPreferences(data);
setMessage("Preferences completed successfully.");

router.push(res.nextStep);

    // router.push(res.nextStep);
  }

  if (loading || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7fa]">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7fa] px-6 py-8 text-[#17151f]">
      <section className="mx-auto w-[85%] max-w-[1600px]">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-[36px] font-bold tracking-tight">
              Set Your Work Preferences
            </h1>
            <p className="mt-2 text-[17px] text-gray-600">
              Help us recommend the most suitable jobs and clients for you.
            </p>
          </div>

          <div className="flex h-[100px] w-[230px] items-center gap-4 rounded-xl border border-purple-100 bg-[#fff7ff] px-5 shadow-sm">
            <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full border-[6px] border-purple-600 text-sm font-bold text-purple-700">
              75%
            </div>
            <div>
              <p className="text-[16px] font-semibold">Profile Strength</p>
              <p className="text-sm text-gray-500">Almost Ready</p>
            </div>
          </div>
        </div>

        <div className="relative mb-9">
          <div className="absolute left-0 top-[15px] h-[4px] w-full bg-purple-100" />
          <div className="absolute left-0 top-[15px] h-[4px] w-[68%] bg-purple-700" />

          <div className="relative flex justify-between">
            {[
              ["Account", "✓", true],
              ["Profile", "✓", true],
              ["Preferences", "3", true],
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
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700">
              <Briefcase size={23} />
            </div>
            <div>
              <h2 className="text-[28px] font-bold">
                Step 3: Work Preferences
              </h2>
              <p className="mt-1 text-[15px] text-gray-600">
                Choose the type of work you want to receive.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="mb-3 block text-[16px] font-semibold">
                Preferred Categories <span className="text-red-500">*</span>
              </label>

              <div className="flex flex-wrap gap-3">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleArrayItem("categories", item)}
                    className={`rounded-full px-4 py-2 text-[14px] font-medium ${
                      data.categories.includes(item)
                        ? "bg-purple-700 text-white"
                        : "bg-[#e3dfe8] text-gray-700"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {errors.categories && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.categories}
                </p>
              )}
            </div>

            <div>
              <label className="mb-3 block text-[16px] font-semibold">
                Project Types <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-4 gap-4">
                {projectTypes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleArrayItem("projectTypes", item)}
                    className={`rounded-xl border px-4 py-5 text-center text-[15px] font-medium ${
                      data.projectTypes.includes(item)
                        ? "border-purple-700 bg-purple-700 text-white"
                        : "border-purple-100 bg-transparent text-gray-700"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {errors.projectTypes && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.projectTypes}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-[15px] font-medium">
                  Availability <span className="text-red-500">*</span>
                </label>
                <select
                  value={data.availability}
                  onChange={(e) =>
                    updateField("availability", e.target.value)
                  }
                  className="h-11 w-full rounded-md border border-purple-200 bg-transparent px-4 text-[16px] outline-none focus:border-purple-600"
                >
                  <option value="">Select availability</option>
                  {availabilityOptions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                {errors.availability && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.availability}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[15px] font-medium">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={data.experienceLevel}
                  onChange={(e) =>
                    updateField("experienceLevel", e.target.value)
                  }
                  className="h-11 w-full rounded-md border border-purple-200 bg-transparent px-4 text-[16px] outline-none focus:border-purple-600"
                >
                  <option value="">Select experience</option>
                  {experienceOptions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                {errors.experienceLevel && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.experienceLevel}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="mb-2 block text-[15px] font-medium">
                  Minimum Budget ($) <span className="text-red-500">*</span>
                </label>
                <input
                  value={data.minBudget}
                  onChange={(e) => updateField("minBudget", e.target.value)}
                  placeholder="100"
                  className="h-11 w-full rounded-md border border-purple-200 bg-transparent px-4 text-[16px] outline-none focus:border-purple-600"
                />
                {errors.minBudget && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.minBudget}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[15px] font-medium">
                  Maximum Budget ($) <span className="text-red-500">*</span>
                </label>
                <input
                  value={data.maxBudget}
                  onChange={(e) => updateField("maxBudget", e.target.value)}
                  placeholder="5000"
                  className="h-11 w-full rounded-md border border-purple-200 bg-transparent px-4 text-[16px] outline-none focus:border-purple-600"
                />
                {errors.maxBudget && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.maxBudget}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[15px] font-medium">
                  Work Mode <span className="text-red-500">*</span>
                </label>
                <select
                  value={data.workMode}
                  onChange={(e) => updateField("workMode", e.target.value)}
                  className="h-11 w-full rounded-md border border-purple-200 bg-transparent px-4 text-[16px] outline-none focus:border-purple-600"
                >
                  <option value="">Select mode</option>
                  {workModes.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                {errors.workMode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.workMode}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-purple-100 pt-7">
              <div className="mb-4 flex items-center gap-3">
                <Bell size={21} className="text-purple-700" />
                <h3 className="text-[20px] font-bold">
                  Notification Preferences
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  ["email", "Email Notifications"],
                  ["push", "Push Notifications"],
                  ["sms", "SMS Notifications"],
                ].map(([key, label]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-purple-100 px-4 py-4"
                  >
                    <span className="text-[15px] font-medium">{label}</span>
                    <input
                      type="checkbox"
                      checked={
                        data.notifications[
                          key as keyof typeof data.notifications
                        ]
                      }
                      onChange={(e) =>
                        updateField("notifications", {
                          ...data.notifications,
                          [key]: e.target.checked,
                        })
                      }
                      className="h-5 w-5 accent-purple-700"
                    />
                  </label>
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
                Complete your preferences to continue to the verification step.
              </p>
            </div>
          </div>

          <button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-purple-700">
            Learn More
          </button>
        </div>
      </section>
    </main>
  );
}