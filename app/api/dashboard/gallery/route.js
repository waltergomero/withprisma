import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import prisma from "@/lib/prisma";


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
 
    var format = "Landscape";
     if (dimensions.height > dimensions.width) format = "Portrait";

    const partialPath = `/images/gallery/${imageName}`;
    const path = `./public/${partialPath}`
    await fs.writeFile(path, buffer);
    
    const addImageToGallery = {
      category_id: category_id,
      category_name: category_name,
      image_name: imageName,
      src: partialPath,
      format: format,
      width: dimensions.width,
      height: dimensions.height,
      caption: "",
      make_visible: false,
      created_by: user_email,
      updated_by: user_email,
    };
 
    console.log("image save: ", addImageToGallery)
    const data = await prisma.gallery.create({ data: addImageToGallery});
 
    return NextResponse.json({ status: "success" });
  } catch (e) {

    return NextResponse.json({ status: "fail", error: e });
  }
}