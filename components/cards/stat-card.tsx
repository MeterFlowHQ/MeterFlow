interface StatCardProps {
  label: string;
  value: string | number;
  valueClassName?: string;
  badge?: {
    text: string;
    color: "emerald" | "gray";
  };
}

export function StatCard({ label, value, valueClassName, badge }: StatCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-gray-600">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${valueClassName || "text-gray-900"}`}>
        {badge ? (
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm ${
              badge.color === "emerald"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {badge.text}
          </span>
        ) : (
          value
        )}
      </p>
    </div>
  );
}
