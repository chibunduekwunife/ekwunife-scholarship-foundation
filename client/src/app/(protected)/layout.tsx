// import ProtectedRoute from "@/components/layout/protected-route";

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full">
      <Navbar isAuthenticated={true} />
      <div className="w-full bg-primary text-primary-foreground py-10">
        <h1 className="text-2xl md:text-3xl font-semibold max-w-screen-xl mx-auto px-[3%]">
          Ekwunife Scholarship Foundation
        </h1>
      </div>
      <div className="max-w-screen-xl mx-auto px-[3%]">{children}</div>
      <Footer />
    </main>
  );
}
