// import { setCookie } from "cookies-next";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { cookies } from "next/headers";
// import Cookies from "js-cookie";

//   const setCookies = useSetCookie();

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    async signIn({ profile }) {
      try {
        if (!profile?.email) {
          console.log("No email found in profile");
          return false;
        }
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/oAuthLogin`,
          {
            profile,
          },
          {
            withCredentials: true,
          }
        );

        (await cookies()).set("jwtToken", res.data.token);

        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
