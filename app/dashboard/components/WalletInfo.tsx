"use client";

import { MdInfoOutline } from "react-icons/md";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Loader from "@/components/shared/Loader";

export default function WalletInfo() {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [weeklyEarnings, setWeeklyEarnings] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, earningsRes] = await Promise.all([
          axiosInstance.get("/api/profile"),
          axiosInstance.get("/api/profile/weekly-earning"),
        ]);

        setWalletBalance(profileRes.data.walletBalance ?? 0);
        setWeeklyEarnings(earningsRes.data.weeklyEarnings ?? 0);
      } catch (err: any) {
        console.error("Wallet Info Error:", err);
        setError(
          err.response?.data?.error || "Failed to load wallet information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="max-w-lg w-full h-24 bg-card rounded-lg px-3 py-2 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-lg w-full bg-card rounded-xl px-3 py-4 overflow-hidden">
      <div className="flex flex-col">
        <div className="pb-4 text-lg font-medium">Wallet Info</div>
        <div className="w-full h-[1px] bg-accent"></div>

        <div className="grid grid-cols-2 gap-y-3 mt-4 text-lg font-semibold">
          <div className="ml-1">Main Wallet</div>
          <div className="place-self-end mr-1">
            {walletBalance.toLocaleString("en-PK")}
          </div>
        </div>

        <div className="w-full h-[1px] bg-accent mt-4"></div>

        <div className="flex items-center gap-4 mt-4 text-muted">
          <MdInfoOutline className="text-lg" />
          <div className="text-xs">
            You earned{" "}
            <span className="font-medium">
              {weeklyEarnings.toLocaleString("en-PK")}
            </span>{" "}
            PKR this week
          </div>
        </div>
      </div>
    </div>
  );
}
