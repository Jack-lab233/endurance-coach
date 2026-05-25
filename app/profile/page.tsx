"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { IconSettings } from "@tabler/icons-react";
import { supabase } from "../lib/supabase";

const philosophies = [
  { id: "polarized", label: "Polarized", desc: "80% easy, 20% hard. Science-backed for endurance.", color: "#4a9eff" },
  { id: "balanced", label: "Balanced", desc: "Mix of easy, tempo and hard efforts.", color: "#1fcc8a" },
  { id: "norwegian", label: "Norwegian", desc: "Double threshold. High volume at controlled intensity.", color: "#f0a830" },
  { id: "hr", label: "HR-Based", desc: "All training dictated by heart rate zones.", color: "#a78bfa" },
];

const personalities = [
  { id: "supportive", label: "Supportive", desc: "Encouraging and empathetic. Celebrates every win.", emoji: "🤝" },
  { id: "tough", label: "Tough Love", desc: "Pushes hard. No excuses. High standards.", emoji: "💪" },
  { id: "elite", label: "Elite Coach", desc: "Data-driven. Precise. Treats you like a pro.", emoji: "🎯" },
  { id: "calm", label: "Calm & Scientific", desc: "Measured and analytical. Explains everything.", emoji: "🔬" },
  { id: "competitive", label: "Competitive", desc: "Fuels your fire. Always chasing improvement.", emoji: "🏆" },
  { id: "beginner", label: "Beginner Friendly", desc: "Patient and clear. Perfect if you're still learning.", emoji: "🌱" },
];

const terrainOptions = ["Road", "Trail", "Track", "Mixed"];

