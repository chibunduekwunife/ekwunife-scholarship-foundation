import Image from "next/image";
import { aboutPageParagraphs, missionVision } from "@/app/(landing)/data/about-page";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center pt-5 pb-25">
      <div className="w-full">
        <h1 className="text-3xl md:text-4xl text-primary font-bold py-12 text-center md:text-start">
          About us
        </h1>
      </div>
      <Image
        width={1000}
        height={1000}
        src={"/about-page-img.jpg"}
        alt="graduates"
        className="w-full h-64 md:h-130 object-cover"
      />
      <div className="flex flex-col gap-8 my-15 md:my-20 md:text-lg">
        {aboutPageParagraphs.map((par) => (
          <p key={par.id}>{par.text}</p>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {missionVision.map((mv) => (
          <div key={mv.id} className="text-center border-2 py-10">
            <h2 className="text-2xl md:text-3xl">{mv.title}</h2>
            <p className="md:text-lg w-[80%] mx-auto">{mv.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
