"use client";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import { otpSignIn } from "@/app/lib/redux/services/authApi";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { CgSpinner } from "react-icons/cg";

interface otpFormProp {
  givenEmail: string;
}

const OtpForm: React.FC<otpFormProp> = ({ givenEmail }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { jwtToken } = useAppSelector((state) => state.auth);
  const [otpReqLoad, setOtpReqLoad] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const dispatch = useAppDispatch();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  useEffect(() => {
    if (jwtToken) {
      router.push("/portfolio");
    }
  }, [jwtToken]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    // console.log("otp form check", givenEmail, otpValue);
    await dispatch(otpSignIn({ givenEmail, otpValue }));
  };

  const handleRequestOtp = async () => {
    setOtpLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/requestOtp`, {
        email: givenEmail,
      });
      setOtpLoading(false);
    } catch {
      // setResenOtpError("Error in Resend otp Request");
      setOtpLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-center text-2xl font-bold ">Email Verification</h2>

      <p className="text-center text-gray-400 text-[16px] mb-10">
        We have send a code to your email {givenEmail}
      </p>
      <div className="flex justify-center space-x-3 mb-10">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            // onPaste={handlePaste}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            className="w-12 h-12 border-2 border-gray-300 rounded-md text-center text-xl font-semibold focus:border-gray-600 focus:outline-none"
            maxLength={1}
            inputMode="numeric"
            pattern="[0-9]*"
            autoFocus={index === 0}
          />
        ))}
      </div>

      <button
        disabled={otpReqLoad}
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        {otpReqLoad ? <CgSpinner className="animate-spin" /> : "Verify Otp"}
      </button>
      <div className="flex justify-center mt-5">
        <p className="text-gray-400 text-[16px]">
          Did not recieve code? &nbsp;
        </p>
        {otpLoading ? (
          <p className="font-bold text-2xl">
            <CgSpinner className="animate-spin" />
          </p>
        ) : (
          <p
            onClick={() => handleRequestOtp()}
            className="text-blue-600 text-[16px] cursor-pointer"
          >
            &nbsp;Resend otp
          </p>
        )}
      </div>
    </form>
  );
};

export default OtpForm;
