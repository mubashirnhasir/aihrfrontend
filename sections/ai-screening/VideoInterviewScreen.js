/**
 * Video Interview Screen Component
 * Handles video recording, real-time monitoring, and AI evaluation
 */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import VideoRecorder from "./VideoRecorder";
import EyeTrackingMonitor from "./EyeTrackingMonitor";
import LipSyncDetector from "./LipSyncDetector";
import InterviewAnalytics from "./InterviewAnalytics";
import LiveTranscription from "./LiveTranscription";

export default function VideoInterviewScreen({ data = {}, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [isRecording, setIsRecording] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [microphonePermission, setMicrophonePermission] = useState(null);
  // Monitoring states
  const [eyeTrackingData, setEyeTrackingData] = useState([]);
  const [lipSyncData, setLipSyncData] = useState([]);
  const [suspiciousActivity, setSuspiciousActivity] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState("");

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const videoRecorderRef = useRef(null);
  const eyeTrackerRef = useRef(null);
  const lipSyncRef = useRef(null);
  const liveTranscriptionRef = useRef(null);

  const questions = data?.questions || [
    {
      id: 1,
      question: "Tell me about yourself and your professional background.",
      category: "Introduction",
      duration: 180, // 3 minutes
      expectedKeywords: ["experience", "background", "skills", "career"],
    },
    {
      id: 2,
      question: "What interests you most about this role and our company?",
      category: "Motivation",
      duration: 120,
      expectedKeywords: ["company", "role", "interest", "motivation"],
    },
    {
      id: 3,
      question:
        "Describe a challenging project you've worked on and how you overcame obstacles.",
      category: "Problem Solving",
      duration: 240,
      expectedKeywords: ["challenge", "project", "solution", "overcome"],
    },
    {
      id: 4,
      question: "How do you handle working under pressure and tight deadlines?",
      category: "Work Style",
      duration: 120,
      expectedKeywords: ["pressure", "deadline", "management", "stress"],
    },
    {
      id: 5,
      question: "Where do you see yourself in the next 3-5 years?",
      category: "Career Goals",
      duration: 120,
      expectedKeywords: ["future", "goals", "career", "growth"],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  // Initialize permissions and setup
  useEffect(() => {
    checkMediaPermissions();
  }, []);

  // Timer management
  useEffect(() => {
    if (interviewStarted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleCompleteInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [interviewStarted, timeRemaining]);

  const checkMediaPermissions = async () => {
    try {
      // Check camera permission
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setCameraPermission(true);
      setMicrophonePermission(true);

      // Stop the test stream
      videoStream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Media permission error:", error);
      setCameraPermission(false);
      setMicrophonePermission(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const startInterview = async () => {
    if (!cameraPermission || !microphonePermission) {
      alert(
        "Camera and microphone permissions are required for the video interview."
      );
      return;
    }

    setInterviewStarted(true);
    setShowGuidelines(false);
    startTimeRef.current = Date.now();

    // Start recording for the first question
    await startQuestionRecording();
  };

  const startQuestionRecording = async () => {
    try {
      setIsRecording(true);

      // Start video recording
      if (videoRecorderRef.current) {
        await videoRecorderRef.current.startRecording();
      }

      // Start monitoring systems
      if (eyeTrackerRef.current) {
        eyeTrackerRef.current.startTracking();
      }
      if (lipSyncRef.current) {
        lipSyncRef.current.startDetection();
      }

      // Start live transcription
      if (liveTranscriptionRef.current) {
        liveTranscriptionRef.current.startTranscription();
      }
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert(
        "Failed to start recording. Please check your camera and microphone."
      );
    }
  };

  const stopQuestionRecording = async () => {
    try {
      setIsRecording(false);

      // Stop video recording and get file
      let videoBlob = null;
      if (videoRecorderRef.current) {
        videoBlob = await videoRecorderRef.current.stopRecording();
      }

      // Stop monitoring systems
      if (eyeTrackerRef.current) {
        const eyeData = eyeTrackerRef.current.stopTracking();
        setEyeTrackingData((prev) => [...prev, ...eyeData]);
      }
      if (lipSyncRef.current) {
        const lipData = lipSyncRef.current.stopDetection();
        setLipSyncData((prev) => [...prev, ...lipData]);
      }

      // Stop live transcription and get final transcript
      let liveTranscript = "";
      if (liveTranscriptionRef.current) {
        liveTranscriptionRef.current.stopTranscription();
        liveTranscript = liveTranscriptionRef.current.getTranscript();
      }

      if (videoBlob) {
        // Save video file locally
        const videoFile = await saveVideoLocally(
          videoBlob,
          currentQuestionIndex
        );
        setVideoFiles((prev) => [...prev, videoFile]);      // Use live transcript or extract from video as fallback
        let transcript = liveTranscript?.trim() || '';
        if (!transcript || transcript.length < 5) {
          console.log("📝 Live transcript too short, extracting from video...");
          try {
            transcript = await extractSpeechFromVideo(videoBlob);
          } catch (error) {
            console.error("Failed to extract speech from video:", error);
            transcript = "Speech extraction failed: " + error.message;
          }
        }

        console.log("📝 Final transcript for question:", transcript);

        // Store response data
        const responseData = {
          questionId: currentQuestion.id,
          question: currentQuestion.question,
          transcript: transcript,
          category: currentQuestion.category,
          videoFile: videoFile,
          timestamp: Date.now(),
          duration: currentQuestion.duration,
          wordCount: transcript
            .trim()
            .split(/\s+/)
            .filter((w) => w.length > 0).length,
        };

        setResponses((prev) => [...prev, responseData]);

        // Clear transcript for next question
        if (liveTranscriptionRef.current) {
          liveTranscriptionRef.current.clearTranscript();
        }
        setCurrentTranscript("");
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };
  const saveVideoLocally = async (videoBlob, questionIndex) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `interview_q${questionIndex + 1}_${timestamp}.webm`;

    try {
      console.log("💾 Saving video to IndexedDB...", fileName);

      // Save to IndexedDB for persistent storage
      const videoId = await saveToIndexedDB(videoBlob, fileName, questionIndex);

      // Also create a blob URL for immediate use
      const videoUrl = URL.createObjectURL(videoBlob);

      console.log("✅ Video saved successfully:", {
        fileName,
        videoId,
        size: videoBlob.size,
      });

      return {
        fileName,
        url: videoUrl,
        blob: videoBlob,
        size: videoBlob.size,
        questionIndex,
        storedId: videoId,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("🚨 Error saving video:", error);

      // Fallback to blob URL only
      const videoUrl = URL.createObjectURL(videoBlob);
      return {
        fileName,
        url: videoUrl,
        blob: videoBlob,
        size: videoBlob.size,
        questionIndex,
        storedId: null,
        timestamp: Date.now(),
        error: error.message,
      };
    }
  };
  const saveToIndexedDB = (videoBlob, fileName, questionIndex) => {
    return new Promise((resolve, reject) => {
      // First, check the current version of the database
      const openRequest = indexedDB.open("VideoInterviewDB");
      
      openRequest.onsuccess = (event) => {
        const db = event.target.result;
        const currentVersion = db.version;
        db.close();
        
        // Now open with the current version or increment if needed
        const request = indexedDB.open("VideoInterviewDB", currentVersion);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("videos")) {
            const store = db.createObjectStore("videos", {
              keyPath: "id",
              autoIncrement: true,
            });
            store.createIndex("fileName", "fileName", { unique: false });
            store.createIndex("questionIndex", "questionIndex", {
              unique: false,
            });
            store.createIndex("timestamp", "timestamp", { unique: false });
          }
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          
          // Check if the videos object store exists
          if (!db.objectStoreNames.contains("videos")) {
            // If it doesn't exist, we need to upgrade the database
            db.close();
            const upgradeRequest = indexedDB.open("VideoInterviewDB", currentVersion + 1);
            
            upgradeRequest.onupgradeneeded = (event) => {
              const db = event.target.result;
              const store = db.createObjectStore("videos", {
                keyPath: "id",
                autoIncrement: true,
              });
              store.createIndex("fileName", "fileName", { unique: false });
              store.createIndex("questionIndex", "questionIndex", {
                unique: false,
              });
              store.createIndex("timestamp", "timestamp", { unique: false });
            };
            
            upgradeRequest.onsuccess = (event) => {
              saveVideoToStore(event.target.result);
            };
            
            upgradeRequest.onerror = () => {
              console.error("🚨 Failed to upgrade IndexedDB:", upgradeRequest.error);
              reject(upgradeRequest.error);
            };
          } else {
            saveVideoToStore(db);
          }
        };

        request.onerror = () => {
          console.error("🚨 Failed to open IndexedDB:", request.error);
          reject(request.error);
        };
      };
      
      openRequest.onerror = () => {
        // If database doesn't exist, create it with version 1
        const request = indexedDB.open("VideoInterviewDB", 1);
        
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          const store = db.createObjectStore("videos", {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("fileName", "fileName", { unique: false });
          store.createIndex("questionIndex", "questionIndex", {
            unique: false,
          });
          store.createIndex("timestamp", "timestamp", { unique: false });
        };

        request.onsuccess = (event) => {
          saveVideoToStore(event.target.result);
        };

        request.onerror = () => {
          console.error("🚨 Failed to create IndexedDB:", request.error);
          reject(request.error);
        };
      };
      
      function saveVideoToStore(db) {
        try {
          const transaction = db.transaction(["videos"], "readwrite");
          const store = transaction.objectStore("videos");

          const videoData = {
            fileName,
            videoBlob,
            questionIndex,
            timestamp: Date.now(),
            size: videoBlob.size,
            type: videoBlob.type,
          };

          const addRequest = store.add(videoData);

          addRequest.onsuccess = () => {
            console.log(
              "✅ Video saved to IndexedDB with ID:",
              addRequest.result
            );
            resolve(addRequest.result);
          };

          addRequest.onerror = () => {
            console.error(
              "🚨 Failed to save video to IndexedDB:",
              addRequest.error
            );
            reject(addRequest.error);
          };

          transaction.oncomplete = () => {
            db.close();
          };
          
          transaction.onerror = () => {
            console.error("🚨 Transaction failed:", transaction.error);
            reject(transaction.error);
          };
        } catch (error) {
          console.error("🚨 Error in saveVideoToStore:", error);
          reject(error);
        }
      }
    });
  };
  const extractSpeechFromVideo = async (videoBlob) => {
    try {
      console.log("🎤 Starting real speech-to-text extraction...");

      // Check if browser supports Speech Recognition
      if (
        !("webkitSpeechRecognition" in window) &&
        !("SpeechRecognition" in window)
      ) {
        console.warn("Speech Recognition not supported, using fallback");
        return "Speech recognition not supported in this browser.";
      }

      // Create audio element from video
      const video = document.createElement("video");
      video.src = URL.createObjectURL(videoBlob);
      video.muted = false;

      return new Promise((resolve, reject) => {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "en-US";
        recognition.maxAlternatives = 1;

        let transcript = "";
        let isRecognitionActive = false;

        recognition.onstart = () => {
          console.log("🎤 Speech recognition started");
          isRecognitionActive = true;
        };

        recognition.onresult = (event) => {
          console.log("🎤 Speech recognition result received");
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcript += event.results[i][0].transcript + " ";
              console.log("📝 Transcript so far:", transcript);
            }
          }
        };        recognition.onerror = (event) => {
          console.error("🚨 Speech recognition error:", event.error);
          
          // For "aborted" errors, we don't necessarily want to stop processing
          if (event.error === "aborted") {
            console.log("Speech recognition was aborted during extraction, continuing...");
            // We don't resolve here, allowing onend to handle it
          } else {
            // For other errors, resolve with what we have so far
            if (transcript.trim()) {
              resolve(transcript.trim());
            } else {
              resolve("Could not extract speech from video audio.");
            }
          }
        };

        recognition.onend = () => {
          console.log("🎤 Speech recognition ended");
          isRecognitionActive = false;
          const finalTranscript = transcript.trim();
          console.log("📝 Final transcript:", finalTranscript);

          if (finalTranscript) {
            resolve(finalTranscript);
          } else {
            resolve("No speech detected in video audio.");
          }
        };

        // Start recognition when video is ready
        video.onloadeddata = () => {
          console.log("📹 Video loaded, starting speech recognition...");
          try {
            recognition.start();
            video.play();

            // Stop recognition when video ends
            video.onended = () => {
              console.log("📹 Video ended, stopping recognition...");
              if (isRecognitionActive) {
                recognition.stop();
              }
            };

            // Fallback timeout (max 5 minutes)
            setTimeout(() => {
              if (isRecognitionActive) {
                console.log("⏰ Recognition timeout, stopping...");
                recognition.stop();
              }
            }, 300000);
          } catch (error) {
            console.error("🚨 Error starting recognition:", error);
            reject(error);
          }
        };

        video.onerror = (error) => {
          console.error("🚨 Video loading error:", error);
          reject(error);
        };
      });
    } catch (error) {
      console.error("🚨 Speech extraction failed:", error);
      return "Failed to extract speech from video: " + error.message;
    }
  };

  const handleNextQuestion = async () => {
    await stopQuestionRecording();

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);

      // Brief pause between questions
      setTimeout(async () => {
        await startQuestionRecording();
      }, 3000);
    } else {
      handleCompleteInterview();
    }
  };

  const handleCompleteInterview = async () => {
    if (isRecording) {
      await stopQuestionRecording();
    }

    const duration = Date.now() - startTimeRef.current;

    // Prepare comprehensive evaluation data
    const evaluationData = {
      responses,
      videoFiles,
      eyeTrackingData,
      lipSyncData,
      suspiciousActivity,
      duration,
      jobDescription: data.jobDescription,
      candidateResume: data.candidateResume,
      role: data.role,
      experience: data.experience,
    };

    onComplete(evaluationData);
  };
  const handleSuspiciousActivity = useCallback(
    (activity) => {
      setSuspiciousActivity((prev) => [
        ...prev,
        {
          ...activity,
          timestamp: Date.now(),
          questionIndex: currentQuestionIndex,
        },
      ]);
    },
    [currentQuestionIndex]
  );

  const handleTranscriptUpdate = useCallback((transcript) => {
    setCurrentTranscript(transcript);
  }, []);

  if (showGuidelines) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            🎥 Video Interview Guidelines
          </h2>

          <div className="space-y-6">
            {/* Permission Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Camera & Microphone Status
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      cameraPermission ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span>
                    Camera: {cameraPermission ? "Ready" : "Not Permitted"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      microphonePermission ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span>
                    Microphone:{" "}
                    {microphonePermission ? "Ready" : "Not Permitted"}
                  </span>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  ✅ Do's
                </h3>
                <ul className="space-y-2 text-green-800">
                  <li>• Sit in a well-lit, quiet environment</li>
                  <li>• Look directly at the camera when speaking</li>
                  <li>• Speak clearly and at a moderate pace</li>
                  <li>• Maintain professional posture</li>
                  <li>• Answer questions thoroughly</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-900 mb-3">
                  ❌ Don'ts
                </h3>
                <ul className="space-y-2 text-red-800">
                  <li>• Don't look away frequently</li>
                  <li>• Don't have multiple people in frame</li>
                  <li>• Don't use external devices or screens</li>
                  <li>• Don't move out of camera view</li>
                  <li>• Don't have background noise</li>
                </ul>
              </div>
            </div>

            {/* AI Monitoring Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                🤖 AI Monitoring
              </h3>
              <p className="text-yellow-800">
                This interview uses AI to monitor eye movements, detect lip sync
                authenticity, and ensure interview integrity. Any suspicious
                activity will be flagged for review.
              </p>
            </div>

            {/* Interview Structure */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📋 Interview Structure
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Total Time:</strong> {formatTime(timeRemaining)}
                </p>
                <p>
                  <strong>Questions:</strong> {questions.length}
                </p>
                <p>
                  <strong>Format:</strong> Video responses to verbal questions
                </p>
                <p>
                  <strong>Evaluation:</strong> AI-powered analysis of responses
                  and behavior
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={startInterview}
              disabled={!cameraPermission || !microphonePermission}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cameraPermission && microphonePermission
                ? "Start Video Interview"
                : "Please Allow Camera & Microphone Access"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Interview Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            <p className="text-gray-600">{currentQuestion.category}</p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-sm text-gray-500">Time Remaining</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Interview Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Recording Area */}
          <VideoRecorder
            ref={videoRecorderRef}
            isRecording={isRecording}
            onSuspiciousActivity={handleSuspiciousActivity}
          />
          {/* Question Display */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Current Question:
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              {currentQuestion.question}
            </p>

            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Recommended time: {formatTime(currentQuestion.duration)}
              </div>

              <button
                onClick={handleNextQuestion}
                disabled={!isRecording}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "Complete Interview"}
              </button>
            </div>
          </div>

          {/* Live Transcription */}
          <LiveTranscription
            ref={liveTranscriptionRef}
            isActive={isRecording}
            onTranscriptUpdate={handleTranscriptUpdate}
          />
        </div>

        {/* Monitoring Panel */}
        <div className="space-y-6">
          {/* Eye Tracking Monitor */}
          <EyeTrackingMonitor
            ref={eyeTrackerRef}
            onSuspiciousActivity={handleSuspiciousActivity}
            isActive={isRecording}
          />

          {/* Lip Sync Detector */}
          <LipSyncDetector
            ref={lipSyncRef}
            onSuspiciousActivity={handleSuspiciousActivity}
            isActive={isRecording}
          />

          {/* Real-time Analytics */}
          <InterviewAnalytics
            suspiciousActivity={suspiciousActivity}
            eyeTrackingData={eyeTrackingData}
            lipSyncData={lipSyncData}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        </div>
      </div>
    </div>
  );
}
