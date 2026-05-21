"use client";
import { useState } from "react";

const actions = [
  { label: "Log Workout", icon: "🏃", color: "#4a9eff" },
  { label: "Add Race", icon: "🏁", color: "#f0a830" },
  { label: "Add Group Run", icon: "👥", color: "#1fcc8a" },
  { label: "Add Note", icon: "📝", color: "#a78bfa" },
];

export default function FloatingAction() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 48,
          }}
        />
      )}

      {/* Action items */}
      {open && (
        <div style={{
          position: "fixed",
          bottom: "90px",
          right: "calc(50% - 220px)",
          zIndex: 49,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          alignItems: "flex-end",
        }}>
          {actions.map((action, i) => (
            <div
              key={i}
              onClick={() => setOpen(false)}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                cursor: "pointer",
                animation: `fadeSlideIn 0.15s ease ${i * 0.04}s both`,
              }}
            >
              <span style={{
                background: "var(--bg2)", border: "0.5px solid var(--border)",
                borderRadius: "20px", padding: "6px 14px",
                fontSize: "13px", color: "var(--text)",
                fontFamily: "'Syne', sans-serif", whiteSpace: "nowrap",
              }}>
                {action.label}
              </span>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: action.color + "22",
                border: `0.5px solid ${action.color}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px",
              }}>
                {action.icon}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "90px",
          left: "50%",
          transform: `translateX(180px) rotate(${open ? "45deg" : "0deg"})`,
          width: "48px", height: "48px", borderRadius: "50%",
          background: "var(--green)", border: "none",
          cursor: "pointer", zIndex: 50,
          fontSize: "24px", color: "var(--green-text)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(31,204,138,0.3)",
          transition: "transform 0.2s ease",
          fontWeight: 300,
        }}
      >
        +
      </button>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}