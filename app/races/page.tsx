"use client";
import { useState, useEffect } from "react";
import AddRaceModal from "../components/AddRaceModal";
import { getRaces, deleteRace, Race } from "../lib/raceStore";

const getDaysUntil = (dateStr: string) => {
  const race = new Date(dateStr);
  const today = new Date();
  return Math.ceil((race.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const raceIntelligence: Record<string, { notes: string; aiInsight: string; elevation: string; cutoff: string; aidStations: number; difficulty: string; difficultyColor: string; temp: string }> = {
  "Knysna Forest Marathon": {
    notes: "Technical single track through indigenous forest. Significant elevation in first 15km. Mud likely if recent rain.",
    aiInsight: "Based on your tempo pace and elevation data, target 5:30/km on flats and power-hike steep climbs. Start conservatively — 80% of DNFs happen after km 30.",
    elevation: "1,240m gain", cutoff: "7 hours", aidStations: 6, difficulty: "Hard", difficultyColor: "#e05252", temp: "12–18°C",
  },
  "Cape Town Marathon": {
    notes: "Fast city course. Slight headwind on foreshore likely. Miles 18–22 are exposed with no shade.",
    aiInsight: "Your current fitness projects a 3:48 finish. 8 more weeks of training puts 3:45 well within reach. Key session: 32km long run at goal pace in week 10.",
    elevation: "180m gain", cutoff: "6 hours", aidStations: 12, difficulty: "Moderate", difficultyColor: "#f0a830", temp: "14–22°C",
  },
};

export default function RacesPage() {
  const [races, setRaces] = useState<Race[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { setRaces(getRaces()); }, []);

  const handleDelete = (id: string) => {
    deleteRace(id);
    setRaces(getRaces());
  };

  const handleSaved = () => setRaces(getRaces());

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      <div style={{ padding: "52px 16px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>Season 2025</p>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", marginTop: "4px" }}>My Races</h1>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ background: "var(--green)", color: "var(--green-text)", fontWeight: 600, padding: "8px 16px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "13px", fontFamily: "'Syne', sans-serif" }}
        >
          + Add Race
        </button>
      </div>

      {races.length === 0 && (
        <div style={{ padding: "60px 16px", textAlign: "center" }}>
          <p style={{ fontSize: "32px", marginBottom: "12px" }}>🏁</p>
          <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginBottom: "6px" }}>No races yet</p>
          <p style={{ fontSize: "13px", color: "var(--text3)" }}>Add your goal race and we'll build your plan around it.</p>
        </div>
      )}

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {races.map((race) => {
          const days = getDaysUntil(race.date);
          const intel = raceIntelligence[race.name];
          const isExpanded = expandedId === race.id;

          return (
            <div key={race.id} style={{ background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>

              <div
                onClick={() => setExpandedId(isExpanded ? null : race.id)}
                style={{ padding: "14px 16px", cursor: "pointer" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>{race.name}</p>
                    <p style={{ fontSize: "12px", color: "var(--text2)", marginTop: "2px", fontFamily: "'DM Mono', monospace" }}>
                      {new Date(race.date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })} · {race.location || race.surface}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.03em", color: days < 14 ? "#e05252" : "var(--green)", lineHeight: 1 }}>{days}</p>
                    <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>days away</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
                  {[race.distance, race.surface, race.goalTime ? `Goal: ${race.goalTime}` : null].filter(Boolean).map((tag, j) => (
                    <span key={j} style={{
                      fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
                      fontFamily: "'DM Mono', monospace",
                      color: tag?.startsWith("Goal") ? "var(--green)" : "var(--text2)",
                      background: tag?.startsWith("Goal") ? "var(--green-dim)" : "var(--bg3)",
                      border: `0.5px solid ${tag?.startsWith("Goal") ? "rgba(31,204,138,0.2)" : "var(--border)"}`,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              {isExpanded && (
                <>
                  {intel && (
                    <>
                      <div style={{ height: "0.5px", background: "var(--border)", margin: "0 16px" }} />
                      <div style={{ padding: "12px 16px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {[intel.elevation, `Cutoff: ${intel.cutoff}`, `${intel.aidStations} aid stations`, intel.temp].map((t, j) => (
                          <span key={j} style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", color: "var(--text2)", background: "var(--bg3)", border: "0.5px solid var(--border)", fontFamily: "'DM Mono', monospace" }}>{t}</span>
                        ))}
                        <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", color: intel.difficultyColor, background: `${intel.difficultyColor}18`, border: `0.5px solid ${intel.difficultyColor}40`, fontFamily: "'DM Mono', monospace" }}>{intel.difficulty}</span>
                      </div>
                      <div style={{ height: "0.5px", background: "var(--border)", margin: "0 16px" }} />
                      <div style={{ padding: "12px 16px" }}>
                        <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Course Notes</p>
                        <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.6 }}>{intel.notes}</p>
                      </div>
                      <div style={{ height: "0.5px", background: "var(--border)", margin: "0 16px" }} />
                      <div style={{ padding: "12px 16px", background: "rgba(31,204,138,0.04)" }}>
                        <p style={{ fontSize: "10px", color: "var(--green)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>AI Race Intelligence</p>
                        <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.6 }}>{intel.aiInsight}</p>
                      </div>
                    </>
                  )}
                  <div style={{ height: "0.5px", background: "var(--border)", margin: "0 16px" }} />
                  <div style={{ padding: "12px 16px", display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleDelete(race.id)}
                      style={{ flex: 1, background: "rgba(224,82,82,0.1)", border: "0.5px solid rgba(224,82,82,0.3)", borderRadius: "10px", padding: "10px", color: "#e05252", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Mono', monospace" }}
                    >
                      Delete Race
                    </button>
                    <button
                      style={{ flex: 1, background: "var(--green)", border: "none", borderRadius: "10px", padding: "10px", color: "var(--green-text)", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}
                    >
                      View Plan
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <AddRaceModal isOpen={showAdd} onClose={() => setShowAdd(false)} onSaved={handleSaved} />
    </div>
  );
}