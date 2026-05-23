"use client";
import Link from "next/link";
import { useState } from "react";
import BottomSheet from "../components/BottomSheet";

const typeColors: Record<string, { color: string; bg: string }> = {
  easy:  { color: "#4a9eff", bg: "rgba(74,158,255,0.12)" },
  tempo: { color: "#f0a830", bg: "rgba(240,168,48,0.12)" },
  hard:  { color: "#e05252", bg: "rgba(224,82,82,0.12)" },
  long:  { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  group: { color: "#1fcc8a", bg: "rgba(31,204,138,0.12)" },
  rest:  { color: "#444",    bg: "var(--bg3)" },
};

const phaseColors: Record<string, string> = {
  "Base Building": "#4a9eff",
  "Aerobic Build": "#1fcc8a",
  "Threshold":     "#f0a830",
  "Peak":          "#a78bfa",
  "Taper":         "#e05252",
  "Race":          "#1fcc8a",
};

const allWeeks = [
  {
    week: 1, label: "Base Building", totalKm: 40,
    workouts: [
      { day: "Mon", name: "Easy Run",   distance: "6km",  duration: "42 min",    type: "easy",  done: true,  purpose: "Builds your aerobic base at a comfortable effort. Keeps fatigue low while stimulating adaptation.", execution: "Keep HR in Zone 2 (below 140 bpm). You should be able to hold a full conversation.", targetHR: "120–140 bpm", targetPace: "6:30–7:00/km" },
      { day: "Tue", name: "Rest Day",   distance: "",     duration: "",          type: "rest",  done: true,  purpose: "Recovery is when adaptation happens. This rest day is intentional, not optional.", execution: "Light walking is fine. Avoid any hard activity.", targetHR: "", targetPace: "" },
      { day: "Wed", name: "Easy Run",   distance: "8km",  duration: "56 min",    type: "easy",  done: true,  purpose: "Mid-week aerobic stimulus to maintain consistency without accumulating fatigue.", execution: "Zone 2 effort throughout. Focus on relaxed form.", targetHR: "120–140 bpm", targetPace: "6:30–7:00/km" },
      { day: "Thu", name: "Rest Day",   distance: "",     duration: "",          type: "rest",  done: true,  purpose: "Second rest day to ensure full recovery before the quality session.", execution: "Rest or gentle mobility work.", targetHR: "", targetPace: "" },
      { day: "Fri", name: "Strides",    distance: "5km",  duration: "35 min",    type: "easy",  done: true,  purpose: "Short accelerations improve neuromuscular efficiency and leg turnover.", execution: "Easy 4km warmup then 4×100m strides at 5k effort with full recovery.", targetHR: "140–160 bpm during strides", targetPace: "Easy + 4:30/km strides" },
      { day: "Sat", name: "Long Run",   distance: "16km", duration: "1h 55min",  type: "long",  done: true,  purpose: "The cornerstone of marathon training. Builds endurance, fat oxidation and mental toughness.", execution: "Very easy effort throughout. Last 3km can be at marathon goal pace.", targetHR: "120–145 bpm", targetPace: "6:45–7:15/km" },
      { day: "Sun", name: "Rest Day",   distance: "",     duration: "",          type: "rest",  done: true,  purpose: "Full recovery after long run. Critical for adaptation.", execution: "Complete rest. Prioritize sleep and nutrition.", targetHR: "", targetPace: "" },
    ],
  },
  {
    week: 2, label: "Base Building", totalKm: 45,
    workouts: [
      { day: "Mon", name: "Easy Run",        distance: "8km",  duration: "56 min",   type: "easy",  done: true,  purpose: "Aerobic base maintenance at low intensity.", execution: "Zone 2 throughout. Conversational pace.", targetHR: "120–140 bpm", targetPace: "6:30–7:00/km" },
      { day: "Tue", name: "Rest Day",        distance: "",     duration: "",         type: "rest",  done: true,  purpose: "Recovery day.", execution: "Full rest or light walking.", targetHR: "", targetPace: "" },
      { day: "Wed", name: "Tempo Run",       distance: "10km", duration: "52 min",   type: "tempo", done: true,  purpose: "Improves lactate threshold — the pace you can sustain for a long time before fatigue accumulates.", execution: "2km warmup, 6km at comfortably hard effort, 2km cooldown.", targetHR: "155–168 bpm", targetPace: "5:00–5:20/km" },
      { day: "Thu", name: "Easy Run",        distance: "6km",  duration: "42 min",   type: "easy",  done: false, today: true, purpose: "Recovery run to flush fatigue from yesterday's tempo.", execution: "Very easy. If legs feel heavy, slow down more than you think you need to.", targetHR: "115–135 bpm", targetPace: "6:45–7:15/km" },
      { day: "Fri", name: "Intervals",       distance: "8km",  duration: "55 min",   type: "hard",  done: false, purpose: "VO2 max development. Forces your body to work at near-maximum oxygen uptake.", execution: "2km warmup, 5×1000m at 5k race effort with 90 sec recovery jog, 1km cooldown.", targetHR: "170–182 bpm during reps", targetPace: "4:30–4:45/km for reps" },
      { day: "Sat", name: "Group Long Run",  distance: "22km", duration: "2h 30min", type: "group", done: false, purpose: "Long runs build endurance. Running with a group adds accountability and makes it more enjoyable.", execution: "Easy conversational effort. Don't let group pace push you too hard.", targetHR: "120–145 bpm", targetPace: "6:30–7:00/km" },
      { day: "Sun", name: "Rest Day",        distance: "",     duration: "",         type: "rest",  done: false, purpose: "Post long run recovery. Essential for adaptation.", execution: "Complete rest.", targetHR: "", targetPace: "" },
    ],
  },
  {
    week: 3, label: "Aerobic Build", totalKm: 52,
    workouts: [
      { day: "Mon", name: "Easy Run",   distance: "10km", duration: "70 min",   type: "easy",  done: false, purpose: "Volume increase. Continuing to build aerobic base.", execution: "Zone 2. Relaxed and controlled.", targetHR: "120–140 bpm", targetPace: "6:30–7:00/km" },
      { day: "Tue", name: "Rest Day",   distance: "",     duration: "",         type: "rest",  done: false, purpose: "Recovery day.", execution: "Full rest.", targetHR: "", targetPace: "" },
      { day: "Wed", name: "Tempo Run",  distance: "12km", duration: "62 min",   type: "tempo", done: false, purpose: "Extended tempo to push lactate threshold higher.", execution: "2km warmup, 8km tempo, 2km cooldown.", targetHR: "155–168 bpm", targetPace: "5:00–5:15/km" },
      { day: "Thu", name: "Easy Run",   distance: "8km",  duration: "56 min",   type: "easy",  done: false, purpose: "Recovery after tempo.", execution: "Very easy effort.", targetHR: "115–135 bpm", targetPace: "6:45–7:15/km" },
      { day: "Fri", name: "Intervals",  distance: "10km", duration: "65 min",   type: "hard",  done: false, purpose: "Higher volume interval session to push VO2 max.", execution: "2km warmup, 6×1000m at 5k effort, 90 sec recovery, 2km cooldown.", targetHR: "170–182 bpm during reps", targetPace: "4:30–4:45/km" },
      { day: "Sat", name: "Long Run",   distance: "26km", duration: "3h 00min", type: "long",  done: false, purpose: "Significant long run. Mental and physical endurance stimulus.", execution: "Very easy first 20km. Last 6km at marathon goal pace.", targetHR: "120–150 bpm", targetPace: "6:30–7:00/km" },
      { day: "Sun", name: "Rest Day",   distance: "",     duration: "",         type: "rest",  done: false, purpose: "Critical recovery post long run.", execution: "Complete rest. Refuel and hydrate well.", targetHR: "", targetPace: "" },
    ],
  },
  {
    week: 4, label: "Aerobic Build", totalKm: 58,
    workouts: [
      { day: "Mon", name: "Easy Run",   distance: "10km", duration: "70 min",   type: "easy",  done: false, purpose: "Aerobic base at low intensity.", execution: "Zone 2 throughout.", targetHR: "120–140 bpm", targetPace: "6:30–7:00/km" },
      { day: "Tue", name: "Rest Day",   distance: "",     duration: "",         type: "rest",  done: false, purpose: "Recovery day.", execution: "Full rest.", targetHR: "", targetPace: "" },
      { day: "Wed", name: "Tempo Run",  distance: "14km", duration: "72 min",   type: "tempo", done: false, purpose: "Longer tempo to continue threshold development.", execution: "2km warmup, 10km tempo, 2km cooldown.", targetHR: "155–168 bpm", targetPace: "5:00–5:15/km" },
      { day: "Thu", name: "Easy Run",   distance: "8km",  duration: "56 min",   type: "easy",  done: false, purpose: "Recovery after tempo.", execution: "Very easy effort.", targetHR: "115–135 bpm", targetPace: "6:45–7:15/km" },
      { day: "Fri", name: "Intervals",  distance: "10km", duration: "65 min",   type: "hard",  done: false, purpose: "VO2 max session.", execution: "2km warmup, 6×1000m hard, 90 sec recovery, 2km cooldown.", targetHR: "170–182 bpm during reps", targetPace: "4:30–4:45/km" },
      { day: "Sat", name: "Long Run",   distance: "28km", duration: "3h 15min", type: "long",  done: false, purpose: "Longest run so far. Big endurance stimulus.", execution: "Easy throughout. Focus on time on feet.", targetHR: "120–148 bpm", targetPace: "6:45–7:15/km" },
      { day: "Sun", name: "Rest Day",   distance: "",     duration: "",         type: "rest",  done: false, purpose: "Full recovery.", execution: "Complete rest.", targetHR: "", targetPace: "" },
    ],
  },
  {
    week: 5, label: "Base Building", totalKm: 38, // recovery week
    workouts: [
      { day: "Mon", name: "Easy Run",   distance: "6km",  duration: "42 min",   type: "easy",  done: false, purpose: "Recovery week — reduced volume.", execution: "Very easy Zone 2.", targetHR: "115–135 bpm", targetPace: "6:45–7:15/km" },
      { day: "Tue", name: "Rest Day",   distance: "",     duration: "",         type: "rest",  done: false, purpose: "Extra rest during recovery week.", execution: "Full rest.", targetHR: "", targetPace: "" },
      { day: "Wed", name: "Easy Run",   distance: "8km",  duration: "56 min",   type: "easy",  done: false, purpose: "Maintain aerobic stimulus at reduced load.", execution: "Zone 2 throughout.", targetHR: "120–140 bpm", targetPace: "6:30–7:00/km" },
      { day: "Thu", name: "Rest Day",   distance: "",     duration: "",         type: "rest",  done: false, purpose: "Recovery day.", execution: "Full rest or light walk.", targetHR: "", targetPace: "" },
      { day: "Fri", name: "Strides",    distance: "5km",  duration: "35 min",   type: "easy",  done: false, purpose: "Keep legs fresh and sharp during recovery week.", execution: "4km easy + 4×100m strides.", targetHR: "120–150 bpm", targetPace: "Easy + strides" },
      { day: "Sat", name: "Long Run",   distance: "18km", duration: "2h 05min", type: "long",  done: false, purpose: "Shorter long run during recovery week.", execution: "Very easy throughout.", targetHR: "120–140 bpm", targetPace: "6:45–7:15/km" },
      { day: "Sun", name: "Rest Day",   distance: "",     duration: "",         type: "rest",  done: false, purpose: "Post long run recovery.", execution: "Complete rest.", targetHR: "", targetPace: "" },
    ],
  },
  {
    week: 6,  label: "Threshold",    totalKm: 60,  workouts: [],
  },
  {
    week: 7,  label: "Threshold",    totalKm: 65,  workouts: [],
  },
  {
    week: 8,  label: "Threshold",    totalKm: 55,  workouts: [], // recovery
  },
  {
    week: 9,  label: "Peak",         totalKm: 70,  workouts: [],
  },
  {
    week: 10, label: "Peak",         totalKm: 75,  workouts: [],
  },
  {
    week: 11, label: "Peak",         totalKm: 80,  workouts: [],
  },
  {
    week: 12, label: "Peak",         totalKm: 60,  workouts: [], // recovery
  },
  {
    week: 13, label: "Taper",        totalKm: 55,  workouts: [],
  },
  {
    week: 14, label: "Taper",        totalKm: 45,  workouts: [],
  },
  {
    week: 15, label: "Taper",        totalKm: 32,  workouts: [],
  },
  {
    week: 16, label: "Race",         totalKm: 15,  workouts: [],
  },
];

const CURRENT_WEEK = 2;
const MAX_KM = 80; // peak week for bar scaling

export default function TrainingPage() {
  const [weekIndex, setWeekIndex]       = useState(CURRENT_WEEK - 1);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [showGroupRun, setShowGroupRun] = useState(false);
  const [groupRunForm, setGroupRunForm] = useState({ date: "", distance: "", time: "", notes: "" });
  const [groupRunSaved, setGroupRunSaved] = useState(false);
  const [activeTab, setActiveTab]       = useState<"plan" | "progress">("plan");

  const week = allWeeks[weekIndex];
  const isCurrentWeek       = weekIndex === CURRENT_WEEK - 1;
  const completedWorkouts   = week.workouts.filter((w) => w.done).length;
  const remainingWorkouts   = week.workouts.length - completedWorkouts;
  const completionRate      = week.workouts.length > 0
    ? Math.round((completedWorkouts / week.workouts.length) * 100)
    : 0;

  const handleSaveGroupRun = () => {
    setGroupRunSaved(true);
    setTimeout(() => {
      setShowGroupRun(false);
      setGroupRunSaved(false);
    }, 1500);
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div style={{ padding: "52px 16px 12px" }}>
        <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {week.label}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>
            Week {week.week} of 16
          </h1>
          <span style={{ fontSize: "12px", color: "var(--green)", fontFamily: "'DM Mono', monospace" }}>
            {week.totalKm}km
          </span>
        </div>
      </div>

      {/* ── Week switcher ── */}
      <div style={{ padding: "0 16px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={() => setWeekIndex(Math.max(0, weekIndex - 1))}
          disabled={weekIndex === 0}
          style={{
            background: "var(--bg2)", border: "0.5px solid var(--border)",
            borderRadius: "8px", padding: "6px 12px",
            cursor: weekIndex === 0 ? "not-allowed" : "pointer",
            color: weekIndex === 0 ? "var(--text3)" : "var(--text)", fontSize: "14px",
          }}
        >←</button>

        <div style={{ flex: 1, display: "flex", gap: "4px", overflowX: "auto" }}>
          {allWeeks.map((w, i) => (
            <button
              key={i}
              onClick={() => setWeekIndex(i)}
              style={{
                flexShrink: 0, padding: "5px 12px", borderRadius: "20px",
                border: "0.5px solid",
                borderColor: weekIndex === i ? "var(--green)" : "var(--border)",
                background: weekIndex === i ? "var(--green-dim)" : "var(--bg2)",
                color: weekIndex === i ? "var(--green)" : "var(--text3)",
                fontSize: "11px", fontFamily: "'DM Mono', monospace",
                cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              {i === CURRENT_WEEK - 1 ? "Now" : `W${w.week}`}
            </button>
          ))}
        </div>

        <button
          onClick={() => setWeekIndex(Math.min(allWeeks.length - 1, weekIndex + 1))}
          disabled={weekIndex === allWeeks.length - 1}
          style={{
            background: "var(--bg2)", border: "0.5px solid var(--border)",
            borderRadius: "8px", padding: "6px 12px",
            cursor: weekIndex === allWeeks.length - 1 ? "not-allowed" : "pointer",
            color: weekIndex === allWeeks.length - 1 ? "var(--text3)" : "var(--text)", fontSize: "14px",
          }}
        >→</button>
      </div>

      {/* ── Tab switcher ── */}
      <div style={{ padding: "0 16px 10px", display: "flex", gap: "10px" }}>
        {[
          { key: "plan",     label: "Plan" },
          { key: "progress", label: "Progress" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "plan" | "progress")}
            style={{
              flex: 1, padding: "10px 14px", borderRadius: "14px",
              border: "0.5px solid",
              borderColor: activeTab === tab.key ? "var(--green)" : "var(--border)",
              background: activeTab === tab.key ? "var(--green-dim)" : "var(--bg2)",
              color: activeTab === tab.key ? "var(--green)" : "var(--text)",
              fontSize: "13px", fontWeight: 600, cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          PLAN TAB
      ══════════════════════════════════════════ */}
      {activeTab === "plan" ? (
        <>
          {/* Day-dot strip */}
          <div style={{ padding: "0 16px 12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
              {week.workouts.map((w, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "9px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>
                    {w.day[0]}
                  </span>
                  <div
                    style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "10px", fontWeight: 600,
                      background: w.done ? "var(--green)" : (w as any).today ? "var(--text)" : "var(--bg3)",
                      color: w.done ? "var(--green-text)" : (w as any).today ? "var(--bg)" : "var(--text2)",
                      border: !w.done && !(w as any).today && w.type !== "rest" ? "0.5px dashed var(--border2)" : "none",
                      cursor: w.type !== "rest" ? "pointer" : "default",
                    }}
                    onClick={() => w.type !== "rest" && setSelectedWorkout(w)}
                  >
                    {w.done ? "✓" : w.type === "rest" ? "—" : w.day[0]}
                  </div>
                  <span style={{ fontSize: "9px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>
                    {w.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Load bars */}
          <div style={{ margin: "0 16px 10px", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>Weekly Load</span>
              <span style={{ fontSize: "10px", color: isCurrentWeek ? "var(--green)" : "var(--text2)", fontFamily: "'DM Mono', monospace" }}>
                {isCurrentWeek ? "Current Week" : weekIndex < CURRENT_WEEK - 1 ? "Completed" : "Upcoming"}
              </span>
            </div>
            {[
              { label: "Easy",  pct: 60, color: "#4a9eff" },
              { label: "Tempo", pct: 25, color: "#f0a830" },
              { label: "Hard",  pct: 15, color: "#e05252" },
            ].map((z, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: i < 2 ? "6px" : 0 }}>
                <span style={{ fontSize: "11px", color: "var(--text2)", fontFamily: "'DM Mono', monospace", width: "44px" }}>{z.label}</span>
                <div style={{ flex: 1, height: "5px", background: "var(--bg3)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: `${z.pct}%`, height: "100%", background: z.color, borderRadius: "3px" }} />
                </div>
                <span style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", width: "28px", textAlign: "right" }}>{z.pct}%</span>
              </div>
            ))}
          </div>

          {/* Timeline link */}
          <div style={{ padding: "0 16px 10px" }}>
            <Link href="/timeline" style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "var(--bg2)", border: "0.5px solid var(--border)",
              borderRadius: "var(--radius)", padding: "11px 16px",
              textDecoration: "none",
            }}>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>View Full Training Timeline</p>
                <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", marginTop: "2px" }}>16 weeks · mileage progression · race phases</p>
              </div>
              <span style={{ color: "var(--text3)", fontSize: "18px" }}>›</span>
            </Link>
          </div>

          {/* Add group run */}
          <div style={{ padding: "0 16px 10px" }}>
            <button
              onClick={() => setShowGroupRun(true)}
              style={{
                width: "100%", background: "var(--bg2)",
                border: "0.5px dashed rgba(31,204,138,0.4)",
                borderRadius: "var(--radius)", padding: "11px 16px",
                color: "var(--green)", fontSize: "12px",
                fontFamily: "'DM Mono', monospace", cursor: "pointer",
                letterSpacing: "0.04em", display: "flex",
                alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              + ADD GROUP RUN
            </button>
          </div>

          {/* Workout list */}
          <div style={{ padding: "0 16px 100px", display: "flex", flexDirection: "column", gap: "1px" }}>
            {week.workouts.map((w, i) => {
              const tc = typeColors[w.type];
              const isToday = (w as any).today && isCurrentWeek;
              return (
                <div
                  key={i}
                  onClick={() => w.type !== "rest" && setSelectedWorkout(w)}
                  style={{
                    background: isToday ? "var(--bg2)" : "transparent",
                    border: isToday ? "0.5px solid var(--green)" : "0.5px solid transparent",
                    borderRadius: "var(--radius)",
                    padding: "11px 4px",
                    opacity: w.done ? 0.4 : 1,
                    borderBottom: !isToday ? "0.5px solid var(--border)" : undefined,
                    cursor: w.type !== "rest" ? "pointer" : "default",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <span style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", minWidth: "24px" }}>
                        {w.day}
                      </span>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>{w.name}</span>
                          {isToday && (
                            <span style={{ fontSize: "9px", color: "var(--green)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>TODAY</span>
                          )}
                        </div>
                        {w.distance && (
                          <span style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>
                            {w.distance}{w.duration ? ` · ${w.duration}` : ""}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{
                        fontSize: "10px", fontWeight: 600,
                        padding: "3px 10px", borderRadius: "20px",
                        color: tc.color, background: tc.bg,
                        fontFamily: "'DM Mono', monospace",
                      }}>
                        {w.type}
                      </span>
                      {w.type !== "rest" && (
                        <span style={{ color: "var(--text3)", fontSize: "14px" }}>›</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>

      ) : (
        /* ══════════════════════════════════════════
           PROGRESS TAB — timeline style
        ══════════════════════════════════════════ */
        <div style={{ padding: "0 16px 100px" }}>

          {/* Current week summary card */}
          <div style={{
            background: "var(--bg2)", border: "0.5px solid var(--border)",
            borderRadius: "var(--radius)", padding: "14px 16px", marginBottom: "16px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Week {allWeeks[CURRENT_WEEK - 1].week} · This Week
              </span>
              <span style={{ fontSize: "11px", color: "var(--green)", fontFamily: "'DM Mono', monospace" }}>
                {completionRate}%
              </span>
            </div>
            {/* Progress bar */}
            <div style={{ width: "100%", height: "4px", background: "var(--bg3)", borderRadius: "999px", overflow: "hidden", marginBottom: "12px" }}>
              <div style={{
                width: `${completionRate}%`, height: "100%",
                background: "var(--green)", borderRadius: "999px",
                transition: "width 0.4s ease",
              }} />
            </div>
            {/* 3 stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {[
                { label: "Done",   value: completedWorkouts,            color: "var(--green)" },
                { label: "Left",   value: remainingWorkouts,            color: "var(--text)"  },
                { label: "Target", value: `${allWeeks[CURRENT_WEEK - 1].totalKm}km`, color: "var(--text2)" },
              ].map((stat) => (
                <div key={stat.label} style={{ background: "var(--bg3)", borderRadius: "10px", padding: "10px 12px" }}>
                  <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", marginBottom: "4px" }}>{stat.label}</p>
                  <p style={{ fontSize: "18px", fontWeight: 700, color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline week rows */}
          {allWeeks.map((w, i) => {
            const isNow      = i === CURRENT_WEEK - 1;
            const isPast     = i < CURRENT_WEEK - 1;
            const weekDone   = w.workouts.filter((wo) => wo.done).length;
            const weekTotal  = w.workouts.length;
            const weekPct    = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;
            const dotColor   = phaseColors[w.label] ?? "var(--text3)";
            // a recovery week has less km than the previous week
            const isRecovery = i > 0 && w.totalKm < allWeeks[i - 1].totalKm;

            return (
              <div
                key={i}
                onClick={() => { setWeekIndex(i); setActiveTab("plan"); }}
                style={{
                  padding: "13px 0",
                  borderRadius: isNow ? "var(--radius)" : "0",
                  background: isNow ? "var(--bg2)" : "transparent",
                  border: isNow ? "0.5px solid var(--green)" : "none",
                  borderBottom: !isNow ? "0.5px solid var(--border)" : undefined,
                  paddingLeft: isNow ? "16px" : "0",
                  paddingRight: isNow ? "16px" : "0",
                  marginBottom: isNow ? "1px" : "0",
                  cursor: "pointer",
                  opacity: isPast ? 0.55 : 1,
                }}
              >
                {/* Row top: week label + km + colour dot */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      fontSize: "11px", fontFamily: "'DM Mono', monospace",
                      color: isNow ? "var(--green)" : "var(--text3)",
                      fontWeight: isNow ? 700 : 400,
                    }}>
                      W{w.week}
                    </span>

                    {isNow && (
                      <span style={{
                        fontSize: "9px", color: "var(--green)",
                        fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em",
                        background: "var(--green-dim)", padding: "2px 6px", borderRadius: "20px",
                      }}>
                        NOW
                      </span>
                    )}

                    {isRecovery && !isNow && (
                      <span style={{
                        fontSize: "9px", color: "var(--text3)",
                        fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em",
                        background: "var(--bg3)", padding: "2px 6px", borderRadius: "20px",
                        border: "0.5px solid var(--border)",
                      }}>
                        RECOVERY
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "11px", color: "var(--text2)", fontFamily: "'DM Mono', monospace" }}>
                      {w.totalKm}km
                    </span>
                    <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
                  </div>
                </div>

                {/* Volume / completion bar */}
                <div style={{ width: "100%", height: "3px", background: "var(--bg3)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{
                    // past weeks: show completion %; future/current: show volume relative to peak
                    width: isPast
                      ? `${weekPct}%`
                      : `${Math.round((w.totalKm / MAX_KM) * 100)}%`,
                    height: "100%",
                    background: isNow ? "var(--green)" : isPast ? "var(--green)" : dotColor,
                    borderRadius: "999px",
                    opacity: isPast ? 0.6 : 1,
                    transition: "width 0.4s ease",
                  }} />
                </div>

                {/* Past week completion note */}
                {isPast && weekTotal > 0 && (
                  <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", marginTop: "5px" }}>
                    {weekDone}/{weekTotal} workouts · {weekPct}% complete
                  </p>
                )}

                {/* Tap hint for future weeks */}
                {!isPast && !isNow && (
                  <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", marginTop: "5px" }}>
                    {w.label} · tap to view plan
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Workout detail modal ── */}
      <BottomSheet
        isOpen={!!selectedWorkout}
        onClose={() => setSelectedWorkout(null)}
        title={selectedWorkout?.name || ""}
      >
        {selectedWorkout && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{
                fontSize: "11px", fontWeight: 600,
                padding: "4px 12px", borderRadius: "20px",
                color: typeColors[selectedWorkout.type]?.color,
                background: typeColors[selectedWorkout.type]?.bg,
                fontFamily: "'DM Mono', monospace",
              }}>
                {selectedWorkout.type}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>
                {selectedWorkout.distance} · {selectedWorkout.duration}
              </span>
            </div>

            <div>
              <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                Why this workout
              </p>
              <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: 1.6 }}>
                {selectedWorkout.purpose}
              </p>
            </div>

            <div>
              <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                How to execute
              </p>
              <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.6 }}>
                {selectedWorkout.execution}
              </p>
            </div>

            {selectedWorkout.targetHR && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div style={{ background: "var(--bg3)", borderRadius: "10px", padding: "12px" }}>
                  <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", marginBottom: "4px" }}>TARGET HR</p>
                  <p style={{ fontSize: "13px", color: "var(--text)", fontWeight: 600 }}>{selectedWorkout.targetHR}</p>
                </div>
                <div style={{ background: "var(--bg3)", borderRadius: "10px", padding: "12px" }}>
                  <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", marginBottom: "4px" }}>TARGET PACE</p>
                  <p style={{ fontSize: "13px", color: "var(--text)", fontWeight: 600 }}>{selectedWorkout.targetPace}</p>
                </div>
              </div>
            )}

            <button style={{
              width: "100%", background: "var(--green)",
              color: "var(--green-text)", fontWeight: 600,
              padding: "14px", borderRadius: "12px",
              border: "none", cursor: "pointer",
              fontSize: "15px", fontFamily: "'Syne', sans-serif",
              marginTop: "4px",
            }}>
              Start Workout
            </button>
          </div>
        )}
      </BottomSheet>

      {/* ── Add Group Run modal ── */}
      <BottomSheet
        isOpen={showGroupRun}
        onClose={() => setShowGroupRun(false)}
        title="Add Group Run"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {groupRunSaved ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ fontSize: "32px", marginBottom: "8px" }}>✓</p>
              <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--green)" }}>Group run added!</p>
              <p style={{ fontSize: "13px", color: "var(--text2)", marginTop: "4px" }}>Your plan will adapt accordingly.</p>
            </div>
          ) : (
            <>
              {[
                { label: "Date",            key: "date",     type: "date", placeholder: "" },
                { label: "Distance (km)",   key: "distance", type: "text", placeholder: "e.g. 15" },
                { label: "Estimated time",  key: "time",     type: "text", placeholder: "e.g. 1h 30min" },
                { label: "Notes",           key: "notes",    type: "text", placeholder: "e.g. Saturday parkrun group" },
              ].map((field) => (
                <div key={field.key}>
                  <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                    {field.label}
                  </p>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={groupRunForm[field.key as keyof typeof groupRunForm]}
                    onChange={(e) => setGroupRunForm({ ...groupRunForm, [field.key]: e.target.value })}
                    style={{
                      width: "100%", background: "var(--bg3)",
                      border: "0.5px solid var(--border)", borderRadius: "10px",
                      padding: "12px 14px", color: "var(--text)",
                      fontSize: "14px", outline: "none",
                      fontFamily: "'Syne', sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}

              <div style={{ background: "rgba(31,204,138,0.08)", border: "0.5px solid rgba(31,204,138,0.2)", borderRadius: "10px", padding: "12px" }}>
                <p style={{ fontSize: "12px", color: "var(--green)", lineHeight: 1.6 }}>
                  The AI coach will automatically adjust your plan around this group run to avoid overtraining.
                </p>
              </div>

              <button
                onClick={handleSaveGroupRun}
                style={{
                  width: "100%", background: "var(--green)",
                  color: "var(--green-text)", fontWeight: 600,
                  padding: "14px", borderRadius: "12px",
                  border: "none", cursor: "pointer",
                  fontSize: "15px", fontFamily: "'Syne', sans-serif",
                }}
              >
                Save Group Run
              </button>
            </>
          )}
        </div>
      </BottomSheet>

    </div>
  );
}
