import React from "react";
import Calendar from "@/public/icons/calendar";
const Meetings = () => {
  return (
    <div className="border border-gray-200 p-4 min-h-[300px] rounded-lg">
      <div className="flex flex-col gap-1">
        <div className="text-lg font-medium">Upcoming Meetings</div>
        <div className="text-sm text-gray-500">This Week</div>
      </div>
      <div className="h-[1px] bg-gray-200 w-full my-3" />
      <div className="flex items-start bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        {/* Icon */}
        <div className="p-2 bg-[#0BA5EC] rounded-lg">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <div className="ml-3 flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">
              Meeting with a client
            </h4>
            <div className="inline-flex items-center text-sm text-gray-500">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2" />
              10:00 – 11:00
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-1">14 August 2025</div>
          <p className="mt-2 text-gray-600">
            Check updates about design course
          </p>
        </div>
      </div>
    </div>
  );
};

export default Meetings;
