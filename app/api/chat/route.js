import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const prompt = body.prompt;

    if (!prompt) {
      return NextResponse.json(
        { error: "No prompt provided" },
        { status: 400 }
      );
    }

    let reply = "";

    try {
      // Call OpenAI API using fetch
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are an intelligent HR assistant for a company's HRMS dashboard. 
Answer only questions about HRMS features like:
- Employee attendance and time tracking
- Leave management and requests
- Asset management and assignments
- Document management and storage
- Payroll and compensation
- Employee retention and analytics
- Career development and growth
- Performance reviews
- Recruitment and job creation

If a user asks anything unrelated to HR or HRMS (like math, general trivia, or casual chat), respond:
"Sorry, I'm only trained to help with our HRMS system. Please ask a work-related question about attendance, leaves, assets, documents, payroll, or other HR topics."

Be helpful, professional, and provide actionable guidance for HR-related queries.`,
              },
              { role: "user", content: prompt },
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      reply =
        data.choices[0]?.message?.content ||
        "Sorry, I could not generate a response.";    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);

      // Enhanced fallback response system
      const lowerPrompt = prompt.toLowerCase();
      
      // Leave management queries
      if (lowerPrompt.includes("leave") || lowerPrompt.includes("vacation") || 
          lowerPrompt.includes("time off") || lowerPrompt.includes("holiday")) {
        if (lowerPrompt.includes("how") || lowerPrompt.includes("apply")) {
          reply = "To apply for leave, go to the Leaves section in your dashboard. You can submit new leave requests, specify dates, and add reasons. Your manager will receive the request for approval.";
        } else if (lowerPrompt.includes("balance") || lowerPrompt.includes("remaining")) {
          reply = "You can check your leave balance in the Leaves section. It shows your available vacation days, sick leave, and other leave types for the current year.";
        } else {
          reply = "Our leave management system helps you request time off, track leave balances, and manage approvals. Visit the Leaves section for all leave-related activities.";
        }
      }
      // Attendance queries
      else if (lowerPrompt.includes("attendance") || lowerPrompt.includes("clock") || 
               lowerPrompt.includes("time") || lowerPrompt.includes("hours")) {
        if (lowerPrompt.includes("clock in") || lowerPrompt.includes("check in")) {
          reply = "To clock in, go to the Attendance section and click the 'Clock In' button. This will record your start time for the day.";
        } else if (lowerPrompt.includes("report") || lowerPrompt.includes("history")) {
          reply = "You can view your attendance history and generate reports in the Attendance section. It shows your daily hours, overtime, and attendance patterns.";
        } else {
          reply = "The Attendance section helps you track work hours, clock in/out, view attendance history, and manage overtime requests.";
        }
      }
      // Asset management
      else if (lowerPrompt.includes("asset") || lowerPrompt.includes("equipment") || 
               lowerPrompt.includes("laptop") || lowerPrompt.includes("device")) {
        if (lowerPrompt.includes("request") || lowerPrompt.includes("need")) {
          reply = "To request equipment or assets, go to the Assets section and submit a new asset request. Specify what you need and the reason for the request.";
        } else if (lowerPrompt.includes("return") || lowerPrompt.includes("give back")) {
          reply = "For asset returns, use the Assets section to initiate a return process. Make sure to specify the condition and reason for return.";
        } else {
          reply = "The Assets section manages company equipment assignments, requests, and returns. You can track all your assigned assets there.";
        }
      }
      // Document management
      else if (lowerPrompt.includes("document") || lowerPrompt.includes("file") || 
               lowerPrompt.includes("upload") || lowerPrompt.includes("download")) {
        reply = "The Documents section allows you to store, organize, and share HR documents. You can upload files, create folders, and manage document access permissions.";
      }
      // Employee information
      else if (lowerPrompt.includes("employee") || lowerPrompt.includes("staff") || 
               lowerPrompt.includes("profile") || lowerPrompt.includes("information")) {
        if (lowerPrompt.includes("update") || lowerPrompt.includes("change")) {
          reply = "To update your employee profile, contact your HR administrator. They can help modify personal information, contact details, and other profile data.";
        } else {
          reply = "Employee information and profiles are managed through the dashboard. You can view team details and organizational structure in the Employees section.";
        }
      }
      // Payroll queries
      else if (lowerPrompt.includes("payroll") || lowerPrompt.includes("salary") || 
               lowerPrompt.includes("pay") || lowerPrompt.includes("wage")) {
        reply = "For payroll inquiries including salary details, pay stubs, and tax information, please contact your HR administrator. They handle all compensation-related matters.";
      }
      // Career development
      else if (lowerPrompt.includes("career") || lowerPrompt.includes("growth") || 
               lowerPrompt.includes("development") || lowerPrompt.includes("skill")) {
        reply = "Check out the Career Growth section for development opportunities, skill assessments, training programs, and career path guidance.";
      }
      // AI/automation features
      else if (lowerPrompt.includes("ai") || lowerPrompt.includes("automation") || 
               lowerPrompt.includes("intelligent") || lowerPrompt.includes("smart")) {
        reply = "Our HRMS includes AI-powered features like employee retention analytics, smart job description generation, and automated email creation. Explore the AI tools in your dashboard!";
      }
      // General greetings
      else if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi") || 
               lowerPrompt.includes("hey") || lowerPrompt.includes("good")) {
        reply = "Hello! I'm your HRMS assistant. I can help you with attendance, leaves, assets, documents, payroll questions, and other HR-related topics. What would you like to know?";
      }
      // Help requests
      else if (lowerPrompt.includes("help") || lowerPrompt.includes("how") || 
               lowerPrompt.includes("what") || lowerPrompt.includes("where")) {
        if (lowerPrompt.includes("what is") || lowerPrompt.includes("what's")) {
          reply = "I can explain HRMS features! Try asking about specific topics like 'what is leave management' or 'what are assets' for detailed information.";
        } else {
          reply = "I'm here to help! You can ask me about:\n• Attendance and time tracking\n• Leave requests and balances\n• Asset management\n• Document storage\n• Employee information\n• Payroll inquiries\n• Career development\n\nWhat specific topic interests you?";
        }
      }
      // Default response with variety
      else {
        const defaultResponses = [
          "I'm your HRMS assistant! I can help with attendance, leaves, assets, documents, payroll, and other HR topics. What would you like to know?",
          "Hi there! I'm here to assist with your HRMS needs. Ask me about time tracking, leave management, asset requests, or any other HR-related questions.",
          "Welcome! I can provide guidance on our HRMS features including attendance, document management, employee information, and more. How can I help?",
          "Hello! I'm your HR assistant. I can answer questions about leaves, attendance, assets, payroll, career development, and other workplace topics.",
          "I'm here to help with your HRMS experience! Feel free to ask about any HR processes, system features, or workplace policies."
        ];
        reply = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      }
    }

    return NextResponse.json({
      success: true,
      reply: reply,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
