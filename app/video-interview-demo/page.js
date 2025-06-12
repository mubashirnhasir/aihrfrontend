// filepath: d:\aihrfrontend\app\video-interview-demo\page.js
"use client";

import React, { useState, useEffect } from "react";
import {
  Video,
  TestTube,
  Database,
  BarChart3,
  Play,
  Square,
  Settings,
} from "lucide-react";
import VideoInterviewScreen from "../../sections/ai-screening/VideoInterviewScreen";
import VideoInterviewTester from "../../sections/ai-screening/VideoInterviewTester";
import { VideoStorageUI } from "../../sections/ai-screening/VideoStorageManager";
import EnhancedAnalyticsDashboard from "../../sections/ai-screening/EnhancedAnalyticsDashboard";

const VideoInterviewDemoPage = () => {
  const [activeTab, setActiveTab] = useState("interview");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  // Demo data for analytics
  const [demoAnalyticsData, setDemoAnalyticsData] = useState({
    eyeTrackingData: [],
    lipSyncData: [],
    audioLevelData: [],
    suspiciousActivity: [],
    questionResponses: [],
  });

  // Generate demo data
  useEffect(() => {
    if (demoMode) {
      generateDemoData();
    }
  }, [demoMode]);

  const generateDemoData = () => {
    const now = Date.now();

    // Generate eye tracking data
    const eyeTrackingData = Array.from({ length: 50 }, (_, i) => ({
      score: Math.max(
        60,
        Math.min(95, 80 + Math.sin(i * 0.2) * 15 + (Math.random() - 0.5) * 10)
      ),
      timestamp: now - (50 - i) * 1000,
    }));

    // Generate lip sync data
    const lipSyncData = Array.from({ length: 50 }, (_, i) => ({
      correlation: Math.max(
        0.6,
        Math.min(
          0.95,
          0.85 + Math.sin(i * 0.3) * 0.1 + (Math.random() - 0.5) * 0.1
        )
      ),
      timestamp: now - (50 - i) * 1000,
    }));

    // Generate audio level data
    const audioLevelData = Array.from({ length: 50 }, (_, i) => ({
      level: Math.max(
        0.3,
        Math.min(
          0.9,
          0.6 + Math.sin(i * 0.4) * 0.2 + (Math.random() - 0.5) * 0.2
        )
      ),
      timestamp: now - (50 - i) * 1000,
    }));

    // Generate suspicious activity
    const suspiciousActivity = [
      {
        type: "Eye Movement",
        description: "Unusual eye movement pattern detected",
        timestamp: now - 30000,
        severity: "low",
      },
      {
        type: "Audio Anomaly",
        description: "Background noise detected",
        timestamp: now - 15000,
        severity: "medium",
      },
    ];

    // Generate question responses
    const questionResponses = [
      {
        question: "Tell me about your experience with React development.",
        transcript:
          "I have been working with React for over three years, developing complex single-page applications and component libraries. I am proficient in hooks, context API, and state management with Redux.",
        category: "Technical",
        wordCount: 28,
      },
      {
        question: "How do you handle challenging situations in a team?",
        transcript:
          "I believe in open communication and collaborative problem-solving. When faced with conflicts, I try to understand all perspectives and work towards a solution that benefits the entire team.",
        category: "Behavioral",
        wordCount: 30,
      },
      {
        question: "What are your career goals for the next five years?",
        transcript:
          "I aim to become a senior full-stack developer and eventually transition into a technical leadership role where I can mentor junior developers and contribute to architectural decisions.",
        category: "Career",
        wordCount: 29,
      },
    ];

    setDemoAnalyticsData({
      eyeTrackingData,
      lipSyncData,
      audioLevelData,
      suspiciousActivity,
      questionResponses,
    });
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const tabConfig = [
    {
      id: "interview",
      label: "Video Interview",
      icon: Video,
      component: <VideoInterviewScreen />,
    },
    {
      id: "analytics",
      label: "Analytics Dashboard",
      icon: BarChart3,
      component: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Enhanced Analytics Dashboard
            </h2>
            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                demoMode
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
            >
              {demoMode ? "Demo Mode ON" : "Enable Demo Mode"}
            </button>
          </div>
          <EnhancedAnalyticsDashboard {...demoAnalyticsData} />
        </div>
      ),
    },
    {
      id: "storage",
      label: "Video Storage",
      icon: Database,
      component: (
        <div className="space-y-6">
          <VideoStorageUI onVideoSelect={handleVideoSelect} />
          {selectedVideo && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Video Player
              </h3>
              <video
                src={selectedVideo.url}
                controls
                className="w-full max-w-2xl mx-auto rounded-lg"
                style={{ maxHeight: "400px" }}
              >
                Your browser does not support the video tag.
              </video>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Video Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">File Name:</span>{" "}
                    {selectedVideo.fileName}
                  </div>
                  <div>
                    <span className="font-medium">Question:</span>{" "}
                    {selectedVideo.questionIndex + 1}
                  </div>
                  <div>
                    <span className="font-medium">Size:</span>{" "}
                    {(selectedVideo.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  <div>
                    <span className="font-medium">Storage:</span>{" "}
                    {selectedVideo.storage}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Recorded:</span>{" "}
                    {new Date(selectedVideo.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "testing",
      label: "System Testing",
      icon: TestTube,
      component: <VideoInterviewTester />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Video className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Video Interview System
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Status:{" "}
                <span className="text-green-600 font-semibold">
                  ✅ Operational
                </span>
              </div>
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tabConfig.find((tab) => tab.id === activeTab)?.component}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Features
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✅ Real-time video recording</li>
                <li>✅ Speech-to-text transcription</li>
                <li>✅ Behavioral monitoring</li>
                <li>✅ AI-powered evaluation</li>
                <li>✅ Persistent video storage</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Technology Stack
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Next.js 15 with React 18</li>
                <li>• MediaRecorder API</li>
                <li>• Web Speech API</li>
                <li>• IndexedDB Storage</li>
                <li>• OpenAI GPT Integration</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Performance
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Video Quality:</span>
                  <span className="text-green-600 font-semibold">HD</span>
                </div>
                <div className="flex justify-between">
                  <span>Audio Quality:</span>
                  <span className="text-green-600 font-semibold">High</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage:</span>
                  <span className="text-blue-600 font-semibold">
                    Local + Cloud
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Real-time:</span>
                  <span className="text-green-600 font-semibold">Yes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>
              Video Interview System - Advanced AI-Powered Recruitment
              Technology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInterviewDemoPage;
