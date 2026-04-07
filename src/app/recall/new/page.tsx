"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { NutrientCards } from "@/components/recall/NutrientCards";
import { PortionEstimationModal } from "@/components/recall/PortionEstimationModal";
import { TimelineReview } from "@/components/recall/TimelineReview";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getFoods } from "@/lib/mock-api";
import { useRecallSessionStore } from "@/store/recall-session";
import type { FoodItem, MatchStatus, MealType, NutrientBreakdown } from "@/types/recall";

const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

const passLabel = {
  1: "Entry & Session Creation",
  2: "Quick Recall",
  3: "Food Matching",
  4: "Portion Estimation",
  5: "Smart Prompts",
  6: "Review & Summary",
} as const;

const initialNutrients: NutrientBreakdown = {
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
};

export default function RecallNewPage() {
  const {
    sessions,
    activeSessionId,
    createSession,
    setPass,
    addQuickItem,
    setMatch,
    setPortion,
    submitActiveSession,
    removeItem,
  } = useRecallSessionStore();
  const router = useRouter();

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId),
    [activeSessionId, sessions],
  );

  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [context, setContext] = useState<"weekday" | "weekend">("weekday");
  const [quickInputs, setQuickInputs] = useState<Record<MealType, string>>({
    Breakfast: "",
    Lunch: "",
    Dinner: "",
    Snack: "",
  });
  const [query, setQuery] = useState("");
  const [portionTarget, setPortionTarget] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string>("");

  useEffect(() => {
    void getFoods().then(setFoods);
  }, []);

  const filteredFoods = useMemo(() => {
    if (!query.trim()) return foods;
    return foods.filter((food) =>
      food.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [foods, query]);

  const nutrients = useMemo(() => {
    if (!activeSession) return initialNutrients;

    return activeSession.items.reduce((total, item) => {
      const food = foods.find((entry) => entry.id === item.matchedFoodId);
      if (!food) return total;

      const multiplier = item.portion?.grams ? item.portion.grams / 100 : 1;
      return {
        calories: total.calories + Math.round(food.defaultNutrients.calories * multiplier),
        protein: total.protein + Math.round(food.defaultNutrients.protein * multiplier),
        fat: total.fat + Math.round(food.defaultNutrients.fat * multiplier),
        carbs: total.carbs + Math.round(food.defaultNutrients.carbs * multiplier),
      };
    }, initialNutrients);
  }, [activeSession, foods]);

  const selectedPortionItem = activeSession?.items.find((item) => item.id === portionTarget);

  const breakfastHasDrink =
    activeSession?.items.some(
      (item) =>
        item.mealType === "Breakfast" &&
        /teh|kopi|susu|drink|minum/i.test(item.quickText),
    ) ?? true;

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Atlas Food Recall Session</h1>
          <p className="mt-1 text-slate-600">Multiple-pass flow untuk pencatatan makan harian.</p>
        </div>
        <Link href="/dashboard" className="rounded-xl border border-slate-300 bg-white px-4 py-2">
          Dashboard
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_2fr]">
        <article className="rounded-3xl bg-white/80 p-6 shadow-card">
          <h2 className="text-xl font-semibold">Pass Progress</h2>
          <ul className="mt-4 space-y-2">
            {(Object.entries(passLabel) as Array<[string, string]>).map(([step, label]) => (
              <li key={step} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span className="text-sm font-medium">
                  Pass {step}: {label}
                </span>
                {activeSession?.pass === Number(step) ? (
                  <span className="rounded-full bg-atlas-gold px-2 py-1 text-xs font-semibold">Current</span>
                ) : null}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl bg-white/80 p-6 shadow-card">
          <h2 className="text-xl font-semibold">1. Entry & Session Creation</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Recall Date</span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Context</span>
              <select
                value={context}
                onChange={(event) => setContext(event.target.value as "weekday" | "weekend")}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
              >
                <option value="weekday">Weekday</option>
                <option value="weekend">Weekend</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            className="mt-4 rounded-xl bg-atlas-gold px-4 py-2 font-semibold"
            onClick={() => createSession({ date, context })}
          >
            Create Session
          </button>
        </article>
      </section>

      {activeSession ? (
        <div className="mt-8 space-y-8">
          <section className="rounded-3xl bg-white/80 p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">2. Quick Recall (Pass 1)</h2>
              <button type="button" onClick={() => setPass(2)} className="rounded-xl border px-3 py-2 text-sm">
                Next: Food Matching
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {mealTypes.map((meal) => (
                <div key={meal} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="font-semibold">{meal}</p>
                  <div className="mt-3 flex gap-2">
                    <input
                      value={quickInputs[meal]}
                      onChange={(event) =>
                        setQuickInputs((prev) => ({ ...prev, [meal]: event.target.value }))
                      }
                      placeholder={`Contoh: ${meal === "Breakfast" ? "Nasi uduk" : ""}`}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                    <button
                      type="button"
                      className="rounded-xl bg-atlas-cyan px-3 py-2 text-sm font-semibold text-cyan-950"
                      onClick={() => {
                        addQuickItem(meal, quickInputs[meal]);
                        setQuickInputs((prev) => ({ ...prev, [meal]: "" }));
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white/80 p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">3. Food Matching (Pass 2)</h2>
              <button type="button" onClick={() => setPass(3)} className="rounded-xl border px-3 py-2 text-sm">
                Next: Portion Estimation
              </button>
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search food database"
              className="mb-4 w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            <div className="space-y-3">
              {activeSession.items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{item.quickText}</p>
                    <StatusBadge
                      tone={
                        item.matchStatus === "Matched"
                          ? "matched"
                          : item.matchStatus === "Similar"
                            ? "similar"
                            : "custom"
                      }
                    >
                      {item.matchStatus}
                    </StatusBadge>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <select
                      value={item.matchedFoodId ?? ""}
                      onChange={(event) =>
                        setMatch(
                          item.id,
                          event.target.value || undefined,
                          item.matchStatus,
                        )
                      }
                      className="rounded-xl border border-slate-300 px-3 py-2"
                    >
                      <option value="">Select matched food</option>
                      {filteredFoods.map((food) => (
                        <option key={food.id} value={food.id}>
                          {food.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={item.matchStatus}
                      onChange={(event) =>
                        setMatch(
                          item.id,
                          item.matchedFoodId,
                          event.target.value as MatchStatus,
                        )
                      }
                      className="rounded-xl border border-slate-300 px-3 py-2"
                    >
                      <option>Matched</option>
                      <option>Similar</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  {item.matchedFoodId ? (
                    <p className="mt-3 text-sm text-slate-600">
                      Availability: {
                        foods.find((food) => food.id === item.matchedFoodId)?.availability
                      }
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white/80 p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">4. Portion Estimation (Pass 3)</h2>
              <button type="button" onClick={() => setPass(5)} className="rounded-xl border px-3 py-2 text-sm">
                Next: Smart Prompt
              </button>
            </div>
            <div className="space-y-3">
              {activeSession.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white p-4 border border-slate-200">
                  <div>
                    <p className="font-medium">{item.quickText}</p>
                    <p className="text-sm text-slate-500">
                      {item.portion
                        ? item.portion.mode === "grams"
                          ? `${item.portion.grams} g`
                          : item.portion.mode === "visual"
                            ? `Visual ${item.portion.visualSize}`
                            : item.portion.mode === "household"
                              ? `${item.portion.household?.amount} ${item.portion.household?.tool}`
                              : `${item.portion.unit?.amount} ${item.portion.unit?.name}`
                        : "No portion set"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-xl bg-atlas-gold px-3 py-2 text-sm font-semibold"
                    onClick={() => setPortionTarget(item.id)}
                  >
                    Estimate Portion
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white/80 p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">5. Smart Prompts</h2>
              <button type="button" onClick={() => setPass(6)} className="rounded-xl border px-3 py-2 text-sm">
                Next: Review
              </button>
            </div>
            {!breakfastHasDrink ? (
              <div className="rounded-2xl border border-atlas-cyan bg-cyan-50 p-4">
                <p className="font-semibold text-cyan-900">
                  Did you have a drink with breakfast?
                </p>
                <p className="text-sm text-cyan-800">
                  Smart prompt terdeteksi belum ada minuman pada meal Breakfast.
                </p>
              </div>
            ) : (
              <p className="rounded-2xl bg-slate-50 p-4 text-slate-600">
                No missing common items detected.
              </p>
            )}
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">6. Review & Nutrient Summary</h2>
            <TimelineReview items={activeSession.items} onDelete={removeItem} />
            <NutrientCards nutrients={nutrients} />
            {submitMessage ? (
              <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                {submitMessage}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => {
                const isSubmitted = submitActiveSession();

                if (!isSubmitted) {
                  setSubmitMessage("Tambahkan minimal 1 item makanan sebelum submit session.");
                  return;
                }

                setSubmitMessage("Session berhasil disubmit. Mengarahkan ke dashboard...");
                setTimeout(() => {
                  router.push("/dashboard");
                }, 500);
              }}
              className="rounded-xl bg-atlas-green px-5 py-3 font-semibold text-green-950"
            >
              Submit Session
            </button>
          </section>
        </div>
      ) : (
        <section className="mt-8 rounded-3xl bg-white/80 p-6 shadow-card">
          <p className="text-slate-600">
            Create a session first to continue with quick recall and multiple-pass flow.
          </p>
        </section>
      )}

      <PortionEstimationModal
        open={Boolean(portionTarget)}
        item={selectedPortionItem}
        onClose={() => setPortionTarget(null)}
        onSave={(portion) => {
          if (!portionTarget) return;
          setPortion(portionTarget, portion);
          setPortionTarget(null);
        }}
      />
    </main>
  );
}
