"use client";
import { useState } from "react";

const phases = [
  { name: "Base Building", weeks: [1, 2, 3, 4], color: "#4a9eff", description: "Building aerobic foundation. Easy volume, no intensity." },
  { name: "Aerobic Build", weeks: [5, 6, 7, 8], color: "#1fcc8a", description: "Increasing volume and introducing tempo work." },
  { name: "Threshold", weeks: [9, 10, 11, 12], color: "#f0a830", description: "Lactate threshold development. Key quality sessions." },
  { name: "Peak", weeks: [13, 14, 15], color: "#a78bfa", description: "Highest intensity and volume. Race-specific work." },
  { name: "Taper", weeks: [16], color: "#e05252", description: "Volume drops sharply. Legs freshen up for race day." },
  { name: "Race", weeks: [17], color: "#1fcc8a", description: "Cape Town Marathon — September 21, 2025." },
  { name: "Recovery", weeks: [18, 19], color: "#555", description: "Mandatory recovery. No racing or hard efforts." },
];

const weekData = [
  { week: 1, km: 40, fatigue: 30, phase: "Base Building" },
  { week: 2, km: 45, fatigue: 35, phase: "Base Building" },
  { week: 3, km: 52, fatigue: 42, phase: "Base Building" },
  { week: 4, km: 38, fatigue: 25, phase: "Base Building", recovery: true },
  { week: 5, km: 55, fatigue: 45, phase: "Aerobic Build" },
  { week: 6, km: 60, fatigue: 52, phase: "Aerobic Build" },
  { week: 7, km: 65, fatigue: 58, phase: "Aerobic Build" },
  { week: 8, km: 45, fatigue: 30, phase: "Aerobic Build", recovery: true },
  { week: 9, km: 68, fatigue: 62, phase: "Threshold" },
  { week: 10, km: 72, fatigue: 68, phase: "Threshold" },
  { week: 11, km: 75, fatigue: 72, phase: "Threshold" },
  { week: 12, km: 50, fatigue: 35, phase: "Threshold", recovery: true },
  { week: 13, km: 78, fatigue: 75, phase: "Peak" },
  { week: 14, km: 80, fatigue: 80, phase: "Peak" },
  { week: 15, km: 72, fatigue: 70, phase: "Peak" },
  { week: 16, km: 45, fatigue: 40, phase: "Taper" },
  { week: 17, km: 10, fatigue: 15, phase: "Race", race: true },
  { week: 18, km: 20, fatigue: 20, phase: "Recovery" },
  { week: 19, km: 30, fatigue: 25, phase: "Recovery" },
];

const CURRENT_WEEK = 2;
const MAX_KM = 80;

