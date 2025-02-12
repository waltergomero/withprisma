"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { categorySchema } from "@/schemas/validation-schemas";
import prisma from '@/lib/prisma';

const ITEM_PER_PAGE = 10;

export const fetchFilteredCategories = async (q, page) => { 
  const _number = ITEM_PER_PAGE * (page - 1)
  try {
      const categories = await prisma.Category.findMany({ 
        where: {category_name: { contains: q, mode: 'insensitive',}},
        orderBy: [{ category_name: 'asc',}], 
        skip: _number,
        take: ITEM_PER_PAGE    
       })
  
    return categories

  } catch (err) {
    return({error: "Failed to fetch parent categories! " + err});
  }
};


export async function fetchCategoryPages(query) {
  noStore();

  try {
    const matchingElements  = await prisma.Category.findMany({ 
      where: { 
        category_name: { 
          contains: query, 
          mode: 'insensitive',
         }
        } 
      });
    const totalpages = Math.ceil(Number(count) / ITEM_PER_PAGE);

    return totalpages;

  } catch (err) {
    return({error: "Failed to fetch categories! " + err});
  }
}

export async function fetchParentCategories() {
  noStore();

  try {
    const _parentcategory = await prisma.Category.findMany({ 
      select:{
        id: true,
        category_name: true,
      },
      orderBy: [{ category_name: 'asc',}],    
     })

    const parentcategory = JSON.parse(JSON.stringify(_parentcategory));
    return parentcategory;

  } catch (err) {
    return({error: "Failed to fetch parent categories! " + err});
  }
}


export const fetchCategoryById = async (id) => {
  try {

    const _category = await prisma.Category.findUnique({
      where: {id : id},
      select:{id: true, category_name: true, parent_category_id: true,
              parent_category_name: true, isactive: true, notes: true
      }})
    const category = JSON.parse(JSON.stringify(_category));
    return category;

  } catch (err) {
    return({error: "Failed to fetch category! " + err});
  }
};

export const fetchCategories = async () => {
  try {
    const _category = await prisma.Category.findMany({ 
      select:{
        id: true,
        category_name: true,
      },
      orderBy: [{ category_name: 'asc',}],    
     })

    const category = JSON.parse(JSON.stringify(_category));
    return category;
  } catch (err) {
    return({error: "Failed to fetch category! " + err});
  }
};

export async function createCategory(formData) {

  try {
    const category_name = formData.get("category_name");
    const parent_category_id = formData.get("parent_category_id");
    let parent_category_name = "";
    const notes = formData.get("notes");
    const created_by = formData.get("created_by");
    const updated_by = formData.get("updated_by");

    const validatedFields = categorySchema.safeParse({category_name,});
            
    if (!validatedFields.success) {
              return {
                error: "validation",
                zodErrors: validatedFields.error.flatten().fieldErrors,
                strapiErrors: null,
                message: "Missing information on key fields.",
              };
            }

    const categoryexists = await prisma.Category.findFirst({ where: { category_name: category_name} });


    if (categoryexists) {
      return { error: "categoryexists",
        message: `Category name ${category_name} already exists.` };
    }

    if(parent_category_id != "") {
     const parentcategoryname = await prisma.Category.findFirst({ 
      where: {id: parent_category_id}, 
      select:{category_name: true} 
      });

    if (parentcategoryname) {
      parent_category_name = parentcategoryname.category_name;
    }
  }

    const newCategory = {
      category_name,
      parent_category_id,
      parent_category_name,
      isactive: true,
      notes,
      created_by,
      updated_by,
    };

    await prisma.Category.create({data: newCategory});

  } catch (err) {
    return { error: "Failed to insert new category! " + err };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(formData) {
  try {
    const id = formData.get("id");
    const category_name = formData.get("category_name");
    const parent_category_id = formData.get("parent_category_id");
    let parent_category_name = "";
    const isactive = formData.get("isactive");
    const notes = formData.get("notes");
    const updated_by = formData.get("updated_by");

    const validatedFields = categorySchema.safeParse({category_name,});
            
    if (!validatedFields.success) {
              return {
                error: "validation",
                zodErrors: validatedFields.error.flatten().fieldErrors,
                strapiErrors: null,
                message: "Missing information on key fields.",
              };
            }

    const categoryexists = await prisma.Category.findFirst({ where: {category_name: category_name} });

    if (categoryexists) {
      if (categoryexists.id != id) {
        return  {error: "categoryexists",
                 message: `Category name "${category_name}"  already exists`};
      }
    }

    if(parent_category_id != "") {
      const parentcategoryname = await prisma.Category.findFirst({ 
       where: {id: parent_category_id}, 
       select:{category_name: true} 
       });

    if (parentcategoryname) {
      parent_category_name = parentcategoryname.category_name;
    }
   }
    
   //check if parent category id exists with the same category id, if yes, then we need to update the parent category name
   const parentcategoryids = prisma.Category.findMany({where: {parent_category_id: id}})
    if (parentcategoryids){
      await prisma.Category.updateMany({
        where:{ 
              parent_category_id: id}, 
        data: {parent_category_name: category_name}
      })
    }

    const query = {
      category_name: category_name,
      parent_category_id: parent_category_id,
      parent_category_name: parent_category_name,
      isactive: isactive? true : false,
      notes: notes,
      updated_by,
    };
 
    await prisma.Category.update({ where: {id: id}, data: query });
    }
   catch (err) {
    return { error: "Failed to update category!" + err };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id) {
  try {
    await prisma.Category.delete({ where: {id: id} });
    } 
  catch (err) {
    throw new Error("Failed to delete category! " + err);
  }
  revalidatePath("/dashboard/categories");
}

