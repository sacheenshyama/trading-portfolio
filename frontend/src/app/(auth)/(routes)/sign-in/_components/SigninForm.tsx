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
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import OtpForm from "../../_components/OtpForm";
import { CgSpinner } from "react-icons/cg";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
const SigninForm = () => {
  const setCookies = useSetCookie();
  const router = useRouter();
  const error = useAppSelector((state) => state.auth.error);
  // const loading = useAppSelector((state) => state.auth.loading);
  // const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpStage, setOtpStage] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const { email } = watch();

  const onsubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
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
      setLoading(false);
      setCookies("jwtToken", res.data.token);
      // redirect("/portfolio");
      router.push("/portfolio");
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.response?.status === 444) {
        setOtpStage(true);
      }
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data.message || "Failed to sign in";
        // setError(errorMessage);
        dispatch(loginFailed(errorMessage));
      } else {
        const errorMessage = "Failed to sign in";
        dispatch(loginFailed(errorMessage));
        // setError(errorMessage);
      }
    }
  };

  return (
    <>
      {otpStage ? (
        <OtpForm givenEmail={email} />
      ) : (
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
            {error && <p className="text-red-600">{error}</p>}
            <button
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
            >
              {loading ? <CgSpinner className="animate-spin" /> : "Sing In"}
            </button>
          </div>
          <p className="mt-2 text-center text-sm text-gray-600 max-w">
            Or{" "}
            <Link
              href="/sign-up"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create an account
            </Link>
          </p>
          <div className="flex justify-center">
            <p
              onClick={() => signIn("google", { callbackUrl: "/portfolio" })}
              className="flex justify-center items-center rounded-lg shadow w-12 h-8"
            >
              <FcGoogle className="w-4 h-4" />
            </p>
          </div>
        </form>
      )}{" "}
    </>
  );
};

export default SigninForm;
