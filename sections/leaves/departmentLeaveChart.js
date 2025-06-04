"use client"
import Link from "next/link";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

const data = [
  { name: 'HR', value: 8 },
  { name: 'Engineering', value: 12 },
  { name: 'Sales', value: 4 },
];

const COLORS = ['#5D87FF', '#49BEFF', '#EEF0F2'];

const DepartmentLeaveChart = () => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 w-full">
      <div className="flex justify-between"><h3 className="text-lg font-semibold mb-2">Department Leaves</h3>
        <Link href={'/dashboard/leaves/allleaves'}  className="font-medium text-gray-500">View All</Link>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentLeaveChart;
