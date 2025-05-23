"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Loader from "@/components/shared/Loader";

type Investment = {
  _id: string;
  quantity: number;
  startDate: string;
  planId: {
    name: string;
    baseInvestedAmount: number;
    dailyReturned: number;
  };
  userId: {
    name: string;
    email: string;
    walletBalance: number;
  };
};

const AllInvestmentsListForAdmin = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axiosInstance.get("/investment/get-all-investments");
        setInvestments(res.data);
      } catch (err) {
        console.error("Failed to fetch admin investments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const calculateDayNumber = (startDate: string) => {
    const start = new Date(startDate).getTime();
    const now = Date.now();
    return Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen text-paragraph">
      <h1 className="text-2xl font-bold mb-4 text-heading">All User Investments</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-card border border-border text-sm">
          <thead>
            <tr className="bg-secondary text-heading">
              <th className="py-2 px-4 border-b border-border">User</th>
              <th className="py-2 px-4 border-b border-border">Email</th>
              <th className="py-2 px-4 border-b border-border">Wallet</th>
              <th className="py-2 px-4 border-b border-border">Plan</th>
              <th className="py-2 px-4 border-b border-border">Quantity</th>
              <th className="py-2 px-4 border-b border-border">Base Amount</th>
              <th className="py-2 px-4 border-b border-border">Daily Return</th>
              <th className="py-2 px-4 border-b border-border">Day No</th>
              <th className="py-2 px-4 border-b border-border">Start Date</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => (
              <tr key={inv._id} className="text-center hover:bg-secondary/40 transition">
                <td className="py-2 px-4 border-b border-border">{inv.userId.name}</td>
                <td className="py-2 px-4 border-b border-border">{inv.userId.email}</td>
                <td className="py-2 px-4 border-b border-border">{inv.userId.walletBalance}</td>
                <td className="py-2 px-4 border-b border-border">{inv.planId.name}</td>
                <td className="py-2 px-4 border-b border-border">{inv.quantity}</td>
                <td className="py-2 px-4 border-b border-border">{inv.planId.baseInvestedAmount}</td>
                <td className="py-2 px-4 border-b border-border">{inv.planId.dailyReturned}</td>
                <td className="py-2 px-4 border-b border-border">{calculateDayNumber(inv.startDate)}</td>
                <td className="py-2 px-4 border-b border-border">
                  {new Date(inv.startDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllInvestmentsListForAdmin;
