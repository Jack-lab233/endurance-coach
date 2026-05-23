"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import BottomSheet from "./BottomSheet";

export default function FloatingAction() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Position state
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const btnRef = useRef<HTMLDivElement>(null);
  const didDrag = useRef(false);

  // Hide on auth and onboarding pages
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
    if (!didDrag.current) {
      setOpen(!open);
    }
  };

  const actions = [
    { label: "Log Workout", icon: "🏃", key: "workout" },
    { label: "Add Race", icon: "🏁", key: "race" },
    { label: "Add Group Run", icon: "👥", key: "group" },
    { label: "Add Note", icon: "📝", key: "note" },
  ];

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 40,
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Action menu */}
      {open && (
        <div style={{
          position: "fixed",
          right: 20,
          bottom: 90,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          alignItems: "flex-end",
        }}>
          {actions.map((action, i) => (
            <div
              key={action.key}
              onClick={() => { setActiveModal(action.key); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                cursor: "pointer",
                animation: `slideUp 0.15s ease ${i * 0.04}s both`,
              }}
            >
              <span style={{
                background: "rgba(20,20,20,0.95)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", padding: "6px 12px",
                fontSize: "13px", color: "var(--text)",
                fontFamily: "'DM Mono', monospace",
                whiteSpace: "nowrap",
              }}>
                {action.label}
              </span>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "rgba(20,20,20,0.95)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px",
              }}>
                {action.icon}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Draggable FAB */}
      <div
        ref={btnRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          position: "fixed",
          right: 20 - pos.x,
          bottom: 80 - pos.y,
          zIndex: 51,
          width: "52px", height: "52px",
          borderRadius: "50%",
          background: open ? "#111" : "var(--green)",
          border: open ? "0.5px solid rgba(255,255,255,0.15)" : "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: dragging ? "grabbing" : "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          transition: dragging ? "none" : "background 0.2s ease",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <span style={{
          fontSize: "24px", color: open ? "var(--text)" : "#000",
          transition: "transform 0.2s ease",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          display: "block", lineHeight: 1,
        }}>
          +
        </span>
      </div>

      {/* Modals */}
      <BottomSheet isOpen={activeModal === "workout"} onClose={() => setActiveModal(null)} title="Log Workout">
        <p style={{ color: "var(--text2)", fontSize: "14px" }}>Workout logging coming soon.</p>
      </BottomSheet>

      <BottomSheet isOpen={activeModal === "race"} onClose={() => setActiveModal(null)} title="Add Race">
        <p style={{ color: "var(--text2)", fontSize: "14px" }}>Use the Races page to add a race.</p>
      </BottomSheet>

      <BottomSheet isOpen={activeModal === "group"} onClose={() => setActiveModal(null)} title="Add Group Run">
        <p style={{ color: "var(--text2)", fontSize: "14px" }}>Group run scheduling coming soon.</p>
      </BottomSheet>

      <BottomSheet isOpen={activeModal === "note"} onClose={() => setActiveModal(null)} title="Add Note">
        <NoteModal onClose={() => setActiveModal(null)} />
      </BottomSheet>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
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
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Write a note for your coach..."
        rows={4}
        style={{
          width: "100%", background: "var(--bg3)",
          border: "0.5px solid var(--border)", borderRadius: "10px",
          padding: "12px 14px", color: "var(--text)",
          fontSize: "14px", outline: "none", resize: "none",
          fontFamily: "'Syne', sans-serif", boxSizing: "border-box",
        }}
      />
      <button
        onClick={handleSave}
        style={{
          width: "100%", background: note.trim() ? "var(--green)" : "var(--bg3)",
          color: note.trim() ? "var(--green-text)" : "var(--text3)",
          fontWeight: 600, padding: "13px", borderRadius: "12px",
          border: "none", cursor: "pointer", fontSize: "15px",
          fontFamily: "'Syne', sans-serif",
        }}
      >
        Save Note
      </button>
    </div>
  );
}