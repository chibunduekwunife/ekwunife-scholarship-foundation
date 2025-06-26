import HeroSection from "./sections/hero";
import InfoSection from "./sections/info-section";
import ApplicationSection from "./sections/application-section";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <InfoSection />
      <ApplicationSection />
    </div>
  );
}
