

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
//import CategoryGrid from '@/app/(root)/gallerybycategory/category-grid';
import {fetchVisibleImagesByCategory} from "@/actions/gallery-actions";
import EmblaCarousel from '../embla-carousel';
//import ReactDOM from 'react-dom/client';
import '@/styles/embla/css/base.css';
import "@/styles/embla/css/embla.css"


const OPTIONS = {}
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())



const GalleryByCategory = async ({params}) => {
 const {id} = await params;
 const [images] = await Promise.all([fetchVisibleImagesByCategory(id[0])]);

  return (
        //  <CategoryGrid images={images}/>
        <EmblaCarousel slides={images} options={OPTIONS} />
  )
}

export default GalleryByCategory