import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ApplyButton() {
  //use router to push to specific protected route or go to log in page if not authenticated
  return (
    <div className="flex flex-col w-full items-center md:items-start">
      <Button className="w-full h-10 md:w-45" variant={"secondary"}>
        Apply Now
      </Button>
    </div>
  );
}
