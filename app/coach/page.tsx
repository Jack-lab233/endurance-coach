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
    if (isCalm) return "Fatigue at this stage of training is expected. How is your sleep been? That's usually the first place to look.";
    if (isElite) return "Rate your fatigue 1–10. If it's above 7, we swap today's session to an easy 6km. Below 7, you execute as planned.";
    return "It's totally normal to feel tired mid-block. Listen to your body — if you need an easy day, that's okay. Recovery is part of the plan.";
  }

  if (m.includes("pace") || m.includes("fast") || m.includes("speed")) {
    if (isTough) return "Stop chasing pace on easy days. Run easy runs EASY. Save the legs for when it counts.";
    if (isCalm) return "Pace is an output of fitness. Focus on effort and heart rate — pace will come naturally as your aerobic base develops.";
    if (isElite) return "Focus on effort zones rather than pace for now. As your fitness builds, target paces will become more meaningful.";
    return "Great question! For easy runs, don't worry too much about pace — keep effort comfortable and conversational. Pace will improve naturally.";
  }

  if (m.includes("race") || m.includes("marathon") || m.includes("half")) {
    if (isTough) return "Races are won in training. Do the work now and the race takes care of itself.";
    if (isCalm) return "Race strategy depends heavily on your training data and the course profile. What race are you preparing for?";
    if (isElite) return "Start conservatively — first half should feel almost too easy. Save your legs for the final third.";
    return "Race day is going to be amazing! The key is to start conservatively and build confidence as you go. What race are you targeting?";
  }

  if (m.includes("plan") || m.includes("next week") || m.includes("schedule")) {
    if (isTough) return "The plan is the plan. Trust the process. We don't deviate unless you're injured.";
    if (isCalm) return "Your plan is periodised to build progressively. Each block builds on the last. Want me to explain the rationale behind upcoming sessions?";
    if (isElite) return "Stick to the structure. Quality sessions Tuesday and Friday, long run Saturday. Everything else is recovery.";
    return "Your plan is building really well! Consistency is the most important thing — keep showing up and the fitness will come.";
  }

  if (m.includes("miss") || m.includes("skip") || m.includes("can't run")) {
    if (isTough) return "Missing sessions costs you fitness. What's the actual reason? Let's solve it.";
    if (isCalm) return "A missed session isn't a disaster. Which day are you missing and I'll help you think through adjusting the week.";
    if (isElite) return "One missed session has minimal impact on fitness. Prioritise the quality sessions and reduce easy volume if needed.";
    return "Don't stress about missing a session — life happens! The most important thing is getting back out there. Which session are you worried about?";
  }

  if (m.includes("injury") || m.includes("pain") || m.includes("hurt") || m.includes("sore")) {
    return "Pain that doesn't go away with warmup is a red flag. Please describe where it is and when it started. If it's sharp or affects your gait, rest today and see a physio.";
  }

  if (m.includes("weight") || m.includes("diet") || m.includes("nutrition") || m.includes("food") || m.includes("eat")) {
    if (isCalm) return "Nutrition is the fourth discipline. Prioritise carbohydrate availability around hard sessions and adequate protein for recovery — around 1.6g per kg bodyweight is a good target.";
    return "Fuelling well is crucial at this training volume. Make sure you're eating enough — many runners under-fuel during heavy weeks. Prioritise carbs around your hard sessions.";
  }

  if (m.includes("focus") || m.includes("this week") || m.includes("should i")) {
    if (isTough) return "Execute the sessions as prescribed. Don't overthink it. Consistency beats perfection.";
    if (isCalm) return "This week focus on hitting your easy runs truly easy. Most runners run their easy days too hard — that's where gains get lost.";
    if (isElite) return "This week: nail the quality sessions, keep easy days genuinely easy, and prioritise sleep and nutrition around hard efforts.";
    return "This week, focus on consistency over intensity. Get the runs done, keep easy days easy, and make sure you're recovering well between sessions.";
  }

  if (m.includes("hello") || m.includes("hi") || m.includes("hey")) {
    if (isTough) return "Let's get to it. What do you need?";
    if (isCalm) return "Hello. How can I assist with your training today?";
    return "Hey! Great to hear from you. How are you feeling today?";
  }

  if (isTough) return "Good question. Push through the doubt — that's where growth happens. What else do you need?";
  if (isCalm) return "That's a reasonable concern. I'd suggest monitoring over the next 48 hours before making any changes to the plan.";
  if (isElite) return "Noted. Stay the course — your training is progressing well. What else?";
  if (isCompetitive) return "Every question you ask makes you better than the runners who aren't asking. You're building the edge. Keep pushing.";
  return "That's a great question! Your training is going really well — keep the consistency up. What else is on your mind?";
};

