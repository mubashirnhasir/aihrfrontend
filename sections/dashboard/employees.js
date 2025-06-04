import ArrowUpRight from '@/public/icons/arrowUpRight';
import Search from '@/public/icons/search';
import React from 'react';

const Employees = () => {
  const data = [
    {
      name: "Ayesha Siddiqui",
      designation: "Frontend Developer",
      department: "Development",
    },
    {
      name: "Ravi Kumar",
      designation: "Backend Engineer",
      department: "Development",
    },
    {
      name: "Meera Singh",
      designation: "UI/UX Designer",
      department: "Design",
    },
    {
      name: "John Carter",
      designation: "DevOps Engineer",
      department: "Infrastructure",
    },
    {
      name: "Priya Sharma",
      designation: "HR Manager",
      department: "Human Resources",
    },
    {
      name: "Ali Khan",
      designation: "QA Engineer",
      department: "Quality Assurance",
    },
    {
      name: "Zara Patel",
      designation: "Project Manager",
      department: "Project Management",
    },
    {
      name: "Arjun Das",
      designation: "Content Writer",
      department: "Marketing",
    },
    {
      name: "Sophia D’Souza",
      designation: "SEO Specialist",
      department: "Marketing",
    },
    {
      name: "Mohit Verma",
      designation: "Cloud Architect",
      department: "Infrastructure",
    },
  ];

  return (
    <div>
      <div className="border rounded-lg border-main p-2 h-[400px] overflow-hidden gap-1 flex flex-col">
        <div className="headings flex flex-col gap-1 p-2">
          <div className="w-full flex justify-between items-center">
            <div>
              <div className="text-xl font-semibold">Employees</div>
              <div className="subhead">{data.length} Employees</div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center justify-center">
                View all <ArrowUpRight />
              </div>
              <div className="p-2 rounded-lg bg-gray-100 w-fit">
                <Search />
              </div>
            </div>
          </div>
          <div className="bg-gray-200 w-full h-[1px] rounded-full shadow-xl"></div>
        </div>
        <div className="h-full overflow-y-scroll custom-scrollbar py-2">
          <div className="flex flex-col gap-4">
            {data.map((emp, index) => (
              <div
                key={index}
                className="w-full flex justify-between px-2 border border-main rounded-lg py-2"
              >
                <div className="left flex items-center justify-center gap-2">
                  <div className="profile h-10 w-10 overflow-hidden bg-gray-200 rounded-full">
                    <img
                      src="/images/avatar.jpg"
                      className="h-full rounded-full w-full object-cover"
                      alt="Avatar"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="font-semibold text-xl text-main tracking-wide">
                      {emp.name}
                    </div>
                    <div className="supporting-text font-medium">
                      {emp.designation}
                    </div>
                  </div>
                </div>
                <div className="right flex flex-col gap-2 items-end">
                  <div className="badge border-main px-2 py-1 gap-2 flex items-center justify-center rounded-lg placeholder-text font-medium text-sm bg-white whitespace-nowrap">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    <div>{emp.department}</div>
                  </div>
                  <div className="link supporting-text cursor-pointer">
                    View Profile
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;
