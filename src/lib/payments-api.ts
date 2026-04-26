export type ApiResponse = {
  success: boolean;
  message: string;
};

export type CheckoutSummary = {
  gigTitle: string;
  seller: string;
  image: string;
  packageName: string;
  packagePrice: number;
  extraRevision: number;
  promoCode: string;
  promoDiscount: number;
  serviceFee: number;
  total: number;
};

export type PaymentPayload = {
  method: "Credit Card" | "PayPal" | "Bank Transfer";
  nameOnCard: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
  sameAsProfile: boolean;
  promoCode: string;
  total: number;
};

export type EscrowMilestone = {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: "Completed" | "In Progress" | "Locked";
  due?: string;
  progress?: number;
};

export type EscrowData = {
  projectTitle: string;
  client: string;
  talent: string;
  started: string;
  totalBudget: number;
  totalReleased: number;
  inEscrow: number;
  remainingToFund: number;
  platformFee: number;
  milestones: EscrowMilestone[];
};

/*
================ BACKEND READY ================

GET  /checkout/summary
POST /checkout/pay
POST /checkout/apply-promo

GET  /escrow
POST /escrow/add-funds
POST /escrow/milestones/:id/approve-release
POST /escrow/milestones/:id/request-revision
POST /escrow/dispute

================================================
*/

export const mockCheckoutSummary: CheckoutSummary = {
  gigTitle: "I will design a modern logo",
  seller: "Ahmed Saleh",
  image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500",
  packageName: "Premium Package",
  packagePrice: 300,
  extraRevision: 15,
  promoCode: "SUMMER10",
  promoDiscount: 30,
  serviceFee: 28.5,
  total: 313.5,
};

export const mockEscrowData: EscrowData = {
  projectTitle: "Website Redesign Phase 1",
  client: "Ahmed S.",
  talent: "Sarah J.",
  started: "Oct 12, 2023",
  totalBudget: 500,
  totalReleased: 200,
  inEscrow: 200,
  remainingToFund: 100,
  platformFee: 25,
  milestones: [
    {
      id: 1,
      title: "Wireframes & Design System",
      description: "Initial wireframes for core pages and establishing the Figma component library.",
      amount: 200,
      status: "Completed",
      due: "Oct 15",
      progress: 100,
    },
    {
      id: 2,
      title: "Frontend Development (Home & Checkout)",
      description: "HTML/Tailwind implementation of the approved designs.",
      amount: 200,
      status: "In Progress",
      due: "Oct 22",
      progress: 65,
    },
    {
      id: 3,
      title: "Backend Integration",
      description: "API connection and final testing.",
      amount: 100,
      status: "Locked",
      progress: 0,
    },
  ],
};

export async function getCheckoutSummary(): Promise<CheckoutSummary> {
  // const res = await fetch("http://localhost:5000/api/checkout/summary");
  // if (!res.ok) throw new Error("Failed to fetch checkout summary");
  // return res.json();

  return mockCheckoutSummary;
}

export async function applyPromoCode(code: string): Promise<ApiResponse> {
  // const res = await fetch("http://localhost:5000/api/checkout/apply-promo", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ code }),
  // });
  // if (!res.ok) throw new Error("Failed to apply promo code");
  // return res.json();

  return {
    success: true,
    message: code.toUpperCase() === "SUMMER10" ? "Promo code applied." : "Invalid promo code.",
  };
}

export async function submitPayment(payload: PaymentPayload): Promise<ApiResponse> {
  // const res = await fetch("http://localhost:5000/api/checkout/pay", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error("Payment failed");
  // return res.json();

  console.log("Mock payment:", payload);

  return {
    success: true,
    message: "Payment submitted successfully and funds are now held in escrow.",
  };
}

export async function getEscrowData(): Promise<EscrowData> {
  // const res = await fetch("http://localhost:5000/api/escrow");
  // if (!res.ok) throw new Error("Failed to fetch escrow data");
  // return res.json();

  return mockEscrowData;
}

export async function addEscrowFunds(): Promise<ApiResponse> {
  return { success: true, message: "Add funds flow opened." };
}

export async function approveMilestoneRelease(id: number): Promise<ApiResponse> {
  return { success: true, message: `Milestone ${id} approved and released.` };
}

export async function requestMilestoneRevision(id: number): Promise<ApiResponse> {
  return { success: true, message: `Revision requested for milestone ${id}.` };
}

export async function raiseEscrowDispute(): Promise<ApiResponse> {
  return { success: true, message: "Dispute request submitted successfully." };
}