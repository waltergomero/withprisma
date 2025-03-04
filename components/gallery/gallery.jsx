"use client";

import 'react-tabs/style/react-tabs.css';
import UploadImage from "./uploadimage";
import GalleryGrid from "./gallery-grid";


export default function Gallery({categories, images, category_name}) {

    return (
    <> 
        <UploadImage categories={categories}/>
        <GalleryGrid images={images} category_name={category_name}/>
    </>
  );
}

