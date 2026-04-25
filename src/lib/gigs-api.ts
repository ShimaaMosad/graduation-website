export type GigCategory =
  | "All Categories"
  | "Web Development"
  | "Mobile Apps"
  | "Graphic Design"
  | "Writing & Translation"
  | "Digital Marketing"
  | "Video & Animation"
  | "Programming";

export type DeliveryOption =
  | "Express (24 hrs)"
  | "Up to 3 days"
  | "Up to 7 days"
  | "Anytime";

export type SellerLevel =
  | "Top Rated"
  | "AI Verified"
  | "New Seller";

export type MinRatingOption =
  | "4.5+ stars"
  | "4.0+ stars"
  | "3.5+ stars"
  | "Any rating";

export type ServiceInclude =
  | "Revisions included"
  | "Source files"
  | "Commercial use";

export type GigPackageName = "Basic" | "Standard";

export type GigPackage = {
  name: GigPackageName;
  title: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string[];
};

export type GigReview = {
  id: number;
  reviewer: string;
  avatar: string;
  country: string;
  rating: number;
  timeAgo: string;
  text: string;
  helpfulCount: number;
};

export type GigExtra = {
  id: number;
  label: string;
  price: number;
};

export type Gig = {
  id: number;
  sellerId: number;
  title: string;
  slug: string;
  category: GigCategory;
  sellerName: string;
  sellerAvatar: string;
  sellerTitle: string;
  sellerLevel: SellerLevel[];
  image: string;
  gallery: string[];
  price: number;
  rating: number;
  reviewsCount: number;
  likesCount: number;
  deliveryOptions: DeliveryOption[];
  serviceIncludes: ServiceInclude[];
  aiVerified: boolean;
  topRated: boolean;
  about: string[];
  whatYouWillGet: string[];
  skills: string[];
  sellerBio: string;
  sellerStats: {
    completed: string;
    ratingText: string;
    avgResponse: string;
  };
  packages: GigPackage[];
  extras: GigExtra[];
  reviews: GigReview[];
};

export type GigsFilters = {
  search: string;
  category: GigCategory;
  minBudget: number;
  maxBudget: number;
  deliveryOptions: DeliveryOption[];
  sellerLevels: SellerLevel[];
  minRating: MinRatingOption;
  serviceIncludes: ServiceInclude[];
  sortBy: "Recommended" | "Lowest Price" | "Highest Rating" | "Most Popular";
};

export type OrderPayload = {
  gigId: number;
  packageName: GigPackageName;
  quantity: number;
  extraIds: number[];
  brandName: string;
  tagline: string;
  colorPreferences: string;
  requirements: string;
};

/*
========================================================
BACKEND INTEGRATION NOTES
========================================================

Expected endpoints:

GET    /gigs
GET    /gigs/:slug
POST   /gigs/:id/favorite
DELETE /gigs/:id/favorite
POST   /gigs/:id/contact
POST   /gigs/:id/reviews/:reviewId/helpful
POST   /gigs/order

--------------------------------------------------------
GET /gigs
--------------------------------------------------------
Query params:
?q=
&category=
&minBudget=
&maxBudget=
&deliveryOptions=
&sellerLevels=
&minRating=
&serviceIncludes=
&sortBy=
&page=
&limit=

--------------------------------------------------------
GET /gigs/:slug
--------------------------------------------------------
Return one gig details object

--------------------------------------------------------
POST /gigs/order
--------------------------------------------------------
Body example:
{
  "gigId": 1,
  "packageName": "Standard",
  "quantity": 1,
  "extraIds": [2],
  "brandName": "My Brand",
  "tagline": "Creative and modern",
  "colorPreferences": "Blue and white",
  "requirements": "Need minimal logo"
}

--------------------------------------------------------
REAL API EXAMPLES
--------------------------------------------------------

export async function getGigBySlugFromApi(slug: string): Promise<Gig> {
  const res = await fetch(`http://localhost:5000/api/gigs/${slug}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch gig");
  return res.json();
}

export async function createGigOrder(payload: OrderPayload) {
  const res = await fetch("http://localhost:5000/api/gigs/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}
*/

