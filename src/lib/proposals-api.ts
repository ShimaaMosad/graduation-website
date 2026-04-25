export type ProposalStatus =
  | "Pending"
  | "Shortlisted"
  | "Interviewed"
  | "Rejected";

export type Proposal = {
  id: number;
  jobId: number;
  freelancerName: string;
  role: string;
  avatar: string;
  verified: boolean;
  location: string;
  bidAmount: number;
  deliveryDays: number;
  submittedText: string;
  rating: number;
  reviewsCount: number;
  successRate: number;
  responseTime: string;
  coverLetter: string;
  skills: string[];
  workSamples: string[];
  status: ProposalStatus;
};

/*
BACKEND NOTES

Expected endpoints:
GET    /jobs/:id/proposals
PATCH  /proposals/:id/status
POST   /proposals/:id/message
POST   /proposals/:id/hire

Example real API:

export async function getProposalsByJobId(jobId: number): Promise<Proposal[]> {
  const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/proposals`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch proposals");
  }

  return res.json();
}
*/

export const mockProposals: Proposal[] = [
  {
    id: 1,
    jobId: 1,
    freelancerName: "Ahmed Saleh",
    role: "Full Stack Developer",
    avatar: "https://i.pravatar.cc/120?img=15",
    verified: true,
    location: "Cairo, Egypt",
    bidAmount: 2800,
    deliveryDays: 25,
    submittedText: "2 hours ago",
    rating: 4.9,
    reviewsCount: 127,
    successRate: 98,
    responseTime: "2 hours",
    coverLetter:
      "Hi, I'm Ahmed with 5+ years of full stack development experience. I've built similar SaaS platforms using React and Node.js. I can deliver this project within 25 days with high quality. I've reviewed your requirements and I'm confident I can exceed your expectations.",
    skills: ["React", "Node.js", "PostgreSQL", "AWS"],
    workSamples: [
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
    ],
    status: "Pending",
  },
  {
    id: 2,
    jobId: 1,
    freelancerName: "Sara Mohamed",
    role: "Senior Full Stack Engineer",
    avatar: "https://i.pravatar.cc/120?img=20",
    verified: true,
    location: "Dubai, UAE",
    bidAmount: 3200,
    deliveryDays: 30,
    submittedText: "5 hours ago",
    rating: 4.8,
    reviewsCount: 89,
    successRate: 96,
    responseTime: "1 hour",
    coverLetter:
      "Hello! I'm Sara, a senior full stack engineer with extensive experience in building scalable SaaS platforms. I've worked with React, Node.js, and AWS for over 7 years.",
    skills: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"],
    workSamples: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80",
    ],
    status: "Shortlisted",
  },
  {
    id: 3,
    jobId: 1,
    freelancerName: "Michael Chen",
    role: "Backend Engineer",
    avatar: "https://i.pravatar.cc/120?img=12",
    verified: true,
    location: "Singapore",
    bidAmount: 2600,
    deliveryDays: 28,
    submittedText: "1 day ago",
    rating: 4.7,
    reviewsCount: 61,
    successRate: 94,
    responseTime: "3 hours",
    coverLetter:
      "I'm a backend-focused engineer with strong Node.js, PostgreSQL, and API architecture experience.",
    skills: ["Node.js", "PostgreSQL", "REST API"],
    workSamples: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80",
    ],
    status: "Rejected",
  },
  {
    id: 4,
    jobId: 1,
    freelancerName: "Laila Hassan",
    role: "Software Engineer",
    avatar: "https://i.pravatar.cc/120?img=25",
    verified: false,
    location: "Alexandria, Egypt",
    bidAmount: 2900,
    deliveryDays: 27,
    submittedText: "8 hours ago",
    rating: 4.6,
    reviewsCount: 54,
    successRate: 92,
    responseTime: "4 hours",
    coverLetter:
      "I have experience in SaaS development and can contribute across frontend and backend.",
    skills: ["React", "Express", "MongoDB"],
    workSamples: [
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=400&q=80",
    ],
    status: "Pending",
  },
  {
    id: 5,
    jobId: 1,
    freelancerName: "Omar Adel",
    role: "Full Stack Developer",
    avatar: "https://i.pravatar.cc/120?img=11",
    verified: true,
    location: "Riyadh, Saudi Arabia",
    bidAmount: 3000,
    deliveryDays: 26,
    submittedText: "3 hours ago",
    rating: 4.9,
    reviewsCount: 140,
    successRate: 99,
    responseTime: "45 mins",
    coverLetter:
      "I specialize in building SaaS dashboards and robust APIs. I can help you ship fast.",
    skills: ["React", "Next.js", "Node.js", "AWS"],
    workSamples: [
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80",
    ],
    status: "Interviewed",
  },
];

export function getProposalsByJobId(jobId: number): Proposal[] {
  return mockProposals.filter((proposal) => proposal.jobId === jobId);
}