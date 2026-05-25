"use client";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [units, setUnits] = useState("Metric");
  const [appearance, setAppearance] = useState("Dark");
  const [fontSize, setFontSize] = useState("Default");
  const [trainingPhilosophy, setTrainingPhilosophy] = useState("Balanced");
  const [trainingDays, setTrainingDays] = useState("5");
  const [coachPersonality, setCoachPersonality] = useState("Supportive");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setUnits(localStorage.getItem("units") || "Metric");
    setAppearance(localStorage.getItem("appearance") || "Dark");
    setFontSize(localStorage.getItem("fontSize") || "Default");
    setTrainingPhilosophy(localStorage.getItem("trainingPhilosophy") || "Balanced");
    setTrainingDays(localStorage.getItem("trainingDays") || "5");
    setCoachPersonality(localStorage.getItem("coachPersonality") || "Supportive");
  }, []);

  const handleSave = () => {
    localStorage.setItem("units", units);
    localStorage.setItem("appearance", appearance);
    localStorage.setItem("fontSize", fontSize);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    {
      title: "Profile",
      items: [
        { label: "Age, gender, weight", value: "28 · M · 72kg", link: "/profile" },
        { label: "Heart rate zones", value: "Max 187", link: "/profile" },
        { label: "Personal records", value: "View", link: "/profile" },
      ],
    },
    {
      title: "Training",
      items: [
        { label: "Coaching philosophy", value: trainingPhilosophy, link: "/profile" },
        { label: "Weekly availability", value: `${trainingDays} days`, link: "/profile" },
        { label: "Race goals", value: "Sub 3:45", link: "/races" },
      ],
    },
    {
      title: "Coach",
      items: [
        { label: "Coach personality", value: coachPersonality, link: "/profile" },
        { label: "AI permissions", value: "Full access", link: "/profile" },
      ],
    },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      <div style={{ padding: "52px 16px 16px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>Settings</h1>
      </div>

      {/* Linked sections */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {sections.map((section, i) => (
          <div key={i}>
            <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px", paddingLeft: "4px" }}>
              {section.title}
            </p>
            <div style={{ background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              {section.items.map((item, j) => (
                <a key={j} href={item.link} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "13px 16px", textDecoration: "none",
                  borderBottom: j < section.items.length - 1 ? "0.5px solid var(--border)" : "none",
                }}>
                  <span style={{ fontSize: "14px", color: "var(--text)" }}>{item.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>{item.value}</span>
                    <span style={{ color: "var(--text3)", fontSize: "16px" }}>›</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Units & Display — interactive */}
        <div>
          <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px", paddingLeft: "4px" }}>
            Units & Display
          </p>
          <div style={{ background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>

            {/* Units */}
            <div style={{ padding: "13px 16px", borderBottom: "0.5px solid var(--border)" }}>
              <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "10px" }}>Units</p>
              <div style={{ display: "flex", gap: "8px" }}>
                {["Metric", "Imperial"].map(u => (
                  <button key={u} onClick={() => setUnits(u)} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "0.5px solid", borderColor: units === u ? "var(--green)" : "var(--border)", background: units === u ? "var(--green-dim)" : "var(--bg3)", color: units === u ? "var(--green)" : "var(--text2)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Appearance */}
            <div style={{ padding: "13px 16px", borderBottom: "0.5px solid var(--border)" }}>
              <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "10px" }}>Appearance</p>
              <div style={{ display: "flex", gap: "8px" }}>
                {["Dark", "Light"].map(a => (
                  <button key={a} onClick={() => setAppearance(a)} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "0.5px solid", borderColor: appearance === a ? "var(--green)" : "var(--border)", background: appearance === a ? "var(--green-dim)" : "var(--bg3)", color: appearance === a ? "var(--green)" : "var(--text2)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Font size */}
            <div style={{ padding: "13px 16px" }}>
              <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "10px" }}>Font Size</p>
              <div style={{ display: "flex", gap: "8px" }}>
                {["Small", "Default", "Large"].map(f => (
                  <button key={f} onClick={() => setFontSize(f)} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "0.5px solid", borderColor: fontSize === f ? "var(--green)" : "var(--border)", background: fontSize === f ? "var(--green-dim)" : "var(--bg3)", color: fontSize === f ? "var(--green)" : "var(--text2)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div>
          <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px", paddingLeft: "4px" }}>
            Privacy
          </p>
          <div style={{ background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            {[
              { label: "AI data permissions", value: "Full access" },
              { label: "Social visibility", value: "Friends only" },
              { label: "Data sharing", value: "Off" },
            ].map((item, j, arr) => (
              <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderBottom: j < arr.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                <span style={{ fontSize: "14px", color: "var(--text)" }}>{item.label}</span>
                <span style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>{item.value} ›</span>
              </div>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div>
          <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px", paddingLeft: "4px" }}>
            Integrations
          </p>
          <div style={{ background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            {[
              { name: "Garmin Connect", color: "#4a9eff" },
              { name: "Strava", color: "#f0a830" },
              { name: "Apple Health", color: "#e05252" },
            ].map((item, j, arr) => (
              <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderBottom: j < arr.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                <span style={{ fontSize: "14px", color: "var(--text)" }}>{item.name}</span>
                <button style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", color: item.color, background: `${item.color}12`, border: `0.5px solid ${item.color}40`, borderRadius: "20px", padding: "4px 12px", cursor: "pointer" }}>
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <button onClick={handleSave} style={{ width: "100%", background: saved ? "var(--bg2)" : "var(--green)", color: saved ? "var(--green)" : "var(--green-text)", fontWeight: 600, padding: "14px", borderRadius: "12px", border: saved ? "0.5px solid var(--green)" : "none", cursor: "pointer", fontSize: "15px", fontFamily: "'Syne', sans-serif", transition: "all 0.2s ease", marginBottom: "20px" }}>
          {saved ? "✓ Saved" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}