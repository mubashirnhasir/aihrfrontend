/**
 * API Route: Get Employee Count
 * Returns the total count of employees without fetching all employee data
 */

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(request) {
  try {
    // Fetch employee count from backend
    const response = await fetch(`${BACKEND_URL}/api/employees/count`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // If count endpoint doesn't exist, fall back to getting all employees
      const employeesResponse = await fetch(`${BACKEND_URL}/api/employees`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!employeesResponse.ok) {
        return Response.json(
          { success: false, message: "Failed to fetch employee data" },
          { status: employeesResponse.status }
        );
      }

      const employees = await employeesResponse.json();
      return Response.json({
        success: true,
        count: Array.isArray(employees) ? employees.length : 0,
        source: "employees_list",
      });
    }

    const countData = await response.json();
    return Response.json({
      success: true,
      count: countData.count || 0,
      source: "count_endpoint",
    });
  } catch (error) {
    console.error("Employee count API error:", error);
    return Response.json(
      { success: false, message: "Internal server error", count: 0 },
      { status: 500 }
    );
  }
}
