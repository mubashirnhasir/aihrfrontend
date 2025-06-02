/**
 * Employee Retention Analytics API
 * Additional endpoint for detailed analytics and trends
 */

/**
 * GET /api/employee-retention/analytics
 * Endpoint to get detailed analytics and trends
 */
export async function GET(request) {
  try {
    // Mock analytics data - replace with actual database queries
    const mockAnalytics = {
      // Overall retention trends
      retentionTrends: {
        current: 85.5, // Current retention rate percentage
        previousMonth: 87.2,
        previousQuarter: 88.1,
        yearToDate: 86.8,
        trend: 'declining' // 'improving', 'stable', 'declining'
      },

      // Department-wise breakdown
      departmentAnalytics: [
        {
          department: 'Engineering',
          totalEmployees: 45,
          highRisk: 3,
          mediumRisk: 8,
          lowRisk: 34,
          retentionRate: 91.2,
          avgSatisfaction: 7.8
        },
        {
          department: 'Sales',
          totalEmployees: 32,
          highRisk: 6,
          mediumRisk: 12,
          lowRisk: 14,
          retentionRate: 78.5,
          avgSatisfaction: 6.2
        },
        {
          department: 'Marketing',
          totalEmployees: 28,
          highRisk: 4,
          mediumRisk: 9,
          lowRisk: 15,
          retentionRate: 82.1,
          avgSatisfaction: 6.8
        },
        {
          department: 'HR',
          totalEmployees: 12,
          highRisk: 2,
          mediumRisk: 3,
          lowRisk: 7,
          retentionRate: 79.3,
          avgSatisfaction: 6.5
        },
        {
          department: 'Finance',
          totalEmployees: 18,
          highRisk: 1,
          mediumRisk: 4,
          lowRisk: 13,
          retentionRate: 88.9,
          avgSatisfaction: 7.4
        }
      ],

      // Risk factor analysis
      riskFactors: {
        primaryFactors: [
          { factor: 'Job Satisfaction', impact: 28.5, trend: 'declining' },
          { factor: 'Career Growth', impact: 24.3, trend: 'stable' },
          { factor: 'Salary Satisfaction', impact: 18.7, trend: 'improving' },
          { factor: 'Work-Life Balance', impact: 15.2, trend: 'declining' },
          { factor: 'Manager Relationship', impact: 13.3, trend: 'stable' }
        ],
        secondaryFactors: [
          { factor: 'Engagement Level', impact: 12.8 },
          { factor: 'Performance Score', impact: 8.2 },
          { factor: 'Tenure', impact: 6.5 }
        ]
      },

      // Predictions summary
      predictionsSummary: {
        totalEmployees: 135,
        predictions: {
          highRisk: 16,
          mediumRisk: 36,
          lowRisk: 83
        },
        estimatedTurnover: {
          next30Days: 3,
          next90Days: 8,
          next6Months: 15,
          nextYear: 22
        }
      },

      // Monthly trends (last 12 months)
      monthlyTrends: [
        { month: 'Jan 2024', retentionRate: 89.2, turnoverCount: 4 },
        { month: 'Feb 2024', retentionRate: 88.7, turnoverCount: 5 },
        { month: 'Mar 2024', retentionRate: 87.3, turnoverCount: 6 },
        { month: 'Apr 2024', retentionRate: 88.9, turnoverCount: 4 },
        { month: 'May 2024', retentionRate: 86.5, turnoverCount: 7 },
        { month: 'Jun 2024', retentionRate: 87.8, turnoverCount: 5 },
        { month: 'Jul 2024', retentionRate: 85.2, turnoverCount: 8 },
        { month: 'Aug 2024', retentionRate: 86.9, turnoverCount: 6 },
        { month: 'Sep 2024', retentionRate: 84.7, turnoverCount: 9 },
        { month: 'Oct 2024', retentionRate: 85.8, turnoverCount: 7 },
        { month: 'Nov 2024', retentionRate: 87.2, turnoverCount: 5 },
        { month: 'Dec 2024', retentionRate: 85.5, turnoverCount: 8 }
      ],

      // Action recommendations
      recommendations: [
        {
          priority: 'High',
          action: 'Conduct stay interviews with high-risk employees',
          department: 'Sales',
          expectedImpact: 'Reduce turnover risk by 15-20%',
          timeline: '2 weeks'
        },
        {
          priority: 'High',
          action: 'Review and improve career development programs',
          department: 'All',
          expectedImpact: 'Improve career growth satisfaction by 25%',
          timeline: '1 month'
        },
        {
          priority: 'Medium',
          action: 'Implement flexible work arrangements',
          department: 'Marketing, HR',
          expectedImpact: 'Improve work-life balance scores by 20%',
          timeline: '6 weeks'
        },
        {
          priority: 'Medium',
          action: 'Salary benchmarking and adjustment review',
          department: 'Sales, HR',
          expectedImpact: 'Improve salary satisfaction by 15%',
          timeline: '2 months'
        }
      ]
    };

    return Response.json({
      success: true,
      data: mockAnalytics,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in analytics endpoint:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch analytics data',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
