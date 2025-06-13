"use client";
import { usePathname } from "next/navigation";
import ProtectedRoute from "./ProtectedRoute";

const ConditionalProtectedRoute = ({ children }) => {
  const pathname = usePathname();

  // Don't apply ProtectedRoute to employee auth pages
  const isEmployeeAuthPage = pathname.startsWith("/employee/auth");

  if (isEmployeeAuthPage) {
    return children;
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default ConditionalProtectedRoute;
