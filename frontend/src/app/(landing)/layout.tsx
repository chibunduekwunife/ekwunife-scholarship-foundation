import Navbar from "@/components/layout/navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NavSidebar from "@/app/(landing)/components/nav-sidebar";
import Footer from "../../components/layout/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <NavSidebar />
      <main className="w-full">
        <Navbar isAuthenticated={false} />
        <div className="max-w-screen-xl mx-auto px-[3%]">{children}</div>
        <Footer />
      </main>
    </SidebarProvider>
  );
}
