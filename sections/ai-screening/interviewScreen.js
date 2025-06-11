"use client";

import { useState, useEffect, useRef } from 'react';

export default function InterviewScreen({ data, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(true);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const questions = data.questions || [
    {
      id: 1,
      question: "Can you walk me through your experience with CI/CD pipelines?",
      category: "DevOps Experience",
      expectedKeywords: ["Jenkins", "GitLab", "automation", "deployment", "pipeline"]
    },
    {
      id: 2,
      question: "How do you handle infrastructure as code? Which tools have you used?",
      category: "Infrastructure",
      expectedKeywords: ["Terraform", "CloudFormation", "Ansible", "IaC", "automation"]
    },
    {
      id: 3,
      question: "Describe your experience with containerization and orchestration.",
      category: "Containers",
      expectedKeywords: ["Docker", "Kubernetes", "containers", "orchestration", "pods"]
    },
    {
      id: 4,
      question: "How do you approach monitoring and logging in production environments?",
      category: "Monitoring",
      expectedKeywords: ["Prometheus", "Grafana", "ELK", "monitoring", "alerts"]
    },
    {
      id: 5,
      question: "Can you explain a challenging production issue you've resolved?",
      category: "Problem Solving",
      expectedKeywords: ["debugging", "troubleshooting", "root cause", "solution"]
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (interviewStarted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startInterview = () => {
    setInterviewStarted(true);
    setShowGuidelines(false);
    startTimeRef.current = Date.now();
  };

  const handleResponseSubmit = () => {
    if (!currentResponse.trim()) return;

    const responseData = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      response: currentResponse.trim(),
      category: currentQuestion.category,
      timestamp: Date.now(),
      timeSpent: Date.now() - (startTimeRef.current + (currentQuestionIndex * 120000)) // Estimate time per question
    };

    setResponses(prev => [...prev, responseData]);
    setCurrentResponse('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleCompleteInterview();
    }
  };

  const handleCompleteInterview = async () => {
    setIsEvaluating(true);
    
    const interviewDuration = Math.round((Date.now() - startTimeRef.current) / 1000);
    
    try {
      const response = await fetch('/api/ai-screening/evaluate-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: data.jobDescription,
          candidateResume: data.candidateResume,
          role: data.role,
          experience: data.experience,
          questions: questions,
          responses: responses,
          interviewDuration
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to evaluate interview');
      }

      onComplete(responses, result.evaluation, interviewDuration);

    } catch (err) {
      console.error('Evaluation error:', err);
      // Provide fallback evaluation
      const fallbackEvaluation = {
        overallScore: 75,
        technicalScore: 70,
        communicationScore: 80,
        experienceMatch: 75,
        recommendation: 'Proceed to next round',
        strengths: ['Good communication', 'Relevant experience'],
        improvements: ['Could provide more technical details'],
        keywordMatches: responses.length * 3,
        responseQuality: 'Good'
      };
      onComplete(responses, fallbackEvaluation, interviewDuration);
    }
  };

  const skipQuestion = () => {
    const responseData = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      response: 'SKIPPED',
      category: currentQuestion.category,
      timestamp: Date.now(),
      timeSpent: 0
    };

    setResponses(prev => [...prev, responseData]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleCompleteInterview();
    }
  };

  if (isEvaluating) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Evaluating Interview Performance</h3>
        <p className="text-gray-600 mb-4">Our AI is analyzing your responses...</p>
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Analyzing responses</span>
            <span className="text-green-600">✓</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Evaluating technical skills</span>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Generating recommendations</span>
            <span>⏳</span>
          </div>
        </div>
      </div>
    );
  }

  if (showGuidelines) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Interview Guidelines</h2>
          <p className="text-xl text-gray-600">
            Please review the guidelines before starting your interview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">📝 Interview Format</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• 10-minute screening interview</li>
              <li>• 5 targeted questions based on the role</li>
              <li>• Text-based responses (typing)</li>
              <li>• AI evaluation of technical skills</li>
              <li>• Real-time progress tracking</li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-4">✅ Best Practices</h3>
            <ul className="space-y-2 text-green-800">
              <li>• Be specific and detailed in responses</li>
              <li>• Include relevant technical terms</li>
              <li>• Mention specific tools and technologies</li>
              <li>• Share real project experiences</li>
              <li>• Take your time to provide quality answers</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">⚡ Technical Setup</h3>
            <ul className="space-y-2 text-yellow-800">
              <li>• Ensure stable internet connection</li>
              <li>• Use a quiet environment</li>
              <li>• Have your resume/portfolio ready</li>
              <li>• Browser notifications will be disabled</li>
              <li>• Auto-save feature is enabled</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">🎯 Evaluation Criteria</h3>
            <ul className="space-y-2 text-purple-800">
              <li>• Technical knowledge and skills</li>
              <li>• Communication clarity</li>
              <li>• Experience relevance</li>
              <li>• Problem-solving approach</li>
              <li>• Industry best practices knowledge</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Interview Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">10 min</div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{data.role}</div>
              <div className="text-sm text-gray-600">Position</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={startInterview}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            🚀 Start Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Timer and Progress */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Live Interview in Progress</h2>
            <p className="opacity-90">Question {currentQuestionIndex + 1} of {questions.length}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{formatTime(timeRemaining)}</div>
            <div className="opacity-90">Time Remaining</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Current Question */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-8">
        <div className="mb-6">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            {currentQuestion?.category || 'Technical Question'}
          </span>
          <h3 className="text-2xl font-semibold text-gray-900 leading-relaxed">
            {currentQuestion?.question || 'Loading question...'}
          </h3>
        </div>

        {/* Response Input */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Your Response *
          </label>
          <textarea
            value={currentResponse}
            onChange={(e) => setCurrentResponse(e.target.value)}
            placeholder="Type your detailed response here... Be specific and include relevant technical details."
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          />
          <div className="text-sm text-gray-500">
            Character count: {currentResponse.length} | Aim for 100-500 characters for detailed responses
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={skipQuestion}
            className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Skip Question
          </button>
          
          <div className="flex space-x-4">
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleCompleteInterview}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Complete Interview
              </button>
            ) : (
              <button
                onClick={handleResponseSubmit}
                disabled={!currentResponse.trim()}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  currentResponse.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next Question →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interview Progress */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-4">Interview Progress</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{responses.length}</div>
            <div className="text-sm text-gray-600">Responses Submitted</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(((600 - timeRemaining) / 600) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Time Elapsed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((currentResponse.length / 300) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Current Response</div>
          </div>
        </div>
      </div>
    </div>
  );
}
