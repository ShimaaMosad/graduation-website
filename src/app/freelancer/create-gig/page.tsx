"use client";

import React, { useRef, useState } from "react";

export default function CreateGigPage() {
    const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    subcategory: "",
  tags: [] as string[],

    packages: {
    basic: {
      price: "",
      delivery: "3 days",
      revisions: "2",
      desc: "",
      features: [] as string[],
    },
    standard: {
      price: "",
      delivery: "3 days",
      revisions: "2",
      desc: "",
      features: [] as string[],
    },
    premium: {
      price: "",
      delivery: "3 days",
      revisions: "2",
      desc: "",
      features: [] as string[],
    },
  },
  });
  const [tagInput, setTagInput] = useState("");
const categories = {
  "Graphic Design": [
    "Logo Design",
    "Branding",
    "Illustration",
    "UI/UX Design",
  ],
  "Web Development": [
    "Frontend",
    "Backend",
    "Full Stack",
    "API Development",
  ],
  "Mobile Apps": [
    "iOS",
    "Android",
    "Flutter",
    "React Native",
  ],
  "Writing & Translation": [
    "Content Writing",
    "Copywriting",
    "Translation",
    "Proofreading",
  ],
  "Digital Marketing": [
    "SEO",
    "Social Media",
    "Ads Management",
    "Email Marketing",
  ],
};const handleCategoryChange = (e: any) => {
  const selectedCategory = e.target.value;

  setForm({
    ...form,
    category: selectedCategory,
    subcategory: "", // reset subcategory
  });
};
const handleAddTag = () => {
  if (
    tagInput.trim() &&
    form.tags.length < 5 &&
    !form.tags.includes(tagInput.trim())
  ) {
    setForm({
      ...form,
      tags: [...form.tags, tagInput.trim()],
    });
    setTagInput("");
  }
};

