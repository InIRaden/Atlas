interface StatusBadgeProps {
  tone: "matched" | "similar" | "custom" | "available" | "unavailable";
  children: string;
}

const toneClassMap: Record<StatusBadgeProps["tone"], string> = {
  matched: "bg-atlas-green/25 text-green-800",
  similar: "bg-atlas-cyan/30 text-cyan-900",
  custom: "bg-atlas-gold/25 text-amber-900",
  available: "bg-atlas-green/25 text-green-800",
  unavailable: "bg-atlas-red/25 text-red-800",
};

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${toneClassMap[tone]}`}
    >
      {children}
    </span>
  );
}
