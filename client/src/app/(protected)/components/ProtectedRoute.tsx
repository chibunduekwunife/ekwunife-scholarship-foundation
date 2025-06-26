"use client"

import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import api from "@/lib/api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "@/lib/constants";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });

      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      toast(error instanceof Error ? error.message : String(error));
      setIsAuthorized(false);
    }
  };

  const auth = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000; //date in seconds

    if (tokenExpiration && tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  }, [setIsAuthorized]);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, [auth]);

  useEffect(() => {
    if (isAuthorized === false) {
      router.push("/auth/login");
    }
  }, [isAuthorized, router]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return null; // or a loading spinner, etc.
  }

  return <>{children}</>;
}

export default ProtectedRoute;
