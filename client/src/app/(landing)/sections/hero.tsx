import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="flex items-center gap-10 mt-15">
      <div className="flex flex-col items-center text-center md:items-start md:text-start gap-y-3 w-[100%] md:w-[45%]">
        <h1 className="text-4xl md:text-5xl font-extrabold">Rewarding Excellence. Empowering Futures</h1>
        <p className="font-semibold text-lg">
          Celebrating the legacy of Christopher Ekwunife by nurturing future leaders through academic excellence.
        </p>
        <Button className="mt-5 w-[250px] md:w-[150px]">Apply Here</Button>
      </div>
      <div className="hidden md:flex w-[55%] justify-end">
        {/* Full illustration shown (no cropping) at maximum safe size */}
        <div className="relative w-full max-w-[700px] xl:max-w-[760px] flex justify-center">
          <Image
            src="/people3.svg"
            alt="Scholars"
            width={760}
            height={760}
            priority
            className="w-full h-auto object-contain select-none pointer-events-none"
            sizes="(min-width: 1280px) 760px, (min-width: 1024px) 700px, 60vw"
          />
        </div>
      </div>
    </div>
  );
}
