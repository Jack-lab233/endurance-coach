"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import BottomSheet from "./BottomSheet";
import { supabase } from "../lib/supabase";

export default function FloatingAction() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const btnRef = useRef<HTMLDivElement>(null);
  const didDrag = useRef(false);

  if (pathname === "/auth" || pathname?.startsWith("/onboarding")) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    didDrag.current = false;
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDrag.current = true;
    setPos({ x: dragStart.current.px + dx, y: dragStart.current.py + dy });
  };

  const handlePointerUp = () => {
    setDragging(false);
    if (!didDrag.current) setOpen(!open);
  };

  const actions = [
    { label: "Log a Run", icon: "🏃", key: "workout" },
    { label: "Add Race", icon: "🏁", key: "race" },
    { label: "Add Note", icon: "📝", key: "note" },
  ];

  return (
    <>
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }} />
      )}

      {open && (
        <div style={{ position: "fixed", right: 20, bottom: 90, zIndex: 50, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
          {actions.map((action, i) => (
            <div key={action.key} onClick={() => {
              if (action.key === "race") { setOpen(false); router.push("/races"); return; }
              setActiveModal(action.key); setOpen(false);
            }} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", animation: `slideUp 0.15s ease ${i * 0.04}s both` }}>
              <span style={{ background: "rgba(20,20,20,0.95)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "6px 12px", fontSize: "13px", color: "var(--text)", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>
                {action.label}
              </span>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(20,20,20,0.95)", border: "0.5px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                {action.icon}
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        ref={btnRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ position: "fixed", right: 20 - pos.x, bottom: 80 - pos.y, zIndex: 51, width: "52px", height: "52px", borderRadius: "50%", background: open ? "#111" : "var(--green)", border: open ? "0.5px solid rgba(255,255,255,0.15)" : "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: dragging ? "grabbing" : "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", transition: dragging ? "none" : "background 0.2s ease", userSelect: "none", touchAction: "none" }}
      >
        <span style={{ fontSize: "24px", color: open ? "var(--text)" : "#000", transition: "transform 0.2s ease", transform: open ? "rotate(45deg)" : "rotate(0deg)", display: "block", lineHeight: 1 }}>+</span>
      </div>

      <BottomSheet isOpen={activeModal === "workout"} onClose={() => setActiveModal(null)} title="Log a Run">
        <LogRunModal onClose={() => setActiveModal(null)} />
      </BottomSheet>

      <BottomSheet isOpen={activeModal === "note"} onClose={() => setActiveModal(null)} title="Add Note">
        <NoteModal onClose={() => setActiveModal(null)} />
      </BottomSheet>

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}

function LogRunModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    distance: "",
    hours: "",
    minutes: "",
    seconds: "",
    feel: "3",
    notes: "",
    type: "easy",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const runTypes = [
    { id: "easy", label: "Easy", color: "#4a9eff" },
    { id: "tempo", label: "Tempo", color: "#f0a830" },
    { id: "hard", label: "Hard", color: "#e05252" },
    { id: "long", label: "Long", color: "#a78bfa" },
    { id: "race", label: "Race", color: "#1fcc8a" },
  ];

  const feelLabels: Record<string, string> = { "1": "😫 Very Hard", "2": "😓 Hard", "3": "😐 Moderate", "4": "🙂 Good", "5": "😄 Great" };

  const handleSave = async () => {
    if (!form.distance) return;
    setSaving(true);

    const totalMinutes = (parseInt(form.hours || "0") * 60) + parseInt(form.minutes || "0") + (parseInt(form.seconds || "0") / 60);
    const distKm = parseFloat(form.distance);
    const avgPaceSeconds = totalMinutes > 0 && distKm > 0 ? (totalMinutes * 60) / distKm : null;

    const run = {
      id: `run_${Date.now()}`,
      date: form.date,
      distance_km: distKm,
      duration_minutes: Math.round(totalMinutes),
      avg_pace_seconds: avgPaceSeconds ? Math.round(avgPaceSeconds) : null,
      feel: parseInt(form.feel),
      notes: form.notes,
      type: form.type,
      source: "manual",
      created_at: new Date().toISOString(),
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem("manual_runs") || "[]");
    existing.unshift(run);
    localStorage.setItem("manual_runs", JSON.stringify(existing));

    // Try save to Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("workouts").insert({
          user_id: user.id,
          date: run.date,
          distance_km: run.distance_km,
          duration_minutes: run.duration_minutes,
          avg_pace_seconds: run.avg_pace_seconds,
          feel: run.feel,
          notes: run.notes || null,
          workout_type: run.type,
          source: "manual",
        });
      }
    } catch (e) {
      // localStorage fallback already saved
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  if (saved) return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <p style={{ fontSize: "36px", marginBottom: "10px" }}>✓</p>
      <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--green)" }}>Run logged!</p>
      <p style={{ fontSize: "13px", color: "var(--text3)", marginTop: "4px", fontFamily: "'DM Mono', monospace" }}>{form.distance}km added to your week</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Date */}
      <div>
        <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Date</p>
        <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "0.5px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: "14px", outline: "none", fontFamily: "'DM Mono', monospace", boxSizing: "border-box" }}
        />
      </div>

      {/* Distance */}
      <div>
        <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Distance (km) *</p>
        <input type="number" placeholder="0.0" step="0.1" value={form.distance} onChange={e => setForm(f => ({ ...f, distance: e.target.value }))}
          style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: `0.5px solid ${!form.distance ? "var(--border)" : "var(--green)"}`, background: "var(--bg3)", color: "var(--text)", fontSize: "18px", fontWeight: 700, outline: "none", fontFamily: "'DM Mono', monospace", boxSizing: "border-box" }}
        />
      </div>

      {/* Time */}
      <div>
        <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Time (optional)</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          {[
            { key: "hours", placeholder: "0", label: "hrs" },
            { key: "minutes", placeholder: "00", label: "min" },
            { key: "seconds", placeholder: "00", label: "sec" },
          ].map(f => (
            <div key={f.key}>
              <input type="number" placeholder={f.placeholder} min="0"
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "0.5px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: "16px", fontWeight: 600, outline: "none", fontFamily: "'DM Mono', monospace", textAlign: "center", boxSizing: "border-box" }}
              />
              <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textAlign: "center", marginTop: "3px" }}>{f.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Run Type</p>
        <div style={{ display: "flex", gap: "6px" }}>
          {runTypes.map(t => (
            <button key={t.id} onClick={() => setForm(f => ({ ...f, type: t.id }))}
              style={{ flex: 1, padding: "8px 4px", borderRadius: "8px", border: "0.5px solid", borderColor: form.type === t.id ? t.color : "var(--border)", background: form.type === t.id ? `${t.color}18` : "var(--bg3)", color: form.type === t.id ? t.color : "var(--text3)", fontSize: "11px", cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feel */}
      <div>
        <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
          How did it feel? — <span style={{ color: "var(--text2)" }}>{feelLabels[form.feel]}</span>
        </p>
        <input type="range" min="1" max="5" value={form.feel} onChange={e => setForm(f => ({ ...f, feel: e.target.value }))}
          style={{ width: "100%", accentColor: "var(--green)" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>Very Hard</span>
          <span style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>Great</span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Notes (optional)</p>
        <textarea placeholder="How did it go? Any aches, highlights..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
          style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "0.5px solid var(--border)", background: "var(--bg3)", color: "var(--text)", fontSize: "13px", outline: "none", fontFamily: "'Syne', sans-serif", boxSizing: "border-box", resize: "none", lineHeight: 1.5 }}
        />
      </div>

      <button onClick={handleSave} disabled={!form.distance || saving}
        style={{ width: "100%", background: form.distance ? "var(--green)" : "var(--bg3)", color: form.distance ? "var(--green-text)" : "var(--text3)", fontWeight: 600, padding: "14px", borderRadius: "12px", border: "none", cursor: form.distance ? "pointer" : "not-allowed", fontSize: "15px", fontFamily: "'Syne', sans-serif", opacity: saving ? 0.7 : 1 }}>
        {saving ? "Saving..." : "Log Run"}
      </button>
    </div>
  );
}

function NoteModal({ onClose }: { onClose: () => void }) {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!note.trim()) return;
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    notes.push({ id: Date.now(), text: note, date: new Date().toISOString() });
    localStorage.setItem("notes", JSON.stringify(notes));
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1000);
  };

  if (saved) return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <p style={{ fontSize: "28px" }}>📝</p>
      <p style={{ color: "var(--green)", fontWeight: 600, marginTop: "8px" }}>Note saved!</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Write a note about your training..." rows={4}
        style={{ width: "100%", background: "var(--bg3)", border: "0.5px solid var(--border)", borderRadius: "10px", padding: "12px 14px", color: "var(--text)", fontSize: "14px", outline: "none", resize: "none", fontFamily: "'Syne', sans-serif", boxSizing: "border-box" }}
      />
      <button onClick={handleSave}
        style={{ width: "100%", background: note.trim() ? "var(--green)" : "var(--bg3)", color: note.trim() ? "var(--green-text)" : "var(--text3)", fontWeight: 600, padding: "13px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "15px", fontFamily: "'Syne', sans-serif" }}>
        Save Note
      </button>
    </div>
  );
}