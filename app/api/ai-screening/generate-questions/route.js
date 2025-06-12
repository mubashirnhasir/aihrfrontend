/**
 * API Route: Generate Interview Questions
 * Creates personalized screening questions based on job description and candidate resume
 */

export async function POST(request) {
  try {
    const { role, experience, jobDescription, candidateResume } = await request.json();

    // Validate required fields
    if (!role || !experience || !jobDescription || !candidateResume) {
      return Response.json(
        { error: 'Missing required fields: role, experience, jobDescription, candidateResume' },
        { status: 400 }
      );
    }

    // Check for OpenAI API key
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('OpenAI API key not found, using fallback questions');
      return Response.json({
        success: true,
        questions: getFallbackQuestions(role, experience)
      });
    }

    try {
      const prompt = `
You are an expert technical interviewer. Create 8-10 targeted screening questions for a 10-minute interview.

Position: ${role}
Experience Level: ${experience}

Job Requirements:
${jobDescription}

Candidate Background:
${candidateResume}

Generate questions that:
1. Assess technical skills mentioned in the job description
2. Evaluate experience relevance to the role
3. Test practical knowledge and problem-solving
4. Are appropriate for the experience level
5. Can be answered in 1-2 minutes each

Return ONLY a JSON array with this structure:
[
  {
    "id": 1,
    "question": "Question text here",
    "category": "Technical/Experience/Problem-solving",
    "expectedKeywords": ["keyword1", "keyword2", "keyword3"],
    "skillArea": "specific skill being tested"
  }
]

Focus on key areas like: technical skills, tools/technologies, experience examples, problem-solving, best practices.
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
              content: 'You are an expert technical interviewer. Generate targeted screening questions and respond with valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from OpenAI');
      }      // Parse the JSON response - handle markdown-wrapped JSON
      let questions;
      try {
        // Clean the content by removing markdown code blocks if present
        let cleanContent = content.trim();
        
        // Remove markdown code block markers
        if (cleanContent.startsWith('```json')) {
          cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanContent.startsWith('```')) {
          cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        console.log('Attempting to parse cleaned content:', cleanContent.substring(0, 200) + '...');
        questions = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response as JSON:', parseError);
        console.error('Original content:', content);
        throw new Error('Invalid JSON response from OpenAI');
      }

      // Validate questions structure
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid questions format');
      }

      // Ensure each question has required properties
      const validatedQuestions = questions.map((q, index) => ({
        id: q.id || index + 1,
        question: q.question || 'Tell me about your experience with this technology.',
        category: q.category || 'Technical',
        expectedKeywords: Array.isArray(q.expectedKeywords) ? q.expectedKeywords : [],
        skillArea: q.skillArea || 'General'
      }));

      return Response.json({
        success: true,
        questions: validatedQuestions
      });

    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      
      // Return fallback questions on API failure
      return Response.json({
        success: true,
        questions: getFallbackQuestions(role, experience),
        note: 'Using fallback questions due to API unavailability'
      });
    }

  } catch (error) {
    console.error('Question generation error:', error);
    return Response.json(
      { 
        error: 'Failed to generate questions',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Fallback questions based on role and experience
function getFallbackQuestions(role, experience) {
  const isDevOps = role.toLowerCase().includes('devops');
  const isSenior = experience.includes('4+') || experience.includes('Senior') || experience.includes('Lead');

  if (isDevOps) {
    return [
      {
        id: 1,
        question: "Can you walk me through your experience with CI/CD pipelines? What tools have you used and what challenges have you faced?",
        category: "DevOps Experience",
        expectedKeywords: ["Jenkins", "GitLab CI", "GitHub Actions", "Azure DevOps", "automation", "deployment", "pipeline"],
        skillArea: "CI/CD"
      },
      {
        id: 2,
        question: "How do you approach Infrastructure as Code? Which tools have you worked with and can you describe a complex deployment you've managed?",
        category: "Infrastructure",
        expectedKeywords: ["Terraform", "CloudFormation", "Ansible", "Pulumi", "IaC", "automation", "infrastructure"],
        skillArea: "Infrastructure as Code"
      },
      {
        id: 3,
        question: "Describe your experience with containerization and orchestration. How have you used Docker and Kubernetes in production?",
        category: "Containers",
        expectedKeywords: ["Docker", "Kubernetes", "containers", "orchestration", "pods", "services", "microservices"],
        skillArea: "Containerization"
      },
      {
        id: 4,
        question: "How do you handle monitoring and logging in production environments? What tools and strategies do you use?",
        category: "Monitoring",
        expectedKeywords: ["Prometheus", "Grafana", "ELK", "monitoring", "alerts", "logging", "metrics"],
        skillArea: "Monitoring & Observability"
      },
      {
        id: 5,
        question: "Tell me about a challenging production issue you've resolved. What was your troubleshooting approach?",
        category: "Problem Solving",
        expectedKeywords: ["debugging", "troubleshooting", "root cause", "solution", "incident", "resolution"],
        skillArea: "Problem Solving"
      },
      {
        id: 6,
        question: "How do you ensure security in your DevOps practices? What security tools and processes do you implement?",
        category: "Security",
        expectedKeywords: ["security", "scanning", "vulnerabilities", "compliance", "secrets management", "RBAC"],
        skillArea: "DevOps Security"
      },
      {
        id: 7,
        question: "Describe your experience with cloud platforms. Which services have you used and how do you optimize costs?",
        category: "Cloud",
        expectedKeywords: ["AWS", "Azure", "GCP", "cloud", "EC2", "S3", "optimization", "cost management"],
        skillArea: "Cloud Platforms"
      },
      {
        id: 8,
        question: "How do you collaborate with development teams? What processes do you use to ensure smooth deployments?",
        category: "Collaboration",
        expectedKeywords: ["collaboration", "agile", "communication", "process", "deployment", "teamwork"],
        skillArea: "Team Collaboration"
      }
    ];
  }

  // Generic technical questions for other roles
  return [
    {
      id: 1,
      question: `Tell me about your experience in ${role}. What are the key skills you've developed?`,
      category: "Experience",
      expectedKeywords: ["experience", "skills", "projects", "development"],
      skillArea: "General Experience"
    },
    {
      id: 2,
      question: "What technologies and tools are you most comfortable working with?",
      category: "Technical",
      expectedKeywords: ["technologies", "tools", "programming", "frameworks"],
      skillArea: "Technical Skills"
    },
    {
      id: 3,
      question: "Describe a challenging project you've worked on. How did you approach solving the problems?",
      category: "Problem Solving",
      expectedKeywords: ["project", "challenge", "problem", "solution", "approach"],
      skillArea: "Problem Solving"
    },
    {
      id: 4,
      question: "How do you stay updated with new technologies and industry trends?",
      category: "Learning",
      expectedKeywords: ["learning", "technology", "trends", "development", "growth"],
      skillArea: "Continuous Learning"
    },
    {
      id: 5,
      question: "Tell me about a time when you had to work with a team to deliver a project. What was your role?",
      category: "Collaboration",
      expectedKeywords: ["team", "collaboration", "project", "role", "communication"],
      skillArea: "Teamwork"
    }
  ];
}
