export default function TrainingPage() {
  const workouts = [
    { day: "Mon", name: "Easy Run", distance: "8km", duration: "56 min", type: "easy", done: true },
    { day: "Tue", name: "Rest Day", distance: "", duration: "", type: "rest", done: true },
    { day: "Wed", name: "Tempo Run", distance: "10km", duration: "52 min", type: "tempo", done: true },
    { day: "Thu", name: "Easy Run", distance: "6km", duration: "42 min", type: "easy", done: false, today: true },
    { day: "Fri", name: "Intervals", distance: "8km", duration: "55 min", type: "hard", done: false },
    { day: "Sat", name: "Group Long Run", distance: "22km", duration: "2h 30min", type: "group", done: false },
    { day: "Sun", name: "Rest Day", distance: "", duration: "", type: "rest", done: false },
  ];

  const typeColors: Record<string, { color: string; bg: string }> = {
    easy:  { color: "#4a9eff", bg: "rgba(74,158,255,0.12)" },
    tempo: { color: "#f0a830", bg: "rgba(240,168,48,0.12)" },
    hard:  { color: "#e05252", bg: "rgba(224,82,82,0.12)" },
    long:  { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
    group: { color: "#1fcc8a", bg: "rgba(31,204,138,0.12)" },
    rest:  { color: "#444",    bg: "var(--bg3)" },
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ padding: "52px 16px 16px" }}>
        <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Week 4 of 16
        </p>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", marginTop: "4px" }}>
          Training Plan
        </h1>
      </div>

      {/* Week strip */}
      <div style={{ padding: "0 16px 14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
          {workouts.map((w, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "9px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>
                {w.day.slice(0,1)}
              </span>
              <div style={{
                width: "30px", height: "30px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "10px", fontWeight: 600,
                background: w.done ? "var(--green)" : (w as any).today ? "var(--text)" : "var(--bg3)",
                color: w.done ? "var(--green-text)" : (w as any).today ? "var(--bg)" : "var(--text2)",
                border: !w.done && !(w as any).today && w.type !== "rest" ? "0.5px dashed var(--border2)" : "none",
              }}>
                {w.done ? "✓" : w.type === "rest" ? "—" : w.day[0]}
              </div>
              <span style={{ fontSize: "9px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>
                {w.distance}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Load summary */}
      <div style={{ margin: "0 16px 10px", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>Weekly Load</span>
          <span style={{ fontSize: "10px", color: "var(--green)", fontFamily: "'DM Mono', monospace" }}>54km planned</span>
        </div>
        {[
          { label: "Easy", pct: 60, color: "#4a9eff" },
          { label: "Tempo", pct: 25, color: "#f0a830" },
          { label: "Hard", pct: 15, color: "#e05252" },
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

      {/* Add group run */}
      <div style={{ padding: "0 16px 10px" }}>
        <button style={{
          width: "100%",
          background: "var(--bg2)",
          border: "0.5px dashed rgba(31,204,138,0.4)",
          borderRadius: "var(--radius)",
          padding: "11px 16px",
          color: "var(--green)",
          fontSize: "12px",
          fontFamily: "'DM Mono', monospace",
          cursor: "pointer",
          letterSpacing: "0.04em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}>
          + ADD GROUP RUN
        </button>
      </div>

      {/* Workout list */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "1px" }}>
        {workouts.map((w, i) => {
          const tc = typeColors[w.type];
          const isToday = (w as any).today;
          return (
            <div key={i} style={{
              background: isToday ? "var(--bg2)" : "transparent",
              border: isToday ? "0.5px solid var(--green)" : "0.5px solid transparent",
              borderRadius: "var(--radius)",
              padding: "11px 4px",
              opacity: w.done ? 0.4 : 1,
              borderBottom: !isToday ? "0.5px solid var(--border)" : undefined,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", minWidth: "24px" }}>
                    {w.day.slice(0,3)}
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
                <span style={{
                  fontSize: "10px", fontWeight: 600,
                  padding: "3px 10px", borderRadius: "20px",
                  color: tc.color, background: tc.bg,
                  fontFamily: "'DM Mono', monospace",
                }}>
                  {w.type}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI note */}
      <div style={{ margin: "12px 16px 0", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 16px" }}>
        <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
          AI Note
        </p>
        <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.6 }}>
          Miss a run or add a group run and your plan adapts automatically. Tap Coach to discuss any changes.
        </p>
      </div>

    </div>
  );
}