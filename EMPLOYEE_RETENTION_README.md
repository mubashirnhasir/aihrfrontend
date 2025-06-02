# AI-Driven Employee Retention Prediction Module

## Overview

This module provides AI-driven predictive analytics for employee retention, helping HR teams identify at-risk employees and take proactive measures to improve retention rates.

## Features

### 🤖 AI Prediction Engine

- Analyzes 8 key factors: job satisfaction, engagement, tenure, work-life balance, salary satisfaction, career growth, manager relationship, and performance
- Provides risk scores (0-100) and risk levels (Low/Medium/High)
- Confidence scoring for predictions

### 📊 Comprehensive Dashboard

- **Overview**: Key metrics, risk distribution, and quick statistics
- **Employee Risk Table**: Detailed employee list with filtering and sorting
- **Analytics**: Charts and visualizations for trends and patterns
- **Department Analytics**: Department-wise breakdown and insights
- **Action Recommendations**: AI-generated actionable insights

### 🎯 Key Metrics Tracked

- Current retention rate and trends
- Risk distribution across employees
- Department-wise analytics
- Predicted turnover timeline (30 days, 90 days, 6 months, 1 year)
- Risk factor impact analysis

## Installation & Setup

### 1. Files Created

```
app/
├── employee-retention/
│   └── page.js                           # Main dashboard page
├── api/
│   └── employee-retention/
│       ├── predict/
│       │   └── route.js                  # Prediction API endpoint
│       └── analytics/
│           └── route.js                  # Analytics API endpoint

sections/
└── employee-retention/
    ├── retentionDashboardWrapper.js      # Main dashboard wrapper
    ├── retentionOverview.js              # Overview component
    ├── employeeRiskTable.js              # Employee table component
    ├── retentionCharts.js                # Charts component
    ├── departmentAnalytics.js            # Department analytics
    └── actionRecommendations.js          # Action recommendations

lib/
├── employee-retention-utils.js           # Utility functions
└── sampleData.js                        # Sample data for testing
```

### 2. Navigation Updated

- Added "AI Retention" link to sidebar navigation
- Accessible at `/employee-retention`

### 3. Dependencies

No additional dependencies required - uses existing Next.js, React, and Tailwind CSS.

## API Endpoints

### GET /api/employee-retention/predict

Returns predictions for all employees with mock data.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "department": "Engineering",
      "prediction": {
        "riskScore": 25,
        "riskLevel": "Low",
        "confidence": 0.85
      }
    }
  ],
  "metadata": {
    "totalEmployees": 135,
    "highRisk": 16,
    "mediumRisk": 36,
    "lowRisk": 83
  }
}
```

### POST /api/employee-retention/predict

Predicts retention for a specific employee.

**Request:**

```json
{
  "jobSatisfaction": 7,
  "engagementLevel": 8,
  "tenure": 3.5,
  "workLifeBalance": 6,
  "salarySatisfaction": 7,
  "careerGrowth": 6,
  "managerRelationship": 8,
  "performanceScore": 8
}
```

### GET /api/employee-retention/analytics

Returns comprehensive analytics and trends data.

## Prediction Algorithm

The current implementation uses a simple scoring algorithm that considers:

1. **Job Satisfaction** (0-10): Lower scores add higher risk
2. **Engagement Level** (0-10): Lower engagement increases risk
3. **Tenure**: New hires and very long-tenured employees may have higher risk
4. **Work-Life Balance** (0-10): Poor balance increases risk
5. **Salary Satisfaction** (0-10): Dissatisfaction with compensation adds risk
6. **Career Growth** (0-10): Limited growth opportunities increase risk
7. **Manager Relationship** (0-10): Poor relationships add risk
8. **Performance Score** (0-10): Low performance may indicate disengagement

**Risk Levels:**

- **Low Risk**: Score 0-29 (typically satisfied employees)
- **Medium Risk**: Score 30-59 (may need attention)
- **High Risk**: Score 60+ (immediate intervention recommended)

## Usage

### 1. Accessing the Dashboard

Navigate to `/employee-retention` in your application to access the full dashboard.

### 2. Viewing Employee Risk

1. Go to the "Employee Risk" tab
2. Use filters to find specific employees or departments
3. Sort by risk score, satisfaction, or other metrics
4. Click "Update" to recalculate predictions for specific employees

### 3. Analyzing Trends

1. Visit the "Analytics" tab for visual charts
2. Review monthly retention trends
3. Analyze risk factor impacts
4. Check predicted turnover timeline

### 4. Department Analysis

1. Use the "Departments" tab
2. Click on department cards for detailed analysis
3. Review employee lists and risk distributions
4. Get department-specific recommendations

### 5. Action Planning

1. Check the "Actions" tab for AI-generated recommendations
2. Mark actions as completed to track progress
3. View quick actions you can take today
4. Monitor implementation progress

## Customization

### 1. Prediction Algorithm

To integrate with a real ML model:

1. Replace the mock prediction function in `/api/employee-retention/predict/route.js`
2. Add your ML model endpoint or library
3. Update the prediction logic while maintaining the same response format

### 2. Data Integration

To connect with your database:

1. Replace mock data in API routes with actual database queries
2. Update the employee data structure as needed
3. Ensure proper data validation and error handling

### 3. UI Customization

- Modify components in `/sections/employee-retention/`
- Update styling using Tailwind CSS classes
- Add new charts or visualizations as needed

### 4. Additional Features

Consider adding:

- Real-time notifications for high-risk employees
- Integration with HR systems
- Automated reporting
- Machine learning model training interface
- Employee self-assessment tools

## Testing

### 1. Sample Data

The module includes sample data in `/lib/sampleData.js` for testing purposes.

### 2. API Testing

You can test the APIs using:

```bash
# Get all predictions
curl http://localhost:3000/api/employee-retention/predict

# Predict for specific employee
curl -X POST http://localhost:3000/api/employee-retention/predict \
  -H "Content-Type: application/json" \
  -d '{"jobSatisfaction": 7, "engagementLevel": 8, "tenure": 3.5, "workLifeBalance": 6, "salarySatisfaction": 7, "careerGrowth": 6, "managerRelationship": 8, "performanceScore": 8}'

# Get analytics
curl http://localhost:3000/api/employee-retention/analytics
```

## Security Considerations

1. **Data Privacy**: Ensure employee data is properly anonymized and secured
2. **Access Control**: Implement proper authentication and authorization
3. **GDPR Compliance**: Consider data protection regulations
4. **Audit Logging**: Track who accesses prediction data

## Future Enhancements

1. **Real ML Integration**: Replace mock algorithm with actual machine learning models
2. **Historical Analysis**: Add trend analysis over longer periods
3. **Intervention Tracking**: Monitor the effectiveness of retention actions
4. **Benchmark Comparisons**: Compare against industry standards
5. **Mobile App**: Create mobile interface for managers
6. **Integration APIs**: Connect with popular HR platforms (Workday, BambooHR, etc.)

## Support

For questions or issues with the Employee Retention module:

1. Check the API responses for error messages
2. Review browser console for frontend issues
3. Ensure all required data fields are properly formatted
4. Verify API endpoints are accessible

## License

This module is part of your HRMS system and follows the same licensing terms.
