"use client";
import { useState, useEffect } from "react";
import AddRaceModal from "../components/AddRaceModal";
import { getRaces, deleteRace } from "../lib/raceStore";

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

function Tag({ text, color, bg, border }: { text: string; color: string; bg: string; border: string }) {
  return (
    <span style={{
      fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
      fontFamily: "'DM Mono', monospace",
      color, background: bg, border: "0.5px solid " + border,
    }}>
      {text}
    </span>
  );
}

function RaceCard({ race, isExpanded, onToggle, onDelete, isPast }: {
  race: any;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  isPast: boolean;
}) {
  const days = getDaysUntil(race.date);
  const absdays = Math.abs(days);

  let daysColor = "var(--green)";
  if (isPast) {
    daysColor = "var(--text3)";
  } else if (days < 15) {
    daysColor = "#e05252";
  }

  const dateLabel = formatDate(race.date);
  const locationLabel = race.location ? " · " + race.location : "";
  const dateDisplay = dateLabel + locationLabel;

  const mainTags: Array<{ text: string; color: string; bg: string; border: string }> = [];

  if (race.distance) {
    mainTags.push({ text: race.distance, color: "var(--text2)", bg: "var(--bg3)", border: "var(--border)" });
  }
  if (race.surface) {
    mainTags.push({ text: race.surface, color: "var(--text2)", bg: "var(--bg3)", border: "var(--border)" });
  }
  if (race.goalTime) {
    mainTags.push({ text: "Goal: " + race.goalTime, color: "var(--green)", bg: "var(--green-dim)", border: "rgba(31,204,138,0.2)" });
  }
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
    <div style={{
      background: "var(--bg2)",
      border: isExpanded ? "0.5px solid rgba(31,204,138,0.2)" : "0.5px solid var(--border)",
      borderRadius: "var(--radius)",
      overflow: "hidden",
      opacity: isPast ? 0.7 : 1,
    }}>

      <div onClick={onToggle} style={{ padding: "14px 16px", cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, paddingRight: "12px" }}>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
              {race.name}
            </p>
            <p style={{ fontSize: "12px", color: "var(--text2)", marginTop: "2px", fontFamily: "'DM Mono', monospace" }}>
              {dateDisplay}
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.03em", color: daysColor, lineHeight: 1 }}>
              {absdays}
            </p>
            <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>
              {isPast ? "days ago" : "days away"}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
          {mainTags.map((tag, j) => (
            <Tag key={j} text={tag.text} color={tag.color} bg={tag.bg} border={tag.border} />
          ))}
        </div>
      </div>

      {isExpanded && (
        <div>
          {intelTags.length > 0 && (
            <div>
              <div style={{ height: "0.5px", background: "var(--border)", margin: "0 16px" }} />
              <div style={{ padding: "12px 16px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {intelTags.map((t, j) => (
                  <Tag key={j} text={t} color="var(--text2)" bg="var(--bg3)" border="var(--border)" />
                ))}
              </div>
            </div>
          )}

          {race.snippet && (
            <div>
              <div style={{ height: "0.5px", background: "var(--border)", margin: "0 16px" }} />
              <div style={{ padding: "12px 16px" }}>
                <p style={{
                  fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace",
                  textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px",
                }}>
                  Course Notes
                </p>
                <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.6 }}>
                  {race.snippet}
                </p>
              </div>
            </div>
          )}

          {race.url && (
            <div>
              <div style={{ height: "0.5px", background: "var(--border)", margin: "0 16px" }} />
              <div style={{ padding: "12px 16px" }}>
                <a
                  href={race.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    background: "rgba(31,204,138,0.06)",
                    border: "0.5px solid rgba(31,204,138,0.2)",
                    borderRadius: "10px", padding: "11px 14px",
                    textDecoration: "none",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--green)" }}>
                      Visit Race Website
                    </p>
                    <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", marginTop: "1px" }}>
                      {websiteDomain}
                    </p>
                  </div>
                </a>
              </div>
            </div>
          )}

          <div style={{ height: "0.5px", background: "var(--border)", margin: "0 16px" }} />

          <div style={{ padding: "12px 16px", display: "flex", gap: "8px" }}>
            <button
              onClick={onDelete}
              style={{
                flex: 1, background: "rgba(224,82,82,0.1)",
                border: "0.5px solid rgba(224,82,82,0.3)",
                borderRadius: "10px", padding: "10px",
                color: "#e05252", fontSize: "13px",
                cursor: "pointer", fontFamily: "'DM Mono', monospace",
              }}
            >
              Delete Race
            </button>
            <button style={{
              flex: 1, background: "var(--green)", border: "none",
              borderRadius: "10px", padding: "10px",
              color: "var(--green-text)", fontSize: "13px",
              fontWeight: 600, cursor: "pointer",
              fontFamily: "'Syne', sans-serif",
            }}>
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

  useEffect(() => {
    setRaces(getRaces());
  }, []);

  const handleDelete = (id: string) => {
    deleteRace(id);
    setRaces(getRaces());
    if (expandedId === id) setExpandedId(null);
  };

  const handleSaved = () => setRaces(getRaces());

  const allDays = races.map(r => getDaysUntil(r.date));
  const upcoming = races.filter((_, i) => allDays[i] >= 0).sort((a, b) => getDaysUntil(a.date) - getDaysUntil(b.date));
  const past = races.filter((_, i) => allDays[i] < 0).sort((a, b) => getDaysUntil(b.date) - getDaysUntil(a.date));

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{
        padding: "52px 16px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      }}>
        <div>
          <p style={{
            fontSize: "12px", color: "var(--text3)",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            Season 2026
          </p>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", marginTop: "4px" }}>
            My Races
          </h1>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: "var(--green)", color: "var(--green-text)",
            fontWeight: 600, padding: "8px 16px", borderRadius: "10px",
            border: "none", cursor: "pointer", fontSize: "13px",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          + Add Race
        </button>
      </div>

      {races.length === 0 && (
        <div style={{ padding: "60px 16px", textAlign: "center" }}>
          <p style={{ fontSize: "32px", marginBottom: "12px" }}>🏁</p>
          <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginBottom: "6px" }}>No races yet</p>
          <p style={{ fontSize: "13px", color: "var(--text3)" }}>Search for a race or add one manually to get started.</p>
        </div>
      )}

      <div style={{ padding: "0 16px 100px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {upcoming.map((race) => (
          <RaceCard
            key={race.id}
            race={race}
            isExpanded={expandedId === race.id}
            onToggle={() => setExpandedId(expandedId === race.id ? null : race.id)}
            onDelete={() => handleDelete(race.id)}
            isPast={false}
          />
        ))}

        {past.length > 0 && (
          <p style={{
            fontSize: "11px", color: "var(--text3)",
            fontFamily: "'DM Mono', monospace",
            textTransform: "uppercase", letterSpacing: "0.06em",
            marginTop: "8px",
          }}>
            Past Races
          </p>
        )}

        {past.map((race) => (
          <RaceCard
            key={race.id}
            race={race}
            isExpanded={expandedId === race.id}
            onToggle={() => setExpandedId(expandedId === race.id ? null : race.id)}
            onDelete={() => handleDelete(race.id)}
            isPast={true}
          />
        ))}
      </div>

      <AddRaceModal isOpen={showAdd} onClose={() => setShowAdd(false)} onSaved={handleSaved} />
    </div>
  );
}