import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  width: number;
  height: number;
}

export default function AppLogo(props: LogoProps) {
  return (
    <Link href={"/"}>
      <Image
        src="/logo.png"
        alt="app-logo"
        className="cursor-pointer"
        {...props}
      />
    </Link>
  );
}
