import Link from "next/link";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/register-form";

const RegisterPage = async () => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className=" w-96 max-w-md bg-white p-8 rounded-lg shadow-md">
      <RegisterForm/>
    </div>
    </main>
      );
};

export default RegisterPage;