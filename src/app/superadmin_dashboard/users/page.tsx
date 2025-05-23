"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import VerifyUserActions from "@/components/VerifyUserActions";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin" | "superadmin";
  isVerified?: boolean;
  isBlocked?: boolean;
  agreedToTerms: boolean;
  createdAt: string;
}

const GetAllUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users");
        setUsers(response.data.users);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading)
    return <div className="text-center py-4 text-accent">Loading users...</div>;
  if (error) return <div className="text-center text-error">{error}</div>;

  return (
    <div className="p-6 bg-background min-h-screen text-paragraph">
      <h1 className="text-2xl font-bold mb-4 text-heading">All Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-card border border-border text-sm">
          <thead>
            <tr className="bg-secondary text-heading">
              <th className="py-2 px-4 border-b border-border">Name</th>
              <th className="py-2 px-4 border-b border-border">Email</th>
              <th className="py-2 px-4 border-b border-border">Phone</th>
              <th className="py-2 px-4 border-b border-border">Role</th>
              <th className="py-2 px-4 border-b border-border">Agree To Terms</th>
              <th className="py-2 px-4 border-b border-border">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="text-center hover:bg-secondary/40 transition"
              >
                <td className="py-2 px-4 border-b border-border">
                  {user.name}
                </td>
                <td className="py-2 px-4 border-b border-border">
                  {user.email}
                </td>
                <td className="py-2 px-4 border-b border-border">
                  {user.phone}
                </td>
                <td className="py-2 px-4 border-b border-border capitalize">
                  {user.role}
                </td>
                <td className="py-2 px-4 border-b border-border">
                  {user.agreedToTerms ? "✅" : "❌"}
                </td>
                <td className="py-2 px-4 border-b border-border">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetAllUser;
