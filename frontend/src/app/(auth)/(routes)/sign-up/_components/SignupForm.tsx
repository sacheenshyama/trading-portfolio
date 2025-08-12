"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import Link from "next/link";
import OtpForm from "../../_components/OtpForm";
import { CgSpinner } from "react-icons/cg";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../../../../firebase-config";
import { useSetCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/lib/redux/hooks";
import { loginFailed } from "@/app/lib/redux/featureSlice/authSlice";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const setCookies = useSetCookie();
  const dispatch = useAppDispatch();

  const router = useRouter();
  const [error, setError] = useState("");
  const [otpStage, setOtpStage] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const { email } = watch();

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError("");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/signup`,
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
      setOtpStage(true);
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message);
      } else {
        setError("Failed to create an account");
      }
    }
  };
  const handleGoogleLogin = async () => {
    //  await dispatch(googleSignIn());
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      // console.log("result", result.user);
      const profile = {
        email_verified: result.user.emailVerified,
        email: result.user.email,
      };
      // console.log(profile)
      const resp = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/oAuthLogin`,
        {
          profile,
        },
        {
          withCredentials: true,
        }
      );
      setLoading(false);
      setCookies("jwtToken", resp.data.token);
      router.push("/portfolio");
      window.location.reload();
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-center text-2xl font-bold ">Sign Up</h2>
          <p className="text-gray-500 text-center text-sm">
            please sign-up with your valid gmail becasue we will send otp
          </p>
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
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
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
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <button
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {loading ? (
                <CgSpinner className="animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </div>
          <p className="mt-2 text-center text-sm text-gray-600 max-w">
            Or{" "}
            <Link
              href="/sign-in"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign-in to an existing account
            </Link>
          </p>
          <div className="flex justify-center">
            <button
              disabled={loading}
              onClick={handleGoogleLogin}
              className="flex justify-center items-center rounded-lg shadow w-full border border-gray-200 p-3"
            >
              {loading ? (
                <CgSpinner className="animate-spin" />
              ) : (
                <FcGoogle className={` w-4 h-4`} />
              )}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default SignupForm;
