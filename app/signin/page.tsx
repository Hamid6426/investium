"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import Loader from "@/components/shared/Loader";
import axiosInstance from "@/utils/axiosInstance";

type FormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("/api/auth/signin", formData);

      const { message, token } = response.data;

      if (!token) {
        throw new Error("Token not found in response");
      }

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const userRole = decoded.role || "user";

      localStorage.setItem("authToken", token);
      toast.success(message || "Signed in successfully!");

      router.push(userRole === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Login failed.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="py-12 w-full bg-background min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg p-4 space-y-4 w-full max-w-sm mx-auto"
      >
        <h1 className="text-2xl font-bold text-heading mb-4 text-center">
          Sign In
        </h1>

        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="name@gmail.com"
          value={formData.email}
          onChange={handleChange}
          required
          autoFocus
          disabled={isSubmitting}
        />

        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />

        <div className="text-sm text-right text-paragraph">
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader className="w-6 h-6 mx-auto" /> : "Sign in"}
        </Button>

        <div className="text-sm text-center text-paragraph">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </main>
  );
};

export default SignIn;
