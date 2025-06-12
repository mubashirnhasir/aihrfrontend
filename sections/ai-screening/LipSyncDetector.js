/**
 * Lip Sync Detector Component
 * Detects potential lip-sync fraud by analyzing audio-visual synchronization
 */
"use client";

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const LipSyncDetector = forwardRef(
  ({ onSuspiciousActivity, isActive }, ref) => {
    const [syncScore, setSyncScore] = useState(100);
    const [audioLevel, setAudioLevel] = useState(0);
    const [lipMovement, setLipMovement] = useState(0);
    const [syncStatus, setSyncStatus] = useState("good");
    const [isDetecting, setIsDetecting] = useState(false);
    const [detectionHistory, setDetectionHistory] = useState([]);

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const audioDataRef = useRef(null);
    const detectionIntervalRef = useRef(null);
    const syncHistoryRef = useRef([]);
    useEffect(() => {
      if (isActive && !isDetecting) {
        startDetection();
      } else if (!isActive && isDetecting) {
        stopDetection();
      } // Cleanup function
      return () => {
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
          detectionIntervalRef.current = null;
        }

        if (audioContextRef.current) {
          if (audioContextRef.current.state !== "closed") {
            audioContextRef.current.close().catch((error) => {
              console.warn("AudioContext cleanup warning:", error);
            });
          }
          audioContextRef.current = null;
        }
      };
    }, [isActive, isDetecting]);

    const startDetection = async () => {
      try {
        // Initialize audio analysis
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();

        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);

        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef.current.frequencyBinCount;
        audioDataRef.current = new Uint8Array(bufferLength);

        setIsDetecting(true);

        // Start detection loop
        detectionIntervalRef.current = setInterval(() => {
          performLipSyncAnalysis();
        }, 100); // 10 FPS analysis
      } catch (error) {
        console.error("Failed to start lip sync detection:", error);
      }
    };
    const stopDetection = () => {
      setIsDetecting(false);

      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }

      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current
          .close()
          .then(() => {
            audioContextRef.current = null;
          })
          .catch((error) => {
            console.warn("AudioContext close warning:", error);
            audioContextRef.current = null;
          });
      } else if (audioContextRef.current) {
        // AudioContext is already closed, just clear the reference
        audioContextRef.current = null;
      }
    };

    const performLipSyncAnalysis = () => {
      if (!analyserRef.current || !audioDataRef.current) return;

      // Get audio data
      analyserRef.current.getByteFrequencyData(audioDataRef.current);

      // Calculate audio level (simplified)
      const audioLevel = calculateAudioLevel(audioDataRef.current);
      setAudioLevel(audioLevel);

      // Simulate lip movement detection (in production, use facial landmark detection)
      const lipMovement = simulateLipMovementDetection();
      setLipMovement(lipMovement);

      // Analyze synchronization
      const syncData = analyzeSynchronization(audioLevel, lipMovement);
      updateSyncScore(syncData);

      // Store history
      syncHistoryRef.current.push({
        timestamp: Date.now(),
        audioLevel,
        lipMovement,
        syncScore: syncData.score,
        delay: syncData.delay,
      });

      // Keep only last 30 seconds
      const thirtySecondsAgo = Date.now() - 30000;
      syncHistoryRef.current = syncHistoryRef.current.filter(
        (data) => data.timestamp > thirtySecondsAgo
      );
    };

    const calculateAudioLevel = (audioData) => {
      let sum = 0;
      for (let i = 0; i < audioData.length; i++) {
        sum += audioData[i];
      }
      return sum / audioData.length / 255; // Normalize to 0-1
    };

    const simulateLipMovementDetection = () => {
      // In production, use facial landmark detection libraries like MediaPipe
      // This simulates realistic lip movement based on audio level with some delay
      const baseMovement = Math.random() * 0.3; // Base movement
      const audioInfluence = audioLevel * 0.7; // Audio-influenced movement
      const delay = Math.random() * 0.1; // Simulate natural delay

      return Math.min(1, baseMovement + audioInfluence + delay);
    };

    const analyzeSynchronization = (currentAudioLevel, currentLipMovement) => {
      // Calculate correlation between audio and lip movement
      const recentHistory = syncHistoryRef.current.slice(-20); // Last 2 seconds

      if (recentHistory.length < 10) {
        return { score: 100, delay: 0, correlation: 1 };
      }

      // Calculate cross-correlation with different delays
      const maxDelay = 5; // Maximum frames to check
      let bestCorrelation = -1;
      let bestDelay = 0;

      for (let delay = 0; delay <= maxDelay; delay++) {
        const correlation = calculateCorrelation(recentHistory, delay);
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestDelay = delay;
        }
      }

      // Calculate sync score based on correlation and delay
      let score = bestCorrelation * 100;

      // Penalize high delays (possible lip sync fraud)
      if (bestDelay > 2) {
        score -= (bestDelay - 2) * 20;
      }

      // Detect suspicious patterns
      const isUnnatural = detectUnnaturalPatterns(recentHistory);
      if (isUnnatural) {
        score -= 30;
      }

      return {
        score: Math.max(0, Math.min(100, score)),
        delay: bestDelay,
        correlation: bestCorrelation,
      };
    };

    const calculateCorrelation = (history, delay) => {
      if (history.length < delay + 10) return 0;

      const audioValues = history.map((h) => h.audioLevel);
      const lipValues = history.slice(delay).map((h) => h.lipMovement);
      const minLength = Math.min(audioValues.length, lipValues.length);

      if (minLength < 5) return 0;

      // Calculate Pearson correlation coefficient
      const audioMean =
        audioValues.slice(0, minLength).reduce((a, b) => a + b, 0) / minLength;
      const lipMean =
        lipValues.slice(0, minLength).reduce((a, b) => a + b, 0) / minLength;

      let numerator = 0;
      let audioSumSq = 0;
      let lipSumSq = 0;

      for (let i = 0; i < minLength; i++) {
        const audioDiff = audioValues[i] - audioMean;
        const lipDiff = lipValues[i] - lipMean;

        numerator += audioDiff * lipDiff;
        audioSumSq += audioDiff * audioDiff;
        lipSumSq += lipDiff * lipDiff;
      }

      const denominator = Math.sqrt(audioSumSq * lipSumSq);
      return denominator === 0 ? 0 : numerator / denominator;
    };

    const detectUnnaturalPatterns = (history) => {
      // Check for perfect correlation (too good to be true)
      const correlations = [];
      for (let i = 0; i < 3; i++) {
        correlations.push(calculateCorrelation(history, i));
      }

      const perfectCorrelation = correlations.some((c) => c > 0.98);
      const tooLowCorrelation = correlations.every((c) => c < 0.2);

      // Check for repetitive patterns
      const lipValues = history.map((h) => h.lipMovement);
      const isRepetitive = checkRepetitivePattern(lipValues);

      return perfectCorrelation || tooLowCorrelation || isRepetitive;
    };

    const checkRepetitivePattern = (values) => {
      if (values.length < 10) return false;

      // Check for overly repetitive patterns
      const variance = calculateVariance(values);
      return variance < 0.01; // Too little variation
    };

    const calculateVariance = (values) => {
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const squaredDiffs = values.map((value) => Math.pow(value - mean, 2));
      return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    };

    const updateSyncScore = (syncData) => {
      setSyncScore(syncData.score);

      // Update status
      let status = "good";
      if (syncData.score < 40) {
        status = "poor";
      } else if (syncData.score < 70) {
        status = "suspicious";
      }

      setSyncStatus(status);

      // Report suspicious activity
      if (syncData.score < 50) {
        onSuspiciousActivity({
          type: "LIP_SYNC_MISMATCH",
          severity: syncData.score < 30 ? "high" : "medium",
          description: `Poor lip sync detected (score: ${Math.round(
            syncData.score
          )}%)`,
          data: {
            syncScore: syncData.score,
            delay: syncData.delay,
            correlation: syncData.correlation,
          },
        });
      }

      if (syncData.delay > 3) {
        onSuspiciousActivity({
          type: "AUDIO_VIDEO_DELAY",
          severity: "high",
          description: `Significant audio-video delay detected (${syncData.delay} frames)`,
          data: { delay: syncData.delay },
        });
      }
    };
    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      startDetection: () => {
        if (!isDetecting) startDetection();
      },

      stopDetection: () => {
        const data = syncHistoryRef.current.slice();
        if (isDetecting) {
          stopDetection();
        }
        return data;
      },

      getSyncScore: () => syncScore,
      getSyncData: () => syncHistoryRef.current.slice(),
    }));

    const getStatusColor = (status) => {
      switch (status) {
        case "good":
          return "text-green-600 bg-green-100";
        case "suspicious":
          return "text-yellow-600 bg-yellow-100";
        case "poor":
          return "text-red-600 bg-red-100";
        default:
          return "text-gray-600 bg-gray-100";
      }
    };

    const getSyncScoreColor = (score) => {
      if (score >= 80) return "text-green-600";
      if (score >= 60) return "text-yellow-600";
      if (score >= 40) return "text-orange-600";
      return "text-red-600";
    };

    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            🗣️ Lip Sync Detection
          </h3>
          <div
            className={`w-3 h-3 rounded-full ${
              isDetecting ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
        </div>

        {isDetecting ? (
          <div className="space-y-4">
            {/* Sync Score */}
            <div className="text-center">
              <div
                className={`text-3xl font-bold ${getSyncScoreColor(syncScore)}`}
              >
                {Math.round(syncScore)}%
              </div>
              <div className="text-sm text-gray-500">Sync Score</div>
            </div>

            {/* Status */}
            <div
              className={`p-3 rounded-lg text-center ${getStatusColor(
                syncStatus
              )}`}
            >
              <div className="font-medium capitalize">{syncStatus}</div>
              <div className="text-xs mt-1">
                {syncStatus === "good" && "Natural lip sync detected"}
                {syncStatus === "suspicious" && "Some sync irregularities"}
                {syncStatus === "poor" && "Potential lip sync fraud"}
              </div>
            </div>

            {/* Real-time Indicators */}
            <div className="grid grid-cols-2 gap-3">
              {/* Audio Level */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-900">
                  Audio Level
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${audioLevel * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  {(audioLevel * 100).toFixed(1)}%
                </div>
              </div>

              {/* Lip Movement */}
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-purple-900">
                  Lip Movement
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${lipMovement * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-purple-700 mt-1">
                  {(lipMovement * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Sync Visualization */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-900 mb-2">
                Sync Pattern
              </div>{" "}
              <div className="flex items-end space-x-1 h-12">
                {syncHistoryRef.current.slice(-20).map((data, index) => (
                  <div
                    key={`sync-${Date.now()}-${index}-${Math.random()
                      .toString(36)
                      .substr(2, 5)}`}
                    className="flex-1 bg-gradient-to-t from-blue-400 to-purple-400 rounded-sm"
                    style={{
                      height: `${Math.max(2, data.syncScore)}%`,
                      opacity: 0.7 + (index / 20) * 0.3,
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Detection Stats */}
            <div className="text-xs text-gray-500 space-y-1">
              <div>Samples: {syncHistoryRef.current.length}</div>
              <div>
                Audio: {(audioLevel * 100).toFixed(1)}% | Lips:{" "}
                {(lipMovement * 100).toFixed(1)}%
              </div>
              <div>Status: {syncStatus} sync detected</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-3xl mb-2">🗣️</div>
            <p>Lip sync detection inactive</p>
            <p className="text-xs">Will start when recording begins</p>
          </div>
        )}
      </div>
    );
  }
);

LipSyncDetector.displayName = "LipSyncDetector";

export default LipSyncDetector;
