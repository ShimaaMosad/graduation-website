'use client'
import { ReactNode } from "react";

type StepItemProps = {
  active: boolean;
  title: string;
  icon: ReactNode; // بدل string
}

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaUser, FaFileAlt } from "react-icons/fa";

type CVData = {
  full_name: string
  job_title: string
  email: string
  phone: string
  location: string
 links: { name: string; url: string }[]
  summary: string

  skills: string[]
  soft_skills: string[]

  experience: {
    title: string
    company: string
    duration: string
    details: string[]
  }[]

  education: {
    degree: string
    institution: string
    year: string
  }[]

  certifications: {
    name: string
    status: string
  }[]

  projects: {
    name: string
    description: string
  }[]
}

export default function Page() {
  const router = useRouter()

  const [step, setStep] = useState<'personal' | 'career'>('personal')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showHelp, setShowHelp] = useState<{ [key: string]: boolean }>({})

  const helpText: { [key: string]: string } = {
    first_name: "Enter your name as it appears in official documents. Do not use nicknames.",
    last_name: "Enter your surname/family name as it appears in official documents.",
    job_title: "Write a clear professional job title that matches your target role. Avoid generic titles.",
    email: "Use a professional email address based on your real name.",
    phone: "Enter a valid phone number including country code.",
    location: "Enter your city and country.",
    link_name: "Enter the platform name (e.g., GitHub, LinkedIn, Portfolio).",
    link_url: "Paste your complete profile URL. Make sure the profile is updated.",

   summary: "Write 3–4 sentences summarizing your experience, main skills, and career goals. Include years of experience and key technologies.",
    skills: "List at least 8–12 technical skills as keywords. Do not use sentences.",
    soft_skills: "Add 5–7 professional soft skills related to teamwork and productivity.",
  }

  const [cv, setCv] = useState<CVData>({
    full_name: '',
    job_title: '',
    email: '',
    phone: '',
    location: '',
    links: [],
    summary: '',
    skills: [],
    soft_skills: [],
    experience: [],
    education: [],
    certifications: [],
    projects: []
  })

  function updateFullName(fn: string, ln: string) {
    setCv(prev => ({ ...prev, full_name: `${fn} ${ln}`.trim() }))
  }

  async function submitCV() {
    try {
      console.log("Sending CV JSON to backend:", cv)
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cv)
      })

      if (!res.ok) throw new Error('Failed to submit CV')

      const data = await res.json()
      console.log("Response from backend:", data)
      router.push('/register')
    } catch (error) {
      console.error("Error submitting CV:", error)
      alert('Error submitting CV')
    }
  }

  /* ---------- StepItem & Line ---------- */

