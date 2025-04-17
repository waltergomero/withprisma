import React from 'react';
import OrientationLigthbox from '@/components/rootgallery/orientation-lightbox';
import {FetchRandomImages} from "@/actions/gallery-actions";


const CollectionsPage = async () => {  
    
  const images = await FetchRandomImages();

  return (
          <OrientationLigthbox images={images} orientation={"Collections"}/>
        )
}

export default CollectionsPage;