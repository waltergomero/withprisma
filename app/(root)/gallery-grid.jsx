"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const GalleryGrid = ({images}) => {

  return (
        <div>     
        {images && images?.map((item) =>(
          <Link
             key={item.category_id}
            href={`/reactalbumbycategory/${item.category_id}`}
             shallow
             className="after:content group relative mb-0.5 block w-full  after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
                  >
              <Image
              alt="Next.js Conf photo"
              className="transform brightness-40 transition will-change-auto group-hover:brightness-110"
              style={{ transform: 'translate3d(0, 0, 0)' }}        
              src={item.src}
              width={720}
              height={480}
              sizes="(max-width: 640px) 100vw,
                (max-width: 1280px) 50vw,
                (max-width: 1536px) 33vw,
                25vw"
            />
            <span className="absolute bottom-[2%] left-[20%] p-2 bg-red-400 rounded-md uppercase  text-gray-300 text-md">{item.category_name}</span>
            </Link>
        ))
            }
        </div>
  )
}

export default GalleryGrid