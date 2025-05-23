"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import Loader from "@/components/shared/Loader";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/contexts/AuthContext";

const MakeDeposit = () => {
  const { user, isLoggedIn } = useAuth();

  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    amount: "",
    currency: "PKR",
    method: "bank",
    proofImage: null as File | null,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({
      ...prev,
      proofImage: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) form.append(key, value);
      });

      await axiosInstance.post("/deposit", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Deposit submitted successfully!");

      setFormData({
        accountName: "",
        accountNumber: "",
        amount: "",
        currency: "PKR",
        method: "bank",
        proofImage: null,
      });
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0] ||
        "Deposit failed.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-500">Please log in to deposit funds.</div>
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
          Make a Deposit
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
          placeholder="Enter deposit amount"
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

        <div>
          <label className="block text-sm text-paragraph mb-1">Proof Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="input-style"
          />
          {formData.proofImage && (
            <img
              src={URL.createObjectURL(formData.proofImage)}
              alt="Preview"
              className="mt-2 rounded border w-32 h-32 object-cover"
            />
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader className="w-6 h-6 mx-auto" /> : "Submit Deposit"}
        </Button>
      </form>
    </main>
  );
};

export default MakeDeposit;
