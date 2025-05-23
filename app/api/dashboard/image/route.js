import { NextResponse } from "next/server";
import db from "@/utils/dbconnection";
import Images from "@/models/image";
import fs from "node:fs/promises";
import path from 'path';


export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("image");
    const ext = formData.get("extension");
    const product_id = formData.get("productid");
    const order = formData.get("order");

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

    const partialSrc = `/images/product/${imageName}`;

    //check if folder exists in public folder

    // const src = `./public/${partialSrc}`
    // await fs.writeFile(src, buffer);
    
    // const addImage = new Images({
    //   image_name: imageName,
    //   product_id: product_id,
    //   src: partialSrc,
    //   format: format,
    //   width: dimensions.width,
    //   height: dimensions.height,
    //   order: order,
    // });
    // db.connect();
    // const data = await addImage.save();
    // db.disconnect();

    return NextResponse.json({ status: "success" });
  } catch (e) {
    return NextResponse.json({ status: "fail", error: e });
  }
}