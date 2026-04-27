export type SupportStat = {
  id: number;
  label: string;
  value: string;
  icon: "articles" | "community" | "time" | "security";
};

export type Topic = {
  id: number;
  title: string;
  description: string;
  icon: "payment" | "ai" | "account" | "contract" | "security" | "rocket";
};

export type FAQ = {
  id: number;
  question: string;
  answer: string;
  category: "All" | "Freelancers" | "Clients";
};

export type ChatMessage = {
  id: number;
  sender: "bot" | "user";
  text: string;
};

export type SupportData = {
  stats: SupportStat[];
  topics: Topic[];
  faqs: FAQ[];
  chatMessages: ChatMessage[];
};

export const mockSupportData: SupportData = {
  stats: [
    { id: 1, label: "Help Articles", value: "1,200+", icon: "articles" },
    { id: 2, label: "Community Posts", value: "50k+", icon: "community" },
    { id: 3, label: "Avg. Ticket Response", value: "< 2 hrs", icon: "time" },
    { id: 4, label: "Secure Help Center", value: "24/7", icon: "security" },
  ],
  topics: [
    {
      id: 1,
      title: "Payments & Payouts",
      description: "Learn about invoicing, escrows, withdrawal methods, and fee structures.",
      icon: "payment",
    },
    {
      id: 2,
      title: "AI Features Guide",
      description: "Maximize your workflow with our AI matching, drafting, and analysis tools.",
      icon: "ai",
    },
    {
      id: 3,
      title: "Security & Verification",
      description: "Protect your account, verify your identity, and manage trusted devices.",
      icon: "security",
    },
    {
      id: 4,
      title: "Account Management",
      description: "Updating profiles, managing notifications, and account suspension appeals.",
      icon: "account",
    },
    {
      id: 5,
      title: "Contracts & Disputes",
      description: "Understanding service agreements, milestones, and dispute resolution.",
      icon: "contract",
    },
    {
      id: 6,
      title: "Getting Started",
      description: "Create your first profile, post a job, or submit your first proposal.",
      icon: "rocket",
    },
  ],
  faqs: [
    {
      id: 1,
      category: "All",
      question: "How does the AI matching system work?",
      answer:
        "Our AI matching algorithm analyzes your skills profile, past performance, availability, timeline, and budget alignment to suggest the best fit between freelancers and client projects.",
    },
    {
      id: 2,
      category: "Clients",
      question: "What happens if a client disputes a milestone?",
      answer:
        "The milestone enters review. Both sides can submit evidence, and the support team reviews the agreement, delivered work, and communication history before making a decision.",
    },
    {
      id: 3,
      category: "Freelancers",
      question: "How do I verify my identity on the platform?",
      answer:
        "Go to the Verify step in your profile setup, upload your required identity documents, submit your selfie check, and wait for the admin review.",
    },
    {
      id: 4,
      category: "Freelancers",
      question: "Can I use the AI drafting tool for proposals outside MySite?",
      answer:
        "The AI drafting tool is designed for proposals created inside MySite. You can use the generated text as inspiration, but always review and customize it before sending.",
    },
  ],
  chatMessages: [
    {
      id: 1,
      sender: "bot",
      text: "Hi there! I'm your AI Concierge. How can I assist you with your MySite account today?",
    },
    {
      id: 2,
      sender: "user",
      text: "I'm trying to figure out how to update my payment method.",
    },
    {
      id: 3,
      sender: "bot",
      text: "I can help with that! To update your payment method, go to Billing Settings. Would you like me to guide you there, or show you an article?",
    },
  ],
};

/*
REAL BACKEND READY

GET /api/support
GET /api/support/search?q=payment
POST /api/support/chat
POST /api/support/tickets

*/

export async function getSupportData(): Promise<SupportData> {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/support`);
  // if (!res.ok) throw new Error("Failed to fetch support data");
  // return res.json();

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSupportData), 300);
  });
}

export async function sendSupportMessage(message: string) {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/support/chat`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ message }),
  // });
  // if (!res.ok) throw new Error("Failed to send message");
  // return res.json();

  return {
    id: Date.now(),
    sender: "bot" as const,
    text: `Thanks for your message. I found help related to "${message}". You can check the FAQ section or create a ticket for human support.`,
  };
}

export async function createSupportTicket() {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/support/tickets`, {
  //   method: "POST",
  // });
  // return res.json();

  return { success: true, ticketId: "TCK-10245" };
}