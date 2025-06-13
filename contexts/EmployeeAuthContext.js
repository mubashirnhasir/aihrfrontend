"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EmployeeAuthContext = createContext();

export const EmployeeAuthProvider = ({ children }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if employee is logged in on app start
    const checkAuth = () => {
      const token = localStorage.getItem("employeeToken");
      const employeeData = localStorage.getItem("employeeData");

      if (token && employeeData) {
        try {
          const parsedEmployee = JSON.parse(employeeData);
          setEmployee(parsedEmployee);
        } catch (error) {
          console.error("Error parsing employee data:", error);
          localStorage.removeItem("employeeToken");
          localStorage.removeItem("employeeData");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (employeeId, password) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/employee/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeId, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store employee token and data
        localStorage.setItem("employeeToken", data.token);
        localStorage.setItem("employeeData", JSON.stringify(data.employee));

        setEmployee(data.employee);

        // Redirect based on first login status
        if (data.employee.isFirstLogin) {
          router.push("/employee/onboarding");
        } else {
          router.push("/employee/dashboard");
        }

        return { success: true, employee: data.employee };
      } else {
        return { success: false, error: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem("employeeToken");
    localStorage.removeItem("employeeData");
    setEmployee(null);
    router.push("/employee/auth/signin");
  };

  const isAuthenticated = () => {
    return employee !== null;
  };

  const value = {
    employee,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return (
    <EmployeeAuthContext.Provider value={value}>
      {children}
    </EmployeeAuthContext.Provider>
  );
};

export const useEmployeeAuth = () => {
  const context = useContext(EmployeeAuthContext);
  if (!context) {
    throw new Error(
      "useEmployeeAuth must be used within an EmployeeAuthProvider"
    );
  }
  return context;
};
