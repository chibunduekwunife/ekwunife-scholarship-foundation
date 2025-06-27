import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="flex items-center gap-10 mt-15">
      <div className="flex flex-col items-center text-center md:items-start md:text-start gap-y-3 w-[100%] md:w-[45%]">
        <h1 className="text-4xl md:text-5xl font-extrabold">Rewarding Excellence. Empowering Futures</h1>
        <p className="font-semibold text-lg">
          Celebrating the legacy of Christopher Ekwunife and Cyprian
          Okafor Agu by nurturing future leaders through academic excellence.
        </p>
        <Button className="mt-5 w-[250px] md:w-[150px]">Apply Here</Button>
      </div>
      <div className="hidden md:flex w-[55%] justify-end ">
        <div className="relative flex items-center">
            <Image 
            width={350}
            height={350}
            alt="businessman 1"
            src="/man1.png"
            className="z-10" 
        />
        <Image 
            width={357}
            height={357}
            alt="businessman 2"
            src="/man2.png" 
            className="-ml-30 z-20"
        />
        </div>
      </div>
    </div>
  );
}
