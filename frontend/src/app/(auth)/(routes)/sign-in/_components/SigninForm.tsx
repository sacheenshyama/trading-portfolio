"use client";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import OtpForm from "../../_components/OtpForm";
import { CgSpinner } from "react-icons/cg";
import {
  googleSignInUser,
  simpleSignIn,
} from "@/app/lib/redux/services/authApi";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
const SigninForm = () => {
  const setCookies = useSetCookie();
  const router = useRouter();
  const { loading, error, jwtToken } = useAppSelector((state) => state.auth);
  const [otpStage, setOtpStage] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const { email } = watch();

  useEffect(() => {
    if (jwtToken) {
      router.push("/portfolio");
    }
  }, [jwtToken]);

  const onsubmit = async (data: { email: string; password: string }) => {
    await dispatch(
      simpleSignIn({ email: data.email, password: data.password })
    );
    // console.log(afterlogin)
    // setLoading(true);
    // try {
    //   const res = await axios.post(
    //     `${process.env.NEXT_PUBLIC_API_URL}/api/signin`,
    //     {
    //       email: data.email,
    //       password: data.password,
    //     },
    //     {
    //       withCredentials: true,
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    //   setLoading(false);
    //   setCookies("jwtToken", res.data.token);
    //   // redirect("/portfolio");
    //   router.push("/portfolio");
    //   window.location.reload();
    // } catch (error) {
    //   setLoading(false);
    //   if (axios.isAxiosError(error) && error.response?.status === 444) {
    //     setOtpStage(true);
    //   }
    //   if (axios.isAxiosError(error)) {
    //     const errorMessage =
    //       error.response?.data.message || "Failed to sign in";
    //     // setError(errorMessage);
    //     dispatch(loginFailed(errorMessage));
    //   } else {
    //     const errorMessage = "Failed to sign in";
    //     dispatch(loginFailed(errorMessage));
    //     // setError(errorMessage);
    //   }
    // }
  };

  const handleGoogleLogin = async () => {
    await dispatch(googleSignInUser());
  };
  // console.log("after login", loading, error, jwtToken);
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
      )}{" "}
    </>
  );
};

export default SigninForm;
