
'use client';

import Image from 'next/image'
import {DeleteImageBtn, SetImageVisible, SetImageNotVisible, EditImageBtn } from './buttons';
import React, { useState, useEffect } from 'react';
import {  PencilIcon,} from "@heroicons/react/24/outline";
import EditImageForm from './gallery-edit-form';
import { useSession } from "next-auth/react";


const GalleryGrid =  ({images, categories}) => {
  const { data: session } = useSession();
  const user_email =   session?.user?.email;
  const is_admin =   session?.user?.isadmin;

  const [isModalOpen, setModalOpen] = useState(false);
  
  return (
    <>
  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-2">
    <div className="mt-4 columns-1 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-4 2xl:columns-5">
    {images && images?.map((item) =>(
      <div className='relative after:content group relative mb-4 block w-full  after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight' 
         key={item.image_name}>
          <Image       
          alt={""}
          className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
          style={{ transform: 'translate3d(0, 0, 0)' }}             
          src={ item.path}
          width={720}
          height={480}
          layout="responsive"
          sizes="(max-width: 640px) 100vw,
            (max-width: 1280px) 50vw,
            (max-width: 1536px) 33vw,
            25vw"
        />

        {is_admin || (user_email===item.created_by) ?
          <div>
            <DeleteImageBtn image_id={item.id} image_path={item.path} />
            <EditImageBtn id={item.id} />
          </div>  : ""
        }
      {is_admin ?
        <div>
            { item.make_visible ? 
                <SetImageNotVisible image_id={item.id} image_path={item.path} user_email={user_email}/>         
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


const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
              <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={onClose}>
                  &#x2715; {/* Close button */}
              </button>
              {children}
          </div>
      </div>
  );
};

const AlertModal = ({ item, categories, isOpen, onClose }) => {
  return (
      <Modal isOpen={isOpen} onClose={onClose}>
          <EditImageForm item={item} categories={categories}/>
          
      </Modal>
  );
};
