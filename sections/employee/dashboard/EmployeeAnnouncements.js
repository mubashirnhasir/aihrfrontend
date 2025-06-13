import React, { useState, useEffect } from "react";

const EmployeeAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("employeeToken");
      if (!token) {
        setError("Please login to view announcements");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/announcements/employee", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.data || []);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch announcements");
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (announcementId) => {
    try {
      const token = localStorage.getItem("employeeToken");
      if (!token) return;

      const response = await fetch(
        `/api/announcements/${announcementId}/read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Update local state to mark as read
        setAnnouncements((prev) =>
          prev.map((announcement) =>
            announcement._id === announcementId
              ? { ...announcement, isNew: false }
              : announcement
          )
        );
      }
    } catch (error) {
      console.error("Error marking announcement as read:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-blue-500";
      default:
        return "border-l-gray-500";
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Announcements</h3>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading announcements...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchAnnouncements}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No announcements available</p>
          <p className="text-sm text-gray-400 mt-1">
            Check back later for updates
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <div
              key={announcement._id || index}
              className={`border-l-4 pl-4 py-3 ${getPriorityColor(
                announcement.priority
              )} relative cursor-pointer hover:bg-gray-50 rounded-r-md`}
              onClick={() => announcement.isNew && markAsRead(announcement._id)}
            >
              {announcement.isNew && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}

              <div className="flex items-start justify-between">
                <h4 className="text-sm font-medium text-gray-900">
                  {announcement.title}
                  {announcement.isNew && (
                    <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                      NEW
                    </span>
                  )}
                </h4>
                <span className="text-xs text-gray-500 ml-2">
                  {announcement.date}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-1">
                {announcement.content}
              </p>

              {announcement.image && (
                <div className="mt-2">
                  <img
                    src={announcement.image}
                    alt="Announcement attachment"
                    className="max-h-32 rounded object-cover"
                  />
                </div>
              )}

              <div className="text-xs text-gray-400 mt-2">
                By {announcement.authorName} • {announcement.authorDesignation}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-4 border-t border-gray-200 mt-4">
        <button
          className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
          onClick={fetchAnnouncements}
        >
          Refresh Announcements
        </button>
      </div>
    </div>
  );
};

export default EmployeeAnnouncements;
