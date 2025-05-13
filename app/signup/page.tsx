"use client";

import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Loader from "@/components/shared/Loader";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axiosInstance.post("/api/auth/signup", formData);

      toast.success(res.data.message || "Signup successful!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
      });
      setShowSuccessModal(true);
      // router.push("/signin"); // Commenting out immediate push as per modal message
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "An unexpected error occurred.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showSuccessModal && (
        <div className="fixed inset-0 bg-overlay flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4 text-success ">
              Signup Successful 🎉
            </h2>
            <p className="mb-6 text-sm text-paragraph">
              Admin is verifying your account. Please login in a while.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/signin"); // Navigate after closing modal
              }}
              className="bg-primary  text-card  px-4 py-2 rounded hover:opacity-90 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <main className="py-12 w-full bg-background">
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border shadow-xl rounded-lg p-4 xs:p-8 space-y-4 w-full max-w-sm mx-auto"
        >
          <h1 className="text-2xl font-bold text-heading mb-4 text-center">Sign Up</h1>

          <Input
            name="firstName"
            label="First Name"
            placeholder="Yousaf"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input
            name="lastName"
            label="Last Name"
            placeholder="Jamal"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
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
            name="phone"
            type="number"
            label="Phone"
            placeholder="03XX-XXXXXXX"
            value={formData.phone}
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

          <Button type="submit" variant="error" >
            {isSubmitting ? <Loader className="w-6 h-6 mx-auto" /> : "Sign up"}
          </Button>

          <div className="text-sm text-center text-paragraph">
            Already have an account?
            <Link
              href="/signin"
              className="text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </main>
    </>
  );
};

export default Signup;