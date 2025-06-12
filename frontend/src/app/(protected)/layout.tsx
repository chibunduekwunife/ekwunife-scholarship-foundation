
// import ProtectedRoute from "@/components/layout/protected-route";

import Navbar from "@/app/(landing)/components/navbar";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {

    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
}



