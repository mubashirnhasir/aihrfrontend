// sections/CareerDevelopment/CareerPathGraph.js
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API || "http://localhost:5000";

/* ───────── layout constants ───────── */
const RADIUS = 70; // bubble radius (px)
const DIAM = RADIUS * 2; // bubble diameter
const GAP_Y = 40; // vertical gap between option bubbles

/* ───────── utility components ───────── */
const Bubble = ({ label, x, y, className }) => (
  <div
    className={`absolute rounded-full shadow flex items-center justify-center select-none whitespace-pre-wrap ${className}`}
    style={{
      width: DIAM,
      height: DIAM,
      left: x,
      top: y,
      transform: "translate(-50%,-50%)",
    }}
  >
    <span className="leading-tight px-2 text-center">{label}</span>
  </div>
);

/* returns line endpoints on the edges of two circles */
const edgeLine = (p1, p2) => {
  const dx = p2.x - p1.x,
    dy = p2.y - p1.y,
    len = Math.hypot(dx, dy);
  const nx = dx / len,
    ny = dy / len; // unit vector p1→p2
  return {
    a: { x: p1.x + nx * RADIUS, y: p1.y + ny * RADIUS },
    b: { x: p2.x - nx * RADIUS, y: p2.y - ny * RADIUS },
  };
};

/* ───────── main component ───────── */
export default function CareerPathGraph({ profile }) {
  const [paths, setPaths] = useState([]);
  const [loading, setLoad] = useState(true);

  /* measure card size */
  const boxRef = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0, padX: 0, padY: 0 });

  useEffect(() => {
    if (!boxRef.current) return;
    const measure = () => {
      const rect = boxRef.current.getBoundingClientRect();
      const style = window.getComputedStyle(boxRef.current);
      setBox({
        w: rect.width,
        h: rect.height,
        padX: parseFloat(style.paddingLeft) || 0,
        padY: parseFloat(style.paddingTop) || 0,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, []);

  /* fetch three path suggestions */
  const sig = useMemo(
    () => (profile?.skills || []).map((s) => s.name).join("|"),
    [profile]
  );
  useEffect(() => {
    if (!profile) return;
    (async () => {
      setLoad(true);
      try {
        const res = await fetch(`${apiBase}/api/employees/career-path`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: profile.name }),
        });
        const json = await res.json();
        setPaths(Array.isArray(json.options) ? json.options.slice(0, 3) : []);
      } catch (err) {
        console.error("[CareerPathGraph] fetch error:", err);
        setPaths([]);
      } finally {
        setLoad(false);
      }
    })();
  }, [profile?.name, sig]);

  /* ── loading / error states ── */
  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h4 className="font-semibold mb-2">Career Path Options</h4>
        <p className="text-gray-500">Loading profile…</p>
      </div>
    );
  }
  if (loading || box.w === 0) {
    return (
      <div
        ref={boxRef}
        className="bg-white rounded-lg shadow-md p-8 min-h-[280px]"
      >
        <h4 className="font-semibold mb-2">Career Path Options</h4>
        <p className="text-gray-500">Loading career options…</p>
      </div>
    );
  }
  if (paths.length < 3) {
    return (
      <div
        ref={boxRef}
        className="bg-white rounded-lg shadow-md p-8 min-h-[280px]"
      >
        <h4 className="font-semibold mb-2">Career Path Options</h4>
        <p className="text-gray-500">OpenAI returned fewer than three paths.</p>
      </div>
    );
  }

  /* ── circle coordinates ── */
  const { w, h, padX, padY } = box;
  const current = { x: padX + RADIUS, y: h / 2 };
  const future = { x: w - padX - RADIUS, y: h / 2 };
  const V_OFFSET = DIAM * 0.8; // tweak 0.7-1.0 to taste
  const option1 = {
    // above the mid-line
    x: (current.x + future.x) / 2,
    y: current.y - V_OFFSET,
  };
  const option2 = {
    // below the mid-line
    x: option1.x,
    y: current.y + V_OFFSET,
  };

  /* ensure card tall enough */
  const needH = option2.y + RADIUS + padY;
  if (needH > h) boxRef.current.style.minHeight = `${needH}px`;

  const connectors = [edgeLine(current, option1), edgeLine(current, option2)];

  /* ── render graph ── */
  return (
    <div
      ref={boxRef}
      className="relative bg-white rounded-lg shadow-md px-8 py-8"
    >
      <h4 className="font-semibold mb-4">Career Path Options</h4>{" "}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={w}
        height={Math.max(box.h, needH)}
      >
        {connectors.map((ln, i) => (
          <line
            key={i}
            x1={ln.a.x}
            y1={ln.a.y}
            x2={ln.b.x}
            y2={ln.b.y}
            stroke="rgb(148 163 184)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        ))}
      </svg>
      {/* bubbles */}
      <Bubble
        label={`Current Role\n${profile.designation}`}
        x={current.x}
        y={current.y}
        className="bg-blue-200 text-blue-800"
      />
      <Bubble
        label={`Option 1\n${paths[0]}`}
        x={option1.x}
        y={option1.y}
        className="bg-yellow-100 text-yellow-800"
      />
      <Bubble
        label={`Option 2\n${paths[1]}`}
        x={option2.x}
        y={option2.y}
        className="bg-yellow-100 text-yellow-800"
      />
      <Bubble
        label={`Future Role\n${paths[2]}`}
        x={future.x}
        y={future.y}
        className="bg-blue-200 text-blue-800"
      />
    </div>
  );
}
