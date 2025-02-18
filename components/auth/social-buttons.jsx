'use client';

import React from 'react';
import { useEffect } from 'react'
import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa";
import { toast } from 'react-toastify';
import { signIn, signOut} from "next-auth/react";
import {doSocialLogin} from '@/actions/user-actions';


const SocialButtons = () => {

  useEffect(() => {
    const handleSignOut = async () => {
      await signOut({ redirect: false });
    };
    handleSignOut();
  }, []);
  
  const handleClick = async (event, provider) => {
    event.preventDefault();

    try {
       await signIn(provider, { redirectTo: "/admin" });
        
     } catch (error) {
      toast.error("Authentication error: " + error.message);
     }
   };


  return (
    <form onSubmit={handleClick} >
    <div className='flex items-center justify-center w-full gap-x-4'>
      <button type='submit' 
      className='flex w-full justify-center rounded p-1 text-sm text-black border' 
      onClick={(event) => handleClick(event, 'google')}>
        <FcGoogle className='w-6 h-6 mr-2'/> Google
      </button>
      <button  type='submit' 
      className='flex w-full justify-center rounded  p-1 text-sm text-black border' 
       onClick={(event) => handleClick(event, 'github')}>
        <FaGithub className='w-6 h-6 mr-2'/> Github
      </button>
    </div>
    </form>
  )
}

export default SocialButtons;
