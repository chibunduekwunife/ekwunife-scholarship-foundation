"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AppLogo from "../widgets/logo";
import { navLinks } from "@/app/(landing)/components/landing-nav-links";
import { Button } from "../ui/button";
import { CustomTrigger } from "../../app/(landing)/components/custom-trigger";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ScholarshipsPopover from "../../app/(landing)/components/scholarships-popover";
import { logout } from "@/lib/auth";

export default function Navbar({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setOpen(false);
  };

  return (
    <div className="w-full border-b-2 shadow-md">
      <div className="flex max-w-screen-xl mx-auto justify-between items-center py-6 px-[3%]">
        {!isAuthenticated ? (
          <AppLogo href={"/"} width={150} height={150} />
        ) : (
          <AppLogo href={"/home"} width={150} height={150} />
        )}

        {!isAuthenticated && (
          <div className="hidden md:flex lg:gap-6">
            {navLinks.map((link) => {
              const styleClass =
                "p-2 hover:bg-gray-100 hover:text-secondary rounded-lg transition-colors";
              if (link.name == "Scholarships") {
                return (
                  <Dialog key={link.id} open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Link href={"#"} className={styleClass}>
                        {link.name}
                      </Link>
                    </DialogTrigger>
                    <DialogContent>
                      <ScholarshipsPopover handleClick={handleClick} />
                    </DialogContent>
                  </Dialog>
                );
              } else {
                return (
                  <Link key={link.id} href={link.href} className={styleClass}>
                    {link.name}
                  </Link>
                );
              }
            })}
          </div>
        )}
        <div>
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button
                variant={"secondary"}
                size={"sm"}
                onClick={() => router.push("/auth")}
              >
                Login
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => router.push("/admin/login")}
                className="border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Admin?
              </Button>
              <CustomTrigger />
            </div>
          ) : (
            <Button
              variant={"secondary"}
              onClick={() => {
                logout();
                router.replace("/auth/login");
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
