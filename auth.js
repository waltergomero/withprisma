import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {fetchUserById, fetchUserByEmailInAccount} from "@/actions/user-actions";
import  prisma  from "@/lib/prisma"
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    // async signIn(user, account, profile) {
    //   if(user){
    //   const existingUser = await prisma.User.findFirst({ where: { email: user.email }, });

    //   if(existingUser.password === null){
    //     console.log("Enter here1", existingUser.password)
    //     throw new Error('An account with this email already exists. Please log using email and password.');  
    //   }

    //   const _account = await prisma.Account.findFirst({where: {userId: existingUser.id}});

    //   if (account && account.provider !== _account.provider) {
    //     throw new Error(`Another account already exists with the same e-mail address. This email was registered with ${_account.provider} app.`);
    //     }
    //   }
    //   return true;
  
    // },
    async jwt({ token }) {
      if(!token.sub) 
        return token;

      const existingUser = await fetchUserById(token.sub)

      if(!existingUser) 
        return token;

      token.first_name = existingUser.first_name || "";
      token.last_name = existingUser.last_name || "";
      token.name = existingUser.name;
      token.isadmin = existingUser.isadmin || false;
      token.provider = existingUser. provider || existingUser.accounts[0].provider;

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
