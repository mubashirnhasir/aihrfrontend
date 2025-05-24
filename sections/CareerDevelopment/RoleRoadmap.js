// sections/CareerDevelopment/RoleRoadmap.js
"use client";

import React, { useEffect, useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API || "http://localhost:5000";

export default function RoleRoadmap({ name }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!name) return;

    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${apiBase}/api/employees/roadmap`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
          signal: ctrl.signal,
        });

        if (!res.ok) {
          const msg = (await res.json())?.message || "Server error";
          throw new Error(msg);
        }

        const json = await res.json(); // { role, tiers:[{title,bullets}] }
        setRoadmap(json);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [name]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h4 className="font-semibold mb-2">Recommended Roadmap</h4>
      <p className="text-sm text-gray-500 mb-4">
        Based on your skills, performance reviews, and organization needs
      </p>

      {/* states */}
      {loading && <p>Loading roadmap…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && !roadmap && (
        <p className="text-gray-500">No roadmap found.</p>
      )}

      {/* roadmap */}
      {roadmap && (
        <div className="bg-blue-600 text-white p-4 rounded-lg flex flex-col items-center space-y-4">
          {roadmap.tiers.map((tier, idx) => (
            <React.Fragment key={idx}>
              <div className="text-center">
                <div className="font-medium">{tier.title}</div>
                <ul className="list-disc text-left text-xs mt-1 ml-4 space-y-1">
                  {tier.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
              {/* arrow between tiers */}
              {idx !== roadmap.tiers.length - 1 && (
                <div className="text-lg">⬇</div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
