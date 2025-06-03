/**
 * Retention Overview Component
 * Displays key metrics and summary cards for employee retention
 */
"use client";

import { useMemo } from "react";
import {
  formatPercentage,
  formatNumber,
  calculateTrend,
  groupEmployeesByRisk,
} from "../../lib/employee-retention-utils";
import { ArrowUpNarrowWide, ChartBar, TriangleAlert } from "lucide-react";

export default function RetentionOverview({
  predictions = [],
  analytics = null,
}) {
  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    if (!predictions.length || !analytics) return null;

    const riskGroups = groupEmployeesByRisk(predictions);
    const totalEmployees = predictions.length;

    const metrics = {
      totalEmployees,
      highRisk: (riskGroups.High || []).length,
      mediumRisk: (riskGroups.Medium || []).length,
      lowRisk: (riskGroups.Low || []).length,
      currentRetention: analytics.retentionTrends?.current || 0,
      previousRetention: analytics.retentionTrends?.previousMonth || 0,
      estimatedTurnover:
        analytics.predictionsSummary?.estimatedTurnover?.next30Days || 0,
    };

    // Calculate trends
    metrics.retentionTrend = calculateTrend(
      metrics.currentRetention,
      metrics.previousRetention
    );

    return metrics;
  }, [predictions, analytics]);

  if (!summaryMetrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const metricCards = [
    {
      title: "Current Retention Rate",
      value: formatPercentage(summaryMetrics.currentRetention),
      change: summaryMetrics.retentionTrend.percentChange,
      isPositive: summaryMetrics.retentionTrend.isPositive,
      icon: "📈",
      color: "blue",
      subtitle: `${
        summaryMetrics.retentionTrend.isPositive ? "+" : "-"
      }${summaryMetrics.retentionTrend.percentChange.toFixed(
        1
      )}% from last month`,
    },
    {
      title: "High Risk Employees",
      value: summaryMetrics.highRisk,
      total: summaryMetrics.totalEmployees,
      percentage: (
        (summaryMetrics.highRisk / summaryMetrics.totalEmployees) *
        100
      ).toFixed(1),
      icon: "⚠️",
      color: "red",
      subtitle: `${(
        (summaryMetrics.highRisk / summaryMetrics.totalEmployees) *
        100
      ).toFixed(1)}% of total workforce`,
    },
    {
      title: "Medium Risk Employees",
      value: summaryMetrics.mediumRisk,
      total: summaryMetrics.totalEmployees,
      percentage: (
        (summaryMetrics.mediumRisk / summaryMetrics.totalEmployees) *
        100
      ).toFixed(1),
      icon: "⚡",
      color: "yellow",
      subtitle: `${(
        (summaryMetrics.mediumRisk / summaryMetrics.totalEmployees) *
        100
      ).toFixed(1)}% of total workforce`,
    },
    {
      title: "Predicted Turnover (30d)",
      value: summaryMetrics.estimatedTurnover,
      icon: "🎯",
      color: "purple",
      subtitle: "AI-predicted departures next month",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-600">
                {card.title}
              </div>
              <div className="text-2xl">{card.icon}</div>
            </div>

            <div className="mb-2">
              <div className="text-3xl font-bold text-gray-900">
                {typeof card.value === "string"
                  ? card.value
                  : formatNumber(card.value)}
              </div>
              {card.total && (
                <div className="text-sm text-gray-500">
                  of {formatNumber(card.total)} total
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600">{card.subtitle}</div>
          </div>
        ))}
      </div>

      {/* Risk Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="mr-2"><TriangleAlert/></span>
            Risk Distribution
          </h3>

          <div className="space-y-4">
            {[
              {
                label: "Low Risk",
                count: summaryMetrics.lowRisk,
                color: "bg-green-500",
                bgColor: "bg-green-50",
                textColor: "text-green-700",
              },
              {
                label: "Medium Risk",
                count: summaryMetrics.mediumRisk,
                color: "bg-yellow-500",
                bgColor: "bg-yellow-50",
                textColor: "text-yellow-700",
              },
              {
                label: "High Risk",
                count: summaryMetrics.highRisk,
                color: "bg-red-500",
                bgColor: "bg-red-50",
                textColor: "text-red-700",
              },
            ].map((item) => {
              const percentage =
                (item.count / summaryMetrics.totalEmployees) * 100;
              return (
                <div
                  key={item.label}
                  className={`${item.bgColor} rounded-lg p-4`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${item.textColor}`}>
                      {item.label}
                    </span>
                    <span className={`text-sm ${item.textColor}`}>
                      {item.count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-2xl font-semibold  mb-4 flex items-center">
            <div className="px-2"><ChartBar/></div>
            Quick Statistics
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 ">
              <span className="text-gray-600">Total Employees</span>
              <span className="font-semibold text-gray-900">
                {formatNumber(summaryMetrics.totalEmployees)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 ">
              <span className="text-gray-600">Retention Rate (YTD)</span>
              <span className="font-semibold text-gray-900">
                {formatPercentage(analytics?.retentionTrends?.yearToDate || 0)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 ">
              <span className="text-gray-600">Avg. Job Satisfaction</span>
              <span className="font-semibold text-gray-900">
                {(
                  predictions.reduce(
                    (sum, emp) => sum + (emp.jobSatisfaction || 0),
                    0
                  ) / predictions.length
                ).toFixed(1)}
                /10
              </span>
            </div>

            <div className="flex justify-between items-center py-2 ">
              <span className="text-gray-600">Predicted 6-Month Turnover</span>
              <span className="font-semibold text-gray-900">
                {analytics?.predictionsSummary?.estimatedTurnover
                  ?.next6Months || 0}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Most At-Risk Department</span>
              <span className="font-semibold text-gray-900">
                {analytics?.departmentAnalytics?.sort(
                  (a, b) =>
                    b.highRisk / b.totalEmployees -
                    a.highRisk / a.totalEmployees
                )[0]?.department || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trends */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-2xl font-semibold mb-4 flex items-center">
          <span className="mr-2"><ArrowUpNarrowWide/></span>
          Retention Trends (Last 6 Months)
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(analytics?.monthlyTrends || []).slice(-6).map((trend, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">{trend.month}</div>
              <div className="text-lg font-semibold text-gray-900">
                {formatPercentage(trend.retentionRate)}
              </div>
              <div className="text-xs text-gray-500">
                {trend.turnoverCount} departures
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
