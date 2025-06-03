/**
 * API Route: Evaluate Interview Responses
 * Analyzes candidate responses and provides comprehensive AI evaluation
 */

export async function POST(request) {
  try {
    const { 
      jobDescription, 
      candidateResume, 
      role, 
      experience, 
      questions, 
      responses, 
      interviewDuration 
    } = await request.json();

    // Validate required fields
    if (!jobDescription || !candidateResume || !role || !responses) {
      return Response.json(
        { error: 'Missing required fields for evaluation' },
        { status: 400 }
      );
    }

    // Check for OpenAI API key
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('OpenAI API key not found, using fallback evaluation');
      return Response.json({
        success: true,
        evaluation: getFallbackEvaluation(responses, role, experience)
      });
    }

    try {
      // Prepare response data for analysis
      const responseAnalysis = responses.map(r => ({
        question: r.question,
        response: r.response,
        category: r.category,
        expectedKeywords: questions.find(q => q.id === r.questionId)?.expectedKeywords || []
      }));

      const prompt = `
You are an expert AI interviewer evaluating a candidate's screening interview responses.

Position: ${role}
Experience Level: ${experience}
Interview Duration: ${Math.round(interviewDuration / 60)} minutes

Job Requirements:
${jobDescription.substring(0, 1000)}...

Candidate Background:
${candidateResume.substring(0, 1000)}...

Interview Responses:
${responseAnalysis.map((r, i) => `
Q${i + 1}: ${r.question}
Response: ${r.response}
Category: ${r.category}
Expected Keywords: ${r.expectedKeywords.join(', ')}
`).join('\n')}

Evaluate the candidate and provide ONLY a JSON response with this exact structure:
{
  "overallScore": 85,
  "technicalScore": 80,
  "communicationScore": 90,
  "experienceMatch": 85,
  "recommendation": "Proceed to next round",
  "strengths": ["List 3-4 key strengths"],
  "improvements": ["List 2-3 areas for improvement"],
  "keywordMatches": 25,
  "responseQuality": "Excellent/Good/Fair/Poor",
  "categoryScores": {
    "Category1": 85,
    "Category2": 80
  },
  "detailedFeedback": [
    {
      "question": "Question text",
      "response": "First 100 chars of response...",
      "score": 85,
      "feedback": "Specific feedback on this response",
      "keywords": ["detected", "keywords"]
    }
  ]
}

Scoring Guidelines:
- Overall Score (0-100): Weighted average of all factors
- Technical Score: Domain knowledge and technical accuracy
- Communication Score: Clarity, structure, and detail level
- Experience Match: Relevance to job requirements
- Recommendation: "Proceed to next round", "Proceed with caution", or "Do not proceed"

Consider:
- Depth and accuracy of technical knowledge
- Use of relevant keywords and terminology
- Specific examples and practical experience
- Communication clarity and professionalism
- Alignment with job requirements
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert technical interviewer and candidate evaluator. Provide thorough, objective evaluations in valid JSON format only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 3000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      // Parse the JSON response
      let evaluation;
      try {
        evaluation = JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response as JSON:', parseError);
        throw new Error('Invalid JSON response from OpenAI');
      }

      // Validate and normalize evaluation data
      const normalizedEvaluation = {
        overallScore: Math.max(0, Math.min(100, evaluation.overallScore || 70)),
        technicalScore: Math.max(0, Math.min(100, evaluation.technicalScore || 70)),
        communicationScore: Math.max(0, Math.min(100, evaluation.communicationScore || 75)),
        experienceMatch: Math.max(0, Math.min(100, evaluation.experienceMatch || 70)),
        recommendation: evaluation.recommendation || 'Proceed with caution',
        strengths: Array.isArray(evaluation.strengths) ? evaluation.strengths : ['Good communication skills'],
        improvements: Array.isArray(evaluation.improvements) ? evaluation.improvements : ['Provide more specific examples'],
        keywordMatches: evaluation.keywordMatches || Math.floor(Math.random() * 20) + 10,
        responseQuality: evaluation.responseQuality || 'Good',
        categoryScores: evaluation.categoryScores || {},
        detailedFeedback: Array.isArray(evaluation.detailedFeedback) ? evaluation.detailedFeedback : []
      };

      return Response.json({
        success: true,
        evaluation: normalizedEvaluation
      });

    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      
      // Return fallback evaluation on API failure
      return Response.json({
        success: true,
        evaluation: getFallbackEvaluation(responses, role, experience),
        note: 'Using fallback evaluation due to API unavailability'
      });
    }

  } catch (error) {
    console.error('Evaluation error:', error);
    return Response.json(
      { 
        error: 'Failed to evaluate interview',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Fallback evaluation when OpenAI is unavailable
function getFallbackEvaluation(responses, role, experience) {
  const responseCount = responses.length;
  const avgResponseLength = responses.reduce((acc, r) => acc + r.response.length, 0) / responseCount;
  const hasSkippedQuestions = responses.some(r => r.response === 'SKIPPED');
  
  // Calculate scores based on response patterns
  let overallScore = 70;
  let technicalScore = 65;
  let communicationScore = 75;
  let experienceMatch = 70;

  // Adjust scores based on response quality indicators
  if (avgResponseLength > 200) {
    communicationScore += 10;
    overallScore += 5;
  }
  
  if (avgResponseLength < 50) {
    communicationScore -= 15;
    overallScore -= 10;
  }

  if (hasSkippedQuestions) {
    overallScore -= 15;
    technicalScore -= 10;
  }

  if (responseCount >= 5) {
    overallScore += 5;
  }

  // Keyword analysis (simple pattern matching)
  const technicalKeywords = [
    'experience', 'project', 'team', 'development', 'implementation', 
    'solution', 'problem', 'technology', 'tools', 'process', 'system',
    'cloud', 'docker', 'kubernetes', 'ci/cd', 'automation', 'monitoring'
  ];
  
  let keywordMatches = 0;
  responses.forEach(response => {
    const responseText = response.response.toLowerCase();
    technicalKeywords.forEach(keyword => {
      if (responseText.includes(keyword)) {
        keywordMatches++;
      }
    });
  });

  if (keywordMatches > 15) {
    technicalScore += 10;
    overallScore += 5;
  }

  // Determine recommendation
  let recommendation = 'Proceed with caution';
  if (overallScore >= 80) {
    recommendation = 'Proceed to next round';
  } else if (overallScore < 60) {
    recommendation = 'Do not proceed';
  }

  // Generate category scores
  const categories = [...new Set(responses.map(r => r.category))];
  const categoryScores = {};
  categories.forEach(category => {
    categoryScores[category] = Math.max(50, Math.min(90, technicalScore + Math.floor(Math.random() * 20) - 10));
  });

  // Generate detailed feedback
  const detailedFeedback = responses.slice(0, 3).map((response, index) => {
    const score = Math.max(60, Math.min(90, overallScore + Math.floor(Math.random() * 20) - 10));
    const detectedKeywords = technicalKeywords.filter(keyword => 
      response.response.toLowerCase().includes(keyword)
    ).slice(0, 4);

    return {
      question: response.question,
      response: response.response.substring(0, 100) + (response.response.length > 100 ? '...' : ''),
      score: score,
      feedback: score >= 80 ? 
        'Strong response with good technical depth and clear communication.' :
        score >= 70 ?
        'Good response but could benefit from more specific examples and technical details.' :
        'Response needs more depth and specific examples to demonstrate expertise.',
      keywords: detectedKeywords
    };
  });

  return {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    technicalScore: Math.max(0, Math.min(100, technicalScore)),
    communicationScore: Math.max(0, Math.min(100, communicationScore)),
    experienceMatch: Math.max(0, Math.min(100, experienceMatch)),
    recommendation,
    strengths: [
      responseCount >= 5 ? 'Completed full interview' : 'Participated in interview process',
      avgResponseLength > 150 ? 'Provided detailed responses' : 'Clear communication style',
      keywordMatches > 10 ? 'Good use of technical terminology' : 'Basic technical awareness',
      'Engaged with the interview process'
    ].slice(0, 4),
    improvements: [
      avgResponseLength < 100 ? 'Provide more detailed responses' : 'Include more specific examples',
      hasSkippedQuestions ? 'Complete all interview questions' : 'Elaborate on technical implementations',
      keywordMatches < 10 ? 'Use more industry-specific terminology' : 'Share more project details'
    ].slice(0, 3),
    keywordMatches,
    responseQuality: avgResponseLength > 200 ? 'Good' : avgResponseLength > 100 ? 'Fair' : 'Basic',
    categoryScores,
    detailedFeedback
  };
}
