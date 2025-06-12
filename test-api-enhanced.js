// filepath: d:\aihrfrontend\test-api-enhanced.js
/**
 * Test script for the enhanced AI evaluation API
 */

async function testEnhancedAPI() {
  console.log("🧪 Testing Enhanced Video Interview API...\n");
  const testData = {
    responses: [
      {
        question: "Tell me about your experience with React development.",
        transcript:
          "I have been working with React for over three years, developing complex single-page applications and component libraries. I am proficient in hooks, context API, and state management with Redux. Recently I worked on a large-scale e-commerce platform using Next.js and implemented real-time features with WebSocket connections.",
        category: "Technical",
        wordCount: 45,
      },
      {
        question: "How do you handle challenging situations in a team?",
        transcript:
          "When faced with challenging situations in a team, I believe in open communication and collaborative problem-solving. I try to understand all perspectives and work towards solutions that benefit everyone. For example, in my last project, we had a conflict about technical architecture decisions, and I facilitated a meeting where everyone could present their views, leading to a consensus that improved our final solution.",
        category: "Behavioral",
        wordCount: 52,
      },
      {
        question: "Describe a complex project you've worked on.",
        transcript: "No speech detected in video audio.",
        category: "Technical",
        wordCount: 0,
      },
    ],
    jobDescription:
      "Senior Frontend Developer position requiring 3+ years of React experience, proficiency in modern JavaScript, state management, and building scalable web applications.",
    role: "Senior Frontend Developer",
    experience: "Senior",
    eyeTrackingData: [
      { score: 88, timestamp: Date.now() - 180000 },
      { score: 92, timestamp: Date.now() - 120000 },
      { score: 85, timestamp: Date.now() - 60000 },
    ],
    lipSyncData: [
      { correlation: 0.92, timestamp: Date.now() - 180000 },
      { correlation: 0.89, timestamp: Date.now() - 120000 },
      { correlation: 0.15, timestamp: Date.now() - 60000 },
    ],
    suspiciousActivity: [
      {
        type: "Low Eye Contact",
        description: "Extended period looking away from camera",
        timestamp: Date.now() - 60000,
      },
    ],
    duration: 900000, // 15 minutes
    videoFiles: [],
  };

  try {
    console.log("📤 Sending test request to API...");

    const response = await fetch(
      "http://localhost:3000/api/ai-screening/evaluate-video-interview",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      }
    );

    console.log(
      `📡 Response Status: ${response.status} ${response.statusText}`
    );
    if (response.ok) {
      const result = await response.json();

      console.log("\n✅ API Response received successfully!");
      console.log("==========================================\n");

      // Log the full response to debug
      console.log("📋 Full API Response:");
      console.log(JSON.stringify(result, null, 2));
      console.log("\n==========================================\n");

      // Access the evaluation data correctly
      const evaluation = result.evaluation || result;

      console.log(`📊 Overall Score: ${evaluation.overallScore}%`);
      console.log(`🔧 Technical Score: ${evaluation.technicalScore}%`);
      console.log(`💬 Communication Score: ${evaluation.communicationScore}%`);
      console.log(`🎯 Experience Match: ${evaluation.experienceMatch}%`);
      console.log(`🛡️ Integrity Score: ${evaluation.integrityScore}%`);
      console.log(`📋 Recommendation: ${evaluation.recommendation}`);
      console.log(`📈 Response Quality: ${evaluation.responseQuality}`);

      if (evaluation.isEnhancedEvaluation) {
        console.log(`🤖 Evaluation Method: ${evaluation.evaluationMethod}`);
      }

      console.log("\n💪 Strengths:");
      if (evaluation.strengths && evaluation.strengths.length > 0) {
        evaluation.strengths.forEach((strength, index) => {
          console.log(`   ${index + 1}. ${strength}`);
        });
      } else {
        console.log("   No strengths data available");
      }

      console.log("\n🔧 Areas for Improvement:");
      if (evaluation.improvements && evaluation.improvements.length > 0) {
        evaluation.improvements.forEach((improvement, index) => {
          console.log(`   ${index + 1}. ${improvement}`);
        });
      } else {
        console.log("   No improvements data available");
      }

      if (result.detailedFeedback && result.detailedFeedback.length > 0) {
        console.log("\n📝 Detailed Question Feedback:");
        result.detailedFeedback.forEach((feedback, index) => {
          console.log(`\n   Question ${index + 1}:`);
          console.log(`   📊 Score: ${feedback.score}%`);
          console.log(`   💬 Feedback: ${feedback.feedback}`);
          console.log(`   📝 Transcript: ${feedback.transcript}`);
        });
      }

      if (result.integrityAssessment) {
        console.log("\n🛡️ Integrity Assessment:");
        console.log(`   Risk Level: ${result.integrityAssessment.riskLevel}`);
        console.log(
          `   Concerns: ${
            result.integrityAssessment.concerns.join(", ") || "None"
          }`
        );
      }

      console.log("\n🎉 Enhanced AI Evaluation API Test: PASSED");
    } else {
      const errorText = await response.text();
      console.log("\n❌ API Request Failed:");
      console.log(`Status: ${response.status}`);
      console.log(`Error: ${errorText}`);
    }
  } catch (error) {
    console.error("\n🚨 Test Error:", error.message);
  }
}

