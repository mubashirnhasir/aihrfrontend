/**
 * Video Recorder Component
 * Handles video recording with real-time preview and controls
 */
"use client";

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const VideoRecorder = forwardRef(
  ({ isRecording, onSuspiciousActivity }, ref) => {
    const [stream, setStream] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    // Recording state
    const [recordingDuration, setRecordingDuration] = useState(0);
    const recordingTimerRef = useRef(null);

    useEffect(() => {
      initializeCamera();
      return () => {
        cleanup();
      };
    }, []);

    useEffect(() => {
      if (isRecording) {
        startRecordingTimer();
      } else {
        stopRecordingTimer();
      }
    }, [isRecording]);

    const initializeCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 },
            facingMode: "user",
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            setIsInitialized(true);
            startFaceDetection();
          };
        }

        // Initialize MediaRecorder
        const recorder = new MediaRecorder(mediaStream, {
          mimeType: "video/webm;codecs=vp9,opus",
          videoBitsPerSecond: 2500000, // 2.5 Mbps
        });

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prev) => [...prev, event.data]);
          }
        };

        setMediaRecorder(recorder);
        setError(null);
      } catch (err) {
        console.error("Failed to initialize camera:", err);
        setError("Failed to access camera. Please check permissions.");
      }
    };

    const startFaceDetection = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const detectFrame = () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Draw current frame
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Perform basic face detection (simplified)
          detectSuspiciousActivity(ctx, canvas.width, canvas.height);
        }

        animationRef.current = requestAnimationFrame(detectFrame);
      };

      detectFrame();
    };

    const detectSuspiciousActivity = (ctx, width, height) => {
      // Basic detection logic - in production use proper face detection libraries
      const imageData = ctx.getImageData(0, 0, width, height);

      // Simulate face detection
      const faceDetected = checkForFace(imageData);
      const multiplePeopleDetected = checkForMultiplePeople(imageData);
      const screenDetected = checkForScreen(imageData);

      if (!faceDetected && isRecording) {
        onSuspiciousActivity({
          type: "NO_FACE_DETECTED",
          severity: "medium",
          description: "No face detected in video feed",
        });
      }

      if (multiplePeopleDetected && isRecording) {
        onSuspiciousActivity({
          type: "MULTIPLE_PEOPLE",
          severity: "high",
          description: "Multiple people detected in frame",
        });
      }

      if (screenDetected && isRecording) {
        onSuspiciousActivity({
          type: "SCREEN_DETECTED",
          severity: "high",
          description: "External screen or device detected",
        });
      }
    };

    // Simplified detection functions (use proper ML models in production)
    const checkForFace = (imageData) => {
      // Placeholder face detection
      return Math.random() > 0.1; // 90% chance of face detection
    };

    const checkForMultiplePeople = (imageData) => {
      // Placeholder multiple people detection
      return Math.random() > 0.95; // 5% chance of multiple people
    };

    const checkForScreen = (imageData) => {
      // Placeholder screen detection
      return Math.random() > 0.98; // 2% chance of screen detection
    };

    const startRecordingTimer = () => {
      setRecordingDuration(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    };

    const stopRecordingTimer = () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };

    const cleanup = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      startRecording: async () => {
        if (mediaRecorder && mediaRecorder.state === "inactive") {
          setRecordedChunks([]);
          mediaRecorder.start(1000); // Record in 1-second chunks
          return true;
        }
        return false;
      },

      stopRecording: async () => {
        return new Promise((resolve) => {
          if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.onstop = () => {
              const blob = new Blob(recordedChunks, { type: "video/webm" });
              resolve(blob);
            };
            mediaRecorder.stop();
          } else {
            resolve(null);
          }
        });
      },
    }));

    const formatDuration = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (error) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center text-red-600">
            <div className="text-4xl mb-4">📷</div>
            <h3 className="text-lg font-semibold mb-2">Camera Error</h3>
            <p>{error}</p>
            <button
              onClick={initializeCamera}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Video Header */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isRecording ? "bg-red-500 animate-pulse" : "bg-green-500"
              }`}
            ></div>
            <span className="font-semibold">
              {isRecording ? "Recording" : "Ready"}
            </span>
            {isRecording && (
              <span className="bg-red-600 px-2 py-1 rounded text-sm">
                {formatDuration(recordingDuration)}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <span>🎥 Video Interview</span>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative bg-gray-900" style={{ aspectRatio: "16/9" }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Hidden canvas for frame analysis */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Recording Overlay */}
          {isRecording && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>REC</span>
            </div>
          )}

          {/* Initialization Overlay */}
          {!isInitialized && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Initializing camera...</p>
              </div>
            </div>
          )}
        </div>

        {/* Video Controls */}
        <div className="p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Resolution: 1280x720 | Frame Rate: 30fps
            </div>

            <div className="flex items-center space-x-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  stream ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-gray-600">
                Camera {stream ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

VideoRecorder.displayName = "VideoRecorder";

export default VideoRecorder;
