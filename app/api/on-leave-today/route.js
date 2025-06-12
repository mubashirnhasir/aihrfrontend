import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/api/leaves/on-leave-today`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data.data || [],
      count: data.count || 0,
      date: data.date
    });

  } catch (error) {
    console.error('Error fetching employees on leave today:', error);
    
    // Return fallback data in case of error
    const fallbackData = [
      {
        id: 'fallback-1',
        name: "No Data Available",
        leavePeriod: "Service Unavailable",
        leaveType: "System Error",
        email: "",
        department: "",
        profilePicture: null
      }
    ];

    return NextResponse.json({
      success: false,
      data: fallbackData,
      count: 0,
      error: error.message,
      fallback: true
    }, { status: 200 }); // Return 200 to prevent UI errors
  }
}
