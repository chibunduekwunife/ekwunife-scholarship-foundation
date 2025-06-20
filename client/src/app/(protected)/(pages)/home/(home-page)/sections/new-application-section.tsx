import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function NewApplicationSection() {
  return (
    <div className="my-15">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            Current Scholarships Available (2)
          </h1>
          <Button variant={"link"} asChild>
            <Link href={"#"}>View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">
                Secondary School Scholars (SSCE)
              </CardTitle>
              <CardDescription>For Secondary School Students</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={"/home/ssce-scholarship"}>Apply Now</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">
                Best Graduating University Students
              </CardTitle>
              <CardDescription>
                For University / College Students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={"#"}>Apply Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
