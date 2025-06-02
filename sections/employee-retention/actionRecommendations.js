/**
 * Action Recommendations Component
 * Displays AI-generated recommendations for improving employee retention
 */
"use client";

import { useState, useMemo } from "react";
import { formatPercentage } from "../../lib/employee-retention-utils";

export default function ActionRecommendations({
  recommendations = [],
  analytics = null,
}) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [completedActions, setCompletedActions] = useState(new Set());

  // Generate additional smart recommendations based on analytics
  const smartRecommendations = useMemo(() => {
    if (!analytics) return recommendations;

    const additionalRecs = [];

    // Analyze retention trends
    if (analytics.retentionTrends?.trend === "declining") {
      additionalRecs.push({
        priority: "High",
        action: "Implement comprehensive retention strategy",
        department: "All",
        expectedImpact: "Stabilize retention rate within 3 months",
        timeline: "2 weeks",
        category: "Strategic",
        description:
          "Develop and implement a company-wide retention strategy addressing the declining retention trend.",
        steps: [
          "Conduct organization-wide survey",
          "Identify root causes of declining retention",
          "Develop targeted intervention programs",
          "Establish retention KPIs and monitoring",
        ],
      });
    }

    // Analyze risk factors
    const primaryFactors = analytics.riskFactors?.primaryFactors || [];
    primaryFactors.forEach((factor) => {
      if (factor.impact > 20 && factor.trend === "declining") {
        additionalRecs.push({
          priority: factor.impact > 25 ? "High" : "Medium",
          action: `Address declining ${factor.factor.toLowerCase()}`,
          department: "All",
          expectedImpact: `Improve ${factor.factor.toLowerCase()} by 20-30%`,
          timeline: "4-6 weeks",
          category: "Operational",
          description: `Focus on improving ${factor.factor.toLowerCase()} as it's a major risk factor showing declining trend.`,
          steps: [
            `Assess current ${factor.factor.toLowerCase()} levels`,
            "Identify improvement opportunities",
            "Implement targeted interventions",
            "Monitor progress weekly",
          ],
        });
      }
    });

    // Analyze department risks
    const riskDepts =
      analytics.departmentAnalytics?.filter(
        (dept) => dept.highRisk / dept.totalEmployees > 0.2
      ) || [];

    riskDepts.forEach((dept) => {
      additionalRecs.push({
        priority: "High",
        action: `Department-specific retention plan for ${dept.department}`,
        department: dept.department,
        expectedImpact: "Reduce high-risk employees by 50%",
        timeline: "3-4 weeks",
        category: "Department-Specific",
        description: `Develop targeted retention strategies for ${dept.department} department due to high risk levels.`,
        steps: [
          "Conduct department-specific focus groups",
          "Identify unique challenges and pain points",
          "Develop customized retention initiatives",
          "Assign dedicated HR support",
        ],
      });
    });

    return [...recommendations, ...additionalRecs];
  }, [recommendations, analytics]);

  // Group recommendations by priority
  const groupedRecommendations = useMemo(() => {
    const groups = {
      High: [],
      Medium: [],
      Low: [],
    };

    smartRecommendations.forEach((rec) => {
      groups[rec.priority]?.push(rec);
    });

    return groups;
  }, [smartRecommendations]);

  const handleActionComplete = (index) => {
    const newCompleted = new Set(completedActions);
    if (completedActions.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedActions(newCompleted);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "border-red-200 bg-red-50";
      case "Medium":
        return "border-yellow-200 bg-yellow-50";
      case "Low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "High":
        return "🚨";
      case "Medium":
        return "⚠️";
      case "Low":
        return "💡";
      default:
        return "📋";
    }
  };

  if (!smartRecommendations.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No recommendations available</div>
          <div className="text-sm text-gray-400">
            Recommendations will appear based on your analytics data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Actions</p>
              <p className="text-2xl font-bold text-gray-900">
                {smartRecommendations.length}
              </p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">
                {groupedRecommendations.High.length}
              </p>
            </div>
            <div className="text-3xl">🚨</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {completedActions.size}
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
      </div>

      {/* Recommendations by Priority */}
      {Object.entries(groupedRecommendations).map(([priority, recs]) => {
        if (!recs.length) return null;

        return (
          <div
            key={priority}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">{getPriorityIcon(priority)}</span>
              {priority} Priority Actions ({recs.length})
            </h3>

            <div className="space-y-4">
              {recs.map((rec, index) => {
                const globalIndex = smartRecommendations.indexOf(rec);
                const isCompleted = completedActions.has(globalIndex);

                return (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 transition-all duration-200 ${getPriorityColor(
                      priority
                    )} ${isCompleted ? "opacity-60" : ""} ${
                      selectedAction === globalIndex
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <button
                            onClick={() => handleActionComplete(globalIndex)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isCompleted
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {isCompleted && "✓"}
                          </button>

                          <h4
                            className={`font-medium text-gray-900 ${
                              isCompleted ? "line-through" : ""
                            }`}
                          >
                            {rec.action}
                          </h4>

                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              priority === "High"
                                ? "bg-red-100 text-red-800"
                                : priority === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {priority}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <span className="text-xs text-gray-600">
                              Department:
                            </span>
                            <div className="text-sm font-medium text-gray-900">
                              {rec.department}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-600">
                              Timeline:
                            </span>
                            <div className="text-sm font-medium text-gray-900">
                              {rec.timeline}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-600">
                              Expected Impact:
                            </span>
                            <div className="text-sm font-medium text-gray-900">
                              {rec.expectedImpact}
                            </div>
                          </div>
                        </div>

                        {rec.description && (
                          <p className="text-sm text-gray-600 mb-3">
                            {rec.description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          setSelectedAction(
                            selectedAction === globalIndex ? null : globalIndex
                          )
                        }
                        className="ml-4 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {selectedAction === globalIndex
                          ? "Hide Details"
                          : "View Details"}
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {selectedAction === globalIndex && rec.steps && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="font-medium text-gray-900 mb-2">
                          Action Steps:
                        </h5>
                        <ol className="list-decimal list-inside space-y-1">
                          {rec.steps.map((step, stepIndex) => (
                            <li
                              key={stepIndex}
                              className="text-sm text-gray-700"
                            >
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Progress Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Implementation Progress
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Overall Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {completedActions.size} / {smartRecommendations.length} completed
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  smartRecommendations.length > 0
                    ? (completedActions.size / smartRecommendations.length) *
                      100
                    : 0
                }%`,
              }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600">High Priority</div>
              <div className="text-lg font-semibold text-red-600">
                {
                  groupedRecommendations.High.filter((_, i) =>
                    completedActions.has(
                      smartRecommendations.indexOf(
                        groupedRecommendations.High[i]
                      )
                    )
                  ).length
                }{" "}
                / {groupedRecommendations.High.length}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Medium Priority</div>
              <div className="text-lg font-semibold text-yellow-600">
                {
                  groupedRecommendations.Medium.filter((_, i) =>
                    completedActions.has(
                      smartRecommendations.indexOf(
                        groupedRecommendations.Medium[i]
                      )
                    )
                  ).length
                }{" "}
                / {groupedRecommendations.Medium.length}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Low Priority</div>
              <div className="text-lg font-semibold text-green-600">
                {
                  groupedRecommendations.Low.filter((_, i) =>
                    completedActions.has(
                      smartRecommendations.indexOf(
                        groupedRecommendations.Low[i]
                      )
                    )
                  ).length
                }{" "}
                / {groupedRecommendations.Low.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Quick Actions You Can Take Today
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              📞 Schedule Stay Interviews
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Reach out to high-risk employees for one-on-one conversations
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View High-Risk Employees →
            </button>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              📊 Review Team Satisfaction
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Check recent survey results and identify improvement areas
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Analytics →
            </button>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              🎯 Set Retention Goals
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Define monthly retention targets for each department
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Set Goals →
            </button>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              📈 Track Progress
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Monitor implementation of retention strategies
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Dashboard →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
