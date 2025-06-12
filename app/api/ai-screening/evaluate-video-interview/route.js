/**
 * API Route: Evaluate Video Interview
 * Comprehensive evaluation of video interviews including transcription analysis and behavior monitoring
 */

export async function POST(request) {
  try {
    const {
      responses,
      videoFiles,
      eyeTrackingData,
      lipSyncData,
      suspiciousActivity,
      duration,
      jobDescription,
      candidateResume,
      role,
      experience,
    } = await request.json();

    // Validate required fields
    if (!responses || !jobDescription || !role) {
      return Response.json(
        { error: "Missing required fields for evaluation" },
        { status: 400 }
      );
    }

    console.log("🎥 Starting video interview evaluation...");
    console.log(
      `📊 Responses: ${responses.length}, Videos: ${videoFiles?.length || 0}`
    );
    console.log(`👁️ Eye tracking samples: ${eyeTrackingData?.length || 0}`);
    console.log(`🗣️ Lip sync samples: ${lipSyncData?.length || 0}`);
    console.log(`⚠️ Suspicious activities: ${suspiciousActivity?.length || 0}`);

    // Check for OpenAI API key
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      console.warn(
        "OpenAI API key not found, using comprehensive fallback evaluation"
      );
      return Response.json({
        success: true,
        evaluation: getEnhancedFallbackEvaluation(responses, role, experience, {
          eyeTrackingData,
          lipSyncData,
          suspiciousActivity,
          duration,
        }),
      });
    }

    try {
      // Analyze behavioral integrity
      const integrityAnalysis = analyzeBehavioralIntegrity(
        eyeTrackingData,
        lipSyncData,
        suspiciousActivity
      );

      // Prepare comprehensive evaluation prompt
      const evaluationPrompt = generateVideoEvaluationPrompt(
        responses,
        jobDescription,
        candidateResume,
        role,
        experience,
        integrityAnalysis,
        duration
      );

      // Call OpenAI API
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert AI interviewer and behavioral analyst evaluating video interview responses.",
              },
              {
                role: "user",
                content: evaluationPrompt,
              },
            ],
            max_tokens: 3000,
            temperature: 0.3,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const evaluationText = data.choices[0].message.content;

      // Parse the JSON response
      let evaluation;
      try {
        evaluation = JSON.parse(evaluationText);
      } catch (parseError) {
        console.error("Failed to parse AI response, using fallback");
        evaluation = getEnhancedFallbackEvaluation(
          responses,
          role,
          experience,
          {
            eyeTrackingData,
            lipSyncData,
            suspiciousActivity,
            duration,
          }
        );
      }

      // Enhance evaluation with behavioral analysis
      evaluation.behavioralAnalysis = integrityAnalysis;
      evaluation.videoMetrics = {
        totalDuration: duration,
        responseCount: responses.length,
        videoFilesGenerated: videoFiles?.length || 0,
        averageResponseLength:
          responses.reduce((sum, r) => sum + (r.transcript?.length || 0), 0) /
          responses.length,
      };

      console.log("✅ Video interview evaluation completed successfully");

      return Response.json({
        success: true,
        evaluation,
      });
    } catch (apiError) {
      console.error("OpenAI API Error:", apiError);
      return Response.json({
        success: true,
        evaluation: getEnhancedFallbackEvaluation(responses, role, experience, {
          eyeTrackingData,
          lipSyncData,
          suspiciousActivity,
          duration,
        }),
        warning: "Used fallback evaluation due to API error",
      });
    }
  } catch (error) {
    console.error("Evaluation error:", error);
    return Response.json(
      { error: "Failed to evaluate interview", details: error.message },
      { status: 500 }
    );
  }
}

