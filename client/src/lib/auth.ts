"use client";

export function logout(){
    localStorage.clear()
}


import api from "./api";
import { ACCESS_TOKEN } from "./constants";
import { toast } from "sonner";

export interface UserInfo {
  username: string;
  email: string;
  // Add other fields as needed
}

export async function fetchUserInfo(): Promise<UserInfo | null> {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (!token) return null;
  try {
    const res = await api.get("/api/user/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Return all user data from the API response
    return res.data as UserInfo;
  } catch (error: any) {
    let message = "Uh oh! Something went wrong.";
    if (error.response) {
      message = error.response.data?.detail || error.response.data?.message || error.response.statusText || message;
    } else if (error.request) {
      message = "No response from server. Please check your connection.";
    } else if (error.message) {
      message = error.message;
    }
    toast(message, {
      description: String(error),
    });
    return null;
  }
}