export const gigsCategories: GigCategory[] = [
  "All Categories",
  "Web Development",
  "Mobile Apps",
  "Graphic Design",
  "Writing & Translation",
  "Digital Marketing",
  "Video & Animation",
  "Programming",
];

export const mockGigs: Gig[] = [
  {
    id: 1,
    sellerId: 101,
    title: "I will design a modern logo for your brand",
    slug: "modern-logo-brand",
    category: "Graphic Design",
    sellerName: "Ahmed Saleh",
    sellerAvatar: "https://i.pravatar.cc/100?img=15",
    sellerTitle: "Professional Logo Designer",
    sellerLevel: ["AI Verified", "Top Rated"],
   image: "https://picsum.photos/id/1067/900/500",
gallery: [
  "https://picsum.photos/id/1067/900/500",
  "https://picsum.photos/id/180/900/500",
  "https://picsum.photos/id/0/900/500",
],
    price: 150,
    rating: 4.9,
    reviewsCount: 234,
    likesCount: 1200,
    deliveryOptions: ["Express (24 hrs)", "Up to 3 days"],
    serviceIncludes: ["Revisions included", "Source files", "Commercial use"],
    aiVerified: true,
    topRated: true,
    about: [
      "I'm a professional logo designer with 5+ years of experience. I will create a unique, modern logo that perfectly represents your brand. The design process includes multiple concepts, revisions, and all source files.",
      "My designs are crafted with attention to detail, ensuring your logo stands out and makes a lasting impression. I work closely with clients to understand their vision and deliver results that exceed expectations.",
      "Whether you're starting a new business or rebranding an existing one, I'll help you create a visual identity that resonates with your target audience.",
    ],
    whatYouWillGet: [
      "Modern logo design",
      "Vector files (AI, EPS, SVG)",
      "High-resolution PNG & JPG",
      "Unlimited revisions",
      "100% satisfaction guarantee",
      "Commercial use rights",
      "Source files included",
    ],
    skills: ["Logo Design", "Adobe Illustrator", "Branding", "Graphic Design"],
    sellerBio:
      "Creative designer with a passion for crafting unique brand identities. I've helped over 500 businesses establish their visual presence in the market.",
    sellerStats: {
      completed: "500+",
      ratingText: "4.9",
      avgResponse: "2 hours",
    },
    packages: [
      {
        name: "Basic",
        title: "Basic Package",
        description: "Simple logo design for startups and small businesses",
        price: 180,
        deliveryDays: 3,
        revisions: 2,
        features: ["1 logo concept", "PNG & JPG files", "Commercial use"],
      },
      {
        name: "Standard",
        title: "Standard Package",
        description: "Complete logo design with multiple concepts",
        price: 300,
        deliveryDays: 5,
        revisions: 3,
        features: [
          "3 logo concepts",
          "Vector files (AI, EPS, SVG)",
          "High-res PNG & JPG",
          "Commercial use",
          "Source files",
        ],
      },
    ],
    extras: [
      { id: 1, label: "Extra fast delivery", price: 30 },
      { id: 2, label: "Additional revision", price: 15 },
      { id: 3, label: "Source files", price: 20 },
    ],
    reviews: [
      {
        id: 1,
        reviewer: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/100?img=32",
        country: "US",
        rating: 5,
        timeAgo: "2 weeks ago",
        text: "Amazing work! Delivered exactly what I needed and communication was excellent throughout the project. Highly recommended.",
        helpfulCount: 12,
      },
      {
        id: 2,
        reviewer: "Michael Brown",
        avatar: "https://i.pravatar.cc/100?img=18",
        country: "GB",
        rating: 5,
        timeAgo: "1 month ago",
        text: "Professional and creative designer. Very responsive to feedback and made all revisions quickly. The final logo is perfect for my brand.",
        helpfulCount: 8,
      },
      {
        id: 3,
        reviewer: "Emma Davis",
        avatar: "https://i.pravatar.cc/100?img=47",
        country: "CA",
        rating: 4.5,
        timeAgo: "3 weeks ago",
        text: "Great experience overall. The designer understood my vision and delivered quality work on time.",
        helpfulCount: 5,
      },
    ],
  },
  {
    id: 2,
    sellerId: 102,
    title: "I will develop a responsive website with modern design",
    slug: "responsive-website-modern-design",
    category: "Web Development",
    sellerName: "Sarah Johnson",
    sellerAvatar: "https://i.pravatar.cc/100?img=32",
    sellerTitle: "Frontend Web Developer",
    sellerLevel: ["AI Verified"],
    image: "https://picsum.photos/id/180/900/500",
gallery: [
  "https://picsum.photos/id/180/900/500",
  "https://picsum.photos/id/0/900/500",
],
    price: 500,
    rating: 5,
    reviewsCount: 189,
    likesCount: 856,
    deliveryOptions: ["Up to 7 days", "Anytime"],
    serviceIncludes: ["Revisions included", "Commercial use"],
    aiVerified: true,
    topRated: false,
    about: ["I build clean and modern responsive websites tailored to your business needs."],
    whatYouWillGet: ["Responsive design", "Landing pages", "Clean code"],
    skills: ["React", "Next.js", "Tailwind CSS"],
    sellerBio: "Frontend engineer focused on responsive and modern websites.",
    sellerStats: { completed: "300+", ratingText: "5.0", avgResponse: "1 hour" },
    packages: [
      {
        name: "Basic",
        title: "Basic Package",
        description: "Landing page design and development",
        price: 400,
        deliveryDays: 5,
        revisions: 2,
        features: ["1 page", "Responsive", "Source code"],
      },
      {
        name: "Standard",
        title: "Standard Package",
        description: "Multi-section responsive business website",
        price: 500,
        deliveryDays: 7,
        revisions: 3,
        features: ["Up to 5 sections", "Responsive", "Source code", "Deploy help"],
      },
    ],
    extras: [
      { id: 4, label: "Extra fast delivery", price: 50 },
      { id: 5, label: "Additional page", price: 80 },
    ],
    reviews: [],
  },
  {
    id: 3,
    sellerId: 103,
    title: "I will create a comprehensive digital marketing strategy",
    slug: "digital-marketing-strategy",
    category: "Digital Marketing",
    sellerName: "James Wilson",
    sellerAvatar: "https://i.pravatar.cc/100?img=18",
    sellerTitle: "Digital Marketing Specialist",
    sellerLevel: ["Top Rated"],
   image: "https://picsum.photos/id/48/900/500",
gallery: ["https://picsum.photos/id/48/900/500"],
    price: 450,
    rating: 4.7,
    reviewsCount: 145,
    likesCount: 980,
    deliveryOptions: ["Up to 7 days", "Anytime"],
    serviceIncludes: ["Revisions included"],
    aiVerified: false,
    topRated: true,
    about: ["Comprehensive strategy for your digital campaigns."],
    whatYouWillGet: ["Marketing strategy", "Audience targeting"],
    skills: ["Marketing", "Ads", "Analytics"],
    sellerBio: "Helping brands scale with smart marketing strategies.",
    sellerStats: { completed: "250+", ratingText: "4.7", avgResponse: "3 hours" },
    packages: [
      {
        name: "Basic",
        title: "Basic Package",
        description: "Quick marketing audit",
        price: 250,
        deliveryDays: 3,
        revisions: 1,
        features: ["Audit", "Recommendations"],
      },
      {
        name: "Standard",
        title: "Standard Package",
        description: "Complete strategy plan",
        price: 450,
        deliveryDays: 7,
        revisions: 2,
        features: ["Audit", "Strategy", "Recommendations"],
      },
    ],
    extras: [{ id: 6, label: "Extra campaign plan", price: 60 }],
    reviews: [],
  },
  {
    id: 4,
    sellerId: 104,
    title: "I will edit professional videos with animations",
    slug: "edit-professional-videos-animations",
    category: "Video & Animation",
    sellerName: "Nina Rodriguez",
    sellerAvatar: "https://i.pravatar.cc/100?img=47",
    sellerTitle: "Video Editor",
    sellerLevel: ["AI Verified", "Top Rated"],
   image: "https://picsum.photos/id/96/900/500",
gallery: ["https://picsum.photos/id/96/900/500"],
    price: 300,
    rating: 4.9,
    reviewsCount: 267,
    likesCount: 1100,
    deliveryOptions: ["Up to 3 days", "Up to 7 days"],
    serviceIncludes: ["Revisions included", "Commercial use"],
    aiVerified: true,
    topRated: true,
    about: ["Professional video editing with motion graphics."],
    whatYouWillGet: ["Edited video", "Animations"],
    skills: ["Premiere Pro", "After Effects"],
    sellerBio: "Editing engaging videos for brands and creators.",
    sellerStats: { completed: "420+", ratingText: "4.9", avgResponse: "2 hours" },
    packages: [
      {
        name: "Basic",
        title: "Basic Package",
        description: "Simple edit",
        price: 200,
        deliveryDays: 3,
        revisions: 2,
        features: ["Cutting", "Color correction"],
      },
      {
        name: "Standard",
        title: "Standard Package",
        description: "Full video edit with animations",
        price: 300,
        deliveryDays: 5,
        revisions: 3,
        features: ["Animations", "Transitions", "Color correction"],
      },
    ],
    extras: [{ id: 7, label: "Extra subtitles", price: 20 }],
    reviews: [],
  },
];

