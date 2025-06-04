"use client";
import ImageUpload from "@/public/icons/imageUpload";
import ThumbsUp from "@/public/icons/thumbsUp";
import VideoUpload from "@/public/icons/videoUpload";
import React, { useState } from "react";

const Posts = () => {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [announcements, setAnnouncement] = useState("");

  const [comments, setComments] = useState([
    {
      comment: "For always doing your best and having our back!",
      username: "James Gray",
      designation: "Backend Developer",
      heading: "Outstanding Productivity",
      count: 0,
      liked: false,
      image: null,
    },
  ]);

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

  const handlePost = () => {
    if (announcements.trim() === "") return;
    setComments((prev) => [
      ...prev,
      {
        comment: announcements,
        username: "James Gray",
        designation: "Backend Developer",
        heading: "New Announcement",
        count: 0,
        liked: false,
        image: photoPreview,
      },
    ]);
    setAnnouncement("");
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleDelete = (index) => {
    setComments((prev) => prev.filter((_, i) => i !== index));
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
            className="button cursor-pointer w-[120px] flex items-center justify-center px-4 py-1 rounded-lg btnPrimary text-white"
          >
            <button>Post</button>
          </div>
        </div>

        <div className="w-full bg-gray-100 h-[1px] my-2"></div>
        <div className="font-medium text-gray-600">Recent Announcements</div>

        <div className="flex flex-col gap-4 overflow-y-scroll custom-scrollbar h-[280px]">
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
                    onClick={() => handleDelete(index)}
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
