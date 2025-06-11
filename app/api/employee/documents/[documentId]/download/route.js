import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(request, { params }) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header required" },
        { status: 401 }
      );
    }

    const { documentId } = params;

    const response = await fetch(
      `${BACKEND_URL}/api/employee/documents/${documentId}/download`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to download document" },
        { status: response.status }
      );
    }

    // Forward the file stream
    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/octet-stream",
        "Content-Disposition":
          response.headers.get("Content-Disposition") || "attachment",
      },
    });
  } catch (error) {
    console.error("Document Download API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
