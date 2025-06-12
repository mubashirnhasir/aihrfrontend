/**
 * Employee utilities for consistent data fetching across components
 */

/**
 * Fetch total employee count from the API
 * @returns {Promise<number>} Total number of employees
 */
export const fetchTotalEmployeeCount = async () => {
  try {
    // Try count endpoint first for better performance
    const countResponse = await fetch("/api/employees/count");
    if (countResponse.ok) {
      const countData = await countResponse.json();
      if (countData.success) {
        return countData.count;
      }
    }

    // Fall back to fetching all employees if count endpoint fails
    const employeesResponse = await fetch("/api/employees");
    if (employeesResponse.ok) {
      const employees = await employeesResponse.json();
      if (Array.isArray(employees)) {
        return employees.length;
      }
    }

    throw new Error("Failed to fetch employee count");
  } catch (error) {
    console.error("Error fetching employee count:", error);
    throw error;
  }
};

/**
 * Fetch all employee data from the API
 * @returns {Promise<Array>} Array of employee objects
 */
export const fetchAllEmployees = async () => {
  try {
    const response = await fetch("/api/employees");
    if (!response.ok) {
      throw new Error("Failed to fetch employees");
    }

    const employees = await response.json();
    if (!Array.isArray(employees)) {
      throw new Error("Invalid employee data received");
    }

    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

/**
 * Calculate employee statistics from employee data
 * @param {Array} employees - Array of employee objects
 * @returns {Object} Employee statistics
 */
export const calculateEmployeeStats = (employees) => {
  if (!Array.isArray(employees)) {
    return {
      totalEmployees: 0,
      employeesOnLeave: 0,
      newHires: 0,
      employeesReliving: 0,
    };
  }

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Calculate employees on leave based on current active leave requests
  const employeesOnLeave = employees.filter((emp) => {
    if (!emp.leaveRequests || !Array.isArray(emp.leaveRequests)) return false;

    return emp.leaveRequests.some((leave) => {
      if (leave.status !== "approved") return false;

      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      return today >= startDate && today <= endDate;
    });
  }).length;

  // Calculate new hires (employees who joined in the last 30 days)
  const newHires = employees.filter((emp) => {
    const joinDate = new Date(emp.joiningDate || emp.createdAt);
    return joinDate >= thirtyDaysAgo;
  }).length;

  // Calculate employees who are no longer active (status !== 'active')
  const employeesReliving = employees.filter(
    (emp) => emp.status && emp.status !== "active"
  ).length;

  return {
    totalEmployees: employees.length,
    employeesOnLeave,
    newHires,
    employeesReliving,
  };
};
