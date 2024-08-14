"use client";

import React, { useState, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Icons for visibility toggle

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // console.log(token);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/auth/reset-password", {
        token,
        password,
      });

      setTimeout(() => {
        setMessage(response.data.message);
        setLoading(false);
        router.push("/login");
      }, 8000);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 rounded-lg shadow-lg px-8 py-10 w-full max-w-md"
      >
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Reset Password
        </h1>

        {message && (
          <div className="bg-green-500 text-white px-4 py-2 rounded mb-4 shadow-lg">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-500 text-white px-4 py-2 rounded mb-4 shadow-lg">
            {error}
          </div>
        )}

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/3 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/3 transform -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <button
          className={`bg-black text-white rounded px-4 py-2 w-full font-semibold transition-opacity duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

const ResetPasswordPageWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResetPasswordPage />
  </Suspense>
);

export default ResetPasswordPageWrapper;
