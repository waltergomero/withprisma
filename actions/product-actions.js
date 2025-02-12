"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import fs from "fs";
import path from "path";
import { productSchema } from "@/schemas/validation-schemas";
import prisma from '@/lib/prisma';

const ITEM_PER_PAGE = 10;

export const fetchFilteredProducts = async (q, page) => { 
  const _number = ITEM_PER_PAGE * (page - 1)
  try {
    const products = await prisma.Product.findMany({ 
      where: {product_name: { contains: q, mode: 'insensitive',}},
      orderBy: [{ product_name: 'asc',}], 
      skip: _number,
      take: ITEM_PER_PAGE    
     })
    return products

  } catch (err) {
    return({error: "Failed to fetch parent products! " + err});
  }
};

export async function fetchProductPages(query) {
  noStore();


  try {
    const matchingElements  = await prisma.Product.findMany({ 
      where: { 
        product_name: { 
          contains: query, 
          mode: 'insensitive',
         }
        } 
      });
    const totalpages = Math.ceil(Number(count) / ITEM_PER_PAGE);

    return totalpages;

  } catch (err) {
    return({error: "Failed to fetch products! " + err});
  }
}


export const fetchProductById = async (id) => {
  try {
    const _product = await prisma.Product.findUnique({
      where: {id : id},
      })

    const product = JSON.parse(JSON.stringify(_product));
    return product;

  } catch (err) {
    return({error: "Failed to fetch a product! " + err});
  }
};

export const fetchProducts = async () => {
  try {
    const products = await prisma.Product.findMany({ 
      orderBy: [{ product_name: 'asc',}],    
     })
    return product;
  } catch (err) {
    return({error: "Failed to fetch products! " + err});
  }
};

export async function createProduct(formData) {
    try {
      const product_name = formData.get("product_name");    
      const slug = formData.get("slug");
      const category_id = formData.get("category_id");
      const category_name = formData.get("category_name"); 
      const quantity_per_unit = formData.get("quantity_per_unit"); 
      const cost = parseFloat(formData.get("cost"));
      const price = parseFloat(formData.get("price"));
      const number_instock = Number(formData.get("number_instock"));
      const number_onorder = Number(formData.get("number_onorder"));
      const reorder_level = Number(formData.get("reorder_level"));
      const description = formData.get("description"); 
      const created_by = formData.get("created_by"); 
      const updated_by = formData.get("updated_by"); 
  
      const validatedFields = productSchema.safeParse({product_name, slug, category_id,});
                  
      if (!validatedFields.success) {
          return {
                  error: "validation",
                  zodErrors: validatedFields.error.flatten().fieldErrors,
                  strapiErrors: null,
                  message: "Missing information on key fields.",
                };
              }
  
      const productexists = await prisma.Product.findFirst({ where: {product_name: product_name}});
  
      if (productexists) {
        return { 
          error: "productexists",
          message: `Product name ${product_name} already exists.` };
      }
  
      const newProduct = {
        product_name,
        slug,
        category_id,
        category_name,
        quantity_per_unit,
        cost,
        price,
        number_instock,
        number_onorder,
        reorder_level,
        description,
        isactive: true,
        created_by,
        updated_by
      };
  
      await prisma.Product.create({data: newProduct});

    } catch (err) {
      return { error: "Failed to insert new product! " + err };
    }
  
    revalidatePath("/admin/products");
    redirect("/admin/products");
  }
  
  export async function updateProduct(formData) {
    try {
      const id = formData.get("id");
      const product_name = formData.get("product_name");    
      const slug = formData.get("slug");
      const category_id = formData.get("category_id");
      const category_name = formData.get("category_name"); 
      const quantity_per_unit = formData.get("quantity_per_unit"); 
      const cost = parseFloat(formData.get("cost"));
      const price = parseFloat(formData.get("price"));
      const number_instock = Number(formData.get("number_instock"));
      const number_onorder = Number(formData.get("number_onorder"));
      const reorder_level = Number(formData.get("reorder_level"));
      const description = formData.get("description"); 
      const isactive = formData.get("isactive");
      const updated_by = formData.get("updated_by");
  
      const validatedFields = productSchema.safeParse({product_name, slug, category_id,});
                  
      if (!validatedFields.success) {
          return {
                  error: "validation",
                  zodErrors: validatedFields.error.flatten().fieldErrors,
                  strapiErrors: null,
                  message: "Missing information on key fields.",
                  };
              }

      const productexists = await prisma.Product.findFirst({where: {product_name: product_name }});
  
      if (productexists) {
        if (productexists._id != id) {
          return  {error: "productexists",
                  error: `Product name "${product_name}"  already exists`};
        }
      }
  
  
      const query = {
        product_name,
        slug,
        category_id,
        category_name,
        quantity_per_unit,
        cost,
        price,
        number_instock,
        number_onorder,
        reorder_level,
        description,
        isactive: isactive ? true : false,
        updated_by,
      };    
  
      await prisma.Product.update({ where:{id: id}, data:query });

      }
     catch (err) {
      return { error: err };
    }
  
    revalidatePath("/admin/products");
    redirect("/admin/products");
  }

export async function deleteProduct(id) {
  try {

    await prisma.Product.delete({ where: {id: id} });

  } catch (err) {
    throw new Error("Failed to delete product! " + err);
  }
  revalidatePath("/dashboard/products");
}

export const fetchImageByProductId = async (productid) => {

  try {

    const _images = await prisma.image.findMany({ where: {product_id: productid}});

    const images = JSON.parse(JSON.stringify(_images));

    return images;
  } catch (err) {
    return({error: "Failed to fetch products!"});
  }
};

export async function deleteImageFromProduct(image_id, image_path) {

  try {

    await prisma.image.delete({where: {id: image_id}});
    
    fs.unlink("public" + image_path,function(err){
      if(err) throw err;
      console.log('File deleted!');
    });
    
  } catch (err) {
    throw new Error(err) //"Failed to delete product!");
  }
  revalidatePath("/dashboard/products");
}