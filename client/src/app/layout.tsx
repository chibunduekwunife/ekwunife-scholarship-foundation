import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

export const metadata: Metadata = {
  title: "Ekwunife Scholarship",
  description: "Ekwunife Scholarship Foundation 2025",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
