"use client";

import axios, { AxiosError } from "axios";
import React, { FormEvent, useState } from "react";
import { signIn } from 'next-auth/react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import GoogleButton from "@/app/components/common/GoogleButton";
import GitHubButton from "@/app/components/common/GithubButton";
import Link from "next/link";
import Joi from "joi";

const RegisterPage: React.FC = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    router.push("/");
    return null; // Prevent rendering the form
  }

  // Define the Joi schema for form validation
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
      'string.base': 'Username should be a type of text',
      'string.empty': 'Username is required',
      'string.min': 'Username should have a minimum length of 3 characters',
      'string.max': 'Username should have a maximum length of 30 characters',
      'any.required': 'Username is required',
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password should have a minimum length of 6 characters',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Confirm password is required',
    }),
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString() || '';
    const email = formData.get("email")?.toString() || '';
    const password = formData.get("password")?.toString() || '';
    const confirmPassword = formData.get("confirm-password")?.toString() || '';

    // Validate the form data
    const { error: validationError } = schema.validate({ username, email, password, confirmPassword }, { abortEarly: false });
    if (validationError) {
      setError(validationError.details.map(detail => detail.message).join(", "));
      setLoading(false);
      return;
    }

    try {
      const signupResponse = await axios.post("/api/auth/register", {
        username,
        email,
        password,
      });

      console.log(signupResponse);

      const signinResponse = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signinResponse?.ok) return router.push('/');

      console.log(signinResponse);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || 'An error occurred during registration');
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-lg w-full max-w-md space-y-6 border border-gray-300">
        {error && <div className="bg-red-500 text-white px-4 py-2 rounded">{error}</div>}

        <h1 className="text-3xl md:text-4xl font-bold text-center text-black">Sign Up</h1>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="John Doe"
              name="username"
              className="bg-gray-200 text-black px-4 py-2 rounded w-full focus:outline-none focus:ring focus:ring-gray-500"
            />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="somemail@gmail.com"
              name="email"
              className="bg-gray-200 text-black px-4 py-2 rounded w-full focus:outline-none focus:ring focus:ring-gray-500"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              name="password"
              className="bg-gray-200 text-black px-4 py-2 rounded w-full focus:outline-none focus:ring focus:ring-gray-500"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="confirm password"
              name="confirm-password"
              className="bg-gray-200 text-black px-4 py-2 rounded w-full focus:outline-none focus:ring focus:ring-gray-500"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-700 transition duration-200" type="submit" data-testid='Sign Up' disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <div className="my-4 text-center text-gray-500">
          or sign up with
        </div>

        <div className="flex flex-col space-y-2">
          <GoogleButton />
          <GitHubButton />
        </div>

        <div className="text-center text-gray-500 border-t pt-4">
          Already have an account?{' '}
          <Link className="text-black hover:underline" href={'/login'}>Login here &raquo;</Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
