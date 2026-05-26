"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function SettingsPage() {
  const router = useRouter();
  const [units, setUnits] = useState("Metric");
  const [appearance, setAppearance] = useState("Dark");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const savedUnits = localStorage.getItem("units") || "Metric";
    const savedAppearance = localStorage.getItem("appearance") || "Dark";
    setUnits(savedUnits);
    setAppearance(savedAppearance);

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
        if (data) setProfile(data);
        setLoading(false);
        // Don't trigger auto-save on first load
        setTimeout(() => { isFirstLoad.current = false; }, 100);
      });
    });
  }, []);

  // Auto-save units & appearance to localStorage whenever they change
  useEffect(() => {
    if (isFirstLoad.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus("saving");

    debounceRef.current = setTimeout(() => {
      localStorage.setItem("units", units);
      localStorage.setItem("appearance", appearance);

      // Apply appearance immediately
      if (appearance === "Light") {
        document.documentElement.style.setProperty("--bg", "#f5f5f5");
        document.documentElement.style.setProperty("--bg2", "#ffffff");
        document.documentElement.style.setProperty("--bg3", "#ebebeb");
        document.documentElement.style.setProperty("--text", "#0a0a0a");
        document.documentElement.style.setProperty("--text2", "#333333");
        document.documentElement.style.setProperty("--text3", "#888888");
        document.documentElement.style.setProperty("--border", "rgba(0,0,0,0.1)");
      } else {
        document.documentElement.style.removeProperty("--bg");
        document.documentElement.style.removeProperty("--bg2");
        document.documentElement.style.removeProperty("--bg3");
        document.documentElement.style.removeProperty("--text");
        document.documentElement.style.removeProperty("--text2");
        document.documentElement.style.removeProperty("--text3");
        document.documentElement.style.removeProperty("--border");
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 400);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [units, appearance]);

  const displayAge = profile?.age || "—";
  const displayGender = profile?.gender ? profile.gender.charAt(0) : "—";
  const displayWeight = profile?.weight_kg ? `${profile.weight_kg}kg` : "—";
  const displayMaxHR = profile?.max_hr ? `Max ${profile.max_hr}` : "—";
  const displayPhilosophy = profile?.coaching_philosophy || "—";
  const displayDays = profile?.weekly_availability ? `${profile.weekly_availability} days` : "—";
  const displayPersonality = profile?.coach_personality || "—";

  const sections = [
    {
      title: "Profile",
      items: [
        { label: "Age, gender, weight", value: profile ? `${displayAge} · ${displayGender} · ${displayWeight}` : "—", onPress: () => router.push("/profile") },
        { label: "Heart rate zones", value: displayMaxHR, onPress: () => router.push("/profile") },
        { label: "Injury history", value: profile?.injury_history ? "On file" : "None", onPress: () => router.push("/profile") },
      ],
    },
    {
      title: "Training",
      items: [
        { label: "Coaching philosophy", value: displayPhilosophy, onPress: () => router.push("/profile") },
        { label: "Weekly availability", value: displayDays, onPress: () => router.push("/profile") },
        { label: "Terrain access", value: profile?.terrain_access?.join(", ") || "—", onPress: () => router.push("/profile") },
      ],
    },
    {
      title: "Coach",
      items: [
        { label: "Coach personality", value: displayPersonality, onPress: () => router.push("/profile") },
        { label: "AI permissions", value: "Full access", onPress: () => {} },
      ],
    },
    {
      title: "Races",
      items: [
        { label: "My races", value: "View all", onPress: () => router.push("/races") },
      ],
    },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: "100px" }}>

      {/* Header */}
      <div style={{ padding: "52px 16px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>Settings</h1>
        {saveStatus !== "idle" && (
          <span style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", color: saveStatus === "saved" ? "var(--green)" : "var(--text3)", transition: "color 0.3s ease" }}>
            {saveStatus === "saving" ? "saving..." : "✓ saved"}
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ padding: "40px 16px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>Loading...</p>
        </div>
      ) : (
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {sections.map((section, i) => (
            <div key={i}>
              <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px", paddingLeft: "4px" }}>
                {section.title}
              </p>
              <div style={{ background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                {section.items.map((item, j) => (
                  <div key={j} onClick={item.onPress}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", cursor: "pointer", borderBottom: j < section.items.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                    <span style={{ fontSize: "14px", color: "var(--text)" }}>{item.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>{item.value}</span>
                      <span style={{ color: "var(--text3)", fontSize: "16px" }}>›</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Units & Display — auto-saves on change */}
          <div>
            <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px", paddingLeft: "4px" }}>
              Units & Display
            </p>
            <div style={{ background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              <div style={{ padding: "13px 16px", borderBottom: "0.5px solid var(--border)" }}>
                <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "10px" }}>Units</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["Metric", "Imperial"].map(u => (
                    <button key={u} onClick={() => setUnits(u)}
                      style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "0.5px solid", borderColor: units === u ? "var(--green)" : "var(--border)", background: units === u ? "var(--green-dim)" : "var(--bg3)", color: units === u ? "var(--green)" : "var(--text2)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ padding: "13px 16px" }}>
                <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "10px" }}>Appearance</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["Dark", "Light"].map(a => (
                    <button key={a} onClick={() => setAppearance(a)}
                      style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "0.5px solid", borderColor: appearance === a ? "var(--green)" : "var(--border)", background: appearance === a ? "var(--green-dim)" : "var(--bg3)", color: appearance === a ? "var(--green)" : "var(--text2)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div>
            <p style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: "8px", paddingLeft: "4px" }}>
              Integrations
            </p>
            <div style={{ background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              {[
                { name: "Strava", color: "#FC4C02", action: () => router.push("/profile"), label: "Manage" },
                { name: "Garmin Connect", color: "#4a9eff", action: () => {}, label: "Coming soon" },
                { name: "Apple Health", color: "#e05252", action: () => {}, label: "Coming soon" },
              ].map((item, j, arr) => (
                <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderBottom: j < arr.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                  <span style={{ fontSize: "14px", color: "var(--text)" }}>{item.name}</span>
                  <button onClick={item.action}
                    style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", color: item.label === "Coming soon" ? "var(--text3)" : item.color, background: item.label === "Coming soon" ? "var(--bg3)" : `${item.color}12`, border: `0.5px solid ${item.label === "Coming soon" ? "var(--border)" : item.color + "40"}`, borderRadius: "20px", padding: "4px 12px", cursor: item.label === "Coming soon" ? "not-allowed" : "pointer" }}>
                    {item.label}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}