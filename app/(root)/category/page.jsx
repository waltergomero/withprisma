import React from 'react';
import {fetctCategoriesForHomePage} from '@/actions/gallery-actions';
import GalleryGrid from '../gallery-grid';

const CategoryPage = async () => {
    const images = await fetctCategoriesForHomePage();

  return (
   <div className="pt-20 pl-5 pr-5 columns-1 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-4 2xl:columns-5">
        <GalleryGrid images={images}/>
    </div>
  )
}

export default CategoryPage;