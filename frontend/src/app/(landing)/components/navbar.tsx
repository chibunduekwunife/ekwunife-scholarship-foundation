import Link from "next/link";
import AppLogo from "../../../components/widgets/logo";
import { navLinks } from "@/config/links/nav-links";
import { Button } from "../../../components/ui/button";
import { CustomTrigger } from "./custom-trigger";


export default function Navbar() {
  return (
    <div className="w-full border-b-2 shadow-md">
      <div className="flex max-w-screen-xl mx-auto justify-between items-center py-6 px-[3%]">
        <AppLogo width={150} height={150} />
        <div className="hidden md:flex lg:gap-6">
          {navLinks.map((link) => (
            <Link key={link.id} href={link.href} className="p-2 hover:bg-gray-100 hover:text-secondary rounded-lg transition-colors">
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant={"secondary"}>Login</Button>
          <CustomTrigger />
        </div>
      </div>
    </div>
  );
}
