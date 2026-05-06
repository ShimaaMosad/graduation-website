"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

import { MdEmail, MdLock } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";

import { Eye, EyeOff } from "lucide-react";
import { loginSchema, loginSchemaType } from "../../schema/login.schema";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function Login() {
  const form = useForm<loginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema)
  });

  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(values: loginSchemaType) {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: "/"
    });
    if (res?.ok) {
      toast.success("You logged in successfully", { position: "top-center", duration: 3000 });
      window.location.href = "/";
    } else {
      toast.error(res?.error, { position: "top-center", duration: 3000 });
    }
  }

  return (
<div className="w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%] xl:w-[30%] mx-auto mt-10 p-6 md:p-8 bg-white shadow-md rounded-2xl">

      <div className="text-center mb-6">
        <div className="mx-auto w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-3xl">
          ✨
        </div>
        <h1 className="text-3xl font-semibold mt-4">Welcome Back</h1>
        <p className="text-gray-500">Log in to continue to your dashboard</p>
      </div>

      <form onSubmit={form.handleSubmit(handleLogin)} className="flex flex-col gap-4">

        {/* EMAIL */}
        <label className="font-medium text-gray-700">Email Address</label>
        <div className="relative">
          <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Enter your email" 
            className="h-14 pl-12 text-lg"
            {...form.register("email")}
          />
        </div>
        <p className="text-red-500 text-sm">{form.formState.errors.email?.message}</p>

        {/* PASSWORD */}
        <label className="font-medium text-gray-700">Password</label>
        <div className="relative">
          <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="Enter your password" 
            className="h-14 pl-12 pr-10 text-lg"
            {...form.register("password")}
          />
          <button 
            type="button" 
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-5 h-5 text-gray-500"/> : <Eye className="w-5 h-5 text-gray-500"/>}
          </button>
        </div>
        <p className="text-red-500 text-sm">{form.formState.errors.password?.message}</p>

        {/* REMEMBER + FORGOT */}
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <input type="checkbox" />
            <span className="text-gray-600">Remember me</span>
          </div>
          <a href="/forgot-password" className="text-indigo-600 hover:underline">
            Forgot password?
          </a>
        </div>

        {/* LOGIN BUTTON */}
        <Button className="w-full h-14 text-lg bg-gradient-to-r from-indigo-500 to-purple-500 mt-4">
          Log In
        </Button>

        {/* OR DIVIDER */}
        <div className="relative my-6">
          <div className="border-b"></div>
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-gray-500 text-sm">
            Or continue with
          </span>
        </div>

        {/* SOCIAL BUTTONS */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full border p-3 rounded-xl flex items-center gap-3 justify-center text-lg"
        >
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>

        <button
          onClick={() => signIn("linkedin", { callbackUrl: "/" })}
          className="w-full border p-3 rounded-xl flex items-center gap-3 justify-center mt-3 text-lg"
        >
          <FaLinkedin className="text-2xl text-blue-600" />
          Continue with LinkedIn
        </button>

        {/* SIGN UP LINKS */}
        <p className="text-center mt-6 text-gray-700">
          Don’t have an account? <a href="/register" className="text-indigo-600 ml-1">Sign up</a>
        </p>
        <div className="flex justify-center gap-4 mt-2 text-indigo-600">
          <a href="/register?mode=client" className="hover:underline">Join as Client</a>
          <span>|</span>
          <a href="/register?mode=freelancer" className="hover:underline">Join as Freelancer</a>
        </div>

      </form>
    </div>
  );
}
