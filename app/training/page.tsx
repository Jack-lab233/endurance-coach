export default function TrainingPage() {
  const workouts = [
    { day: "Mon", name: "Easy Run", distance: "8km", type: "easy", done: true },
    { day: "Tue", name: "Rest Day", distance: "", type: "rest", done: true },
    { day: "Wed", name: "Tempo Run", distance: "10km", type: "tempo", done: true },
    { day: "Thu", name: "Easy Run", distance: "6km", type: "easy", done: false },
    { day: "Fri", name: "Intervals", distance: "8km", type: "hard", done: false },
    { day: "Sat", name: "Long Run", distance: "22km", type: "long", done: false },
    { day: "Sun", name: "Rest Day", distance: "", type: "rest", done: false },
  ];

  const typeColors: Record<string, string> = {
    easy: "text-blue-400 bg-blue-400/10",
    tempo: "text-orange-400 bg-orange-400/10",
    hard: "text-red-400 bg-red-400/10",
    long: "text-purple-400 bg-purple-400/10",
    rest: "text-gray-500 bg-gray-800",
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="px-4 pt-12 pb-6">
        <p className="text-gray-400 text-sm">Week 4 of 16</p>
        <h1 className="text-2xl font-bold text-white mt-1">Training Plan</h1>
      </div>

      {/* Weekly overview */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {workouts.map((w, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 min-w-[44px] ${
                i === 3 ? "opacity-100" : w.done ? "opacity-50" : "opacity-100"
              }`}
            >
              <span className="text-gray-500 text-xs">{w.day}</span>
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                  w.done
                    ? "bg-green-400 text-gray-950"
                    : i === 3
                    ? "border-2 border-green-400 text-green-400"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                {w.done ? "✓" : w.type === "rest" ? "—" : w.day[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workout list */}
      <div className="px-4 space-y-3">
        {workouts.map((w, i) => (
          <div
            key={i}
            className={`bg-gray-900 border rounded-2xl p-4 ${
              i === 3 ? "border-green-400/40" : "border-gray-800"
            } ${w.done ? "opacity-50" : ""}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-400 text-xs">{w.day}</span>
                  {i === 3 && (
                    <span className="text-green-400 text-xs font-semibold">TODAY</span>
                  )}
                </div>
                <p className="text-white font-semibold">{w.name}</p>
                {w.distance && (
                  <p className="text-gray-400 text-sm mt-1">{w.distance}</p>
                )}
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${typeColors[w.type]}`}
              >
                {w.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}