interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  deltaUp?: boolean;
}

export default function StatCard({ label, value, unit, delta, deltaUp }: StatCardProps) {
  return (
    <div style={{
      background: "var(--bg2)",
      border: "0.5px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "12px 14px",
    }}>
      <div style={{
        fontSize: "10px",
        color: "var(--text3)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        fontFamily: "'DM Mono', monospace",
        marginBottom: "6px",
      }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
        <span style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: "13px", color: "var(--text2)" }}>{unit}</span>
        )}
      </div>
      {delta && (
        <div style={{
          fontSize: "11px",
          marginTop: "4px",
          fontFamily: "'DM Mono', monospace",
          color: deltaUp ? "var(--green)" : "var(--red)",
        }}>
          {delta}
        </div>
      )}
    </div>
  );
}