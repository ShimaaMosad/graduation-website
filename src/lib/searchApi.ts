export type SearchTab = "All" | "Gigs" | "Freelancers" | "Jobs";

export type GigItem = {
  id: number;
  seller: string;
  level: string;
  title: string;
  rating: number;
  reviews: string;
  price: string;
  numericPrice: number;
  serviceType: string;
  image: string;
  match: number;
};

export type FreelancerItem = {
  id: number;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  hourlyRate: string;
  skills: string[];
  match: number;
};

export type TopMatch = {
  name: string;
  title: string;
  avatar: string;
  quote: string;
  match: number;
};

export type SearchData = {
  query: string;
  totalResults: number;
  related: string[];
  topMatch: TopMatch;
  gigs: GigItem[];
  freelancers: FreelancerItem[];
};

export const mockSearchData: SearchData = {
  query: "logo design",
  totalResults: 1245,
  related: ["Minimalist Logo", "Brand Identity", "Mascot Design", "3D Logo"],
  topMatch: {
    name: "Sarah Jenkins",
    title: "Top Rated Brand Identity Specialist",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200",
    quote:
      "Sarah perfectly matches your need for 'minimalist logo design' and has excellent ratings in your industry.",
    match: 98,
  },
  gigs: [
    {
      id: 1,
      seller: "Alex M.",
      level: "Level 2 Seller",
      title: "I will design a modern minimalist logo for your business",
      rating: 4.9,
      reviews: "1.2k",
      price: "$150",
      numericPrice: 150,
      serviceType: "Logo Design",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700",
      match: 95,
    },
    {
      id: 2,
      seller: "Marcus T.",
      level: "Top Rated Seller",
      title: "I will create a timeless logo and brand style guide",
      rating: 4.8,
      reviews: "840",
      price: "$250",
      numericPrice: 250,
      serviceType: "Brand Style Guides",
      image:
        "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=700",
      match: 89,
    },
    {
      id: 3,
      seller: "Nora K.",
      level: "New Seller",
      title: "I will design elegant business cards for your brand",
      rating: 4.7,
      reviews: "320",
      price: "$80",
      numericPrice: 80,
      serviceType: "Business Cards",
      image:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=700",
      match: 84,
    },
  ],
  freelancers: [
    {
      id: 1,
      name: "Elena Vasquez",
      title: "Senior Art Director & Logo Expert",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      rating: 5.0,
      hourlyRate: "$85/hr",
      skills: ["Brand Identity", "Typography", "Vector"],
      match: 92,
    },
  ],
};

export async function getSearchResults(
  query: string,
  tab: SearchTab
): Promise<SearchData> {
  // REAL API:
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/search?query=${query}&type=${tab.toLowerCase()}`
  // );
  // if (!res.ok) throw new Error("Failed to fetch search results");
  // return res.json();

  console.log("Search:", query, tab);

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSearchData), 300);
  });
}