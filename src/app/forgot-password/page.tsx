"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData(e.currentTarget);
    formData.append("email", email);

    try {
      setLoading(true);
      const response = await axios.post("/api/auth/forgot-password", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data.message);
      //   router.push("/reset-password");
      setLoading(false);
      setSuccess(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-white">
    {success ? (
      <div className="bg-green-500 text-white px-4 py-2 rounded w-full max-w-md text-center shadow-lg">
        Reset link sent to your email address.
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-lg shadow-lg px-8 py-10 w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6 text-center">Forgot Password</h1>
  
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
  
        <input
          type="text"
          id="email"
          placeholder="somemail@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 mb-4 w-full text-black placeholder-gray-500"
          required
        />
  
        <button
          type="submit"
          disabled={loading}
          className={`bg-black text-white rounded px-4 py-2 w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? "Sending..." : "Send Reset Email"}
        </button>
  
        <div className="text-center mt-4 text-gray-500 border-t pt-4">
          Remembered your password?{' '}
          <a href="/login" className="underline">Log in here &raquo;</a>
        </div>
      </form>
    )}
  </div>
  
  );
};

export default ForgotPasswordPage;
