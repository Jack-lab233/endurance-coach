"use client";
import { useState } from "react";
import BottomSheet from "./BottomSheet";
import { saveRace } from "../lib/raceStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function AddRaceModal({ isOpen, onClose, onSaved }: Props) {
  const [form, setForm] = useState({ name: "", date: "", distance: "Marathon", surface: "Road", goalTime: "", location: "" });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!form.name || !form.date) return;
    saveRace({ ...form, id: Date.now().toString() });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setForm({ name: "", date: "", distance: "Marathon", surface: "Road", goalTime: "", location: "" });
      onSaved();
      onClose();
    }, 1200);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Add Race">
      {saved ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <p style={{ fontSize: "32px", marginBottom: "8px" }}>🏁</p>
          <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--green)" }}>Race added!</p>
          <p style={{ fontSize: "13px", color: "var(--text2)", marginTop: "4px" }}>Your training plan will be built around this race.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            { label: "Race Name *", key: "name", type: "text", placeholder: "Cape Town Marathon" },
            { label: "Date *", key: "date", type: "date", placeholder: "" },
            { label: "Location", key: "location", type: "text", placeholder: "Cape Town City Centre" },
            { label: "Goal Time", key: "goalTime", type: "text", placeholder: "3:45:00" },
          ].map(field => (
            <div key={field.key}>
              <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                {field.label}
              </p>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key as keyof typeof form]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                style={{
                  width: "100%", background: "var(--bg3)",
                  border: "0.5px solid var(--border)", borderRadius: "10px",
                  padding: "12px 14px", color: "var(--text)",
                  fontSize: "14px", outline: "none",
                  fontFamily: "'Syne', sans-serif", boxSizing: "border-box",
                }}
              />
            </div>
          ))}

          <div>
            <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
              Distance
            </p>
            <select
              value={form.distance}
              onChange={e => setForm({ ...form, distance: e.target.value })}
              style={{ width: "100%", background: "var(--bg3)", border: "0.5px solid var(--border)", borderRadius: "10px", padding: "12px 14px", color: "var(--text)", fontSize: "14px", outline: "none", fontFamily: "'Syne', sans-serif" }}
            >
              {["5km", "10km", "Half Marathon", "Marathon", "50km", "100km", "Other"].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
              Surface
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {["Road", "Trail", "Track", "Mixed"].map(s => (
                <button
                  key={s}
                  onClick={() => setForm({ ...form, surface: s })}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: "10px",
                    border: "0.5px solid",
                    borderColor: form.surface === s ? "var(--green)" : "var(--border)",
                    background: form.surface === s ? "var(--green-dim)" : "var(--bg3)",
                    color: form.surface === s ? "var(--green)" : "var(--text2)",
                    fontSize: "12px", cursor: "pointer",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            style={{
              width: "100%", background: form.name && form.date ? "var(--green)" : "var(--bg3)",
              color: form.name && form.date ? "var(--green-text)" : "var(--text3)",
              fontWeight: 600, padding: "14px", borderRadius: "12px",
              border: "none", cursor: "pointer", fontSize: "15px",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Add Race
          </button>
        </div>
      )}
    </BottomSheet>
  );
}