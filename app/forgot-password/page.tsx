"use client";

import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import Loader from "@/components/shared/Loader";
import Link from "next/link";
import { useRouter } from "next/navigation";

const generateRandomPassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    securityAnswer: "",
    newPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGeneratePassword = () => {
    const newPass = generateRandomPassword();
    setFormData((prev) => ({ ...prev, newPassword: newPass }));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleCopyPassword = () => {
    if (formData.newPassword.trim() === "") {
      toast.warn("Password field is empty.");
      return;
    }
    navigator.clipboard.writeText(formData.newPassword);
    toast.success("Password copied to clipboard!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axiosInstance.post(
        "/api/auth/forgot-password",
        formData
      );
      toast.success(res.data.message || "Password reset successful!");
      router.push("/signin");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to reset password.";
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
          Reset Password
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
          name="securityAnswer"
          type="text"
          label="Security Answer"
          placeholder="e.g. Majestic Eagle"
          value={formData.securityAnswer}
          onChange={handleChange}
          required
        />

        <Input
          name="newPassword"
          type={isPasswordVisible ? "text" : "password"}
          label="New Password"
          placeholder="••••••••"
          value={formData.newPassword}
          onChange={handleChange}
          required
          showPasswordToggle={true}
          onToggleVisibility={togglePasswordVisibility}
          onCopyClick={handleCopyPassword}
        />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Need a strong one?
          </span>
          <button
            type="button"
            onClick={handleGeneratePassword}
            className="text-sm text-primary hover:underline"
          >
            Generate Random Password
          </button>
        </div>

        <Button type="submit">
          {isSubmitting ? (
            <Loader className="w-6 h-6 mx-auto" />
          ) : (
            "Reset Password"
          )}
        </Button>

        <div className="text-sm text-center text-paragraph">
          Remember your password?{" "}
          <Link href="/signin" className="text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </form>
    </main>
  );
};

export default ForgotPassword;
