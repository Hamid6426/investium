"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";
import Loader from "@/components/shared/Loader";
import Button from "@/components/shared/Button";
import { toast } from "react-toastify";

type Plan = {
  _id: string;
  name: string;
  description: string;
  image?: string;
  baseInvestedAmount: number;
  dailyReturned: number;
  totalPeriods: number;
  cancellation: boolean;
  isActive: boolean;
  // Assuming these fields exist or map your fields accordingly
  rupees?: number;
  dailyReturn?: number;
  totalRevenue?: number;
  capitalReturn?: boolean;
  returnType?: string;
};

const DesiredPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [investing, setInvesting] = useState(false);

  const openModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setQuantity(1);
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setQuantity(1);
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axiosInstance.get("/plans");
        setPlans(res.data);
      } catch (error) {
        console.error("Failed to fetch plans", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleInvest = async () => {
    if (!selectedPlan || quantity <= 0) return;

    setInvesting(true);
    try {
      await axiosInstance.post("/investment", {
        planId: selectedPlan._id,
        quantity,
      });

      toast.success("Investment successful!");
      closeModal();
    } catch (err: any) {
      const message = err?.response?.data?.error || "Failed to invest in plan.";
      toast.error(message);
    } finally {
      setInvesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex justify-between items-center mb-6 w-full p-6">
        <p className="text-3xl font-bold text-heading text-center">
          No plans found.
        </p>{" "}
      </div>
    );
  }

  return (
    <main className="mt-12 max-w-3xl w-full mx-auto pb-6 px-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
        {plans.map((plan, idx) => (
          <div
            key={plan._id}
            className="border border-accent p-4 rounded-lg shadow-md pb-6 text-left"
          >
            {plan.image && (
              <div className="relative w-full mb-4 rounded-md overflow-hidden aspect-[16/9]">
                <Image
                  src={plan.image}
                  alt={plan.name}
                  width={1280}
                  height={720}
                  priority={idx < 3} // priority loading for first few
                  className="rounded-md object-cover"
                />
              </div>
            )}

            <div className="">
              <h3 className=" py-2 text-lg font-bold mb-2 text-heading bg-card rounded-md">
                {plan.name}
              </h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm font-medium text-paragraph">
                <p className="font-medium">Base Invested Amount:</p>
                <p className="bg-card py-1 px-2 rounded">
                  {plan.baseInvestedAmount}
                </p>

                <p className="font-medium">Daily Return:</p>
                <p className="bg-card py-1 px-2 rounded">
                  {plan.dailyReturned}
                </p>

                <p className="font-medium">Total Periods:</p>
                <p className="bg-card py-1 px-2 rounded">
                  {plan.totalPeriods} days
                </p>

                <p className="font-medium">Cancellation:</p>
                <p className="bg-card py-1 px-2 rounded">
                  {plan.cancellation ? "Allowed" : "Not Allowed"}
                </p>

                <p className="font-medium">Status:</p>
                <p className="bg-card py-1 px-2 rounded">
                  {plan.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Investment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">
              Invest in {selectedPlan.name}
            </h2>

            <label className="block mb-2 font-medium">
              Quantity:
              <input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1 block w-full border px-3 py-2 rounded"
              />
            </label>

            <p className="text-sm mt-2 mb-4">
              Total:{" "}
              <span className="font-semibold">
                {selectedPlan.baseInvestedAmount * quantity}
              </span>
            </p>

            <div className="flex justify-between mt-4">
              <Button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-black"
              >
                Cancel
              </Button>
              <Button
                onClick={handleInvest}
                disabled={investing}
                className="bg-primary px-4 py-2 text-white"
              >
                {investing ? "Processing..." : "Confirm Invest"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default DesiredPlans;
