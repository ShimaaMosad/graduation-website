export type OrderStatus =
  | "In Progress"
  | "Delivered"
  | "Completed"
  | "Late"
  | "Cancelled"
  | "Awaiting Acceptance";

export type Order = {
  id: string;
  buyer: string;
  buyerCountry: string;
  buyerAvatar: string;
  gigTitle: string;
  price: number;
  status: OrderStatus;
  deadline: string;
};

export type OrderDetails = Order & {
  buyerRating: number;
  buyerReviews: number;
  from: string;
  memberSince: string;
  ordersFromBuyer: number;
  image: string;
  datePlaced: string;
  packageName: string;
  revisions: string;
  format: string;
  deliveryTime: string;
  requirements: string;
  attachments: string[];
  progress: number;
  platformFee: number;
};

export type ApiResponse = {
  success: boolean;
  message: string;
};

export type RevisionRequestPayload = {
  orderId: string;
  revisionType: "Design" | "Content" | "Bug Fix";
  priority: "Low" | "Medium" | "High";
  description: string;
  suggestedDeadline: string;
  files: string[];
};

export const mockOrders: Order[] = [
  {
    id: "ORD-4821",
    buyer: "Sara Ahmed",
    buyerCountry: "US",
    buyerAvatar: "https://i.pravatar.cc/100?img=32",
    gigTitle: "Full-Stack App",
    price: 350,
    status: "In Progress",
    deadline: "Apr 28",
  },
  {
    id: "ORD-4756",
    buyer: "James Miller",
    buyerCountry: "UK",
    buyerAvatar: "https://i.pravatar.cc/100?img=12",
    gigTitle: "UI/UX Design",
    price: 180,
    status: "Delivered",
    deadline: "Overdue",
  },
  {
    id: "ORD-4660",
    buyer: "Mona Ali",
    buyerCountry: "EG",
    buyerAvatar: "https://i.pravatar.cc/100?img=47",
    gigTitle: "Logo Design",
    price: 220,
    status: "Completed",
    deadline: "Apr 18",
  },
];

export const mockOrderDetails: OrderDetails = {
  ...mockOrders[0],
  buyerRating: 5.0,
  buyerReviews: 42,
  from: "United Kingdom",
  memberSince: "Mar 2021",
  ordersFromBuyer: 2,
  image: "https://i.pravatar.cc/300?img=13",
  datePlaced: "Oct 12, 2023",
  packageName: "Premium",
  revisions: "3 Included",
  format: "ZIP, Git Repo",
  deliveryTime: "14 Days",
  requirements:
    "I need a React frontend connected to a Node.js/Express backend. Database should be PostgreSQL. Please ensure the dashboard includes the analytics charts we discussed.",
  attachments: ["ui-designs-final.fig", "brand-assets.zip"],
  progress: 65,
  platformFee: 35,
};

/*
================ BACKEND READY ================

GET    /orders
GET    /orders/:id
POST   /orders/:id/accept
POST   /orders/:id/extend-deadline
POST   /orders/:id/dispute
POST   /orders/:id/revision

================================================
*/

export async function getOrders(): Promise<Order[]> {
  // const res = await fetch("http://localhost:5000/api/orders", { cache: "no-store" });
  // if (!res.ok) throw new Error("Failed to fetch orders");
  // return res.json();

  return mockOrders;
}

export async function getOrderById(id: string): Promise<OrderDetails> {
  // const res = await fetch(`http://localhost:5000/api/orders/${id}`, { cache: "no-store" });
  // if (!res.ok) throw new Error("Failed to fetch order");
  // return res.json();

  return { ...mockOrderDetails, id };
}

export async function acceptDelivery(orderId: string): Promise<ApiResponse> {
  // const res = await fetch(`http://localhost:5000/api/orders/${orderId}/accept`, {
  //   method: "POST",
  // });
  // if (!res.ok) throw new Error("Failed to accept delivery");
  // return res.json();

  return { success: true, message: "Delivery accepted successfully." };
}

export async function extendDeadline(orderId: string): Promise<ApiResponse> {
  // const res = await fetch(`http://localhost:5000/api/orders/${orderId}/extend-deadline`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ days: 3 }),
  // });
  // if (!res.ok) throw new Error("Failed to extend deadline");
  // return res.json();

  return { success: true, message: "Deadline extension request sent successfully." };
}

export async function raiseDispute(orderId: string): Promise<ApiResponse> {
  // const res = await fetch(`http://localhost:5000/api/orders/${orderId}/dispute`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ reason: "Order dispute raised" }),
  // });
  // if (!res.ok) throw new Error("Failed to raise dispute");
  // return res.json();

  return { success: true, message: "Dispute has been raised successfully." };
}

export async function submitRevisionRequest(
  payload: RevisionRequestPayload
): Promise<ApiResponse> {
  // const res = await fetch(`http://localhost:5000/api/orders/${payload.orderId}/revision`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error("Failed to submit revision request");
  // return res.json();

  console.log("Mock revision request:", payload);

  return { success: true, message: "Revision request submitted successfully." };
}