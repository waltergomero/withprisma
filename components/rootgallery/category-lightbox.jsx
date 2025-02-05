"use client";
import { useState } from "react";

import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";


const CategoryLightbox = ({images}) => {
    const [index, setIndex] = useState(-1);
  const categoryname = "CATEGORY : " + images[0]["category_name"];


  return (
    <main className="pt-16">

    <div className="mt-1 flex py-15 items-center bg-black-2">
        <div className="flex-grow border-t  border-gray-400"></div>
        <span className="flex-shrink mx-2 text-gray-400 text-2xl"><p className='text-white uppercase'>{categoryname}</p></span>
        <div className="flex-grow border-t border-gray-400"></div>
    </div>
 

    <div className="p-1 gap-1 columns-1  md:columns-2 lg:columns-3 xl:columns-4 xl:columns-5  mb-2"> 

      <RowsPhotoAlbum photos={images} targetRowHeight={350} onClick={({ index }) => setIndex(index)} />

      <Lightbox
        slides={images}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        // enable optional lightbox plugins
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
  
    </div>
   

    </main>

  )
}

export default CategoryLightbox