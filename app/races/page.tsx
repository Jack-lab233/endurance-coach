"use client";

import { useEffect, useState } from "react";
import AddRaceModal from "../components/AddRaceModal";
import { getRaces, deleteRace, Race } from "../lib/raceStore";

export default function RacesPage() {
  const [races, setRaces] = useState<Race[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    setRaces(getRaces());
  }, []);

  const refresh = () => {
    setRaces(getRaces());
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            color: "var(--text)",
            fontSize: "28px",
            fontWeight: 700,
          }}
        >
          My Races
        </h1>

        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: "var(--green)",
            border: "none",
            padding: "10px 16px",
            borderRadius: "10px",
            cursor: "pointer",
            color: "black",
            fontWeight: 700,
          }}
        >
          + Add Race
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {races.map((race) => (
          <div
            key={race.id}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "16px",
            }}
          >
            <h2
              style={{
                color: "var(--text)",
                marginBottom: "6px",
              }}
            >
              {race.name}
            </h2>

            <p style={{ color: "var(--text3)" }}>
              {race.date}
            </p>

            <p style={{ color: "var(--text3)" }}>
              {race.distance} · {race.surface}
            </p>

            {race.goalTime && (
              <p style={{ color: "var(--green)" }}>
                Goal: {race.goalTime}
              </p>
            )}

            <button
              onClick={() => {
                deleteRace(race.id);
                refresh();
              }}
              style={{
                marginTop: "12px",
                background: "#e05252",
                border: "none",
                padding: "8px 12px",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <AddRaceModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSaved={refresh}
      />
    </div>
  );
}