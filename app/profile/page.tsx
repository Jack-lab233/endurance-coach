"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { IconSettings } from "@tabler/icons-react";

const philosophies = [
  { id: "polarized", label: "Polarized", desc: "80% easy, 20% hard. Science-backed for endurance.", color: "#4a9eff" },
  { id: "balanced", label: "Balanced", desc: "Mix of easy, tempo and hard efforts.", color: "#1fcc8a" },
  { id: "norwegian", label: "Norwegian", desc: "Double threshold. High volume at controlled intensity.", color: "#f0a830" },
  { id: "hr", label: "HR-Based", desc: "All training dictated by heart rate zones.", color: "#a78bfa" },
];

const personalities = [
  { id: "supportive", label: "Supportive", desc: "Encouraging and empathetic. Celebrates every win.", emoji: "🤝" },
  { id: "tough", label: "Tough Love", desc: "Pushes hard. No excuses. High standards.", emoji: "💪" },
  { id: "elite", label: "Elite Coach", desc: "Data-driven. Precise. Treats you like a pro.", emoji: "🎯" },
  { id: "calm", label: "Calm & Scientific", desc: "Measured and analytical. Explains everything.", emoji: "🔬" },
  { id: "competitive", label: "Competitive", desc: "Fuels your fire. Always chasing improvement.", emoji: "🏆" },
  { id: "beginner", label: "Beginner Friendly", desc: "Patient and clear. Perfect if you're still learning.", emoji: "🌱" },
];

