"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import ClientForm from "./components/ClientForm";
import FreelancerForm from "./components/FreelancerForm";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode"); // "client" أو "freelancer"
  const [mode, setMode] = useState<"client" | "freelancer">(modeParam === "freelancer" ? "freelancer" : "client");

  useEffect(() => {
    if (modeParam === "freelancer") setMode("freelancer");
    if (modeParam === "client") setMode("client");
  }, [modeParam]);

  return (
    <div className="
      w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] 
      min-h-screen flex flex-col mx-auto mt-6 p-6 sm:p-10 md:p-12 
      bg-white shadow-lg rounded-2xl
    ">

      {/* SUB HEADER */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-2 mb-6">
        <p className="text-gray-600 text-sm text-center sm:text-left">Already have an account?</p>
        <a href="/login" className="text-indigo-600 font-semibold hover:underline text-center sm:text-left">Login</a>
      </div>

      {/* Toggle Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <Button
          onClick={() => setMode("client")}
          className={`flex-1 h-14 text-lg font-semibold rounded-xl
            ${mode === "client"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            }`}
        >
          I'm a Client
        </Button>

        <Button
          onClick={() => setMode("freelancer")}
          className={`flex-1 h-14 text-lg font-semibold rounded-xl
            ${mode === "freelancer"
              ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            }`}
        >
          I'm a Freelancer
        </Button>
      </div>

      {/* CONDITIONAL UI */}
      <div className="flex-1">
        {mode === "client" && <ClientForm />}
        {mode === "freelancer" && <FreelancerForm />}
      </div>
    </div>
  );
}
