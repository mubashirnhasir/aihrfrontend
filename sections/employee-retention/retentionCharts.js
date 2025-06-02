/**
 * Retention Charts Component
 * Displays various charts and visualizations for retention analytics
 */
'use client';

import { useMemo } from 'react';
import { formatPercentage } from '../../lib/employee-retention-utils';

export default function RetentionCharts({ analytics = null }) {
  
  // Prepare chart data
  const chartData = useMemo(() => {
    if (!analytics) return null;

    return {
      monthlyTrends: analytics.monthlyTrends || [],
      riskFactors: analytics.riskFactors?.primaryFactors || [],
      departmentData: analytics.departmentAnalytics || [],
      predictions: analytics.predictionsSummary || {}
    };
  }, [analytics]);

  if (!chartData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Monthly Retention Trends */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="mr-2">📈</span>
          Monthly Retention Trends
        </h3>
        
        <div className="h-64 relative">
          {/* Simple line chart representation */}
          <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
            {chartData.monthlyTrends.map((trend, index) => {
              const height = ((trend.retentionRate - 75) / 20) * 100; // Normalize to 75-95% range
              return (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-blue-500 w-8 rounded-t transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${Math.max(10, height)}%` }}
                    title={`${trend.month}: ${formatPercentage(trend.retentionRate)}`}
                  ></div>
                  <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">
                    {trend.month.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-500 py-4">
            <span>95%</span>
            <span>90%</span>
            <span>85%</span>
            <span>80%</span>
            <span>75%</span>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600">Average</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatPercentage(
                chartData.monthlyTrends.reduce((sum, t) => sum + t.retentionRate, 0) / 
                chartData.monthlyTrends.length
              )}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Highest</div>
            <div className="text-lg font-semibold text-green-600">
              {formatPercentage(Math.max(...chartData.monthlyTrends.map(t => t.retentionRate)))}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Lowest</div>
            <div className="text-lg font-semibold text-red-600">
              {formatPercentage(Math.min(...chartData.monthlyTrends.map(t => t.retentionRate)))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Factors Impact */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            Top Risk Factors
          </h3>
          
          <div className="space-y-4">
            {chartData.riskFactors.map((factor, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {factor.factor}
                  </span>
                  <span className="text-sm text-gray-600">
                    {factor.impact.toFixed(1)}% impact
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === 0 ? 'bg-red-500' :
                      index === 1 ? 'bg-orange-500' :
                      index === 2 ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${(factor.impact / 30) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Trend: {factor.trend}</span>
                  <span className={
                    factor.trend === 'improving' ? 'text-green-600' :
                    factor.trend === 'declining' ? 'text-red-600' :
                    'text-gray-600'
                  }>
                    {factor.trend === 'improving' ? '↗️' :
                     factor.trend === 'declining' ? '↘️' : '➡️'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Risk Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">🏢</span>
            Department Risk Overview
          </h3>
          
          <div className="space-y-4">
            {chartData.departmentData.map((dept, index) => {
              const riskPercentage = ((dept.highRisk + dept.mediumRisk) / dept.totalEmployees) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {dept.department}
                    </span>
                    <span className="text-xs text-gray-600">
                      {dept.totalEmployees} employees
                    </span>
                  </div>
                  
                  <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500"
                      style={{ width: `${(dept.lowRisk / dept.totalEmployees) * 100}%` }}
                      title={`Low Risk: ${dept.lowRisk}`}
                    ></div>
                    <div 
                      className="bg-yellow-500"
                      style={{ width: `${(dept.mediumRisk / dept.totalEmployees) * 100}%` }}
                      title={`Medium Risk: ${dept.mediumRisk}`}
                    ></div>
                    <div 
                      className="bg-red-500"
                      style={{ width: `${(dept.highRisk / dept.totalEmployees) * 100}%` }}
                      title={`High Risk: ${dept.highRisk}`}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Risk: {riskPercentage.toFixed(1)}%</span>
                    <span>Satisfaction: {dept.avgSatisfaction}/10</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-6 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                <span>Low Risk</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded mr-1"></div>
                <span>Medium Risk</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
                <span>High Risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Timeline */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="mr-2">🎯</span>
          Predicted Turnover Timeline
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { 
              period: 'Next 30 Days', 
              count: chartData.predictions.estimatedTurnover?.next30Days || 0,
              color: 'bg-red-100 text-red-800 border-red-200',
              icon: '🚨'
            },
            { 
              period: 'Next 90 Days', 
              count: chartData.predictions.estimatedTurnover?.next90Days || 0,
              color: 'bg-orange-100 text-orange-800 border-orange-200',
              icon: '⚠️'
            },
            { 
              period: 'Next 6 Months', 
              count: chartData.predictions.estimatedTurnover?.next6Months || 0,
              color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
              icon: '⏰'
            },
            { 
              period: 'Next Year', 
              count: chartData.predictions.estimatedTurnover?.nextYear || 0,
              color: 'bg-blue-100 text-blue-800 border-blue-200',
              icon: '📅'
            }
          ].map((item, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${item.color}`}>
              <div className="text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-2xl font-bold mb-1">{item.count}</div>
                <div className="text-sm font-medium">{item.period}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 text-center">
            <span className="font-medium">Note:</span> Predictions are based on current risk factors and historical patterns. 
            Regular interventions can significantly improve these projections.
          </div>
        </div>
      </div>
    </div>
  );
}