function StepItem({ active, title, icon }: { active: boolean, title: string, icon: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          w-12 h-12 rounded-full flex items-center justify-center text-xl
          transition-all duration-300
          ${active
            ? 'bg-white text-[#6a6fe3] shadow-lg scale-105'
            : 'bg-white/20 text-white'
          }
        `}
      >
        {icon}
      </div> 
           <span
        className={`
          text-sm
          ${active ? 'text-white font-semibold' : 'text-white/70'}
        `}
      >
        {title}
      </span>
    </div>
  )
}


  function Line({ active }: { active: boolean }) {
    return (
      <div className={`flex-1 h-1.5 transition-all duration-300 
        ${active ? 'bg-white' : 'bg-white opacity-50'}`}></div>
    )
  }

  return (
    <div>
      {/* ===== Header + Progress ===== */}
      <div className="relative bg-gradient-to-br from-[#6a6fe3] to-[#8c3afd] pb-8 pt-8">

        <h1 className="text-3xl md:text-4xl font-semibold text-white text-center">
          {step === 'personal' ? 'Personal Details' : 'Career Details'}
        </h1>
        {/* progress wrapper */}
        <div className="relative max-w-2xl mx-auto ">
          <div className="absolute top-1/2 left-11 right-11 h-[4px] -translate-y-1/2 bg-white/40"></div>
          <div
            className={`absolute top-1/2 left-11 right-11 h-[4px] -translate-y-1/2 bg-white transition-all duration-500
            ${step === 'career' ? 'w-[calc(100%-3rem)]' : 'w-0'}`}
          ></div>
          <div className="flex items-center justify-between relative z-10">

<StepItem active={step === 'personal'} title="Personal" icon={<FaUser />} />
<StepItem active={step === 'career'} title="Career" icon={<FaFileAlt />} />
   </div>
        </div>
      </div>

      {/* ---------- Step Content ---------- */}
      {step === 'personal' && (
        <PersonalStep
          cv={cv}
          firstName={firstName}
          lastName={lastName}
          setFirstName={setFirstName}
          setLastName={setLastName}
          updateFullName={updateFullName}
          setCv={setCv}
          onNext={() => setStep('career')}
          showHelp={showHelp}
          setShowHelp={setShowHelp}
          helpText={helpText}
        />
      )}

      {step === 'career' && (
        <CareerStep cv={cv} setCv={setCv} onSubmit={submitCV} />
      )}
    </div>
  )
}


/* ---------- Shared styles ---------- */
const inputClass = 'w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6a6fe3]'
const labelClass = 'text-sm font-medium text-gray-700'
type PersonalStepProps = {
  cv: CVData;
  firstName: string;
  lastName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  updateFullName: (fn: string, ln: string) => void;
  setCv: React.Dispatch<React.SetStateAction<CVData>>;
  onNext: () => void;
  showHelp: { [key: string]: boolean };
  setShowHelp: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  helpText: { [key: string]: string };
};

function PersonalStep({
  cv, firstName, lastName, setFirstName, setLastName,
  updateFullName, setCv, onNext, showHelp, setShowHelp, helpText
}: PersonalStepProps) {
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    job_title: '',
    email: '',
    phone: '',
    location: ''
  });

  function handleNext() {
    const newErrors = {
      firstName: firstName.trim() ? '' : 'First Name is required',
      lastName: lastName.trim() ? '' : 'Last Name is required',
      job_title: cv.job_title.trim() ? '' : 'Job Title is required',
      email: cv.email.trim() ? '' : 'Email is required',
      phone: cv.phone.trim() ? '' : 'Phone is required',
      location: cv.location.trim() ? '' : 'Location is required',
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(err => err !== '')) return;
    onNext();
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* First Name */}
          <div className="md:col-span-6">
            <label className={labelClass}>First Name</label>
            <input
              className={inputClass}
              value={firstName}
              onChange={e => { 
                setFirstName(e.target.value); 
                updateFullName(e.target.value, lastName); 
                setErrors(prev => ({ ...prev, firstName: '' }));
              }}
              onFocus={() => setShowHelp(prev => ({ ...prev, first_name: true }))}
              onBlur={() => setShowHelp(prev => ({ ...prev, first_name: false }))}
            />
            {showHelp.first_name && <p className="text-xs text-gray-400 mt-1">{helpText.first_name}</p>}
            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div className="md:col-span-6">
            <label className={labelClass}>Last Name</label>
            <input
              className={inputClass}
              value={lastName}
              onChange={e => { 
                setLastName(e.target.value); 
                updateFullName(firstName, e.target.value); 
                setErrors(prev => ({ ...prev, lastName: '' }));
              }}
              onFocus={() => setShowHelp(prev => ({ ...prev, last_name: true }))}
              onBlur={() => setShowHelp(prev => ({ ...prev, last_name: false }))}
            />
            {showHelp.last_name && <p className="text-xs text-gray-400 mt-1">{helpText.last_name}</p>}
            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
          </div>

          {/* Job Title */}
          <div className="md:col-span-6">
            <label className={labelClass}>Job Title</label>
            <input
              className={inputClass}
              value={cv.job_title}
              onChange={e => {
                setCv(prev => ({ ...prev, job_title: e.target.value }));
                setErrors(prev => ({ ...prev, job_title: '' }));
              }}
              onFocus={() => setShowHelp(prev => ({ ...prev, job_title: true }))}
              onBlur={() => setShowHelp(prev => ({ ...prev, job_title: false }))}
            />
            {showHelp.job_title && <p className="text-xs text-gray-400 mt-1">{helpText.job_title}</p>}
            {errors.job_title && <p className="text-xs text-red-500 mt-1">{errors.job_title}</p>}
          </div>

           {/* Email */}
          <div className="md:col-span-6">
            <label className={labelClass}>Email</label>
            <input
              className={inputClass}
              value={cv.email}
              onChange={e => {
                setCv({ ...cv, email: e.target.value })
                setErrors(prev => ({ ...prev, email: '' }))
              }}
              onFocus={() => setShowHelp((prev: any) => ({ ...prev, email: true }))}
              onBlur={() => setShowHelp((prev: any) => ({ ...prev, email: false }))}
            />
            {showHelp.email && <p className="text-xs text-gray-400 mt-1">{helpText.email}</p>}
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="md:col-span-6">
            <label className={labelClass}>Phone</label>
            <input
              className={inputClass}
              value={cv.phone}
              onChange={e => {
                setCv({ ...cv, phone: e.target.value })
                setErrors(prev => ({ ...prev, phone: '' }))
              }}
              onFocus={() => setShowHelp((prev: any) => ({ ...prev, phone: true }))}
              onBlur={() => setShowHelp((prev: any) => ({ ...prev, phone: false }))}
            />
            {showHelp.phone && <p className="text-xs text-gray-400 mt-1">{helpText.phone}</p>}
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Location */}
          <div className="md:col-span-6">
            <label className={labelClass}>Location</label>
            <input
              className={inputClass}
              value={cv.location}
              onChange={e => {
                setCv({ ...cv, location: e.target.value })
                setErrors(prev => ({ ...prev, location: '' }))
              }}
              onFocus={() => setShowHelp((prev: any) => ({ ...prev, location: true }))}
              onBlur={() => setShowHelp((prev: any) => ({ ...prev, location: false }))}
            />
            {showHelp.location && <p className="text-xs text-gray-400 mt-1">{helpText.location}</p>}
            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
          </div>
          
        
              
            {/* Links */}
          <div className="md:col-span-12">
           <LinksStep
  cv={cv}
  setCv={setCv}
  showHelp={showHelp}
  setShowHelp={setShowHelp}
  helpText={helpText}
/>

          </div>

          {/* Skills */}
          <div className="md:col-span-12">
            <SkillsStep cv={cv} setCv={setCv} showHelp={showHelp} setShowHelp={setShowHelp} helpText={helpText} />
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-[#6a6fe3] text-white px-6 py-2 rounded-lg hover:bg-[#574ddf]" onClick={handleNext}>
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
/* ---------- Links Step ---------- */
type LinksStepProps = {
  cv: CVData;
  setCv: React.Dispatch<React.SetStateAction<CVData>>;
  showHelp: { [key: string]: boolean };
  setShowHelp: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  helpText: { [key: string]: string };
};

function LinksStep({ cv, setCv, showHelp, setShowHelp, helpText }: LinksStepProps) {
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  function addLink() {
    if (!linkName.trim() || !linkUrl.trim()) return;
    const newLink = { name: linkName.trim(), url: linkUrl.trim() };
    setCv(prev => ({
      ...prev,
      links: prev.links ? [...prev.links, newLink] : [newLink],
    }));
    setLinkName("");
    setLinkUrl("");
  }

  function removeLink(index: number) {
    setCv(prev => ({
      ...prev,
      links: prev.links?.filter((_, i) => i !== index),
    }));
  }

  return (
    <div className="space-y-3 mt-2">
      <label className={labelClass}>Links</label>
      <div className="flex gap-2">
        <div className="flex flex-col w-1/2">
          <input
            className={inputClass}
            placeholder="Link Name (e.g., GitHub)"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            onFocus={() => setShowHelp(prev => ({ ...prev, link_name: true }))}
            onBlur={() => setShowHelp(prev => ({ ...prev, link_name: false }))}
          />
          {showHelp.link_name && <p className="text-xs text-gray-400 mt-1">{helpText.link_name}</p>}
        </div>

        <div className="flex flex-col w-1/2">
          <input
            className={inputClass}
            placeholder="URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onFocus={() => setShowHelp(prev => ({ ...prev, link_url: true }))}
            onBlur={() => setShowHelp(prev => ({ ...prev, link_url: false }))}
          />
          {showHelp.link_url && <p className="text-xs text-gray-400 mt-1">{helpText.link_url}</p>}
        </div>

        <button
          className="bg-[#6a6fe3] text-white px-4 rounded hover:bg-[#574ddf]"
          onClick={(e) => { e.preventDefault(); addLink(); }}
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {cv.links?.map((l, i) => (
          <div key={i} className="bg-gray-200 px-3 py-1 rounded flex items-center gap-1">
            <span className="font-semibold">{l.name}:</span>
            <a href={l.url} target="_blank" className="text-blue-600 underline">{l.url}</a>
            <button onClick={() => removeLink(i)} className="text-red-500 font-bold">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ---------- Skills Step ---------- */
type SkillsStepProps = {
  cv: CVData;
  setCv: React.Dispatch<React.SetStateAction<CVData>>;
  showHelp: { [key: string]: boolean };
  setShowHelp: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  helpText: { [key: string]: string };
};

function SkillsStep({ cv, setCv, showHelp, setShowHelp, helpText }: SkillsStepProps) {
  const [skillInput, setSkillInput] = useState('');
  const [softSkillInput, setSoftSkillInput] = useState('');

  function addSkill() {
    if (!skillInput.trim()) return;
    setCv((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
    setSkillInput('');
  }

  function removeSkill(index: number) {
    setCv((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  }

  function addSoftSkill() {
    if (!softSkillInput.trim()) return;
    setCv((prev) => ({ ...prev, soft_skills: [...prev.soft_skills, softSkillInput.trim()] }));
    setSoftSkillInput('');
  }

  function removeSoftSkill(index: number) {
    setCv((prev) => ({ ...prev, soft_skills: prev.soft_skills.filter((_, i) => i !== index) }));
  }

  return (
    <div className="space-y-3 mt-2">
      {/* Technical Skills */}
      <label className={labelClass}>Skills</label>
      <div className="flex gap-2">
        <input
          className={inputClass}
          placeholder="Enter skill"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onFocus={() => setShowHelp((prev) => ({ ...prev, skills: true }))}
          onBlur={() => setShowHelp((prev) => ({ ...prev, skills: false }))}
        />
        <button className="bg-[#6a6fe3] text-white px-4 rounded hover:bg-[#574ddf]" onClick={addSkill}>
          Add
        </button>
      </div>
      {showHelp.skills && <p className="text-xs text-gray-400 mt-1">{helpText.skills}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {cv.skills.map((s, i) => (
          <div key={i} className="bg-gray-200 px-3 py-1 rounded flex items-center gap-1">
            {s} <button onClick={() => removeSkill(i)} className="text-red-500 font-bold">×</button>
          </div>
        ))}
      </div>

      {/* Soft Skills */}
      <label className={labelClass}>Soft Skills</label>
      <div className="flex gap-2">
        <input
          className={inputClass}
          placeholder="Enter soft skill"
          value={softSkillInput}
          onChange={(e) => setSoftSkillInput(e.target.value)}
          onFocus={() => setShowHelp((prev) => ({ ...prev, soft_skills: true }))}
          onBlur={() => setShowHelp((prev) => ({ ...prev, soft_skills: false }))}
        />
        <button className="bg-[#6a6fe3] text-white px-4 rounded hover:bg-[#574ddf]" onClick={addSoftSkill}>
          Add
        </button>
      </div>
      {showHelp.soft_skills && <p className="text-xs text-gray-400 mt-1">{helpText.soft_skills}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {cv.soft_skills.map((s, i) => (
          <div key={i} className="bg-gray-200 px-3 py-1 rounded flex items-center gap-1">
            {s} <button onClick={() => removeSoftSkill(i)} className="text-red-500 font-bold">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}



/* ---------- Career Step (Experience + Education + Certifications + Projects) ---------- */
function CareerStep({ cv, setCv, onSubmit }: any) {
  return (
<div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg space-y-6 px-4">
      <ExperienceSection cv={cv} setCv={setCv} />
      <EducationSection cv={cv} setCv={setCv} />
      <CertificationsSection cv={cv} setCv={setCv} />
      <ProjectsSection cv={cv} setCv={setCv} />

        <div className="flex justify-end">
        <button className="bg-[#6a6fe3] text-white px-6 py-2 rounded hover:bg-[#574ddf]" onClick={onSubmit}>
            Generate & Submit CV
        </button>
        </div>

    </div>
  )
}

/* ---------- Experience Section ---------- */
function ExperienceSection({ cv, setCv }: any) {
  const [form, setForm] = useState({ title: '', company: '', start: '', end: '', description: '' })

  function addExperience() {
    if (!form.title || !form.company) return
    const item = { title: form.title, company: form.company, duration: `${form.start} to ${form.end}`, details: [form.description] }
    setCv((prev: CVData) => ({ ...prev, experience: [...prev.experience, item] }))
    setForm({ title: '', company: '', start: '', end: '', description: '' })
  }

  return (
    <div className="space-y-3 border-b pb-4">
      <h2 className="font-semibold text-lg">Experience</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input className={inputClass} placeholder="Job Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input className={inputClass} placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
        <input type="date" className={inputClass} value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} />
        <input type="date" className={inputClass} value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} />
      </div>
      <textarea className={inputClass} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <button className="bg-[#6a6fe3] text-white px-4 py-1 rounded text-sm mt-2 hover:bg-[#574ddf]" onClick={addExperience}>+ Add</button>

      <div className="mt-2 space-y-2 text-sm">
        {cv.experience.map((e: { title: string; company: string; duration: string; details: string[] }, i: number) => (
          <div key={i} className="bg-gray-50 p-2 rounded shadow-sm">
            <div className="font-semibold">{e.title}</div>
            <div className="text-gray-500">{e.company} – {e.duration}</div>
            <div>{e.details[0]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Education Section ---------- */
function EducationSection({ cv, setCv }: any) {
  const [form, setForm] = useState({ degree: '', institution: '', year: '' })

  function addEducation() {
    if (!form.degree || !form.institution) return
    setCv((prev: CVData) => ({ ...prev, education: [...prev.education, { ...form }] }))
    setForm({ degree: '', institution: '', year: '' })
  }

  return (
    <div className="space-y-3 border-b pb-4 mt-4">
      <h2 className="font-semibold text-lg">Education</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input className={inputClass} placeholder="Degree" value={form.degree} onChange={e => setForm({ ...form, degree: e.target.value })} />
        <input className={inputClass} placeholder="Institution" value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} />
        <input className={inputClass} placeholder="Year" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
      </div>
      <button className="bg-[#6a6fe3] text-white px-4 py-1 rounded text-sm mt-2 hover:bg-[#574ddf]" onClick={addEducation}>+ Add</button>

      <div className="mt-2 space-y-1 text-sm">
        {cv.education.map((e: { degree: string; institution: string; year: string }, i: number) => (
          <div key={i} className="bg-gray-50 p-1 rounded shadow-sm">{e.degree} – {e.institution} ({e.year})</div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Certifications Section ---------- */
function CertificationsSection({ cv, setCv }: any) {
  const [form, setForm] = useState({ name: '', status: '' })

  function addCert() {
    if (!form.name) return
    setCv((prev: CVData) => ({ ...prev, certifications: [...prev.certifications, { ...form }] }))
    setForm({ name: '', status: '' })
  }

  return (
    <div className="space-y-3 border-b pb-4 mt-4">
      <h2 className="font-semibold text-lg">Certifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input className={inputClass} placeholder="Certification Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className={inputClass} placeholder="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} />
      </div>
      <button className="bg-[#6a6fe3] text-white px-4 py-1 rounded text-sm mt-2 hover:bg-[#574ddf]" onClick={addCert}>+ Add</button>

      <div className="mt-2 space-y-1 text-sm">
        {cv.certifications.map((c: { name: string; status: string }, i: number) => (
          <div key={i} className="bg-gray-50 p-1 rounded shadow-sm">{c.name} – {c.status}</div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Projects Section ---------- */
function ProjectsSection({ cv, setCv }: any) {
  const [form, setForm] = useState({ name: '', description: '' })

  function addProject() {
    if (!form.name) return
    setCv((prev: CVData) => ({ ...prev, projects: [...prev.projects, { ...form }] }))
    setForm({ name: '', description: '' })
  }


  return (
    <div className="space-y-3 mt-4">
      <h2 className="font-semibold text-lg">Projects</h2>
      <input className={inputClass} placeholder="Project Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <textarea className={inputClass} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <button className="bg-[#6a6fe3] text-white px-4 py-1 rounded text-sm mt-2 hover:bg-[#574ddf]" onClick={addProject}>+ Add</button>

      <div className="mt-2 space-y-1 text-sm">
     {cv.projects.map((p: { name: string; description: string }, i: number) => (
  <div key={i} className="border p-2 rounded shadow-sm">{p.name}: {p.description}</div>
))}

      </div>
    </div>
  )
}