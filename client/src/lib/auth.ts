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
  } catch (error: unknown) {
    let message = "Uh oh! Something went wrong.";
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object"
    ) {
      const errResponse = error.response as { data?: { detail?: string; message?: string }; statusText?: string };
      message = errResponse.data?.detail || errResponse.data?.message || errResponse.statusText || message;
    } else if (
      error &&
      typeof error === "object" &&
      "request" in error
    ) {
      message = "No response from server. Please check your connection.";
    } else if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
    ) {
      message = (error as { message: string }).message;
    }
    toast(message, {
      description: String(error),
    });
    return null;
  }
}