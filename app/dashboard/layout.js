"use client";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import LoadingPage from "@/components/LoadingPage";

export default function RootLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <LoadingPage />;
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  return (
    <>
      <div className="relative z-0 hidden w-full font-inter lg:flex">
        <Sidebar />
        <div className="relative h-screen w-full overflow-y-scroll custom-scrollbar bg-main ">
          <Navbar />
          <div className="">{children}</div>
        </div>
      </div>
      <div className="flex h-[100svh] w-full items-center justify-center bg-white text-black lg:hidden">
        Please Open the site in laptop or desktop
      </div>
    </>
  );
}
