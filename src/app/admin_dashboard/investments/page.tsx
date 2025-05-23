"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Loader from "@/components/shared/Loader";

type Investment = {
  _id: string;
  quantity: number;
  currentDay: number;
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

const AllInvestmentsAdmin = () => {
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

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">All User Investments</h1>

      {investments.length === 0 ? (
        <p>No investments found.</p>
      ) : (
        <div className="space-y-6">
          {investments.map((inv) => (
            <div
              key={inv._id}
              className="p-4 border border-border bg-card rounded-md shadow"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="font-semibold">User:</span> {inv.userId.name}
                </div>
                <div>
                  <span className="font-semibold">Email:</span> {inv.userId.email}
                </div>
                <div>
                  <span className="font-semibold">Wallet:</span> {inv.userId.walletBalance}
                </div>
                <div>
                  <span className="font-semibold">Plan:</span> {inv.planId.name}
                </div>
                <div>
                  <span className="font-semibold">Quantity:</span> {inv.quantity}
                </div>
                <div>
                  <span className="font-semibold">Base:</span> {inv.planId.baseInvestedAmount}
                </div>
                <div>
                  <span className="font-semibold">Daily Return:</span> {inv.planId.dailyReturned}
                </div>
                <div>
                  <span className="font-semibold">Current Day:</span> {inv.currentDay}
                </div>
                <div>
                  <span className="font-semibold">Start:</span> {new Date(inv.startDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default AllInvestmentsAdmin;
