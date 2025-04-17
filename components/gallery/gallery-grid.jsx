
'use client';

import Image from 'next/image'
import {DeleteImageBtn, SetImageVisible, SetImageNotVisible, EditImageBtn, 
  SetAllImageVisible, SetAllImageNotVisible, SetAllImageVisibility } from './buttons';
import React, { useState, useEffect } from 'react';
import {  PencilIcon,} from "@heroicons/react/24/outline";
import { toast } from 'react-toastify';
import EditImageForm from './gallery-edit-form';
import { useSession } from "next-auth/react";
import SetImageVisibility from '@/actions/gallery-actions';

const GalleryGrid =  ({images, category_name}) => {
  const { data: session } = useSession();
  const user_email =   session?.user?.email;
  const is_admin =   session?.user?.isadmin;

  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-2">
   <div className='flex justify-between text-bodydark2 font-semibold'>
    <div>Category: {category_name === "0" ? "All" : category_name} </div>
    <div>
      <span>Set all images: </span>
      <div className="inline-flex gap-2">
      <SetAllImageVisibility state="enable" settings={true} user_email={user_email} category_name={category_name}/>
      <SetAllImageVisibility state="disable" settings={false} user_email={user_email} category_name={category_name}/>
      </div>
    </div>
    
   </div>
    <div className="mt-4 columns-1 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-4 ">
    {images && images?.map((item) =>(
      <div className='relative after:content group mb-4 block w-full  after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight' 
         key={item.image_name}>
          <Image       
          alt={""}
          className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
          style={{ transform: 'translate3d(0, 0, 0)' }}             
          src={item.src}
          width={720}
          height={480}
          priority={false}
          sizes="(max-width: 640px) 100vw,
            (max-width: 1280px) 50vw,
            (max-width: 1536px) 33vw,
            25vw"
        />
        <div className='absolute p-1 text-white text-center text-sm w-full bottom-0  rounded-sm bg-gray-500'>
            {item.caption}
        </div>

        {is_admin || (user_email===item.created_by) ?
          <div>
            <DeleteImageBtn image_id={item.id} image_src={item.src} />
            <EditImageBtn id={item.id} />
          </div>  : ""
        }
      {is_admin ?
        <div>
            { item.is_visible ? 
                <SetImageNotVisible image_id={item.id} image_src={item.src} user_email={user_email}/>         
                :  <SetImageVisible image_id={item.id} user_email={user_email} /> 
            }
        </div>
            : "" 
      }
       </div>
        ))
        }
    </div>
    </div>
    </>
  )
}

export default GalleryGrid;



