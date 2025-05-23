"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/shared/Button";
import Loader from "@/components/shared/Loader";
import axiosInstance from "@/utils/axiosInstance";

type PlanUpdatePayload = {
  name: string;
  description: string;
  baseInvestedAmount: number;
  dailyReturned: number;
  totalPeriods: number;
  cancellation: boolean;
  isActive: boolean;
};

const UpdatePlan = () => {
  const router = useRouter();
  const { planId } = useParams();

  const [form, setForm] = useState<PlanUpdatePayload>({
    name: "",
    description: "",
    baseInvestedAmount: 0,
    dailyReturned: 0,
    totalPeriods: 0,
    cancellation: false,
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/plans/${planId}`);
        setForm({
          name: data.name,
          description: data.description,
          baseInvestedAmount: data.baseInvestedAmount,
          dailyReturned: data.dailyReturned,
          totalPeriods: data.totalPeriods,
          cancellation: data.cancellation,
          isActive: data.isActive,
        });
      } catch (err: any) {
        setError(err?.response?.data?.error || "Failed to fetch plan");
      } finally {
        setLoading(false);
      }
    };

    if (planId) fetchPlan();
  }, [planId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await axiosInstance.put(`/api/plans/${planId}`, form);
      router.push("/admin/plans");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to update plan");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-heading">
        Update Investment Plan
      </h1>

      {error && (
        <p className="mb-4 text-red-600 font-semibold bg-red-100 p-2 rounded">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Plan Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="input-style w-full"
          />
        </div>

        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="textarea-style w-full"
          />
        </div>

        <div>
          <label htmlFor="baseInvestedAmount" className="block font-medium mb-1">
            Base Invested Amount
          </label>
          <input
            type="number"
            id="baseInvestedAmount"
            name="baseInvestedAmount"
            value={form.baseInvestedAmount}
            onChange={handleChange}
            required
            min={0}
            className="input-style w-full"
          />
        </div>

        <div>
          <label htmlFor="dailyReturned" className="block font-medium mb-1">
            Daily Returned
          </label>
          <input
            type="number"
            id="dailyReturned"
            name="dailyReturned"
            value={form.dailyReturned}
            onChange={handleChange}
            required
            min={0}
            className="input-style w-full"
          />
        </div>

        <div>
          <label htmlFor="totalPeriods" className="block font-medium mb-1">
            Total Periods (days)
          </label>
          <input
            type="number"
            id="totalPeriods"
            name="totalPeriods"
            value={form.totalPeriods}
            onChange={handleChange}
            required
            min={0}
            className="input-style w-full"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label htmlFor="cancellation" className="font-medium">
            Cancellation Allowed
          </label>
          <input
            type="checkbox"
            id="cancellation"
            name="cancellation"
            checked={form.cancellation}
            onChange={handleChange}
            className="checkbox-style"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label htmlFor="isActive" className="font-medium">
            Active Status
          </label>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="checkbox-style"
          />
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? <Loader className="w-6 h-6 mx-auto" /> : "Update Plan"}
        </Button>
      </form>
    </main>
  );
};

export default UpdatePlan;