function analyzeBehavioralIntegrity(
  eyeTrackingData = [],
  lipSyncData = [],
  suspiciousActivity = []
) {
  const analysis = {
    integrityScore: 100,
    eyeTrackingScore: 100,
    lipSyncScore: 100,
    suspiciousActivityCount: suspiciousActivity.length,
    riskLevel: "low",
    concerns: [],
    recommendations: [],
  };

  // Analyze eye tracking data
  if (eyeTrackingData.length > 0) {
    const avgAttention =
      eyeTrackingData.reduce(
        (sum, data) => sum + (data.attentionScore || 100),
        0
      ) / eyeTrackingData.length;
    const offScreenTime =
      eyeTrackingData.filter((data) => data.gazePattern === "distracted")
        .length / eyeTrackingData.length;

    analysis.eyeTrackingScore = Math.max(0, avgAttention - offScreenTime * 30);

    if (offScreenTime > 0.3) {
      analysis.concerns.push("Excessive looking away from camera");
    }

    if (avgAttention < 70) {
      analysis.concerns.push("Low attention score detected");
    }
  }

  // Analyze lip sync data
  if (lipSyncData.length > 0) {
    const avgSyncScore =
      lipSyncData.reduce((sum, data) => sum + (data.syncScore || 100), 0) /
      lipSyncData.length;
    const poorSyncSamples = lipSyncData.filter(
      (data) => data.syncScore < 60
    ).length;

    analysis.lipSyncScore = avgSyncScore;

    if (avgSyncScore < 60) {
      analysis.concerns.push("Poor audio-video synchronization detected");
    }

    if (poorSyncSamples > lipSyncData.length * 0.3) {
      analysis.concerns.push("Frequent lip sync irregularities");
    }
  }

  // Analyze suspicious activities
  const highSeverityCount = suspiciousActivity.filter(
    (a) => a.severity === "high"
  ).length;
  const mediumSeverityCount = suspiciousActivity.filter(
    (a) => a.severity === "medium"
  ).length;

  // Deduct points for suspicious activities
  analysis.integrityScore -=
    highSeverityCount * 25 +
    mediumSeverityCount * 15 +
    suspiciousActivity.length * 5;
  analysis.integrityScore = Math.max(0, analysis.integrityScore);

  // Calculate overall integrity score
  analysis.integrityScore = Math.min(
    analysis.integrityScore,
    (analysis.eyeTrackingScore + analysis.lipSyncScore) / 2
  );

  // Determine risk level
  if (highSeverityCount >= 3 || analysis.integrityScore < 30) {
    analysis.riskLevel = "high";
    analysis.recommendations.push(
      "Recommend in-person interview for verification"
    );
  } else if (
    highSeverityCount >= 1 ||
    mediumSeverityCount >= 3 ||
    analysis.integrityScore < 60
  ) {
    analysis.riskLevel = "medium";
    analysis.recommendations.push("Consider additional screening measures");
  } else {
    analysis.riskLevel = "low";
    analysis.recommendations.push("Interview integrity appears satisfactory");
  }

  return analysis;
}

function generateVideoEvaluationPrompt(
  responses,
  jobDescription,
  candidateResume,
  role,
  experience,
  integrityAnalysis,
  duration
) {
  const transcripts = responses
    .map(
      (r, i) => `
Q${i + 1}: ${r.question}
Category: ${r.category}
Transcript: ${r.transcript}
Duration: ${Math.round(r.duration / 60)} minutes
`
    )
    .join("\n");

  return `
You are evaluating a video interview for the position of ${role} (${experience} level).

INTERVIEW DETAILS:
Duration: ${Math.round(duration / 60000)} minutes
Questions Answered: ${responses.length}

JOB REQUIREMENTS:
${jobDescription.substring(0, 1000)}...

CANDIDATE BACKGROUND:
${candidateResume.substring(0, 1000)}...

VIDEO INTERVIEW TRANSCRIPTS:
${transcripts}

BEHAVIORAL INTEGRITY ANALYSIS:
- Integrity Score: ${integrityAnalysis.integrityScore}%
- Eye Tracking Score: ${integrityAnalysis.eyeTrackingScore}%
- Lip Sync Score: ${integrityAnalysis.lipSyncScore}%
- Risk Level: ${integrityAnalysis.riskLevel}
- Concerns: ${integrityAnalysis.concerns.join(", ") || "None"}
- Suspicious Activities: ${integrityAnalysis.suspiciousActivityCount}

Provide a comprehensive evaluation in EXACT JSON format:
{
  "overallScore": 85,
  "technicalScore": 80,
  "communicationScore": 90,
  "experienceMatch": 85,
  "integrityScore": ${integrityAnalysis.integrityScore},
  "recommendation": "Proceed to next round/Proceed with caution/Do not proceed",
  "strengths": ["List 3-4 key strengths from video responses"],
  "improvements": ["List 2-3 areas for improvement"],
  "responseQuality": "Excellent/Good/Fair/Poor",
  "videoQuality": "Clear/Good/Fair/Poor",
  "nonVerbalCommunication": "Excellent/Good/Fair/Poor",
  "categoryScores": {
    "Introduction": 85,
    "Technical": 80,
    "Problem Solving": 90
  },
  "detailedFeedback": [
    {
      "question": "Question text...",
      "transcript": "First 100 chars of transcript...",
      "score": 85,
      "feedback": "Specific feedback on response quality, clarity, and content",
      "nonVerbalNotes": "Observations about body language, eye contact, etc."
    }
  ],
  "integrityAssessment": {
    "riskLevel": "${integrityAnalysis.riskLevel}",
    "concerns": ${JSON.stringify(integrityAnalysis.concerns)},
    "recommendations": ${JSON.stringify(integrityAnalysis.recommendations)}
  }
}

EVALUATION CRITERIA:
- Technical Score: Domain knowledge and accuracy from transcripts
- Communication Score: Clarity, structure, and articulation in video responses
- Integrity Score: Based on behavioral analysis (pre-calculated)
- Experience Match: Relevance to job requirements
- Video Quality: Assessment of candidate's video presentation
- Non-verbal Communication: Body language, eye contact, confidence

Consider the behavioral integrity analysis when making your recommendation. High integrity concerns should significantly impact the overall assessment.
`;
}

