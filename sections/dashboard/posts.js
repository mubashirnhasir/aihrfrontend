"use client";
import ImageUpload from "@/public/icons/imageUpload";
import ThumbsUp from "@/public/icons/thumbsUp";
import VideoUpload from "@/public/icons/videoUpload";
import React, { useState, useEffect } from "react";

const Posts = () => {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [announcements, setAnnouncement] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [announcesList, setAnnouncesList] = useState([]);
  const [fetchingAnnouncements, setFetchingAnnouncements] = useState(true);

  // Fetch existing announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await fetch("/api/announcements", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnnouncesList(data.data?.announcements || []);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setFetchingAnnouncements(false);
    }
  };

  const [comments, setComments] = useState([]);

  const handleClick = (index) => {
    setComments((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              count: item.liked ? item.count - 1 : item.count + 1,
              liked: !item.liked,
            }
          : item
      )
    );
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };
  const handlePost = async () => {
    if (announcements.trim() === "") return;

    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        alert("Please login to post announcements");
        return;
      }

      const announcementData = {
        title: "New Announcement",
        content: announcements,
        priority: priority,
        targetAudience: "all",
        image: photoPreview || null,
      };

      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(announcementData),
      });

      if (response.ok) {
        const data = await response.json();
        // Add to local state for immediate display
        setAnnouncesList((prev) => [data.data, ...prev]);

        // Clear form
        setAnnouncement("");
        setPhoto(null);
        setPhotoPreview(null);
        setPriority("medium");

        alert(
          "Announcement posted successfully! All employees will see this announcement."
        );
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to post announcement:",
          errorData.message || "Unknown error"
        ); // Changed alert to console.error
        // alert(errorData.message || "Failed to post announcement"); // Original alert commented out
      }
    } catch (error) {
      console.error("Error posting announcement:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (announcementId, index) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Remove from announcements list
        setAnnouncesList((prev) => prev.filter((_, i) => i !== index));
        alert("Announcement deleted successfully!");
      } else {
        alert("Failed to delete announcement");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Network error. Please try again.");
    }
  };
  return (
    <div className="wraped">
      <div className="comment border border-main rounded-lg p-3 flex flex-col gap-2">
        <div className="flex items-center justify-start gap-4">
          <div className="h-10 w-10 rounded-full">
            <img
              src="/images/avatar.jpg"
              alt=""
              className="h-full w-full object-cover rounded-full"
            />
          </div>
          <div className="input w-full">
            <input
              type="text"
              value={announcements}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Create Announcements"
              className="border rounded-lg border-main w-full p-2"
            />
          </div>
        </div>

        {/* Priority Selector */}
        <div className="flex items-center gap-4 px-2">
          <label className="text-sm font-medium text-gray-700">Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border rounded border-gray-300 px-2 py-1 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {photoPreview && (
          <div className="relative w-full mt-2">
            <img
              src={photoPreview}
              alt="Preview"
              className="max-h-[200px] rounded-md object-cover border"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-4">
            <div className="flex relative items-center justify-center gap-2">
              <input
                onChange={handleFile}
                type="file"
                accept="image/*"
                className="z-10 absolute h-10 w-20 bg-blue-100 cursor-pointer opacity-0"
              />
              <ImageUpload /> Photos
            </div>
            <div className="flex items-center justify-center cursor-pointer gap-2">
              <input
                type="file"
                disabled
                className="z-10 absolute h-10 w-20 bg-blue-100 cursor-not-allowed opacity-0"
              />
              <VideoUpload /> Video
            </div>
          </div>
          <div
            onClick={handlePost}
            className={`button cursor-pointer w-[120px] flex items-center justify-center px-4 py-1 rounded-lg btnPrimary text-white ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <button disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>

        <div className="w-full bg-gray-100 h-[1px] my-2"></div>
        <div className="font-medium text-gray-600">
          Recent Announcements {fetchingAnnouncements && "(Loading...)"}
        </div>

        <div className="flex flex-col gap-4 overflow-y-scroll custom-scrollbar h-[280px]">
          {fetchingAnnouncements ? (
            <div className="text-center py-4 text-gray-500">
              Loading announcements...
            </div>
          ) : announcesList.length > 0 ? (
            announcesList.map((announcement, index) => (
              <div
                key={announcement._id || index}
                className="profile border border-gray-200 rounded-lg"
              >
                <div className="user flex gap-4 items-center p-4">
                  <div className="w-10 h-10 rounded-full">
                    <img
                      src="/images/avatar.jpg"
                      className="w-full h-full rounded-full object-cover"
                      alt="Avatar"
                    />
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <div>
                      <div className="font-medium text-lg">
                        {announcement.title}
                      </div>
                      <div className="flex gap-2 supporting-text">
                        <div>{announcement.authorName}</div>
                        <div>{announcement.authorDesignation}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Priority:{" "}
                        <span
                          className={`font-medium ${
                            announcement.priority === "high"
                              ? "text-red-600"
                              : announcement.priority === "medium"
                              ? "text-yellow-600"
                              : "text-blue-600"
                          }`}
                        >
                          {announcement.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(announcement._id, index)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="CommentMain border border-main px-2 flex flex-col mx-2 my-2 py-2 bg-gray-100 rounded-lg">
                  <div className="comment text-lg font-medium text-main">
                    {announcement.content}
                  </div>

                  {announcement.image && (
                    <div className="w-full mt-2">
                      <img
                        src={announcement.image}
                        alt="attachment"
                        className="max-h-[200px] rounded-md object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2 supporting-text">
                    <div>By - {announcement.authorName}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No announcements yet. Create your first announcement!
            </div>
          )}{" "}
          {/* Legacy comments section - keeping for now */}
          {comments.map((data, index) => (
            <div
              key={index}
              className="profile border border-gray-200 rounded-lg"
            >
              <div className="user flex gap-4 items-center p-4">
                <div className="w-10 h-10 rounded-full">
                  <img
                    src="/images/avatar.jpg"
                    className="w-full h-full rounded-full object-cover"
                    alt="Avatar"
                  />
                </div>
                <div className="flex justify-between w-full items-center">
                  <div>
                    <div className="font-medium text-lg">{data.heading}</div>
                    <div className="flex gap-2 supporting-text">
                      <div>{data.username}</div>
                      <div>{data.designation}</div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setComments((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="CommentMain border border-main px-2 flex flex-col mx-2 my-2 py-2 bg-gray-100 rounded-lg">
                <div className="comment text-lg font-medium text-main">
                  {data.comment}
                </div>

                {data.image && (
                  <div className="w-full mt-2">
                    <img
                      src={data.image}
                      alt="attachment"
                      className="max-h-[200px] rounded-md object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between mt-2 supporting-text">
                  <div>By - {data.username}</div>
                  <div
                    onClick={() => handleClick(index)}
                    className="flex cursor-pointer items-center justify-center gap-1"
                  >
                    {data.count}{" "}
                    {data.liked ? (
                      <div className="transition-all hover:scale-120">
                        <ThumbsUp color={"blue"} fill={"blue"} />
                      </div>
                    ) : (
                      <ThumbsUp />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;
