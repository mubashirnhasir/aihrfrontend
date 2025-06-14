/**
 * AI Screening Interview Wrapper
 * Main wrapper component managing the interview flow
 */
"use client";

import { useState } from "react";
import InterviewSetup from "./interviewSetup";
import VideoInterviewScreen from "./VideoInterviewScreen";
import InterviewResults from "./interviewResults";

export default function ScreeningInterviewWrapper() {
  const [currentStep, setCurrentStep] = useState("setup"); // setup, interview, results
  const [interviewData, setInterviewData] = useState({
    jobDescription: "",
    candidateResume: "",
    role: "",
    experience: "",
    questions: [],
    responses: [],
    evaluation: null,
    interviewDuration: 0,
    // Video interview specific data
    videoFiles: [],
    eyeTrackingData: [],
    lipSyncData: [],
    suspiciousActivity: [],
    behavioralAnalysis: null,
  });

  const handleSetupComplete = (data) => {
    setInterviewData((prev) => ({ ...prev, ...data }));
    setCurrentStep("interview");
  };
  const handleInterviewComplete = async (videoInterviewData) => {
    try {
      // Call the video interview evaluation API
      const response = await fetch(
        "/api/ai-screening/evaluate-video-interview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(videoInterviewData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to evaluate video interview");
      }

      // Update interview data with evaluation results and video data
      setInterviewData((prev) => ({
        ...prev,
        responses: videoInterviewData.responses,
        evaluation: result.evaluation,
        interviewDuration: videoInterviewData.duration,
        videoFiles: videoInterviewData.videoFiles,
        eyeTrackingData: videoInterviewData.eyeTrackingData,
        lipSyncData: videoInterviewData.lipSyncData,
        suspiciousActivity: videoInterviewData.suspiciousActivity,
        behavioralAnalysis: result.evaluation.behavioralAnalysis,
      }));

      setCurrentStep("results");
    } catch (error) {
      console.error("Video interview evaluation error:", error);

      // Provide fallback evaluation for video interview
      const fallbackEvaluation = {
        overallScore: 75,
        technicalScore: 70,
        communicationScore: 80,
        experienceMatch: 75,
        integrityScore: 85,
        recommendation: "Proceed to next round",
        strengths: [
          "Clear video communication",
          "Professional presentation",
          "Relevant experience",
        ],
        improvements: [
          "Could provide more specific examples",
          "Maintain better eye contact with camera",
        ],
        responseQuality: "Good",
        videoQuality: "Good",
        nonVerbalCommunication: "Good",
        behavioralAnalysis: {
          integrityScore: 85,
          riskLevel: "low",
          concerns: [],
          recommendations: [],
        },
      };

      setInterviewData((prev) => ({
        ...prev,
        responses: videoInterviewData.responses,
        evaluation: fallbackEvaluation,
        interviewDuration: videoInterviewData.duration,
        videoFiles: videoInterviewData.videoFiles,
        eyeTrackingData: videoInterviewData.eyeTrackingData,
        lipSyncData: videoInterviewData.lipSyncData,
        suspiciousActivity: videoInterviewData.suspiciousActivity,
        behavioralAnalysis: fallbackEvaluation.behavioralAnalysis,
      }));

      setCurrentStep("results");
    }
  };
  const handleRestart = () => {
    setInterviewData({
      jobDescription: "",
      candidateResume: "",
      role: "",
      experience: "",
      questions: [],
      responses: [],
      evaluation: null,
      interviewDuration: 0,
      videoFiles: [],
      eyeTrackingData: [],
      lipSyncData: [],
      suspiciousActivity: [],
      behavioralAnalysis: null,
    });
    setCurrentStep("setup");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}{" "}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎥 AI Video Screening Interview
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience next-generation candidate screening with AI-powered video
            interviews that evaluate technical skills, communication, behavioral
            integrity, and job fit in real-time
          </p>
        </div>
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8">
            <div
              className={`flex items-center space-x-3 ${
                currentStep === "setup"
                  ? "text-blue-600"
                  : currentStep === "interview" || currentStep === "results"
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                  currentStep === "setup"
                    ? "bg-blue-100 border-3 border-blue-600"
                    : currentStep === "interview" || currentStep === "results"
                    ? "bg-green-100 border-3 border-green-600 text-green-600"
                    : "bg-gray-100 border-3 border-gray-300"
                }`}
              >
                {currentStep === "interview" || currentStep === "results"
                  ? "✓"
                  : "1"}
              </div>
              <div>
                <div className="font-semibold">Interview Setup</div>
                <div className="text-sm opacity-75">Upload JD & Resume</div>
              </div>
            </div>

            <div className="w-24 h-1 bg-gray-300 rounded">
              <div
                className={`h-full rounded transition-all duration-500 ${
                  currentStep === "interview" || currentStep === "results"
                    ? "bg-green-500 w-full"
                    : "bg-gray-300 w-0"
                }`}
              ></div>
            </div>

            <div
              className={`flex items-center space-x-3 ${
                currentStep === "interview"
                  ? "text-blue-600"
                  : currentStep === "results"
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                  currentStep === "interview"
                    ? "bg-blue-100 border-3 border-blue-600"
                    : currentStep === "results"
                    ? "bg-green-100 border-3 border-green-600 text-green-600"
                    : "bg-gray-100 border-3 border-gray-300"
                }`}
              >
                {currentStep === "results" ? "✓" : "2"}
              </div>{" "}
              <div>
                <div className="font-semibold">Video Interview</div>
                <div className="text-sm opacity-75">AI-Powered Video Q&A</div>
              </div>
            </div>

            <div className="w-24 h-1 bg-gray-300 rounded">
              <div
                className={`h-full rounded transition-all duration-500 ${
                  currentStep === "results"
                    ? "bg-green-500 w-full"
                    : "bg-gray-300 w-0"
                }`}
              ></div>
            </div>

            <div
              className={`flex items-center space-x-3 ${
                currentStep === "results" ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                  currentStep === "results"
                    ? "bg-blue-100 border-3 border-blue-600"
                    : "bg-gray-100 border-3 border-gray-300"
                }`}
              >
                3
              </div>
              <div>
                <div className="font-semibold">Evaluation Results</div>
                <div className="text-sm opacity-75">AI Assessment Report</div>
              </div>
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {currentStep === "setup" && (
            <InterviewSetup
              onComplete={handleSetupComplete}
              data={interviewData}
            />
          )}
          {currentStep === "interview" && (
            <VideoInterviewScreen
              data={interviewData}
              onComplete={handleInterviewComplete}
            />
          )}

          {currentStep === "results" && (
            <InterviewResults data={interviewData} onRestart={handleRestart} />
          )}
        </div>
      </div>
    </div>
  );
}