function getEnhancedFallbackEvaluation(
  responses,
  role,
  experience,
  behavioralData
) {
  console.log("🔄 Generating enhanced fallback evaluation...");

  const integrityAnalysis = analyzeBehavioralIntegrity(
    behavioralData.eyeTrackingData,
    behavioralData.lipSyncData,
    behavioralData.suspiciousActivity
  );

  // Analyze response quality based on actual transcripts
  const responseQuality = analyzeResponseQuality(responses);

  // Base scores on actual content
  const scores = calculateContentBasedScores(responses, responseQuality);

  return {
    overallScore: scores.overall,
    technicalScore: scores.technical,
    communicationScore: scores.communication,
    experienceMatch: scores.experience,
    integrityScore: integrityAnalysis.integrityScore,
    recommendation:
      scores.overall >= 70
        ? "Proceed to next round"
        : scores.overall >= 50
        ? "Proceed with caution"
        : "Do not proceed",
    strengths: generateStrengths(responses, responseQuality),
    improvements: generateImprovements(responses, responseQuality),
    responseQuality: responseQuality.overall,
    videoQuality: integrityAnalysis.integrityScore >= 80 ? "Clear" : "Fair",
    nonVerbalCommunication:
      integrityAnalysis.integrityScore >= 75 ? "Good" : "Fair",
    categoryScores: scores.categories,
    detailedFeedback: responses.map((response, index) => ({
      question: response.question.substring(0, 100) + "...",
      transcript: response.transcript.substring(0, 100) + "...",
      score: responseQuality.scores[index] || 0,
      feedback: generateQuestionFeedback(
        response,
        responseQuality.scores[index] || 0
      ),
      nonVerbalNotes: "Standard video presentation analysis",
    })),
    behavioralAnalysis: integrityAnalysis,
    integrityAssessment: {
      riskLevel: integrityAnalysis.riskLevel,
      concerns: integrityAnalysis.concerns,
      recommendations: integrityAnalysis.recommendations,
    },
    isEnhancedEvaluation: true,
    evaluationMethod: "real_transcript_analysis",
  };
}

function analyzeResponseQuality(responses) {
  const scores = responses.map((response) => {
    const transcript = response.transcript || "";
    const words = transcript
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);

    let score = 0;

    // Check if transcript exists and is meaningful
    if (
      transcript.includes("Speech recognition not supported") ||
      transcript.includes("Could not extract speech") ||
      transcript.includes("No speech detected") ||
      transcript.includes("Simulated transcript") ||
      transcript.includes("Failed to extract speech") ||
      words.length === 0
    ) {
      score = 15; // Very low score for no speech detected
      console.log(
        `❌ No valid speech detected for question: ${response.question.substring(
          0,
          50
        )}...`
      );
    } else if (words.length < 5) {
      score = 25; // Low score for very short responses
      console.log(
        `⚠️ Very short response (${
          words.length
        } words) for question: ${response.question.substring(0, 50)}...`
      );
    } else if (words.length < 15) {
      score = 45; // Below average for short responses
      console.log(
        `📝 Short response (${
          words.length
        } words) for question: ${response.question.substring(0, 50)}...`
      );
    } else if (words.length < 40) {
      score = 65; // Average for moderate responses
      console.log(
        `✅ Moderate response (${
          words.length
        } words) for question: ${response.question.substring(0, 50)}...`
      );
    } else if (words.length < 80) {
      score = 80; // Good for detailed responses
      console.log(
        `🌟 Good response (${
          words.length
        } words) for question: ${response.question.substring(0, 50)}...`
      );
    } else {
      score = 90; // Excellent for comprehensive responses
      console.log(
        `🎯 Excellent response (${
          words.length
        } words) for question: ${response.question.substring(0, 50)}...`
      );
    }

    // Bonus for technical keywords (if applicable)
    if (
      response.category === "Technical" &&
      containsTechnicalTerms(transcript)
    ) {
      score = Math.min(100, score + 10);
      console.log(`🔧 Technical terms bonus applied`);
    }

    // Penalty for repetitive content
    if (isRepetitive(transcript)) {
      score = Math.max(0, score - 20);
      console.log(`🔄 Repetitive content penalty applied`);
    }

    return Math.max(0, Math.min(100, score));
  });

  const avgScore =
    scores.reduce((sum, score) => sum + score, 0) / scores.length;

  console.log(
    `📊 Response quality analysis: Average score ${avgScore.toFixed(1)}`
  );

  return {
    scores,
    overall:
      avgScore >= 80
        ? "Excellent"
        : avgScore >= 60
        ? "Good"
        : avgScore >= 40
        ? "Fair"
        : "Poor",
    averageScore: avgScore,
  };
}

