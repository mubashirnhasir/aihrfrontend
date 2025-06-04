import React from "react";
import Calendar from "@/public/icons/calendar";

const EmployeeUpcomingEvents = () => {
  const upcomingEvents = [
    {
      title: "Team Meeting",
      date: "Today",
      time: "2:00 PM",
      type: "meeting"
    },
    {
      title: "Project Deadline",
      date: "Tomorrow",
      time: "EOD",
      type: "deadline"
    },
    {
      title: "Company All-Hands",
      date: "Friday",
      time: "10:00 AM",
      type: "meeting"
    },
    {
      title: "Performance Review",
      date: "Next Week",
      time: "TBD",
      type: "review"
    }
  ];

  const getEventIcon = (type) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-600';
      case 'deadline':
        return 'bg-red-100 text-red-600';
      case 'review':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
      
      <div className="space-y-3">
        {upcomingEvents.map((event, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getEventIcon(event.type)}`}>
              <Calendar />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {event.title}
              </p>
              <p className="text-xs text-gray-600">
                {event.date} • {event.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200 mt-4">
        <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Events
        </button>
      </div>
    </div>
  );
};

export default EmployeeUpcomingEvents;
