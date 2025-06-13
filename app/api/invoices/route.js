import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = process.env.ADMIN_TOKEN || "admin-token-placeholder";
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const response = await fetch(`${backendUrl}/api/invoices`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data.data || [],
      pagination: data.pagination,
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch invoices",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const token = process.env.ADMIN_TOKEN || "admin-token-placeholder";
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const response = await fetch(`${backendUrl}/api/invoices`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Backend responded with status: ${response.status}`
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data.data,
      message: "Invoice created successfully",
    });
  } catch (error) {
    console.error("Error creating invoice:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create invoice",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
