import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {fetchUserById, fetchUserByEmailInAccount} from "@/actions/user-actions";
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async signIn({ account, profile }) {
      try {
        
          if(account && account.provider === "google" || account.provider === "github"){    
            const user_account = await fetchUserByEmailInAccount(profile.email)
            //console.log("user_account: ", user_account)
            return user_account;
          } 
        return true;
      } catch (error) {
          throw new Error('Sign-in failed: ' + error.message);
      }
    },

    async jwt({ token }) {
      if(!token.sub) 
        return token;

      const existingUser = await fetchUserById(token.sub)

      if(!existingUser) 
        return token;

      token.first_name = existingUser.first_name;
      token.last_name = existingUser.last_name;
      token.name = existingUser.name;
      token.isadmin = existingUser.isadmin;
      token.provider = existingUser.accounts[0].provider;

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.first_name = token.first_name;
      session.user.last_name = token.last_name;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.isadmin = token.isadmin;
      session.user.provider = token.provider;
  
      return session;
    },
    
  },
  session: { strategy: "jwt" },
    ...authConfig,
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/error",
  },
  
  })
