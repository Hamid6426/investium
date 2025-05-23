// components/VerifyUserActions.tsx
"use client";

import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";

interface Props {
  userId: string;
  isVerified?: boolean;
  onActionComplete: () => void;
}

const VerifyUserActions = ({ userId, isVerified, onActionComplete }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleVerify = async (approve: boolean) => {
    try {
      setLoading(true);
      await axiosInstance.post("/api/auth/verify-user", {
        userId,
        isVerified: approve,
      });
      onActionComplete();
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isVerified) return <span className="text-green-600">✅</span>;

  return (
    <div className="flex gap-2 justify-center">
      <button
        onClick={() => handleVerify(true)}
        disabled={loading}
        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
      >
        Accept
      </button>
      <button
        onClick={() => handleVerify(false)}
        disabled={loading}
        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
      >
        Reject
      </button>
    </div>
  );
};

export default VerifyUserActions;
