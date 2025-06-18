import Navbar from "@/components/layout/navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NavSidebar from "@/app/(landing)/components/nav-sidebar";
import Footer from "../../components/layout/footer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <NavSidebar />
      <main className="flex flex-col min-h-screen w-full">
        <Navbar isAuthenticated={false} />
        <div className="flex-1 max-w-screen-xl mx-auto px-[3%]">{children}</div>
        <Footer />
      </main>
    </SidebarProvider>
  );
}
