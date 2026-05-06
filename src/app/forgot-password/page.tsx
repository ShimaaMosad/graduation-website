"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { toast } from "sonner";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

interface EmailForm { email: string }
interface CodeForm { code: string }
interface PasswordForm { password: string; confirmPassword: string }

export default function ForgotPasswordPage() {
  const [stage, setStage] = useState<"email" | "verify" | "reset">("email");
  const [email, setEmail] = useState<string>("");

  const emailForm = useForm<EmailForm>({ defaultValues: { email: "" } });
  const codeForm = useForm<CodeForm>({ defaultValues: { code: "" } });
  const passwordForm = useForm<PasswordForm>({ defaultValues: { password: "", confirmPassword: "" } });

  // ----- Stage Handlers -----
  const handleSendEmail: SubmitHandler<EmailForm> = async (data) => {
    if (!data.email) return toast.error("Email is required",{position:"top-center",duration:3000});
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const result = await res.json();
      if (!res.ok || result.statusMsg === "error") throw new Error(result.message || "Failed to send reset code");
      toast.success("Reset code sent to your email!",{position:"top-center",duration:3000});
      setEmail(data.email);
      setStage("verify");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message,{position:"top-center",duration:3000});
    }
  };

  const handleVerifyCode: SubmitHandler<CodeForm> = async (data) => {
    if (!data.code) return toast.error("Code is required",{position:"top-center",duration:3000});
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetCode: data.code }),
      });
      const result = await res.json();
      if (!res.ok || result.statusMsg === "error") throw new Error(result.message || "Invalid code");
      toast.success("Code verified! Enter new password.",{position:"top-center",duration:3000});
      setStage("reset");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid code";
      toast.error(message,{position:"top-center",duration:3000});
    }
  };

  const handleResetPassword: SubmitHandler<PasswordForm> = async (data) => {
    if (!data.password || !data.confirmPassword) return toast.error("Fill all fields",{position:"top-center",duration:3000});
    if (data.password !== data.confirmPassword) return toast.error("Passwords do not match",{position:"top-center",duration:3000});
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/resetPassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: data.password }),
      });
      const result = await res.json();
      if (!res.ok || result.statusMsg === "error") throw new Error(result.message || "Failed to reset password");
      toast.success("Password reset successfully!");
      window.location.href = "/login";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to reset password";
      toast.error(message,{position:"top-center",duration:3000});
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-3xl">
            ✨
          </div>
          <h1 className="text-2xl font-semibold mt-4">Forgot Password</h1>
          <p className="text-gray-500 text-sm">Follow the steps to reset your password</p>
        </div>

        {stage === "email" && (
          <form onSubmit={emailForm.handleSubmit(handleSendEmail)} className="flex flex-col gap-4">
            <Input
              placeholder="Enter your email"
              {...emailForm.register("email", { required: true })}
              className="h-12 text-lg rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <Button className="h-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg rounded-xl hover:opacity-90">
              Send Reset Code
            </Button>
          </form>
        )}

        {stage === "verify" && (
          <form onSubmit={codeForm.handleSubmit(handleVerifyCode)} className="flex flex-col gap-4">
            <Input
              placeholder="Enter code from email"
              {...codeForm.register("code", { required: true })}
              className="h-12 text-lg rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <Button className="h-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg rounded-xl hover:opacity-90">
              Verify Code
            </Button>
          </form>
        )}

        {stage === "reset" && (
          <form onSubmit={passwordForm.handleSubmit(handleResetPassword)} className="flex flex-col gap-4">
            <Input
              type="password"
              placeholder="Enter new password"
              {...passwordForm.register("password", { required: true, minLength: 6 })}
              className="h-12 text-lg rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              {...passwordForm.register("confirmPassword", { required: true, minLength: 6 })}
              className="h-12 text-lg rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <Button className="h-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg rounded-xl hover:opacity-90">
              Reset Password
            </Button>
          </form>
        )}

        <div className="text-center mt-4 text-gray-600 text-sm">
          <a href="/login" className="text-indigo-600 hover:underline">Back to Login</a>
        </div>
      </div>
    </div>
  );
}
