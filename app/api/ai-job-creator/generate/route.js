/**
 * AI Job Description Generator API
 * Generates professional job descriptions using OpenAI GPT
 */

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "jobTitle",
      "department",
      "experienceLevel",
      "keySkills",
    ];
    for (const field of requiredFields) {
      if (
        !data[field] ||
        (Array.isArray(data[field]) && data[field].length === 0)
      ) {
        return Response.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create the prompt for GPT
    const prompt = createJobDescriptionPrompt(data);

    // Call OpenAI API
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                'You are an expert HR professional and copywriter specializing in creating compelling, professional job descriptions. Create engaging content that attracts top talent while being clear and professional. Avoid overused phrases like "rockstar", "ninja", "guru", or "unicorn". Focus on clear, professional language that accurately represents the role.',
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      }
    );

    if (!openaiResponse.ok) {
      throw new Error("Failed to generate job description");
    }

    const openaiResult = await openaiResponse.json();
    const generatedContent = openaiResult.choices[0].message.content;

    // Parse the generated content into structured format
    const jobDescription = parseJobDescription(generatedContent, data);

    // Generate platform-specific versions
    const platformVersions = await generatePlatformVersions(
      jobDescription,
      data
    );

    return Response.json({
      success: true,
      data: {
        ...jobDescription,
        platforms: platformVersions,
        metadata: {
          generatedAt: new Date().toISOString(),
          inputData: data,
        },
      },
    });
  } catch (error) {
    console.error("Error generating job description:", error);
    return Response.json(
      { success: false, error: "Failed to generate job description" },
      { status: 500 }
    );
  }
}

/**
 * Creates a detailed prompt for GPT to generate job description
 */
function createJobDescriptionPrompt(data) {
  const {
    jobTitle,
    department,
    employmentType,
    experienceLevel,
    salaryRange,
    location,
    workModel,
    keySkills,
    responsibilities,
    qualifications,
    benefits,
    companyInfo,
    disclaimers,
    additionalNotes,
  } = data;

  return `
Create a professional job description with the following details:

**Job Information:**
- Title: ${jobTitle}
- Department: ${department}
- Employment Type: ${employmentType || "Full-time"}
- Experience Level: ${experienceLevel}
- Salary Range: ${salaryRange || "Competitive"}
- Location: ${location || "Not specified"}
- Work Model: ${workModel || "Not specified"}

**Required Skills:** ${keySkills.join(", ")}

**Key Responsibilities:** ${
    responsibilities || "Standard responsibilities for this role"
  }

**Qualifications:** ${qualifications || "Standard qualifications for this role"}

**Benefits:** ${benefits || "Competitive benefits package"}

**Company Information:** ${companyInfo || "Growing company with great culture"}

**Additional Notes:** ${additionalNotes || "None"}

**Special Requirements/Disclaimers:** ${disclaimers || "None"}

Please structure the response as follows:
1. **Job Title & Summary** - Compelling 2-3 sentence overview
2. **About the Role** - Detailed role description (2-3 paragraphs)
3. **Key Responsibilities** - 5-7 bullet points
4. **Required Qualifications** - Essential requirements
5. **Preferred Qualifications** - Nice-to-have skills
6. **What We Offer** - Benefits and perks
7. **About Us** - Company description
8. **Application Process** - How to apply

Use professional, engaging language that attracts qualified candidates. Avoid clichés and overused recruitment phrases. Make it specific to the role and industry.
`.trim();
}

/**
 * Parses the GPT response into structured job description
 */
function parseJobDescription(content, inputData) {
  const sections = content.split(/\*\*([^*]+)\*\*/);
  const structuredJD = {
    title: inputData.jobTitle,
    summary: "",
    aboutRole: "",
    responsibilities: [],
    requiredQualifications: [],
    preferredQualifications: [],
    benefits: [],
    aboutCompany: "",
    applicationProcess: "",
    fullText: content,
  };

  // Extract sections based on headers
  for (let i = 1; i < sections.length; i += 2) {
    const header = sections[i].toLowerCase().trim();
    const content = sections[i + 1]?.trim() || "";

    if (header.includes("summary") || header.includes("job title")) {
      structuredJD.summary = content;
    } else if (header.includes("about the role")) {
      structuredJD.aboutRole = content;
    } else if (header.includes("responsibilities")) {
      structuredJD.responsibilities = extractBulletPoints(content);
    } else if (header.includes("required qualifications")) {
      structuredJD.requiredQualifications = extractBulletPoints(content);
    } else if (header.includes("preferred qualifications")) {
      structuredJD.preferredQualifications = extractBulletPoints(content);
    } else if (
      header.includes("what we offer") ||
      header.includes("benefits")
    ) {
      structuredJD.benefits = extractBulletPoints(content);
    } else if (header.includes("about us") || header.includes("company")) {
      structuredJD.aboutCompany = content;
    } else if (header.includes("application")) {
      structuredJD.applicationProcess = content;
    }
  }

  return structuredJD;
}

