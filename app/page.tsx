import StatCard from "./components/StatCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <p className="text-gray-400 text-sm">Good morning</p>
        <h1 className="text-2xl font-bold text-white mt-1">Connor 👋</h1>
      </div>

      {/* This week banner */}
      <div className="mx-4 mb-6 bg-green-400/10 border border-green-400/20 rounded-2xl p-4">
        <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-1">This Week</p>
        <p className="text-white font-semibold">Week 4 of 16 — Base Building</p>
        <p className="text-gray-400 text-sm mt-1">3 workouts remaining</p>
        <div className="mt-3 bg-gray-800 rounded-full h-2">
          <div className="bg-green-400 h-2 rounded-full" style={{ width: "40%" }}></div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="px-4 mb-6">
        <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Weekly Stats</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Distance"
            value="32"
            unit="km"
            icon="📍"
            trend="↑ 8% vs last week"
            trendUp={true}
          />
          <StatCard
            label="Time"
            value="3h 42m"
            icon="⏱"
            trend="On target"
            trendUp={true}
          />
          <StatCard
            label="Elevation"
            value="480"
            unit="m"
            icon="⛰"
          />
          <StatCard
            label="Avg Pace"
            value="6:58"
            unit="/km"
            icon="💨"
            trend="↓ 12s faster"
            trendUp={true}
          />
        </div>
      </div>

      {/* Today's workout */}
      <div className="px-4 mb-6">
        <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Today</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white font-semibold">Easy Recovery Run</p>
              <p className="text-gray-400 text-sm mt-1">8km • Zone 2 • 56 min</p>
              <p className="text-gray-500 text-xs mt-2">Keep HR below 145 bpm</p>
            </div>
            <span className="text-2xl">🏃</span>
          </div>
          <button className="mt-4 w-full bg-green-400 text-gray-950 font-semibold py-3 rounded-xl text-sm">
            Start Workout
          </button>
        </div>
      </div>

      {/* Next race */}
      <div className="px-4 mb-6">
        <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Next Race</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-semibold">Cape Town Marathon</p>
              <p className="text-gray-400 text-sm mt-1">42.2km • Road</p>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-bold text-xl">42</p>
              <p className="text-gray-400 text-xs">days away</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}