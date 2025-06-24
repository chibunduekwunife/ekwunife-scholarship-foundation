import Image from "next/image";
import AuthForm from "../components/auth-form";

export default function LoginPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="bg-gradient-to-br from-blue-950 to-primary">
        <AuthForm route="/api/token/" isExistingUser={true} />
      </div>
      <div className="hidden md:flex relative w-full h-screen">
        <Image
          src="/grad-student.jpg"
          alt="grad-student"
          fill
          className=" object-cover object-center"
          priority
        />
      </div>
    </div>
  );
}
