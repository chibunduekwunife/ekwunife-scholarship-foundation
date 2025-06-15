"use client"

import Link from "next/link";
import { useState } from "react";
import AppLogo from "../../../components/widgets/logo";
import { navLinks } from "@/config/links/nav-links";
import { Button } from "../../../components/ui/button";
import { CustomTrigger } from "./custom-trigger";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import ScholarshipsPopover from "../(pages)/components/scholarships-popover";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(false)
  }

  return (
    <div className="w-full border-b-2 shadow-md">
      <div className="flex max-w-screen-xl mx-auto justify-between items-center py-6 px-[3%]">
        <AppLogo width={150} height={150} />
        <div className="hidden md:flex lg:gap-6">

          {navLinks.map((link) => {

            const styleClass = "p-2 hover:bg-gray-100 hover:text-secondary rounded-lg transition-colors"
            if (link.name == "Scholarships"){
              return (
                <Dialog
                  key={link.id}
                  open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Link href={'#'} className={styleClass}>{link.name}</Link>
                  </DialogTrigger>
                  <DialogContent>
                    <ScholarshipsPopover handleClick={handleClick} />
                  </DialogContent>
                </Dialog>
              )
            }
            else {
              return (
              <Link
                key={link.id}
                href={link.href}
                className={styleClass}
              >
                {link.name}
              </Link>
            );
            }
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button variant={"secondary"}>Login</Button>
          <CustomTrigger />
        </div>
      </div>
    </div>
  );
}
