import React from 'react';
import Breadcrumbs from "@/components/ui/breadcrumbs";
import Gallery from '@/components/gallery/gallery';
import {fetchCategories} from "@/actions/category-actions";
import {fetchImagesByCategory } from "@/actions/gallery-actions";

const GalleryPage = async ({params}) => {
    const _params = await params;
    const id =_params.id[0];

    const categories = await fetchCategories();
    const images = await fetchImagesByCategory(id)

  return (
    <main>
    <Breadcrumbs
      breadcrumbs={[
        { label: "Photo Gallery", href: "/admin/gallery" },

      ]}
    />
    <Gallery categories={categories} images={images}/>
  </main>
  )
}

export default GalleryPage