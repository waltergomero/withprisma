"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import fs from "fs";
import prisma from "@/lib/prisma"


const ITEM_PER_PAGE = 10;

export const fetchImages = async () => {
 
  try {
    const _images = await prisma.gallery.find() 
    const images = JSON.parse(JSON.stringify(_images));
    return images

  } catch (err) {
    return({error: "Failed to fetch gallery images!"});
  }
};

export const fetchVisibleImagesForHomePage = async () => {
 
  try {
    const _images = await prisma.homepagecategories.findMany() 
    console.log("images: ", _images)
    const images = JSON.parse(JSON.stringify(_images));
    return images

  } catch (err) {
    return({error: "Failed to fetch gallery images! " + err});
  }
};

export const fetchVisibleImagesByCategory = async (category_id) => {
  try {
    const _images = await prisma.gallery.findMany({
                    where: {
                        AND: [{category_id: category_id}, {make_visible: true}]
                          },
                    select: {
                      category_name: true, path: true
                    }
                        }) 
    const images = JSON.parse(JSON.stringify(_images));
    return images

  } catch (err) {
    return({error: "Failed to fetch gallery images by category! " + err});
  }
};

export const fetchImagesByCategory = async (category_id) => {
  try {
    let _images = "";

      if(category_id === "0"){
          _images = await prisma.gallery.findMany({})
      }
      else{
          _images = await prisma.gallery.findMany({where: {category_id: category_id}}) 
      }
    const images = JSON.parse(JSON.stringify(_images));

    return images

  } catch (err) {
    return({error: "Failed to fetch gallery images by category! " + err});
  }
};

export const fetchCategoryWithImages = async () => {
  try {
    const _categories = await prisma.homepagecategories.findMany({select:{category_id: true, category_name: true}
      });

    const categories = JSON.parse(JSON.stringify(_categories));

    return categories

  } catch (err) {
    return({error: "Failed to fetch gallery images by category! " + err});
  }
};

export const fetchImageById = async (id) => {
  try {
    const _image = await prisma.gallery.findUnique({ 
      where: {id: id},
      select: { id: true, image_name: true, category_id: true, category_name: true, path: true}}); 

    const image = JSON.parse(JSON.stringify(_image));
    return image;

  } catch (err) {
    return({error: "Failed to fetch image information! " + err});
  }
};

export async function updateImageCategory(formData) {

  try {
    const id = formData.get("image_id");
    const category_name = formData.get("category_name");
    const category_id = formData.get("category_id");
    const path = formData.get("path");
    const image_name = formData.get("image_name");
    const caption = formData.get("caption");
    const updated_by = formData.get("updated_by");

    const query = {
      category_name: category_name,
      category_id: category_id,
      caption: caption,
      updated_by: updated_by,
    };

    await prisma.gallery.update({ 
          where: {id: id}, data: query});

    const imageExist = await prisma.homepagecategories.findUnique({ where:{image_name: image_name}});
    const categoryExist = await prisma.homepagecategories.findUnique({ where: {category_name_name: category_name}});

    if(imageExist && categoryExist){  
        await prisma.homepagecategories.delete({ where: {category_id: categoryExist.category_id}}); 
        await prisma.homepagecategories.update({ where: {id: imageExist.id}, data: query}); 
     }
    else if(imageExist && !categoryExist){ //update the image name and path in the homepagecategories collection
      await prisma.homepagecategories.update({ where: {id: imageExist.id}, data: query}); 
     }
    else{
        if(!imageExist && !categoryExist){ //if category do not exists, then add the category to the homepagecategories collection
          const newItem = {
            category_id,
            category_name,
            image_name,
            path
          };

        await prisma.homepagecategories.create({data: newItem});
          }
      } 
    }catch (err) {
      return({error: "Failed to update image information! " + err});
    }
      revalidatePath("/admin/gallery");
    }


export async function deleteImageFromGallery(image_id, image_path) {

  try {
    await prisma.homepagecategories.delete({where: { path: image_path}});
    const response = await prisma.gallery.delete({ where: {id: image_id}});
 
    if(response){
      fs.unlink("public" + image_path,function(err){
        if(err) throw err;
        console.log('File deleted!');
      });
  }
    
  } catch (err) {
    //throw new Error(err) //"Failed to delete product!");
    return({error: "Failed to delete image! " + err});
  }
  revalidatePath("/admin/gallery");
}

export async function MakeImageVisible(image_id, user_email) {
  try {
      const query = {
        make_visible: true,
    };    

    await prisma.gallery.update({ where: {id: image_id}, data: query});

    const imageInfo = await prisma.gallery.findUnique({ 
      where: {
        id: image_id 
            }
          });
  
    const categoryExist = await prisma.homepagecategories.findMany({
      where: {
        category_id: imageInfo.category_id
            }
        });

    if(categoryExist.length > 0){ //if category exists, then update the fields image name and image path
      const updatequery = {
        image_name: imageInfo.image_name,
        path: imageInfo.path,
        updated_by:user_email,
        }
        await prisma.homepagecategories.updateMany({ where: {category_id: imageInfo.category_id}, data: updatequery});
      }
      else{
        const newItem = {
          category_id: imageInfo.category_id,
          category_name: imageInfo.category_name,
          image_name: imageInfo.image_name,
          path: imageInfo.path,
          created_by:user_email,
          updated_by:user_email,
        };

        await prisma.homepagecategories.create({data: newItem});
      }
    
  } catch (err) {
    //throw new Error(err);
    return({error: "Failed to set image visible! " + err});
  }
  revalidatePath("/admin/gallery");
}

export async function MakeImageNotVisible(image_id, image_path) {

  try {
    const query = {
      make_visible: false,
  };    
    await prisma.gallery.update({ where: {id: image_id}, data: query });
    
  } catch (err) {
    //throw new Error(err);
    return({error: "Failed to set image  not visible! " + err});
  }
  revalidatePath("/admin/gallery");
}


