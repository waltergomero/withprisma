"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { statusSchema } from "@/schemas/validation-schemas";
import prisma from "@/lib/prisma"

const ITEM_PER_PAGE = 10;

export const fetchFilteredStatus = async (q, page) => {
  const _number = ITEM_PER_PAGE * (page - 1)
  try {
    const status = await prisma.status.findMany({ 
      where: {status_name: { contains: q, mode: 'insensitive',}},
      orderBy: [{ status_name: 'asc',}, {status_type_id: 'asc',}], 
      skip: _number,
      take: ITEM_PER_PAGE 
   
     })

    return status

  } catch (err) {
    return({error: "Failed to fetch status!"});
  }
};

export async function fetchStatusPages(query) {
  noStore();
  try {
    const matchingElements  = await prisma.status.findMany({ 
      where: { 
        status_name: { 
          contains: query, 
          mode: 'insensitive',
         }
        } 
      });
    const count = matchingElements.length
    console.log("counting: ", count, matchingElements)
  
    const totalPages = Math.ceil(Number(count) / ITEM_PER_PAGE);
    return totalPages;

  } catch (err) {
    return({error: "Failed to fetch status! " + err});
  }
}

export async function fetchStatusTypeId() {
  noStore();

  try {
      var arr = [];
      for (let i = 0; i <= 10; i++) {
        arr.push(
          <option key={i} value={i}>
            {i}
          </option>
        );
      }
      return arr;

  } catch (err) {
    return({error: "Failed to fetch status type id!"});
  }
}



export const fetchStatusById = async (id) => {
  try {
    const _status = await prisma.status.findUnique({where: {id: id}});  
    const status = JSON.parse(JSON.stringify(_status));
    return status;
  } catch (err) {
    return({error: "Failed to fetch status!"});
  }
};

export async function createStatus(formData) {
  try {
    const status_name = formData.get("status_name");
    const status_type_id = Number(formData.get("status_type_id"));
    const created_by = formData.get("created_by");
    const updated_by = formData.get("updated_by");

    const validatedFields = statusSchema.safeParse({status_name,});
    
    if (!validatedFields.success) {
          return {
            error: "validation",
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            message: "Missing information on key fields.",
          };
        }

    const statusexists = await prisma.status.findFirst({ 
      where: { 
        AND: [
            {status_name: status_name}, 
            {status_type_id: status_type_id },
           ]
          }
      });


    if (statusexists) {
      return {  error: "statusexists",
        message: `Status name ${status_name} with type id ${status_type_id}  already exists.` };
    }

    const newStatus = {
      status_name,
      status_type_id,
      isactive: true,
      created_by,
      updated_by,
    };

    await prisma.status.create({data:newStatus});
    
  } catch (err) {
    return { error: "Failed to insert new status!" + err };
  }

  revalidatePath("/admin/status");
  redirect("/admin/status");
}

export async function updateStatus(formData) {
 
  try {
    const id = formData.get("id");
    const status_name = formData.get("status_name");
    const status_type_id = Number(formData.get("status_type_id"));
    const isactive = formData.get("isactive") ;
    const updated_by = formData.get("updated_by");

    const validatedFields = statusSchema.safeParse({status_name,});
    
      if (!validatedFields.success) {
          return {
            error: "validation",
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            message: "Missing information on key fields.",
          };
        }

    const statusexists = await prisma.status.findFirst({ 
      where: { 
        AND: [
            {status_name: status_name}, 
            {status_type_id: status_type_id },
           ]
          }
      });

    if (statusexists) {
      if (statusexists.id != id) {
        return  {error: "statusexists",
                 error: `Status name "${status_name}" with type id "${status_type_id}" already exists`};
      }
    }

    const query = {
      status_name: status_name,
      status_type_id: status_type_id,
      isactive: isactive ? true : false,
      updated_by: updated_by
    };
    
    await prisma.status.update({
      where: {
        id: id
      },
      data: query     
     });;

    }
   catch (err) {
    return { error: "Failed to update status!" + err };
  }

  revalidatePath("/admin/status");
  redirect("/admin/status");
}

export async function deleteStatus(id) {
  try {

    await prisma.status.delete({where: {id: id}});

  } catch (err) {
    throw new Error("Failed to delete status!");
  }
  revalidatePath("/dashboard/status");
}
