import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/login-form";
import ErrorPage from "../../auth/error/page";


const LoginPage = async () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
    <div className=" w-96 max-w-md bg-white p-8 rounded-lg shadow-md">
      <ErrorPage/>
      <LoginForm/>
    </div>
    </main>


      );
};

export default LoginPage;