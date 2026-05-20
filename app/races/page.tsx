export default function RacesPage() {
  const races = [
    {
      name: "Knysna Forest Marathon",
      date: "July 19, 2025",
      distance: "42.2km",
      daysAway: 8,
      goal: "4:00:00",
      surface: "Trail",
      elevation: "1,240m gain",
      location: "Knysna, Western Cape",
      temp: "12–18°C",
      cutoff: "7 hours",
      aidStations: 6,
      difficulty: "Hard",
      difficultyColor: "#e05252",
      notes: "Technical single track through indigenous forest. Significant elevation in first 15km. Mud likely if recent rain.",
      aiInsight: "Based on your tempo pace and elevation data, target 5:30/km on flats and power-hike steep climbs. Start conservatively — 80% of DNFs happen after km 30.",
    },
    {
      name: "Cape Town Marathon",
      date: "September 21, 2025",
      distance: "42.2km",
      daysAway: 42,
      goal: "3:45:00",
      surface: "Road",
      elevation: "180m gain",
      location: "Cape Town City Centre",
      temp: "14–22°C",
      cutoff: "6 hours",
      aidStations: 12,
      difficulty: "Moderate",
      difficultyColor: "#f0a830",
      notes: "Fast city course. Slight headwind on foreshore likely. Miles 18–22 are exposed with no shade.",
      aiInsight: "Your current fitness projects a 3:48 finish. 8 more weeks of training puts 3:45 well within reach. Key session: 32km long run at goal pace in week 10.",
    },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ padding: "52px 16px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Season 2025
          </p>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", marginTop: "4px" }}>
            My Races
          </h1>
        </div>
        <button style={{
          background: "var(--green)", color: "var(--green-text)",
          fontWeight: 600, padding: "8px 16px", borderRadius: "10px",
          border: "none", cursor: "pointer", fontSize: "13px",
          fontFamily: "'Syne', sans-serif",
        }}>
          + Add Race
        </button>
      </div>

      {/* Race cards */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {races.map((race, i) => (
          <div key={i} style={{
            background: "var(--bg2)",
            border: "0.5px solid var(--border)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
          }}>
            {/* Race header */}
            <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>{race.name}</p>
                <p style={{ fontSize: "12px", color: "var(--text2)", marginTop: "2px", fontFamily: "'DM Mono', monospace" }}>{race.date} · {race.location}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--green)", lineHeight: 1 }}>{race.daysAway}</p>
                <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>days away</p>
              </div>
            </div>

            {/* Race stats row */}
            <div style={{ padding: "0 16px 12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {[
                { label: race.distance },
                { label: race.surface },
                { label: race.elevation },
                { label: `Goal ${race.goal}`, green: true },
                { label: `Cutoff ${race.cutoff}` },
                { label: `${race.aidStations} aid stations` },
              ].map((tag, j) => (
                <span key={j} style={{
                  fontSize: "11px",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  fontFamily: "'DM Mono', monospace",
                  color: tag.green ? "var(--green)" : "var(--text2)",
                  background: tag.green ? "var(--green-dim)" : "var(--bg3)",
                  border: `0.5px solid ${tag.green ? "rgba(31,204,138,0.2)" : "var(--border)"}`,
                }}>
                  {tag.label}
                </span>
              ))}
              <span style={{
                fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
                fontFamily: "'DM Mono', monospace",
                color: race.difficultyColor,
                background: `${race.difficultyColor}18`,
                border: `0.5px solid ${race.difficultyColor}40`,
              }}>
                {race.difficulty}
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: "0.5px", background: "var(--border)", margin: "0 16px" }} />

            {/* Course notes */}
            <div style={{ padding: "12px 16px" }}>
              <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                Course Notes
              </p>
              <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.6 }}>{race.notes}</p>
            </div>

            {/* Divider */}
            <div style={{ height: "0.5px", background: "var(--border)", margin: "0 16px" }} />

            {/* AI insight */}
            <div style={{ padding: "12px 16px", background: "rgba(31,204,138,0.04)" }}>
              <p style={{ fontSize: "10px", color: "var(--green)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                AI Race Intelligence
              </p>
              <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.6 }}>{race.aiInsight}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}