"use client";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AppLogo from "@/components/widgets/logo";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constants";

export default function AuthForm({
  isExistingUser,
  route,
}: {
  isExistingUser: boolean;
  route?: string;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // Define separate schemas for login and signup
  const loginSchema = z.object({
    username: z
      .string({ required_error: "Please provide a username" })
      .min(2, "Username must be at least 2 characters long"),
    password: z
      .string({ required_error: "Please provide a password" })
      .min(5, "Password must be at least 5 characters long"),
  });

  const signupSchema = z
    .object({
      email: z
        .string({ required_error: "Please provide a valid email address" })
        .email(),
      username: z
        .string({ required_error: "Please provide a username" })
        .min(2, "Username must be at least 2 characters long"),
      password: z
        .string({ required_error: "Please provide a password" })
        .min(5, "Password must be at least 5 characters long"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  // Pick the correct schema
  const formSchema = isExistingUser ? loginSchema : signupSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isExistingUser
      ? { username: "", password: "" }
      : { username: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("onSubmit called");
    setLoading(true);

    if (!route) {
      toast("Route is not defined.");
      setLoading(false);
      return;
    }

    try {
      let res;
      if (isExistingUser) {
        const { username, password } = values;
        res = await api.post(route, { username, password });
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        router.push("/home");
      } else if ("email" in values) {
        const { username, email, password } = values;
        res = await api.post(route, { username, email, password });
        router.push("/auth/login");
      }
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
      ) {
        const data = (error.response as { data?: Record<string, string | string[]> }).data;
        if (typeof data === "string") {
          toast(data);
        } else if (typeof data === "object" && data !== null) {
          const messages = Object.values(data as Record<string, string | string[]>).flat().join(" ");
          toast(messages);
        } else {
          toast("An unknown error occurred.");
        }
      } else if (
        typeof error === "object" &&
        error &&
        "message" in error &&
        typeof (error as { message: unknown }).message === "string"
      ) {
        toast((error as { message: string }).message);
      } else {
        toast(String(error));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <Card className="w-sm">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-center">
              <AppLogo href={"/"} width={150} height={150} />
            </div>
          </CardTitle>
          <CardDescription>
            <div className="flex justify-center">
              {isExistingUser
                ? "Enter your login credentials to start session"
                : "Create new account to start application"}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isExistingUser && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isExistingUser && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (isExistingUser ? "Logging in..." : "Signing up...") : isExistingUser ? "Login" : "Sign up"}
              </Button>
              {isExistingUser ? (
                <div className="flex flex-col w-full items-center text-center">
                  <p>
                    Don&apos;t have a DAAD-ID yet?
                    <Button
                      variant={"link"}
                      className="text-primary p-2"
                      onClick={() => router.push("/auth/signup")}
                    >
                      New Applicant
                    </Button>
                  </p>
                  <p>
                    Forgotten Password?
                    <Button
                      variant={"link"}
                      className="text-primary p-2"
                      onClick={() => router.push("#")}
                    >
                      Set New Password
                    </Button>
                  </p>
                </div>
              ) : (
                <div className="w-full text-center">
                  <p className="">
                    Already an existing Applicant?
                    <Button
                      variant={"link"}
                      className="text-primary p-2"
                      onClick={() => router.push("/auth/login")}
                    >
                      Login
                    </Button>
                  </p>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
