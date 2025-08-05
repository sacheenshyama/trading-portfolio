import axios from "axios";
// import { setCookie } from "cookies-next";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
// import Cookies from "js-cookie";

//   const setCookies = useSetCookie();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    async signIn({ profile }) {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/oAuthLogin`,
          {
            profile,
          },
          {
            withCredentials: true,
          }
        );
        // console.log("respone from oauth", res.data.token);
        // console.log(setCookie("jwtToken", res.data.token));
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
