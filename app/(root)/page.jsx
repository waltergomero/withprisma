import Link from "next/link";
import GalleryGrid from "./gallery-grid";
import {fetchVisibleImagesForHomePage, imagesByCategory} from "@/actions/gallery-actions";
import Image from "next/image";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

export const metadata = {
  title:
    "Salkantay Photo Gallery",
  description: "Photo Gallery",
};

const photos = [
  { src: "/images/gallery/1737429962181.jpg", width: 800, height: 600 },
  { src: "/images/gallery/1737477664986.jpg", width: 1600, height: 900 },
];
export default async function Home() {
  const images = await fetchVisibleImagesForHomePage();
  console.log("images ", images)
  return (
<main className="pt-16">

<div className=" w-full mx-auto">
        <Image
          src={`/images/cover/cover_1.jpg`}
          height={560}
          width={2048}
          className="h-full w-full object-cover"
          alt="cover image"
        />   
</div>
<div className="flex py-4 items-center bg-black-2">
    <div className="flex-grow border-t border-gray-400"></div>
    <Link href="" className="flex-shrink mx-2 text-gray-400">CATEGORY</Link> | 
    <Link href="" className="flex-shrink mx-2 text-gray-400">COLLECTIONS</Link> |
    <Link href="" className="flex-shrink mx-2 text-gray-400">LANDSCAPE</Link> |
    <Link href="" className="flex-shrink mx-2 text-gray-400">PORTRAIT</Link>
    <div className="flex-grow border-t border-gray-400"></div>
</div>
 <main className="mx-auto">
        {/* <div className="gap-0.5 columns-1  md:columns-2 l:columns-3 xl:columns-4 2xl:columns-5 m-2">
        <GalleryGrid images={images}/>
        </div> */}
       <RowsPhotoAlbum photos={images} />;
      </main>
</main>
  );
}

