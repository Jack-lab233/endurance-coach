"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/");
    });
  }, [router]);

  async function handleEmailAuth() {
    setLoading(true);
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      console.log("Signup result:", { data, error });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Check your email for a confirmation link!");
      }
    } else {
   const { data, error } = await supabase.auth.signInWithPassword({ email, password });
console.log("Login result:", { data, error });
if (error) {
  setError(error.message);
} else {
  window.location.href = "/";
}
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 20px",
      position: "relative",
      overflow: "hidden",
    }}>

      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
        <div style={{
          position: "absolute", width: "600px", height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,255,127,0.08) 0%, transparent 70%)",
          top: "-200px", left: "-150px",
          animation: "pulse 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: "400px", height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,255,127,0.05) 0%, transparent 70%)",
          bottom: "-100px", right: "-100px",
          animation: "pulse 10s ease-in-out infinite reverse",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }} />
      </div>

      <div style={{
        position: "relative", zIndex: 1,
        textAlign: "center", marginBottom: "32px",
        animation: "fadeUp 0.6s ease both",
      }}>
        <div style={{
          width: "52px", height: "52px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, #00ff7f 0%, #00cc66 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 14px",
          boxShadow: "0 0 30px rgba(0,255,127,0.3)",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="4" r="1.5"/>
            <path d="M8 20l2-6 2 2 3-4"/>
            <path d="M6 12l2-3 3 1 2-3"/>
          </svg>
        </div>
        <h1 style={{
          fontSize: "22px", fontWeight: 700, color: "#fff",
          letterSpacing: "-0.02em", fontFamily: "'Syne', sans-serif", margin: 0,
        }}>EnduranceCoach</h1>
        <p style={{
          fontSize: "12px", color: "rgba(255,255,255,0.35)",
          fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em",
          marginTop: "4px", textTransform: "uppercase",
        }}>Train smarter. Race faster.</p>
      </div>

      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: "400px",
        background: "rgba(16,16,16,0.9)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        padding: "28px 24px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        animation: "fadeUp 0.7s ease 0.1s both",
      }}>

        <div style={{
          display: "flex",
          background: "rgba(255,255,255,0.04)",
          borderRadius: "10px",
          padding: "3px",
          marginBottom: "24px",
        }}>
          {(["login", "signup"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setMode(tab); setError(""); setMessage(""); }}
              style={{
                flex: 1, padding: "9px", borderRadius: "8px",
                cursor: "pointer", fontSize: "13px", fontWeight: 600,
                fontFamily: "'Syne', sans-serif", letterSpacing: "0.02em",
                transition: "all 0.2s ease",
                background: mode === tab ? "rgba(0,255,127,0.12)" : "transparent",
                color: mode === tab ? "#00ff7f" : "rgba(255,255,255,0.4)",
                outline: "none",
                border: mode === tab ? "0.5px solid rgba(0,255,127,0.2)" : "0.5px solid transparent",
              }}
            >
              {tab === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{
            display: "block", marginBottom: "6px",
            fontSize: "11px", color: "rgba(255,255,255,0.4)",
            fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            onKeyDown={e => e.key === "Enter" && handleEmailAuth()}
            style={{
              width: "100%", padding: "13px 14px", borderRadius: "10px",
              border: "0.5px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)", color: "#fff",
              fontSize: "14px", fontFamily: "'DM Mono', monospace",
              outline: "none", boxSizing: "border-box",
            }}
            onFocus={e => (e.target.style.borderColor = "rgba(0,255,127,0.4)")}
            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block", marginBottom: "6px",
            fontSize: "11px", color: "rgba(255,255,255,0.4)",
            fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === "Enter" && handleEmailAuth()}
            style={{
              width: "100%", padding: "13px 14px", borderRadius: "10px",
              border: "0.5px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)", color: "#fff",
              fontSize: "14px", fontFamily: "'DM Mono', monospace",
              outline: "none", boxSizing: "border-box",
            }}
            onFocus={e => (e.target.style.borderColor = "rgba(0,255,127,0.4)")}
            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>

        {error && (
          <div style={{
            marginBottom: "16px", padding: "11px 14px", borderRadius: "8px",
            background: "rgba(255,60,60,0.1)", border: "0.5px solid rgba(255,60,60,0.2)",
            color: "#ff6b6b", fontSize: "13px", fontFamily: "'DM Mono', monospace",
          }}>{error}</div>
        )}
        {message && (
          <div style={{
            marginBottom: "16px", padding: "11px 14px", borderRadius: "8px",
            background: "rgba(0,255,127,0.08)", border: "0.5px solid rgba(0,255,127,0.2)",
            color: "#00ff7f", fontSize: "13px", fontFamily: "'DM Mono', monospace",
          }}>{message}</div>
        )}

        <button
          onClick={handleEmailAuth}
          disabled={loading}
          style={{
            width: "100%", padding: "14px", borderRadius: "12px", border: "none",
            background: loading ? "rgba(0,255,127,0.3)" : "linear-gradient(135deg, #00ff7f 0%, #00cc66 100%)",
            color: "#000", fontSize: "15px", fontWeight: 700,
            fontFamily: "'Syne', sans-serif", cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.02em",
            boxShadow: loading ? "none" : "0 4px 24px rgba(0,255,127,0.25)",
            transition: "all 0.2s ease",
          }}
        >
          {loading ? "Loading..." : mode === "login" ? "Log In" : "Create Account"}
        </button>

        {mode === "login" && (
          <p style={{
            textAlign: "center", marginTop: "16px",
            fontSize: "12px", color: "rgba(255,255,255,0.25)",
            fontFamily: "'DM Mono', monospace",
          }}>
            <span
              onClick={async () => {
                if (!email) { setError("Enter your email above first."); return; }
                const { error } = await supabase.auth.resetPasswordForEmail(email);
                if (error) setError(error.message);
                else setMessage("Password reset email sent!");
              }}
              style={{ color: "rgba(0,255,127,0.6)", cursor: "pointer", textDecoration: "underline" }}
            >
              Forgot password?
            </span>
          </p>
        )}
      </div>

      <p style={{
        position: "relative", zIndex: 1, marginTop: "24px",
        fontSize: "11px", color: "rgba(255,255,255,0.2)",
        fontFamily: "'DM Mono', monospace", textAlign: "center",
        animation: "fadeUp 0.8s ease 0.2s both",
      }}>
        By continuing you agree to our Terms & Privacy Policy
      </p>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}