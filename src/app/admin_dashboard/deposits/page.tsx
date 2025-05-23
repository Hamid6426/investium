"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Loader from "@/components/shared/Loader";
import Button from "@/components/shared/Button";
import { toast } from "react-toastify";
import Image from "next/image";

interface Deposit {
  _id: string;
  userId: string;
  accountName: string;
  accountNumber: string;
  amount: number;
  currency: string;
  method: string;
  proofImage: string;
  status: "pending" | "completed" | "failed";
  adminNotes?: string;
  createdAt: string;
}

export default function RecentDeposits() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetchDeposits();
  }, []);

  async function fetchDeposits() {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/deposit");

      const sortedDeposits = res.data.sort(
        (a: Deposit, b: Deposit) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setDeposits(sortedDeposits);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to fetch deposits");
    } finally {
      setLoading(false);
    }
  }

  async function approveDeposit(id: string) {
    setProcessingId(id);
    try {
      await axiosInstance.put(`/deposit/${id}/accept-deposit`);
      toast.success("Deposit approved");
      // Refresh list
      await fetchDeposits();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Approval failed");
    } finally {
      setProcessingId(null);
    }
  }

  async function rejectDeposit(id: string) {
    if (!adminNotes.trim()) {
      toast.error("Please enter rejection notes");
      return;
    }

    setProcessingId(id);
    try {
      await axiosInstance.put(`/deposit/${id}/reject-deposit`, { adminNotes });
      toast.success("Deposit rejected");
      setAdminNotes("");
      setRejectingId(null);
      await fetchDeposits();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Rejection failed");
    } finally {
      setProcessingId(null);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center w-full">
        <Loader className="w-10 h-10" />
      </div>
    );

  return (
    <main className="mx-auto p-4 w-full">
      <h1 className="text-3xl font-bold mb-6 text-heading text-center">
        Recent Deposits
      </h1>

      {deposits.length === 0 ? (
        <p className="text-center text-paragraph">No deposits found.</p>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 max-w-[60rem] mx-auto gap-8 w-full">
          {deposits.map((deposit) => (
            <div
              key={deposit._id}
              className="border rounded-lg shadow-sm bg-card overflow-hidden flex flex-col w-full mx-auto"
            >
              {/* Image on top */}
              {deposit.proofImage && (
                <Image
                  src={deposit.proofImage}
                  width={500} 
                  height={400}
                  alt="Proof"
                  className="w-full h-48 object-cover"
                />
              )}

              {/* Text content */}
              <div className="p-4 flex flex-col flex-grow w-full">
                <p className="font-semibold text-xl text-heading mb-1">
                  {deposit.accountName}
                </p>
                <p className="text-sm text-paragraph mb-1">
                  Account #: {deposit.accountNumber}
                </p>

                <p className="font-semibold text-lg text-primary mb-1">
                  {deposit.amount.toLocaleString("en-PK")} {deposit.currency}
                </p>
                <p className="text-sm text-muted capitalize mb-3">
                  {deposit.method}
                </p>

                <p
                  className={`font-semibold mb-2 ${
                    deposit.status === "pending"
                      ? "text-yellow-600"
                      : deposit.status === "completed"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Status: {deposit.status}
                </p>

                {deposit.adminNotes && (
                  <p className="text-sm text-paragraph mb-3">
                    <strong>Admin Notes: </strong> {deposit.adminNotes}
                  </p>
                )}

                {/* Action buttons container */}
                {deposit.status === "pending" && (
                  <div className="mt-auto flex w-full flex-col gap-4">
                    <Button
                      onClick={() => approveDeposit(deposit._id)}
                      disabled={processingId === deposit._id}
                      className="bg-green-600 py-1 w-full hover:bg-green-700"
                    >
                      {processingId === deposit._id ? (
                        <Loader className="w-5 h-5 mx-auto" />
                      ) : (
                        "Approve"
                      )}
                    </Button>

                    {rejectingId === deposit._id ? (
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
                            onClick={() => rejectDeposit(deposit._id)}
                            disabled={processingId === deposit._id}
                            className="bg-red-600 px-3 py-1 hover:bg-red-700"
                          >
                            {processingId === deposit._id ? (
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
                        onClick={() => setRejectingId(deposit._id)}
                        className="bg-red-600 px-3 py-1 hover:bg-red-700"
                      >
                        Reject
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