export default function ProfilePage() {
  const [selectedPhilosophy, setSelectedPhilosophy] = useState("balanced");
  const [selectedPersonality, setSelectedPersonality] = useState("supportive");
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) setProfile(JSON.parse(storedProfile));
    const philosophy = localStorage.getItem("trainingPhilosophy");
    if (philosophy) setSelectedPhilosophy(philosophy);
    const personality = localStorage.getItem("coachPersonality");
    if (personality) setSelectedPersonality(personality);
  }, []);

  const handleSave = () => {
    localStorage.setItem("coachPersonality", selectedPersonality);
    localStorage.setItem("trainingPhilosophy", selectedPhilosophy);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const userName = profile.name || localStorage.getItem?.("userName") || "Athlete";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Header with settings button */}
      <div style={{
        padding: "52px 16px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      }}>
        <div>
          <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Athlete
          </p>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", marginTop: "4px" }}>
            Profile
          </h1>
        </div>
        <Link href="/settings" style={{
          width: "36px", height: "36px",
          background: "rgba(20,20,20,0.8)",
          backdropFilter: "blur(10px)",
          border: "0.5px solid var(--border)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text2)",
          textDecoration: "none",
          flexShrink: 0,
        }}>
          <IconSettings size={18} strokeWidth={1.6} />
        </Link>
      </div>

      {/* Athlete card */}
      <div style={{ margin: "0 16px 16px", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: "var(--green-dim)", border: "0.5px solid rgba(31,204,138,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", fontWeight: 700, color: "var(--green)",
          }}>
            {initial}
          </div>
          <div>
            <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>{userName}</p>
            <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", marginTop: "2px" }}>
              {profile.gender || ""}{profile.age ? ` · ${profile.age} yrs` : ""}
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          {[
            { label: "Age", value: profile.age || "—" },
            { label: "Weight", value: profile.weight ? `${profile.weight}kg` : "—" },
            { label: "Max HR", value: profile.maxHR ? `${profile.maxHR}` : "—" },
          ].map((stat, i) => (
            <div key={i} style={{ background: "var(--bg3)", borderRadius: "10px", padding: "10px 12px" }}>
              <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>{stat.label}</p>
              <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance stats */}
      <div style={{ margin: "0 16px 16px", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "16px" }}>
        <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
          Performance
        </p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[
            { label: "Marathon PB", value: profile.marathonPB || "—" },
            { label: "Half Marathon PB", value: profile.halfPB || "—" },
            { label: "Current weekly km", value: profile.weeklyKm ? `${profile.weeklyKm}km` : "—" },
            { label: "Training days/week", value: profile.days ? `${profile.days} days` : "—" },
          ].map((item, i, arr) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "11px 0",
              borderBottom: i < arr.length - 1 ? "0.5px solid var(--border)" : "none",
            }}>
              <span style={{ fontSize: "13px", color: "var(--text2)" }}>{item.label}</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", fontFamily: "'DM Mono', monospace" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Training Philosophy */}
      <div style={{ margin: "0 16px 16px" }}>
        <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px", paddingLeft: "4px" }}>
          Training Philosophy
        </p>
        <p style={{ fontSize: "12px", color: "var(--text3)", marginBottom: "10px", paddingLeft: "4px", lineHeight: 1.5 }}>
          This controls your workout structure, progression and intensity. The AI coach always follows this first.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {philosophies.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPhilosophy(p.id)}
              style={{
                background: selectedPhilosophy === p.id ? `${p.color}12` : "var(--bg2)",
                border: `0.5px solid ${selectedPhilosophy === p.id ? p.color : "var(--border)"}`,
                borderRadius: "var(--radius)", padding: "12px 16px",
                cursor: "pointer", textAlign: "left",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontSize: "14px", fontWeight: 600, color: selectedPhilosophy === p.id ? p.color : "var(--text)", marginBottom: "2px" }}>
                  {p.label}
                </p>
                <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>
                  {p.desc}
                </p>
              </div>
              <div style={{
                width: "18px", height: "18px", borderRadius: "50%",
                border: `2px solid ${selectedPhilosophy === p.id ? p.color : "var(--border)"}`,
                background: selectedPhilosophy === p.id ? p.color : "transparent",
                flexShrink: 0, marginLeft: "12px",
              }} />
            </button>
          ))}
        </div>
      </div>

      {/* Coach Personality */}
      <div style={{ margin: "0 16px 16px" }}>
        <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px", paddingLeft: "4px" }}>
          Coach Personality
        </p>
        <p style={{ fontSize: "12px", color: "var(--text3)", marginBottom: "10px", paddingLeft: "4px", lineHeight: 1.5 }}>
          Controls tone, motivation style and how your coach communicates. Never overrides training safety.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {personalities.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPersonality(p.id)}
              style={{
                background: selectedPersonality === p.id ? "rgba(31,204,138,0.08)" : "var(--bg2)",
                border: `0.5px solid ${selectedPersonality === p.id ? "var(--green)" : "var(--border)"}`,
                borderRadius: "var(--radius)", padding: "12px 14px",
                cursor: "pointer", textAlign: "left",
              }}
            >
              <p style={{ fontSize: "20px", marginBottom: "6px" }}>{p.emoji}</p>
              <p style={{ fontSize: "13px", fontWeight: 600, color: selectedPersonality === p.id ? "var(--green)" : "var(--text)", marginBottom: "3px" }}>
                {p.label}
              </p>
              <p style={{ fontSize: "11px", color: "var(--text3)", lineHeight: 1.4 }}>
                {p.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Connected accounts */}
      <div style={{ margin: "0 16px 16px", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "0.5px solid var(--border)" }}>
          <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Connected Accounts
          </p>
        </div>
        {[
          { name: "Garmin Connect", status: "Not connected", color: "#4a9eff" },
          { name: "Strava", status: "Not connected", color: "#f0a830" },
          { name: "Apple Health", status: "Not connected", color: "#e05252" },
        ].map((item, i, arr) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "13px 16px",
            borderBottom: i < arr.length - 1 ? "0.5px solid var(--border)" : "none",
          }}>
            <span style={{ fontSize: "14px", color: "var(--text)" }}>{item.name}</span>
            <button style={{
              fontSize: "11px", fontFamily: "'DM Mono', monospace",
              color: item.color, background: `${item.color}12`,
              border: `0.5px solid ${item.color}40`,
              borderRadius: "20px", padding: "4px 12px", cursor: "pointer",
            }}>
              Connect
            </button>
          </div>
        ))}
      </div>

      {/* Sign out button */}
      <div style={{ padding: "0 16px 8px" }}>
        <button
          onClick={handleSave}
          style={{
            width: "100%", background: saved ? "var(--bg2)" : "var(--green)",
            color: saved ? "var(--green)" : "var(--green-text)",
            fontWeight: 600, padding: "14px", borderRadius: "12px",
            border: saved ? "0.5px solid var(--green)" : "none",
            cursor: "pointer", fontSize: "15px",
            fontFamily: "'Syne', sans-serif", transition: "all 0.2s ease",
          }}
        >
          {saved ? "✓ Saved" : "Save Profile"}
        </button>
      </div>

      <div style={{ padding: "0 16px 32px" }}>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/auth";
          }}
          style={{
            width: "100%", background: "transparent",
            color: "#e05252", fontWeight: 600, padding: "14px",
            borderRadius: "12px", border: "0.5px solid rgba(224,82,82,0.3)",
            cursor: "pointer", fontSize: "15px", fontFamily: "'Syne', sans-serif",
          }}
        >
          Sign Out
        </button>
      </div>

    </div>
  );
}