export default function SettingsPage() {
  const sections = [
    {
      title: "Profile",
      items: ["Age, gender, weight", "Heart rate zones", "Personal records"],
    },
    {
      title: "Training",
      items: ["Coaching philosophy", "Weekly availability", "Race goals"],
    },
    {
      title: "Units & Display",
      items: ["Metric / Imperial", "Dark mode", "Font size"],
    },
    {
      title: "Privacy",
      items: ["AI data permissions", "Social visibility", "Data sharing"],
    },
    {
      title: "Integrations",
      items: ["Garmin Connect", "Strava", "Apple Health"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      <div className="px-4 space-y-4">
        {sections.map((section, i) => (
          <div key={i}>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 px-1">
              {section.title}
            </p>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              {section.items.map((item, j) => (
                <div
                  key={j}
                  className={`flex justify-between items-center px-4 py-3 ${
                    j < section.items.length - 1 ? "border-b border-gray-800" : ""
                  }`}
                >
                  <span className="text-white text-sm">{item}</span>
                  <span className="text-gray-600">›</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}