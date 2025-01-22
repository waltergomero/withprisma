import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CategoryGrid from '@/app/(root)/gallerybycategory/category-grid';
import {fetchVisibleImagesByCategory} from "@/actions/gallery-actions";


const GalleryByCategory = async ({params}) => {
  const {id} = await params;
  const [images] = await Promise.all([fetchVisibleImagesByCategory(id[0])]);

  return (
         <CategoryGrid images={images}/>
  )
}

export default GalleryByCategory