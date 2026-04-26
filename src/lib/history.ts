export type TransactionType = "Payment" | "Escrow Release" | "Refund" | "Withdrawal";
export type TransactionStatus = "Completed" | "Pending" | "Failed" | "Refunded";

export type Transaction = {
  id: string;
  type: TransactionType;
  description: string;
  date: string;
  status: TransactionStatus;
  amount: number;
};

export type MonthlySummaryPoint = {
  month: string;
  earnings: number;
  spending: number;
};

export type HistoryData = {
  totalSpent: number;
  totalEarned: number;
  pending: number;
  thisMonth: number;
  transactions: Transaction[];
  monthlySummary: MonthlySummaryPoint[];
};

/*
================ BACKEND READY ================

GET /history
GET /history?search=payment&type=Payment&status=Completed
GET /history/export

Expected response:
{
  totalSpent: number,
  totalEarned: number,
  pending: number,
  thisMonth: number,
  transactions: Transaction[],
  monthlySummary: MonthlySummaryPoint[]
}

================================================
*/

export const mockHistoryData: HistoryData = {
  totalSpent: 3450,
  totalEarned: 12800,
  pending: 640,
  thisMonth: 1200,
  transactions: [
    {
      id: "TRX-001",
      type: "Payment",
      description: "Design Services",
      date: "Oct 24, 2023",
      status: "Completed",
      amount: -313.5,
    },
    {
      id: "TRX-002",
      type: "Escrow Release",
      description: "Milestone 1",
      date: "Oct 22, 2023",
      status: "Completed",
      amount: 150,
    },
    {
      id: "TRX-003",
      type: "Refund",
      description: "Overcharge",
      date: "Oct 20, 2023",
      status: "Refunded",
      amount: 200,
    },
    {
      id: "TRX-004",
      type: "Withdrawal",
      description: "Bank Transfer",
      date: "Oct 18, 2023",
      status: "Pending",
      amount: -500,
    },
    {
      id: "TRX-005",
      type: "Payment",
      description: "Insufficient Funds",
      date: "Oct 15, 2023",
      status: "Failed",
      amount: -750,
    },
  ],
  monthlySummary: [
    { month: "Jul", earnings: 900, spending: 420 },
    { month: "Aug", earnings: 1200, spending: 650 },
    { month: "Sep", earnings: 1600, spending: 800 },
    { month: "Oct", earnings: 2100, spending: 1200 },
  ],
};

export async function getHistoryData(): Promise<HistoryData> {
  // REAL BACKEND LATER:
  // const res = await fetch("http://localhost:5000/api/history", {
  //   cache: "no-store",
  // });
  // if (!res.ok) throw new Error("Failed to fetch transaction history");
  // return res.json();

  return mockHistoryData;
}

export async function exportHistoryCSV(transactions: Transaction[]) {
  // REAL BACKEND LATER:
  // const res = await fetch("http://localhost:5000/api/history/export");
  // const blob = await res.blob();

  const rows = [
    ["ID", "Transaction", "Description", "Date", "Status", "Amount"],
    ...transactions.map((t) => [
      t.id,
      t.type,
      t.description,
      t.date,
      t.status,
      String(t.amount),
    ]),
  ];

  const csv = rows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "transaction-history.csv";
  a.click();

  window.URL.revokeObjectURL(url);
}