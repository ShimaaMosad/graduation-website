// types/home.ts

export interface HeroContent {
  heading: string;          // "Hire AI-Verified\nTalent. Work with\nConfidence."
  subheading: string;
  ctaClient: { label: string; href: string };
  ctaFreelancer: { label: string; href: string };
  imageSrc: string;
  badgeText: string;
  badgeSubText: string;
  stats: { label: string; value: string; icon: "users" | "dollar" | "star" }[];
}

export interface Step {
  id: number;
  title: string;
  text: string;
  icon: "search" | "shield" | "users";
}

export interface Category {
  id: number;
  name: string;
  count: string;
  color: string;    // Tailwind gradient class e.g. "from-blue-500 to-cyan-500"
  icon: "Code2" | "Smartphone" | "Palette" | "PenLine" | "Megaphone" | "Database" | "Video" | "Brain";
}

export interface Freelancer {
  id: number;
  name: string;
  rating: string;
  reviews: number;
  skills: string[];
  price: string;
  image: string;
}

export interface Feature {
  title: string;
  text: string;
  icon: "shield" | "credit-card" | "badge" | "clock";
}

export interface FooterLink { label: string; href: string }

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterContent {
  brand: { name: string; tagline: string };
  socials: { platform: "twitter" | "linkedin" | "facebook" | "instagram"; href: string }[];
  sections: FooterSection[];
  copyright: string;
  bottomLinks: FooterLink[];
}

export interface HomePageData {
  hero: HeroContent;
  steps: Step[];
  categories: Category[];
  freelancers: Freelancer[];
  features: Feature[];
  footer: FooterContent;
}