const handleRemoveTag = (index: number) => {
  setForm({
    ...form,
    tags: form.tags.filter((_, i) => i !== index),
  });
};
const updatePackage = (type: string, field: string, value: any) => {
  setForm({
    ...form,
    packages: {
      ...form.packages,
      [type]: {
        ...form.packages[type as keyof typeof form.packages],
        [field]: value,
      },
    },
  });
};
const featuresList = [
  "Vector files",
  "High-res PNG/JPG",
  "Source files",
  "3D mockups",
];
const toggleFeature = (type: string, feature: string) => {
  const current =
    form.packages[type as keyof typeof form.packages].features;

  const updated = current.includes(feature)
    ? current.filter((f) => f !== feature)
    : [...current, feature];

  updatePackage(type, "features", updated);
};
 const [description, setDescription] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>(["High-resolution PNG & JPG"]);
  const [newItem, setNewItem] = useState("");
  const [addingItem, setAddingItem] = useState(false);

  // Requirements from Buyer
  const [requirements, setRequirements] = useState<string[]>([
    "Brand name and tagline",
    "Color preferences",
    "Industry/niche",
  ]);
  const [addingReq, setAddingReq] = useState(false);
  const [newReq, setNewReq] = useState("");

  // Gig Images (up to 5)
  const [images, setImages] = useState<(string | null)[]>([null, null, null, null, null]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Gig Extras
  const [extras, setExtras] = useState<{ label: string; price: string }[]>([
    { label: "Extra fast delivery (1 day)", price: "30" },
    { label: "Source files included", price: "20" },
  ]);
  const [addingExtra, setAddingExtra] = useState(false);
  const [newExtra, setNewExtra] = useState({ label: "", price: "" });

  const MAX_CHARS = 2000;

  const handleAddItem = () => {
    if (newItem.trim()) {
      setDeliverables((prev) => [...prev, newItem.trim()]);
      setNewItem("");
      setAddingItem(false);
    }
  };

  const handleRemoveItem = (index: number) => {
    setDeliverables((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddItem();
    if (e.key === "Escape") {
      setAddingItem(false);
      setNewItem("");
    }
  };
  
  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const updated = [...images];
      updated[index] = e.target?.result as string;
      setImages(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleAddExtra = () => {
    if (newExtra.label.trim() && newExtra.price.trim()) {
      setExtras((p) => [...p, { label: newExtra.label.trim(), price: newExtra.price.trim() }]);
      setNewExtra({ label: "", price: "" });
      setAddingExtra(false);
    }
  };

  const inputClass =
    "w-full bg-gray-100 p-3 rounded-lg outline-none border border-transparent focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all duration-200 text-sm";

  const XIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const UploadIcon = () => (
    <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  );
const handleSaveDraft = async () => {
  try {
    setLoading(true);

    await fetch("/api/gigs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        description,
        deliverables,
        requirements,
        extras,
        images,
        status: "draft",
      }),
    });

    alert("Saved as draft 💾");
  } catch (error) {
    alert("Error saving draft ❌");
  } finally {
    setLoading(false);
  }
};
const handlePreview = () => {
  console.log("Preview:", form);
};

const handlePublish = async () => {
  if (!form.title || !form.category) {
    alert("Please fill required fields");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch("/api/gigs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        description,
        deliverables,
        requirements,
        extras,
        images,
        status: "published",
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Gig Published Successfully 🚀");
    } else {
      alert("Something went wrong ❌");
    }
  } catch (error) {
    console.error(error);
    alert("Server error ❌");
  } finally {
    setLoading(false);
  }
};
  return (
  
    <div className="bg-[#FAFAFA] min-h-screen p-8">
      {/* Content Card */}
<div className="bg-white rounded-2xl shadow-sm p-8 max-w-3xl mx-auto">        
       {/* ================= Gig Overview ================= */}
<h2 className="text-xl font-semibold mb-6">Gig Overview</h2>

<div className="space-y-6">

  {/* Title */}
  <div>
    <label className="block mb-2 font-medium">
      Gig Title *
    </label>

    <input
      value={form.title}
      onChange={(e) =>
        setForm({ ...form, title: e.target.value })
      }
      placeholder="I will design a modern logo for your brand"
      className="w-full bg-gray-100 rounded-lg p-4 outline-none focus:ring-2 focus:ring-[#7C3AED]"
    />

    <p className="text-sm text-gray-400 mt-1">
      Be clear and specific about what you offer
    </p>
  </div>

{/* Category */}
<div className="grid grid-cols-2 gap-6">

  {/* CATEGORY */}
  <div>
    <label className="block mb-2 font-medium">
      Category *
    </label>

    <select
      value={form.category}
      onChange={handleCategoryChange}
      className="w-full bg-gray-100 p-4 rounded-lg outline-none focus:ring-2 focus:ring-[#7C3AED]"
    >
      <option value="">Select Category</option>

      {Object.keys(categories).map((cat, i) => (
        <option key={i} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  </div>

  {/* SUBCATEGORY */}
  <div>
    <label className="block mb-2 font-medium">
      Subcategory *
    </label>

    <select
      value={form.subcategory}
      onChange={(e) =>
        setForm({ ...form, subcategory: e.target.value })
      }
      disabled={!form.category}
      className="w-full bg-gray-100 p-4 rounded-lg outline-none focus:ring-2 focus:ring-[#7C3AED]"
    >
      <option value="">Select Subcategory</option>

      {form.category &&
        categories[form.category as keyof typeof categories].map(
          (sub, i) => (
            <option key={i} value={sub}>
              {sub}
            </option>
          )
        )}
    </select>
  </div>

</div>
         
{/* Tags */}
<div>
  <label className="block mb-2 font-medium">
    Search Tags (Max 5)
  </label>

  {/* TAGS LIST */}
  <div className="flex gap-2 flex-wrap mb-2">
    {form.tags.map((tag, i) => (
      <span
        key={i}
        className="bg-[#EDE9FE] text-[#7C3AED] px-3 py-1 rounded-full text-sm flex items-center gap-2"
      >
        {tag}
        <button
          type="button"
          onClick={() => handleRemoveTag(i)}
          className="text-xs"
        >
          ✕
        </button>
      </span>
    ))}
  </div>

  {/* INPUT + ADD */}
  <div className="flex gap-2">
    <input
      value={tagInput}
      onChange={(e) => setTagInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleAddTag();
        }
      }}
      placeholder="Add tags to help clients find your gig"
      className="flex-1 bg-gray-100 p-4 rounded-lg outline-none focus:ring-2 focus:ring-[#7C3AED]"
    />

    <button
      type="button"
      onClick={handleAddTag}
      className="bg-[#7C3AED] text-white px-4 rounded-lg"
    >
      Add
    </button>
  </div>
<div className="grid grid-cols-3 gap-6">

  {["basic", "standard", "premium"].map((type) => {
    const pkg = form.packages[type as keyof typeof form.packages];

    return (
      <div key={type} className="bg-gray-50 rounded-xl p-6 border mt-5">

        <h3 className="font-semibold capitalize mb-4">
          {type}
        </h3>

        {/* PRICE */}
        <label className="text-sm">Price</label>
        <div className="flex items-center bg-gray-100 rounded-lg p-3 mb-4">
          <span className="mr-2">$</span>
          <input
            value={pkg.price}
            onChange={(e) =>
              updatePackage(type, "price", e.target.value)
            }
  className="bg-gray-100 p-3 rounded-lg w-full outline-none border border-transparent 
  focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all duration-200"
          />
        </div>

        {/* DELIVERY */}
        <label className="text-sm">Delivery</label>
        <select
          value={pkg.delivery}
          onChange={(e) =>
            updatePackage(type, "delivery", e.target.value)
          }
className="w-full bg-gray-100 p-3 rounded-lg outline-none border border-transparent 
  focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all duration-200"
        >
          <option>1 day</option>
          <option>3 days</option>
          <option>7 days</option>
          <option>14 days</option>
        </select>

        {/* REVISIONS */}
        <label className="text-sm">Revisions</label>
        <select
          value={pkg.revisions}
          onChange={(e) =>
            updatePackage(type, "revisions", e.target.value)
          }
 className="w-full bg-gray-100 p-3 rounded-lg outline-none border border-transparent 
  focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all duration-200"
        >
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>Unlimited</option>
        </select>

        {/* DESCRIPTION */}
        <label className="text-sm">Description</label>
        <textarea
          value={pkg.desc}
          onChange={(e) =>
            updatePackage(type, "desc", e.target.value)
          }
      className="w-full bg-gray-100 p-3 rounded-lg outline-none border border-transparent 
  focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all duration-200"
  />

        {/* FEATURES (CHECKBOXES) */}
        <div className="space-y-2 text-sm">
          {featuresList.map((f, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">

  {/* HIDDEN INPUT */}
  <input
    type="checkbox"
    checked={pkg.features.includes(f)}
    onChange={() => toggleFeature(type, f)}
    className="hidden"
  />

  {/* CUSTOM BOX */}
  <div
    className={`
      w-5 h-5 flex items-center justify-center rounded border transition-all duration-200
      ${
        pkg.features.includes(f)
          ? "bg-[#7C3AED] border-[#7C3AED]"
          : "border-gray-300"
      }
    `}
  >
    {pkg.features.includes(f) && (
      <span className="text-white text-xs">✓</span>
    )}
  </div>

  {/* TEXT */}
  <span className="text-sm text-[#111827] group-hover:text-[#7C3AED] transition">
    {f}
  </span>

</label>
          ))}
        </div>

      </div>
    );
  })}
</div>
</div>
      {/* ── DESCRIPTION CARD ── */}
        <h2 className="text-xl font-semibold mb-6">Description</h2>

        {/* Gig Description */}
        <div className="mb-6">
          <label className="block font-medium mb-2">
            Gig Description <span className="text-gray-800">*</span>
          </label>
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) setDescription(e.target.value);
              }}
              placeholder="Describe your service in detail. What will you deliver? What makes your service unique? What's your process?"
              rows={8}
              className="w-full px-4 py-4 bg-gray-100 rounded-xl text-sm text-gray-700 placeholder-gray-400 resize-none outline-none border border-transparent focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
            />
            <span className="absolute bottom-3 right-4 text-xs text-gray-400">
              {description.length}/{MAX_CHARS}
            </span>
          </div>
        </div>

        {/* What clients will receive */}
        <div>
          <label className="block font-medium mb-3">What clients will receive</label>
          <div className="flex flex-col gap-2">
            {deliverables.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
              >
                <span className="text-sm text-gray-700">{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-gray-400 hover:text-gray-700 transition-colors ml-3 flex-shrink-0"
                  aria-label="Remove item"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {addingItem && (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a deliverable..."
                  className="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-4 py-3 bg-[#7C3AED] text-white text-sm rounded-xl hover:bg-[#6D28D9] transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => { setAddingItem(false); setNewItem(""); }}
                  className="px-4 py-3 bg-gray-100 text-gray-600 text-sm rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {!addingItem && (
              <button
                type="button"
                onClick={() => setAddingItem(true)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors w-fit"
              >
                <span className="text-lg leading-none font-light">+</span>
                <span>Add item</span>
              </button>
            )}
        </div>
      </div>
      
      {/* ── REQUIREMENTS FROM BUYER ── */}
        <h2 className="text-xl font-semibold mb-1">Requirements from Buyer</h2>
        <p className="text-sm text-gray-500 mb-6">What do you need from the buyer to get started?</p>
        <div className="flex flex-col gap-2">
          {requirements.map((req, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-100 rounded-xl px-4 py-3">
              <span className="text-sm text-gray-700">{req}</span>
              <button type="button" onClick={() => setRequirements((p) => p.filter((_, i) => i !== idx))}
                className="text-gray-400 hover:text-gray-700 transition-colors ml-3 flex-shrink-0"><XIcon /></button>
            </div>
          ))}
          {addingReq && (
            <div className="flex items-center gap-2">
              <input autoFocus type="text" value={newReq} onChange={(e) => setNewReq(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newReq.trim()) { setRequirements((p) => [...p, newReq.trim()]); setNewReq(""); setAddingReq(false); }
                  if (e.key === "Escape") { setAddingReq(false); setNewReq(""); }
                }}
                placeholder="e.g. Your company name"
                className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all" />
              <button type="button"
                onClick={() => { if (newReq.trim()) { setRequirements((p) => [...p, newReq.trim()]); setNewReq(""); setAddingReq(false); } }}
                className="px-4 py-3 bg-[#7C3AED] text-white text-sm rounded-xl hover:bg-[#6D28D9] transition-colors">Add</button>
              <button type="button" onClick={() => { setAddingReq(false); setNewReq(""); }}
                className="px-4 py-3 bg-gray-100 text-gray-600 text-sm rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
            </div>
          )}
          {!addingReq && (
            <button type="button" onClick={() => setAddingReq(true)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors w-fit mt-1">
              <span className="text-lg leading-none">+</span><span>Add requirement</span>
            </button>
          )}
        </div>
      

      {/* ── GIG IMAGES ── */}
        <h2 className="text-xl font-semibold mb-1">Gig Images</h2>
        <p className="text-sm text-gray-500 mb-6">
          Upload 3-5 images. First image will be your cover. Show examples of your work.
        </p>
        <div className="grid grid-cols-5 gap-3 mb-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative">
              {idx === 0 && (
                <span className="absolute -top-2 left-2 z-10 bg-[#7C3AED] text-white text-xs font-medium px-2.5 py-0.5 rounded-md">
                  Cover
                </span>
              )}
              <div
                onClick={() => fileInputRefs.current[idx]?.click()}
                className={`relative flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden
                  ${img ? "border-[#7C3AED]" : "border-gray-300 bg-white hover:border-[#7C3AED] hover:bg-[#F5F3FF]"}`}
              >
                {img ? (
                  <>
                    <img src={img} alt={`upload-${idx}`} className="absolute inset-0 w-full h-full object-cover" />
                    <button type="button"
                      onClick={(e) => { e.stopPropagation(); const u = [...images]; u[idx] = null; setImages(u); }}
                      className="absolute top-1.5 right-1.5 bg-white rounded-full p-0.5 shadow text-gray-500 hover:text-red-500 transition-colors z-10">
                      <XIcon />
                    </button>
                  </>
                ) : (
                  <>
                    <UploadIcon />
                    <span className="text-xs text-gray-400 mt-2">Click to upload</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/jpeg,image/png" className="hidden"
                ref={(el) => { fileInputRefs.current[idx] = el; }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(idx, f); e.target.value = ""; }} />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400">Supported: JPG, PNG (Max 5MB each)</p>
      

      {/* ── GIG EXTRAS ── */}
        <h2 className="text-xl font-semibold mb-1">
          Gig Extras <span className="text-gray-400 font-normal text-lg">(Optional)</span>
        </h2>
        <p className="text-sm text-gray-500 mb-6">Offer add-ons to increase your earnings</p>
        <div className="flex flex-col gap-2">
          {extras.map((extra, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700">{extra.label}</div>
              <div className="bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 w-28 text-center font-medium">
                +${extra.price}
              </div>
              <button type="button" onClick={() => setExtras((p) => p.filter((_, i) => i !== idx))}
                className="text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0"><XIcon /></button>
            </div>
          ))}
          {addingExtra && (
            <div className="flex items-center gap-3 mt-1">
              <input autoFocus type="text" value={newExtra.label}
                onChange={(e) => setNewExtra({ ...newExtra, label: e.target.value })}
                placeholder="Extra description (e.g. Extra fast delivery)"
                className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all" />
              <div className="flex items-center bg-gray-100 rounded-xl px-3 w-28 border border-transparent focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/20 transition-all">
                <span className="text-gray-400 text-sm mr-1">+$</span>
                <input type="number" min="1" value={newExtra.price}
                  onChange={(e) => setNewExtra({ ...newExtra, price: e.target.value })}
                  placeholder="0" className="bg-transparent py-3 w-full outline-none text-sm" />
              </div>
              <button type="button" onClick={handleAddExtra}
                className="px-4 py-3 bg-[#7C3AED] text-white text-sm rounded-xl hover:bg-[#6D28D9] transition-colors">Add</button>
              <button type="button" onClick={() => { setAddingExtra(false); setNewExtra({ label: "", price: "" }); }}
                className="px-4 py-3 bg-gray-100 text-gray-600 text-sm rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
            </div>
          )}
          {!addingExtra && (
            <button type="button" onClick={() => setAddingExtra(true)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors w-fit mt-1">
              <span className="text-lg leading-none">+</span><span>Add extra</span>
            </button>
          )}
          {/* ── ACTION BUTTONS ── */}
<div className="flex items-center justify-end gap-3 mt-6 mb-10">

  {/* SAVE DRAFT */}
  <button
    type="button"
    onClick={handleSaveDraft}
    className="px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm font-medium
    hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 active:scale-95"
  >
    Save as Draft
  </button>

  {/* PREVIEW */}
  <button
    type="button"
    onClick={handlePreview}
    className="px-6 py-3 rounded-xl border border-[#7C3AED] bg-white text-[#7C3AED] text-sm font-medium
    hover:bg-[#F5F3FF] transition-all duration-200 active:scale-95"
  >
    Preview
  </button>

  {/* PUBLISH */}
 <button
  type="button"
  onClick={handlePublish}
  disabled={loading}
  className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium
  bg-gradient-to-r from-[#7C3AED] to-[#6366F1]
  transition-all duration-200 hover:shadow-lg hover:-translate-y-[1px] active:scale-95
  disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? "Publishing..." : "Publish Gig"}
</button>

</div>
      </div>
</div>

</div>
</div>

    
  );
}