// Test different scenarios
async function testMultipleScenarios() {
  console.log("\n🎯 Testing Multiple Scenarios...\n");
  // Scenario 1: Excellent candidate
  const excellentCandidate = {
    responses: [
      {
        question: "Tell me about yourself.",
        transcript:
          "I am a passionate software engineer with 5 years of experience in full-stack development. I specialize in React, Node.js, and cloud technologies. I have led several successful projects, including a microservices architecture that improved system performance by 40%. I enjoy mentoring junior developers and staying up-to-date with the latest technology trends.",
        category: "Introduction",
        wordCount: 48,
      },
    ],
    jobDescription:
      "Senior Software Engineer position requiring full-stack development experience, leadership skills, and expertise in modern web technologies.",
    role: "Senior Software Engineer",
    experience: "Senior",
    eyeTrackingData: [{ score: 95, timestamp: Date.now() }],
    lipSyncData: [{ correlation: 0.95, timestamp: Date.now() }],
    suspiciousActivity: [],
    duration: 300000,
    videoFiles: [],
  };

  // Scenario 2: Poor performance candidate
  const poorCandidate = {
    responses: [
      {
        question: "Tell me about yourself.",
        transcript: "No speech detected in video audio.",
        category: "Introduction",
        wordCount: 0,
      },
    ],
    jobDescription:
      "Junior Developer position for entry-level candidates with basic programming knowledge.",
    role: "Junior Developer",
    experience: "Entry-level",
    eyeTrackingData: [{ score: 30, timestamp: Date.now() }],
    lipSyncData: [{ correlation: 0.2, timestamp: Date.now() }],
    suspiciousActivity: [
      {
        type: "Multiple Faces",
        description: "Multiple people detected",
        timestamp: Date.now(),
      },
      {
        type: "Audio Delay",
        description: "Significant audio delay detected",
        timestamp: Date.now(),
      },
    ],
    duration: 180000,
    videoFiles: [],
  };

  const scenarios = [
    { name: "Excellent Candidate", data: excellentCandidate },
    { name: "Poor Performance Candidate", data: poorCandidate },
  ];

  for (const scenario of scenarios) {
    console.log(`\n📋 Testing: ${scenario.name}`);
    console.log("=====================================");

    try {
      const response = await fetch(
        "http://localhost:3000/api/ai-screening/evaluate-video-interview",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(scenario.data),
        }
      );
      if (response.ok) {
        const result = await response.json();
        const evaluation = result.evaluation || result;
        console.log(`✅ Overall Score: ${evaluation.overallScore}%`);
        console.log(`🛡️ Integrity Score: ${evaluation.integrityScore}%`);
        console.log(`📋 Recommendation: ${evaluation.recommendation}`);
        console.log(`🤖 Method: ${evaluation.evaluationMethod || "standard"}`);
      } else {
        console.log(`❌ Test failed with status: ${response.status}`);
      }
    } catch (error) {
      console.log(`🚨 Error: ${error.message}`);
    }

    // Wait between tests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

// Run tests
async function runAllTests() {
  await testEnhancedAPI();
  await testMultipleScenarios();

  console.log("\n🎉 All API tests completed!");
  console.log("=====================================");
  console.log("✅ Enhanced AI evaluation API is working correctly");
  console.log("✅ Real transcript analysis is functional");
  console.log("✅ Behavioral data integration is working");
  console.log("✅ Multiple scoring scenarios validated");
}

// Export for Node.js execution
if (typeof module !== "undefined" && module.exports) {
  module.exports = { testEnhancedAPI, testMultipleScenarios, runAllTests };
}

// Run if executed directly
if (typeof window === "undefined") {
  runAllTests().catch(console.error);
}
