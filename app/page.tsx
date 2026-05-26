"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatCard from "./components/StatCard";
import { getRaces, loadRacesFromSupabase, Race } from "./lib/raceStore";
import { supabase } from "./lib/supabase";

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

const formatPace = (secondsPerKm: number) => {
  const m = Math.floor(secondsPerKm / 60);
  const s = Math.round(secondsPerKm % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}:${m.toString().padStart(2, "0")}` : `${m}m`;
};

interface ManualRun {
  id: string;
  date: string;
  distance_km: number;
  duration_minutes: number;
  avg_pace_seconds: number | null;
  feel: number;
  notes: string;
  type: string;
  source: string;
  created_at: string;
}

function getThisWeekStats(runs: ManualRun[]) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));

  const thisWeek = runs.filter(r => new Date(r.date) >= startOfWeek);
  const totalKm = thisWeek.reduce((sum, r) => sum + r.distance_km, 0);
  const totalMinutes = thisWeek.reduce((sum, r) => sum + r.duration_minutes, 0);
  const runsWithPace = thisWeek.filter(r => r.avg_pace_seconds);
  const avgPaceSeconds = runsWithPace.length > 0
    ? runsWithPace.reduce((sum, r) => sum + (r.avg_pace_seconds || 0), 0) / runsWithPace.length
    : null;

  return { totalKm: Math.round(totalKm * 10) / 10, totalMinutes, runCount: thisWeek.length, avgPaceSeconds };
}

export default function Home() {
  const [name, setName] = useState("");
  const [mounted, setMounted] = useState(false);
  const [races, setRaces] = useState<Race[]>([]);
  const [manualRuns, setManualRuns] = useState<ManualRun[]>([]);
  const [strava, setStrava] = useState<any>(null);
  const [stravaLoading, setStravaLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check auth first — redirect to login if not logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/auth");
        return;
      }
      setAuthChecked(true);

      setMounted(true);
      const savedName = localStorage.getItem("userName") || "";
      setName(savedName);

      const stored = JSON.parse(localStorage.getItem("manual_runs") || "[]");
      setManualRuns(stored);

      setRaces(getRaces());
      loadRacesFromSupabase().then(setRaces);

      fetch("/api/strava/activities")
        .then(res => res.json())
        .then(data => { if (!data.error) setStrava(data); })
        .catch(() => {})
        .finally(() => setStravaLoading(false));
    });
  }, [router]);

  // Show nothing while checking auth (prevents flash)
  if (!authChecked) return null;

  const upcomingRaces = races
    .filter(r => getDaysUntil(r.date) > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const primaryRace = races.find(r => r.isPrimary) || upcomingRaces[0] || null;

  const weekStats = getThisWeekStats(manualRuns);
  const hasActivity = strava || weekStats.runCount > 0;

  const displayKm = strava ? strava.weeklyKm : weekStats.totalKm > 0 ? weekStats.totalKm.toString() : "0";
  const displayDuration = strava ? formatDuration(strava.weeklyDuration) : weekStats.totalMinutes > 0 ? formatDuration(weekStats.totalMinutes) : "0";
  const displayElevation = strava ? strava.weeklyElevation.toString() : "—";
  const displayPace = strava ? strava.avgPace : weekStats.avgPaceSeconds ? formatPace(weekStats.avgPaceSeconds) : "—";
  const displayCount = strava ? strava.thisWeekCount : weekStats.runCount;

  const lastManualRun = manualRuns[0] || null;
  const lastRun = strava?.lastRun || null;

  const lastRunName = lastRun?.name || (lastManualRun ? `${lastManualRun.type.charAt(0).toUpperCase() + lastManualRun.type.slice(1)} Run` : null);
  const lastRunKm = lastRun ? (lastRun.distance / 1000).toFixed(1) : lastManualRun?.distance_km.toFixed(1);
  const lastRunPace = lastRun?.average_speed > 0
    ? (() => { const s = 1000 / lastRun.average_speed; return `${Math.floor(s / 60)}:${Math.round(s % 60).toString().padStart(2, "0")}`; })()
    : lastManualRun?.avg_pace_seconds ? formatPace(lastManualRun.avg_pace_seconds) : null;
  const lastRunDate = lastRun
    ? new Date(lastRun.start_date).toLocaleDateString("en-ZA", { weekday: "short", month: "short", day: "numeric" })
    : lastManualRun?.date
      ? new Date(lastManualRun.date).toLocaleDateString("en-ZA", { weekday: "short", month: "short", day: "numeric" })
      : null;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: "100px" }}>

      {/* Header */}
      <div style={{ padding: "52px 16px 16px" }}>
        <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {mounted ? getDate() : ""}
        </p>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", marginTop: "4px" }}>
          {mounted ? `${getGreeting()}${name ? `, ${name}` : ""}` : "Good morning"}
        </h1>
        {primaryRace && mounted && (
          <p style={{ fontSize: "13px", color: "var(--text3)", marginTop: "4px", fontFamily: "'DM Mono', monospace" }}>
            <span style={{ color: "var(--green)", fontWeight: 600 }}>{getDaysUntil(primaryRace.date)} days</span>
            {" "}until {primaryRace.name}
          </p>
        )}
      </div>

      {/* This Week Stats */}
      <div style={{ padding: "0 16px", marginBottom: "10px" }}>
        <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>
          This Week
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <StatCard label="Distance" value={stravaLoading ? "—" : displayKm.toString()} unit="km"
            delta={!stravaLoading && displayCount > 0 ? `${displayCount} run${displayCount > 1 ? "s" : ""} this week` : undefined} deltaUp={true} />
          <StatCard label="Duration" value={stravaLoading ? "—" : displayDuration} unit="" />
          <StatCard label="Elevation" value={stravaLoading ? "—" : displayElevation} unit="m" />
          <StatCard label="Avg Pace" value={stravaLoading ? "—" : displayPace} unit="/km" />
        </div>

        {!stravaLoading && !hasActivity && mounted && (
          <div style={{ marginTop: "10px", background: "var(--bg2)", border: "0.5px dashed var(--border)", borderRadius: "var(--radius)", padding: "14px 16px", textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>No runs logged this week</p>
            <p style={{ fontSize: "12px", color: "var(--green)", marginTop: "4px" }}>Tap + to log your first run →</p>
          </div>
        )}
      </div>

      {/* Last Run */}
      {lastRunName && (
        <div style={{ margin: "0 16px 10px", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 16px" }}>
          <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>
            Last Run
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)" }}>{lastRunName}</p>
              <p style={{ fontSize: "13px", color: "var(--text2)", marginTop: "3px", fontFamily: "'DM Mono', monospace" }}>
                {lastRunKm}km{lastRunPace ? ` · ${lastRunPace}/km` : ""}
              </p>
              {lastRunDate && <p style={{ fontSize: "12px", color: "var(--text3)", marginTop: "3px", fontFamily: "'DM Mono', monospace" }}>{lastRunDate}</p>}
            </div>
            <span style={{ fontSize: "11px", color: "var(--green)", background: "var(--green-dim)", padding: "4px 10px", borderRadius: "20px", fontFamily: "'DM Mono', monospace" }}>
              done
            </span>
          </div>
        </div>
      )}

      {/* Upcoming Races */}
      <div style={{ margin: "0 16px 10px" }}>
        <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>
          Upcoming Races
        </p>
        {upcomingRaces.length === 0 ? (
          <div onClick={() => router.push("/races")}
            style={{ background: "var(--bg2)", border: "0.5px dashed var(--border)", borderRadius: "var(--radius)", padding: "16px", textAlign: "center", cursor: "pointer" }}>
            <p style={{ fontSize: "13px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>No races added yet</p>
            <p style={{ fontSize: "12px", color: "var(--green)", marginTop: "4px" }}>+ Add a race →</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {upcomingRaces.map((race) => (
              <div key={race.id} onClick={() => router.push("/races")}
                style={{ background: race.isPrimary ? "rgba(31,204,138,0.05)" : "var(--bg2)", border: race.isPrimary ? "0.5px solid rgba(31,204,138,0.2)" : "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>{race.name}</p>
                    {race.isPrimary && (
                      <span style={{ fontSize: "9px", color: "var(--green)", background: "var(--green-dim)", padding: "2px 6px", borderRadius: "10px", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>A Race</span>
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
          {hasActivity && displayCount > 0
            ? `${displayCount} run${displayCount > 1 ? "s" : ""} this week${displayKm !== "0" ? `, ${displayKm}km covered` : ""}. Keep the consistency going.`
            : primaryRace
            ? `${getDaysUntil(primaryRace.date)} days until ${primaryRace.name}. Log your first run to get started.`
            : "Add a race and log your runs to get personalised coaching notes here."
          }
        </p>
      </div>

    </div>
  );
}