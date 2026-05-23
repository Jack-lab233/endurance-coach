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
}

export default function AddRaceModal({
  isOpen,
  onClose,
  onSaved,
}: Props) {
  const [mode, setMode] = useState<"search" | "manual">("search");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<FoundRace[]>([]);
  const [selected, setSelected] = useState<FoundRace | null>(null);
  const [searchError, setSearchError] = useState("");

  const [form, setForm] = useState({
    name: "",
    date: "",
    distance: "Marathon",
    surface: "Road",
    goalTime: "",
    location: "",
  });

  const handleSearch = async () => {
    if (!query.trim()) return;

    setSearching(true);
    setSearchError("");
    setResults([]);

    try {
      const res = await fetch("/api/search-race", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (data.error) {
        setSearchError("Search failed.");
      } else {
        setResults(data.races || []);
      }
    } catch {
      setSearchError("Search failed.");
    }

    setSearching(false);
  };

  const handleSelectRace = (race: FoundRace) => {
    setSelected(race);

    setForm({
      name: race.name,
      date: race.date || "",
      distance: race.distance,
      surface: race.surface,
      goalTime: "",
      location: race.location || "",
    });
  };

  const handleSave = () => {
    if (!form.name || !form.date) return;

    saveRace({
      id: Date.now().toString(),
      name: form.name,
      date: form.date,
      distance: form.distance,
      surface: form.surface,
      goalTime: form.goalTime,
      location: form.location,
    });

    onSaved();
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Add Race">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {/* Mode Toggle */}
        <div
          style={{
            display: "flex",
            background: "var(--bg3)",
            borderRadius: "10px",
            padding: "3px",
          }}
        >
          {(["search", "manual"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: mode === m ? "var(--bg2)" : "transparent",
                color: mode === m ? "var(--text)" : "var(--text3)",
              }}
            >
              {m === "search" ? "Search Race" : "Manual"}
            </button>
          ))}
        </div>

        {/* SEARCH MODE */}
        {mode === "search" && !selected && (
          <>
            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <input
                type="text"
                placeholder="Cape Town Marathon 2026"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--bg3)",
                  color: "var(--text)",
                }}
              />

              <button
                onClick={handleSearch}
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background: "var(--green)",
                  color: "black",
                  cursor: "pointer",
                }}
              >
                {searching ? "..." : "Search"}
              </button>
            </div>

            {searchError && (
              <p style={{ color: "#e05252" }}>{searchError}</p>
            )}

            {results.map((race) => (
              <button
                key={race.id}
                onClick={() => handleSelectRace(race)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "12px",
                  cursor: "pointer",
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  {race.name}
                </p>

                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text3)",
                  }}
                >
                  {race.distance} · {race.surface}
                </p>
              </button>
            ))}
          </>
        )}

        {/* SELECTED RACE */}
        {selected && (
          <>
            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                background: "var(--bg3)",
              }}
            >
              <p
                style={{
                  fontWeight: 700,
                  color: "var(--text)",
                }}
              >
                {selected.name}
              </p>

              {selected.url && (
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--green)",
                    fontSize: "12px",
                  }}
                >
                  Visit race website →
                </a>
              )}
            </div>

            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({
                  ...form,
                  date: e.target.value,
                })
              }
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "var(--bg3)",
                color: "var(--text)",
              }}
            />

            <button
              onClick={handleSave}
              style={{
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: "var(--green)",
                color: "black",
                cursor: "pointer",
              }}
            >
              Add Race
            </button>
          </>
        )}

        {/* MANUAL MODE */}
        {mode === "manual" && (
          <>
            <input
              type="text"
              placeholder="Race Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "var(--bg3)",
                color: "var(--text)",
              }}
            />

            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({
                  ...form,
                  date: e.target.value,
                })
              }
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "var(--bg3)",
                color: "var(--text)",
              }}
            />

            <button
              onClick={handleSave}
              style={{
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: "var(--green)",
                color: "black",
                cursor: "pointer",
              }}
            >
              Add Race
            </button>
          </>
        )}
      </div>
    </BottomSheet>
  );
}