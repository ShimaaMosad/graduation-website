'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type CVData = {
  full_name: string
  job_title: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
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

  const [cv, setCv] = useState<CVData>({
    full_name: '',
    job_title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
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
function StepItem({ active, title, icon }: { active: boolean, title: string, icon: string }) {
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

  {/* الخلفي */}
  <div className="absolute top-1/2 left-11 right-11 h-[4px] -translate-y-1/2 bg-white/40"></div>

  {/* المتحرك */}
  <div
    className={`absolute top-1/2 left-11 right-11 h-[4px] -translate-y-1/2 bg-white transition-all duration-500
    ${step === 'career' ? 'w-[calc(100%-3rem)]' : 'w-0'}
    `}
  ></div>

  <div className="flex items-center justify-between relative z-10">
  <StepItem
        active={step === 'personal'}
        title="Personal"
        icon="👤"
      />

      <StepItem
        active={step === 'career'}
        title="Career"
        icon="📄"
      />

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

/* ---------- Personal Step ---------- */
function PersonalStep({ cv, firstName, lastName, setFirstName, setLastName, updateFullName, setCv, onNext }: any) {
  return (
<div className="max-w-4xl mx-auto mt-10 px-4">

<div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg space-y-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <label className={labelClass}>First Name</label>
            <input className={inputClass} value={firstName} onChange={(e) => { setFirstName(e.target.value); updateFullName(e.target.value, lastName) }} />
          </div>
          <div className="md:col-span-6">
            <label className={labelClass}>Last Name</label>
            <input className={inputClass} value={lastName} onChange={(e) => { setLastName(e.target.value); updateFullName(firstName, e.target.value) }} />
          </div>

          <div className="md:col-span-6">
            <label className={labelClass}>Job Title</label>
            <input className={inputClass} value={cv.job_title} onChange={e => setCv({ ...cv, job_title: e.target.value })} />
          </div>

          <div className="md:col-span-6">
            <label className={labelClass}>Email</label>
            <input className={inputClass} value={cv.email} onChange={e => setCv({ ...cv, email: e.target.value })} />
          </div>

          <div className="md:col-span-6">
            <label className={labelClass}>Phone</label>
            <input className={inputClass} value={cv.phone} onChange={e => setCv({ ...cv, phone: e.target.value })} />
          </div>

          <div className="md:col-span-6">
            <label className={labelClass}>Location</label>
            <input className={inputClass} value={cv.location} onChange={e => setCv({ ...cv, location: e.target.value })} />
          </div>

          <div className="md:col-span-6">
            <label className={labelClass}>LinkedIn</label>
            <input className={inputClass} value={cv.linkedin} onChange={e => setCv({ ...cv, linkedin: e.target.value })} />
          </div>

          <div className="md:col-span-6">
            <label className={labelClass}>GitHub / Website</label>
            <input className={inputClass} value={cv.github} onChange={e => setCv({ ...cv, github: e.target.value })} />
          </div>

          <div className="md:col-span-12">
            <label className={labelClass}>Summary</label>
            <textarea className={inputClass} value={cv.summary} onChange={e => setCv({ ...cv, summary: e.target.value })} />
          </div>

          <div className="md:col-span-12">
            <SkillsStep cv={cv} setCv={setCv} />
          </div>

          <div className="md:col-span-12 flex justify-end">
            <button className="bg-[#6a6fe3] text-white px-6 py-2 rounded-lg hover:bg-[#574ddf]" onClick={onNext}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Skills Step (inside Personal) ---------- */
function SkillsStep({ cv, setCv }: any) {
  const [skillInput, setSkillInput] = useState('')
  const [softSkillInput, setSoftSkillInput] = useState('')

  function addSkill() {
    if (!skillInput.trim()) return
    setCv((prev: CVData) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }))
    setSkillInput('')
  }

  function removeSkill(index: number) {
    setCv((prev: CVData) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }))
  }

  function addSoftSkill() {
    if (!softSkillInput.trim()) return
    setCv((prev: CVData) => ({ ...prev, soft_skills: [...prev.soft_skills, softSkillInput.trim()] }))
    setSoftSkillInput('')
  }

  function removeSoftSkill(index: number) {
    setCv((prev: CVData) => ({ ...prev, soft_skills: prev.soft_skills.filter((_, i) => i !== index) }))
  }

  return (
    <div className="space-y-3 mt-2">
      <label className={labelClass}>Skills</label>
      <div className="flex gap-2">
        <input className={inputClass} placeholder="Enter skill" value={skillInput} onChange={e => setSkillInput(e.target.value)} />
        <button className="bg-[#6a6fe3] text-white px-4 rounded hover:bg-[#574ddf]" onClick={addSkill}>Add</button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {cv.skills.map((s: string, i: number) => (
          <div key={i} className="bg-gray-200 px-3 py-1 rounded flex items-center gap-1">
            {s} <button onClick={() => removeSkill(i)} className="text-red-500 font-bold">×</button>
          </div>
        ))}
      </div>

      <label className={labelClass}>Soft Skills</label>
      <div className="flex gap-2">
        <input className={inputClass} placeholder="Enter soft skill" value={softSkillInput} onChange={e => setSoftSkillInput(e.target.value)} />
        <button className="bg-[#6a6fe3] text-white px-4 rounded hover:bg-[#574ddf]" onClick={addSoftSkill}>Add</button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {cv.soft_skills.map((s: string, i: number) => (
          <div key={i} className="bg-gray-200 px-3 py-1 rounded flex items-center gap-1">
            {s} <button onClick={() => removeSoftSkill(i)} className="text-red-500 font-bold">×</button>
          </div>
        ))}
      </div>
    </div>
  )
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