"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  {
    id: "welcome",
    title: "Welcome to\nEnduranceCoach",
    subtitle: "Your AI-powered training partner. Let's set up your profile so we can build the perfect plan for you.",
    type: "welcome",
  },
  {
    id: "basics",
    title: "About You",
    subtitle: "This helps us personalise your training zones and load.",
    type: "form",
    fields: [
      { key: "name", label: "Full Name", placeholder: "Connor Hubert", type: "text" },
      { key: "age", label: "Age", placeholder: "28", type: "number" },
      { key: "gender", label: "Gender", placeholder: "", type: "select", options: ["Male", "Female", "Prefer not to say"] },
      { key: "weight", label: "Weight (kg)", placeholder: "72", type: "number" },
    ],
  },
  {
    id: "heartrate",
    title: "Heart Rate",
    subtitle: "Used to set your training zones accurately. Best effort is fine if you're unsure.",
    type: "form",
    fields: [
      { key: "maxHR", label: "Max Heart Rate (bpm)", placeholder: "187", type: "number" },
      { key: "restingHR", label: "Resting Heart Rate (bpm)", placeholder: "52", type: "number" },
    ],
  },
  {
    id: "experience",
    title: "Running Background",
    subtitle: "Tell us about your running history.",
    type: "form",
    fields: [
      { key: "marathonPB", label: "Marathon PB (optional)", placeholder: "3:52:14", type: "text" },
      { key: "halfPB", label: "Half Marathon PB (optional)", placeholder: "1:44:30", type: "text" },
      { key: "weeklyKm", label: "Current weekly km", placeholder: "40", type: "number" },
    ],
  },
  {
    id: "availability",
    title: "Training Availability",
    subtitle: "How many days per week can you train?",
    type: "days",
  },
  {
    id: "philosophy",
    title: "Training Philosophy",
    subtitle: "This controls your workout structure. The AI always follows this first.",
    type: "philosophy",
  },
  {
    id: "personality",
    title: "Coach Style",
    subtitle: "How do you want your coach to communicate with you?",
    type: "personality",
  },
  {
    id: "race",
    title: "Your Goal Race",
    subtitle: "We'll build your entire plan around this.",
    type: "form",
    fields: [
      { key: "raceName", label: "Race Name", placeholder: "Cape Town Marathon", type: "text" },
      { key: "raceDate", label: "Race Date", placeholder: "", type: "date" },
      { key: "raceDistance", label: "Distance", placeholder: "", type: "select", options: ["5km", "10km", "Half Marathon", "Marathon", "50km", "100km", "Other"] },
      { key: "goalTime", label: "Goal Time (optional)", placeholder: "3:45:00", type: "text" },
    ],
  },
];

const philosophies = [
  { id: "polarized", label: "Polarized", desc: "80% easy, 20% hard.", color: "#4a9eff" },
  { id: "balanced", label: "Balanced", desc: "Mix of easy, tempo and hard.", color: "#1fcc8a" },
  { id: "norwegian", label: "Norwegian", desc: "Double threshold, high volume.", color: "#f0a830" },
  { id: "hr", label: "HR-Based", desc: "All training by heart rate zones.", color: "#a78bfa" },
];

