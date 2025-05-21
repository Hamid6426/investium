"use client";

import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Button from "@/components/shared/Button";
import Loader from "@/components/shared/Loader";

const CreateWithdrawalRequest = () => {
  const [form, setForm] = useState({
    accountName: "",
    accountNumber: "",
    amount: 0,
    currency: "PKR",
    method: "jazzcash",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await axiosInstance.post("/api/withdrawals", form);
      if (res.status === 201) {
        setSuccess(true);
        setForm({
          accountName: "",
          accountNumber: "",
          amount: 0,
          currency: "PKR",
          method: "jazzcash",
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 bg-muted">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-heading text-center">
          Withdraw Funds
        </h2>

        {error && (
          <p className="text-sm text-red-600 bg-red-100 p-2 rounded font-medium">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-600 bg-green-100 p-2 rounded font-medium">
            Withdrawal request submitted successfully.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="accountName" className="block text-sm font-medium mb-1">
              Account Holder Name
            </label>
            <input
              type="text"
              name="accountName"
              value={form.accountName}
              onChange={handleChange}
              required
              className="input-style w-full"
            />
          </div>

          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium mb-1">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              required
              className="input-style w-full"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Amount (PKR)
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              min={1}
              required
              className="input-style w-full"
            />
          </div>

          <div>
            <label htmlFor="method" className="block text-sm font-medium mb-1">
              Withdrawal Method
            </label>
            <select
              name="method"
              value={form.method}
              onChange={handleChange}
              className="input-style w-full"
            >
              <option value="bank">Bank</option>
              <option value="jazzcash">JazzCash</option>
              <option value="easypaisa">EasyPaisa</option>
            </select>
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium mb-1">
              Currency
            </label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="input-style w-full"
            >
              <option value="PKR">PKR</option>
              {/* Add more options if needed */}
            </select>
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? <Loader className="w-6 h-6 mx-auto" /> : "Submit Request"}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default CreateWithdrawalRequest;
