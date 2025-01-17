import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {fetchUserById} from "@/actions/user-actions";

 
export const { auth, handlers, signIn, signOut } = NextAuth({
  // callbacks: {
  //   async jwt({ token }) {
  //     if(!token.sub) return token;

  //   const existingUser = await fetchUserById({_id: token.sub})
      
  //   if(!existingUser) return token;
  //     token.first_name = existingUser.first_name;
  //     token.last_name = existingUser.last_name;
  //     token.name = existingUser.first_name + ', ' + existingUser.last_name
  //     token.isadmin = existingUser.isadmin;

  //     return token;
  //   },
  //   async session({ session, token }) {
  //     session.user._id = token.sub;
  //     session.user.first_name = token.first_name;
  //     session.user.last_name = token.last_name;
  //     session.user.name = token.name;
  //     session.user.email = token.email;
  //     session.user.isadmin = token.isadmin;

  //     return session;
  //   },
  // },
  session: { strategy: "jwt" },
    ...authConfig,
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signup",
    error: "/auth/error",
  },
  
  })
