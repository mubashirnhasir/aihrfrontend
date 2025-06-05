import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header required" },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/employee/profile`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to fetch career data" },
        { status: response.status }
      );
    }

    const profileData = await response.json();

    // Transform profile data to include career-specific information
    const careerData = {
      employee: {
        name: profileData.name,
        designation: profileData.designation,
        department: profileData.department,
        joiningDate: profileData.joiningDate,
        employeeId: profileData.employeeId,
      },
      skills: profileData.skills || [],
      recommendedSkills: profileData.recommendedSkills || [],
      studyPlans: profileData.studyPlans || [],
      careerPaths: profileData.careerPaths || [],
      completedCourses: profileData.completedCourses || 0,
      skillsProgress: profileData.skillsProgress || 0,
    };

    return NextResponse.json(careerData);
  } catch (error) {
    console.error("Career GET API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
