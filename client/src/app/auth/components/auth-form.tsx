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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function AuthForm({
  isExistingUser,
}: {
  isExistingUser: boolean;
}) {
  const router = useRouter();

  const formSchema = z
    .object({
      email: z
        .string({
          required_error: "Please provide a valid email address",
        })
        .email(),
      username: z
        .string({
          required_error: "Please provide a username",
        })
        .min(2, "Username must be at least 2 characters long"),
      password: z
        .string({
          required_error: "Please provide a password",
        })
        .min(8, "Password must be at least 8 characters long"),
      confirmPassword: z.string().optional(),
    })
    .refine(
      (data) => !isExistingUser || data.password === data.confirmPassword,
      {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <Card className="w-sm">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-center">
              <AppLogo width={150} height={150} />
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
              <Button type="submit" className="w-full">
                {isExistingUser ? "Login" : "Sign up"}
              </Button>
              {isExistingUser ? (
                <div className="flex flex-col w-full items-center text-center">
                  <p>
                    Don't have a DAAD-ID yet?
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
