import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json(
        { message: "Name parameter is required" },
        { status: 400 }
      );
    }

    // Fetch employee profile by name from backend
    const response = await fetch(
      `${BACKEND_URL}/api/employees/profile?name=${encodeURIComponent(name)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to fetch employee profile" },
        { status: response.status }
      );
    }

    const profileData = await response.json();
    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Employee profile GET API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
