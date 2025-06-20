import ExistingApplicationSection from "./sections/existing-application-section";
import NewApplicationSection from "./sections/new-application-section";

export default function HomePage() {
  return (
    <div className="flex flex-col my-10">
      <h1 className="text-2xl font-extrabold mb-10 text-primary">
        Welcome back, {"Username"}!
      </h1>
      <div className="w-full border-b-2"></div>
      <NewApplicationSection />
      <div className="w-full border-b-2"></div>
      <ExistingApplicationSection />
    </div>
  );
}
