import React from 'react';
import OrientationLigthbox from '@/components/rootgallery/orientation-lightbox';
import {FetchImagesByOrientation} from "@/actions/gallery-actions";


const OrientationPage = async ({params}) => {
  const {format} = await params;
  const _format = format[0];
  
  const images = await FetchImagesByOrientation(_format);

  return (
          <OrientationLigthbox images={images} orientation={_format}/>
        )
}

export default OrientationPage;