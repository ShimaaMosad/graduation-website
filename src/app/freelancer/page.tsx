
"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  Bell,
  MessageSquare,
  MapPin,
  Globe,
  ShieldCheck,
  Star,
  Briefcase,
  Heart,
  Share2,
  Flag,
  GraduationCap,
  Award,
  Video,
  Calendar,
  Clock,
  DollarSign,
  BarChart3,
   ThumbsUp  ,

} from "lucide-react";

export default function FreelancerProfilePublic() {
  const [portfolioTab, setPortfolioTab] = useState<"gigs" | "projects">("gigs");

  return (
    <main className="bg-[#F9FAFB] min-h-screen">
      {/* ================= NAVBAR ================= */}
<nav className="fixed top-0 left-0 w-full h-[80px] bg-white shadow-sm flex items-center z-50">
        <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between px-6">
          <div className="text-xl font-bold text-[#8B5CF6]">MySite</div>

          <div className="relative w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search freelancers, skills..."
              className="w-full h-[44px] pl-10 pr-4 rounded-xl border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
            />
          </div>

          <div className="flex items-center gap-4">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">
                3
              </span>
            </div>
            <Image
                src="/images/profile.jfif" 
              alt="User"
              width={36}
              height={36}
              className="rounded-full"
            />
          </div>
        </div>
      </nav>

      {/* ================= COVER ================= */}
      <section className="h-[280px] bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] relative">
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2">
          <div className="relative">
            <Image
        src="/images/profile.jfif"
              alt="Profile"
              width={160}
              height={160}
              className="rounded-full border-4 border-white shadow-lg"
            />
            <span className="absolute bottom-3 right-3 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          </div>
        </div>
      </section>

      {/* ================= HEADER ================= */}
      <section className="bg-white pt-28 pb-10">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-[1fr_360px] gap-12 ">
          <div className="items-start">
            <h1 className="text-[32px] font-bold text-[#1F2937]">
              Mostafa Ahmed
            </h1>
            <p className="text-gray-500 mt-1">Full Stack Developer</p>

            <div className="flex items-start gap-6 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Cairo, Egypt
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" /> English, Arabic
              </span>
            </div>

            <div className="flex items-start items-center gap-6 mt-5">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white">
                  <ShieldCheck className="w-4 h-4" /> AI Verified
                </span>

                <span className="flex items-center gap-1 text-[#F59E0B] font-medium">
                  4.8 <Star className="w-4 h-4 fill-[#F59E0B]" />
                </span>

                <span className="text-[#8B5CF6] text-sm">96%</span>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              <div className="flex items-center gap-1 text-[#F59E0B]">
                4.9 <Star className="w-4 h-4 fill-[#F59E0B]" />
                <span className="text-gray-500 text-sm ml-1">
                  127 reviews
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-2xl font-bold text-[#8B5CF6]">From $45/hr</p>
            <p className="text-sm text-gray-500">Responds in 2 hours</p>

            <button className="w-full h-[48px] bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white rounded-xl flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" /> Contact Me
            </button>

            <button className="w-full h-[48px] border-2 border-[#8B5CF6] text-[#8B5CF6] rounded-xl flex items-center justify-center gap-2">
              <Briefcase className="w-4 h-4" /> Hire Now
            </button>

            <div className="flex gap-3 justify-center">
              {[Heart, Share2, Flag].map((Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <Icon className="w-4 h-4 text-gray-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN ================= */}
      <section className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-[840px_360px] gap-8 relative">
        {/* ================= LEFT ================= */}
        <div className="space-y-8">
          <Card title="About Me">
            <p className="text-gray-600 leading-relaxed">
             I'm a passionate Full Stack Developer with over 5 years of experience building scalable web applications. I specialize in React, Node.js, and cloud technologies, helping startups and enterprises bring their ideas to life. My approach combines clean code, modern architecture, and user-centric design to deliver exceptional digital experiences. I've successfully completed over 100 projects, working with clients across 15+ countries.
            </p>
          </Card>

          <Card title="Skills" subtitle="AI Verified Skills">
            <div className="flex flex-wrap gap-4">
              <SkillPill
                name="React.js"
                rate="4.8"
                level="Expert"
                levelColor="bg-green-100 text-green-600"
              />
              <SkillPill
                name="Node.js"
                rate="4.5"
                level="Advanced"
                levelColor="bg-blue-100 text-blue-600"
              />
              <SkillPill
                name="JavaScript"
                rate="4.9"
                level="Expert"
                levelColor="bg-green-100 text-green-600"
              />
              <SkillPill
                name="MongoDB"
                rate="4"
                level="Intermediate"
                levelColor="bg-orange-100 text-orange-600"
              />
              <SkillPill
                name="TypeScript"
                rate="4.2"
                level="Advanced"
                levelColor="bg-blue-100 text-blue-600"
              />
              <SkillPill
                name="Docker"
                rate="4.3"
                level="Advanced"
                levelColor="bg-blue-100 text-blue-600"
              />
              <SkillPill
                name="AWS"
                rate="4.6"
                level="Expert"
                levelColor="bg-green-100 text-green-600"
              />
              <SkillPill
                name="PostgreSQL"
                rate="4.1"
                level="Advanced"
                levelColor="bg-blue-100 text-blue-600"
              />
              <SkillPill
                name="GraphQL"
                rate="4.4"
                level="Advanced"
                levelColor="bg-blue-100 text-blue-600"
              />
              <SkillPill
                name="Redux"
                rate="4.7"
                level="Expert"
                levelColor="bg-green-100 text-green-600"
              />

              <NotVerifiedSkill name="Python" />
              <NotVerifiedSkill name="Vue.js" />
            </div>
          </Card>

          <Card title="Work Experience">
            <ExperienceItem
              logo="TC"
              logoColor="bg-blue-500"
              title="Senior Full Stack Developer"
              company="TechCorp Solutions"
              period="Jan 2022 - Present · 2 yrs 10 mos"
              location="Remote"
              tags={["React", "Node.js", "AWS", "MongoDB"]}
              bullets={[
                "Led development of SaaS platform serving 10K+ users",
                "Improved performance by 40% through optimization",
                "Mentored 3 junior developers",
              ]}
            />

            <div className="h-px bg-gray-100 my-8" />

            <ExperienceItem
              logo="DS"
              logoColor="bg-green-500"
              title="Full Stack Developer"
              company="Digital Solutions Inc."
              period="Mar 2020 - Dec 2021 · 1 yr 10 mos"
              location="Cairo, Egypt"
              tags={["React", "Express", "PostgreSQL"]}
              bullets={[
                "Developed e-commerce platforms for 5+ clients",
                "Implemented payment integrations and security features",
              ]}
            />
          </Card>

          <Card title="Education">
            <div className="flex gap-4">
              <GraduationCap className="w-10 h-10 text-[#8B5CF6]" />
              <div>
                <p className="font-semibold">Bachelor of Computer Science</p>
                <p className="text-sm text-gray-500">
                  Cairo University<br />
                  2019 - 2024<br />
                  GPA: 3.8/4.0
                </p>

              </div>
            </div>
          </Card>

          <Card title="Certifications">
            <CertItem
              title="AWS Certified Developer - Associate"
              org="Amazon Web Services"
              date="Issued Jan 2023 · Expires Jan 2026"
            />
            <CertItem
              title="Meta React Specialization"
              org="Meta (Facebook)"
              date="Issued Sep 2022"
            />
            <CertItem
              title="MongoDB Developer Certification"
              org="MongoDB University"
              date="Issued Jun 2022"
            />
          </Card>

          {/* ================= Portfolio/Gigs Section ================= */}
          <Card title="Portfolio & Services">
            <div className="flex gap-8 border-b border-gray-200 mb-6">
              <button
                className={`pb-2 font-medium ${
                  portfolioTab === "gigs"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-purple-600"
                }`}
                onClick={() => setPortfolioTab("gigs")}
              >
                My Gigs
              </button>
              <button
                className={`pb-2 font-medium ${
                  portfolioTab === "projects"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-purple-600"
                }`}
                onClick={() => setPortfolioTab("projects")}
              >
                Portfolio Projects
              </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolioTab === "gigs" ? (
                <>
                  {/* Gig Card 1 */}
                  <PortfolioCard
                    img="/images/gigs1.jfif"
                    title="I will build a full stack web application"
                    price="$250"
                    delivery="3 days"
                    rating={4.9}
                    reviews={24}
                  />
                  {/* Gig Card 2 */}
                  <PortfolioCard
                    img="/images/gigs2.jfif"
                    title="I will create a modern mobile app interface"
                    price="$350"
                    delivery="5 days"
                    rating={5.0}
                    reviews={18}
                  />
                </>
              ) : (
                <>
                  {/* Example Projects */}
                  <PortfolioCard
                    img="/images/project1.jfif"
                    title="E-commerce Platform Redesign"
                    price="Project"
                    delivery="N/A"
                    rating={4.8}
                    reviews={12}
                  />
                  <PortfolioCard
                    img="/images/project2.jfif"
                    title="SaaS Dashboard UI/UX"
                    price="Project"
                    delivery="N/A"
                    rating={5.0}
                    reviews={8}
                  />
                </>
              )}
            </div>

            <button className="mt-6 w-full h-[52px] border-2 border-purple-600 text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition">
              View All {portfolioTab === "gigs" ? "Gigs" : "Projects"}
            </button>
          </Card>

          {/* ================= Reviews Section ================= */}
          <Card title="Reviews">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-bold">4.9</span>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
              <span className="text-gray-500">(127 reviews)</span>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <button className="px-5 py-2 rounded-full bg-purple-600 text-white text-sm font-medium">
                All
              </button>
              <button className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-purple-100">
                5 Star (89)
              </button>
              <button className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-purple-100">
                4 Star (28)
              </button>
              <button className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-purple-100">
                3 Star (7)
              </button>
              <button className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-purple-100">
                With Files (12)
              </button>
            </div>

            <div className="space-y-8">
              <ReviewItem
                name="Sarah Johnson"
                country="US"
                rating={5}
                time="2 weeks ago"
                text="Ahmed is an exceptional developer! He delivered my e-commerce platform ahead of schedule with clean, well-documented code. His attention to detail and communication throughout the project was outstanding."
                project="E-commerce Website"
                price="$3,500"
                helpful={12}
                avatar="/images/sarah.jfif"
              />

              <div className="h-px bg-gray-200" />

              <ReviewItem
                name="Michael Chen"
                country="CA"
                rating={4}
                time="1 month ago"
                text="Fantastic work on our SaaS dashboard. Ahmed understood the requirements perfectly and implemented features that exceeded our expectations. Highly recommend!"
                project="SaaS Dashboard"
                price="$2,800"
                helpful={8}
                avatar="/images/micheal.jfif"
              />
            </div>

            <button className="mt-8 w-full h-[52px] border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition">
              Load More Reviews
            </button>
          </Card>
        </div>

        {/* ================= RIGHT ================= */}
<aside className="sticky top-24 space-y-6">
          <Widget title="Statistics">
            <div className="grid grid-cols-2 gap-y-8 gap-x-4 text-center">
              <StatBox
                icon={Briefcase}
                value="127"
                label="Orders"
                color="text-green-500"
              />
              <StatBox icon={Clock} value="2 hrs" label="Response" color="text-blue-500" />
              <StatBox icon={Calendar} value="98%" label="Delivery" color="text-green-500" />
              <StatBox icon={BarChart3} value="99%" label="Success" color="text-purple-500" />
              <StatBox icon={DollarSign} value="$45K+" label="Earnings" color="text-amber-500" />
              <StatBox icon={Star} value="4.9★" label="Rating" color="text-amber-500" />
            </div>
          </Widget>

  
          <Widget title="Languages">
            <LanguageRow name="English" level="Fluent" value={95} color="bg-purple-600" />
            <LanguageRow name="Arabic" level="Native" value={100} color="bg-purple-600" />
            <LanguageRow name="French" level="Basic" value={40} color="bg-gray-400" />
          </Widget>

 <Widget title="Availability">

  <div className="space-y-4">

    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500 text-white text-sm font-medium">
      <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
        <svg
          className="w-3 h-3 text-green-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </span>
      Available for work
    </div>

    <p className="text-gray-600">
      Responds within 2 hours
    </p>

    <div className="flex items-center gap-3 text-gray-700">
      <Calendar className="w-5 h-5 text-gray-500" />
      <span>30+ hrs/week</span>
    </div>

    <p className="text-sm text-gray-500">
      Mon-Fri, 9AM-6PM GMT+2
    </p>

  </div>

</Widget>
<Widget title="Connect">

<div className="space-y-5">

  <ConnectRow
    icon={
      <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-linkedin w-6 h-6 text-[#2563EB]"></i>
      </a>
    }
    label="LinkedIn Profile"
  />

  <ConnectRow
    icon={
      <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-github w-6 h-6 text-gray-800"></i>
      </a>
    }
    label="GitHub"
  />

  <ConnectRow
    icon={
      <a href="https://yourportfolio.com" target="_blank" rel="noopener noreferrer">
        <i className="fas fa-share-alt w-6 h-6 text-[#7C3AED]"></i>
      </a>
    }
    label="Portfolio Website"
  />

  <ConnectRow
    icon={
      <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-twitter w-6 h-6 text-[#1DA1F2]"></i>
      </a>
    }
    label="Twitter"
  />

</div>



</Widget>
        {/* CV */}
        <Widget >
          <div className="flex flex-col gap-4 items-center text-center">
            <ShieldCheck className="w-12 h-12 text-purple-600 mx-auto" />
            <p className="font-semibold text-sm">View Resume</p>
            <button className="w-full h-10 border border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition">Download CV</button>
          </div>
        </Widget>

        {/* Video Consultation */}
        <Widget >
          <div className="flex flex-col gap-4 items-center text-center bg-purple-50 p-4 rounded-xl">
            <span className="px-2 py-1 text-xs font-semibold text-purple-600 bg-white rounded-full">Offers Video Consultations</span>
            <Video className="w-8 h-8 text-white bg-purple-600 p-2 rounded-full" />
            <p className="text-sm font-medium ">Book 30-min consultation</p>
            <button className="w-full h-10 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition">$25</button>
          </div>
        </Widget>

        {/* Report */}
<Widget className="flex items-center justify-center gap-2 border border-gray-300 rounded-xl bg-white text-gray-700 font-medium shadow-md hover:bg-gray-50 transition px-6 py-3 cursor-pointer">
  <Flag className="w-4 h-4" />
  <span>Report this profile</span>
</Widget>





        </aside>
      </section>
    </main>
  );
}

/* ================= Common Components ================= */

function Card({ title, subtitle, children }: any) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-[#111827]">{title}</h2>
      {subtitle && (
        <p className="text-sm text-purple-600 mt-1">{subtitle}</p>
      )}
      <div className="mt-6 space-y-8">{children}</div>
    </div>
  );
}

function Widget({ title, children, className = "" }: any) {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
      {title && <h3 className="text-xl font-semibold mb-6">{title}</h3>}
      {children}
    </div>
  );
}


function StatBox({ icon: Icon, value, label, color }: any) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Icon className={`w-8 h-8 ${color}`} />
      <p className="text-[22px] font-bold text-[#111827] leading-none">
        {value}
      </p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

/* ================= Languages ================= */

function LanguageRow({ name, level, value, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-700">{name}</span>
        <span className="text-gray-500">{level}</span>
      </div>

      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/* ================= ================= */

function CertItem({ title, org, date }: any) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">
        <Award className="w-6 h-6 text-amber-500" />
      </div>

      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-600">{org}</p>
        <p className="text-sm text-gray-500">{date}</p>

        <button className="text-sm text-purple-600 mt-1">
          Show credential
        </button>
      </div>
    </div>
  );
}

function ExperienceItem({
  logo,
  logoColor,
  title,
  company,
  period,
  location,
  tags,
  bullets,
}: any) {
  return (
    <div className="flex gap-6">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${logoColor}`}
      >
        {logo}
      </div>

      <div className="flex-1 space-y-2">
        <p className="font-semibold text-lg">{title}</p>
        <p className="text-gray-700">{company}</p>
        <p className="text-sm text-gray-500">{period}</p>
        <p className="text-sm text-gray-500">{location}</p>

        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((t: string) => (
            <span
              key={t}
              className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm"
            >
              {t}
            </span>
          ))}
        </div>

        <ul className="list-disc list-inside text-gray-600 pt-3 space-y-1">
          {bullets.map((b: string, i: number) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SkillPill({ name, rate, level, levelColor }: any) {
  return (
    <div className="flex items-center gap-3 px-5 py-2 rounded-full border border-purple-400 text-purple-600 bg-[#FAF5FF]">
      <ShieldCheck className="w-4 h-4" />
      <span className="font-medium">{name}</span>

      <span className="flex items-center gap-1 text-amber-500 text-sm">
        {rate}
        <Star className="w-4 h-4 fill-amber-400" />
      </span>

      <span className={`px-3 py-0.5 rounded-full text-xs ${levelColor}`}>
        {level}
      </span>
    </div>
  );
}

function NotVerifiedSkill({ name }: any) {
  return (
    <div className="flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 text-gray-700 bg-[#F3F4F6]">
      <span className="font-medium">{name}</span>
      <span className="text-sm text-gray-400">Not verified</span>
    </div>
  );
}
function ConnectRow({ icon, label }: any) {
  return (
    <div
      className="
        flex items-center justify-between
        px-2 py-2
        rounded-lg
        hover:bg-gray-50
        transition
      "
    >
      <div className="flex items-center gap-4">
        <div className="w-7 h-7 flex items-center justify-center">
          {icon}
        </div>

        <span className="text-[15px] text-gray-700 font-medium">
          {label}
        </span>
      </div>

      {/* external link icon (exact look like image) */}
      <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 3h7v7m0-7L10 14"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5v14h14"
        />
      </svg>
    </div>
  );
}
function ReviewItem({
  name,
  country,
  rating,
  time,
  text,
  project,
  price,
  helpful,
  avatar,
}: any) {
  return (
<div className="flex gap-4 items-start">
  <div className="flex-shrink-0">
    <Image
      src={avatar}
      alt={name}
      width={36}
      height={36}
      className="rounded-full object-cover"
    />
  </div>

  <div className="flex flex-col space-y-2">
    <div className="flex justify-between items-start">
      <div>
        <p className="font-semibold text-gray-900">
          {name} <span className="text-xs text-gray-500 ml-1">{country}</span>
        </p>
        <div className="flex text-amber-400">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400" />
          ))}
        </div>
      </div>
      <span className="text-sm text-gray-400">{time}</span>
    </div>

    <p className="text-gray-600 leading-relaxed ">{text}</p>

    <p className="text-sm text-gray-500">
      For: <span className="text-gray-700">{project}</span> ·{" "}
      <span className="font-medium">{price}</span>
    </p>
<button className="group mt-2 px-4 max-w-[140px] py-1.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
  <ThumbsUp className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition" />
  Helpful? {helpful}
</button>

  </div>
</div>

  );
}
function PortfolioCard({ img, title, price, delivery, rating, reviews }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <Image src={img} alt={title} width={400} height={200} className="w-full h-48 object-cover"/>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-500 text-sm mt-1">{delivery} · {price}</p>
        <div className="flex items-center gap-2 mt-2 text-amber-500">
          {Array.from({ length: Math.round(rating) }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400"/>
          ))}
          <span className="text-gray-500 text-sm">({reviews} reviews)</span>
        </div>
      </div>
    </div>
  );
}
