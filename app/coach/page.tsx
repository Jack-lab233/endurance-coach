"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "coach" | "user";
  content: string;
  time: string;
}

const getTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const smartReply = (msg: string, personality: string): string => {
  const m = msg.toLowerCase();
  const isTough = personality === "tough";
  const isCalm = personality === "calm";
  const isElite = personality === "elite";
  const isCompetitive = personality === "competitive";

  if (m.includes("tired") || m.includes("fatigue") || m.includes("exhausted")) {
    if (isTough) return "Tired is just a feeling. Your body can do more than your mind thinks. Get the session done.";
    if (isCalm) return "Fatigue at this stage of training is expected. Your HRV data would confirm if this is acute or cumulative. How is your sleep?";
    if (isElite) return "Rate your fatigue 1–10. If it's above 7, we swap today's session to an easy 6km. Below 7, you execute as planned.";
    return "It's totally normal to feel tired mid-block. Listen to your body — if you need an easy day, that's okay. Recovery is part of the plan.";
  }

  if (m.includes("pace") || m.includes("fast") || m.includes("speed")) {
    if (isTough) return "Stop chasing pace on easy days. Run easy runs EASY. Save the legs for when it counts.";
    if (isCalm) return "Pace is an output of fitness. Focus on effort and heart rate — pace will come naturally as your aerobic base develops.";
    if (isElite) return "At your current fitness, target 6:45–7:00/km for easy runs. Tempo sessions should be 5:00–5:15/km. Intervals at 4:30–4:45/km.";
    return "Great question! For easy runs, don't worry too much about pace — keep HR below 145 and run comfortably. Pace will improve naturally.";
  }

  if (m.includes("knysna") || m.includes("race") || m.includes("marathon")) {
    if (isTough) return "Knysna is brutal. The first 15km climbs hard. Go out easy or you will blow up. That's not a suggestion.";
    if (isCalm) return "For Knysna, the key variable is elevation. 1,240m of gain requires a conservative first half strategy. Power hiking steep sections is faster than running them hard.";
    if (isElite) return "Target 5:30–5:40/km on flat sections. Power hike anything above 12% gradient. Save your legs for km 25 onwards when others fade.";
    return "Knysna is an incredible race! The forest section is beautiful but challenging. Start conservatively, enjoy the scenery, and save energy for the final stretch.";
  }

  if (m.includes("plan") || m.includes("next week") || m.includes("schedule")) {
    if (isTough) return "The plan is the plan. Trust the process. We don't deviate unless you're injured.";
    if (isCalm) return "Your plan is periodised across 16 weeks. Each block builds on the last. If you want I can explain the rationale behind next week's sessions?";
    if (isElite) return "Next week is threshold focus. Two quality sessions: Tuesday tempo 10km and Friday 6×1000m intervals. Long run Saturday 24km. Total 68km.";
    return "Next week we step things up slightly! Two quality sessions and a longer long run. You're building really well — keep it consistent!";
  }

  if (m.includes("miss") || m.includes("skip") || m.includes("can't run")) {
    if (isTough) return "Missing sessions costs you fitness. What's the actual reason? Let's solve it.";
    if (isCalm) return "A missed session isn't a disaster. We redistribute the load. Which day are you missing and I'll adjust the week accordingly.";
    if (isElite) return "One missed session has minimal impact on fitness. We'll move the quality work to the next available day and reduce the long run by 2km.";
    return "Don't stress about missing a session — life happens! Let me know which one and we'll shuffle the week around so you don't lose fitness.";
  }

  if (m.includes("injury") || m.includes("pain") || m.includes("hurt") || m.includes("sore")) {
    return "Pain that doesn't go away with warmup is a red flag. Please describe where it is and when it started. If it's sharp or affects your gait, rest today and see a physio.";
  }

  if (m.includes("weight") || m.includes("diet") || m.includes("nutrition") || m.includes("food")) {
    if (isCalm) return "Nutrition is the fourth discipline. For marathon training, prioritise carbohydrate availability around hard sessions and adequate protein for recovery. 1.6g protein per kg bodyweight is a good target.";
    return "Fuelling well is crucial at this training volume. Make sure you're eating enough — many runners under-fuel during heavy weeks. Prioritise carbs around your hard sessions.";
  }

  if (m.includes("hello") || m.includes("hi") || m.includes("hey")) {
    if (isTough) return "Let's get to it. What do you need?";
    if (isCalm) return "Hello. How can I assist with your training today?";
    return "Hey! Great to hear from you. How are you feeling today? Ready to talk training?";
  }

  if (isTough) return "Good question. Push through the doubt — that's where growth happens. What else?";
  if (isCalm) return "That's a reasonable concern. Based on your training data and current load, I'd suggest we monitor this over the next 48 hours before making any changes.";
  if (isElite) return "Noted. Based on your current metrics, the recommendation is to stay the course. Your training is tracking well against the target race pace.";
  if (isCompetitive) return "Every question you ask makes you better than the runners who aren't asking. You're building the edge. Keep pushing.";
  return "That's a great question! Your training is going really well — you should feel proud of the consistency you've shown. What else is on your mind?";
};

