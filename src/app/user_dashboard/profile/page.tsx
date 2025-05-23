"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Loader from "@/components/shared/Loader";
import UploadProfilePicture from "@/components/UploadProfilePicture";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [user, setUser] = useState<null | {
    name: string;
    email: string;
    phone?: string;
    role: string;
    image?: string;
  }>(null);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get("/api/profile");
        setUser(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { data } = await axiosInstance.put("/api/profile", form);
      setUser(data);
      toast.success("Profile updated");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-8">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="max-w-xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Profile</h1>

      <div className="flex flex-col items-center space-y-6">
        <UploadProfilePicture
          onUploadSuccess={(url) => {
            setUser((prev) => (prev ? { ...prev, image: url } : prev));
          }}
        />

        <div className="w-full space-y-4">
          {["name", "email", "phone"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-heading capitalize">
                {field}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name={field}
                  value={(form[field as keyof typeof form] ?? "") as string}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  className="mt-1 w-full  border border-border py-2 px-3 rounded-lg text-heading text-sm"
                />
              ) : (
                <p className="mt-1 text-paragraph border border-border py-2 px-3 rounded-lg">
                  {user[field as keyof typeof user] || "-"}
                </p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-heading">
              Role
            </label>
            <p className="mt-1 capitalize text-paragraph  border border-border py-2 px-3 rounded-lg">
              {user.role}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded hover:bg-accent disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded hover:bg-accent"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