export const defaultGigsFilters: GigsFilters = {
  search: "",
  category: "All Categories",
  minBudget: 0,
  maxBudget: 1000,
  deliveryOptions: [],
  sellerLevels: [],
  minRating: "Any rating",
  serviceIncludes: [],
  sortBy: "Recommended",
};

export function filterAndSortGigs(gigs: Gig[], filters: GigsFilters) {
  let result = [...gigs];

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (gig) =>
        gig.title.toLowerCase().includes(q) ||
        gig.category.toLowerCase().includes(q) ||
        gig.sellerName.toLowerCase().includes(q)
    );
  }

  if (filters.category !== "All Categories") {
    result = result.filter((gig) => gig.category === filters.category);
  }

  result = result.filter(
    (gig) => gig.price >= filters.minBudget && gig.price <= filters.maxBudget
  );

  if (filters.deliveryOptions.length > 0) {
    result = result.filter((gig) =>
      filters.deliveryOptions.some((option) => gig.deliveryOptions.includes(option))
    );
  }

  if (filters.sellerLevels.length > 0) {
    result = result.filter((gig) =>
      filters.sellerLevels.some((level) => gig.sellerLevel.includes(level))
    );
  }

  if (filters.minRating === "4.5+ stars") {
    result = result.filter((gig) => gig.rating >= 4.5);
  } else if (filters.minRating === "4.0+ stars") {
    result = result.filter((gig) => gig.rating >= 4.0);
  } else if (filters.minRating === "3.5+ stars") {
    result = result.filter((gig) => gig.rating >= 3.5);
  }

  if (filters.serviceIncludes.length > 0) {
    result = result.filter((gig) =>
      filters.serviceIncludes.every((item) => gig.serviceIncludes.includes(item))
    );
  }

  if (filters.sortBy === "Lowest Price") {
    result.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === "Highest Rating") {
    result.sort((a, b) => b.rating - a.rating);
  } else if (filters.sortBy === "Most Popular") {
    result.sort((a, b) => b.likesCount - a.likesCount);
  } else {
    result.sort((a, b) => {
      const scoreA = a.rating * 100 + a.likesCount + (a.aiVerified ? 50 : 0) + (a.topRated ? 50 : 0);
      const scoreB = b.rating * 100 + b.likesCount + (b.aiVerified ? 50 : 0) + (b.topRated ? 50 : 0);
      return scoreB - scoreA;
    });
  }

  return result;
}

export function getGigBySlug(slug: string) {
  return mockGigs.find((gig) => gig.slug === slug);
}

export function buildOrderQuery(params: {
  packageName: GigPackageName;
  quantity: number;
  extraIds: number[];
}) {
  const search = new URLSearchParams();
  search.set("package", params.packageName);
  search.set("quantity", String(params.quantity));
  search.set("extras", params.extraIds.join(","));
  return search.toString();
}

export function parseExtraIds(value: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => Number(item))
    .filter((num) => !Number.isNaN(num));
}