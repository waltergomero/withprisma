"use client";

import 'react-tabs/style/react-tabs.css';
import GalleryGrid from "./gallery-grid";
import ImageUploader from './image-uploader';


export default function Gallery({categories, images, category_name}) {

    return (
    <> 
        <ImageUploader categories={categories}/>
        <GalleryGrid images={images} category_name={category_name}/>
    </>
  );
}

