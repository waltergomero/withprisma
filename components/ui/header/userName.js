'use client';
 
import { useSession, SessionProvider } from 'next-auth/react';
 
const UserName = () => {
  const session = useSession();

  console.log("user session: ", session)
  return (
    <SessionProvider>
      <p>Welcome {session?.data?.user.name}</p>
    </SessionProvider>
  )
}

export default UserName;