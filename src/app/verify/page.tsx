"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ShieldCheck,
  Upload,
  FileText,
  Camera,
  Lock,
} from "lucide-react";
import {
  getVerifyData,
  saveVerifyDraft,
  submitVerify,
  VerifyData,
} from "@/src/lib/verifyApi";

const countries = ["Egypt", "United States", "United Kingdom", "Germany", "France"];

const documentTypes = [
  "National ID",
  "Passport",
  "Driver License",
  "Residence Card",
];

export default function VerifyPage() {
  const [data, setData] = useState<VerifyData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVerifyData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  function updateField<K extends keyof VerifyData>(
    key: K,
    value: VerifyData[K]
  ) {
    if (!data) return;

    setData({ ...data, [key]: value });
    setErrors({ ...errors, [key]: "" });
    setMessage("");
  }

  function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    key: "frontIdFileName" | "backIdFileName" | "selfieFileName"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];

    if (!allowedTypes.includes(file.type)) {
      setErrors({
        ...errors,
        [key]: "Please upload PNG, JPG, JPEG, or PDF file.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        [key]: "File size must be less than 5MB.",
      });
      return;
    }

    updateField(key, file.name);
  }

  function validate() {
    if (!data) return false;

    const newErrors: Record<string, string> = {};

    if (!data.legalName.trim()) {
      newErrors.legalName = "Legal name is required.";
    }

    if (!data.country) {
      newErrors.country = "Country is required.";
    }

    if (!data.documentType) {
      newErrors.documentType = "Document type is required.";
    }

    if (!data.documentNumber.trim()) {
      newErrors.documentNumber = "Document number is required.";
    }

    if (!data.frontIdFileName) {
      newErrors.frontIdFileName = "Front side of ID is required.";
    }

    if (
      data.documentType !== "Passport" &&
      !data.backIdFileName
    ) {
      newErrors.backIdFileName = "Back side of ID is required.";
    }

    if (!data.selfieFileName) {
      newErrors.selfieFileName = "Selfie verification is required.";
    }

    if (!data.consent) {
      newErrors.consent = "You must confirm the verification consent.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSaveDraft() {
    if (!data) return;

    await saveVerifyDraft(data);
    setMessage("Draft saved successfully.");
  }

  async function handleSubmit() {
    if (!data) return;

    if (!validate()) {
      setMessage("Please complete all required information before submitting verification.");
      return;
    }

    const res = await submitVerify(data);
    setMessage("Verification submitted successfully. Your profile is now pending review.");
    console.log(res.status);
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
              Verify Your Identity
            </h1>
            <p className="mt-2 text-[17px] text-gray-600">
              Complete identity verification to build trust and unlock your verified badge.
            </p>
          </div>

          <div className="flex h-[100px] w-[230px] items-center gap-4 rounded-xl border border-purple-100 bg-[#fff7ff] px-5 shadow-sm">
            <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full border-[6px] border-purple-600 text-sm font-bold text-purple-700">
              90%
            </div>
            <div>
              <p className="text-[16px] font-semibold">Profile Strength</p>
              <p className="text-sm text-gray-500">Verification</p>
            </div>
          </div>
        </div>

        <div className="relative mb-9">
          <div className="absolute left-0 top-[15px] h-[4px] w-full bg-purple-100" />
          <div className="absolute left-0 top-[15px] h-[4px] w-full bg-purple-700" />

          <div className="relative flex justify-between">
            {[
              ["Account", "✓", true],
              ["Profile", "✓", true],
              ["Preferences", "✓", true],
              ["Verify", "4", true],
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
              <ShieldCheck size={24} />
            </div>

            <div>
              <h2 className="text-[28px] font-bold">
                Step 4: Identity Verification
              </h2>
              <p className="mt-1 text-[15px] text-gray-600">
                Your information is encrypted and used only for verification.
              </p>
            </div>
          </div>

          <div className="mb-8 rounded-xl border border-indigo-200 bg-indigo-50 p-5">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-indigo-600">
                <Lock size={21} />
              </div>

              <div>
                <h3 className="text-[18px] font-bold">
                  Secure verification process
                </h3>
                <p className="mt-1 text-[15px] leading-6 text-gray-600">
                  We use your legal information and uploaded documents only to
                  confirm your identity. This helps clients feel safe when hiring you.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-7">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-[15px] font-medium">
                  Legal Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={data.legalName}
                  onChange={(e) => updateField("legalName", e.target.value)}
                  className="h-11 w-full rounded-md border border-purple-200 bg-transparent px-4 text-[16px] outline-none focus:border-purple-600"
                />
                {errors.legalName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.legalName}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[15px] font-medium">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={data.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  className="h-11 w-full rounded-md border border-purple-200 bg-transparent px-4 text-[16px] outline-none focus:border-purple-600"
                >
                  <option value="">Select country</option>
                  {countries.map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.country}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-[15px] font-medium">
                  Document Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={data.documentType}
                  onChange={(e) => updateField("documentType", e.target.value)}
                  className="h-11 w-full rounded-md border border-purple-200 bg-transparent px-4 text-[16px] outline-none focus:border-purple-600"
                >
                  <option value="">Select document type</option>
                  {documentTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
                {errors.documentType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.documentType}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[15px] font-medium">
                  Document Number <span className="text-red-500">*</span>
                </label>
                <input
                  value={data.documentNumber}
                  onChange={(e) =>
                    updateField("documentNumber", e.target.value)
                  }
                  placeholder="Enter document number"
                  className="h-11 w-full rounded-md border border-purple-200 bg-transparent px-4 text-[16px] outline-none focus:border-purple-600"
                />
                {errors.documentNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.documentNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-purple-100 pt-7">
              <h3 className="mb-1 text-[20px] font-bold">
                Upload Documents
              </h3>
              <p className="mb-5 text-[15px] text-gray-600">
                Upload clear photos or PDF files. Max file size is 5MB.
              </p>

              <div className="grid grid-cols-3 gap-5">
                {[
                  {
                    key: "frontIdFileName",
                    title: "Front Side ID",
                    desc: "Upload the front side of your document.",
                    icon: FileText,
                    required: true,
                  },
                  {
                    key: "backIdFileName",
                    title: "Back Side ID",
                    desc:
                      data.documentType === "Passport"
                        ? "Optional for passport."
                        : "Upload the back side of your document.",
                    icon: FileText,
                    required: data.documentType !== "Passport",
                  },
                  {
                    key: "selfieFileName",
                    title: "Selfie Verification",
                    desc: "Upload a clear selfie for face matching.",
                    icon: Camera,
                    required: true,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const value = data[item.key as keyof VerifyData] as string;

                  return (
                    <div
                      key={item.key}
                      className="rounded-xl border border-purple-100 p-5"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                        <Icon size={22} />
                      </div>

                      <h4 className="text-[16px] font-bold">
                        {item.title}{" "}
                        {item.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </h4>

                      <p className="mt-1 min-h-[42px] text-[14px] leading-5 text-gray-600">
                        {item.desc}
                      </p>

                      <label className="mt-4 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-purple-200 text-[15px] font-medium text-purple-700 hover:bg-purple-50">
                        <Upload size={17} />
                        Upload File
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,application/pdf"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              item.key as
                                | "frontIdFileName"
                                | "backIdFileName"
                                | "selfieFileName"
                            )
                          }
                        />
                      </label>

                      {value && (
                        <p className="mt-2 truncate text-sm text-green-600">
                          {value}
                        </p>
                      )}

                      {errors[item.key] && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors[item.key]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-purple-100 p-4">
              <input
                type="checkbox"
                checked={data.consent}
                onChange={(e) => updateField("consent", e.target.checked)}
                className="mt-1 h-5 w-5 accent-purple-700"
              />
              <div>
                <p className="text-[15px] font-semibold">
                  I confirm that the information and documents I provided are
                  accurate.
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  I agree that MySite may use this information to verify my identity.
                </p>
                {errors.consent && (
                  <p className="mt-1 text-sm text-red-600">{errors.consent}</p>
                )}
              </div>
            </label>

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
                onClick={handleSubmit}
                className="rounded-md bg-purple-700 px-8 py-3 text-[15px] font-semibold text-white shadow hover:bg-purple-800"
              >
                Submit Verification
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
                Final Step: Verification Review
              </h3>
              <p className="text-[15px] text-gray-600">
                After submission, your verification request will be reviewed by the admin team.
              </p>
            </div>
          </div>

          <button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-purple-700">
            Privacy Info
          </button>
        </div>
      </section>
    </main>
  );
}