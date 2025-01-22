import { NextResponse } from "next/server";

import fs from "node:fs/promises";
import prisma from "@/lib/prisma";



export async function POST(req) {
  try {
    const formData = await req.formData();
    console.log("image: ", formData)
    const file = formData.get("image");
    const ext = formData.get("extension");
    const product_id = formData.get("productid");
    const order = Number(formData.get("order"));

    var date = new Date();
    const unixTimestamp = Math.floor(date.getTime());
    const newName = unixTimestamp + "." + ext;

    var blob = file.slice(0, file.size); 
    var newFileName = new File([blob], newName, { type: file.type });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const imageName = newFileName.name;

    var sizeOf = require("image-size");
    var dimensions = sizeOf(Buffer.from(buffer));

 
    var format = "Landscape";
     if (dimensions.height > dimensions.width) format = "Portrait";

    const partialPath = `/images/product/${imageName}`;
    const path = `./public/${partialPath}`
    console.log("path: ", path)
    await fs.writeFile(path, buffer);
    
    const newImage = {
      product_id: product_id,
      image_name: imageName,
      path: partialPath,
      format: format,
      order: order,
    };
 
    await prisma.image.create({data: newImage});

    return NextResponse.json({ status: "success" });
  } catch (e) {
    return NextResponse.json({ status: "fail", error: e });
  }
}