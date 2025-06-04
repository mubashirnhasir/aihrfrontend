"use client"
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Casual Leave',
    value: 24,
    fill: '#5D87FF',
  },
  {
    name: 'Sick Leaves',
    value: 16,
    fill: '#49BEFF',
  },
  {
    name: 'Unpaid Leaves',
    value: 8,
    fill: '#EEF0F2',
  },
];

const LeaveTypeChart = () => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 w-full">
      <h3 className="text-lg font-semibold mb-4">Leaves Type - Count of Leaves</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="30%"
          outerRadius="90%"
          barSize={12}
          data={data}
        >
          <RadialBar
            minAngle={20}
            background
            clockWise
            dataKey="value"
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="bottom"
            align="right"
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeaveTypeChart;
