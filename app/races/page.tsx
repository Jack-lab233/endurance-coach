export default function RacesPage() {
  const races = [
    {
      name: "Cape Town Marathon",
      date: "September 21, 2025",
      distance: "42.2km",
      daysAway: 42,
      goal: "3:45:00",
      surface: "Road",
    },
    {
      name: "Knysna Forest Marathon",
      date: "July 19, 2025",
      distance: "42.2km",
      daysAway: 8,
      goal: "4:00:00",
      surface: "Trail",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="px-4 pt-12 pb-6 flex justify-between items-end">
        <div>
          <p className="text-gray-400 text-sm">Season 2025</p>
          <h1 className="text-2xl font-bold text-white mt-1">My Races</h1>
        </div>
        <button className="bg-green-400 text-gray-950 font-semibold px-4 py-2 rounded-xl text-sm">
          + Add Race
        </button>
      </div>

      <div className="px-4 space-y-4">
        {races.map((race, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-white font-semibold">{race.name}</p>
                <p className="text-gray-400 text-sm mt-1">{race.date}</p>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-bold text-2xl">{race.daysAway}</p>
                <p className="text-gray-500 text-xs">days away</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <span className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                {race.distance}
              </span>
              <span className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                {race.surface}
              </span>
              <span className="text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                Goal: {race.goal}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}