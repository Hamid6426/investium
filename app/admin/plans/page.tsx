"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";
import Loader from "@/components/shared/Loader";
import Button from "@/components/shared/Button";

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

const GetAllPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axiosInstance.get("/api/plans");
        setPlans(res.data);
      } catch (error) {
        console.error("Failed to fetch plans", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

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
        <Link
          href="/admin/plans/create-plan"
          className="py-2 px-4 bg-card border border-border hover:bg-accent"
        >
          Create New Plan
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-heading">
          All Investment Plans
        </h1>
        <Link
          href="/admin/plans/create-plan"
          className="py-2 px-4 bg-card border border-border hover:bg-accent"
        >
          Create New Plan
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {plans.map((plan, idx) => (
          <div key={plan._id} className="rounded-lg shadow-md py-6 text-left">
            {plan.image && (
              <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                <Image
                  src={plan.image}
                  alt={plan.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={idx < 3} // priority loading for first few
                  className="rounded-md"
                />
              </div>
            )}

            <h3 className="px-3 py-2 text-lg font-bold mb-2 text-heading bg-card rounded-md">
              {plan.name}
            </h3>

            <p className="text-sm text-paragraph flex-grow mb-4">
              {plan.description}
            </p>

            <div className="grid grid-cols-2 gap-y-2 text-sm font-medium text-paragraph">
              <p className="font-medium">Base Invested Amount:</p>
              <p className="bg-card py-1 px-2 rounded">
                {plan.baseInvestedAmount}
              </p>

              <p className="font-medium">Daily Return:</p>
              <p className="bg-card py-1 px-2 rounded">{plan.dailyReturned}</p>

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

              {/* Add any other info you want here */}
            </div>

            <div className="mt-6">
              <Link
                href={`/admin/plans/${plan._id}/update-plan`}
                passHref
                legacyBehavior
              >
                <Button className="w-full text-center mt-4 inline-block bg-primary hover:bg-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
                  Update Plan
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default GetAllPlans;
