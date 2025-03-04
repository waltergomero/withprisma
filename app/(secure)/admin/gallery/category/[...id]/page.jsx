import React from 'react';
import Breadcrumbs from "@/components/ui/breadcrumbs";
import Gallery from '@/components/gallery/gallery';
import {fetchCategories} from "@/actions/category-actions";
import {fetchImagesByCategory } from "@/actions/gallery-actions";

const GalleryPage = async ({params}) => {
    const _params = await params;
    const category_name =_params.id[0].replace(/%20/, ' ');

    const categories = await fetchCategories();
    const images = await fetchImagesByCategory(category_name)

  return (
    <main>
    <Breadcrumbs
      breadcrumbs={[
        { label: "Photo Gallery", href: "/admin/gallery" },

      ]}
    />
    <Gallery categories={categories} images={images} category_name={category_name}/>
  </main>
  )
}

export default GalleryPage