/**
 * Extracts bullet points from text content
 */
function extractBulletPoints(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.replace(/^[-•*]\s*/, ""));
}

/**
 * Generates platform-specific versions of the job description
 */
async function generatePlatformVersions(jobDescription, inputData) {
  const platforms = {
    website: jobDescription.fullText,
    linkedin: await generateLinkedInVersion(jobDescription, inputData),
    twitter: await generateTwitterVersion(jobDescription, inputData),
    instagram: await generateInstagramVersion(jobDescription, inputData),
  };

  return platforms;
}

/**
 * Generate LinkedIn-optimized version
 */
async function generateLinkedInVersion(jobDescription, inputData) {
  const prompt = `
Convert this job description into a LinkedIn post format:

Job Title: ${inputData.jobTitle}
Company: ${inputData.companyInfo || "Our Company"}

Key points to highlight:
- ${jobDescription.responsibilities.slice(0, 3).join("\n- ")}

Required skills: ${inputData.keySkills.join(", ")}

Create a professional LinkedIn post that:
1. Starts with an engaging hook
2. Briefly describes the role and company
3. Lists 3-4 key requirements
4. Ends with a call-to-action
5. Uses relevant hashtags
6. Keeps it under 3000 characters

Make it engaging and professional for LinkedIn's professional audience.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error("Error generating LinkedIn version:", error);
    return createFallbackLinkedInPost(jobDescription, inputData);
  }
}

/**
 * Generate Twitter-optimized version
 */
async function generateTwitterVersion(jobDescription, inputData) {
  const prompt = `
Create a Twitter thread (3-4 tweets) for this job posting:

Job: ${inputData.jobTitle}
Skills: ${inputData.keySkills.slice(0, 4).join(", ")}

Requirements:
1. First tweet: Hook + job title + company (under 280 chars)
2. Second tweet: Key responsibilities (under 280 chars)
3. Third tweet: Requirements + how to apply (under 280 chars)
4. Add relevant hashtags to each tweet

Make it engaging and use emojis appropriately. Each tweet should be under 280 characters.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 600,
      }),
    });

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error("Error generating Twitter version:", error);
    return createFallbackTwitterThread(jobDescription, inputData);
  }
}

/**
 * Generate Instagram-optimized version
 */
async function generateInstagramVersion(jobDescription, inputData) {
  const prompt = `
Create an Instagram post for this job opening:

Job: ${inputData.jobTitle}
Skills needed: ${inputData.keySkills.slice(0, 5).join(", ")}

Create an Instagram-style post that:
1. Uses engaging, visual language
2. Includes relevant emojis
3. Has a compelling caption (2-3 paragraphs)
4. Ends with relevant hashtags
5. Mentions key benefits/perks
6. Has a clear call-to-action

Make it visually appealing and engaging for Instagram's audience while remaining professional.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 600,
      }),
    });

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error("Error generating Instagram version:", error);
    return createFallbackInstagramPost(jobDescription, inputData);
  }
}

/**
 * Fallback functions for when API calls fail
 */
function createFallbackLinkedInPost(jobDescription, inputData) {
  return `🚀 We're hiring! ${inputData.jobTitle} position open

${jobDescription.summary}

What you'll do:
${jobDescription.responsibilities
  .slice(0, 3)
  .map((r) => `• ${r}`)
  .join("\n")}

We're looking for: ${inputData.keySkills.slice(0, 4).join(", ")}

Ready to join our team? Apply now! 

#hiring #jobs #${inputData.department.toLowerCase()} #careers`;
}

function createFallbackTwitterThread(jobDescription, inputData) {
  return `🧵 THREAD: We're hiring a ${inputData.jobTitle}! 

1/3 🔥 Join our ${inputData.department} team! We're looking for a talented ${
    inputData.jobTitle
  } to help us grow. #hiring #jobs

2/3 📋 You'll be responsible for key initiatives that drive our success. Looking for experience with: ${inputData.keySkills
    .slice(0, 3)
    .join(", ")} #${inputData.department.toLowerCase()}

3/3 ✅ Ready to apply? Send us your resume! We offer competitive benefits and great growth opportunities. #careers #opportunity`;
}

function createFallbackInstagramPost(jobDescription, inputData) {
  return `🌟 EXCITING OPPORTUNITY ALERT! 🌟

We're looking for an amazing ${inputData.jobTitle} to join our ${
    inputData.department
  } team! 💼

✨ What makes this role special?
${jobDescription.benefits
  .slice(0, 2)
  .map((b) => `• ${b}`)
  .join("\n")}

🎯 We need someone with:
${inputData.keySkills
  .slice(0, 4)
  .map((s) => `#${s.replace(/\s+/g, "")}`)
  .join(" ")}

Ready to take your career to the next level? DM us or check our website! 📩

#hiring #jobopportunity #${inputData.department.toLowerCase()} #careers #worklife #joinus`;
}
