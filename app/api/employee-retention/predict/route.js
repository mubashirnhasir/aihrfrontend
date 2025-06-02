/**
 * Employee Retention API Routes
 * Backend API endpoints for predictive analytics
 * Note: This is frontend code structure - adapt for your backend project
 */

// Mock ML prediction logic (replace with actual ML model integration)
function predictEmployeeRetention(employeeData) {
  // Simple scoring algorithm based on multiple factors
  let riskScore = 0;
  
  // Job satisfaction factor (0-10 scale, lower = higher risk)
  if (employeeData.jobSatisfaction <= 3) riskScore += 30;
  else if (employeeData.jobSatisfaction <= 6) riskScore += 15;
  else if (employeeData.jobSatisfaction <= 8) riskScore += 5;
  
  // Engagement level factor (0-10 scale, lower = higher risk)
  if (employeeData.engagementLevel <= 3) riskScore += 25;
  else if (employeeData.engagementLevel <= 6) riskScore += 12;
  else if (employeeData.engagementLevel <= 8) riskScore += 3;
  
  // Tenure factor (years)
  if (employeeData.tenure < 1) riskScore += 20;
  else if (employeeData.tenure < 2) riskScore += 10;
  else if (employeeData.tenure > 5) riskScore += 5;
  
  // Work-life balance factor
  if (employeeData.workLifeBalance <= 3) riskScore += 15;
  else if (employeeData.workLifeBalance <= 6) riskScore += 8;
  
  // Salary satisfaction factor
  if (employeeData.salarySatisfaction <= 3) riskScore += 20;
  else if (employeeData.salarySatisfaction <= 6) riskScore += 10;
  
  // Career growth opportunities
  if (employeeData.careerGrowth <= 3) riskScore += 15;
  else if (employeeData.careerGrowth <= 6) riskScore += 7;
  
  // Manager relationship
  if (employeeData.managerRelationship <= 3) riskScore += 12;
  else if (employeeData.managerRelationship <= 6) riskScore += 6;
  
  // Recent performance reviews
  if (employeeData.performanceScore <= 3) riskScore += 10;
  
  // Determine risk level
  let riskLevel = 'Low';
  if (riskScore >= 60) riskLevel = 'High';
  else if (riskScore >= 30) riskLevel = 'Medium';
  
  return {
    riskScore: Math.min(riskScore, 100),
    riskLevel,
    confidence: Math.random() * 0.3 + 0.7, // Mock confidence score
    factors: {
      jobSatisfaction: employeeData.jobSatisfaction,
      engagementLevel: employeeData.engagementLevel,
      tenure: employeeData.tenure,
      workLifeBalance: employeeData.workLifeBalance,
      salarySatisfaction: employeeData.salarySatisfaction,
      careerGrowth: employeeData.careerGrowth,
      managerRelationship: employeeData.managerRelationship,
      performanceScore: employeeData.performanceScore
    }
  };
}

/**
 * GET /api/employee-retention/predict
 * Endpoint to get predictions for all employees
 */
export async function GET(request) {
  try {
    // Mock employee data - replace with actual database query
    const mockEmployees = [
      {
        id: 1,
        name: "John Doe",
        department: "Engineering",
        position: "Senior Developer",
        jobSatisfaction: 7,
        engagementLevel: 8,
        tenure: 3.5,
        workLifeBalance: 6,
        salarySatisfaction: 7,
        careerGrowth: 6,
        managerRelationship: 8,
        performanceScore: 8
      },
      {
        id: 2,
        name: "Jane Smith",
        department: "Marketing",
        position: "Marketing Manager",
        jobSatisfaction: 4,
        engagementLevel: 5,
        tenure: 1.2,
        workLifeBalance: 4,
        salarySatisfaction: 5,
        careerGrowth: 3,
        managerRelationship: 6,
        performanceScore: 7
      },
      {
        id: 3,
        name: "Mike Johnson",
        department: "Sales",
        position: "Sales Representative",
        jobSatisfaction: 9,
        engagementLevel: 9,
        tenure: 2.8,
        workLifeBalance: 8,
        salarySatisfaction: 8,
        careerGrowth: 7,
        managerRelationship: 9,
        performanceScore: 9
      },
      {
        id: 4,
        name: "Sarah Wilson",
        department: "HR",
        position: "HR Specialist",
        jobSatisfaction: 3,
        engagementLevel: 4,
        tenure: 0.8,
        workLifeBalance: 3,
        salarySatisfaction: 4,
        careerGrowth: 2,
        managerRelationship: 5,
        performanceScore: 6
      },
      {
        id: 5,
        name: "David Brown",
        department: "Finance",
        position: "Financial Analyst",
        jobSatisfaction: 6,
        engagementLevel: 6,
        tenure: 4.2,
        workLifeBalance: 7,
        salarySatisfaction: 6,
        careerGrowth: 5,
        managerRelationship: 7,
        performanceScore: 7
      }
    ];

    // Generate predictions for all employees
    const predictions = mockEmployees.map(employee => ({
      ...employee,
      prediction: predictEmployeeRetention(employee)
    }));

    return Response.json({
      success: true,
      data: predictions,
      metadata: {
        totalEmployees: predictions.length,
        highRisk: predictions.filter(p => p.prediction.riskLevel === 'High').length,
        mediumRisk: predictions.filter(p => p.prediction.riskLevel === 'Medium').length,
        lowRisk: predictions.filter(p => p.prediction.riskLevel === 'Low').length,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in employee retention prediction:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to generate predictions',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/employee-retention/predict
 * Endpoint to predict retention for a specific employee
 */
export async function POST(request) {
  try {
    const employeeData = await request.json();

    // Validate required fields
    const requiredFields = [
      'jobSatisfaction', 'engagementLevel', 'tenure', 
      'workLifeBalance', 'salarySatisfaction', 'careerGrowth',
      'managerRelationship', 'performanceScore'
    ];

    for (const field of requiredFields) {
      if (employeeData[field] === undefined || employeeData[field] === null) {
        return Response.json(
          { 
            success: false, 
            error: `Missing required field: ${field}` 
          },
          { status: 400 }
        );
      }
    }

    // Validate data ranges
    const scaleFields = [
      'jobSatisfaction', 'engagementLevel', 'workLifeBalance',
      'salarySatisfaction', 'careerGrowth', 'managerRelationship',
      'performanceScore'
    ];

    for (const field of scaleFields) {
      if (employeeData[field] < 0 || employeeData[field] > 10) {
        return Response.json(
          { 
            success: false, 
            error: `${field} must be between 0 and 10` 
          },
          { status: 400 }
        );
      }
    }

    if (employeeData.tenure < 0) {
      return Response.json(
        { 
          success: false, 
          error: 'Tenure must be a positive number' 
        },
        { status: 400 }
      );
    }

    // Generate prediction
    const prediction = predictEmployeeRetention(employeeData);

    return Response.json({
      success: true,
      data: {
        employee: employeeData,
        prediction: prediction,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in individual employee prediction:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to process prediction request',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
