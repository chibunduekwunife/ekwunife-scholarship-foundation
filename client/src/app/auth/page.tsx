"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import AppLogo from "@/components/widgets/logo";
import { ArrowLeftSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col h-screen items-center justify-center gap-5">
      <AppLogo href={"/"} width={150} height={150} />
      <Card className="w-[80%] md:w-[30%] h-[40%]">
        <CardContent className="h-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 w-full px-4">
            <Button
              className="w-full"
              onClick={() => router.push("/auth/signup")}
            >
              New Applicant
            </Button>
            <Button
              variant={"outline"}
              className="w-full"
              onClick={() => router.push("/auth/login")}
            >
              Existing Applicant
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant={"ghost"}
            className="flex items-center gap-1 text-gray-500 w-full"
            onClick={() => router.back()}
          >
            <ArrowLeftSquare />
            Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