export default function TimelinePage() {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [view, setView] = useState<"timeline" | "chart">("timeline");

  const selectedData = weekData.find(w => w.week === selectedWeek);
  const selectedPhase = phases.find(p => p.weeks.includes(selectedWeek || 0));

  const getPhaseColor = (phaseName: string) => {
    return phases.find(p => p.name === phaseName)?.color || "#555";
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ padding: "52px 16px 16px" }}>
        <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Cape Town Marathon
        </p>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", marginTop: "4px" }}>
          Training Timeline
        </h1>
      </div>

      {/* View toggle */}
      <div style={{ padding: "0 16px 16px", display: "flex", gap: "6px" }}>
        {[
          { id: "timeline", label: "Timeline" },
          { id: "chart", label: "Mileage Chart" },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id as any)}
            style={{
              padding: "7px 16px", borderRadius: "20px",
              border: "0.5px solid",
              borderColor: view === v.id ? "var(--green)" : "var(--border)",
              background: view === v.id ? "var(--green-dim)" : "var(--bg2)",
              color: view === v.id ? "var(--green)" : "var(--text3)",
              fontSize: "12px", fontFamily: "'DM Mono', monospace",
              cursor: "pointer",
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Phase legend */}
      <div style={{ padding: "0 16px 16px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {phases.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: p.color, flexShrink: 0 }} />
            <span style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>{p.name}</span>
          </div>
        ))}
      </div>

      {view === "timeline" ? (
        <>
          {/* Timeline blocks */}
          <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {weekData.map((w) => {
              const color = getPhaseColor(w.phase);
              const isCurrentWeek = w.week === CURRENT_WEEK;
              const isPast = w.week < CURRENT_WEEK;
              const isSelected = w.week === selectedWeek;
              const widthPct = (w.km / MAX_KM) * 100;

              return (
                <div
                  key={w.week}
                  onClick={() => setSelectedWeek(w.week === selectedWeek ? null : w.week)}
                  style={{
                    background: isSelected ? `${color}15` : "var(--bg2)",
                    border: `0.5px solid ${isSelected ? color : isCurrentWeek ? "var(--green)" : "var(--border)"}`,
                    borderRadius: "10px",
                    padding: "10px 14px",
                    cursor: "pointer",
                    opacity: isPast ? 0.5 : 1,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{
                        fontSize: "11px", fontFamily: "'DM Mono', monospace",
                        color: isCurrentWeek ? "var(--green)" : "var(--text3)",
                        minWidth: "20px",
                      }}>
                        W{w.week}
                      </span>
                      {isCurrentWeek && (
                        <span style={{
                          fontSize: "9px", color: "var(--green)",
                          fontFamily: "'DM Mono', monospace",
                          background: "var(--green-dim)",
                          padding: "2px 8px", borderRadius: "10px",
                          letterSpacing: "0.06em",
                        }}>
                          NOW
                        </span>
                      )}
                      {w.race && (
                        <span style={{
                          fontSize: "9px", color: "#1fcc8a",
                          fontFamily: "'DM Mono', monospace",
                          background: "rgba(31,204,138,0.1)",
                          padding: "2px 8px", borderRadius: "10px",
                        }}>
                          RACE DAY
                        </span>
                      )}
                      {w.recovery && (
                        <span style={{
                          fontSize: "9px", color: "var(--text3)",
                          fontFamily: "'DM Mono', monospace",
                          background: "var(--bg3)",
                          padding: "2px 8px", borderRadius: "10px",
                        }}>
                          RECOVERY
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)", fontFamily: "'DM Mono', monospace" }}>
                        {w.km}km
                      </span>
                      <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: color }} />
                    </div>
                  </div>

                  {/* Mileage bar */}
                  <div style={{ background: "var(--bg3)", borderRadius: "3px", height: "4px", overflow: "hidden" }}>
                    <div style={{
                      width: `${widthPct}%`, height: "100%",
                      background: isPast ? "#333" : color,
                      borderRadius: "3px",
                    }} />
                  </div>

                  {/* Expanded detail */}
                  {isSelected && (
                    <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "0.5px solid var(--border)" }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: color, marginBottom: "4px" }}>{w.phase}</p>
                      <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.6, marginBottom: "10px" }}>
                        {phases.find(p => p.name === w.phase)?.description}
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <div style={{ background: "var(--bg3)", borderRadius: "8px", padding: "10px 12px" }}>
                          <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", marginBottom: "3px" }}>VOLUME</p>
                          <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)" }}>{w.km}km</p>
                        </div>
                        <div style={{ background: "var(--bg3)", borderRadius: "8px", padding: "10px 12px" }}>
                          <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", marginBottom: "3px" }}>FATIGUE</p>
                          <p style={{ fontSize: "16px", fontWeight: 700, color: w.fatigue > 65 ? "#e05252" : w.fatigue > 40 ? "#f0a830" : "var(--green)" }}>
                            {w.fatigue}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Mileage Chart view */
        <div style={{ padding: "0 16px" }}>
          <div style={{ background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "16px" }}>
            <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px" }}>
              Weekly Volume (km)
            </p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "120px" }}>
              {weekData.map((w) => {
                const heightPct = (w.km / MAX_KM) * 100;
                const color = getPhaseColor(w.phase);
                const isCurrentWeek = w.week === CURRENT_WEEK;
                return (
                  <div
                    key={w.week}
                    onClick={() => setSelectedWeek(w.week)}
                    style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer" }}
                  >
                    <div style={{
                      width: "100%", height: `${heightPct}%`,
                      background: w.week < CURRENT_WEEK ? "#2a2a2a" : color,
                      borderRadius: "3px 3px 0 0",
                      border: isCurrentWeek ? `1px solid ${color}` : "none",
                      minHeight: "4px",
                      opacity: w.week < CURRENT_WEEK ? 0.6 : 1,
                    }} />
                  </div>
                );
              })}
            </div>
            {/* X axis labels */}
            <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
              {weekData.map((w) => (
                <div key={w.week} style={{ flex: 1, textAlign: "center" }}>
                  <span style={{ fontSize: "8px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>
                    {w.race ? "🏁" : w.week}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fatigue chart */}
          <div style={{ background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "16px", marginTop: "10px" }}>
            <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px" }}>
              Fatigue Index
            </p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "80px" }}>
              {weekData.map((w) => {
                const heightPct = w.fatigue;
                const color = w.fatigue > 65 ? "#e05252" : w.fatigue > 40 ? "#f0a830" : "#1fcc8a";
                return (
                  <div key={w.week} style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
                    <div style={{
                      width: "100%", height: `${heightPct}%`,
                      background: w.week < CURRENT_WEEK ? "#2a2a2a" : color,
                      borderRadius: "3px 3px 0 0",
                      minHeight: "4px",
                      opacity: w.week < CURRENT_WEEK ? 0.6 : 1,
                    }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phase breakdown */}
          <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {phases.map((p, i) => (
              <div key={i} style={{
                background: "var(--bg2)", border: "0.5px solid var(--border)",
                borderRadius: "10px", padding: "12px 14px",
                display: "flex", alignItems: "center", gap: "12px",
              }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: p.color, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "2px" }}>
                    {p.name} <span style={{ fontSize: "11px", color: "var(--text3)", fontWeight: 400, fontFamily: "'DM Mono', monospace" }}>
                      Wk {p.weeks[0]}{p.weeks.length > 1 ? `–${p.weeks[p.weeks.length - 1]}` : ""}
                    </span>
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text3)" }}>{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ height: "20px" }} />
    </div>
  );
}