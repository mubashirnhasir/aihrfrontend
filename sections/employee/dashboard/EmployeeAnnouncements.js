import React from "react";

const EmployeeAnnouncements = () => {
  const announcements = [
    {
      title: "New Health Insurance Benefits",
      content: "We've upgraded our health insurance plan. Check your email for details.",
      date: "Today",
      priority: "high",
      isNew: true
    },
    {
      title: "Office Renovation Update",
      content: "The 3rd floor renovation will be completed by next week.",
      date: "Yesterday",
      priority: "medium",
      isNew: false
    },
    {
      title: "Holiday Schedule 2024",
      content: "Updated holiday calendar has been published in the employee portal.",
      date: "3 days ago",
      priority: "low",
      isNew: false
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Announcements</h3>
      
      <div className="space-y-4">
        {announcements.map((announcement, index) => (
          <div 
            key={index} 
            className={`border-l-4 pl-4 py-3 ${getPriorityColor(announcement.priority)} relative`}
          >
            {announcement.isNew && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
            
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-medium text-gray-900">
                {announcement.title}
              </h4>
              <span className="text-xs text-gray-500 ml-2">
                {announcement.date}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mt-1">
              {announcement.content}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200 mt-4">
        <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Announcements
        </button>
      </div>
    </div>
  );
};

export default EmployeeAnnouncements;
