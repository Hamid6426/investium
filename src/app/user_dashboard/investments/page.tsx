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
    totalPeriods: number;
  };
};

const UserInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await axiosInstance.get("/investment");
        setInvestments(res.data);
      } catch (err) {
        console.error("Failed to fetch investments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
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
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Investments</h1>

      {investments.length === 0 ? (
        <p className="text-lg text-paragraph">
          You have no active investments.
        </p>
      ) : (
        <div className="space-y-4">
          {investments.map((inv) => (
            <div
              key={inv._id}
              className="bg-card border border-border rounded-md p-4 shadow-sm"
            >
              <h2 className="font-semibold text-lg text-heading mb-2">
                {inv.planId.name}
              </h2>

              <div className="grid grid-cols-2 gap-2 text-sm text-paragraph">
                <p>Quantity:</p>
                <p>{inv.quantity}</p>

                <p>Base Amount:</p>
                <p>{inv.planId.baseInvestedAmount}</p>

                <p>Daily Return:</p>
                <p>{inv.planId.dailyReturned}</p>

                <p>Start Date:</p>
                <p>{new Date(inv.startDate).toLocaleDateString()}</p>

                <p>Current Day:</p>
                <p className="">{calculateDayNumber(inv.startDate)}</p>

                <p>Total Periods:</p>
                <p>{inv.planId.totalPeriods}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default UserInvestments;
