"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";

import { FaUser, FaLinkedin } from "react-icons/fa";
import { MdEmail, MdLock, MdUpload } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { registerSchema, registerSchemaType } from "@/src/schema/register.scheme";
import { signIn } from "next-auth/react";

export default function FreelancerForm() {
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);

  const skillsRef = useRef<HTMLDivElement>(null);

  const skillsList: string[] = [
    "React", "Node.js", "Python", "JavaScript", "TypeScript",
    "UI/UX Design", "Figma", "Adobe XD", "Photoshop", "Illustrator",
    "Content Writing", "SEO", "Digital Marketing", "Social Media", "Data Analysis",
    "Machine Learning", "AI", "SQL", "Mongo Database"
  ];

  const maxSkills = 5;

  const form = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
  });

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else if (selectedSkills.length < maxSkills) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, DOC, DOCX files are allowed", { position: "top-center" });
        e.target.value = "";
        return;
      }

      setCvFile(file);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (skillsRef.current && !skillsRef.current.contains(event.target as Node)) {
        setSkillsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRegister = async (values: registerSchemaType) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("rePassword", values.rePassword);
      formData.append("phone", values.phone);
      formData.append("skills", JSON.stringify(selectedSkills));
      if (photo) formData.append("photo", photo);
      if (cvFile) formData.append("cv", cvFile);

      const res = await axios.post("https://ecommerce.routemisr.com/api/v1/auth/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.message === "success") {
        toast.success("Registered successfully!", { position: "top-center", duration: 3000 });
        router.push("/login");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Registration failed", { position: "top-center" });
      } else if (err instanceof Error) {
        toast.error(err.message, { position: "top-center" });
      } else {
        toast.error("An unexpected error occurred", { position: "top-center" });
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-gray-50 p-6 lg:p-12 gap-8">

      {/* LEFT FORM */}
      <div className="lg:w-2/3 w-full bg-white p-8 flex flex-col gap-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800">Join as a Verified Freelancer</h2>
        <p className="text-gray-500 mb-4">Get AI-verified and unlock premium opportunities</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRegister)} className="flex flex-col gap-4">
            {/* Upload Photo */}
            <div className="flex justify-center mb-6">
              <label htmlFor="photoUpload" className="w-24 h-24 cursor-pointer bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white overflow-hidden hover:scale-105 transition">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <MdUpload className="text-4xl" />
                    <span className="text-xs">Upload Photo</span>
                  </div>
                )}
                <input type="file" id="photoUpload" className="hidden" accept="image/*" onChange={handlePhotoChange} />
              </label>
            </div>

            {/* Full Name */}
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <Input {...field} placeholder="Enter your full name" className="h-14 pl-12 text-lg" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Email */}
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <Input type="email" {...field} placeholder="your.email@example.com" className="h-14 pl-12 text-lg" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Password */}
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <Input type={showPassword ? "text" : "password"} {...field} placeholder="Enter your password" className="h-14 pl-12 pr-10 text-lg" />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Confirm Password */}
            <FormField control={form.control} name="rePassword" render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <Input type={showConfirmPassword ? "text" : "password"} {...field} placeholder="Confirm your password" className="h-14 pl-12 pr-10 text-lg" />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Phone */}
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" placeholder="Enter your phone" className="h-14 pl-4 text-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Skills Multi-Select */}
            <div className="flex flex-col gap-2 relative" ref={skillsRef}>
              <label className="font-medium text-gray-700">Select Skills (max 5)</label>
              <div className="border h-14 rounded-lg flex items-center flex-wrap gap-2 px-3 py-1 cursor-pointer" onClick={() => setSkillsOpen(!skillsOpen)}>
                {selectedSkills.length === 0 && <span className="text-gray-400">Click to select skills</span>}
                {selectedSkills.map(skill => (
                  <span key={skill} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                    {skill} <button type="button" onClick={(e) => { e.stopPropagation(); toggleSkill(skill); }}>×</button>
                  </span>
                ))}
              </div>
              <p className="text-gray-600 text-sm">{selectedSkills.length} / 5 skills selected</p>
              {skillsOpen && (
                <div className="border mt-1 max-h-60 overflow-y-auto rounded-md shadow-lg bg-white z-10 absolute w-full">
                  {skillsList.map(skill => (
                    <div key={skill} className={`px-3 py-2 cursor-pointer hover:bg-purple-100 ${selectedSkills.includes(skill) || selectedSkills.length >= maxSkills ? "text-gray-400 cursor-not-allowed" : ""}`} onClick={() => toggleSkill(skill)}>
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload CV & AI */}
            <div className="grid grid-cols-2 gap-6">
              <label className="border rounded-xl p-6 cursor-pointer hover:bg-gray-50 text-center flex flex-col items-center gap-2">
                <MdUpload className="w-6 h-6 text-gray-600" />
                <p className="font-semibold">Upload Your CV</p>
                <p className="text-sm text-gray-500">Drag & drop or click</p>
                <p className="text-sm text-gray-500">PDF, DOC, DOCX</p>
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCvChange} />
                {cvFile && <p className="text-sm text-gray-700 mt-1">{cvFile.name}</p>}
              </label>

              <div className="border rounded-xl p-6 cursor-pointer hover:bg-gray-50 text-center flex flex-col items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <p className="font-semibold text-purple-700">Create with AI</p>
                <p className="text-sm text-gray-500">ATS‑optimized in minutes</p>
              <Button 
                  className="bg-purple-600 hover:bg-purple-700 w-full"
                  onClick={() => router.push('/makecv')}
                >
                  Build My CV
                </Button>

              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 mt-3 mb-6">
              <input type="checkbox" className="mt-1" />
              <p className="text-gray-600 text-sm leading-tight">I agree to the Terms of Service and Privacy Policy</p>
            </div>

            <Button type="submit" className="w-full h-14 text-lg font-semibold bg-purple-600 hover:bg-purple-700">Continue to Verification</Button>
          </form>
        </Form>

        {/* Divider & Social Login */}
        <div className="relative my-6">
          <div className="border-b"></div>
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-gray-500 text-sm">Or sign up with</span>
        </div>
        <button onClick={() => signIn("google", { callbackUrl: "/" })} className="w-full border p-3 rounded-xl flex items-center gap-3 justify-center text-lg">
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>
        <button onClick={() => signIn("linkedin", { callbackUrl: "/" })} className="w-full border p-3 rounded-xl flex items-center gap-3 justify-center mt-3 text-lg">
          <FaLinkedin className="text-2xl text-blue-600" />
          Continue with LinkedIn
        </button>
      </div>

      {/* RIGHT SIDE INFO */}
      <div className="lg:w-1/3 w-full bg-white p-6 flex flex-col gap-6 rounded-2xl shadow-lg">
        <img src="/images/register freelancer.jpeg" alt="team" className="rounded-xl shadow-md w-full" />
        <h2 className="text-xl font-bold text-gray-800">Get AI-Verified Today</h2>
        <div className="flex flex-col gap-4 text-gray-700 text-sm">
          <div className="flex items-center gap-3"><span className="text-green-600 text-xl">✔</span>Get AI-verified to stand out</div>
          <div className="flex items-center gap-3"><span className="text-green-600 text-xl">✔</span>Earn up to 40% more</div>
          <div className="flex items-center gap-3"><span className="text-green-600 text-xl">✔</span>Access premium clients</div>
          <div className="flex items-center gap-3"><span className="text-green-600 text-xl">✔</span>Build your reputation</div>
        </div>
      </div>
    </div>
  );
}
