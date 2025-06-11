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

    // Forward the form data to backend
    const formData = await request.formData();

    const response = await fetch(
      `${BACKEND_URL}/api/employee/documents/upload`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to upload document" },
        { status: response.status }
      );
    }

    const uploadData = await response.json();
    return NextResponse.json(uploadData);
  } catch (error) {
    console.error("Document Upload API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
