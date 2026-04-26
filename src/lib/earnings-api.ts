export type WithdrawMethod = {
  id: string;
  name: string;
  details: string;
  fee: string;
  type: "bank" | "instant" | "paypal";
};

export type Withdrawal = {
  id: string;
  method: string;
  date: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
};

export type EarningCategory = {
  name: string;
  percentage: number;
};

export type EarningsData = {
  availableBalance: number;
  pending: number;
  totalEarned: number;
  thisMonth: number;
  withdrawn: number;
  methods: WithdrawMethod[];
  withdrawals: Withdrawal[];
  categories: EarningCategory[];
};

/*
================ BACKEND READY ================

GET  /earnings
POST /earnings/withdraw
POST /earnings/methods

Expected POST /earnings/withdraw body:
{
  amount: number,
  methodId: string
}

Expected response:
{
  success: boolean,
  message: string
}

================================================
*/

export const mockEarningsData: EarningsData = {
  availableBalance: 2450,
  pending: 850,
  totalEarned: 12400,
  thisMonth: 3200,
  withdrawn: 9100,
  methods: [
    {
      id: "chase",
      name: "Chase Bank",
      details: "**** 4567",
      fee: "Free • 1-3 days",
      type: "bank",
    },
    {
      id: "instapay",
      name: "InstaPay",
      details: "instant@email.com",
      fee: "$1.50 fee • Instant",
      type: "instant",
    },
    {
      id: "paypal",
      name: "PayPal",
      details: "user@email.com",
      fee: "2% fee • Instant",
      type: "paypal",
    },
  ],
  withdrawals: [
    { id: "w1", method: "Chase Bank", date: "Oct 12, 2023", amount: 1200, status: "Completed" },
    { id: "w2", method: "PayPal", date: "Sep 28, 2023", amount: 850, status: "Completed" },
    { id: "w3", method: "Chase Bank", date: "Sep 15, 2023", amount: 2100, status: "Completed" },
    { id: "w4", method: "InstaPay", date: "Aug 30, 2023", amount: 450, status: "Completed" },
  ],
  categories: [
    { name: "Web Dev", percentage: 60 },
    { name: "Logo Design", percentage: 25 },
    { name: "Consulting", percentage: 15 },
  ],
};

export async function getEarningsData(): Promise<EarningsData> {
  // const res = await fetch("http://localhost:5000/api/earnings", {
  //   cache: "no-store",
  // });
  // if (!res.ok) throw new Error("Failed to fetch earnings");
  // return res.json();

  return mockEarningsData;
}

export async function submitWithdrawal(payload: {
  amount: number;
  methodId: string;
}): Promise<{ success: boolean; message: string }> {
  // const res = await fetch("http://localhost:5000/api/earnings/withdraw", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error("Failed to submit withdrawal");
  // return res.json();

  console.log("Mock withdrawal:", payload);

  return {
    success: true,
    message: `Withdrawal request for $${payload.amount.toFixed(2)} submitted successfully.`,
  };
}

export type EarningsOverviewPoint = {
  month: string;
  amount: number;
};

export const mockEarningsOverview: EarningsOverviewPoint[] = [
  { month: "May", amount: 900 },
  { month: "Jun", amount: 1400 },
  { month: "Jul", amount: 1100 },
  { month: "Aug", amount: 2200 },
  { month: "Sep", amount: 1700 },
  { month: "Oct", amount: 2450 },
];

export async function getEarningsOverview(): Promise<EarningsOverviewPoint[]> {
  // REAL BACKEND LATER:
  // const res = await fetch("http://localhost:5000/api/earnings/overview?range=6months", {
  //   cache: "no-store",
  // });
  // if (!res.ok) throw new Error("Failed to fetch earnings overview");
  // return res.json();

  return mockEarningsOverview;
}

export async function downloadTaxReport(): Promise<{ success: boolean; message: string }> {
  // REAL BACKEND LATER:
  // const res = await fetch("http://localhost:5000/api/earnings/report?year=2023");
  // if (!res.ok) throw new Error("Failed to download report");
  // const blob = await res.blob();
  // const url = window.URL.createObjectURL(blob);
  // const a = document.createElement("a");
  // a.href = url;
  // a.download = "earnings-report-2023.pdf";
  // a.click();

  return {
    success: true,
    message: "Tax report download started.",
  };
}