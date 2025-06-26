import { info_cards } from "@/app/(landing)/data/info-section-cards";
import Image from "next/image";

export default function InfoSection() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 mt-10 md:mt-0 py-15 px-5">
      <div className="flex flex-col text-center gap-5 md:gap-7">
        <h1 className="text-2xl md:text-3xl font-semibold">
          Gather all necessary information.
        </h1>
        <p className="max-w-[80%] md:max-w-[50%] mx-auto">
          Applying for the Ekwunife scholarship foundation is both competitive
          and demanding. To maximize your chances of success, it&apos;s important to
          conduct thorough research. We&apos;ve gathered the key information you need
          right here.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-10">
        {info_cards.map((card) => (
          <div key={card.id} className="flex flex-col justify-center items-center mt-7">
            <Image 
                alt={card.title} 
                src={card.src} 
                width={300} 
                height={300}
                className="rounded-2xl object-cover h-[200px]"
            />
            <div className="flex flex-col gap-2 mt-7 text-center">
                <h2 className="text-lg font-semibold">{card.title}</h2>
                <p className="text-sm max-w-[80%] mx-auto">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
