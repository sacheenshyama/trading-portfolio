import { createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../../../../firebase-config";
import { GoogleAuthProvider,  signInWithPopup } from "firebase/auth";
import axios from "axios";
import { setCookie } from "cookies-next";

export const googleSignIn = createAsyncThunk("/api/oAuthlogin", async () => {
  const provider = new GoogleAuthProvider();
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
  setCookie("jwtToken", resp.data.token);
});
