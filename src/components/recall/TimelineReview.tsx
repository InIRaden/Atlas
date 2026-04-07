import type { RecallItem } from "@/types/recall";

interface TimelineReviewProps {
  items: RecallItem[];
  onDelete: (itemId: string) => void;
}

export function TimelineReview({ items, onDelete }: TimelineReviewProps) {
  return (
    <div className="rounded-3xl bg-white/80 p-6 shadow-card">
      <h3 className="text-xl font-semibold">Review Timeline</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div>
              <p className="font-medium">{item.quickText}</p>
              <p className="text-sm text-slate-500">
                {item.mealType} • {item.matchStatus}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="rounded-xl bg-atlas-red px-3 py-2 text-sm font-semibold text-white"
            >
              Delete
            </button>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-slate-500">
            No items yet. Start from Pass 1 quick recall.
          </p>
        ) : null}
      </div>
    </div>
  );
}