const personalityConfig: Record<string, { name: string; greeting: string; badge: string; color: string }> = {
  supportive: { name: "Coach AI", badge: "Supportive", color: "#1fcc8a", greeting: "Hey Connor! Great tempo run yesterday — you held 5:12/km for the last 3km. Today is your easy run, keep it conversational. How are your legs feeling?" },
  tough: { name: "Coach", badge: "Tough Love", color: "#e05252", greeting: "Connor. Yesterday's tempo was acceptable. Today is easy — Zone 2, no excuses. Don't make it harder than it needs to be. What do you need?" },
  elite: { name: "Performance Coach", badge: "Elite", color: "#4a9eff", greeting: "Training log reviewed. Yesterday: tempo 10km, avg pace 5:14/km, HR avg 162bpm. Today: recovery run 6km, HR cap 140bpm. Executing?" },
  calm: { name: "Coach", badge: "Calm & Scientific", color: "#a78bfa", greeting: "Good morning Connor. Yesterday's threshold session produced solid lactate clearance data. Today's easy run serves active recovery. How is your perceived fatigue on a scale of 1–10?" },
  competitive: { name: "Coach", badge: "Competitive", color: "#f0a830", greeting: "Connor. While others rest, you train. Yesterday's tempo put you ahead of 80% of marathon runners your age. Today we recover smart so we can attack harder tomorrow. Ready?" },
  beginner: { name: "Coach", badge: "Beginner Friendly", color: "#1fcc8a", greeting: "Hi Connor! You're doing so well — every run counts and you should be really proud. Today is an easy run which means nice and comfortable. No pressure at all. How are you feeling?" },
};

export default function CoachPage() {
  const [personality, setPersonality] = useState("supportive");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const config = personalityConfig[personality] || personalityConfig.supportive;

  useEffect(() => {
    const saved = localStorage.getItem("coachPersonality") || "supportive";
    setPersonality(saved);
    const savedConfig = personalityConfig[saved] || personalityConfig.supportive;
    setMessages([{ role: "coach", content: savedConfig.greeting, time: getTime() }]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const reply = smartReply(input, personality);
      setMessages(prev => [...prev, { role: "coach", content: reply, time: getTime() }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const quickQuestions = [
    "How should I pace Knysna?",
    "I'm feeling tired today",
    "Adjust my plan for next week",
    "What should I eat before a long run?",
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ padding: "52px 16px 12px", borderBottom: "0.5px solid var(--border)" }}>
        <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          AI Powered
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>
            {config.name}
          </h1>
          <span style={{
            fontSize: "10px", fontFamily: "'DM Mono', monospace",
            color: config.color, background: `${config.color}18`,
            border: `0.5px solid ${config.color}40`,
            padding: "4px 10px", borderRadius: "20px",
          }}>
            {config.badge}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "160px" }}>

        {/* Quick questions (only show at start) */}
        {messages.length <= 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
            <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
              Quick questions
            </p>
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => { setInput(q); }}
                style={{
                  background: "var(--bg2)", border: "0.5px solid var(--border)",
                  borderRadius: "10px", padding: "10px 14px",
                  color: "var(--text2)", fontSize: "13px",
                  cursor: "pointer", textAlign: "left",
                  fontFamily: "'Syne', sans-serif",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                {q}
                <span style={{ color: "var(--text3)" }}>›</span>
              </button>
            ))}
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            flexDirection: msg.role === "user" ? "row-reverse" : "row",
            gap: "8px",
            alignItems: "flex-end",
          }}>
            {msg.role === "coach" && (
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: "var(--green-dim)", border: "0.5px solid rgba(31,204,138,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", flexShrink: 0,
              }}>
                🤖
              </div>
            )}
            <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: "3px", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                background: msg.role === "user" ? "var(--green)" : "var(--bg2)",
                color: msg.role === "user" ? "var(--green-text)" : "var(--text)",
                border: msg.role === "coach" ? "0.5px solid var(--border)" : "none",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                padding: "10px 14px",
                fontSize: "14px", lineHeight: 1.5,
              }}>
                {msg.content}
              </div>
              <span style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "var(--green-dim)", border: "0.5px solid rgba(31,204,138,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", flexShrink: 0,
            }}>🤖</div>
            <div style={{
              background: "var(--bg2)", border: "0.5px solid var(--border)",
              borderRadius: "16px 16px 16px 4px", padding: "12px 16px",
              display: "flex", gap: "4px", alignItems: "center",
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: "var(--text3)",
                  animation: `bounce 1s infinite ${i * 0.15}s`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        position: "fixed", bottom: "72px", left: 0, right: 0,
        maxWidth: "480px", margin: "0 auto",
        padding: "12px 16px",
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "0.5px solid var(--border)",
      }}>
        <div style={{
          display: "flex", gap: "10px", alignItems: "center",
          background: "var(--bg2)", border: "0.5px solid var(--border)",
          borderRadius: "14px", padding: "8px 8px 8px 16px",
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask your coach anything..."
            style={{
              flex: 1, background: "transparent", border: "none",
              outline: "none", color: "var(--text)", fontSize: "14px",
              fontFamily: "'Syne', sans-serif",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              background: input.trim() ? "var(--green)" : "var(--bg3)",
              color: input.trim() ? "var(--green-text)" : "var(--text3)",
              border: "none", borderRadius: "10px",
              padding: "8px 16px", cursor: "pointer",
              fontSize: "13px", fontWeight: 600,
              fontFamily: "'Syne', sans-serif",
              transition: "all 0.15s",
            }}
          >
            Send
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}