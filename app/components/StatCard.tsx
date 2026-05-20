interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: string;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({
  label,
  value,
  unit,
  icon,
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
      <div className="flex justify-between items-start mb-3">
        <span className="text-gray-400 text-sm font-medium">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold text-white">{value}</span>
        {unit && (
          <span className="text-gray-400 text-sm mb-1">{unit}</span>
        )}
      </div>
      {trend && (
        <div className={`mt-2 text-xs font-medium ${trendUp ? "text-green-400" : "text-red-400"}`}>
          {trendUp ? "↑" : "↓"} {trend}
        </div>
      )}
    </div>
  );
}
