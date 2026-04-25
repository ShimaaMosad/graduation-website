
"use client";

import React from "react";
import Image from "next/image";
import { Briefcase, Send } from "lucide-react";
import { FiSearch, FiShield, FiUsers } from "react-icons/fi";
import {
  Code2,
  Smartphone,
  Palette,
  PenLine,
  Megaphone,
  Database,
  Video,
  Brain,
} from "lucide-react";
import {  Users, DollarSign, Star } from "lucide-react";

import Link from "next/link";
import {
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
} from "lucide-react";
import {
  ShieldCheck,
  CreditCard,
  BadgeCheck,
  Clock
} from "lucide-react";
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
     
      <Hero />
      <HowItWorks />
      <Categories />
     
      <VerifiedFreelancers/>
       <WhyChoose/>
      <Footer/>
    
    </main>
  );
}

function Hero() {
  return (
    <section className="relative mx-auto w-full lg:w-[90%] px-6 lg:px-0 py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

      {/* LEFT */}
      <div className="lg:col-span-7">
        <h1 className="text-[44px] lg:text-[64px] font-semibold leading-[1.1]
          text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
          Hire AI-Verified<br />
          Talent. Work with<br />
          Confidence.
        </h1>

        <p className="mt-6 text-gray-600 max-w-xl text-[16px]">
          Connect with top freelancers whose skills are verified by advanced
          AI technology. Quality work, guaranteed results, powered by trust.
        </p>

        {/* BUTTONS */}
        <div className="mt-8 flex gap-4 flex-wrap">

          <a
            href="/register?mode=client"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full
            bg-gradient-to-r from-blue-500 to-indigo-500
            text-white shadow-md hover:shadow-lg transition"
          >
            <Briefcase size={18} />
            I'm Hiring
          </a>

          <a
            href="/register?mode=freelancer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full
            bg-gradient-to-r from-purple-500 to-fuchsia-500
            text-white shadow-md hover:shadow-lg transition"
          >
            <Send size={18} />
            I'm a Freelancer
          </a>

        </div>

        {/* STATS */}
        <div className="mt-12 grid grid-cols-3 gap-10 max-w-xl">

          <div className="flex items-center gap-3">
            <Users size={22} className="text-blue-500" />
            <div>
              <div className="font-semibold text-gray-900">50K+</div>
              <div className="text-sm text-gray-500">Verified Freelancers</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DollarSign size={22} className="text-blue-500" />
            <div>
              <div className="font-semibold text-gray-900">$10M+</div>
              <div className="text-sm text-gray-500">Paid Out</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Star size={22} className="text-blue-500 fill-blue-500" />
            <div>
              <div className="font-semibold text-gray-900">4.9</div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="lg:col-span-5 flex justify-center lg:justify-end relative">

        <div className="w-full max-w-[520px] aspect-[4/3] rounded-3xl overflow-hidden
          shadow-[0_40px_80px_rgba(0,0,0,0.15)]">

          <img
            src="/images/image.png"
            alt="AI Verified Talent"
            className="w-full h-full object-cover"
          />
        </div>

        {/* BADGE */}
        <div className="absolute -left-5 bottom-0 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500
            flex items-center justify-center text-white text-lg">
            ★
          </div>

          <div className="leading-tight">
            <div className="font-semibold text-gray-900">
              AI-Verified Skills
            </div>
            <div className="text-sm text-gray-500">
              100% Authentic
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}




function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Post or Browse",
      text: "Clients post projects or browse verified freelancers. Freelancers discover opportunities that match their skills.",
      icon: <FiSearch />,
    },
    {
      id: 2,
      title: "AI Skill Verification",
      text: "Our advanced AI conducts skill assessments to verify freelancer expertise, ensuring quality and authenticity.",
      icon: <FiShield />,
    },
    {
      id: 3,
      title: "Collaborate & Deliver",
      text: "Work together seamlessly with secure payments, milestone tracking, and 24/7 support for project success.",
      icon: <FiUsers />,
    },
  ];

  return (
    <section id="how" className="mx-auto w-full lg:w-[90%] px-6 lg:px-0 py-16">
      <h2 className="text-3xl text-center font-semibold mb-2">How It Works</h2>
      <p className="text-center text-gray-500 max-w-2xl mx-auto mb-12">
        Get started in three simple steps. From posting your project to completing it with confidence.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl p-8 shadow-lg relative
              transition-all duration-300 cursor-pointer
              hover:-translate-y-2 hover:scale-[1.03] hover:shadow-2xl"
          >
            {/* Step Number */}
            <div className="absolute -top-5 left-6 w-11 h-11 rounded-full 
              bg-gradient-to-r from-purple-500 to-indigo-500 
              flex items-center justify-center text-white font-semibold text-lg shadow-md">
              {s.id}
            </div>

            {/* Icon Box */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-xl 
                bg-gradient-to-r from-indigo-500 to-purple-500 
                flex items-center justify-center text-white text-3xl shadow-md">
                {s.icon}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-center mb-3">{s.title}</h3>
            <p className="text-gray-600 text-sm text-center">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}



function VerifiedFreelancers() {
  const freelancers = [
    {
      id: 1,
      name: "Sarah Chen",
      rating: "4.9",
      reviews: 127,
      skills: ["React", "TypeScript", "Node.js"],
      price: "$85/hr",
      image: "/images/chen.jfif",
    },
    {
      id: 2,
      name: "Marcus Johnson",
      rating: "5",
      reviews: 89,
      skills: ["UI/UX", "Figma", "Branding"],
      price: "$75/hr",
      image: "/images/marcus.jfif",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      rating: "4.8",
      reviews: 156,
      skills: ["Python", "Machine Learning", "Data Analysis"],
      price: "$95/hr",
      image: "/images/emma.jfif",
    },
    {
      id: 4,
      name: "David Kim",
      rating: "4.9",
      reviews: 203,
      skills: ["iOS", "Swift", "SwiftUI"],
      price: "$90/hr",
      image: "/images/kim.jfif",
    },
  ];

  return (
    <section className="w-full lg:w-[90%] mx-auto px-6 lg:px-0 py-20 bg-white">
      <h2 className="text-3xl text-center font-semibold mb-2">
        Meet Our Verified Freelancers
      </h2>
      <p className="text-center text-gray-500 max-w-2xl mx-auto mb-10">
        Top talent with AI-verified skills, ready to bring your projects to life
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {freelancers.map((f) => (
          <div
            key={f.id}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl
                       hover:-translate-y-2 transition-all"
          >
            <img
              src={f.image}
              className="w-24 h-24 rounded-full mx-auto object-cover shadow"
            />

            <h3 className="text-center font-semibold mt-4">{f.name}</h3>

            <div className="flex justify-center items-center gap-1 text-yellow-500 text-sm mt-1">
              ⭐ {f.rating}
              <span className="text-gray-500">({f.reviews})</span>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {f.skills.map((s, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>

            <p className="text-center font-semibold mt-4">{f.price}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <a
          href="/freelancers"
          className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow hover:shadow-xl hover:-translate-y-1 transition"
        >
          View All Freelancers
        </a>
      </div>
    </section>
  );
}




  
function Categories() {
  const cats = [
    { id: 1, name: "Web Development", count: "12,450+", color: "from-blue-500 to-cyan-500", icon: Code2 },
    { id: 2, name: "Mobile Apps", count: "8,320+", color: "from-indigo-500 to-blue-500", icon: Smartphone },
    { id: 3, name: "Design", count: "15,680+", color: "from-purple-500 to-pink-500", icon: Palette },
    { id: 4, name: "Writing", count: "9,540+", color: "from-pink-500 to-red-500", icon: PenLine },
    { id: 5, name: "Marketing", count: "7,220+", color: "from-orange-500 to-red-500", icon: Megaphone },
    { id: 6, name: "Data Science", count: "5,890+", color: "from-green-500 to-emerald-500", icon: Database },
    { id: 7, name: "Video Editing", count: "6,340+", color: "from-violet-500 to-indigo-500", icon: Video },
    { id: 8, name: "AI/ML", count: "4,120+", color: "from-indigo-500 to-purple-500", icon: Brain },
  ];

  return (
    <section id="browse" className="mx-auto w-full lg:w-[90%] px-6 lg:px-0 py-16">
      <h2 className="text-3xl text-center font-semibold mb-2">Popular Categories</h2>
      <p className="text-center text-gray-500 max-w-2xl mx-auto mb-10">
        Explore talent across various disciplines, all AI-verified for quality
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {cats.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-6 shadow-md flex gap-4 items-center
                transition-all duration-300 cursor-pointer
                hover:-translate-y-2 hover:scale-[1.03]
                hover:shadow-xl hover:border hover:border-gray-200"
            >
              {/* ICON BOX - نفس الحجم */}
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center 
                bg-gradient-to-r ${c.color} text-white`}
              >
                <Icon size={26} strokeWidth={1.8} />
              </div>

              {/* TEXT */}
              <div>
                <h3 className="font-semibold text-lg">{c.name}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {c.count} freelancers
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
 function WhyChoose() {
  const features = [
    {
      title: "AI Verification",
      text: "Every freelancer undergoes rigorous AI-powered skill assessment to ensure authentic expertise.",
      icon: <ShieldCheck size={26} className="text-white" />,
    },
    {
      title: "Secure Payments",
      text: "Protected transactions with escrow services. Release payment only when you're satisfied.",
      icon: <CreditCard size={26} className="text-white" />,
    },
    {
      title: "Quality Guarantee",
      text: "Not happy with the work? We'll make it right or refund your money. Your satisfaction matters.",
      icon: <BadgeCheck size={26} className="text-white" />,
    },
    {
      title: "24/7 Support",
      text: "Our dedicated support team is always here to help you succeed, around the clock.",
      icon: <Clock size={26} className="text-white" />,
    },
  ];

  return (
    <section className="py-28 bg-gradient-to-br from-[#E0D3FD]  to-purple-50">
      {/* Title */}
      <h2 className="text-4xl text-center font-semibold mb-4">
        Why Choose MySite
      </h2>

      <p className="text-center text-gray-500 max-w-2xl mx-auto mb-16">
        Built on trust, powered by AI, designed for your success
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-[90%] mx-auto">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-300"
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-6">
              {item.icon}
            </div>

            <h3 className="font-semibold text-lg mb-3">
              {item.title}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
 function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b bg-[#101828] text-gray-300">
      <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-10">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                M
              </div>
              <span className="text-white font-semibold text-lg">
                MySite
              </span>
            </div>

            <p className="mt-4 text-sm text-gray-400">
              Where Trust Meets Talent
            </p>

            <div className="flex gap-4 mt-5">
              <Twitter className="w-5 h-5 hover:text-white cursor-pointer" />
              <Linkedin className="w-5 h-5 hover:text-white cursor-pointer" />
              <Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-white">About</Link></li>
              <li><Link href="#" className="hover:text-white">Careers</Link></li>
              <li><Link href="#" className="hover:text-white">Press</Link></li>
              <li><Link href="#" className="hover:text-white">Blog</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-white">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white">Trust & Safety</Link></li>
              <li><Link href="#" className="hover:text-white">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Compliance</Link></li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              For Freelancers
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/find-work" className="hover:text-white">Find Work</Link></li>
              <li><Link href="#" className="hover:text-white">Success Stories</Link></li>
              <li><Link href="#" className="hover:text-white">Resources</Link></li>
              <li><Link href="#" className="hover:text-white">Community</Link></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">

          <span>
            © 2025 MySite. All rights reserved.
          </span>

          <div className="flex gap-6">
            <Link href="#" className="hover:text-white">Terms</Link>
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Cookies</Link>
          </div>

        </div>

      </div>
    </footer>
  );
}