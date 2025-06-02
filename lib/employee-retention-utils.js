/**
 * Employee Retention Utilities
 * Helper functions for data processing and analytics
 */

/**
 * Employee data structure for retention prediction
 * @typedef {Object} EmployeeData
 * @property {number} id - Unique employee identifier
 * @property {string} name - Employee name
 * @property {string} department - Department name
 * @property {string} position - Job position/title
 * @property {number} jobSatisfaction - Job satisfaction score (0-10)
 * @property {number} engagementLevel - Employee engagement level (0-10)
 * @property {number} tenure - Years of service
 * @property {number} workLifeBalance - Work-life balance satisfaction (0-10)
 * @property {number} salarySatisfaction - Salary satisfaction (0-10)
 * @property {number} careerGrowth - Career growth opportunities satisfaction (0-10)
 * @property {number} managerRelationship - Manager relationship quality (0-10)
 * @property {number} performanceScore - Performance evaluation score (0-10)
 */

/**
 * Prediction result structure
 * @typedef {Object} PredictionResult
 * @property {number} riskScore - Risk score (0-100)
 * @property {string} riskLevel - Risk level: 'Low', 'Medium', 'High'
 * @property {number} confidence - Prediction confidence (0-1)
 * @property {Object} factors - Contributing factors
 */

/**
 * Validates employee data for prediction
 * @param {EmployeeData} data - Employee data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateEmployeeData(data) {
  const errors = [];
  const requiredFields = [
    'jobSatisfaction', 'engagementLevel', 'tenure', 
    'workLifeBalance', 'salarySatisfaction', 'careerGrowth',
    'managerRelationship', 'performanceScore'
  ];

  // Check required fields
  requiredFields.forEach(field => {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate data ranges
  const scaleFields = [
    'jobSatisfaction', 'engagementLevel', 'workLifeBalance',
    'salarySatisfaction', 'careerGrowth', 'managerRelationship',
    'performanceScore'
  ];

  scaleFields.forEach(field => {
    if (data[field] !== undefined && (data[field] < 0 || data[field] > 10)) {
      errors.push(`${field} must be between 0 and 10`);
    }
  });

  if (data.tenure !== undefined && data.tenure < 0) {
    errors.push('Tenure must be a positive number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Processes raw employee data for prediction
 * @param {Object} rawData - Raw employee data
 * @returns {EmployeeData} Processed employee data
 */
export function preprocessEmployeeData(rawData) {
  return {
    id: rawData.id || null,
    name: rawData.name || 'Unknown',
    department: rawData.department || 'Unknown',
    position: rawData.position || 'Unknown',
    jobSatisfaction: normalizeScore(rawData.jobSatisfaction),
    engagementLevel: normalizeScore(rawData.engagementLevel),
    tenure: Math.max(0, parseFloat(rawData.tenure) || 0),
    workLifeBalance: normalizeScore(rawData.workLifeBalance),
    salarySatisfaction: normalizeScore(rawData.salarySatisfaction),
    careerGrowth: normalizeScore(rawData.careerGrowth),
    managerRelationship: normalizeScore(rawData.managerRelationship),
    performanceScore: normalizeScore(rawData.performanceScore)
  };
}

/**
 * Normalizes a score to 0-10 range
 * @param {number} score - Input score
 * @returns {number} Normalized score (0-10)
 */
function normalizeScore(score) {
  const num = parseFloat(score);
  if (isNaN(num)) return 5; // Default neutral score
  return Math.max(0, Math.min(10, num));
}

/**
 * Calculates risk level color for UI display
 * @param {string} riskLevel - Risk level ('Low', 'Medium', 'High')
 * @returns {Object} Color configuration
 */
export function getRiskLevelColor(riskLevel) {
  const colors = {
    'Low': {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      dot: 'bg-green-500'
    },
    'Medium': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      dot: 'bg-yellow-500'
    },
    'High': {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      dot: 'bg-red-500'
    }
  };

  return colors[riskLevel] || colors['Medium'];
}

/**
 * Formats percentage for display
 * @param {number} value - Percentage value
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export function formatPercentage(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats numbers with thousands separator
 * @param {number} value - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(value) {
  return new Intl.NumberFormat().format(value);
}

/**
 * Calculates trend direction
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {Object} Trend information
 */
export function calculateTrend(current, previous) {
  const change = current - previous;
  const percentChange = previous !== 0 ? (change / previous) * 100 : 0;
  
  let direction = 'stable';
  if (Math.abs(percentChange) > 2) {
    direction = change > 0 ? 'up' : 'down';
  }

  return {
    direction,
    change,
    percentChange: Math.abs(percentChange),
    isPositive: change >= 0
  };
}

/**
 * Groups employees by risk level
 * @param {Array} employees - Array of employees with predictions
 * @returns {Object} Grouped employees
 */
export function groupEmployeesByRisk(employees) {
  return employees.reduce((groups, employee) => {
    const riskLevel = employee.prediction?.riskLevel || 'Unknown';
    if (!groups[riskLevel]) {
      groups[riskLevel] = [];
    }
    groups[riskLevel].push(employee);
    return groups;
  }, {});
}

/**
 * Calculates department statistics
 * @param {Array} employees - Array of employees with predictions
 * @returns {Array} Department statistics
 */
export function calculateDepartmentStats(employees) {
  const departmentGroups = employees.reduce((groups, employee) => {
    const dept = employee.department || 'Unknown';
    if (!groups[dept]) {
      groups[dept] = [];
    }
    groups[dept].push(employee);
    return groups;
  }, {});

  return Object.entries(departmentGroups).map(([department, deptEmployees]) => {
    const riskCounts = groupEmployeesByRisk(deptEmployees);
    const avgSatisfaction = deptEmployees.reduce((sum, emp) => 
      sum + (emp.jobSatisfaction || 0), 0) / deptEmployees.length;

    return {
      department,
      totalEmployees: deptEmployees.length,
      highRisk: (riskCounts.High || []).length,
      mediumRisk: (riskCounts.Medium || []).length,
      lowRisk: (riskCounts.Low || []).length,
      avgSatisfaction: avgSatisfaction.toFixed(1)
    };
  });
}

/**
 * Generates mock historical data for charts
 * @param {number} months - Number of months to generate
 * @returns {Array} Historical data points
 */
export function generateMockHistoricalData(months = 12) {
  const data = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  for (let i = 0; i < months; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    
    // Generate mock retention rate with some variation
    const baseRate = 85;
    const variation = Math.random() * 8 - 4; // ±4% variation
    const retentionRate = Math.max(75, Math.min(95, baseRate + variation));
    
    data.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      retentionRate: parseFloat(retentionRate.toFixed(1)),
      turnoverCount: Math.floor(Math.random() * 10) + 2
    });
  }

  return data;
}

/**
 * Debounce utility for search and API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
