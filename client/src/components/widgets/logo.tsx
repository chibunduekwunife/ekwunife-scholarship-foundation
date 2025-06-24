import Image from "next/image";
import Link, { LinkProps } from "next/link";

interface LogoProps {
  width: number;
  height: number;
  href: LinkProps["href"];
}

export default function AppLogo(props: LogoProps) {
  return (
    <Link href={props.href || "/"}>
      <Image
        src="/logo.png"
        alt="app-logo"
        className="cursor-pointer"
        {...props}
      />
    </Link>
  );
}