const personalityConfig: Record<string, { name: string; greeting: string; badge: string; color: string }> = {
  supportive: { name: "Coach AI", badge: "Supportive", color: "#1fcc8a", greeting: "Hey {name}! Ready to talk training? Ask me anything about your plan, how you're feeling, or what to focus on this week." },
  tough: { name: "Coach", badge: "Tough Love", color: "#e05252", greeting: "{name}. Let's get to work. What do you need?" },
  elite: { name: "Performance Coach", badge: "Elite", color: "#4a9eff", greeting: "Good to go, {name}. What are we solving today?" },
  calm: { name: "Coach", badge: "Calm & Scientific", color: "#a78bfa", greeting: "Hello {name}. How is your training feeling at the moment? I'm here to help you think through anything." },
  competitive: { name: "Coach", badge: "Competitive", color: "#f0a830", greeting: "{name}. While others rest, you're here asking questions. That's the edge. What do you need?" },
  beginner: { name: "Coach", badge: "Beginner Friendly", color: "#1fcc8a", greeting: "Hi {name}! So glad you're here. No question is too small — I'm here to help. How are you feeling about your training?" },
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
    const userName = localStorage.getItem("userName") || "Athlete";
    setPersonality(saved);
    const savedConfig = personalityConfig[saved] || personalityConfig.supportive;
    const greeting = savedConfig.greeting.replace(/{name}/g, userName);
    setMessages([{ role: "coach", content: greeting, time: getTime() }]);
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
    "What should I focus on this week?",
    "I'm feeling tired today",
    "How do I improve my pace?",
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
          <span style={{ fontSize: "10px", fontFamily: "'DM Mono', monospace", color: config.color, background: `${config.color}18`, border: `0.5px solid ${config.color}40`, padding: "4px 10px", borderRadius: "20px" }}>
            {config.badge}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "160px" }}>

        {messages.length <= 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
            <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
              Quick questions
            </p>
            {quickQuestions.map((q, i) => (
              <button key={i} onClick={() => setInput(q)}
                style={{ background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "10px", padding: "10px 14px", color: "var(--text2)", fontSize: "13px", cursor: "pointer", textAlign: "left", fontFamily: "'Syne', sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {q}
                <span style={{ color: "var(--text3)" }}>›</span>
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", gap: "8px", alignItems: "flex-end" }}>
            {msg.role === "coach" && (
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--green-dim)", border: "0.5px solid rgba(31,204,138,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>
                🤖
              </div>
            )}
            <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: "3px", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ background: msg.role === "user" ? "var(--green)" : "var(--bg2)", color: msg.role === "user" ? "var(--green-text)" : "var(--text)", border: msg.role === "coach" ? "0.5px solid var(--border)" : "none", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "10px 14px", fontSize: "14px", lineHeight: 1.5 }}>
                {msg.content}
              </div>
              <span style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'DM Mono', monospace" }}>{msg.time}</span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--green-dim)", border: "0.5px solid rgba(31,204,138,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>🤖</div>
            <div style={{ background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "16px 16px 16px 4px", padding: "12px 16px", display: "flex", gap: "4px", alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--text3)", animation: `bounce 1s infinite ${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ position: "fixed", bottom: "72px", left: 0, right: 0, maxWidth: "480px", margin: "0 auto", padding: "12px 16px", background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)", borderTop: "0.5px solid var(--border)" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", background: "var(--bg2)", border: "0.5px solid var(--border)", borderRadius: "14px", padding: "8px 8px 8px 16px" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask your coach anything..."
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: "14px", fontFamily: "'Syne', sans-serif" }}
          />
          <button onClick={sendMessage}
            style={{ background: input.trim() ? "var(--green)" : "var(--bg3)", color: input.trim() ? "var(--green-text)" : "var(--text3)", border: "none", borderRadius: "10px", padding: "8px 16px", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "'Syne', sans-serif", transition: "all 0.15s" }}>
            Send
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
      `}</style>
    </div>
  );
}