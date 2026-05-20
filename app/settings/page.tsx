const sections = [
  {
    title: "Profile",
    items: [
      { label: "Age, gender, weight", value: "28 · M · 72kg" },
      { label: "Heart rate zones", value: "Max 187" },
      { label: "Personal records", value: "View" },
    ],
  },
  {
    title: "Training",
    items: [
      { label: "Coaching philosophy", value: "Balanced" },
      { label: "Weekly availability", value: "5 days" },
      { label: "Race goals", value: "Sub 3:45" },
    ],
  },
  {
    title: "Units & Display",
    items: [
      { label: "Units", value: "Metric" },
      { label: "Appearance", value: "Dark" },
      { label: "Font size", value: "Default" },
    ],
  },
  {
    title: "Privacy",
    items: [
      { label: "AI data permissions", value: "Full access" },
      { label: "Social visibility", value: "Friends" },
      { label: "Data sharing", value: "Off" },
    ],
  },
  {
    title: "Integrations",
    items: [
      { label: "Garmin Connect", value: "Connect" },
      { label: "Strava", value: "Connect" },
      { label: "Apple Health", value: "Connect" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ padding: "52px 16px 16px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>
          Settings
        </h1>
      </div>

      {/* Sections */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {sections.map((section, i) => (
          <div key={i}>
            <p style={{
              fontSize: "10px", color: "var(--text3)", textTransform: "uppercase",
              letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace",
              marginBottom: "8px", paddingLeft: "4px",
            }}>
              {section.title}
            </p>
            <div style={{
              background: "var(--bg2)",
              border: "0.5px solid var(--border)",
              borderRadius: "var(--radius)",
              overflow: "hidden",
            }}>
              {section.items.map((item, j) => (
                <div key={j} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "13px 16px",
                  borderBottom: j < section.items.length - 1 ? "0.5px solid var(--border)" : "none",
                  cursor: "pointer",
                }}>
                  <span style={{ fontSize: "14px", color: "var(--text)" }}>{item.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>
                      {item.value}
                    </span>
                    <span style={{ color: "var(--text3)", fontSize: "16px" }}>›</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}