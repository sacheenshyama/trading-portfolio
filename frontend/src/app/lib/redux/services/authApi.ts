import { OtpSignin } from "./../../types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../../../../firebase-config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import { SimpleLoginIn } from "../../types";

export const googleSignInUser = createAsyncThunk(
  "/api/oAuthlogin",
  async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const profile = {
      email_verified: result.user.emailVerified,
      email: result.user.email,
    };
    const resp = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/oAuthLogin`,
      {
        profile,
      },
      {
        withCredentials: true,
      }
    );

    return resp.data;
  }
);

export const simpleSignIn = createAsyncThunk(
  "/api/signin",
  async (data: SimpleLoginIn) => {
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
    // console.log("API CALL", res.data);
    return res.data;
  }
);

export const otpSignIn = createAsyncThunk(
  "/api/verifyOtp",
  async (data: OtpSignin) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/verifyOtp`,
      {
        email: data.givenEmail,
        otp: data.otpValue,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  }
);
