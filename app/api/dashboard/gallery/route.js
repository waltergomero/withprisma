import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import prisma from "@/lib/prisma";
const sharp = require('sharp');
import path from 'path';


export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("image");
    const ext = formData.get("extension");
    const category_id = formData.get("category_id");
    const category_name = formData.get("category_name");
    const user_email = formData.get("user_email");

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

    const partialSrc = `/images/gallery/${imageName}`;
    const src = `./public/${partialSrc}`
    await fs.writeFile(src, buffer);

    //check if image is black and white
    const absolutePath = path.join(process.cwd(), 'public', partialSrc);

    //const isblack_white = await isImageBlackAndWhite(absolutePath);
    //console.log("is b and w? ", isblack_white)
    const addImageToGallery = {
      category_id: category_id,
      category_name: category_name,
      image_name: imageName,
      src: partialSrc,
      format: format,
      width: dimensions.width,
      height: dimensions.height,
      caption: "",
      make_visible: false,
      isblack_white: false,
      created_by: user_email,
      updated_by: user_email,
    };
    const data = await prisma.gallery.create({ data: addImageToGallery});
 
    return NextResponse.json({ status: "success" });
  } catch (e) {

    return NextResponse.json({ status: "fail", error: e });
  }
}

async function isImageBlackAndWhite(imagePath) {
  const { data, info } = await sharp(imagePath).raw().toBuffer({ resolveWithObject: true });
  const { channels } = info;
  console.log(" chanbels: ", channels)
  if (channels === 1) {
    return true; // Image is grayscale
  }

  for (let i = 0; i < data.length; i += channels) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    if (r !== g || g !== b) {
      return false; // Image has color
    }
  }
  return true; // Image is black and white
}