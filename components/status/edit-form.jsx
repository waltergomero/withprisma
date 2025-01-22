"use client";

import {  useState} from "react";
import { updateStatus } from "@/actions/status-actions";
import { SaveStatusBtn, CancelStatusBtn } from "@/components/status/buttons";
import { toast } from 'react-toastify';
import CheckboxDefault from "@/components/ui/checkboxes/checkbox";
import { ZodErrors } from "@/components/common/zod-errors";
import { useSession } from "next-auth/react";

export default function UserEditForm({status, statustypeid}) {
  const { data: session } = useSession();
  const [state, setState] = useState(null);

  async function onSubmit(event) {
         event.preventDefault();
         setState(null);
         
         const formData = new FormData(event.currentTarget);
         formData.append("updated_by", session?.user?.email);
         
         const response = await updateStatus(formData);
     
         if (response.error === "validation") {
                 setState(response);
                 toast.error(response.message);
             } 
         else if (response.error==="statusexists") {
               toast.error(response.message);
             } 
         else {
               toast.error(response.error);
             }
           
       }


  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
      <h3 className="font-medium text-black dark:text-white">
        Edit Status Form
      </h3>
    </div>
    <form onSubmit={onSubmit}>
    <input type="hidden" name="id" defaultValue={status.id}/>
      <div className="p-6.5">
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Status name:<span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              name="status_name"
              defaultValue={status.status_name}
              placeholder="Enter status name"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
             <ZodErrors error={state?.zodErrors?.status_name} />
          </div>

          <div className="w-full xl:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Status type id:<span className="text-meta-1">*</span>
            </label>
            <select
              name="status_type_id"
              defaultValue={status.status_type_id}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 px-5 py-1 pl-4 text-md outline-2 placeholder:text-gray-500">
              <option value="" disabled>
              </option>
                  {statustypeid}
            </select>

          </div>
        </div>

        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">    
          <div className="w-full xl:w-1/2">
          <CheckboxDefault  title="Is status active?" name="isactive" checked={status.isactive} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <CancelStatusBtn/>
          <SaveStatusBtn/>
        </div>
      </div>
    </form>
  </div>

  );
}