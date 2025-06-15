"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function ScholarshipsPopover({ handleClick }: { handleClick: () => void }) {

  return (
    <DialogHeader>
        <DialogTitle></DialogTitle>
        <div className="flex flex-col gap-3 my-10 text-center px-10 py-5">
          <h1 className="text-lg font-semibold">Select a Scholarship Program</h1>
          <Button
            variant={"outline"}
            asChild
            onClick={handleClick}
          >
            <Link href={"/scholarships/ssce"}>Secondary School Scholars SSCE</Link>
          </Button>
          <Button
            variant={"outline"}
            asChild
            onClick={handleClick}
          >
            <Link href={"/scholarships/bgus"}>Best Graduating University Students</Link>
          </Button>
        </div>
      </DialogHeader>
  );
}