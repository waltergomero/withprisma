// import { auth } from "@/lib/auth";

// import { signIn } from "@/lib/auth";

import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/login-form";

const LoginPage = async () => {
//   const session = await auth();
//   if (session) redirect("/");

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className=" w-96 max-w-md bg-white p-8 rounded-lg shadow-md">
      <LoginForm/>
    </div>
    </main>


      );
};

export default LoginPage;