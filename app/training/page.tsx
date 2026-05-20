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
    easy: { color: "#4a9eff", bg: "rgba(74,158,255,0.1)" },
    tempo: { color: "#f0a830", bg: "rgba(240,168,48,0.1)" },
    hard: { color: "#e05252", bg: "rgba(224,82,82,0.1)" },
    long: { color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
    group: { color: "#1fcc8a", bg: "rgba(31,204,138,0.1)" },
    rest: { color: "#555", bg: "var(--bg3)" },
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
      <div style={{ padding: "0 16px", marginBottom: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
          {workouts.map((w, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "9px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>{w.day}</span>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: 600,
                background: w.done ? "var(--green)" : w.today ? "var(--text)" : "var(--bg3)",
                color: w.done ? "var(--green-text)" : w.today ? "var(--bg)" : "var(--text2)",
                border: !w.done && !w.today && w.type !== "rest" ? "0.5px dashed var(--border2)" : "none",
              }}>
                {w.done ? "✓" : w.type === "rest" ? "—" : w.day[0]}
              </div>
              <span style={{ fontSize: "9px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>
                {w.distance || ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add group run button */}
      <div style={{ padding: "0 16px", marginBottom: "12px" }}>
        <button style={{
          width: "100%",
          background: "var(--bg2)",
          border: "0.5px dashed var(--green)",
          borderRadius: "var(--radius)",
          padding: "12px 16px",
          color: "var(--green)",
          fontSize: "13px",
          fontFamily: "'DM Mono', monospace",
          cursor: "pointer",
          letterSpacing: "0.04em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}>
          + Add Group Run
        </button>
      </div>

      {/* Workout list */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {workouts.map((w, i) => {
          const tc = typeColors[w.type];
          return (
            <div key={i} style={{
              background: "var(--bg2)",
              border: w.today ? "0.5px solid var(--green)" : "0.5px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "12px 16px",
              opacity: w.done ? 0.45 : 1,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                    <span style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>{w.day}</span>
                    {w.today && <span style={{ fontSize: "10px", color: "var(--green)", fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>TODAY</span>}
                    {w.type === "group" && <span style={{ fontSize: "10px", color: "var(--green)", fontFamily: "'DM Mono', monospace" }}>GROUP</span>}
                  </div>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)" }}>{w.name}</p>
                  {w.distance && (
                    <p style={{ fontSize: "12px", color: "var(--text2)", marginTop: "2px", fontFamily: "'DM Mono', monospace" }}>
                      {w.distance}{w.duration ? ` · ${w.duration}` : ""}
                    </p>
                  )}
                </div>
                <span style={{
                  fontSize: "10px", fontWeight: 600,
                  padding: "4px 10px", borderRadius: "20px",
                  color: tc.color, background: tc.bg,
                  fontFamily: "'DM Mono', monospace",
                  marginTop: "2px",
                }}>
                  {w.type}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI note */}
      <div style={{ margin: "12px 16px", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 16px" }}>
        <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
          AI Coach Note
        </p>
        <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.6 }}>
          If you miss a run or add a group run, your plan will automatically adjust. Tap the coach to discuss any changes.
        </p>
      </div>

    </div>
  );
}