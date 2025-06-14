import React from "react";

const OnLeave = ({ cardText, subText }) => {
  const data = [
    {
      name: "Ayesha Siddiqui",
      leave: "22 March - 28 March",
      leaveType: "Earned Leave",
    },
    {
      name: "Ravi Kumar",
      leave: "24 March - 26 March",
      leaveType: "Sick Leave",
    },
    {
      name: "Meera Singh",
      leave: "20 March - 27 March",
      leaveType: "Casual Leave",
    },
    {
      name: "John Carter",
      leave: "23 March - 25 March",
      leaveType: "Work From Home",
    },
    {
      name: "Priya Sharma",
      leave: "22 March - 24 March",
      leaveType: "Maternity Leave",
    },
    {
      name: "Ali Khan",
      leave: "21 March - 23 March",
      leaveType: "Paternity Leave",
    },
    {
      name: "Zara Patel",
      leave: "25 March - 28 March",
      leaveType: "Vacation",
    },
    {
      name: "Arjun Das",
      leave: "23 March - 26 March",
      leaveType: "Emergency Leave",
    },
    {
      name: "Sophia D’Souza",
      leave: "22 March - 25 March",
      leaveType: "Casual Leave",
    },
    {
      name: "Mohit Verma",
      leave: "24 March - 27 March",
      leaveType: "Sick Leave",
    },
  ];

  return (
    <div className="border rounded-lg border-main p-2 h-[450px] overflow-hidden gap-1 flex flex-col">
      <div className="headings flex flex-col gap-1 p-2">
        <div className="text-xl font-semibold">
          {cardText || "On Leave Today"}
        </div>
        <div className="subhead">{subText || `${data.length} People On Leave`}</div>
        <div className="bg-gray-200 w-full h-[1px] rounded-full shadow-xl"></div>
      </div>
      <div className="h-full overflow-y-scroll custom-scrollbar py-2">
        <div className="flex flex-col gap-4">
          {data.map((employee, index) => (
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
                    {employee.name}
                  </div>
                  <div className="text-red-500 font-medium">
                    {employee.leave}
                  </div>
                </div>
              </div>
              <div className="right flex flex-col gap-2 items-end">
               <div className="badge border-main px-2 py-1 rounded-lg placeholder-text text-sm bg-white whitespace-nowrap">
                  {employee.leaveType}
                </div>
                <div className="link font-medium supporting-text cursor-pointer">
                  View Profile
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnLeave;
