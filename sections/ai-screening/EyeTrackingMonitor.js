/**
 * Eye Tracking Monitor Component
 * Real-time eye movement detection and analysis for interview integrity
 */
"use client";

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const EyeTrackingMonitor = forwardRef(
  ({ onSuspiciousActivity, isActive }, ref) => {
    const [eyeData, setEyeData] = useState([]);
    const [currentGaze, setCurrentGaze] = useState({ x: 0, y: 0 });
    const [gazePattern, setGazePattern] = useState("normal");
    const [blinkRate, setBlinkRate] = useState(0);
    const [attentionScore, setAttentionScore] = useState(100);
    const [isTracking, setIsTracking] = useState(false);

    const trackingIntervalRef = useRef(null);
    const gazeHistoryRef = useRef([]);
    const blinkHistoryRef = useRef([]);
    const analysisIntervalRef = useRef(null);

    useEffect(() => {
      if (isActive && !isTracking) {
        startTracking();
      } else if (!isActive && isTracking) {
        stopTracking();
      }
    }, [isActive, isTracking]);

    const startTracking = () => {
      setIsTracking(true);

      // Simulate eye tracking data (in production, use WebGazer.js or similar)
      trackingIntervalRef.current = setInterval(() => {
        const newGazePoint = generateGazePoint();
        const blink = detectBlink();

        setCurrentGaze(newGazePoint);

        // Store gaze history
        gazeHistoryRef.current.push({
          ...newGazePoint,
          timestamp: Date.now(),
          blink,
        });

        // Keep only last 30 seconds of data
        const thirtySecondsAgo = Date.now() - 30000;
        gazeHistoryRef.current = gazeHistoryRef.current.filter(
          (point) => point.timestamp > thirtySecondsAgo
        );

        // Update blink history
        if (blink) {
          blinkHistoryRef.current.push(Date.now());
          blinkHistoryRef.current = blinkHistoryRef.current.filter(
            (time) => time > Date.now() - 60000 // Keep last minute
          );
        }
      }, 100); // 10 FPS tracking

      // Analysis interval
      analysisIntervalRef.current = setInterval(() => {
        analyzeGazePattern();
        calculateBlinkRate();
        updateAttentionScore();
      }, 5000); // Analyze every 5 seconds
    };

    const stopTracking = () => {
      setIsTracking(false);

      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }

      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };

    const generateGazePoint = () => {
      // Simulate realistic eye movement patterns
      const centerX = 0.5;
      const centerY = 0.4; // Slightly above center for natural camera gaze

      // Add some noise and natural drift
      const noise = 0.1;
      const drift = 0.05;

      return {
        x: Math.max(
          0,
          Math.min(
            1,
            centerX +
              (Math.random() - 0.5) * noise +
              (Math.random() - 0.5) * drift
          )
        ),
        y: Math.max(
          0,
          Math.min(
            1,
            centerY +
              (Math.random() - 0.5) * noise +
              (Math.random() - 0.5) * drift
          )
        ),
      };
    };

    const detectBlink = () => {
      // Simulate natural blink rate (15-20 blinks per minute)
      return Math.random() < 0.005; // ~0.5% chance per frame at 10 FPS
    };

    const analyzeGazePattern = () => {
      if (gazeHistoryRef.current.length < 50) return;

      const recentGaze = gazeHistoryRef.current.slice(-50);
      const gazeVariance = calculateGazeVariance(recentGaze);
      const offScreenTime = calculateOffScreenTime(recentGaze);
      const erraticMovements = detectErraticMovements(recentGaze);

      let pattern = "normal";
      let suspiciousActivity = null;

      // Check for suspicious patterns
      if (offScreenTime > 0.3) {
        // More than 30% time off-screen
        pattern = "distracted";
        suspiciousActivity = {
          type: "EXCESSIVE_LOOKING_AWAY",
          severity: "medium",
          description: `Looking away from camera ${(
            offScreenTime * 100
          ).toFixed(1)}% of the time`,
          data: { offScreenTime },
        };
      } else if (gazeVariance < 0.01) {
        // Too little movement (possibly fake)
        pattern = "static";
        suspiciousActivity = {
          type: "UNNATURAL_GAZE_PATTERN",
          severity: "high",
          description: "Unnaturally static gaze pattern detected",
          data: { gazeVariance },
        };
      } else if (erraticMovements > 0.4) {
        // Too many erratic movements
        pattern = "erratic";
        suspiciousActivity = {
          type: "ERRATIC_EYE_MOVEMENTS",
          severity: "medium",
          description: "Erratic eye movement pattern detected",
          data: { erraticMovements },
        };
      }

      setGazePattern(pattern);

      if (suspiciousActivity) {
        onSuspiciousActivity(suspiciousActivity);
      }
    };

    const calculateGazeVariance = (gazePoints) => {
      if (gazePoints.length < 2) return 0;

      const avgX =
        gazePoints.reduce((sum, p) => sum + p.x, 0) / gazePoints.length;
      const avgY =
        gazePoints.reduce((sum, p) => sum + p.y, 0) / gazePoints.length;

      const variance =
        gazePoints.reduce((sum, p) => {
          return sum + Math.pow(p.x - avgX, 2) + Math.pow(p.y - avgY, 2);
        }, 0) / gazePoints.length;

      return variance;
    };

    const calculateOffScreenTime = (gazePoints) => {
      const offScreenPoints = gazePoints.filter(
        (p) => p.x < 0.2 || p.x > 0.8 || p.y < 0.1 || p.y > 0.9
      );

      return offScreenPoints.length / gazePoints.length;
    };

    const detectErraticMovements = (gazePoints) => {
      if (gazePoints.length < 3) return 0;

      let erraticCount = 0;
      const threshold = 0.2; // Movement threshold

      for (let i = 2; i < gazePoints.length; i++) {
        const p1 = gazePoints[i - 2];
        const p2 = gazePoints[i - 1];
        const p3 = gazePoints[i];

        const dist1 = Math.sqrt(
          Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
        );
        const dist2 = Math.sqrt(
          Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2)
        );

        if (dist1 > threshold && dist2 > threshold) {
          erraticCount++;
        }
      }

      return erraticCount / (gazePoints.length - 2);
    };

    const calculateBlinkRate = () => {
      const oneMinuteAgo = Date.now() - 60000;
      const recentBlinks = blinkHistoryRef.current.filter(
        (time) => time > oneMinuteAgo
      );
      const rate = recentBlinks.length;

      setBlinkRate(rate);

      // Check for abnormal blink rates
      if (rate < 5 || rate > 40) {
        onSuspiciousActivity({
          type: "ABNORMAL_BLINK_RATE",
          severity: rate < 5 ? "high" : "medium",
          description: `Abnormal blink rate: ${rate} blinks/minute (normal: 15-20)`,
          data: { blinkRate: rate },
        });
      }
    };

    const updateAttentionScore = () => {
      let score = 100;

      // Reduce score based on various factors
      const offScreenTime = calculateOffScreenTime(
        gazeHistoryRef.current.slice(-50)
      );
      score -= offScreenTime * 50; // Up to -50 for looking away

      if (gazePattern === "static") score -= 30;
      if (gazePattern === "erratic") score -= 20;

      if (blinkRate < 5) score -= 25; // Too few blinks
      if (blinkRate > 35) score -= 15; // Too many blinks

      setAttentionScore(Math.max(0, Math.min(100, score)));
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      startTracking: () => {
        if (!isTracking) startTracking();
      },

      stopTracking: () => {
        const data = gazeHistoryRef.current.slice();
        stopTracking();
        return data;
      },

      getAttentionScore: () => attentionScore,
      getGazeData: () => gazeHistoryRef.current.slice(),
    }));

    const getPatternColor = (pattern) => {
      switch (pattern) {
        case "normal":
          return "text-green-600 bg-green-100";
        case "distracted":
          return "text-yellow-600 bg-yellow-100";
        case "static":
          return "text-red-600 bg-red-100";
        case "erratic":
          return "text-orange-600 bg-orange-100";
        default:
          return "text-gray-600 bg-gray-100";
      }
    };

    const getAttentionColor = (score) => {
      if (score >= 80) return "text-green-600 bg-green-100";
      if (score >= 60) return "text-yellow-600 bg-yellow-100";
      if (score >= 40) return "text-orange-600 bg-orange-100";
      return "text-red-600 bg-red-100";
    };

    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            👁️ Eye Tracking
          </h3>
          <div
            className={`w-3 h-3 rounded-full ${
              isTracking ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
        </div>

        {isTracking ? (
          <div className="space-y-4">
            {/* Gaze Visualization */}
            <div
              className="relative bg-gray-100 rounded-lg p-4"
              style={{ aspectRatio: "16/9" }}
            >
              <div className="text-xs text-gray-500 mb-2">Gaze Direction</div>
              <div className="relative w-full h-full bg-gray-200 rounded border-2 border-gray-300">
                {/* Camera representation */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-gray-400 rounded-sm"></div>

                {/* Gaze point */}
                <div
                  className="absolute w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
                  style={{
                    left: `${currentGaze.x * 100}%`,
                    top: `${currentGaze.y * 100}%`,
                  }}
                ></div>

                {/* Recent gaze trail */}
                {gazeHistoryRef.current.slice(-10).map((point, index) => (
                  <div
                    key={index}
                    className="absolute w-1 h-1 bg-blue-300 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${point.x * 100}%`,
                      top: `${point.y * 100}%`,
                      opacity: (index + 1) / 10,
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {/* Attention Score */}
              <div
                className={`p-3 rounded-lg ${getAttentionColor(
                  attentionScore
                )}`}
              >
                <div className="text-sm font-medium">Attention Score</div>
                <div className="text-2xl font-bold">
                  {Math.round(attentionScore)}%
                </div>
              </div>

              {/* Blink Rate */}
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <div className="text-sm font-medium">Blink Rate</div>
                <div className="text-2xl font-bold">{blinkRate}/min</div>
              </div>
            </div>

            {/* Gaze Pattern */}
            <div className={`p-3 rounded-lg ${getPatternColor(gazePattern)}`}>
              <div className="text-sm font-medium">Gaze Pattern</div>
              <div className="text-lg font-bold capitalize">{gazePattern}</div>
            </div>

            {/* Recent Activity */}
            <div className="text-xs text-gray-500">
              <div>Tracking: {gazeHistoryRef.current.length} points</div>
              <div>
                Current Position: ({(currentGaze.x * 100).toFixed(1)}%,{" "}
                {(currentGaze.y * 100).toFixed(1)}%)
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-3xl mb-2">👁️</div>
            <p>Eye tracking inactive</p>
            <p className="text-xs">Will start when recording begins</p>
          </div>
        )}
      </div>
    );
  }
);

EyeTrackingMonitor.displayName = "EyeTrackingMonitor";

export default EyeTrackingMonitor;