const personalities = [
  { id: "supportive", label: "Supportive", emoji: "🤝" },
  { id: "tough", label: "Tough Love", emoji: "💪" },
  { id: "elite", label: "Elite Coach", emoji: "🎯" },
  { id: "calm", label: "Calm & Scientific", emoji: "🔬" },
  { id: "competitive", label: "Competitive", emoji: "🏆" },
  { id: "beginner", label: "Beginner Friendly", emoji: "🌱" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedDays, setSelectedDays] = useState<number>(5);
  const [selectedPhilosophy, setSelectedPhilosophy] = useState("balanced");
  const [selectedPersonality, setSelectedPersonality] = useState("supportive");

  const step = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;
  const progress = ((stepIndex) / (steps.length - 1)) * 100;

  const handleNext = () => {
    if (isLast) {
      router.push("/");
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Progress bar */}
      {!isFirst && (
        <div style={{ height: "2px", background: "var(--bg3)", position: "fixed", top: 0, left: 0, right: 0, zIndex: 10, maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ height: "100%", background: "var(--green)", width: `${progress}%`, transition: "width 0.3s ease" }} />
        </div>
      )}

      <div style={{ flex: 1, padding: "60px 24px 100px", display: "flex", flexDirection: "column" }}>

        {/* Back button */}
        {!isFirst && (
          <button
            onClick={handleBack}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text3)", fontSize: "14px", padding: "0 0 24px",
              textAlign: "left", fontFamily: "'DM Mono', monospace",
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            ← Back
          </button>
        )}

        {/* Step counter */}
        {!isFirst && (
          <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
            Step {stepIndex} of {steps.length - 1}
          </p>
        )}

        {/* Title */}
        <h1 style={{
          fontSize: isFirst ? "32px" : "26px",
          fontWeight: 700, letterSpacing: "-0.03em",
          color: "var(--text)", marginBottom: "10px",
          lineHeight: 1.2, whiteSpace: "pre-line",
        }}>
          {step.title}
        </h1>

        <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.6, marginBottom: "32px" }}>
          {step.subtitle}
        </p>

        {/* Welcome step */}
        {step.type === "welcome" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: "🎯", text: "Personalised training plans built around your goals" },
              { icon: "🤖", text: "AI coach that adapts when life gets in the way" },
              { icon: "📈", text: "Race intelligence for every event you enter" },
              { icon: "🔬", text: "Science-backed methods from proven training systems" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "14px",
                background: "var(--bg2)", border: "0.5px solid var(--border)",
                borderRadius: "12px", padding: "14px 16px",
              }}>
                <span style={{ fontSize: "24px" }}>{item.icon}</span>
                <span style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.5 }}>{item.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Form step */}
        {step.type === "form" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {step.fields?.map((field) => (
              <div key={field.key}>
                <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                  {field.label}
                </p>
                {field.type === "select" ? (
                  <select
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    style={{
                      width: "100%", background: "var(--bg2)",
                      border: "0.5px solid var(--border)", borderRadius: "10px",
                      padding: "13px 14px", color: formData[field.key] ? "var(--text)" : "var(--text3)",
                      fontSize: "15px", outline: "none",
                      fontFamily: "'Syne', sans-serif",
                    }}
                  >
                    <option value="">Select...</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    style={{
                      width: "100%", background: "var(--bg2)",
                      border: "0.5px solid var(--border)", borderRadius: "10px",
                      padding: "13px 14px", color: "var(--text)",
                      fontSize: "15px", outline: "none",
                      fontFamily: "'Syne', sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Days selector */}
        {step.type === "days" && (
          <div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
              <span style={{ fontSize: "64px", fontWeight: 700, color: "var(--green)", letterSpacing: "-0.04em" }}>
                {selectedDays}
              </span>
              <span style={{ fontSize: "20px", color: "var(--text3)", alignSelf: "flex-end", marginBottom: "8px", marginLeft: "6px" }}>days/week</span>
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              {[3, 4, 5, 6, 7].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDays(d)}
                  style={{
                    width: "52px", height: "52px", borderRadius: "50%",
                    border: "0.5px solid",
                    borderColor: selectedDays === d ? "var(--green)" : "var(--border)",
                    background: selectedDays === d ? "var(--green-dim)" : "var(--bg2)",
                    color: selectedDays === d ? "var(--green)" : "var(--text2)",
                    fontSize: "18px", fontWeight: 700, cursor: "pointer",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
            <p style={{ fontSize: "13px", color: "var(--text3)", textAlign: "center", marginTop: "20px", lineHeight: 1.6 }}>
              {selectedDays <= 4 ? "Great for beginners or busy schedules. Quality over quantity." :
               selectedDays === 5 ? "The sweet spot for most runners. Enough volume with good recovery." :
               selectedDays === 6 ? "High commitment. Make sure recovery is prioritised." :
               "Elite volume. Only recommended if you have a strong base."}
            </p>
          </div>
        )}

        {/* Philosophy selector */}
        {step.type === "philosophy" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {philosophies.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPhilosophy(p.id)}
                style={{
                  background: selectedPhilosophy === p.id ? `${p.color}12` : "var(--bg2)",
                  border: `0.5px solid ${selectedPhilosophy === p.id ? p.color : "var(--border)"}`,
                  borderRadius: "var(--radius)", padding: "14px 16px",
                  cursor: "pointer", textAlign: "left",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                <div>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: selectedPhilosophy === p.id ? p.color : "var(--text)", marginBottom: "3px" }}>
                    {p.label}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>{p.desc}</p>
                </div>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  border: `2px solid ${selectedPhilosophy === p.id ? p.color : "var(--border)"}`,
                  background: selectedPhilosophy === p.id ? p.color : "transparent",
                  flexShrink: 0, marginLeft: "12px",
                }} />
              </button>
            ))}
          </div>
        )}

        {/* Personality selector */}
        {step.type === "personality" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {personalities.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPersonality(p.id)}
                style={{
                  background: selectedPersonality === p.id ? "rgba(31,204,138,0.08)" : "var(--bg2)",
                  border: `0.5px solid ${selectedPersonality === p.id ? "var(--green)" : "var(--border)"}`,
                  borderRadius: "var(--radius)", padding: "16px 14px",
                  cursor: "pointer", textAlign: "left",
                }}
              >
                <p style={{ fontSize: "24px", marginBottom: "8px" }}>{p.emoji}</p>
                <p style={{ fontSize: "13px", fontWeight: 600, color: selectedPersonality === p.id ? "var(--green)" : "var(--text)" }}>
                  {p.label}
                </p>
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Bottom CTA */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        maxWidth: "480px", margin: "0 auto",
        padding: "16px 24px 32px",
        background: "linear-gradient(to top, var(--bg) 70%, transparent)",
      }}>
        <button
          onClick={handleNext}
          style={{
            width: "100%", background: "var(--green)",
            color: "var(--green-text)", fontWeight: 700,
            padding: "16px", borderRadius: "14px",
            border: "none", cursor: "pointer",
            fontSize: "16px", fontFamily: "'Syne', sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          {isFirst ? "Get Started" : isLast ? "Build My Plan →" : "Continue →"}
        </button>
      </div>

    </div>
  );
}