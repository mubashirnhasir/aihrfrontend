/**
 * Department Analytics Component
 * Detailed analytics for each department
 */
"use client";

import { useState, useMemo } from "react";
import {
  formatPercentage,
  formatNumber,
  getRiskLevelColor,
  calculateDepartmentStats,
} from "../../lib/employee-retention-utils";

export default function DepartmentAnalytics({
  departmentData = [],
  employees = [],
}) {
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Calculate comprehensive department statistics
  const departmentStats = useMemo(() => {
    if (!employees.length) return departmentData;

    // Use utility function to calculate stats from employee data
    const calculatedStats = calculateDepartmentStats(employees);

    // Merge with provided department data if available
    return calculatedStats.map((dept) => {
      const existingData = departmentData.find(
        (d) => d.department === dept.department
      );
      return {
        ...dept,
        retentionRate:
          existingData?.retentionRate ||
          ((dept.totalEmployees - dept.highRisk) / dept.totalEmployees) * 100,
        ...existingData,
      };
    });
  }, [departmentData, employees]);

  // Get employees for selected department
  const selectedDeptEmployees = useMemo(() => {
    if (!selectedDepartment) return [];
    return employees.filter((emp) => emp.department === selectedDepartment);
  }, [selectedDepartment, employees]);

  if (!departmentStats.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200  p-6">
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No department data available</div>
          <div className="text-sm text-gray-400">
            Employee data is needed to generate department analytics
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Department Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departmentStats.map((dept, index) => {
          const riskPercentage =
            ((dept.highRisk + dept.mediumRisk) / dept.totalEmployees) * 100;
          const isSelected = selectedDepartment === dept.department;

          return (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-sm border border-gray-200  p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected ? "ring-2 ring-blue-500 border border-gray-200 -blue-200" : ""
              }`}
              onClick={() => setSelectedDepartment(dept.department)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {dept.department}
                </h3>
                <div className="text-2xl">
                  {dept.department === "Engineering"
                    ? "👨‍💻"
                    : dept.department === "Sales"
                    ? "📈"
                    : dept.department === "Marketing"
                    ? "📢"
                    : dept.department === "HR"
                    ? "👥"
                    : dept.department === "Finance"
                    ? "💰"
                    : "🏢"}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Employees</span>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(dept.totalEmployees)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Retention Rate</span>
                  <span className="font-semibold text-gray-900">
                    {formatPercentage(dept.retentionRate || 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Avg. Satisfaction
                  </span>
                  <span className="font-semibold text-gray-900">
                    {dept.avgSatisfaction}/10
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">At Risk</span>
                  <span className="font-semibold text-red-600">
                    {dept.highRisk + dept.mediumRisk} (
                    {riskPercentage.toFixed(1)}%)
                  </span>
                </div>
              </div>

              {/* Risk Distribution Bar */}
              <div className="mt-4">
                <div className="text-xs text-gray-600 mb-1">
                  Risk Distribution
                </div>
                <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500"
                    style={{
                      width: `${(dept.lowRisk / dept.totalEmployees) * 100}%`,
                    }}
                    title={`Low Risk: ${dept.lowRisk}`}
                  ></div>
                  <div
                    className="bg-yellow-500"
                    style={{
                      width: `${
                        (dept.mediumRisk / dept.totalEmployees) * 100
                      }%`,
                    }}
                    title={`Medium Risk: ${dept.mediumRisk}`}
                  ></div>
                  <div
                    className="bg-red-500"
                    style={{
                      width: `${(dept.highRisk / dept.totalEmployees) * 100}%`,
                    }}
                    title={`High Risk: ${dept.highRisk}`}
                  ></div>
                </div>
              </div>

              {/* Action Indicator */}
              {riskPercentage > 30 && (
                <div className="mt-3 flex items-center text-xs text-orange-600">
                  <span className="mr-1">⚠️</span>
                  <span>Requires immediate attention</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed View for Selected Department */}
      {selectedDepartment && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200  p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedDepartment} Department - Detailed Analysis
            </h3>
            <button
              onClick={() => setSelectedDepartment(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employee List */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Employees ({selectedDeptEmployees.length})
              </h4>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedDeptEmployees.map((employee, index) => {
                  const riskColors = getRiskLevelColor(
                    employee.prediction?.riskLevel || "Medium"
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-gray-700">
                            {employee.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {employee.name || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {employee.position}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${riskColors.bg} ${riskColors.text}`}
                        >
                          {employee.prediction?.riskLevel || "Unknown"}
                        </span>
                        <div className="text-xs text-gray-500">
                          {employee.prediction?.riskScore || 0}/100
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Department Insights */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Key Insights & Recommendations
              </h4>

              <div className="space-y-4">
                {/* Average Scores */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 mb-3">
                    Average Satisfaction Scores
                  </h5>
                  <div className="space-y-2">
                    {[
                      {
                        label: "Job Satisfaction",
                        value:
                          selectedDeptEmployees.reduce(
                            (sum, emp) => sum + (emp.jobSatisfaction || 0),
                            0
                          ) / selectedDeptEmployees.length,
                      },
                      {
                        label: "Engagement Level",
                        value:
                          selectedDeptEmployees.reduce(
                            (sum, emp) => sum + (emp.engagementLevel || 0),
                            0
                          ) / selectedDeptEmployees.length,
                      },
                      {
                        label: "Work-Life Balance",
                        value:
                          selectedDeptEmployees.reduce(
                            (sum, emp) => sum + (emp.workLifeBalance || 0),
                            0
                          ) / selectedDeptEmployees.length,
                      },
                      {
                        label: "Career Growth",
                        value:
                          selectedDeptEmployees.reduce(
                            (sum, emp) => sum + (emp.careerGrowth || 0),
                            0
                          ) / selectedDeptEmployees.length,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-blue-800">
                          {item.label}
                        </span>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-blue-900 mr-2">
                            {item.value.toFixed(1)}/10
                          </span>
                          <div className="w-16 bg-blue-200 rounded-full h-1">
                            <div
                              className="bg-blue-600 h-1 rounded-full"
                              style={{ width: `${(item.value / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h5 className="font-medium text-yellow-900 mb-3">
                    Recommendations
                  </h5>
                  <div className="space-y-2">
                    {(() => {
                      const deptData = departmentStats.find(
                        (d) => d.department === selectedDepartment
                      );
                      const riskLevel =
                        ((deptData.highRisk + deptData.mediumRisk) /
                          deptData.totalEmployees) *
                        100;

                      const recommendations = [];

                      if (riskLevel > 40) {
                        recommendations.push(
                          "🚨 Immediate intervention required - conduct stay interviews"
                        );
                      }
                      if (deptData.avgSatisfaction < 6) {
                        recommendations.push(
                          "📈 Focus on improving job satisfaction through better communication"
                        );
                      }
                      if (deptData.highRisk > 0) {
                        recommendations.push(
                          "⭐ Develop retention plans for high-risk employees"
                        );
                      }
                      if (riskLevel > 25) {
                        recommendations.push(
                          "🎯 Review compensation and benefits package"
                        );
                      }

                      return recommendations.map((rec, idx) => (
                        <div key={idx} className="text-sm text-yellow-800">
                          {rec}
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Tenure Distribution */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h5 className="font-medium text-green-900 mb-3">
                    Tenure Analysis
                  </h5>
                  <div className="text-sm text-green-800">
                    <div>
                      Average Tenure:{" "}
                      {(
                        selectedDeptEmployees.reduce(
                          (sum, emp) => sum + (emp.tenure || 0),
                          0
                        ) / selectedDeptEmployees.length
                      ).toFixed(1)}{" "}
                      years
                    </div>
                    <div>
                      New Hires (&lt;1 year):{" "}
                      {
                        selectedDeptEmployees.filter(
                          (emp) => (emp.tenure || 0) < 1
                        ).length
                      }
                    </div>
                    <div>
                      Veterans (&gt;5 years):{" "}
                      {
                        selectedDeptEmployees.filter(
                          (emp) => (emp.tenure || 0) > 5
                        ).length
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200  p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Department Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retention Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  High Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Satisfaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentStats
                .sort(
                  (a, b) =>
                    (b.highRisk + b.mediumRisk) / b.totalEmployees -
                    (a.highRisk + a.mediumRisk) / a.totalEmployees
                )
                .map((dept, index) => {
                  const riskPercentage =
                    ((dept.highRisk + dept.mediumRisk) / dept.totalEmployees) *
                    100;
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dept.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(dept.totalEmployees)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPercentage(dept.retentionRate || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dept.highRisk} (
                        {((dept.highRisk / dept.totalEmployees) * 100).toFixed(
                          1
                        )}
                        %)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dept.avgSatisfaction}/10
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            riskPercentage < 20
                              ? "bg-green-100 text-green-800"
                              : riskPercentage < 35
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {riskPercentage < 20
                            ? "Healthy"
                            : riskPercentage < 35
                            ? "Monitor"
                            : "Critical"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
