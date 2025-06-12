import Navbar from "@/app/(landing)/components/navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NavSidebar from "@/app/(landing)/components/nav-sidebar";
import Footer from "./components/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <NavSidebar />
      <main className="w-full">
        <Navbar />
        <div className="max-w-screen-xl mx-auto px-[3%]">{children}</div>
        <Footer />
      </main>
    </SidebarProvider>
  );
}
