"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Loader from "@/components/shared/Loader";
import Image from "next/image";

const ProfileCard: React.FC = () => {
  const [user, setUser] = useState<null | {
    name: string;
    email: string;
    phone?: string;
    role: string;
    image?: string;
  }>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get("/api/profile");
        setUser(data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="max-w-lg w-full h-24 bg-card rounded-lg px-3 py-2 flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="max-w-lg w-full h-24 bg-card rounded-lg px-3 py-2 overflow-hidden">
      <div className="flex justify-between">
        <div className="flex">
          <Image
            className="w-20 h-20 object-cover rounded-full border-2 border-border"
            src={user?.image || "/default-profile.png"}
            alt={user?.name || "Profile"}
            width={400}
            height={400}
          />
          <div className="flex flex-col justify-center ml-6 gap-1">
            <h2 className="text-xl font-semibold text-heading">
              {user?.name || "Unnamed User"}
            </h2>
            <p className="text-sm text-muted">{user?.email}</p>
            {user?.phone && (
              <p className="text-sm text-muted">Phone: {user.phone}</p>
            )}
          </div>
        </div>
        <div className="rounded-full h-20 w-20 flex flex-col justify-center items-center bg-background">
          <div className="text-lg font-semibold text-primary">
            {user?.role || "?"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
