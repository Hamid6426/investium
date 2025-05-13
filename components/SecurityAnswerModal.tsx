// SecurityAnswerModal.tsx
"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import AnimalNameGenerator from "./AnimalNameGenerator";
import { jwtDecode } from "jwt-decode";

interface SecurityAnswerModalProps {
  token: string;
  onClose: () => void;
}

const SecurityAnswerModal: React.FC<SecurityAnswerModalProps> = ({
  token,
  onClose,
}) => {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const res = await axiosInstance.post(
        "/api/auth/add-security-answer",
        {
          securityAnswer: answer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        // Decode the token to get the isSecure
        const decoded: any = jwtDecode(res.data.token);
      }

      toast.success(res.data.message || "Security answer set successfully.");
      setIsSubmitted(true);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "An error occurred.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background text-heading flex items-center justify-center z-50">
      {isSubmitted ? (
        <div className="text-center px-4">
          <h2 className="text-xl font-bold mb-2">Your account is secured!</h2>
          <p className="mb-4">
            Write down your answer in a safe place. You&apos;ll need it if you
            ever need to verify your identity.
          </p>
          <button
            onClick={onClose}
            className="bg-primary text-white py-2 px-4 cursor-pointer transition-all duration-300 font-semibold hover:text-white rounded-sm hover:bg-accent"
          >
            Close
          </button>
        </div>
      ) : (
        <div className="max-w-sm w-full mx-auto px-4">
          <h2 className="text-lg font-bold mb-4">Set Your Security Answer</h2>
          <p className="mb-2">
            If you were to match your personality with an animal, which animal
            would you be?
          </p>

          <form onSubmit={handleSubmit}>
            <label
              htmlFor="security-answer"
              className="block text-sm font-medium mb-2"
            >
              Your answer:
            </label>
            <div className="flex items-center">
              <input
                id="security-answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="e.g. Majestic Eagle"
              />
              <AnimalNameGenerator
                onGenerate={(name) => setAnswer(name)}
                className="mb-4"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-4 hover:text-accent cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`bg-primary text-white py-2 px-4 cursor-pointer transition-all duration-300 font-semibold hover:text-white rounded-sm hover:bg-accent ${
                  isSubmitting ? "opacity-50" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit answer"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SecurityAnswerModal;
