"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomSheet from "../components/BottomSheet";

const typeColors: Record<string, { color: string; bg: string }> = {
  easy:  { color: "#4a9eff", bg: "rgba(74,158,255,0.12)" },
  tempo: { color: "#f0a830", bg: "rgba(240,168,48,0.12)" },
  hard:  { color: "#e05252", bg: "rgba(224,82,82,0.12)" },
  long:  { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  group: { color: "#1fcc8a", bg: "rgba(31,204,138,0.12)" },
  rest:  { color: "#444",    bg: "var(--bg3)" },
};

export default function TrainingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"plan" | "progress">("plan");

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ padding: "52px 16px 12px" }}>
        <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Training
        </p>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", marginTop: "4px" }}>
          My Plan
        </h1>
      </div>

      {/* Tab switcher */}
      <div style={{ padding: "0 16px 16px", display: "flex", gap: "10px" }}>
        {[{ key: "plan", label: "Plan" }, { key: "progress", label: "Progress" }].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as "plan" | "progress")}
            style={{ flex: 1, padding: "10px 14px", borderRadius: "14px", border: "0.5px solid", borderColor: activeTab === tab.key ? "var(--green)" : "var(--border)", background: activeTab === tab.key ? "var(--green-dim)" : "var(--bg2)", color: activeTab === tab.key ? "var(--green)" : "var(--text)", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Empty state — no plan yet */}
      <div style={{ padding: "20px 16px 100px", display: "flex", flexDirection: "column", gap: "12px" }}>

        {/* Main empty card */}
        <div style={{ background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "32px 20px", textAlign: "center" }}>
          <p style={{ fontSize: "36px", marginBottom: "12px" }}>📋</p>
          <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", marginBottom: "8px", letterSpacing: "-0.02em" }}>
            No training plan yet
          </p>
          <p style={{ fontSize: "13px", color: "var(--text3)", lineHeight: 1.7, marginBottom: "20px" }}>
            Add your goal race and your AI coach will build a personalised training plan — structured by phase, tailored to your fitness and schedule.
          </p>
          <button onClick={() => router.push("/races")}
            style={{ background: "var(--green)", color: "var(--green-text)", fontWeight: 600, padding: "12px 24px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "14px", fontFamily: "'Syne', sans-serif" }}>
            Add a Race →
          </button>
        </div>

        {/* What to expect */}
        <div style={{ background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "16px" }}>
          <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
            What your plan will include
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: "📅", title: "Week by week structure", desc: "Every session planned across your full training block" },
              { icon: "🎯", title: "Phase-based progression", desc: "Base building → threshold → peak → taper" },
              { icon: "💡", title: "Workout explanations", desc: "Why each session exists and how to execute it" },
              { icon: "🔄", title: "Adapts to your life", desc: "Reschedule sessions and the plan adjusts automatically" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <span style={{ fontSize: "20px", flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "2px" }}>{item.title}</p>
                  <p style={{ fontSize: "12px", color: "var(--text3)", lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Log runs in the meantime */}
        <div style={{ background: "rgba(31,204,138,0.06)", border: "0.5px solid rgba(31,204,138,0.2)", borderRadius: "var(--radius)", padding: "14px 16px" }}>
          <p style={{ fontSize: "13px", color: "var(--green)", fontWeight: 600, marginBottom: "4px" }}>
            Start logging runs now
          </p>
          <p style={{ fontSize: "12px", color: "var(--text3)", lineHeight: 1.6 }}>
            Tap the + button to log any run. Your history will feed into your training plan when it's ready.
          </p>
        </div>

      </div>
    </div>
  );
}