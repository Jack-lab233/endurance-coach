"use client";
import { useState } from "react";
import BottomSheet from "./BottomSheet";
import { saveRace } from "../lib/raceStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

interface FoundRace {
  id: string;
  name: string;
  url: string;
  snippet: string;
  distance: string;
  surface: string;
  difficulty: string;
  difficultyColor: string;
  elevation: string | null;
  cutoff: string | null;
  temp: string | null;
  aidStations: number | null;
  location: string;
  date: string;
  goalTime: string;
  courseNotes: string | null;
}

export default function AddRaceModal({ isOpen, onClose, onSaved }: Props) {
  const [mode, setMode] = useState<"search" | "manual">("search");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<FoundRace[]>([]);
  const [selected, setSelected] = useState<FoundRace | null>(null);
  const [searchError, setSearchError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: "", date: "", distance: "Marathon",
    surface: "Road", goalTime: "", location: "",
  });

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSearchError("");
    setResults([]);

    try {
      const res = await fetch("/api/search-race", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.error) {
        setSearchError("Search failed. Try again or add manually.");
      } else if (!data.races || data.races.length === 0) {
        setSearchError("No races found. Try a different search or add manually.");
      } else {
        setResults(data.races);
      }
    } catch {
      setSearchError("Search failed. Check your connection.");
    }
    setSearching(false);
  };

  const handleSelectRace = (race: FoundRace) => {
    setSelected(race);
    setForm({
      name: race.name,
      date: race.date || "",
      distance: race.distance || "Marathon",
      surface: race.surface || "Road",
      goalTime: "",
      location: race.location || "",
    });
  };

  const handleSave = async () => {
    if (!form.name || !form.date) return;
    setSaving(true);

    await saveRace({
      id: crypto.randomUUID(),
      name: form.name,
      date: form.date,
      distance: form.distance,
      surface: form.surface,
      goalTime: form.goalTime,
      location: form.location,
      url: selected?.url || null,
      elevation: selected?.elevation || null,
      cutoff: selected?.cutoff || null,
      temp: selected?.temp || null,
      aidStations: selected?.aidStations || null,
      difficulty: selected?.difficulty || null,
      difficultyColor: selected?.difficultyColor || null,
      snippet: selected?.snippet || null,
      courseNotes: selected?.courseNotes || null,
    });

    setSaved(true);
    setSaving(false);

    setTimeout(() => {
      setSaved(false);
      setQuery("");
      setResults([]);
      setSelected(null);
      setSearchError("");
      setForm({ name: "", date: "", distance: "Marathon", surface: "Road", goalTime: "", location: "" });
      setMode("search");
      onSaved();
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    setQuery("");
    setResults([]);
    setSelected(null);
    setSearchError("");
    setMode("search");
    setForm({ name: "", date: "", distance: "Marathon", surface: "Road", goalTime: "", location: "" });
    onClose();
  };

  // Parse bullet points into an array for clean rendering
  const parseCourseNotes = (notes: string): string[] => {
    return notes
      .split("\n")
      .map(line => line.replace(/^[•\-\*]\s*/, "").trim())
      .filter(line => line.length > 0);
  };

  if (saved) {
    return (
      <BottomSheet isOpen={isOpen} onClose={handleClose} title="Add Race">
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <p style={{ fontSize: "36px", marginBottom: "12px" }}>🏁</p>
          <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--green)" }}>Race added!</p>
          <p style={{ fontSize: "13px", color: "var(--text2)", marginTop: "6px" }}>
            Your training plan will be built around this race.
          </p>
        </div>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="Add Race">
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

        {/* Mode toggle */}
        <div style={{ display: "flex", background: "var(--bg3)", borderRadius: "10px", padding: "3px" }}>
          {(["search", "manual"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setSelected(null); setResults([]); setSearchError(""); }}
              style={{
                flex: 1, padding: "8px", borderRadius: "8px", border: "none",
                cursor: "pointer", fontSize: "13px", fontWeight: 600,
                fontFamily: "'DM Mono', monospace",
                background: mode === m ? "var(--bg2)" : "transparent",
                color: mode === m ? "var(--text)" : "var(--text3)",
              }}
            >
              {m === "search" ? "Search Race" : "Add Manually"}
            </button>
          ))}
        </div>

        {/* SEARCH MODE — results list */}
        {mode === "search" && !selected && (
          <>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="e.g. Knysna Forest Marathon 2026"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{
                  flex: 1, padding: "12px 14px", borderRadius: "10px",
                  border: "0.5px solid var(--border)", background: "var(--bg3)",
                  color: "var(--text)", fontSize: "14px", outline: "none",
                  fontFamily: "'Syne', sans-serif",
                }}
              />
              <button
                onClick={handleSearch}
                disabled={searching}
                style={{
                  padding: "12px 16px", borderRadius: "10px", border: "none",
                  background: "var(--green)", color: "var(--green-text)",
                  fontWeight: 600, cursor: searching ? "not-allowed" : "pointer",
                  fontSize: "13px", fontFamily: "'Syne', sans-serif",
                  opacity: searching ? 0.6 : 1,
                }}
              >
                {searching ? "..." : "Search"}
              </button>
            </div>

            {searching && (
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <p style={{ fontSize: "13px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>
                  Searching for race...
                </p>
                <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", marginTop: "4px", opacity: 0.6 }}>
                  AI is researching course details too — this takes ~15s
                </p>
              </div>
            )}

            {searchError && (
              <p style={{ fontSize: "13px", color: "#e05252", fontFamily: "'DM Mono', monospace" }}>
                {searchError}
              </p>
            )}

            {results.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Tap a race to select it
                </p>
                {results.map((race) => (
                  <button
                    key={race.id}
                    onClick={() => handleSelectRace(race)}
                    style={{
                      width: "100%", textAlign: "left",
                      background: "var(--bg3)", border: "0.5px solid var(--border)",
                      borderRadius: "12px", padding: "12px 14px", cursor: "pointer",
                    }}
                  >
                    <p style={{ fontWeight: 700, color: "var(--text)", fontSize: "14px", marginBottom: "3px" }}>
                      {race.name}
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>
                      {race.distance} · {race.surface}
                      {race.date ? " · " + race.date : ""}
                    </p>
                    {race.snippet && (
                      <p style={{ fontSize: "12px", color: "var(--text2)", marginTop: "6px", lineHeight: 1.5 }}>
                        {race.snippet}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* SELECTED RACE — confirm and fill in details */}
        {mode === "search" && selected && (
          <>
            <button
              onClick={() => setSelected(null)}
              style={{
                background: "none", border: "none", color: "var(--text3)",
                fontSize: "12px", fontFamily: "'DM Mono', monospace",
                cursor: "pointer", textAlign: "left", padding: 0,
              }}
            >
              ← Back to results
            </button>

            <div style={{
              background: "rgba(31,204,138,0.06)",
              border: "0.5px solid rgba(31,204,138,0.2)",
              borderRadius: "12px", padding: "12px 14px",
            }}>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)", marginBottom: "4px" }}>
                {selected.name}
              </p>
              <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>
                {selected.distance} · {selected.surface}
              </p>
              {selected.url && (
                <a href={selected.url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: "12px", color: "var(--green)", display: "inline-block", marginTop: "6px" }}>
                  Visit race website ↗
                </a>
              )}
            </div>

            {/* AI Course Notes */}
            {selected.courseNotes && (
              <div style={{
                background: "rgba(31,204,138,0.04)",
                border: "0.5px solid rgba(31,204,138,0.15)",
                borderRadius: "12px", padding: "14px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13px" }}>🤖</span>
                  <p style={{
                    fontSize: "10px", color: "var(--green)", fontFamily: "'DM Mono', monospace",
                    textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600,
                  }}>
                    AI Course Intelligence
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {parseCourseNotes(selected.courseNotes).map((note, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                      <span style={{
                        color: "var(--green)", fontSize: "12px", marginTop: "1px",
                        flexShrink: 0, fontFamily: "'DM Mono', monospace",
                      }}>
                        •
                      </span>
                      <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.55, margin: 0 }}>
                        {note}
                      </p>
                    </div>
                  ))}
                </div>
                <p style={{
                  fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace",
                  marginTop: "10px", opacity: 0.7,
                }}>
                  Generated from web research — verify with official race info
                </p>
              </div>
            )}

            {/* Date */}
            <div>
              <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                Race Date {!selected.date && "(not found — please enter)"}
              </p>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: "10px",
                  border: form.date ? "0.5px solid rgba(31,204,138,0.3)" : "0.5px solid var(--border)",
                  background: "var(--bg3)", color: "var(--text)",
                  fontSize: "14px", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            {/* Goal time */}
            <div>
              <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                Goal Time (optional)
              </p>
              <input
                type="text"
                placeholder="3:45:00"
                value={form.goalTime}
                onChange={(e) => setForm({ ...form, goalTime: e.target.value })}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: "10px",
                  border: "0.5px solid var(--border)", background: "var(--bg3)",
                  color: "var(--text)", fontSize: "14px", outline: "none",
                  fontFamily: "'Syne', sans-serif", boxSizing: "border-box",
                }}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !form.date}
              style={{
                width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                background: form.date ? "var(--green)" : "var(--bg3)",
                color: form.date ? "var(--green-text)" : "var(--text3)",
                fontWeight: 700, cursor: form.date ? "pointer" : "not-allowed",
                fontSize: "15px", fontFamily: "'Syne', sans-serif",
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? "Adding..." : "Add Race"}
            </button>
          </>
        )}

        {/* MANUAL MODE */}
        {mode === "manual" && (
          <>
            {[
              { label: "Race Name *", key: "name", type: "text", placeholder: "Cape Town Marathon" },
              { label: "Date *", key: "date", type: "date", placeholder: "" },
              { label: "Location", key: "location", type: "text", placeholder: "Cape Town City Centre" },
              { label: "Goal Time", key: "goalTime", type: "text", placeholder: "3:45:00" },
            ].map((field) => (
              <div key={field.key}>
                <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                  {field.label}
                </p>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: "10px",
                    border: "0.5px solid var(--border)", background: "var(--bg3)",
                    color: "var(--text)", fontSize: "14px", outline: "none",
                    fontFamily: "'Syne', sans-serif", boxSizing: "border-box",
                  }}
                />
              </div>
            ))}

            <div>
              <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                Distance
              </p>
              <select
                value={form.distance}
                onChange={(e) => setForm({ ...form, distance: e.target.value })}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: "10px",
                  border: "0.5px solid var(--border)", background: "var(--bg3)",
                  color: "var(--text)", fontSize: "14px", outline: "none",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {["5km", "10km", "Half Marathon", "Marathon", "50km", "100km", "Other"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                Surface
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                {["Road", "Trail", "Track", "Mixed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm({ ...form, surface: s })}
                    style={{
                      flex: 1, padding: "10px 0", borderRadius: "10px",
                      border: "0.5px solid",
                      borderColor: form.surface === s ? "var(--green)" : "var(--border)",
                      background: form.surface === s ? "var(--green-dim)" : "var(--bg3)",
                      color: form.surface === s ? "var(--green)" : "var(--text2)",
                      fontSize: "12px", cursor: "pointer",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !form.name || !form.date}
              style={{
                width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                background: form.name && form.date ? "var(--green)" : "var(--bg3)",
                color: form.name && form.date ? "var(--green-text)" : "var(--text3)",
                fontWeight: 700, cursor: form.name && form.date ? "pointer" : "not-allowed",
                fontSize: "15px", fontFamily: "'Syne', sans-serif",
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? "Adding..." : "Add Race"}
            </button>
          </>
        )}
      </div>
    </BottomSheet>
  );
}