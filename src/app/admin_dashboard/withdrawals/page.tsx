"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Loader from "@/components/shared/Loader";
import Button from "@/components/shared/Button";
import { toast } from "react-toastify";

interface Withdrawal {
  _id: string;
  userId: string;
  accountName: string;
  accountNumber: string;
  amount: number;
  currency: string;
  method: "bank" | "easypaisa" | "jazzcash";
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;
  createdAt: string;
}

export default function RecentWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  async function fetchWithdrawals() {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/withdrawal");

      const sorted = res.data.sort(
        (a: Withdrawal, b: Withdrawal) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setWithdrawals(sorted);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to fetch withdrawals");
    } finally {
      setLoading(false);
    }
  }

  async function approveWithdrawal(id: string) {
    setProcessingId(id);
    try {
      await axiosInstance.put(`/withdrawal/${id}/approve`);
      toast.success("Withdrawal approved");
      await fetchWithdrawals();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Approval failed");
    } finally {
      setProcessingId(null);
    }
  }

  async function rejectWithdrawal(id: string) {
    if (!adminNotes.trim()) {
      toast.error("Please enter rejection notes");
      return;
    }

    setProcessingId(id);
    try {
      await axiosInstance.put(`/withdrawal/${id}/reject`, { adminNotes });
      toast.success("Withdrawal rejected");
      setAdminNotes("");
      setRejectingId(null);
      await fetchWithdrawals();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Rejection failed");
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full">
        <Loader className="w-10 h-10" />
      </div>
    );
  }

  return (
    <main className="mx-auto p-4 w-full">
      <h1 className="text-3xl font-bold mb-6 text-heading text-center">
        Recent Withdrawals
      </h1>

      {withdrawals.length === 0 ? (
        <p className="text-center text-paragraph">No withdrawals found.</p>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 max-w-[60rem] mx-auto gap-8 w-full">
          {withdrawals.map((w) => (
            <div
              key={w._id}
              className="border rounded-lg shadow-sm bg-card overflow-hidden flex flex-col w-full mx-auto p-4"
            >
              <p className="font-semibold text-xl text-heading mb-1">{w.accountName}</p>
              <p className="text-sm text-paragraph mb-1">Account #: {w.accountNumber}</p>
              <p className="font-semibold text-lg text-primary mb-1">
                {w.amount.toLocaleString("en-PK")} {w.currency}
              </p>
              <p className="text-sm text-muted capitalize mb-3">{w.method}</p>
              <p
                className={`font-semibold mb-2 ${
                  w.status === "pending"
                    ? "text-yellow-600"
                    : w.status === "approved"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Status: {w.status}
              </p>

              {w.adminNotes && (
                <p className="text-sm text-paragraph mb-3">
                  <strong>Admin Notes:</strong> {w.adminNotes}
                </p>
              )}

              {w.status === "pending" && (
                <div className="mt-auto flex w-full flex-col gap-4">
                  <Button
                    onClick={() => approveWithdrawal(w._id)}
                    disabled={processingId === w._id}
                    className="bg-green-600 py-1 w-full hover:bg-green-700"
                  >
                    {processingId === w._id ? (
                      <Loader className="w-5 h-5 mx-auto" />
                    ) : (
                      "Approve"
                    )}
                  </Button>

                  {rejectingId === w._id ? (
                    <div className="flex flex-col space-y-2 flex-grow w-full">
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Reason for rejection"
                        className="textarea-style resize-none rounded border border-gray-300 p-2"
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => rejectWithdrawal(w._id)}
                          disabled={processingId === w._id}
                          className="bg-red-600 px-3 py-1 hover:bg-red-700"
                        >
                          {processingId === w._id ? (
                            <Loader className="w-5 h-5 mx-auto" />
                          ) : (
                            "Reject"
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            setRejectingId(null);
                            setAdminNotes("");
                          }}
                          className="bg-gray-400 px-3 py-1 hover:bg-gray-500"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setRejectingId(w._id)}
                      className="bg-red-600 px-3 py-1 hover:bg-red-700"
                    >
                      Reject
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
