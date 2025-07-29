"use client";
import {
  loginFailed,
  loginStart,
  loginSuccess,
} from "@/app/lib/redux/featureSlice/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSetCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
const SigninForm = () => {
  const router = useRouter();
  const setCookies = useSetCookie();
  const error = useAppSelector((state) => state.auth.error);
  const loading = useAppSelector((state) => state.auth.loading);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onsubmit = async (data: { email: string; password: string }) => {
    dispatch(loginStart());
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/signin`,
        {
          email: data.email,
          password: data.password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCookies("jwtToken", res.data.token);
      dispatch(loginSuccess(res.data.token));
      router.push("/portfolio");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.error || "Failed to sign in";
        dispatch(loginFailed(errorMessage));
      } else {
        const errorMessage = "Failed to sign in";
        dispatch(loginFailed(errorMessage));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onsubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            {...register("email")}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            {...register("password")}
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
      </div>

      <div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
        >
          {loading ? "Singing in...." : "Sing In"}
        </button>
      </div>
    </form>
  );
};

export default SigninForm;
