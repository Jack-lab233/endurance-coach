"use client";
import { useState } from "react";
import AddRaceModal from "./AddRaceModal";
import BottomSheet from "./BottomSheet";

export default function FloatingAction() {
  const [open, setOpen] = useState(false);
  const [showRace, setShowRace] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [logForm, setLogForm] = useState({ distance: "", time: "", type: "Easy", effort: "3" });
  const [noteText, setNoteText] = useState("");
  const [logSaved, setLogSaved] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  const actions = [
    { label: "Log Workout", icon: "🏃", onClick: () => { setShowLog(true); setOpen(false); } },
    { label: "Add Race", icon: "🏁", onClick: () => { setShowRace(true); setOpen(false); } },
    { label: "Add Group Run", icon: "👥", onClick: () => { setOpen(false); window.location.href = "/training"; } },
    { label: "Add Note", icon: "📝", onClick: () => { setShowNote(true); setOpen(false); } },
  ];

  const handleLogSave = () => {
    const logs = JSON.parse(localStorage.getItem("workoutLogs") || "[]");
    logs.push({ ...logForm, date: new Date().toISOString(), id: Date.now().toString() });
    localStorage.setItem("workoutLogs", JSON.stringify(logs));
    setLogSaved(true);
    setTimeout(() => { setLogSaved(false); setShowLog(false); setLogForm({ distance: "", time: "", type: "Easy", effort: "3" }); }, 1500);
  };

  const handleNoteSave = () => {
    const notes = JSON.parse(localStorage.getItem("coachNotes") || "[]");
    notes.push({ text: noteText, date: new Date().toISOString(), id: Date.now().toString() });
    localStorage.setItem("coachNotes", JSON.stringify(notes));
    setNoteSaved(true);
    setTimeout(() => { setNoteSaved(false); setShowNote(false); setNoteText(""); }, 1500);
  };

  return (
    <>
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 48 }} />
      )}

      {open && (
        <div style={{ position: "fixed", bottom: "90px", right: "calc(50% - 220px)", zIndex: 49, display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
          {actions.map((action, i) => (
            <div key={i} onClick={action.onClick} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", animation: `fadeSlideIn 0.15s ease ${i * 0.04}s both` }}>
              <span style={{ background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "20px", padding: "6px 14px", fontSize: "13px", color: "var(--text)", fontFamily: "'Syne', sans-serif", whiteSpace: "nowrap" }}>
                {action.label}
              </span>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--bg2)", border: "0.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                {action.icon}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        style={{ position: "fixed", bottom: "90px", left: "50%", transform: `translateX(180px) rotate(${open ? "45deg" : "0deg"})`, width: "48px", height: "48px", borderRadius: "50%", background: "var(--green)", border: "none", cursor: "pointer", zIndex: 50, fontSize: "24px", color: "var(--green-text)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(31,204,138,0.3)", transition: "transform 0.2s ease", fontWeight: 300 }}
      >
        +
      </button>

      {/* Add Race Modal */}
      <AddRaceModal isOpen={showRace} onClose={() => setShowRace(false)} onSaved={() => {}} />

      {/* Log Workout Modal */}
      <BottomSheet isOpen={showLog} onClose={() => setShowLog(false)} title="Log Workout">
        {logSaved ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ fontSize: "32px", marginBottom: "8px" }}>✓</p>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--green)" }}>Workout logged!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { label: "Distance (km)", key: "distance", placeholder: "8.5" },
              { label: "Time", key: "time", placeholder: "56:30" },
            ].map(f => (
              <div key={f.key}>
                <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{f.label}</p>
                <input type="text" placeholder={f.placeholder} value={logForm[f.key as keyof typeof logForm]} onChange={e => setLogForm({ ...logForm, [f.key]: e.target.value })}
                  style={{ width: "100%", background: "var(--bg3)", border: "0.5px solid var(--border)", borderRadius: "10px", padding: "12px 14px", color: "var(--text)", fontSize: "14px", outline: "none", fontFamily: "'Syne', sans-serif", boxSizing: "border-box" as any }} />
              </div>
            ))}
            <div>
              <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Type</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {["Easy", "Tempo", "Intervals", "Long", "Group"].map(t => (
                  <button key={t} onClick={() => setLogForm({ ...logForm, type: t })} style={{ padding: "8px 14px", borderRadius: "20px", border: "0.5px solid", borderColor: logForm.type === t ? "var(--green)" : "var(--border)", background: logForm.type === t ? "var(--green-dim)" : "var(--bg3)", color: logForm.type === t ? "var(--green)" : "var(--text2)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Effort (1–5)</p>
              <div style={{ display: "flex", gap: "8px" }}>
                {["1", "2", "3", "4", "5"].map(e => (
                  <button key={e} onClick={() => setLogForm({ ...logForm, effort: e })} style={{ flex: 1, padding: "10px 0", borderRadius: "10px", border: "0.5px solid", borderColor: logForm.effort === e ? "var(--green)" : "var(--border)", background: logForm.effort === e ? "var(--green-dim)" : "var(--bg3)", color: logForm.effort === e ? "var(--green)" : "var(--text2)", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>{e}</button>
                ))}
              </div>
            </div>
            <button onClick={handleLogSave} style={{ width: "100%", background: "var(--green)", color: "var(--green-text)", fontWeight: 600, padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "15px", fontFamily: "'Syne', sans-serif" }}>
              Save Workout
            </button>
          </div>
        )}
      </BottomSheet>

      {/* Add Note Modal */}
      <BottomSheet isOpen={showNote} onClose={() => setShowNote(false)} title="Add Note">
        {noteSaved ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ fontSize: "32px", marginBottom: "8px" }}>📝</p>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--green)" }}>Note saved!</p>
            <p style={{ fontSize: "13px", color: "var(--text2)", marginTop: "4px" }}>Your coach will see this context.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <p style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Note</p>
              <textarea
                placeholder="e.g. Left knee feeling tight after yesterday's run..."
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                rows={5}
                style={{ width: "100%", background: "var(--bg3)", border: "0.5px solid var(--border)", borderRadius: "10px", padding: "12px 14px", color: "var(--text)", fontSize: "14px", outline: "none", fontFamily: "'Syne', sans-serif", boxSizing: "border-box" as any, resize: "none" }}
              />
            </div>
            <div style={{ background: "var(--green-dim)", border: "0.5px solid rgba(31,204,138,0.2)", borderRadius: "10px", padding: "12px" }}>
              <p style={{ fontSize: "12px", color: "var(--green)", lineHeight: 1.6 }}>This note will be shared with your AI coach to provide better personalised advice.</p>
            </div>
            <button onClick={handleNoteSave} style={{ width: "100%", background: noteText.trim() ? "var(--green)" : "var(--bg3)", color: noteText.trim() ? "var(--green-text)" : "var(--text3)", fontWeight: 600, padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "15px", fontFamily: "'Syne', sans-serif" }}>
              Save Note
            </button>
          </div>
        )}
      </BottomSheet>

      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}