import Link from "next/link";
import { footerLinks } from "@/config/links/footer-links";

export default function Footer() {
  return (
    <div className="bg-primary text-white">
      <div className="flex flex-col md:flex-row gap-10 max-w-screen-xl mx-auto justify-between items-center py-15 px-[3%]">
        <div className="text-center md:text-start">
          <span>&copy; Crown copyright 2025</span>
          <p>
            Ekwunife Foundation scholarship are supported by the Foreign,
            Nigeria and Office (FCDO) and partner organizations.
          </p>
        </div>
        <div className="flex gap-5">
          {footerLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.id} href={link.href}>
                <Icon size={30} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
