// app/study-plan/[skill]/page.js
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const StudyPlanPage = () => {
  const { skill } = useParams();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // TODO: wire this up to your real auth/session
  const userName = "John Doe";
  const apiBase = "http://localhost:5000"; // ← your Express backend

  useEffect(() => {
    const loadStudyPlan = async () => {
      try {
        const decodedSkill = decodeURIComponent(skill);

        // 1) Fetch full profile (with any saved studyPlans)
        const profileRes = await fetch(
          `${apiBase}/api/employees/profile?name=${encodeURIComponent(
            userName
          )}`
        );
        if (!profileRes.ok) throw new Error("Failed to fetch profile");
        const profile = await profileRes.json();

        // 2) Look up an existing plan for this skill
        const existingPlan = (profile.studyPlans || []).find(
          (p) => decodeURIComponent(p.skillName) === decodedSkill
        );
        if (existingPlan) {
          // a) Use DB’s saved modules (with completed flags)
          setModules(existingPlan.modules);
        } else {
          // b) Otherwise: call GPT once, render & save
          const prompt = `
You're an AI tutor. Give a beginner-friendly study plan with ~5 learning modules for the topic: "${decodedSkill}".
Each module should have a title and 1–2 suggested learning resources (with URLs if possible).
Return JSON like:
[
  {
    "title": "Module Name",
    "resources": [
      { "label": "FreeCodeCamp", "url": "https://..." }
    ]
  }
]
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
          const parsed = JSON.parse(gptJson.choices[0].message.content.trim());

          // enrich with completed = false and render
          const enriched = parsed.map((m) => ({ ...m, completed: false }));
          setModules(enriched);

          // persist to your DB
          await fetch(`${apiBase}/api/employees/study-plan/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: userName,
              skillName: decodedSkill,
              modules: parsed,
            }),
          });
        }
      } catch (err) {
        console.error("❌ loadStudyPlan error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStudyPlan();
  }, [skill]);

  const toggleComplete = async (idx) => {
    // 1) Flip locally
    const updated = modules.map((m, i) =>
      i === idx ? { ...m, completed: !m.completed } : m
    );
    setModules(updated);

    const decodedSkill = decodeURIComponent(skill);
    const mod = updated[idx];

    try {
      // 2) Persist the single-module completion
      await fetch(`${apiBase}/api/employees/study-plan/complete-module`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          skillName: decodedSkill,
          moduleTitle: mod.title,
        }),
      });

      // 3) If that was the last module, redirect immediately
      const allLocalDone = updated.every((m) => m.completed);
      if (allLocalDone) {
        alert(`You've completed all modules for “${decodedSkill}”!`);
        return void (window.location.href = "/dashboard/career-development");
      }

      // 4) Otherwise, re-fetch the plan so you stay in sync
      const profileRes = await fetch(
        `${apiBase}/api/employees/profile?name=${encodeURIComponent(userName)}`
      );
      const profile = await profileRes.json();
      const refreshed = (profile.studyPlans || []).find(
        (p) => decodeURIComponent(p.skillName) === decodedSkill
      );
      if (refreshed) {
        setModules(refreshed.modules);
      }
    } catch (err) {
      console.error("❌ toggleComplete error:", err);
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">
        Study Plan: {decodeURIComponent(skill)}
      </h2>

      {loading ? (
        <p className="text-gray-400">Loading modules…</p>
      ) : (
        <div className=" flex gap-6 flex-wrap ">
          {modules.map((mod, i) => (
            <div key={i} className="bg-white p-4 border w-[40%] border-gray-200  rounded ">
              <h3
                className={`font-semibold text-lg ${
                  mod.completed ? "line-through text-green-600" : ""
                }`}
              >
                {mod.title}
              </h3>
              <ul className="list-disc ml-5  mt-2">
                {mod.resources?.map((r, idx) => (
                  <li key={idx}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => toggleComplete(i)}
                className={`mt-3 px-4 py-2 text-sm rounded cursor-pointer ${
                  mod.completed
                    ? "bg-green-500 text-white"
                    : "border bg-blue-500 text-white"
                }`}
              >
                {mod.completed ? "Completed" : "Mark as Complete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyPlanPage;
