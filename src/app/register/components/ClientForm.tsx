"use client";

import React, { useState } from "react";
import { FaLinkedin, FaUser } from "react-icons/fa";
import { MdEmail, MdLock, MdUpload } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { registerSchema, registerSchemaType } from "../../../schema/register.scheme";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";

export default function ClientRegisterStyled() {
  const router = useRouter();

  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const form = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: registerSchemaType) => {
     try {
      const response = await axios.post("https://ecommerce.routemisr.com/api/v1/auth/signup", values);

      if (response.data.message === "success") {
        toast.success("you registered successfully",{position:"top-center",duration:3000});
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Registration failed",{position:"top-center",duration:3000});
      } else if (err instanceof Error) {
        toast.error(err.message,{position:"top-center",duration:3000});
      } else {
        toast.error("An unexpected error occurred",{position:"top-center",duration:3000});
      }
      router.push("/login");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-gray-50 p-6 lg:p-12 gap-8">
      <div className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-xl flex flex-col gap-6">
        
        <h2 className="text-2xl font-bold text-gray-800">Create Client Account</h2>
        <p className="text-gray-500">Hire talented freelancers in minutes</p>

        {/* UPLOAD PHOTO */}
        <div className="flex justify-center mb-4">
          <label
            htmlFor="uploadPhoto"
            className="w-28 h-28 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex flex-col justify-center items-center text-white cursor-pointer hover:scale-105 transition"
          >
            {preview ? (
              <img
                src={preview}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <>
                <MdUpload className="text-4xl" />
                <span className="text-sm">Upload Photo</span>
              </>
            )}

            <input
              id="uploadPhoto"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </label>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

          {/* FULL NAME */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-500" />
              <Input
                {...form.register("name")}
                placeholder="Enter your full name"
                className="pl-10 h-12"
              />
            </div>
            <p className="text-red-500 text-sm">
              {form.formState.errors.name?.message}
            </p>
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Email</label>
            <div className="relative">
              <MdEmail className="absolute left-3 top-3 text-gray-500" />
              <Input
                type="email"
                {...form.register("email")}
                placeholder="Enter your email"
                className="pl-10 h-12"
              />
            </div>
            <p className="text-red-500 text-sm">
              {form.formState.errors.email?.message}
            </p>
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Password</label>
            <div className="relative">
              <MdLock className="absolute left-3 top-3 text-gray-500" />
              <Input
                type="password"
                {...form.register("password")}
                placeholder="Enter your password"
                className="pl-10 h-12"
              />
            </div>
            <p className="text-red-500 text-sm">
              {form.formState.errors.password?.message}
            </p>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <MdLock className="absolute left-3 top-3 text-gray-500" />
              <Input
                type="password"
                {...form.register("rePassword")}
                placeholder="Re-enter your password"
                className="pl-10 h-12"
              />
            </div>
            <p className="text-red-500 text-sm">
              {form.formState.errors.rePassword?.message}
            </p>
          </div>

          {/* PHONE */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Phone</label>
            <Input
              type="tel"
              {...form.register("phone")}
              placeholder="Enter your phone number"
              className="h-12"
            />
            <p className="text-red-500 text-sm">
              {form.formState.errors.phone?.message}
            </p>
          </div>

          {/* SUBMIT */}
          <Button className="h-12 text-lg bg-gradient-to-r from-indigo-500 to-purple-500 w-full">
            Create Account
          </Button>
        </form>
{/* Divider & Social Login */}
 <div className="relative my-6"> 
  <div className="border-b">
    </div>
     <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-gray-500 text-sm">
     Or sign up with</span> 
     </div> 
     <button onClick={() => signIn("google", { callbackUrl: "/" })} 
     className="w-full border p-3 rounded-xl flex items-center gap-3 justify-center text-lg">
       <FcGoogle className="text-2xl" />
        Continue with Google </button> 
        <button onClick={() => signIn("linkedin", { callbackUrl: "/" })} 
        className="w-full border p-3 rounded-xl flex items-center gap-3 justify-center mt-3 text-lg">
           <FaLinkedin className="text-2xl text-blue-600" />
            Continue with LinkedIn </button>
             </div>

                                    
      {/* RIGHT SIDE INFO */}
      <div className="lg:w-1/3 w-full bg-white p-6 flex flex-col gap-6 rounded-2xl shadow-lg">
        <img src="/images/registerclient.jpeg" alt="team" className="rounded-xl shadow-md w-full" />
        <h2 className="text-xl font-bold text-gray-800">Find your perfect team</h2>
        <div className="flex flex-col gap-4 text-gray-700 text-sm">
          <div className="flex items-center gap-3"><span className="text-green-600 text-xl">✔</span> Access 50,000+ verified professionals</div>
          <div className="flex items-center gap-3"><span className="text-green-600 text-xl">✔</span>Post unlimited job opportunities</div>
          <div className="flex items-center gap-3"><span className="text-green-600 text-xl">✔</span>Secure escrow payments</div>
          <div className="flex items-center gap-3"><span className="text-green-600 text-xl">✔</span>AI-matched recommendations</div>
        </div>
      </div>
    </div>
  );
}