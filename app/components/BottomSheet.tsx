"use client";
import { useEffect } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 100,
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Sheet */}
      <div style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        background: "var(--bg2)",
        borderTop: "0.5px solid var(--border2)",
        borderRadius: "16px 16px 0 0",
        zIndex: 101,
        maxHeight: "90vh",
        overflowY: "auto",
        animation: "slideUp 0.25s ease",
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: "36px", height: "4px", background: "var(--border2)", borderRadius: "2px" }} />
        </div>

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "8px 20px 16px",
          borderBottom: "0.5px solid var(--border)",
        }}>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg3)", border: "none", borderRadius: "50%",
              width: "28px", height: "28px", cursor: "pointer",
              color: "var(--text2)", fontSize: "16px", lineHeight: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px" }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
    </>
  );
}