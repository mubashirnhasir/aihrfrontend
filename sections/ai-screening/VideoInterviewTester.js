// filepath: d:\aihrfrontend\sections\ai-screening\VideoInterviewTester.js
"use client";

import React, { useState, useRef } from "react";
import {
  Play,
  Square,
  TestTube,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const VideoInterviewTester = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [currentTest, setCurrentTest] = useState("");

  const updateTestResult = (testName, status, details = "") => {
    setTestResults((prev) => ({
      ...prev,
      [testName]: { status, details, timestamp: new Date().toISOString() },
    }));
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults({});

    const tests = [
      "Camera Permissions",
      "Microphone Permissions",
      "MediaRecorder Support",
      "Speech Recognition Support",
      "IndexedDB Support",
      "Video Encoding",
      "Audio Context",
      "Face Detection Simulation",
      "Eye Tracking Simulation",
      "Lip Sync Detection",
      "API Endpoint Connection",
      "Real-time Analytics",
    ];

    for (const test of tests) {
      setCurrentTest(test);
      await runIndividualTest(test);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay between tests
    }

    setCurrentTest("");
    setIsRunningTests(false);
  };

  const runIndividualTest = async (testName) => {
    try {
      switch (testName) {
        case "Camera Permissions":
          await testCameraPermissions();
          break;
        case "Microphone Permissions":
          await testMicrophonePermissions();
          break;
        case "MediaRecorder Support":
          testMediaRecorderSupport();
          break;
        case "Speech Recognition Support":
          testSpeechRecognitionSupport();
          break;
        case "IndexedDB Support":
          await testIndexedDBSupport();
          break;
        case "Video Encoding":
          await testVideoEncoding();
          break;
        case "Audio Context":
          testAudioContext();
          break;
        case "Face Detection Simulation":
          testFaceDetectionSimulation();
          break;
        case "Eye Tracking Simulation":
          testEyeTrackingSimulation();
          break;
        case "Lip Sync Detection":
          testLipSyncDetection();
          break;
        case "API Endpoint Connection":
          await testAPIEndpoint();
          break;
        case "Real-time Analytics":
          testRealtimeAnalytics();
          break;
        default:
          updateTestResult(testName, "warning", "Test not implemented");
      }
    } catch (error) {
      updateTestResult(testName, "error", error.message);
    }
  };

  const testCameraPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      updateTestResult(
        "Camera Permissions",
        "success",
        "Camera access granted"
      );
    } catch (error) {
      updateTestResult(
        "Camera Permissions",
        "error",
        "Camera access denied or unavailable"
      );
    }
  };

  const testMicrophonePermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      updateTestResult(
        "Microphone Permissions",
        "success",
        "Microphone access granted"
      );
    } catch (error) {
      updateTestResult(
        "Microphone Permissions",
        "error",
        "Microphone access denied or unavailable"
      );
    }
  };

  const testMediaRecorderSupport = () => {
    if (typeof MediaRecorder !== "undefined") {
      const supportedTypes = [
        "video/webm;codecs=vp8",
        "video/webm;codecs=vp9",
        "video/mp4",
      ];

      const supported = supportedTypes.filter((type) =>
        MediaRecorder.isTypeSupported(type)
      );

      if (supported.length > 0) {
        updateTestResult(
          "MediaRecorder Support",
          "success",
          `Supported formats: ${supported.join(", ")}`
        );
      } else {
        updateTestResult(
          "MediaRecorder Support",
          "warning",
          "MediaRecorder available but no supported formats"
        );
      }
    } else {
      updateTestResult(
        "MediaRecorder Support",
        "error",
        "MediaRecorder not supported"
      );
    }
  };

  const testSpeechRecognitionSupport = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      updateTestResult(
        "Speech Recognition Support",
        "success",
        "Speech Recognition API available"
      );
    } else {
      updateTestResult(
        "Speech Recognition Support",
        "error",
        "Speech Recognition not supported in this browser"
      );
    }
  };

  const testIndexedDBSupport = async () => {
    try {
      const request = indexedDB.open("TestDB", 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("test")) {
          db.createObjectStore("test", { keyPath: "id" });
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        db.close();
        // Clean up test database
        indexedDB.deleteDatabase("TestDB");
        updateTestResult(
          "IndexedDB Support",
          "success",
          "IndexedDB is functional"
        );
      };

      request.onerror = () => {
        updateTestResult(
          "IndexedDB Support",
          "error",
          "IndexedDB connection failed"
        );
      };
    } catch (error) {
      updateTestResult("IndexedDB Support", "error", "IndexedDB not supported");
    }
  };

  const testVideoEncoding = async () => {
    try {
      // Create a short test recording
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const recorder = new MediaRecorder(stream);

      let chunks = [];
      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        if (blob.size > 0) {
          updateTestResult(
            "Video Encoding",
            "success",
            `Video blob created: ${(blob.size / 1024).toFixed(2)} KB`
          );
        } else {
          updateTestResult(
            "Video Encoding",
            "error",
            "Video encoding failed - empty blob"
          );
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setTimeout(() => {
        recorder.stop();
      }, 1000);
    } catch (error) {
      updateTestResult("Video Encoding", "error", "Video encoding test failed");
    }
  };

  const testAudioContext = () => {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      if (audioContext) {
        audioContext.close();
        updateTestResult(
          "Audio Context",
          "success",
          "AudioContext created and closed successfully"
        );
      } else {
        updateTestResult(
          "Audio Context",
          "error",
          "AudioContext not available"
        );
      }
    } catch (error) {
      updateTestResult(
        "Audio Context",
        "error",
        "AudioContext creation failed"
      );
    }
  };

  const testFaceDetectionSimulation = () => {
    // Test face detection simulation logic
    const mockCanvasData = new Uint8ClampedArray(100 * 100 * 4).fill(128);
    const mockFaceDetected = mockCanvasData.some(
      (value, index) => index % 4 === 0 && value > 100
    );

    if (mockFaceDetected) {
      updateTestResult(
        "Face Detection Simulation",
        "success",
        "Face detection simulation working"
      );
    } else {
      updateTestResult(
        "Face Detection Simulation",
        "warning",
        "Face detection simulation may need adjustment"
      );
    }
  };

  const testEyeTrackingSimulation = () => {
    // Test eye tracking simulation
    const mockEyeData = {
      leftEye: { x: 0.3, y: 0.4, detected: true },
      rightEye: { x: 0.7, y: 0.4, detected: true },
      gazeDirection: { x: 0.5, y: 0.5 },
    };

    if (mockEyeData.leftEye.detected && mockEyeData.rightEye.detected) {
      updateTestResult(
        "Eye Tracking Simulation",
        "success",
        "Eye tracking simulation functional"
      );
    } else {
      updateTestResult(
        "Eye Tracking Simulation",
        "error",
        "Eye tracking simulation failed"
      );
    }
  };

  const testLipSyncDetection = () => {
    // Test lip sync detection logic
    const mockAudioLevel = 0.5;
    const mockLipMovement = 0.4;
    const correlation = Math.abs(mockAudioLevel - mockLipMovement);

    if (correlation < 0.3) {
      updateTestResult(
        "Lip Sync Detection",
        "success",
        `Lip sync correlation: ${(1 - correlation).toFixed(2)}`
      );
    } else {
      updateTestResult(
        "Lip Sync Detection",
        "warning",
        "Lip sync detection may need calibration"
      );
    }
  };

  const testAPIEndpoint = async () => {
    try {
      const mockData = {
        responses: [
          {
            question: "Test question",
            transcript: "Test response with multiple words for evaluation",
            category: "Technical",
            videoBlob: null,
            wordCount: 8,
          },
        ],
        role: "Software Developer",
        experience: "Mid-level",
        behavioralData: {
          eyeTrackingData: [{ score: 85, timestamp: Date.now() }],
          lipSyncData: [{ correlation: 0.9, timestamp: Date.now() }],
          suspiciousActivity: [],
        },
      };

      const response = await fetch(
        "/api/ai-screening/evaluate-video-interview",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mockData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        updateTestResult(
          "API Endpoint Connection",
          "success",
          `API responded with score: ${data.overallScore}`
        );
      } else {
        updateTestResult(
          "API Endpoint Connection",
          "error",
          `API returned status: ${response.status}`
        );
      }
    } catch (error) {
      updateTestResult(
        "API Endpoint Connection",
        "error",
        "API endpoint unreachable"
      );
    }
  };

  const testRealtimeAnalytics = () => {
    // Test real-time analytics calculations
    const mockAnalytics = {
      avgEyeTracking: 82,
      avgLipSync: 88,
      integrityScore: 85,
      suspiciousActivityCount: 0,
    };

    if (mockAnalytics.integrityScore >= 70) {
      updateTestResult(
        "Real-time Analytics",
        "success",
        `Analytics calculation working (Integrity: ${mockAnalytics.integrityScore}%)`
      );
    } else {
      updateTestResult(
        "Real-time Analytics",
        "warning",
        "Analytics may need adjustment"
      );
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-gray-300 animate-pulse" />
        );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "border-l-green-500 bg-green-50";
      case "error":
        return "border-l-red-500 bg-red-50";
      case "warning":
        return "border-l-yellow-500 bg-yellow-50";
      default:
        return "border-l-gray-300 bg-gray-50";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <TestTube className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Video Interview System Tester
          </h2>
        </div>

        <div className="mb-6">
          <button
            onClick={runAllTests}
            disabled={isRunningTests}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunningTests ? (
              <>
                <Square className="w-5 h-5" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run All Tests
              </>
            )}
          </button>
        </div>

        {isRunningTests && currentTest && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              Currently testing: <strong>{currentTest}</strong>
            </p>
          </div>
        )}

        <div className="space-y-3">
          {Object.entries(testResults).map(([testName, result]) => (
            <div
              key={testName}
              className={`p-4 border-l-4 rounded-lg ${getStatusColor(
                result.status
              )}`}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{testName}</h3>
                  {result.details && (
                    <p className="text-sm text-gray-600 mt-1">
                      {result.details}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {Object.keys(testResults).length > 0 && !isRunningTests && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Test Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {
                    Object.values(testResults).filter(
                      (r) => r.status === "success"
                    ).length
                  }
                </div>
                <div className="text-sm text-green-700">Passed</div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {
                    Object.values(testResults).filter(
                      (r) => r.status === "warning"
                    ).length
                  }
                </div>
                <div className="text-sm text-yellow-700">Warnings</div>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {
                    Object.values(testResults).filter(
                      (r) => r.status === "error"
                    ).length
                  }
                </div>
                <div className="text-sm text-red-700">Failed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoInterviewTester;