function calculateContentBasedScores(responses, responseQuality) {
  const baseScore = Math.max(20, Math.min(95, responseQuality.averageScore));

  return {
    overall: Math.round(baseScore),
    technical: Math.round(baseScore * 0.9), // Slightly lower for technical without deep analysis
    communication: Math.round(baseScore * 1.1), // Slightly higher if they spoke clearly
    experience: Math.round(baseScore * 0.95),
    categories: responses.reduce((cats, response, index) => {
      cats[response.category] = responseQuality.scores[index] || 20;
      return cats;
    }, {}),
  };
}

function generateStrengths(responses, responseQuality) {
  const strengths = [];

  if (responseQuality.averageScore >= 70) {
    strengths.push("Provided comprehensive and detailed responses");
  } else if (responseQuality.averageScore >= 50) {
    strengths.push("Demonstrated good verbal communication skills");
  }

  const validResponses = responses.filter(
    (r) =>
      r.transcript &&
      !r.transcript.includes("not supported") &&
      !r.transcript.includes("No speech detected") &&
      r.transcript.trim().split(/\s+/).length >= 5
  );

  if (validResponses.length === responses.length) {
    strengths.push("Consistently provided responses to all questions");
  } else if (validResponses.length >= responses.length * 0.7) {
    strengths.push("Answered majority of questions with clear responses");
  }

  if (responses.some((r) => r.wordCount >= 50)) {
    strengths.push("Demonstrated ability to elaborate on topics in detail");
  }

  if (strengths.length === 0) {
    strengths.push("Participated in the video interview process");
  }

  return strengths;
}

function generateImprovements(responses, responseQuality) {
  const improvements = [];

  if (responseQuality.averageScore < 40) {
    improvements.push(
      "Provide more detailed and comprehensive responses to questions"
    );
  } else if (responseQuality.averageScore < 60) {
    improvements.push(
      "Consider expanding on responses with more specific examples"
    );
  }

  const silentResponses = responses.filter(
    (r) =>
      !r.transcript ||
      r.transcript.includes("not supported") ||
      r.transcript.includes("No speech detected") ||
      r.transcript.trim().split(/\s+/).length < 5
  );

  if (silentResponses.length > 0) {
    improvements.push(
      `Ensure clear speech delivery (${silentResponses.length}/${responses.length} questions had unclear audio)`
    );
  }

  if (responseQuality.averageScore < 30) {
    improvements.push(
      "Practice articulating thoughts clearly before video interviews"
    );
  }

  if (improvements.length === 0) {
    improvements.push("Continue developing professional communication skills");
  }

  return improvements;
}

function generateQuestionFeedback(response, score) {
  const transcript = response.transcript || "";
  const wordCount = transcript
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  if (score >= 80) {
    return `Excellent response with comprehensive detail (${wordCount} words). Shows strong understanding and communication skills.`;
  } else if (score >= 60) {
    return `Good response with adequate information (${wordCount} words). Could benefit from additional examples.`;
  } else if (score >= 40) {
    return `Basic response (${wordCount} words) that demonstrates understanding but needs more elaboration.`;
  } else if (score >= 25) {
    return `Brief response (${wordCount} words) detected. Requires significant expansion with examples and details.`;
  } else {
    return `Minimal or no clear speech detected. Please ensure microphone is working and speak clearly.`;
  }
}

function containsTechnicalTerms(text) {
  const technicalTerms = [
    "javascript",
    "react",
    "node",
    "api",
    "database",
    "frontend",
    "backend",
    "algorithm",
    "framework",
    "library",
    "component",
    "function",
    "method",
    "development",
    "programming",
    "coding",
    "software",
    "system",
    "architecture",
    "html",
    "css",
    "typescript",
    "python",
    "java",
    "devops",
    "cloud",
    "aws",
  ];

  const lowerText = text.toLowerCase();
  return technicalTerms.some((term) => lowerText.includes(term));
}

function isRepetitive(text) {
  const words = text.toLowerCase().split(/\s+/);
  if (words.length < 10) return false;

  const wordCount = {};
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  const repetitiveWords = Object.values(wordCount).filter((count) => count > 3);
  return repetitiveWords.length > 2;
}
