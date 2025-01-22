'use client';

import React  from 'react'
import { useState} from "react";
import { PlusIcon} from "@heroicons/react/24/outline";
import { updateImageCategory } from '@/actions/gallery-actions';
import {  useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useSession } from "next-auth/react";

const EditImageForm = ({image, categories}) => {
    const { data: session } = useSession();
    const user_email =   session?.user?.email;

    const router = useRouter();
    const [categoryValue, setCategoryValue] = useState(image.category_id);
    const [categoryText, setCategoryText] = useState(image.category_name);
    const [caption, setCaption] = useState(image.caption);
    const id= image.id;
    const image_name = image.image_name;
    const path = image.path;

    
   const saveImageInformation = async (event) => {
    event.preventDefault();
 
    if(categoryText === null) {
      toast.error("Please select a category.");
      return
    }
    else{
        const formdata = new FormData();
        formdata.append("image_id", id);
        formdata.append("image_name", image_name);
        formdata.append("category_id", categoryValue);
        formdata.append("category_name", categoryText);
        formdata.append("path", path);
        formdata.append("caption", caption);
        formdata.append("updated_by", user_email);

        await updateImageCategory(formdata);
        toast.success("Image information updated successfully.");
    }
    setTimeout(() => {
      router.refresh();
    }, 1000)

  }

  const handleClick = e => {
    e.preventDefault();
    const dropdownName = e.target.options[e.target.selectedIndex].text;
    if(dropdownName){
      setCategoryText(dropdownName);
      setCategoryValue(e.target.value);
    } 
    else{
      setCategoryText(null);
      setCategoryValue(null);
    }
  };

  return (
        <div className="w-1/3 rounded-sm p-4 mt-2 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="mb-2 flex">
            <label className="mb-1 block text-sm font-medium text-black dark:text-white">
                Category:<span className="text-meta-1">*</span>
              </label>
              <select
                name="category_id"
                onClick={handleClick}
                defaultValue={categoryValue}
                required
                className="peer ml-2 block w-[25%] cursor-pointer rounded-md border border-gray-300 px-3 mb-2 py-1 text-sm outline-2 placeholder:text-gray-500">
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-16 md:w-32 lg:w-48">
                <Image 
                    className="rounded-md"
                    width="720"  
                    height="480"                          
                    src={image.path}  
                    alt={image.caption} 
                    layout="responsive"
                    sizes="(max-width: 640px) 100vw,
                      (max-width: 1280px) 50vw,
                      (max-width: 1536px) 33vw,
                      25vw"/>  
               </div> 
               <div className="mt-4 flex">
               <label className="block text-md font-medium text-black dark:text-white mr-2">
                    Caption:
                  </label>
                  <textarea
                    rows={2}
                    name="caption"
                    defaultValue={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-1 py-1 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>   
                <div className="mt-6 flex justify-center">                    
                <button type="submit"
                        onClick={saveImageInformation}
                        className="flex h-10 mb-2 items-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors px-4 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                        <span className="hidden md:block">Save Image Information</span>
                        <PlusIcon className="h-6 md:ml-4" />
                        </button>
                </div>
            </div>        
  )
}

export default EditImageForm