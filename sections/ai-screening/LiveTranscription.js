/**
 * Live Speech Transcription Component
 * Shows real-time speech-to-text during video recording
 */
"use client";

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const LiveTranscription = forwardRef(
  ({ isActive, onTranscriptUpdate }, ref) => {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [confidence, setConfidence] = useState(0);
    const [interimText, setInterimText] = useState("");
    const [isRestarting, setIsRestarting] = useState(false);

    const recognitionRef = useRef(null);
    const finalTranscriptRef = useRef("");
    const restartAttempts = useRef(0);
    const maxRestartAttempts = 3;    useEffect(() => {
      if (isActive && !isListening && !isRestarting) {
        startTranscription();
      } else if (!isActive && (isListening || isRestarting)) {
        stopTranscription();
      }

      return () => {
        if (recognitionRef.current && (isListening || isRestarting)) {
          recognitionRef.current.stop();
          setIsListening(false);
          setIsRestarting(false);
        }
      };
    }, [isActive]);const startTranscription = async () => {
      if (
        !("webkitSpeechRecognition" in window) &&
        !("SpeechRecognition" in window)
      ) {
        console.warn("Speech Recognition not supported");
        return;
      }

      // Reset restart attempts when starting fresh
      restartAttempts.current = 0;
      setIsRestarting(false);

      try {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();

        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onstart = () => {
          console.log("🎤 Live transcription started");
          setIsListening(true);
        };

        recognitionRef.current.onresult = (event) => {
          let finalText = "";
          let interimText = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];

            if (result.isFinal) {
              finalText += result[0].transcript + " ";
              setConfidence(result[0].confidence);
            } else {
              interimText += result[0].transcript;
            }
          }          if (finalText) {
            finalTranscriptRef.current += finalText;
            setTranscript(finalTranscriptRef.current);
            if (typeof onTranscriptUpdate === 'function') {
              onTranscriptUpdate(finalTranscriptRef.current);
            }
          }

          setInterimText(interimText);
        };        recognitionRef.current.onerror = (event) => {
          console.error("🚨 Speech recognition error:", event.error);
          
          // Handle common speech recognition errors
          if (event.error === "not-allowed") {
            alert(
              "Microphone access denied. Please allow microphone access for speech transcription."
            );
            setIsListening(false);
          } else if (event.error === "aborted") {
            console.log("Speech recognition was aborted");
            
            // Only attempt restart if we haven't exceeded max attempts and we should be listening
            if (isActive && !isRestarting && restartAttempts.current < maxRestartAttempts) {
              console.log(`Attempting restart ${restartAttempts.current + 1}/${maxRestartAttempts}...`);
              setIsRestarting(true);
              restartAttempts.current += 1;
              
              setTimeout(() => {
                if (isActive && recognitionRef.current) {
                  try {
                    recognitionRef.current.start();
                    setIsRestarting(false);
                  } catch (e) {
                    console.error("Failed to restart speech recognition:", e);
                    setIsListening(false);
                    setIsRestarting(false);
                  }
                } else {
                  setIsRestarting(false);
                }
              }, 2000);
            } else {
              console.log("Max restart attempts reached or not active, stopping recognition");
              setIsListening(false);
              setIsRestarting(false);
            }
          } else {
            console.log(`Speech recognition error: ${event.error}`);
            setIsListening(false);
          }
        };        recognitionRef.current.onend = () => {
          console.log("🎤 Live transcription ended");
          setIsListening(false);
          setInterimText("");
          setIsRestarting(false);
          
          // Reset restart attempts when recognition ends normally
          if (!isActive) {
            restartAttempts.current = 0;
          }
        };

        recognitionRef.current.start();
      } catch (error) {
        console.error("🚨 Failed to start transcription:", error);
      }
    };    const stopTranscription = () => {
      if (recognitionRef.current && (isListening || isRestarting)) {
        recognitionRef.current.stop();
        setIsListening(false);
        setInterimText("");
        setIsRestarting(false);
        restartAttempts.current = 0;
      }
    };    const clearTranscript = () => {
      finalTranscriptRef.current = "";
      setTranscript("");
      setInterimText("");
      restartAttempts.current = 0;
      if (typeof onTranscriptUpdate === 'function') {
        onTranscriptUpdate("");
      }
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      getTranscript: () => finalTranscriptRef.current,
      clearTranscript,
      startTranscription,
      stopTranscription,
    }));

    return (
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            🎤 Live Transcription
          </h3>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isListening ? "bg-red-500 animate-pulse" : "bg-gray-400"
              }`}
            ></div>            <span className="text-sm text-gray-600">
              {isRestarting ? "Restarting..." : isListening ? "Listening..." : "Not active"}
            </span>
          </div>
        </div>

        {isActive ? (
          <div className="space-y-3">
            {/* Live transcript display */}
            <div className="bg-gray-50 border rounded-lg p-4 min-h-[120px] max-h-[200px] overflow-y-auto">
              {transcript || interimText ? (
                <div className="text-sm">
                  {/* Final transcript */}
                  <span className="text-gray-900">{transcript}</span>
                  {/* Interim transcript */}
                  <span className="text-gray-500 italic">{interimText}</span>
                  {isListening && !transcript && !interimText && (
                    <span className="text-gray-400">
                      Start speaking to see live transcription...
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 text-sm text-center py-8">
                  {isListening
                    ? "Listening for speech..."
                    : "Transcription will appear here"}
                </div>
              )}
            </div>

            {/* Transcription stats */}
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Words:{" "}
                {
                  transcript
                    .trim()
                    .split(/\s+/)
                    .filter((w) => w.length > 0).length
                }
              </span>
              {confidence > 0 && (
                <span>Confidence: {Math.round(confidence * 100)}%</span>
              )}
              <span>Status: {isRestarting ? "🔄 Restarting" : isListening ? "🔴 Recording" : "⏸️ Paused"}</span>
            </div>

            {/* Clear button */}
            {transcript && (
              <button
                onClick={clearTranscript}
                className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Clear Transcript
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-3xl mb-2">🎤</div>
            <p>Live transcription inactive</p>
            <p className="text-xs">Will start when recording begins</p>
          </div>
        )}
      </div>
    );
  }
);

LiveTranscription.displayName = "LiveTranscription";

export default LiveTranscription;
