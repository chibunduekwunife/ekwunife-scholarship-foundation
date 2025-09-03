"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { adminLoginFallback } from "@/lib/admin-auth";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await adminLoginFallback(credentials.username, credentials.password);
      
      if (result.success) {
        toast.success(result.message);
        // Open Django admin in new tab
        if (result.redirectUrl) {
          window.open(result.redirectUrl, "_blank");
        }
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Authentication service unavailable. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>
              Sign in with your administrator credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter admin username"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in as Admin"}
              </Button>
            </form>
            
            <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                <strong>⚠️ Restricted Access:</strong> This area is for authorized administrators only.
                All access attempts are logged and monitored for security purposes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
