import EmployeeNavbar from "@/components/employee/EmployeeNavbar";
import EmployeeSidebar from "@/components/employee/EmployeeSidebar";

export default function EmployeeLayout({ children }) {
  return (
    <>
      <div className="relative z-0 hidden w-full font-inter lg:flex">
        <EmployeeSidebar />
        <div className="relative h-screen w-full overflow-y-scroll custom-scrollbar bg-main">
          <EmployeeNavbar />
          <div className="">{children}</div>
        </div>
      </div>
      <div className="flex h-[100svh] w-full items-center justify-center bg-white text-black lg:hidden">
        Please open the site on a laptop or desktop
      </div>
    </>
  );
}
