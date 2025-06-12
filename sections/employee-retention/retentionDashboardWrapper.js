/**
 * Employee Retention Dashboard Wrapper
 * Main wrapper component for the retention analytics dashboard
 */
"use client";

import { useState, useEffect } from "react";
import RetentionOverview from "./retentionOverview";
import EmployeeRiskTable from "./employeeRiskTable";
import RetentionCharts from "./retentionCharts";
import DepartmentAnalytics from "./departmentAnalytics";
import ActionRecommendations from "./actionRecommendations";
import { RefreshCcwIcon, RefreshCwOffIcon } from "lucide-react";

export default function RetentionDashboardWrapper() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [predictions, setPredictions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * Fetches all dashboard data
   */
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch predictions, analytics, and total employees in parallel
      const [predictionsResponse, analyticsResponse, employeesResponse] =
        await Promise.all([
          fetch("/api/employee-retention/predict"),
          fetch("/api/employee-retention/analytics"),
          fetch("/api/employees"),
        ]);

      if (
        !predictionsResponse.ok ||
        !analyticsResponse.ok ||
        !employeesResponse.ok
      ) {
        throw new Error("Failed to fetch dashboard data");
      }

      const predictionsData = await predictionsResponse.json();
      const analyticsData = await analyticsResponse.json();
      const employeesData = await employeesResponse.json();

      if (!predictionsData.success || !analyticsData.success) {
        throw new Error("API returned error response");
      }

      setPredictions(predictionsData.data);
      setAnalytics(analyticsData.data);

      // Set total employees from database
      if (Array.isArray(employeesData)) {
        setTotalEmployees(employeesData.length);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles tab navigation
   */
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  /**
   * Refreshes dashboard data
   */
  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading retention analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "overview", label: "Overview", icon: "" },
    { key: "employees", label: "Employee Risk", icon: "" },
    { key: "analytics", label: "Analytics", icon: "" },
    { key: "departments", label: "Departments", icon: "" },
    { key: "recommendations", label: "Actions", icon: "" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                AI Employee Retention Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Predictive insights to reduce employee turnover
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>
                  <RefreshCcwIcon />
                </span>
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6">
            <nav className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`px-4 cursor-pointer py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                    activeTab === tab.key
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === "overview" && (
          <RetentionOverview
            predictions={predictions}
            analytics={analytics}
            totalEmployeesFromDB={totalEmployees}
          />
        )}

        {activeTab === "employees" && (
          <EmployeeRiskTable
            employees={predictions}
            onRefresh={handleRefresh}
          />
        )}

        {activeTab === "analytics" && <RetentionCharts analytics={analytics} />}

        {activeTab === "departments" && (
          <DepartmentAnalytics
            departmentData={analytics?.departmentAnalytics || []}
            employees={predictions}
          />
        )}

        {activeTab === "recommendations" && (
          <ActionRecommendations
            recommendations={analytics?.recommendations || []}
            analytics={analytics}
          />
        )}
      </div>
    </div>
  );
}
