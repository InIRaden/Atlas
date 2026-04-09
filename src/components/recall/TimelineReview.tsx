import type { RecallItem } from "@/types/recall";

interface TimelineReviewProps {
  items: RecallItem[];
  onDelete: (itemId: string) => void;
}

export function TimelineReview({ items, onDelete }: TimelineReviewProps) {
  const grouped = {
    Breakfast: items.filter((item) => item.mealType === "Breakfast"),
    Lunch: items.filter((item) => item.mealType === "Lunch"),
    Dinner: items.filter((item) => item.mealType === "Dinner"),
    Snack: items.filter((item) => item.mealType === "Snack"),
  };

  return (
    <div className="rounded-3xl bg-white/80 p-6 shadow-card">
      <h3 className="text-xl font-semibold">Timeline Review</h3>
      <p className="mt-1 text-sm text-slate-500">Periksa urutan makan dan hapus item yang tidak valid.</p>

      {items.length === 0 ? (
        <p className="mt-4 rounded-xl bg-slate-50 p-4 text-slate-500">
          No items yet. Start from Step 2 quick list.
        </p>
      ) : null}

      <div className="mt-4 space-y-4">
        {(Object.entries(grouped) as Array<[keyof typeof grouped, RecallItem[]]>).map(([meal, mealItems]) => (
          <section key={meal} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{meal}</h4>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                {mealItems.length} item
              </span>
            </div>

            {mealItems.length === 0 ? (
              <p className="text-sm text-slate-400">No foods logged.</p>
            ) : (
              <div className="space-y-2">
                {mealItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-atlas-ink">{item.quickText}</p>
                      <p className="text-xs text-slate-500">{item.matchStatus}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="rounded-lg bg-atlas-red px-2.5 py-1.5 text-xs font-semibold text-white"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
