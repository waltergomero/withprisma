"use server";

import bcryptjs from "bcryptjs";
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { unstable_noStore as noStore } from 'next/cache';
import { userRegistrationSchema, userSigninSchema, userUpdateSchema } from "@/schemas/validation-schemas";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from "@/lib/prisma"

const ITEM_PER_PAGE = 10;

export const fetchFilteredUsers = async (q, page) => {
  const _number = ITEM_PER_PAGE * (page - 1)
  try {
    const users = await prisma.User.findMany({ 
      where: {email: { contains: q, mode: 'insensitive',}},
      orderBy: [{ last_name: 'asc',}, {first_name: 'asc',}], 
      skip: _number,
      take: ITEM_PER_PAGE 
   
     })
    return users

  } catch (err) {
    return({error: "Failed to fetch filtered users!"});
  }
};

export async function fetchUserPages(query) {
  noStore();
  try {

    const matchingElements  = await prisma.User.findMany({ where:{ email: { contains: query,  mode: 'insensitive', }} }) 
    const count = matchingElements.length
  
    const totalPages = Math.ceil(Number(count) / ITEM_PER_PAGE);
    return totalPages;

  } catch (err) {
    return({error: "Failed to fetch users!"});
  }
}


export const fetchUserById = async (id) => {
    try {

      const _user = await prisma.User.findUnique({where: {id: id}});  
      const user = JSON.parse(JSON.stringify(_user));
      return user
    } catch (err) {
      return({error: err + "Failed to fetch user!"});
    }
  };

export async function createUser( formData, register=false) {
    const redirectPath = register ? "/login" : "/admin/users";
  
    try {
      const _isAdmin = formData.get("isadmin");
      const first_name = formData.get("first_name");
      const last_name = formData.get("last_name");
      const name = formData.get("first_name") + ", " + formData.get("last_name");
      const email = formData.get("email");
      const password = formData.get("password");
      const isadmin = _isAdmin ? true : false;
      const isactive = true;
      const provider = "credentials";
      const type = register ? "credentials" : "created_by_admin";
      const created_by = register ? formData.get("email") : formData.get("created_by");
      const updated_by = register ? formData.get("email") : formData.get("updated_by");
  
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

      const userexists = await prisma.User.findUnique({ where: {email: email}});
      if (userexists) {
        return { 
          error: "userexists",
          message: `User with this email account ${email} already exists.`, 
          }
        }
        
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
  
      const newUser = {
        first_name,
        last_name,
        name,
        email,
        password: hashedPassword,
        isadmin,
        isactive,
        provider,
        type,
        created_by: created_by,
        updated_by: updated_by,
      };
  
      await prisma.User.create({data:newUser});
    }
  
    } catch (err) {
      return { error: "Failed to insert new user!" + err};
    }
  
    revalidatePath(redirectPath);
    redirect(redirectPath);
  }

  export async function updateUser(formData) {

    try {
      const id = formData.get("id");
      const first_name = formData.get("first_name");
      const last_name = formData.get("last_name");
      const name = formData.get("first_name") + ", " + formData.get("last_name");
      const email = formData.get("email");
      const password = formData.get("password");
      const isadmin = formData.get("isadmin");
      const isactive = formData.get("isactive");
      const updated_by = formData.get("updated_by");
  
      const validatedFields = userUpdateSchema.safeParse({
        first_name,
        last_name,
        email,
      });
  
      if (!validatedFields.success) {
        return {
          error: "validation",
          zodErrors: validatedFields.error.flatten().fieldErrors,
          strapiErrors: null,
          message: "Missing information on key fields.",
        };
      }
  
      const userexists = await prisma.User.findUnique({ where:{ email: email }});
      if (userexists) {
        if (userexists.id != id) {
          return  {error: "userexists",
                   message: `User with this email "${email}" already exists`};
        }
      }
  
      let query = {
        first_name: first_name,
        last_name: last_name,
        name: name,
        email: email,
        isadmin: isadmin ? true : false,
        isactive: isactive ? true : false,
        updated_by: updated_by
      };;
  
      if(password){
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt); 
        let _password = {password: hashedPassword}
        Object.assign(query, _password)
       }

        await prisma.User.update({
          where: {
            id: id
          },
          data: query     
         });
    
    } catch (err) {
      return { error: err };
    }
  
    revalidatePath("/admin/users");
    redirect("/admin/users");
  }
  
  export async function fetchUserByEmail(email, provider) {
    try {
      if(provider == "credentials" || provider == "")
        {
          return await prisma.User.findUnique({
            where: {email: email},
            select:{email: tru, provider:true} 
        });
        }
      else{
          return await prisma.Account.findUnique({
          where: {email: email},
          select:{email: tru, provider:true} 
        });
      }

    } catch (error) {
  
      throw new Error('Failed to fetch User.');
    }
  }

  export async function fetchUserByEmailInAccount(email) {
    try {
        return await prisma.User.findUnique({
            where: {email: email},
            include:{ accounts: true},
        });
  
    } catch (error) {
  
      throw new Error('Failed to fetch User. ' + error.message);
    }
  }
  
  
  export async function deleteUser(id) {
    try {

      await prisma.User.delete({where: { id: id}});
      
    } catch (err) {
      throw new Error("Failed to delete user!");
    }
    revalidatePath("/dashboard/users");
  }

  export async function doCredentialLogin(formData) {
    try {
      const email = formData.get("email");
      const password = formData.get("password");
  
      const validatedFields = userSigninSchema.safeParse({email, password});
  
      if (!validatedFields.success) {
        return {
          error: "Missing information on key fields.",
          zodErrors: validatedFields.error.flatten().fieldErrors,
          strapiErrors: null,
        };
      }
  
      await signIn("credentials", {email, password, redirect: false,});
      return { success: true };
    } 
    catch (error) {
      if (error instanceof AuthError) {
        return { error: error.cause?.err?.message };
      }
      return { error: "error 500" };
    }
   
  }

  export async function doSocialLogin(provider) {
    console.log("provider: ", provider)
   try{
      const result = await signIn(provider, { redirectTo: "/admin" });
    }
    catch (error) {
      console.log("errores: ", error )
       return { error: "error 500" };
     }
   }