"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

// Sample admin credentials
const ADMIN_CREDENTIALS = {
  email: "admin@synapthr.com",
  password: "admin123",
  username: "Admin User",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user_data");
      const employeeToken = localStorage.getItem("employeeToken");
      const employeeData = localStorage.getItem("employeeData");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_data");
        }
      } else if (employeeToken && employeeData) {
        try {
          const parsedEmployee = JSON.parse(employeeData);
          setUser({
            email: parsedEmployee.email,
            username: parsedEmployee.name || parsedEmployee.employeeId,
            role: "employee",
            id: parsedEmployee._id || parsedEmployee.employeeId,
            ...parsedEmployee,
          });
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

  const login = async (email, password) => {
    try {
      // Check credentials against sample admin
      if (
        email === ADMIN_CREDENTIALS.email &&
        password === ADMIN_CREDENTIALS.password
      ) {
        const userData = {
          email: ADMIN_CREDENTIALS.email,
          username: ADMIN_CREDENTIALS.username,
          role: "admin",
          id: "1",
        };

        // Store in localStorage
        localStorage.setItem("auth_token", "admin-token-placeholder"); // Using placeholder token
        localStorage.setItem("user_data", JSON.stringify(userData));
        setUser(userData);

        // Redirect based on role
        if (userData.role === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/employee/dashboard");
        }

        return { success: true, user: userData };
      } else {
        return { success: false, error: "Invalid email or password" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed. Please try again." };
    }
  };
  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("employeeToken");
    localStorage.removeItem("employeeData");
    setUser(null);
    router.push("/employee/auth/signin");
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
