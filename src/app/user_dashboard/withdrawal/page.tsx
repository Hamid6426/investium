"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import Loader from "@/components/shared/Loader";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/contexts/AuthContext";

const MakeWithdrawal = () => {
  const { user, isLoggedIn } = useAuth();

  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    amount: "",
    currency: "PKR",
    method: "bank",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axiosInstance.post("/withdrawal", formData);
      toast.success("Withdrawal request submitted!");

      setFormData({
        accountName: "",
        accountNumber: "",
        amount: "",
        currency: "PKR",
        method: "bank",
      });
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0] ||
        "Withdrawal request failed.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-500">Please log in to withdraw funds.</div>
      </div>
    );
  }

  return (
    <main className="py-12 w-full bg-background min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg p-4 space-y-4 w-full max-w-md mx-auto"
      >
        <h1 className="text-2xl font-bold text-heading mb-4 text-center">
          Request a Withdrawal
        </h1>

        <Input
          name="accountName"
          type="text"
          label="Account Name"
          placeholder="Account holder name"
          value={formData.accountName}
          onChange={handleChange}
          required
        />

        <Input
          name="accountNumber"
          type="text"
          label="Account Number"
          placeholder="0000-00000000"
          value={formData.accountNumber}
          onChange={handleChange}
          required
        />

        <Input
          name="amount"
          type="number"
          label="Amount"
          placeholder="Enter withdrawal amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-paragraph mb-1">Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="input-style"
            >
              <option value="PKR">PKR</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-paragraph mb-1">Method</label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="input-style"
            >
              <option value="bank">Bank</option>
              <option value="easypaisa">Easypaisa</option>
              <option value="jazzcash">JazzCash</option>
            </select>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader className="w-6 h-6 mx-auto" /> : "Submit Withdrawal"}
        </Button>
      </form>
    </main>
  );
};

export default MakeWithdrawal;
