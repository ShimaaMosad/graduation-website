"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChangePasswordForm {
  currentPassword: string;
  password: string;
  rePassword: string;
}

export default function ChangePasswordPage() {
  const form = useForm<ChangePasswordForm>({
    defaultValues: { currentPassword: "", password: "", rePassword: "" },
  });

  const handleChangePassword: SubmitHandler<ChangePasswordForm> = async (data) => {
    if (data.password !== data.rePassword) return toast.error("Passwords do not match",{position:"top-center",duration:3000});

    try {
      const res = await fetch("/api/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          password: data.password,
          rePassword: data.rePassword,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to change password");
      toast.success("Password updated successfully!",{position:"top-center",duration:3000});
      form.reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to change password";
      toast.error(message,{position:"top-center",duration:3000});
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-3xl">
            🔒
          </div>
          <h1 className="text-2xl font-semibold mt-4">Change Password</h1>
          <p className="text-gray-500 text-sm">Update your account password securely</p>
        </div>

        <form onSubmit={form.handleSubmit(handleChangePassword)} className="flex flex-col gap-4">
          <Input
            type="password"
            placeholder="Current Password"
            {...form.register("currentPassword", { required: true })}
            className="h-12 text-lg rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <Input
            type="password"
            placeholder="New Password"
            {...form.register("password", { required: true, minLength: 6 })}
            className="h-12 text-lg rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            {...form.register("rePassword", { required: true, minLength: 6 })}
            className="h-12 text-lg rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <Button
            type="submit"
            className="h-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg rounded-xl hover:opacity-90"
          >
            Update Password
          </Button>
        </form>

        <div className="text-center mt-4 text-gray-600 text-sm">
          <a href="/login" className="text-indigo-600 hover:underline">Back to Login</a>
        </div>
      </div>
    </div>
  );
}
