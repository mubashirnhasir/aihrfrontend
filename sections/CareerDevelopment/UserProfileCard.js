// sections/CareerDevelopment/UserProfileCard.js
"use client";
import React from "react";

export default function UserProfileCard({ profile }) {
  if (!profile) return null;

  const profileImg = profile.profilePicture?.trim()
    ? profile.profilePicture
    : `https://i.pravatar.cc/100?u=${encodeURIComponent(profile.name)}`;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src={profileImg}
          alt="profile"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold">{profile.name}</h2>
          <p className="text-gray-500">
            {profile.designation} • {profile.experience || 0} years of
            experience
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 border rounded-md">Career Advisor</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
          View Profile
        </button>
      </div>
    </div>
  );
}
