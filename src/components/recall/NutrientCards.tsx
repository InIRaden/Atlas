import type { NutrientBreakdown } from "@/types/recall";

interface NutrientCardsProps {
  nutrients: NutrientBreakdown;
}

const maxMap = {
  calories: 2400,
  protein: 90,
  fat: 80,
  carbs: 325,
};

const barClass = {
  calories: "from-amber-300 to-atlas-gold",
  protein: "from-cyan-300 to-atlas-cyan",
  fat: "from-lime-300 to-atlas-green",
  carbs: "from-orange-300 to-orange-500",
};

export function NutrientCards({ nutrients }: NutrientCardsProps) {
  const entries = [
    { key: "calories", label: "Calories", unit: "kcal", value: nutrients.calories },
    { key: "protein", label: "Protein", unit: "g", value: nutrients.protein },
    { key: "fat", label: "Fat", unit: "g", value: nutrients.fat },
    { key: "carbs", label: "Carbs", unit: "g", value: nutrients.carbs },
  ] as const;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {entries.map((item) => {
        const ratio = Math.min(100, Math.round((item.value / maxMap[item.key]) * 100));
        return (
          <article key={item.key} className="rounded-2xl bg-white/80 p-4 shadow-card">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold text-atlas-ink">
              {item.value} <span className="text-base text-slate-500">{item.unit}</span>
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${barClass[item.key]}`}
                style={{ width: `${ratio}%` }}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
