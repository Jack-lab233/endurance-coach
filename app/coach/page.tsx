export default function CoachPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ padding: "52px 16px 16px" }}>
        <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          AI Powered
        </p>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", marginTop: "4px" }}>
          Your Coach
        </h1>
      </div>

      {/* Coach message */}
      <div style={{ margin: "0 16px 10px", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: "var(--green-dim)", border: "0.5px solid rgba(31,204,138,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px",
          }}>🤖</div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>Coach AI</p>
            <p style={{ fontSize: "11px", color: "var(--green)", fontFamily: "'DM Mono', monospace" }}>Online</p>
          </div>
        </div>
        <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.7 }}>
          Hey Connor! Great tempo run yesterday — you held 5:12/km for the last 3km which is a new effort for you. Today is your easy run, keep it conversational. How are your legs feeling?
        </p>
      </div>

      {/* Quick questions */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px" }}>
        {[
          "How should I pace Knysna?",
          "I'm feeling tired today",
          "Adjust my plan for next week",
        ].map((q, i) => (
          <button key={i} style={{
            background: "var(--bg2)",
            border: "0.5px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "12px 16px",
            color: "var(--text2)",
            fontSize: "13px",
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "'Syne', sans-serif",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            {q}
            <span style={{ color: "var(--text3)" }}>›</span>
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ margin: "0 16px", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "10px 14px", display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Ask your coach anything..."
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: "var(--text)", fontSize: "13px",
            fontFamily: "'Syne', sans-serif",
          }}
        />
        <button style={{
          background: "var(--green)", color: "var(--green-text)",
          fontWeight: 600, padding: "8px 16px", borderRadius: "8px",
          border: "none", cursor: "pointer", fontSize: "13px",
          fontFamily: "'Syne', sans-serif",
        }}>
          Send
        </button>
      </div>

    </div>
  );
}