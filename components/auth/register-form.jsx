"use client";

import React, { Fragment, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SocialButtons from './social-buttons';
import Link from 'next/link';
import { ArrowRightIcon, AtSymbolIcon,  KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { createUser } from '@/actions/user-actions';
import { toast } from 'react-toastify';
import { ZodErrors } from "@/components/common/zod-errors";

const RegisterForm = () => {
  const [state, setState] = useState(null);
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("")


  async function onSubmit(event) {
        event.preventDefault();
        setState(null);
        
        const formData = new FormData(event.currentTarget);
        const response = await createUser(formData, true);
    
        if (response.error === "validation") {
                setState(response);
                toast.error(response.message);
            } 
        else if (response.error==="userexists") {
              toast.error(response.message);
            } 
        else {
              toast.error(response.error);
            }   
  }

  return (
    <Fragment>
   <div className="w-full max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Create an account</h1>
      <form  onSubmit={onSubmit} className="space-y-4"  >
      <div className="relative">
        <Input
         name="first_name"
          placeholder="First Name"
          type="text"
        />
         <ZodErrors error={state?.zodErrors?.first_name} />
        </div>
        <div className="relative">
         <Input
         name="last_name"
          placeholder="Last Name"
          type="text"
        />
         <ZodErrors error={state?.zodErrors?.last_name} />
         </div>
         <div className="relative">
         <Input
          className="pl-8"
          name="email"
          placeholder="Email"
          type="email"
          autoComplete="email"
        />
         <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
         <ZodErrors error={state?.zodErrors?.email} />
         </div>
         <div className="relative">
        <Input
          className="pl-8"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          type={visible ? "text" : "password"}
          minLength={6}
          onChange={(e) => setPassword(e.target.value)}
        />
        <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            <span onClick={() => setVisible(!visible)} className="cursor-pointer absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
             {!visible ? <EyeSlashIcon /> : <EyeIcon />} 
             </span> 
         <ZodErrors error={state?.zodErrors?.password} />
        </div>
        <Button className="w-full" variant="submit" type="submit">
          Register <ArrowRightIcon className="h-8 w-8 text-gray-50" />
        </Button>
      </form>

      <div className="text-center">
        <Button asChild variant="link">
          <Link href="/login">Already have an account? Sign in</Link>
        </Button>
      </div>
    </div>
    </Fragment>
  )
}

export default RegisterForm