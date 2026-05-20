export default function CoachPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="px-4 pt-12 pb-6">
        <p className="text-gray-400 text-sm">AI Powered</p>
        <h1 className="text-2xl font-bold text-white mt-1">Your Coach</h1>
      </div>

      <div className="px-4 mb-6">
        <div className="bg-gray-900 border border-green-400/20 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-400/20 rounded-full flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <p className="text-white font-semibold">Coach AI</p>
              <p className="text-green-400 text-xs">Online</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Hey Connor! Great tempo run yesterday — you held 5:12/km for the last 3km which is a new effort for you. Today is your easy run, keep it conversational. How are your legs feeling?
          </p>
        </div>
      </div>

      <div className="px-4 space-y-3 mb-6">
        {["How should I pace Knysna?", "I'm feeling tired today", "Adjust my plan for next week"].map((q, i) => (
          <button key={i} className="w-full text-left bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-gray-300 text-sm hover:border-green-400/40 transition-colors">
            {q} →
          </button>
        ))}
      </div>

      <div className="px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 flex gap-3">
          <input
            type="text"
            placeholder="Ask your coach anything..."
            className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm outline-none"
          />
          <button className="bg-green-400 text-gray-950 font-bold px-4 py-2 rounded-xl text-sm">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}