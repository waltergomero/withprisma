"use server";

import  User  from "@/models/user2";
import bcryptjs from "bcryptjs";
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { unstable_noStore as noStore } from 'next/cache';
import db from "@/utils/dbconnection";
import { userRegistrationSchema, userSigninSchema, userUpdateSchema } from "@/schemas/validation-schemas";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';



export const fetchUserById = async (id) => {
    try {
      await db.connectDB();
      const _user = await User.findById(id);
      await db.disconnectDB();
  
      const user = JSON.parse(JSON.stringify(_user));
      return user
    } catch (err) {
      return({error: err + "Failed to fetch user!"});
    }
  };

export async function createUser( formData, register=false) {
    const redirectPath = register ? "/auth/signin" : "/admin/users";
  
    try {
      const _isAdmin = formData.get("isadmin");
      const first_name = formData.get("first_name");
      const last_name = formData.get("last_name");
      const name = formData.get("first_name") + ' ' + formData.get("last_name");
      const email = formData.get("email");
      const password = formData.get("password");
      const isadmin = _isAdmin ? true : false;
      const provider = "credentials";
      const type = "credentials";
  
      const validatedFields = userRegistrationSchema.safeParse({
        first_name,
        last_name,
        email,
        password
      });
  
  
      if (!validatedFields.success) {
        return {
          error: "validation",
          zodErrors: validatedFields.error.flatten().fieldErrors,
          strapiErrors: null,
          message: "Missing information on key fields.",
        };
      }
    
      else{
      await db.connectDB();
      const userexists = await User.findOne({ email: email });
  
      if (userexists) {
        return { 
          error: "userexists",
          message: `User with this email account ${email} already exists.`, 
          }
        }
        
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
  
      const newUser = new User({
        first_name,
        last_name,
        name,
        email,
        password: hashedPassword,
        isadmin,
        provider,
        type,
      });
  
      await newUser.save();
      await db.disconnectDB();
    }
  
    } catch (err) {
      return { error: "Failed to insert new user!" + err};
    }
  
    revalidatePath(redirectPath);
    redirect(redirectPath);
  }
  