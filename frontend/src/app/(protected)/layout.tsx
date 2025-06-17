// import ProtectedRoute from "@/components/layout/protected-route";


import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full">
      <Navbar isAuthenticated={true}/>
      <div className="max-w-screen-xl mx-auto px-[3%]">{children}</div>
      <Footer />
    </main>
  );
}
