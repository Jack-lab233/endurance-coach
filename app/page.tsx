"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatCard from "./components/StatCard";
import { getRaces, loadRacesFromSupabase, Race } from "./lib/raceStore";

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
  today.setHours(0, 0, 0, 0);
  return Math.ceil((race.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const formatRaceDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-ZA", { month: "short", day: "numeric" });
};

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}:${m.toString().padStart(2, "0")}` : `${m}m`;
};

interface StravaStats {
  weeklyKm: number;
  weeklyDuration: number;
  weeklyElevation: number;
  avgPace: string | null;
  thisWeekCount: number;
  lastRun: any;
}

export default function Home() {
  const [name, setName] = useState("Athlete");
  const [mounted, setMounted] = useState(false);
  const [races, setRaces] = useState<Race[]>([]);
  const [strava, setStrava] = useState<StravaStats | null>(null);
  const [stravaLoading, setStravaLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const savedName = localStorage.getItem("userName");
    if (savedName) setName(savedName);

    // Load races
    setRaces(getRaces());
    loadRacesFromSupabase().then(setRaces);

    // Load Strava stats
    fetch("/api/strava/activities")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStrava(data);
      })
      .catch(() => {})
      .finally(() => setStravaLoading(false));
  }, []);

  const upcomingRaces = races
    .filter(r => getDaysUntil(r.date) > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const primaryRace = races.find(r => r.isPrimary) || upcomingRaces[0] || null;

  // Last run summary for "Today" card
  const lastRun = strava?.lastRun;
  const lastRunName = lastRun?.name || "No recent run";
  const lastRunKm = lastRun ? (lastRun.distance / 1000).toFixed(1) : null;
  const lastRunPace = lastRun?.average_speed > 0
    ? (() => {
        const s = 1000 / lastRun.average_speed;
        return `${Math.floor(s / 60)}:${Math.round(s % 60).toString().padStart(2, "0")}`;
      })()
    : null;
  const lastRunDate = lastRun
    ? new Date(lastRun.start_date).toLocaleDateString("en-ZA", { weekday: "short", month: "short", day: "numeric" })
    : null;

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
        {primaryRace && mounted && (
          <p style={{ fontSize: "13px", color: "var(--text3)", marginTop: "4px", fontFamily: "'DM Mono', monospace" }}>
            <span style={{ color: "var(--green)", fontWeight: 600 }}>{getDaysUntil(primaryRace.date)} days</span>
            {" "}until {primaryRace.name}
          </p>
        )}
      </div>

      {/* This Week Stats — real Strava data */}
      <div style={{ padding: "0 16px", marginBottom: "10px" }}>
        <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>
          This Week
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <StatCard
            label="Distance"
            value={stravaLoading ? "—" : strava ? strava.weeklyKm.toString() : "—"}
            unit="km"
            delta={strava && strava.thisWeekCount > 0 ? `${strava.thisWeekCount} run${strava.thisWeekCount > 1 ? "s" : ""} this week` : undefined}
            deltaUp={true}
          />
          <StatCard
            label="Duration"
            value={stravaLoading ? "—" : strava ? formatDuration(strava.weeklyDuration) : "—"}
            unit="hr"
          />
          <StatCard
            label="Elevation"
            value={stravaLoading ? "—" : strava ? strava.weeklyElevation.toString() : "—"}
            unit="m"
          />
          <StatCard
            label="Avg Pace"
            value={stravaLoading ? "—" : strava?.avgPace || "—"}
            unit="/km"
          />
        </div>
        {!stravaLoading && !strava && (
          <p
            onClick={() => router.push("/profile")}
            style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", marginTop: "8px", cursor: "pointer", textAlign: "center" }}
          >
            Connect Strava to see real stats →
          </p>
        )}
      </div>

      {/* Last Run */}
      {strava && lastRun && (
        <div style={{ margin: "0 16px 10px", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 16px" }}>
          <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>
            Last Run
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)" }}>{lastRunName}</p>
              <p style={{ fontSize: "13px", color: "var(--text2)", marginTop: "3px", fontFamily: "'DM Mono', monospace" }}>
                {lastRunKm}km
                {lastRunPace ? ` · ${lastRunPace}/km` : ""}
                {lastRun.total_elevation_gain ? ` · ${Math.round(lastRun.total_elevation_gain)}m ↑` : ""}
              </p>
              <p style={{ fontSize: "12px", color: "var(--text3)", marginTop: "3px", fontFamily: "'DM Mono', monospace" }}>{lastRunDate}</p>
            </div>
            <span style={{ fontSize: "11px", color: "var(--green)", background: "var(--green-dim)", padding: "4px 10px", borderRadius: "20px", fontFamily: "'DM Mono', monospace" }}>
              done
            </span>
          </div>
        </div>
      )}

      {/* No Strava — show placeholder workout card */}
      {!strava && !stravaLoading && (
        <div style={{ margin: "0 16px 10px", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 16px" }}>
          <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>
            Today
          </p>
          <p style={{ fontSize: "13px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>
            Connect Strava to see your training here.
          </p>
          <button
            onClick={() => router.push("/profile")}
            style={{ marginTop: "12px", padding: "10px 16px", borderRadius: "10px", border: "none", background: "var(--green)", color: "var(--green-text)", fontWeight: 600, cursor: "pointer", fontSize: "13px", fontFamily: "'Syne', sans-serif" }}
          >
            Connect Strava →
          </button>
        </div>
      )}

      {/* Upcoming Races */}
      <div style={{ margin: "0 16px 10px" }}>
        <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>
          Upcoming Races
        </p>
        {upcomingRaces.length === 0 ? (
          <div
            onClick={() => router.push("/races")}
            style={{ background: "var(--bg2)", border: "0.5px dashed var(--border)", borderRadius: "var(--radius)", padding: "16px", textAlign: "center", cursor: "pointer" }}
          >
            <p style={{ fontSize: "13px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>No races added yet</p>
            <p style={{ fontSize: "12px", color: "var(--green)", marginTop: "4px" }}>+ Add a race →</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {upcomingRaces.map((race) => (
              <div
                key={race.id}
                onClick={() => router.push("/races")}
                style={{
                  background: race.isPrimary ? "rgba(31,204,138,0.05)" : "var(--bg2)",
                  border: race.isPrimary ? "0.5px solid rgba(31,204,138,0.2)" : "0.5px solid var(--border)",
                  borderRadius: "var(--radius)", padding: "12px 16px",
                  display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>{race.name}</p>
                    {race.isPrimary && (
                      <span style={{ fontSize: "9px", color: "var(--green)", background: "var(--green-dim)", padding: "2px 6px", borderRadius: "10px", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        A Race
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text2)", marginTop: "2px", fontFamily: "'DM Mono', monospace" }}>
                    {formatRaceDate(race.date)} · {race.surface}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: race.isPrimary ? "var(--green)" : "var(--text)", lineHeight: 1 }}>
                    {mounted ? getDaysUntil(race.date) : "—"}
                  </p>
                  <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>days</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coach note */}
      <div style={{ margin: "0 16px 20px", background: "var(--bg2)", border: "0.5px solid rgba(31,204,138,0.2)", borderRadius: "var(--radius)", padding: "14px 16px" }}>
        <p style={{ fontSize: "10px", color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>
          Coach Note
        </p>
        <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.6 }}>
          {strava && strava.weeklyKm > 0
            ? `You've covered ${strava.weeklyKm}km this week across ${strava.thisWeekCount} run${strava.thisWeekCount > 1 ? "s" : ""}. ${strava.avgPace ? `Average pace ${strava.avgPace}/km.` : ""} Keep it up.`
            : "Add your races and connect Strava to get personalised coaching notes here."
          }
        </p>
      </div>

    </div>
  );
}