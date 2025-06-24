"use client";

import AuthForm from "../components/auth-form";
import { useEffect } from "react";
import { logout } from "@/lib/auth";
import Image from "next/image";

export default function SignupPage() {
  useEffect(() => {
    logout(); // clearing local storage on render
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="bg-gradient-to-br from-blue-950 to-primary">
        <AuthForm route="/api/user/signup/" isExistingUser={false} />
      </div>
      <div className="hidden md:flex relative w-full h-screen">
        <Image
          src="/grad-students2.jpg"
          alt="grad-student"
          fill
          className="object-cover object-[75%_center]"
          priority
        />
      </div>
    </div>
  );
}
