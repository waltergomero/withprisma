import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {fetchUserById, fetchUserByEmailInAccount} from "@/actions/user-actions";
import  prisma  from "@/lib/prisma"

 
export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async signIn({ account, profile }) {
      if(account && account.provider === "google" || account.provider === "github"){

        const user_account = await fetchUserByEmailInAccount(profile.email)
        //console.log("account returned: ", user_account)
        console.log("account: ", user_account.email, user_account.accounts[0].provider);
            if (account.provider != user_account.accounts[0].provider) {
                  throw new Error('Error: Another account already exists with the same e-mail address.');
              }

      }
      return true;
    },
    async jwt({ token }) {
      if(!token.sub) return token;

    const existingUser = await fetchUserById(token.sub)
     
    if(!existingUser) return token;
      token.first_name = existingUser.first_name;
      token.last_name = existingUser.last_name;
      token.name = existingUser.name
      token.isadmin = existingUser.isadmin;

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.first_name = token.first_name;
      session.user.last_name = token.last_name;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.isadmin = token.isadmin;
  
      return session;
    },
    
  },
  session: { strategy: "jwt" },
    ...authConfig,
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/auth/error",
  },
  
  })
