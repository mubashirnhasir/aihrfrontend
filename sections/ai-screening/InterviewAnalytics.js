/**
 * Interview Analytics Component
 * Real-time analytics dashboard for interview monitoring
 */
"use client";

import { useState, useEffect } from "react";

export default function InterviewAnalytics({
  suspiciousActivity,
  eyeTrackingData,
  lipSyncData,
  currentQuestion,
  totalQuestions,
}) {
  const [overallScore, setOverallScore] = useState(100);
  const [riskLevel, setRiskLevel] = useState("low");
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    calculateOverallScore();
    updateRiskLevel();
    processAlerts();
  }, [suspiciousActivity, eyeTrackingData, lipSyncData]);

  const calculateOverallScore = () => {
    let score = 100;

    // Deduct points for suspicious activities
    suspiciousActivity.forEach((activity) => {
      switch (activity.severity) {
        case "high":
          score -= 25;
          break;
        case "medium":
          score -= 15;
          break;
        case "low":
          score -= 5;
          break;
      }
    });

    // Factor in eye tracking quality
    if (eyeTrackingData.length > 0) {
      const avgAttention =
        eyeTrackingData.reduce(
          (sum, data) => sum + (data.attentionScore || 100),
          0
        ) / eyeTrackingData.length;
      score = (score + avgAttention) / 2;
    }

    // Factor in lip sync quality
    if (lipSyncData.length > 0) {
      const avgSyncScore =
        lipSyncData.reduce((sum, data) => sum + (data.syncScore || 100), 0) /
        lipSyncData.length;
      score = (score + avgSyncScore) / 2;
    }

    setOverallScore(Math.max(0, Math.min(100, score)));
  };

  const updateRiskLevel = () => {
    const highSeverityCount = suspiciousActivity.filter(
      (a) => a.severity === "high"
    ).length;
    const mediumSeverityCount = suspiciousActivity.filter(
      (a) => a.severity === "medium"
    ).length;

    if (highSeverityCount >= 3 || overallScore < 30) {
      setRiskLevel("high");
    } else if (
      highSeverityCount >= 1 ||
      mediumSeverityCount >= 3 ||
      overallScore < 60
    ) {
      setRiskLevel("medium");
    } else {
      setRiskLevel("low");
    }
  };
  const processAlerts = () => {
    const recentAlerts = suspiciousActivity
      .filter((activity) => Date.now() - activity.timestamp < 30000) // Last 30 seconds
      .slice(-5) // Last 5 alerts
      .map((activity, index) => ({
        ...activity,
        id: `${activity.timestamp}-${activity.type}-${index}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      }));

    setAlerts(recentAlerts);
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-100 border-green-300";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-300";
      case "high":
        return "text-red-600 bg-red-100 border-red-300";
      default:
        return "text-gray-600 bg-gray-100 border-gray-300";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high":
        return "🚨";
      case "medium":
        return "⚠️";
      case "low":
        return "⚡";
      default:
        return "ℹ️";
    }
  };

  const formatActivityType = (type) => {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatTimestamp = (timestamp) => {
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          📊 Interview Analytics
        </h3>
        <div className="text-sm text-gray-500">
          Q{currentQuestion}/{totalQuestions}
        </div>
      </div>

      <div className="space-y-4">
        {/* Overall Score */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
            {Math.round(overallScore)}
          </div>
          <div className="text-sm text-gray-600">Integrity Score</div>

          {/* Score Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                overallScore >= 80
                  ? "bg-green-500"
                  : overallScore >= 60
                  ? "bg-yellow-500"
                  : overallScore >= 40
                  ? "bg-orange-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${overallScore}%` }}
            ></div>
          </div>
        </div>

        {/* Risk Level */}
        <div
          className={`p-3 rounded-lg border ${getRiskLevelColor(riskLevel)}`}
        >
          <div className="font-medium text-center">
            Risk Level: <span className="uppercase">{riskLevel}</span>
          </div>
          <div className="text-xs text-center mt-1">
            {riskLevel === "low" && "No significant concerns detected"}
            {riskLevel === "medium" && "Some suspicious activity detected"}
            {riskLevel === "high" && "Multiple integrity concerns identified"}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-red-50 p-2 rounded">
            <div className="text-lg font-bold text-red-600">
              {suspiciousActivity.filter((a) => a.severity === "high").length}
            </div>
            <div className="text-xs text-red-600">High</div>
          </div>
          <div className="bg-yellow-50 p-2 rounded">
            <div className="text-lg font-bold text-yellow-600">
              {suspiciousActivity.filter((a) => a.severity === "medium").length}
            </div>
            <div className="text-xs text-yellow-600">Medium</div>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <div className="text-lg font-bold text-blue-600">
              {suspiciousActivity.filter((a) => a.severity === "low").length}
            </div>
            <div className="text-xs text-blue-600">Low</div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div>
          <div className="text-sm font-medium text-gray-900 mb-2">
            Recent Alerts
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start space-x-2 p-2 bg-gray-50 rounded text-xs"
                >
                  <span className="text-sm">
                    {getSeverityIcon(alert.severity)}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {formatActivityType(alert.type)}
                    </div>
                    <div className="text-gray-600">{alert.description}</div>
                    <div className="text-gray-400 mt-1">
                      {formatTimestamp(alert.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                <div className="text-2xl mb-1">✅</div>
                <div className="text-xs">No recent alerts</div>
              </div>
            )}
          </div>
        </div>

        {/* Detection Status */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-blue-50 p-2 rounded text-center">
            <div className="font-medium text-blue-900">Eye Tracking</div>
            <div className="text-blue-600">
              {eyeTrackingData.length > 0 ? "Active" : "Inactive"}
            </div>
          </div>
          <div className="bg-purple-50 p-2 rounded text-center">
            <div className="font-medium text-purple-900">Lip Sync</div>
            <div className="text-purple-600">
              {lipSyncData.length > 0 ? "Active" : "Inactive"}
            </div>
          </div>
        </div>

        {/* Data Points */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>Total Activities: {suspiciousActivity.length}</div>
          <div>Eye Samples: {eyeTrackingData.length}</div>
          <div>Sync Samples: {lipSyncData.length}</div>
        </div>
      </div>
    </div>
  );
}
