// filepath: d:\aihrfrontend\sections\ai-screening\EnhancedAnalyticsDashboard.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  Mic,
  Camera,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";

const EnhancedAnalyticsDashboard = ({
  eyeTrackingData = [],
  lipSyncData = [],
  audioLevelData = [],
  suspiciousActivity = [],
  questionResponses = [],
}) => {
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    currentEyeTracking: 0,
    currentLipSync: 0,
    currentAudioLevel: 0,
    integrityScore: 100,
    alertLevel: "low",
  });

  const [historicalMetrics, setHistoricalMetrics] = useState({
    eyeTrackingTrend: [],
    lipSyncTrend: [],
    audioLevelTrend: [],
    integrityTrend: [],
  });

  const [performanceStats, setPerformanceStats] = useState({
    avgResponseLength: 0,
    totalSpeakingTime: 0,
    silentPeriods: 0,
    technicalTermsUsed: 0,
    confidenceLevel: 0,
  });

  const chartRef = useRef(null);
  const updateInterval = useRef(null);

  useEffect(() => {
    updateInterval.current = setInterval(() => {
      updateRealTimeMetrics();
      updateHistoricalData();
      updatePerformanceStats();
    }, 1000);

    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
    };
  }, [eyeTrackingData, lipSyncData, audioLevelData, questionResponses]);

  const updateRealTimeMetrics = () => {
    const latestEyeTracking =
      eyeTrackingData.length > 0
        ? eyeTrackingData[eyeTrackingData.length - 1]?.score || 0
        : 0;

    const latestLipSync =
      lipSyncData.length > 0
        ? (lipSyncData[lipSyncData.length - 1]?.correlation || 0) * 100
        : 0;

    const latestAudioLevel =
      audioLevelData.length > 0
        ? (audioLevelData[audioLevelData.length - 1]?.level || 0) * 100
        : 0;

    // Calculate integrity score based on multiple factors
    const integrityScore = calculateIntegrityScore(
      latestEyeTracking,
      latestLipSync,
      suspiciousActivity.length
    );

    // Determine alert level
    const alertLevel =
      integrityScore >= 80 ? "low" : integrityScore >= 60 ? "medium" : "high";

    setRealTimeMetrics({
      currentEyeTracking: latestEyeTracking,
      currentLipSync: latestLipSync,
      currentAudioLevel: latestAudioLevel,
      integrityScore,
      alertLevel,
    });
  };

  const updateHistoricalData = () => {
    const last20EyeTracking = eyeTrackingData.slice(-20).map((item, index) => ({
      x: index,
      y: item.score || 0,
    }));

    const last20LipSync = lipSyncData.slice(-20).map((item, index) => ({
      x: index,
      y: (item.correlation || 0) * 100,
    }));

    const last20AudioLevel = audioLevelData.slice(-20).map((item, index) => ({
      x: index,
      y: (item.level || 0) * 100,
    }));

    const last20Integrity = Array.from(
      { length: Math.min(20, eyeTrackingData.length) },
      (_, index) => {
        const dataIndex = Math.max(0, eyeTrackingData.length - 20 + index);
        const eyeScore = eyeTrackingData[dataIndex]?.score || 0;
        const lipScore = lipSyncData[dataIndex]
          ? lipSyncData[dataIndex].correlation * 100
          : 0;
        return {
          x: index,
          y: calculateIntegrityScore(
            eyeScore,
            lipScore,
            suspiciousActivity.length
          ),
        };
      }
    );

    setHistoricalMetrics({
      eyeTrackingTrend: last20EyeTracking,
      lipSyncTrend: last20LipSync,
      audioLevelTrend: last20AudioLevel,
      integrityTrend: last20Integrity,
    });
  };

  const updatePerformanceStats = () => {
    if (questionResponses.length === 0) {
      setPerformanceStats({
        avgResponseLength: 0,
        totalSpeakingTime: 0,
        silentPeriods: 0,
        technicalTermsUsed: 0,
        confidenceLevel: 0,
      });
      return;
    }

    // Calculate average response length
    const totalWords = questionResponses.reduce((sum, response) => {
      const words = (response.transcript || "")
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0);
      return sum + words.length;
    }, 0);
    const avgResponseLength = Math.round(totalWords / questionResponses.length);

    // Estimate speaking time (assuming 150 words per minute)
    const totalSpeakingTime = Math.round((totalWords / 150) * 60); // in seconds

    // Count silent periods (responses with no meaningful content)
    const silentPeriods = questionResponses.filter((response) => {
      const transcript = response.transcript || "";
      return (
        transcript.includes("No speech detected") ||
        transcript.includes("Speech recognition not supported") ||
        transcript
          .trim()
          .split(/\s+/)
          .filter((w) => w.length > 0).length < 3
      );
    }).length;

    // Count technical terms used
    const technicalTerms = [
      "javascript",
      "react",
      "node",
      "api",
      "database",
      "frontend",
      "backend",
      "algorithm",
      "framework",
      "library",
      "component",
      "function",
      "method",
      "development",
      "programming",
      "coding",
      "software",
      "system",
      "architecture",
    ];

    const technicalTermsUsed = questionResponses.reduce((count, response) => {
      const transcript = (response.transcript || "").toLowerCase();
      return (
        count +
        technicalTerms.filter((term) => transcript.includes(term)).length
      );
    }, 0);

    // Calculate confidence level based on response quality
    const validResponses = questionResponses.filter((response) => {
      const words = (response.transcript || "")
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0);
      return words.length >= 5;
    });
    const confidenceLevel = Math.round(
      (validResponses.length / questionResponses.length) * 100
    );

    setPerformanceStats({
      avgResponseLength,
      totalSpeakingTime,
      silentPeriods,
      technicalTermsUsed,
      confidenceLevel,
    });
  };

  const calculateIntegrityScore = (
    eyeScore,
    lipSyncScore,
    suspiciousActivityCount
  ) => {
    const baseScore = eyeScore * 0.4 + lipSyncScore * 0.4 + 20 * 0.2; // Base 20% for participation
    const penalty = Math.min(suspiciousActivityCount * 10, 50); // Max 50% penalty
    return Math.max(0, Math.min(100, Math.round(baseScore - penalty)));
  };

  const renderMiniChart = (data, color, height = 40) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map((d) => d.y), 1);
    const width = 200;
    const points = data
      .map((point, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - (point.y / maxValue) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        <defs>
          <linearGradient
            id={`gradient-${color}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,${height} ${points} ${width},${height}`}
          fill={`url(#gradient-${color})`}
        />
      </svg>
    );
  };

  const getAlertColor = (level) => {
    switch (level) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-green-600 bg-green-50 border-green-200";
    }
  };

  const getAlertIcon = (level) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="w-5 h-5" />;
      case "medium":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getTrendIcon = (current, previous) => {
    if (current > previous)
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (current < previous)
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Real-time Metrics */}
      <div className="bg-white rounded-lg shadow-lg p-6 col-span-full">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-600" />
          Real-time Behavioral Analytics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Eye Tracking</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {realTimeMetrics.currentEyeTracking.toFixed(0)}%
            </div>
            <div className="mt-2">
              {renderMiniChart(historicalMetrics.eyeTrackingTrend, "#3b82f6")}
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Mic className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Lip Sync</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {realTimeMetrics.currentLipSync.toFixed(0)}%
            </div>
            <div className="mt-2">
              {renderMiniChart(historicalMetrics.lipSyncTrend, "#10b981")}
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">Audio Level</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {realTimeMetrics.currentAudioLevel.toFixed(0)}%
            </div>
            <div className="mt-2">
              {renderMiniChart(historicalMetrics.audioLevelTrend, "#8b5cf6")}
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border ${getAlertColor(
              realTimeMetrics.alertLevel
            )}`}
          >
            <div className="flex items-center gap-2 mb-2">
              {getAlertIcon(realTimeMetrics.alertLevel)}
              <span className="font-semibold">Integrity Score</span>
            </div>
            <div className="text-2xl font-bold">
              {realTimeMetrics.integrityScore}%
            </div>
            <div className="mt-2">
              {renderMiniChart(
                historicalMetrics.integrityTrend,
                realTimeMetrics.alertLevel === "high"
                  ? "#dc2626"
                  : realTimeMetrics.alertLevel === "medium"
                  ? "#d97706"
                  : "#059669"
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Statistics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          Performance Stats
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Avg Response Length</span>
            <span className="font-semibold">
              {performanceStats.avgResponseLength} words
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Speaking Time</span>
            <span className="font-semibold">
              {Math.floor(performanceStats.totalSpeakingTime / 60)}m{" "}
              {performanceStats.totalSpeakingTime % 60}s
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Silent Periods</span>
            <span className="font-semibold text-red-600">
              {performanceStats.silentPeriods}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Technical Terms</span>
            <span className="font-semibold text-blue-600">
              {performanceStats.technicalTermsUsed}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Confidence Level</span>
            <span className="font-semibold text-green-600">
              {performanceStats.confidenceLevel}%
            </span>
          </div>
        </div>
      </div>

      {/* Suspicious Activity Monitor */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          Security Alerts
        </h3>

        {suspiciousActivity.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-green-600 font-semibold">
              No Suspicious Activity
            </p>
            <p className="text-gray-500 text-sm">
              All behavioral patterns normal
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {suspiciousActivity.slice(-5).map((activity, index) => (
              <div
                key={index}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="font-semibold text-red-800">
                    {activity.type}
                  </span>
                </div>
                <p className="text-sm text-red-600">{activity.description}</p>
                <p className="text-xs text-red-500 mt-1">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Response Quality Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-green-600" />
          Response Quality
        </h3>

        {questionResponses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No responses recorded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questionResponses.map((response, index) => {
              const wordCount = (response.transcript || "")
                .trim()
                .split(/\s+/)
                .filter((w) => w.length > 0).length;
              const quality =
                wordCount >= 20 ? "good" : wordCount >= 10 ? "fair" : "poor";
              const qualityColor =
                quality === "good"
                  ? "text-green-600"
                  : quality === "fair"
                  ? "text-yellow-600"
                  : "text-red-600";

              return (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-800">
                      Question {index + 1}
                    </span>
                    <span className={`text-sm font-semibold ${qualityColor}`}>
                      {quality.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {wordCount} words • {response.category || "General"}
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        quality === "good"
                          ? "bg-green-500"
                          : quality === "fair"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(100, (wordCount / 50) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-lg p-6 col-span-full">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <LineChart className="w-5 h-5 text-gray-600" />
          System Status
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {eyeTrackingData.length}
            </div>
            <div className="text-sm text-gray-600">Eye Tracking Samples</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {lipSyncData.length}
            </div>
            <div className="text-sm text-gray-600">Lip Sync Samples</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {audioLevelData.length}
            </div>
            <div className="text-sm text-gray-600">Audio Samples</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {questionResponses.length}
            </div>
            <div className="text-sm text-gray-600">Responses Recorded</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
