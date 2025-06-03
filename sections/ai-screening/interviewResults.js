/**
 * Interview Results Component
 * Displays AI evaluation results and comprehensive analysis
 */
"use client";

import { useState } from 'react';

export default function InterviewResults({ data, onRestart }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample evaluation data if not available
  const evaluation = data.evaluation || {
    overallScore: 78,
    technicalScore: 75,
    communicationScore: 82,
    experienceMatch: 76,
    recommendation: 'Proceed to next round',
    strengths: [
      'Strong experience with CI/CD pipelines',
      'Good understanding of containerization',
      'Clear communication style',
      'Relevant cloud platform experience'
    ],
    improvements: [
      'Could provide more specific examples',
      'Elaborate on security practices',
      'Mention more monitoring tools'
    ],
    keywordMatches: 28,
    responseQuality: 'Good',
    categoryScores: {
      'DevOps Experience': 80,
      'Infrastructure': 72,
      'Containers': 78,
      'Monitoring': 74,
      'Problem Solving': 82
    },
    detailedFeedback: [
      {
        question: "Can you walk me through your experience with CI/CD pipelines?",
        response: data.responses?.[0]?.response || "Good coverage of Jenkins and GitLab CI experience...",
        score: 80,
        feedback: "Strong answer covering multiple tools and practical experience. Could benefit from more specific metrics.",
        keywords: ["Jenkins", "GitLab CI", "automation", "deployment"]
      },
      {
        question: "How do you handle infrastructure as code?",
        response: data.responses?.[1]?.response || "Mentioned Terraform and CloudFormation...",
        score: 75,
        feedback: "Good understanding of IaC principles. Would like to see more examples of complex deployments.",
        keywords: ["Terraform", "CloudFormation", "automation"]
      }
    ]
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBarColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getRecommendationStyle = (recommendation) => {
    const lower = recommendation.toLowerCase();
    if (lower.includes('proceed') || lower.includes('advance')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (lower.includes('consider') || lower.includes('maybe')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const ScoreCard = ({ title, score, subtitle }) => (
    <div className="bg-white p-6 rounded-lg border-2 border-gray-100 hover:border-blue-200 transition-colors">
      <div className="text-center">
        <div className={`text-4xl font-bold mb-2 ${getScoreColor(score)}`}>
          {score}%
        </div>
        <div className="font-semibold text-gray-900 mb-1">{title}</div>
        {subtitle && <div className="text-sm text-gray-600">{subtitle}</div>}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${getScoreBarColor(score)}`}
              style={{ width: `${score}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="text-6xl">🎯</div>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Interview Complete!</h2>
        <p className="text-xl text-gray-600">
          Your AI-powered screening interview has been evaluated
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <ScoreCard 
          title="Overall Score" 
          score={evaluation.overallScore} 
          subtitle="Final Rating"
        />
        <ScoreCard 
          title="Technical Skills" 
          score={evaluation.technicalScore} 
          subtitle="Domain Knowledge"
        />
        <ScoreCard 
          title="Communication" 
          score={evaluation.communicationScore} 
          subtitle="Clarity & Detail"
        />
        <ScoreCard 
          title="Experience Match" 
          score={evaluation.experienceMatch} 
          subtitle="Role Alignment"
        />
      </div>

      {/* Recommendation */}
      <div className="mb-8">
        <div className={`p-6 rounded-lg border-2 ${getRecommendationStyle(evaluation.recommendation)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">AI Recommendation</h3>
              <p className="text-lg">{evaluation.recommendation}</p>
            </div>
            <div className="text-4xl">
              {evaluation.recommendation.toLowerCase().includes('proceed') ? '✅' : 
               evaluation.recommendation.toLowerCase().includes('consider') ? '⚠️' : '❌'}
            </div>
          </div>
        </div>
      </div>

      {/* Interview Summary */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{data.responses?.length || 0}</div>
            <div className="text-sm text-gray-600">Questions Answered</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {data.interviewDuration ? formatTime(data.interviewDuration) : '0:00'}
            </div>
            <div className="text-sm text-gray-600">Total Duration</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{evaluation.keywordMatches}</div>
            <div className="text-sm text-gray-600">Keywords Matched</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{evaluation.responseQuality}</div>
            <div className="text-sm text-gray-600">Response Quality</div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'categories', label: 'Category Breakdown', icon: '📈' },
              { id: 'responses', label: 'Response Analysis', icon: '💬' },
              { id: 'improvement', label: 'Recommendations', icon: '🎯' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-green-900 mb-4">🌟 Key Strengths</h4>
                  <ul className="space-y-2">
                    {evaluation.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-orange-900 mb-4">📈 Areas for Improvement</h4>
                  <ul className="space-y-2">
                    {evaluation.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-orange-600 mr-2">→</span>
                        <span className="text-gray-700">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance by Category</h4>
              <div className="space-y-4">
                {Object.entries(evaluation.categoryScores || {}).map(([category, score]) => (
                  <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">{category}</div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 ${getScoreBarColor(score)}`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <div className={`font-bold text-lg ${getScoreColor(score)}`}>
                        {score}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'responses' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Individual Response Analysis</h4>
              <div className="space-y-6">
                {(evaluation.detailedFeedback || []).map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h5 className="font-semibold text-gray-900 flex-1">{item.question}</h5>
                      <div className={`font-bold text-lg ${getScoreColor(item.score)}`}>
                        {item.score}%
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="text-gray-700 italic">"{item.response.substring(0, 200)}..."</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-700">{item.feedback}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-gray-600">Detected keywords:</span>
                      {item.keywords.map((keyword, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'improvement' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">🚀 Next Steps</h4>
                  <ul className="space-y-3 text-blue-800">
                    <li>• Schedule technical deep-dive interview</li>
                    <li>• Prepare system design questions</li>
                    <li>• Review specific project experiences</li>
                    <li>• Assess cultural fit with team</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">💡 Interview Tips</h4>
                  <ul className="space-y-3 text-green-800">
                    <li>• Focus on hands-on experience</li>
                    <li>• Ask for specific examples</li>
                    <li>• Evaluate problem-solving approach</li>
                    <li>• Assess learning mindset</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          📄 Export Report
        </button>
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Start New Interview
        </button>
        <button
          onClick={() => {
            // Mock sharing functionality
            alert('Results shared with hiring team!');
          }}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          📤 Share Results
        </button>
      </div>

      {/* Additional Insights */}
      <div className="mt-8 bg-purple-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-purple-900 mb-4">🔮 AI Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(evaluation.overallScore / 10)}
            </div>
            <div className="text-purple-800">Interview Confidence Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {evaluation.keywordMatches > 20 ? 'High' : evaluation.keywordMatches > 10 ? 'Medium' : 'Low'}
            </div>
            <div className="text-purple-800">Technical Vocabulary</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {evaluation.responseQuality}
            </div>
            <div className="text-purple-800">Response Depth</div>
          </div>
        </div>
      </div>
    </div>
  );
}