interface ProfileForm {
  full_name: string;
  age: string;
  gender: string;
  weight_kg: string;
  max_hr: string;
  resting_hr: string;
  weekly_availability: string;
  injury_history: string;
  coaching_philosophy: string;
  coach_personality: string;
  terrain_access: string[];
}

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>({
    full_name: "",
    age: "",
    gender: "",
    weight_kg: "",
    max_hr: "",
    resting_hr: "",
    weekly_availability: "5",
    injury_history: "",
    coaching_philosophy: "balanced",
    coach_personality: "supportive",
    terrain_access: ["Road"],
  });

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [userId, setUserId] = useState<string | null>(null);
  const [stravaConnected, setStravaConnected] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setForm({
          full_name: data.full_name || "",
          age: data.age?.toString() || "",
          gender: data.gender || "",
          weight_kg: data.weight_kg?.toString() || "",
          max_hr: data.max_hr?.toString() || "",
          resting_hr: data.resting_hr?.toString() || "",
          weekly_availability: data.weekly_availability?.toString() || "5",
          injury_history: data.injury_history || "",
          coaching_philosophy: data.coaching_philosophy || "balanced",
          coach_personality: data.coach_personality || localStorage.getItem("coachPersonality") || "supportive",
          terrain_access: data.terrain_access || ["Road"],
        });
        localStorage.setItem("userName", data.full_name || "");
        localStorage.setItem("trainingPhilosophy", data.coaching_philosophy || "balanced");
        localStorage.setItem("coachPersonality", data.coach_personality || "supportive");
      } else {
        const stored = localStorage.getItem("userProfile");
        if (stored) {
          const p = JSON.parse(stored);
          setForm(f => ({
            ...f,
            full_name: p.name || "",
            age: p.age || "",
            gender: p.gender || "",
            weight_kg: p.weight || "",
            max_hr: p.maxHR || "",
            weekly_availability: p.days || "5",
          }));
        }
        const philosophy = localStorage.getItem("trainingPhilosophy");
        if (philosophy) setForm(f => ({ ...f, coaching_philosophy: philosophy }));
        const personality = localStorage.getItem("coachPersonality");
        if (personality) setForm(f => ({ ...f, coach_personality: personality }));
      }

      const { data: stravaToken } = await supabase
        .from("strava_tokens")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();
      setStravaConnected(!!stravaToken);

      const params = new URLSearchParams(window.location.search);
      if (params.get("strava") === "connected") {
        setStravaConnected(true);
        window.history.replaceState({}, "", "/profile");
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  // Auto-save: debounce 800ms after any form change (skip the initial load)
  useEffect(() => {
    if (isFirstLoad.current) {
      if (!loading) isFirstLoad.current = false;
      return;
    }
    if (!userId) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus("saving");

    debounceRef.current = setTimeout(async () => {
      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        full_name: form.full_name || null,
        age: form.age ? parseInt(form.age) : null,
        gender: form.gender || null,
        weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
        max_hr: form.max_hr ? parseInt(form.max_hr) : null,
        resting_hr: form.resting_hr ? parseInt(form.resting_hr) : null,
        weekly_availability: form.weekly_availability ? parseInt(form.weekly_availability) : 5,
        injury_history: form.injury_history || null,
        coaching_philosophy: form.coaching_philosophy,
        coach_personality: form.coach_personality,
        terrain_access: form.terrain_access,
        updated_at: new Date().toISOString(),
      });

      if (!error) {
        localStorage.setItem("userName", form.full_name);
        localStorage.setItem("trainingPhilosophy", form.coaching_philosophy);
        localStorage.setItem("coachPersonality", form.coach_personality);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        console.error("Auto-save error:", error.message);
        setSaveStatus("idle");
      }
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form, userId, loading]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = "/auth";
  };

  const toggleTerrain = (t: string) => {
    setForm(f => ({
      ...f,
      terrain_access: f.terrain_access.includes(t)
        ? f.terrain_access.filter(x => x !== t)
        : [...f.terrain_access, t],
    }));
  };

  const initial = form.full_name ? form.full_name.charAt(0).toUpperCase() : "?";

  if (loading) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text3)", fontFamily: "'DM Mono', monospace", fontSize: "13px" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: "100px" }}>

      {/* Header */}
      <div style={{ padding: "52px 16px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Athlete
          </p>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", marginTop: "4px" }}>
            Profile
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Auto-save indicator */}
          {saveStatus !== "idle" && (
            <span style={{
              fontSize: "11px", fontFamily: "'DM Mono', monospace",
              color: saveStatus === "saved" ? "var(--green)" : "var(--text3)",
              transition: "color 0.3s ease",
            }}>
              {saveStatus === "saving" ? "saving..." : "✓ saved"}
            </span>
          )}
          <Link href="/settings" style={{
            width: "36px", height: "36px", background: "rgba(20,20,20,0.8)",
            backdropFilter: "blur(10px)", border: "0.5px solid var(--border)",
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text2)", textDecoration: "none", flexShrink: 0,
          }}>
            <IconSettings size={18} strokeWidth={1.6} />
          </Link>
        </div>
      </div>

      {/* Avatar + name preview */}
      <div style={{ margin: "0 16px 16px", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: "var(--green-dim)", border: "0.5px solid rgba(31,204,138,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "24px", fontWeight: 700, color: "var(--green)", flexShrink: 0,
        }}>
          {initial}
        </div>
        <div>
          <p style={{ fontSize: "18px", fontWeight: 700, color: form.full_name ? "var(--text)" : "var(--text3)", letterSpacing: "-0.02em" }}>
            {form.full_name || "Add your name below"}
          </p>
          <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", marginTop: "2px" }}>
            {form.gender || ""}{form.age ? ` · ${form.age} yrs` : ""}{form.weight_kg ? ` · ${form.weight_kg}kg` : ""}
            {!form.gender && !form.age && !form.weight_kg ? "Fill in your details below" : ""}
          </p>
        </div>
      </div>

      {/* Personal Details */}
      <div style={{ margin: "0 16px 16px", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "16px" }}>
        <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
          Personal Details
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          <div>
            <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Name</p>
            <input
              type="text" placeholder="Your name" value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "0.5px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: "14px", outline: "none", fontFamily: "'Syne', sans-serif", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Gender</p>
            <div style={{ display: "flex", gap: "8px" }}>
              {["Male", "Female", "Other"].map(g => (
                <button key={g} onClick={() => setForm(f => ({ ...f, gender: g }))}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: "10px", border: "0.5px solid",
                    borderColor: form.gender === g ? "var(--green)" : "var(--border)",
                    background: form.gender === g ? "var(--green-dim)" : "var(--bg3)",
                    color: form.gender === g ? "var(--green)" : "var(--text2)",
                    fontSize: "13px", cursor: "pointer", fontFamily: "'DM Mono', monospace",
                  }}>{g}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Age</p>
              <input type="number" placeholder="28" value={form.age}
                onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "0.5px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: "14px", outline: "none", fontFamily: "'DM Mono', monospace", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Weight (kg)</p>
              <input type="number" placeholder="70" value={form.weight_kg}
                onChange={e => setForm(f => ({ ...f, weight_kg: e.target.value }))}
                style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "0.5px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: "14px", outline: "none", fontFamily: "'DM Mono', monospace", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Max HR</p>
              <input type="number" placeholder="185" value={form.max_hr}
                onChange={e => setForm(f => ({ ...f, max_hr: e.target.value }))}
                style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "0.5px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: "14px", outline: "none", fontFamily: "'DM Mono', monospace", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Resting HR</p>
              <input type="number" placeholder="52" value={form.resting_hr}
                onChange={e => setForm(f => ({ ...f, resting_hr: e.target.value }))}
                style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "0.5px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: "14px", outline: "none", fontFamily: "'DM Mono', monospace", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div>
            <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
              Training Days / Week — <span style={{ color: "var(--green)" }}>{form.weekly_availability} days</span>
            </p>
            <input type="range" min="3" max="7" value={form.weekly_availability}
              onChange={e => setForm(f => ({ ...f, weekly_availability: e.target.value }))}
              style={{ width: "100%", accentColor: "var(--green)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
              <span style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>3 days</span>
              <span style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>7 days</span>
            </div>
          </div>

          <div>
            <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Terrain Access</p>
            <div style={{ display: "flex", gap: "8px" }}>
              {terrainOptions.map(t => (
                <button key={t} onClick={() => toggleTerrain(t)}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: "10px", border: "0.5px solid",
                    borderColor: form.terrain_access.includes(t) ? "var(--green)" : "var(--border)",
                    background: form.terrain_access.includes(t) ? "var(--green-dim)" : "var(--bg3)",
                    color: form.terrain_access.includes(t) ? "var(--green)" : "var(--text2)",
                    fontSize: "12px", cursor: "pointer", fontFamily: "'DM Mono', monospace",
                  }}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Injury History (optional)</p>
            <textarea
              placeholder="e.g. Left knee ITB issues, plantar fasciitis 2024..."
              value={form.injury_history}
              onChange={e => setForm(f => ({ ...f, injury_history: e.target.value }))}
              rows={3}
              style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "0.5px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: "13px", outline: "none", fontFamily: "'Syne', sans-serif", boxSizing: "border-box", resize: "none", lineHeight: 1.5 }}
            />
          </div>
        </div>
      </div>

      {/* Training Philosophy */}
      <div style={{ margin: "0 16px 16px" }}>
        <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px", paddingLeft: "4px" }}>
          Training Philosophy
        </p>
        <p style={{ fontSize: "12px", color: "var(--text3)", marginBottom: "10px", paddingLeft: "4px", lineHeight: 1.5 }}>
          Controls your workout structure, intensity and progression.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {philosophies.map((p) => (
            <button key={p.id} onClick={() => setForm(f => ({ ...f, coaching_philosophy: p.id }))}
              style={{
                background: form.coaching_philosophy === p.id ? `${p.color}12` : "var(--bg2)",
                border: `0.5px solid ${form.coaching_philosophy === p.id ? p.color : "var(--border)"}`,
                borderRadius: "var(--radius)", padding: "12px 16px",
                cursor: "pointer", textAlign: "left",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontSize: "14px", fontWeight: 600, color: form.coaching_philosophy === p.id ? p.color : "var(--text)", marginBottom: "2px" }}>{p.label}</p>
                <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>{p.desc}</p>
              </div>
              <div style={{
                width: "18px", height: "18px", borderRadius: "50%",
                border: `2px solid ${form.coaching_philosophy === p.id ? p.color : "var(--border)"}`,
                background: form.coaching_philosophy === p.id ? p.color : "transparent",
                flexShrink: 0, marginLeft: "12px",
              }} />
            </button>
          ))}
        </div>
      </div>

      {/* Coach Personality */}
      <div style={{ margin: "0 16px 16px" }}>
        <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px", paddingLeft: "4px" }}>
          Coach Personality
        </p>
        <p style={{ fontSize: "12px", color: "var(--text3)", marginBottom: "10px", paddingLeft: "4px", lineHeight: 1.5 }}>
          Controls tone, motivation style and how your coach communicates.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {personalities.map((p) => (
            <button key={p.id} onClick={() => setForm(f => ({ ...f, coach_personality: p.id }))}
              style={{
                background: form.coach_personality === p.id ? "rgba(31,204,138,0.08)" : "var(--bg2)",
                border: `0.5px solid ${form.coach_personality === p.id ? "var(--green)" : "var(--border)"}`,
                borderRadius: "var(--radius)", padding: "12px 14px",
                cursor: "pointer", textAlign: "left",
              }}
            >
              <p style={{ fontSize: "20px", marginBottom: "6px" }}>{p.emoji}</p>
              <p style={{ fontSize: "13px", fontWeight: 600, color: form.coach_personality === p.id ? "var(--green)" : "var(--text)", marginBottom: "3px" }}>{p.label}</p>
              <p style={{ fontSize: "11px", color: "var(--text3)", lineHeight: 1.4 }}>{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Connected accounts */}
      <div style={{ margin: "0 16px 16px", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "0.5px solid var(--border)" }}>
          <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Connected Accounts
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderBottom: "0.5px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#FC4C02", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "14px" }}>🏃</span>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "var(--text)", fontWeight: 500 }}>Strava</p>
              {stravaConnected && (
                <p style={{ fontSize: "11px", color: "var(--green)", fontFamily: "'DM Mono', monospace", marginTop: "1px" }}>Connected</p>
              )}
            </div>
          </div>
          {stravaConnected ? (
            <button
              onClick={async () => {
                await supabase.from("strava_tokens").delete().eq("id", userId!);
                setStravaConnected(false);
              }}
              style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "#e05252", background: "rgba(224,82,82,0.08)", border: "0.5px solid rgba(224,82,82,0.3)", borderRadius: "20px", padding: "4px 12px", cursor: "pointer" }}
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => {
                const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
                const redirect = encodeURIComponent(`${window.location.origin}/api/strava/callback`);
                const scope = "activity:read_all";
                window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect}&response_type=code&scope=${scope}`;
              }}
              style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "#FC4C02", background: "rgba(252,76,2,0.08)", border: "0.5px solid rgba(252,76,2,0.3)", borderRadius: "20px", padding: "4px 12px", cursor: "pointer" }}
            >
              Connect
            </button>
          )}
        </div>

        {[
          { name: "Garmin Connect", color: "#4a9eff" },
          { name: "Apple Health", color: "#e05252" },
        ].map((item, i, arr) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderBottom: i < arr.length - 1 ? "0.5px solid var(--border)" : "none" }}>
            <span style={{ fontSize: "14px", color: "var(--text)" }}>{item.name}</span>
            <button style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "var(--text3)", background: "var(--bg3)", border: "0.5px solid var(--border)", borderRadius: "20px", padding: "4px 12px", cursor: "not-allowed" }}>
              Coming soon
            </button>
          </div>
        ))}
      </div>

      {/* Sign out */}
      <div style={{ padding: "0 16px 32px" }}>
        <button onClick={handleSignOut}
          style={{
            width: "100%", background: "transparent", color: "#e05252",
            fontWeight: 600, padding: "14px", borderRadius: "12px",
            border: "0.5px solid rgba(224,82,82,0.3)",
            cursor: "pointer", fontSize: "15px", fontFamily: "'Syne', sans-serif",
          }}
        >
          Sign Out
        </button>
      </div>

    </div>
  );
}