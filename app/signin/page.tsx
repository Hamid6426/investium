"use client";

import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import Link from "next/link";
import Loader from "@/components/shared/Loader";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/api/auth/signin", formData);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);

        // Decode the token to get the role
        const decoded: any = jwtDecode(res.data.token);
        toast.success(res.data.message || "Signed in successfully!");

        // Navigate based on the role
        if (decoded.role === "superadmin") {
          router.push("/superadmin/dashboard");
        } else if (decoded.role === "admin") {
          router.push("/admin/dashboard");
        } else if (decoded.role === "user") {
          router.push("/dashboard");
        } else {
          toast.error("Invalid role.");
        }
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
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
        />

        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div className="text-sm text-right text-paragraph">
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit">
          {isSubmitting ? <Loader className="w-6 h-6 mx-auto" /> : "Sign in"}
        </Button>

        <div className="text-sm text-center text-paragraph">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </main>
  );
};

export default SignIn;
