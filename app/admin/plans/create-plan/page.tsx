"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import Loader from "@/components/shared/Loader";
import axiosInstance from "@/utils/axiosInstance";

const CreatePlan = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    baseInvestedAmount: "",
    dailyReturned: "",
    totalPeriods: "",
    cancellation: false,
    isActive: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic frontend validation
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.baseInvestedAmount ||
      !formData.dailyReturned ||
      !formData.totalPeriods
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("baseInvestedAmount", formData.baseInvestedAmount);
      data.append("dailyReturned", formData.dailyReturned);
      data.append("totalPeriods", formData.totalPeriods);
      data.append("cancellation", formData.cancellation ? "true" : "false");
      data.append("isActive", formData.isActive ? "true" : "false");

      if (file) data.append("image", file);

      const res = await axiosInstance.post("/api/plans", data);

      toast.success("Plan created successfully!");
      router.refresh(); // refresh to update if on same page or redirect as needed
      setFormData({
        name: "",
        description: "",
        baseInvestedAmount: "",
        dailyReturned: "",
        totalPeriods: "",
        cancellation: false,
        isActive: true,
      });
      setFile(null);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.errors?.join(", ") ||
        "Failed to create plan.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-xl w-full my-8 mx-auto p-4 bg-card rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-heading mb-6 text-center">
        Create New Plan
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          label="Plan Name"
          placeholder="Enter plan name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label className="block text-sm font-medium text-paragraph">
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </label>

        <Input
          name="baseInvestedAmount"
          label="Base Invested Amount"
          type="number"
          min="0"
          placeholder="e.g. 1000"
          value={formData.baseInvestedAmount}
          onChange={handleChange}
          required
        />

        <Input
          name="dailyReturned"
          label="Daily Returned Amount"
          type="number"
          min="0"
          placeholder="e.g. 10"
          value={formData.dailyReturned}
          onChange={handleChange}
          required
        />

        <Input
          name="totalPeriods"
          label="Total Periods (days)"
          type="number"
          min="1"
          placeholder="e.g. 30"
          value={formData.totalPeriods}
          onChange={handleChange}
          required
        />

        <div className="flex items-center space-x-3">
          <input
            id="cancellation"
            name="cancellation"
            type="checkbox"
            checked={formData.cancellation}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="cancellation" className="text-sm text-paragraph">
            Allow cancellation
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="isActive" className="text-sm text-paragraph">
            Active
          </label>
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-paragraph mb-1"
          >
            Upload Image (optional)
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500"
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader className="w-6 h-6 mx-auto" /> : "Create Plan"}
        </Button>
      </form>
    </main>
  );
};

export default CreatePlan;
