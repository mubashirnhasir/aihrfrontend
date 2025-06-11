// sections/CareerDevelopment/careerGrowthWrapper.js
"use client";

import { useEffect, useState } from "react";
import UserProfileCard from "./UserProfileCard";
import SkillGapAnalysis from "./SkillGapAnalysis";
import CareerPathGraph from "./CareerPathGraph";
import RoleRoadmap from "./RoleRoadmap";

const apiBase = process.env.NEXT_PUBLIC_API || "http://localhost:5000";

export default function CareerGrowthWrapper() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [paths, setPaths] = useState([]);
  useEffect(() => {
    // TODO: replace with session user later
    const who = encodeURIComponent("John Doe");

    fetch(`${apiBase}/api/employees/profile?name=${who}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then(setProfile)
      .catch((err) => {
        console.error("[CareerGrowthWrapper] profile fetch failed:", err);
        setError("Couldn’t load profile – please try again.");
      });
  }, []);

  /* ---------- render ---------- */
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!profile) return <p className="p-6">Loading page…</p>;
  return (
    <div className="p-6 space-y-6 bg-[#f9f9f9] min-h-screen">
      <UserProfileCard profile={profile} />
      <SkillGapAnalysis profile={profile} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CareerPathGraph profile={profile} />
        <RoleRoadmap name={profile.name} />
      </div>
    </div>
  );
}
