import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
export default function RootLayout({ children }) {
  return (
    <>
        <div className="relative z-0 hidden w-full font-inter lg:flex">
          <Sidebar />
          <div className="relative h-screen w-full overflow-y-scroll bg-main ">
              <Navbar />
              <div className=" bg-gray-50 h-screen">{children}</div>
          </div>
        </div>
        <div className="flex h-[100svh] w-full items-center justify-center bg-white text-black lg:hidden">
          Please Open the site in laptop or desktop
        </div>
    </>
  );
}
