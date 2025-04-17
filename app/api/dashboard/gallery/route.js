import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import sharp from 'sharp';
import path from 'path';
const fs = require('fs');


export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("image");
    const ext = formData.get("extension");
    const category_id = formData.get("category_id");
    const category_name = formData.get("category_name");
    const user_email = formData.get("user_email");
    const image_caption = formData.get("caption");
    

    var date = new Date();
    const unixTimestamp = Math.floor(date.getTime());
    const newName = unixTimestamp + "." + ext;

    var blob = file.slice(0, file.size); 
    var newFileName = new File([blob], newName, { type: file.type });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const imageName = newFileName.name;

    var sizeOf = require("image-size");
    var dimensions = sizeOf(buffer);
 
    var format = "landscape";
     if (dimensions.height > dimensions.width) format = "portrait";

    const partialDir = '/images/gallery/' + category_name;
    const dir = path.join(process.cwd(), 'public', partialDir);
  
    const dirExist = await checkPublicPath(dir);

    if(dirExist === false){
       fs.mkdirSync(dir, { recursive: true });
     }
    
    const partialPath = partialDir + "/" + imageName;
    const src = `./public/${partialPath}`
    const absolutePath = dir + "/" + imageName;

    await fs.writeFileSync(src, buffer);

    const isBW = await isBlackAndWhite(absolutePath);
 
    const addImageToGallery = {
      category_id: category_id,
      category_name: category_name,
      image_name: imageName,
      src: partialPath,
      format: format,
      width: dimensions.width,
      height: dimensions.height,
      caption: image_caption,
      is_visible: false,
      isblack_white: isBW,
      created_by: user_email,
      updated_by: user_email,
    };
   
   const data = await prisma.gallery.create({ data: addImageToGallery});
 
    return NextResponse.json({ status: "success" });
  } catch (e) {

    return NextResponse.json({ status: "fail", error: e });
  }
}

async function isBlackAndWhite(imagePath) {
  const image = sharp(imagePath);

  // Retrieve raw pixel data
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  // Check if all pixels are black and white
  let isBlackAndWhite = true;
  for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i];     // Red channel
      const g = data[i + 1]; // Green channel
      const b = data[i + 2]; // Blue channel

      // If RGB values aren't equal, it's not black and white
      if (r !== g || g !== b) {
          isBlackAndWhite = false;
          break;
      }
  }

  return isBlackAndWhite;
}

async function checkPublicPath(dir){
  const result =  await fs.existsSync(dir);
  return result;
};