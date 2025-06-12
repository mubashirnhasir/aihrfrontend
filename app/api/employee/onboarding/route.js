import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required sections for onboarding
    const requiredSections = ["personalInfo", "address"];
    const providedSections = Object.keys(body);

    const hasRequiredSections = requiredSections.every((section) =>
      providedSections.includes(section)
    );

    if (!hasRequiredSections) {
      return NextResponse.json(
        {
          message:
            "Personal information and address are required for onboarding",
        },
        { status: 400 }
      );
    }

    // Validate personal info required fields
    const { personalInfo } = body;
    const requiredPersonalFields = ["firstName", "lastName", "email", "phone"];
    const missingFields = requiredPersonalFields.filter(
      (field) => !personalInfo[field] || personalInfo[field].trim() === ""
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: `Missing required personal information: ${missingFields.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    } // Forward the onboarding data to the backend
    console.log(
      "🚀 Forwarding to backend:",
      `${BACKEND_URL}/api/employee/onboarding`
    );
    console.log("🔑 Auth header:", authHeader.substring(0, 20) + "...");

    const response = await fetch(`${BACKEND_URL}/api/employee/onboarding`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        onboardingStatus: "completed",
        onboardingCompletedAt: new Date().toISOString(),
      }),
    });

    console.log("📡 Backend response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Backend error:", errorData);
      return NextResponse.json(
        { message: errorData.message || "Failed to complete onboarding" },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log("✅ Backend success:", result);
    return NextResponse.json({
      message: "Onboarding completed successfully",
      employee: result,
    });
  } catch (error) {
    console.error("Onboarding API Error:", error);
    return NextResponse.json(
      { message: "Internal server error during onboarding" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header required" },
        { status: 401 }
      );
    }

    // Get onboarding status for the authenticated employee
    const response = await fetch(
      `${BACKEND_URL}/api/employees/onboarding-status`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to fetch onboarding status" },
        { status: response.status }
      );
    }

    const statusData = await response.json();
    return NextResponse.json(statusData);
  } catch (error) {
    console.error("Onboarding Status API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
