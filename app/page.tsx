"use client";
import { useEffect, useState } from "react";
import StatCard from "./components/StatCard";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const getDate = () => new Date().toLocaleDateString("en-ZA", {
  weekday: "long", month: "long", day: "numeric"
}).toUpperCase();

const getDaysUntil = (dateStr: string) => {
  const race = new Date(dateStr);
  const today = new Date();
  const diff = Math.ceil((race.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

export default function Home() {
  const [name, setName] = useState("Connor");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedName = localStorage.getItem("userName");
    if (savedName) setName(savedName);
  }, []);

  const daysUntilKnysna = getDaysUntil("2025-07-19");
  const daysUntilCT = getDaysUntil("2025-09-21");

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ padding: "52px 16px 16px" }}>
        <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {mounted ? getDate() : ""}
        </p>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", marginTop: "4px" }}>
          {mounted ? `${getGreeting()}, ${name}` : `Good morning, ${name}`}
        </h1>
      </div>

      {/* Week progress */}
      <div style={{ margin: "0 16px 10px", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <div>
            <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace" }}>
              Week 4 of 16
            </p>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", marginTop: "3px" }}>
              Base Building
            </p>
          </div>
          <span style={{ fontSize: "12px", color: "var(--green)", fontFamily: "'DM Mono', monospace" }}>
            3 left
          </span>
        </div>
        <div style={{ background: "var(--bg3)", borderRadius: "3px", height: "4px", overflow: "hidden" }}>
          <div style={{ width: "40%", height: "100%", background: "var(--green)", borderRadius: "3px" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
          <span style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>32km done</span>
          <span style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>80km target</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "0 16px", marginBottom: "10px" }}>
        <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>
          This Week
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <StatCard label="Distance" value="32" unit="km" delta="↑ 8% vs last week" deltaUp={true} />
          <StatCard label="Duration" value="3:42" unit="hr" delta="On target" deltaUp={true} />
          <StatCard label="Elevation" value="480" unit="m" />
          <StatCard label="Avg Pace" value="6:58" unit="/km" delta="↓ 12s faster" deltaUp={true} />
        </div>
      </div>

      {/* Today's workout */}
      <div style={{ margin: "0 16px 10px", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 16px" }}>
        <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>
          Today
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)" }}>Easy Recovery Run</p>
            <p style={{ fontSize: "13px", color: "var(--text2)", marginTop: "3px" }}>8km · Zone 2 · 56 min</p>
            <p style={{ fontSize: "12px", color: "var(--text3)", marginTop: "3px" }}>Keep HR below 145 bpm</p>
          </div>
          <span style={{ fontSize: "11px", color: "var(--green)", background: "var(--green-dim)", padding: "4px 10px", borderRadius: "20px", fontFamily: "'DM Mono', monospace" }}>
            easy
          </span>
        </div>
        <a href="/training" style={{ textDecoration: "none" }}>
          <button style={{
            marginTop: "14px", width: "100%",
            background: "var(--green)", color: "var(--green-text)",
            fontWeight: 600, padding: "12px", borderRadius: "10px",
            border: "none", cursor: "pointer", fontSize: "14px",
            fontFamily: "'Syne', sans-serif",
          }}>
            Start Workout →
          </button>
        </a>
      </div>

      {/* Races */}
      <div style={{ margin: "0 16px 10px" }}>
        <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>
          Upcoming Races
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { name: "Knysna Forest Marathon", date: "Jul 19", days: daysUntilKnysna, surface: "Trail" },
            { name: "Cape Town Marathon", date: "Sep 21", days: daysUntilCT, surface: "Road" },
          ].map((race, i) => (
            <div key={i} style={{ background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>{race.name}</p>
                <p style={{ fontSize: "12px", color: "var(--text2)", marginTop: "2px", fontFamily: "'DM Mono', monospace" }}>{race.date} · {race.surface}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--green)", lineHeight: 1 }}>
                  {mounted ? race.days : "—"}
                </p>
                <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>days</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coach notes */}
      <div style={{ margin: "0 16px 20px", background: "var(--bg2)", border: "0.5px solid rgba(31,204,138,0.2)", borderRadius: "var(--radius)", padding: "14px 16px" }}>
        <p style={{ fontSize: "10px", color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>
          Coach Note
        </p>
        <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.6 }}>
          Your threshold pace improved 4 sec/km over the last 3 weeks. The consistency is paying off. Keep protecting your easy days.
        </p>
      </div>

    </div>
  );
}