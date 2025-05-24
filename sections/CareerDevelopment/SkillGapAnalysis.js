// SkillGapAnalysis.js
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SkillBar = ({ label, value }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <div
        className="bg-purple-500 h-2 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const MiniProgress = ({ completed, total }) => {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="flex items-center text-sm mb-1">
      <span className="mr-2">
        {completed}/{total}
      </span>
      <div className="flex-1 h-1 bg-gray-200 rounded overflow-hidden">
        <div className="h-full bg-purple-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const SkillGapAnalysis = () => {
  const [currentSkills, setCurrentSkills] = useState([]);
  const [recommendedSkills, setRecommendedSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllCurrent, setShowAllCurrent] = useState(false);
  const router = useRouter();

  const levelToValue = {
    Beginner: 30,
    Intermediate: 60,
    Advanced: 90,
  };
  const apiBase = "http://localhost:5000"; // your backend

  useEffect(() => {
    const fetchSkillsFromDB = async () => {
      try {
        const name = "John Doe"; // replace with session user

        // 1) Fetch full profile
        const profileRes = await fetch(
          `${apiBase}/api/employees/profile?name=${encodeURIComponent(name)}`
        );
        if (!profileRes.ok) throw new Error("Failed to fetch profile");
        const profile = await profileRes.json();

        // 2) Current skills → bars
        setCurrentSkills(
          (profile.skills || []).map((s) => ({
            name: s.name,
            value: levelToValue[s.level] ?? 20,
          }))
        );

        // 3) Recommended skills + progress logic…
        const existing = Array.isArray(profile.recommendedSkills)
          ? profile.recommendedSkills
          : [];

        const findPlan = (skillName) =>
          (profile.studyPlans || []).find(
            (p) => decodeURIComponent(p.skillName) === skillName
          );

        const recsWithProgress = existing.slice(0, 5).map((rec) => {
          const plan = findPlan(rec.name);
          const total = plan?.modules.length || 0;
          const completed =
            plan?.modules.filter((m) => m.completed).length || 0;
          return { name: rec.name, completed, total };
        });

        if (recsWithProgress.length < 5) {
          const missing = 5 - recsWithProgress.length;
          const prompt = `
You are a career advisor AI. An employee is a ${profile.designation} with ${
            profile.experience
          } years of experience.
Their skills:
${(profile.skills || []).map((s) => `- ${s.name} (${s.level})`).join("\n")}
They already have recommended:
${existing.map((r) => `- ${r.name}`).join("\n")}
Suggest exactly ${missing} new skills to fill up to 5 total, return as JSON array of names.
          `.trim();

          const gptRes = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
              },
              body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
              }),
            }
          );
          const gptJson = await gptRes.json();
          const newNames = JSON.parse(
            gptJson.choices[0].message.content.trim()
          );

          const newRecs = newNames.map((n) => ({
            name: n,
            completed: 0,
            total: findPlan(n)?.modules.length || 0,
          }));

          const final = [...recsWithProgress, ...newRecs].slice(0, 5);

          await fetch(`${apiBase}/api/employees/updateRecommended`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: profile.name,
              recommendedSkills: final.map((r) => ({ name: r.name })),
            }),
          });

          setRecommendedSkills(final);
        } else {
          setRecommendedSkills(recsWithProgress);
        }
      } catch (err) {
        console.error("Error fetching/generating skills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkillsFromDB();
  }, []);

  const handleSkillClick = (skillName) =>
    router.push(`/study-plan/${encodeURIComponent(skillName)}`);

  // Decide which current skills to show
  const displayedCurrent = showAllCurrent
    ? currentSkills
    : currentSkills.slice(0, 5);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Skill Gap Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ←— Current Skills Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h4 className="font-semibold mb-2">Current Skills</h4>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <>
              {/* fixed-height, scrollable container */}
              <div className="max-h-64 overflow-y-auto">
                {displayedCurrent.map((s, i) => (
                  <SkillBar key={i} label={s.name} value={s.value} />
                ))}
              </div>

              {/* toggle button only if more than 5 skills */}
              {currentSkills.length > 5 && (
                <button
                  onClick={() => setShowAllCurrent(!showAllCurrent)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  {showAllCurrent
                    ? "Show Top 5"
                    : `Show All (${currentSkills.length})`}
                </button>
              )}
            </>
          )}
        </div>

        {/* Recommended Skills Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h4 className="font-semibold mb-2">Recommended Skills</h4>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : recommendedSkills.length ? (
            recommendedSkills.map((r, i) => (
              <div
                key={i}
                className="cursor-pointer hover:underline mb-4"
                onClick={() => handleSkillClick(r.name)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-purple-600">{r.name}</span>
                  <span className="text-sm text-gray-600">
                    {r.completed}/{r.total}
                  </span>
                </div>
                <MiniProgress completed={r.completed} total={r.total} />
              </div>
            ))
          ) : (
            <p>No suggestions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default SkillGapAnalysis;
