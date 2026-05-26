"use client";
import { useState, useEffect } from "react";
import AddRaceModal from "../components/AddRaceModal";
import { loadRacesFromSupabase, deleteRace, setPrimaryRace, getRaces } from "../lib/raceStore";

function getDaysUntil(dateStr: string): number {
  const parts = dateStr.split("-").map(Number);
  const race = new Date(parts[0], parts[1] - 1, parts[2]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  race.setHours(0, 0, 0, 0);
  return Math.ceil((race.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatCountdown(days: number): string {
  const w = Math.floor(days / 7);
  const d = days % 7;
  if (w === 0) return d + "d";
  if (d === 0) return w + "w";
  return w + "w " + d + "d";
}

function Tag({ text, color, bg, border }: { text: string; color: string; bg: string; border: string }) {
  return (
    <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontFamily: "'DM Mono', monospace", color, background: bg, border: "0.5px solid " + border }}>
      {text}
    </span>
  );
}

function RaceCard({ race, isExpanded, onToggle, onDelete, onSetPrimary, isPast }: {
  race: any; isExpanded: boolean; onToggle: () => void; onDelete: () => void; onSetPrimary: () => void; isPast: boolean;
}) {
  const days = getDaysUntil(race.date);
  const absdays = Math.abs(days);

  let daysColor = "var(--green)";
  if (isPast) daysColor = "var(--text3)";
  else if (days < 15) daysColor = "#e05252";

  const dateDisplay = formatDate(race.date) + (race.location ? " · " + race.location : "");
  const countdown = formatCountdown(absdays);

  const mainTags: Array<{ text: string; color: string; bg: string; border: string }> = [];
  if (race.distance) mainTags.push({ text: race.distance, color: "var(--text2)", bg: "var(--bg3)", border: "var(--border)" });
  if (race.surface) mainTags.push({ text: race.surface, color: "var(--text2)", bg: "var(--bg3)", border: "var(--border)" });
  if (race.goalTime) mainTags.push({ text: "Goal: " + race.goalTime, color: "var(--green)", bg: "var(--green-dim)", border: "rgba(31,204,138,0.2)" });
  if (race.difficulty) {
    const dc = race.difficultyColor || "#888";
    mainTags.push({ text: race.difficulty, color: dc, bg: dc + "18", border: dc + "40" });
  }

  const intelTags: string[] = [];
  if (race.elevation) intelTags.push(race.elevation);
  if (race.cutoff) intelTags.push("Cutoff: " + race.cutoff);
  if (race.aidStations) intelTags.push(race.aidStations + " aid stations");
  if (race.temp) intelTags.push(race.temp);

  const websiteDomain = race.url ? race.url.replace(/^https?:\/\//, "").split("/")[0] : "";

  return (
    <div style={{ background: "var(--bg2)", border: race.isPrimary ? "0.5px solid rgba(31,204,138,0.4)" : isExpanded ? "0.5px solid rgba(31,204,138,0.2)" : "0.5px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", opacity: isPast ? 0.7 : 1 }}>

      {race.isPrimary && !isPast && (
        <div style={{ background: "rgba(31,204,138,0.08)", borderBottom: "0.5px solid rgba(31,204,138,0.2)", padding: "6px 16px" }}>
          <span style={{ fontSize: "10px", color: "var(--green)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            A Race — Primary Goal
          </span>
        </div>
      )}

      <div onClick={onToggle} style={{ padding: "14px 16px", cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, paddingRight: "12px" }}>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>{race.name}</p>
            <p style={{ fontSize: "12px", color: "var(--text2)", marginTop: "2px", fontFamily: "'DM Mono', monospace" }}>{dateDisplay}</p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            {isPast ? (
              <>
                <p style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.03em", color: daysColor, lineHeight: 1 }}>{absdays}</p>
                <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>days ago</p>
              </>
            ) : (
              <>
                <p style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.03em", color: daysColor, lineHeight: 1 }}>{countdown}</p>
                <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>to race day</p>
              </>
            )}
          </div>
        </div>

        {(race.goalTime || race.goalPace) && !isPast && (
          <div style={{ display: "flex", gap: "16px", marginTop: "10px" }}>
            {race.goalPace && (
              <div>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>{race.goalPace}</p>
                <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>Goal Pace</p>
              </div>
            )}
            {race.goalTime && (
              <div>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>{race.goalTime}</p>
                <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>Goal Time</p>
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
          {mainTags.map((tag, j) => <Tag key={j} text={tag.text} color={tag.color} bg={tag.bg} border={tag.border} />)}
          {!race.isPrimary && !isPast && <Tag text="B Race" color="var(--text3)" bg="var(--bg3)" border="var(--border)" />}
        </div>
      </div>

      {isExpanded && (
        <div>
          <div style={{ height: "0.5px", background: "var(--border)", margin: "0 16px" }} />
          <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>Event Type</p>
              <p style={{ fontSize: "13px", color: "var(--text)", fontWeight: 600 }}>Running</p>
            </div>
            <div>
              <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>Date</p>
              <p style={{ fontSize: "13px", color: "var(--text)", fontWeight: 600 }}>{formatDate(race.date)}</p>
            </div>
            {race.location && (
              <div>
                <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>Location</p>
                <p style={{ fontSize: "13px", color: "var(--text)", fontWeight: 600 }}>{race.location}</p>
              </div>
            )}
            <div>
              <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>Distance</p>
              <p style={{ fontSize: "13px", color: "var(--text)", fontWeight: 600 }}>{race.distance}</p>
            </div>
            {race.surface && (
              <div>
                <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>Surface</p>
                <p style={{ fontSize: "13px", color: "var(--text)", fontWeight: 600 }}>{race.surface}</p>
              </div>
            )}
            {race.temp && (
              <div>
                <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>Avg Temp</p>
                <p style={{ fontSize: "13px", color: "var(--text)", fontWeight: 600 }}>{race.temp}</p>
              </div>
            )}
          </div>

          {intelTags.length > 0 && (
            <div>
              <div style={{ height: "0.5px", background: "var(--border)", margin: "0 16px" }} />
              <div style={{ padding: "12px 16px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {intelTags.map((t, j) => <Tag key={j} text={t} color="var(--text2)" bg="var(--bg3)" border="var(--border)" />)}
              </div>
            </div>
          )}

          {race.snippet && (
            <div>
              <div style={{ height: "0.5px", background: "var(--border)", margin: "0 16px" }} />
              <div style={{ padding: "12px 16px" }}>
                <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Course Notes</p>
                <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.6 }}>{race.snippet}</p>
              </div>
            </div>
          )}

          {race.url && (
            <div>
              <div style={{ height: "0.5px", background: "var(--border)", margin: "0 16px" }} />
              <div style={{ padding: "12px 16px" }}>
                <a href={race.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(31,204,138,0.06)", border: "0.5px solid rgba(31,204,138,0.2)", borderRadius: "10px", padding: "11px 14px", textDecoration: "none" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--green)" }}>Visit Race Website</p>
                    <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", marginTop: "1px" }}>{websiteDomain}</p>
                  </div>
                </a>
              </div>
            </div>
          )}

          <div style={{ height: "0.5px", background: "var(--border)", margin: "0 16px" }} />

          <div style={{ padding: "12px 16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {!isPast && !race.isPrimary && (
              <button onClick={onSetPrimary}
                style={{ flex: 1, background: "rgba(31,204,138,0.08)", border: "0.5px solid rgba(31,204,138,0.25)", borderRadius: "10px", padding: "10px", color: "var(--green)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Mono', monospace", minWidth: "100px" }}>
                Set as A Race
              </button>
            )}
            {!isPast && race.isPrimary && (
              <div style={{ flex: 1, background: "rgba(31,204,138,0.08)", border: "0.5px solid rgba(31,204,138,0.3)", borderRadius: "10px", padding: "10px", color: "var(--green)", fontSize: "12px", fontFamily: "'DM Mono', monospace", textAlign: "center", minWidth: "100px" }}>
                A Race (Primary)
              </div>
            )}
            <button onClick={onDelete}
              style={{ flex: 1, background: "rgba(224,82,82,0.1)", border: "0.5px solid rgba(224,82,82,0.3)", borderRadius: "10px", padding: "10px", color: "#e05252", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Mono', monospace", minWidth: "80px" }}>
              Delete
            </button>
            <button style={{ flex: 1, background: "var(--green)", border: "none", borderRadius: "10px", padding: "10px", color: "var(--green-text)", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'Syne', sans-serif", minWidth: "80px" }}>
              View Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RacesPage() {
  const [races, setRaces] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show localStorage races immediately — no hanging
    const local = getRaces();
    if (local.length > 0) {
      setRaces(local);
      setLoading(false);
    }

    // Safety timeout — never hang longer than 3 seconds
    const timeout = setTimeout(() => setLoading(false), 3000);

    // Then sync from Supabase in background
    loadRacesFromSupabase()
      .then(data => {
        setRaces(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => clearTimeout(timeout);
  }, []);

  const handleDelete = async (id: string) => {
    await deleteRace(id);
    const updated = await loadRacesFromSupabase();
    setRaces(updated);
    if (expandedId === id) setExpandedId(null);
  };

  const handleSetPrimary = async (id: string) => {
    await setPrimaryRace(id);
    const updated = await loadRacesFromSupabase();
    setRaces(updated);
  };

  const handleSaved = async () => {
    const updated = await loadRacesFromSupabase();
    setRaces(updated);
  };

  const allDays = races.map(r => getDaysUntil(r.date));
  const upcoming = races.filter((_, i) => allDays[i] >= 0).sort((a, b) => getDaysUntil(a.date) - getDaysUntil(b.date));
  const past = races.filter((_, i) => allDays[i] < 0).sort((a, b) => getDaysUntil(b.date) - getDaysUntil(a.date));

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ padding: "52px 16px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>Season 2026</p>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", marginTop: "4px" }}>My Races</h1>
        </div>
        <button onClick={() => setShowAdd(true)}
          style={{ background: "var(--green)", color: "var(--green-text)", fontWeight: 600, padding: "8px 16px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "13px", fontFamily: "'Syne', sans-serif" }}>
          + Add Race
        </button>
      </div>

      {loading && (
        <div style={{ padding: "40px 16px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>Loading races...</p>
        </div>
      )}

      {!loading && races.length === 0 && (
        <div style={{ padding: "60px 16px", textAlign: "center" }}>
          <p style={{ fontSize: "32px", marginBottom: "12px" }}>🏁</p>
          <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginBottom: "6px" }}>No races yet</p>
          <p style={{ fontSize: "13px", color: "var(--text3)" }}>Search for a race or add one manually to get started.</p>
        </div>
      )}

      <div style={{ padding: "0 16px 100px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {upcoming.map((race) => (
          <RaceCard key={race.id} race={race} isExpanded={expandedId === race.id}
            onToggle={() => setExpandedId(expandedId === race.id ? null : race.id)}
            onDelete={() => handleDelete(race.id)}
            onSetPrimary={() => handleSetPrimary(race.id)}
            isPast={false} />
        ))}

        {past.length > 0 && (
          <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "8px" }}>
            Past Races
          </p>
        )}

        {past.map((race) => (
          <RaceCard key={race.id} race={race} isExpanded={expandedId === race.id}
            onToggle={() => setExpandedId(expandedId === race.id ? null : race.id)}
            onDelete={() => handleDelete(race.id)}
            onSetPrimary={() => handleSetPrimary(race.id)}
            isPast={true} />
        ))}
      </div>

      <AddRaceModal isOpen={showAdd} onClose={() => setShowAdd(false)} onSaved={handleSaved} />
    </div>
  );
}