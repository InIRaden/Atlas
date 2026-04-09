"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { NutrientCards } from "@/components/recall/NutrientCards";
import { PortionEstimationModal } from "@/components/recall/PortionEstimationModal";
import { TimelineReview } from "@/components/recall/TimelineReview";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getFoods, getPortions } from "@/lib/mock-api";
import { useRecallSessionStore } from "@/store/recall-session";
import type {
  FoodItem,
  MealType,
  NutrientBreakdown,
  PortionModeOption,
  PortionSelection,
  RecallItem,
} from "@/types/recall";

type Stage = "time" | "items" | "matching" | "portion" | "review";

type Occasion = {
  key: string;
  label: string;
  mealType: MealType;
  timeQuestion: string;
  noMealLabel: string;
  helpText: string;
};

const occasions: Occasion[] = [
  {
    key: "breakfast",
    label: "Sarapan",
    mealType: "Breakfast",
    timeQuestion: "Kapan Anda sarapan? Berikan perkiraan waktunya.",
    noMealLabel: "Saya tidak sarapan",
    helpText: "Masukkan satu item per baris. Jangan isi jumlah, cukup nama makanan/minuman.",
  },
  {
    key: "morning-snack",
    label: "Snack/minum pagi",
    mealType: "Snack",
    timeQuestion: "Apakah Anda snack/minum di pagi hari? Jika ya, jam berapa?",
    noMealLabel: "Saya tidak snack pagi",
    helpText: "Masukkan satu item per baris. Jangan isi jumlah, cukup nama makanan/minuman.",
  },
  {
    key: "lunch",
    label: "Makan siang",
    mealType: "Lunch",
    timeQuestion: "Kapan Anda makan siang? Berikan perkiraan waktunya.",
    noMealLabel: "Saya tidak makan siang",
    helpText: "Masukkan satu item per baris. Jangan isi jumlah, cukup nama makanan/minuman.",
  },
  {
    key: "afternoon-snack",
    label: "Snack/minum sore",
    mealType: "Snack",
    timeQuestion: "Apakah Anda snack/minum di sore hari? Jika ya, jam berapa?",
    noMealLabel: "Saya tidak snack sore",
    helpText: "Masukkan satu item per baris. Jangan isi jumlah, cukup nama makanan/minuman.",
  },
  {
    key: "dinner",
    label: "Makan malam",
    mealType: "Dinner",
    timeQuestion: "Kapan Anda makan malam? Berikan perkiraan waktunya.",
    noMealLabel: "Saya tidak makan malam",
    helpText: "Masukkan satu item per baris. Jangan isi jumlah, cukup nama makanan/minuman.",
  },
  {
    key: "late-snack",
    label: "Snack/minum larut malam",
    mealType: "Snack",
    timeQuestion: "Apakah Anda snack/minum di larut malam? Jika ya, jam berapa?",
    noMealLabel: "Saya tidak snack larut malam",
    helpText: "Masukkan satu item per baris. Jangan isi jumlah, cukup nama makanan/minuman.",
  },
];

const defaultOccasionTimes: Record<string, string> = {
  breakfast: "08:00",
  "morning-snack": "10:30",
  lunch: "13:00",
  "afternoon-snack": "16:00",
  dinner: "19:00",
  "late-snack": "22:00",
};

const initialNutrients: NutrientBreakdown = {
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
};

const visualFallbackGrams = {
  S: 80,
  M: 130,
  L: 190,
} as const;

function resolvePortionGrams(
  portion: PortionSelection | undefined,
  portionConfig?: PortionModeOption,
) {
  if (!portion) return 100;

  if (portion.mode === "grams") {
    return Math.max(1, portion.grams ?? 100);
  }

  if (portion.mode === "visual") {
    const size = portion.visualSize ?? "M";
    const found = portionConfig?.modes.visual.sizes.find((entry) => entry.label === size);
    return found?.grams ?? visualFallbackGrams[size];
  }

  if (portion.mode === "household") {
    const tool = portion.household?.tool;
    const amount = portion.household?.amount ?? 1;
    if (!tool) return 100;

    const byTool = portionConfig?.modes.household.find((entry) => entry.tool === tool);
    if (!byTool) return Math.max(1, amount * 50);

    const gramPerAmount = byTool.grams / byTool.amount;
    return Math.max(1, Math.round(gramPerAmount * amount));
  }

  const unitName = portion.unit?.name;
  const amount = portion.unit?.amount ?? 1;
  if (!unitName) return 100;

  const byUnit = portionConfig?.modes.unit.find((entry) => entry.name === unitName);
  if (!byUnit) return Math.max(1, amount * 35);

  const gramPerAmount = byUnit.grams / byUnit.amount;
  return Math.max(1, Math.round(gramPerAmount * amount));
}

function splitTime(value: string) {
  const [hourText, minuteText] = value.split(":");
  return {
    hour: Number(hourText),
    minute: Number(minuteText),
  };
}

function clampTime(hour: number, minute: number) {
  const nextHour = (hour + 24) % 24;
  const minuteOptions = [0, 15, 30, 45];
  const bestMinute = minuteOptions.includes(minute) ? minute : 0;
  return `${String(nextHour).padStart(2, "0")}:${String(bestMinute).padStart(2, "0")}`;
}

export default function RecallNewPage() {
  const {
    sessions,
    activeSessionId,
    setActiveSession,
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
  const [portions, setPortions] = useState<PortionModeOption[]>([]);

  const [date] = useState<string>(new Date().toISOString().split("T")[0]);
  const [context] = useState<"weekday" | "weekend">("weekday");

  const [stage, setStage] = useState<Stage>("time");
  const [currentOccasionIndex, setCurrentOccasionIndex] = useState(0);
  const [occasionTimes, setOccasionTimes] = useState<Record<string, string>>(defaultOccasionTimes);
  const [skippedOccasion, setSkippedOccasion] = useState<Record<string, boolean>>({});

  const [foodInput, setFoodInput] = useState("");
  const [drinkInput, setDrinkInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMatchItemId, setSelectedMatchItemId] = useState<string | null>(null);
  const [selectedPortionItemId, setSelectedPortionItemId] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    void getFoods().then(setFoods);
    void getPortions().then(setPortions);
  }, []);

  useEffect(() => {
    if (!activeSession && sessions.length === 0) {
      createSession({ date, context });
      return;
    }

    if (!activeSession && sessions.length > 0) {
      setActiveSession(sessions[0].id);
    }
  }, [activeSession, context, createSession, date, sessions, setActiveSession]);

  useEffect(() => {
    if (stage === "time" || stage === "items") {
      setPass(2);
      return;
    }

    if (stage === "matching") {
      setPass(3);
      return;
    }

    if (stage === "portion") {
      setPass(4);
      return;
    }

    setPass(6);
  }, [setPass, stage]);

  const items = activeSession?.items ?? [];

  const itemsByOccasion = useMemo(() => {
    const grouped: Record<string, RecallItem[]> = {};
    for (const occasion of occasions) {
      grouped[occasion.key] = [];
    }

    for (const item of items) {
      if (item.occasionKey && grouped[item.occasionKey]) {
        grouped[item.occasionKey].push(item);
        continue;
      }

      const fallback = occasions.find((occasion) => occasion.mealType === item.mealType);
      if (fallback) {
        grouped[fallback.key].push(item);
      }
    }

    return grouped;
  }, [items]);

  const currentOccasion = occasions[currentOccasionIndex];
  const currentTimeValue = occasionTimes[currentOccasion.key] ?? "08:00";

  const addCurrentItem = (kind: "food" | "drink") => {
    if (!activeSession) return;

    const text = kind === "food" ? foodInput : drinkInput;
    if (!text.trim()) return;

    addQuickItem(currentOccasion.mealType, text.trim(), currentOccasion.key);

    if (kind === "food") {
      setFoodInput("");
    } else {
      setDrinkInput("");
    }
  };

  const nextOccasion = () => {
    if (currentOccasionIndex < occasions.length - 1) {
      setCurrentOccasionIndex((value) => value + 1);
      setStage("time");
      return;
    }

    setStage("matching");
  };

  const updateCurrentTime = (part: "hour" | "minute", delta: number) => {
    const { hour, minute } = splitTime(currentTimeValue);

    if (part === "hour") {
      setOccasionTimes((prev) => ({
        ...prev,
        [currentOccasion.key]: clampTime(hour + delta, minute),
      }));
      return;
    }

    const minuteOptions = [0, 15, 30, 45];
    const currentIndex = minuteOptions.findIndex((value) => value === minute);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = (safeIndex + delta + minuteOptions.length) % minuteOptions.length;

    setOccasionTimes((prev) => ({
      ...prev,
      [currentOccasion.key]: clampTime(hour, minuteOptions[nextIndex]),
    }));
  };

  const markNoMeal = () => {
    setSkippedOccasion((prev) => ({
      ...prev,
      [currentOccasion.key]: true,
    }));

    nextOccasion();
  };

  const confirmMealTime = () => {
    setSkippedOccasion((prev) => ({
      ...prev,
      [currentOccasion.key]: false,
    }));
    setStage("items");
  };

  const unmatchedItems = useMemo(
    () => items.filter((item) => !item.matchedFoodId),
    [items],
  );

  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) {
      return foods;
    }

    return foods.filter((food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [foods, searchQuery]);

  useEffect(() => {
    if (stage !== "matching") return;

    if (unmatchedItems.length === 0) {
      setSelectedMatchItemId(null);
      setStage("portion");
      return;
    }

    if (!selectedMatchItemId || !unmatchedItems.some((item) => item.id === selectedMatchItemId)) {
      setSelectedMatchItemId(unmatchedItems[0].id);
    }
  }, [selectedMatchItemId, stage, unmatchedItems]);

  const selectedMatchItem = useMemo(
    () => items.find((item) => item.id === selectedMatchItemId),
    [items, selectedMatchItemId],
  );

  const portionCandidates = useMemo(
    () => items.filter((item) => Boolean(item.matchedFoodId)),
    [items],
  );

  const pendingPortion = useMemo(
    () => portionCandidates.filter((item) => !item.portion),
    [portionCandidates],
  );

  useEffect(() => {
    if (stage !== "portion") return;

    if (portionCandidates.length === 0) {
      setSelectedPortionItemId(null);
      return;
    }

    if (!selectedPortionItemId || !portionCandidates.some((item) => item.id === selectedPortionItemId)) {
      setSelectedPortionItemId(portionCandidates[0].id);
    }
  }, [portionCandidates, selectedPortionItemId, stage]);

  const selectedPortionItem = useMemo(
    () => items.find((item) => item.id === selectedPortionItemId),
    [items, selectedPortionItemId],
  );

  const portionMap = useMemo(
    () => new Map(portions.map((entry) => [entry.foodId, entry])),
    [portions],
  );

  const foodMap = useMemo(() => new Map(foods.map((food) => [food.id, food])), [foods]);

  const nutrients = useMemo(() => {
    return items.reduce((total, item) => {
      if (!item.matchedFoodId) return total;

      const food = foodMap.get(item.matchedFoodId);
      if (!food) return total;

      const portionConfig = portionMap.get(item.matchedFoodId);
      const grams = resolvePortionGrams(item.portion, portionConfig);
      const multiplier = grams / 100;

      return {
        calories: total.calories + Math.round(food.defaultNutrients.calories * multiplier),
        protein: total.protein + Math.round(food.defaultNutrients.protein * multiplier),
        fat: total.fat + Math.round(food.defaultNutrients.fat * multiplier),
        carbs: total.carbs + Math.round(food.defaultNutrients.carbs * multiplier),
      };
    }, initialNutrients);
  }, [foodMap, items, portionMap]);

  const doneOccasionCount = useMemo(() => {
    return occasions.filter((occasion) => {
      if (skippedOccasion[occasion.key]) return true;
      return (itemsByOccasion[occasion.key] ?? []).length > 0;
    }).length;
  }, [itemsByOccasion, skippedOccasion]);

  const mealEnergy = useMemo(() => {
    const data: Record<string, number> = {};

    for (const occasion of occasions) {
      data[occasion.key] = 0;
    }

    for (const item of items) {
      if (!item.matchedFoodId || !item.occasionKey) continue;
      const food = foodMap.get(item.matchedFoodId);
      if (!food) continue;

      const config = portionMap.get(item.matchedFoodId);
      const grams = resolvePortionGrams(item.portion, config);
      data[item.occasionKey] = (data[item.occasionKey] ?? 0) + Math.round((food.defaultNutrients.calories * grams) / 100);
    }

    return data;
  }, [foodMap, items, portionMap]);

  const progressPercent = Math.round((doneOccasionCount / occasions.length) * 100);

  const applyMatch = (foodId: string) => {
    if (!selectedMatchItemId) return;

    const selectedFood = foodMap.get(foodId);
    const typed = selectedMatchItem?.quickText.toLowerCase() ?? "";
    const status = selectedFood && selectedFood.name.toLowerCase().includes(typed) ? "Matched" : "Similar";

    setMatch(selectedMatchItemId, foodId, status);
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-[#df3a16] via-[#df4c1a] to-[#a34b2f] px-3 py-5 md:px-6 md:py-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-slate-300/90 bg-[#efefef] shadow-card">
        <header className="border-b border-slate-300">
          <div className="bg-[#e3a38f] px-5 py-4 text-3xl tracking-[0.14em] text-[#a53a1f] md:px-6">Atlas24</div>
          <div className="flex items-center justify-between border-t border-slate-300 px-4 py-3 text-sm">
            <p className="font-semibold text-[#b03917]">Nomor recall saat ini: 1</p>
            <div className="flex gap-4 text-[#c14622] md:gap-6">
              <button type="button" className="text-xs hover:underline md:text-sm">Tonton video tutorial</button>
              <Link href="/dashboard" className="text-xs hover:underline md:text-sm">Keluar</Link>
            </div>
          </div>
        </header>

        <section className="grid min-h-[720px] grid-cols-1 lg:grid-cols-[330px_1fr]">
          <aside className="border-r border-slate-300 bg-[#ececec]">
            <div className="border-b border-slate-300 px-4 py-4">
              <h2 className="text-xl font-semibold text-[#b03917] md:text-2xl">Asupan makanan dan minuman Anda</h2>
              <p className="mt-1 text-xs text-slate-600">Progres wawancara: {progressPercent}%</p>
            </div>

            <div className="divide-y divide-slate-300">
              {occasions.map((occasion, index) => {
                const occasionItems = itemsByOccasion[occasion.key] ?? [];
                const isCurrent = occasion.key === currentOccasion.key && stage !== "review";
                const isDone = skippedOccasion[occasion.key] || occasionItems.length > 0;

                return (
                  <div key={occasion.key}>
                    <button
                      type="button"
                      onClick={() => {
                        if (stage === "matching" || stage === "portion" || stage === "review") {
                          return;
                        }

                        setCurrentOccasionIndex(index);
                        setStage("time");
                      }}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left ${
                        isCurrent ? "bg-[#d4d4d4]" : "bg-[#ececec]"
                      }`}
                    >
                      <span className="text-base font-semibold text-slate-800 md:text-lg">{occasion.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 md:text-base">{occasionTimes[occasion.key]}</span>
                        {isDone ? <span className="text-base font-bold text-green-600 md:text-lg">✓</span> : null}
                      </div>
                    </button>

                    {occasionItems.length > 0 ? (
                      <div className="space-y-1 px-4 py-2">
                        {occasionItems.map((item) => {
                          const matchedTone = item.matchedFoodId ? "matched" : "custom";
                          return (
                            <div key={item.id} className="flex items-center justify-between py-1">
                              <p className="text-sm text-slate-800 md:text-[15px]">{item.quickText}</p>
                              <div className="flex items-center gap-1">
                                <StatusBadge tone={matchedTone}>{item.matchedFoodId ? "OK" : "?"}</StatusBadge>
                                <StatusBadge tone={item.portion ? "available" : "unavailable"}>
                                  {item.portion ? "P" : "-"}
                                </StatusBadge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-300 px-4 py-4 text-center">
              <button
                type="button"
                className="text-base font-semibold text-green-700 hover:underline md:text-lg"
                onClick={() => setStage("matching")}
              >
                + Lanjut ke matching makanan
              </button>
            </div>
          </aside>

          <div className="bg-[#efefef] p-4 md:p-6">
            {stage === "time" ? (
              <section className="space-y-6">
                <div className="rounded border border-slate-300 bg-[#dedede] px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <p className="max-w-3xl text-lg text-slate-800 md:text-2xl">{currentOccasion.timeQuestion}</p>
                    <button type="button" className="rounded bg-[#b4b4b4] px-4 py-2 text-sm font-semibold text-white md:text-base">
                      Bantuan
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-4xl md:gap-6 md:text-5xl">
                  <div className="space-y-2 text-center">
                    <button
                      type="button"
                      className="h-12 w-14 rounded bg-[#b4b4b4] text-xl text-white md:h-14 md:w-16"
                      onClick={() => updateCurrentTime("hour", 1)}
                    >
                      ▲
                    </button>
                    <p>{currentTimeValue.split(":")[0]}</p>
                    <button
                      type="button"
                      className="h-12 w-14 rounded bg-[#b4b4b4] text-xl text-white md:h-14 md:w-16"
                      onClick={() => updateCurrentTime("hour", -1)}
                    >
                      ▼
                    </button>
                  </div>
                  <p className="text-4xl md:text-5xl">:</p>
                  <div className="space-y-2 text-center">
                    <button
                      type="button"
                      className="h-12 w-14 rounded bg-[#b4b4b4] text-xl text-white md:h-14 md:w-16"
                      onClick={() => updateCurrentTime("minute", 1)}
                    >
                      ▲
                    </button>
                    <p>{currentTimeValue.split(":")[1]}</p>
                    <button
                      type="button"
                      className="h-12 w-14 rounded bg-[#b4b4b4] text-xl text-white md:h-14 md:w-16"
                      onClick={() => updateCurrentTime("minute", -1)}
                    >
                      ▼
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded bg-[#b4b4b4] px-5 py-2.5 text-sm font-semibold text-white md:text-base"
                    onClick={markNoMeal}
                  >
                    {currentOccasion.noMealLabel}
                  </button>
                  <button
                    type="button"
                    className="rounded bg-green-700 px-5 py-2.5 text-sm font-semibold text-white md:text-base"
                    onClick={confirmMealTime}
                  >
                    Sekitar waktu itu
                  </button>
                </div>
              </section>
            ) : null}

            {stage === "items" ? (
              <section className="space-y-6">
                <h2 className="text-3xl font-semibold text-black md:text-5xl">
                  {currentOccasion.label} ({occasionTimes[currentOccasion.key]})
                </h2>

                <div className="rounded border border-slate-300 bg-[#dedede] px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="max-w-3xl text-base text-slate-800 md:text-lg">{currentOccasion.helpText}</p>
                    <button type="button" className="rounded bg-[#b4b4b4] px-4 py-2 text-sm font-semibold text-white md:text-base">
                      Bantuan
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold md:text-4xl">Makanan</h3>
                  <input
                    value={foodInput}
                    onChange={(event) => setFoodInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addCurrentItem("food");
                      }
                    }}
                    placeholder="Klik di sini untuk menambahkan makanan"
                    className="w-full rounded border border-slate-300 bg-white px-4 py-3 text-lg md:text-2xl"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold md:text-4xl">Minuman</h3>
                  <input
                    value={drinkInput}
                    onChange={(event) => setDrinkInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addCurrentItem("drink");
                      }
                    }}
                    placeholder="Klik di sini untuk menambahkan minuman"
                    className="w-full rounded border border-slate-300 bg-white px-4 py-3 text-lg md:text-2xl"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded bg-[#b4b4b4] px-5 py-2.5 text-sm font-semibold text-white md:text-base"
                    onClick={() => setStage("time")}
                  >
                    Ubah waktu makan
                  </button>
                  <button
                    type="button"
                    className="rounded bg-[#b4b4b4] px-5 py-2.5 text-sm font-semibold text-white md:text-base"
                    onClick={() => {
                      const occasionItems = itemsByOccasion[currentOccasion.key] ?? [];
                      for (const item of occasionItems) {
                        removeItem(item.id);
                      }
                    }}
                  >
                    Hapus menu ini
                  </button>
                  <button
                    type="button"
                    className="rounded bg-green-700 px-5 py-2.5 text-sm font-semibold text-white md:text-base"
                    onClick={nextOccasion}
                  >
                    Saya sudah selesai menu ini
                  </button>
                </div>
              </section>
            ) : null}

            {stage === "matching" ? (
              <section className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-semibold md:text-5xl">Pencocokan Makanan</h2>
                  <button
                    type="button"
                    className="text-sm text-blue-700 underline md:text-base"
                    onClick={() => setStage("items")}
                  >
                    Kembali ke langkah sebelumnya
                  </button>
                </div>

                {selectedMatchItem ? (
                  <>
                    <div className="rounded border border-slate-300 bg-[#dedede] px-5 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <p className="max-w-3xl text-base text-slate-800 md:text-lg">
                          Pilih makanan database yang paling mendekati item: <strong>{selectedMatchItem.quickText}</strong>
                        </p>
                        <button type="button" className="rounded bg-[#b4b4b4] px-4 py-2 text-sm font-semibold text-white md:text-base">
                          Bantuan
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Cari makanan"
                        className="w-full rounded border border-slate-300 bg-white px-4 py-3 text-base md:text-lg"
                      />
                      <button type="button" className="rounded bg-[#b4b4b4] px-4 py-2 text-sm font-semibold text-white md:text-base">
                        Cari lagi
                      </button>
                    </div>

                    <div className="max-h-[420px] space-y-2 overflow-auto rounded border border-slate-300 bg-white p-4">
                      {filteredFoods.map((food) => (
                        <button
                          key={food.id}
                          type="button"
                          className="block w-full rounded px-2 py-1.5 text-left text-base hover:bg-slate-100 md:text-lg"
                          onClick={() => applyMatch(food.id)}
                        >
                          {food.name}
                        </button>
                      ))}
                    </div>

                    <p className="text-sm text-slate-600 md:text-base">Sisa item belum matching: {unmatchedItems.length}</p>
                  </>
                ) : (
                  <div className="space-y-4">
                    <p className="rounded border border-green-600 bg-green-50 p-4 text-sm text-green-800 md:text-base">
                      Semua item sudah matching.
                    </p>
                    <button
                      type="button"
                      className="rounded bg-green-700 px-5 py-2.5 text-sm font-semibold text-white md:text-base"
                      onClick={() => setStage("portion")}
                    >
                      Lanjut ke estimasi porsi
                    </button>
                  </div>
                )}
              </section>
            ) : null}

            {stage === "portion" ? (
              <section className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-semibold md:text-5xl">Estimasi Porsi</h2>
                  <button
                    type="button"
                    className="text-sm text-blue-700 underline md:text-base"
                    onClick={() => setStage("matching")}
                  >
                    Kembali ke langkah sebelumnya
                  </button>
                </div>

                {selectedPortionItem ? (
                  <>
                    <div className="rounded border border-slate-300 bg-[#dedede] px-5 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <p className="max-w-3xl text-base text-slate-800 md:text-lg">
                          Pilih cara estimasi porsi untuk <strong>{selectedPortionItem.quickText}</strong> lalu simpan.
                        </p>
                        <button type="button" className="rounded bg-[#b4b4b4] px-4 py-2 text-sm font-semibold text-white md:text-base">
                          Bantuan
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 rounded border border-slate-300 bg-white p-4">
                      {portionCandidates.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded border border-slate-200 px-3 py-2">
                          <div>
                            <p className="text-base font-semibold md:text-lg">{item.quickText}</p>
                            <p className="text-xs text-slate-500 md:text-sm">
                              {item.portion ? "Porsi sudah diset" : "Porsi belum diset"}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="rounded bg-green-700 px-3 py-2 text-xs font-semibold text-white md:text-sm"
                            onClick={() => setSelectedPortionItemId(item.id)}
                          >
                            Pilih item
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="rounded bg-green-700 px-5 py-2.5 text-sm font-semibold text-white md:text-base"
                      onClick={() => setSelectedPortionItemId(selectedPortionItem.id)}
                    >
                      Atur porsi item terpilih
                    </button>

                    <p className="text-sm text-slate-600 md:text-base">Sisa item belum porsi: {pendingPortion.length}</p>

                    {pendingPortion.length === 0 ? (
                      <button
                        type="button"
                        className="rounded bg-green-700 px-5 py-2.5 text-sm font-semibold text-white md:text-base"
                        onClick={() => setStage("review")}
                      >
                        Lanjut ke ringkasan akhir
                      </button>
                    ) : null}
                  </>
                ) : (
                  <p className="rounded border border-slate-300 bg-white p-4 text-sm md:text-base">
                    Belum ada item yang siap diestimasi.
                  </p>
                )}
              </section>
            ) : null}

            {stage === "review" ? (
              <section className="space-y-5">
                <h2 className="text-3xl font-semibold md:text-5xl">Ringkasan Recall</h2>

                <TimelineReview items={items} onDelete={removeItem} />
                <NutrientCards nutrients={nutrients} />

                <div className="rounded border border-slate-300 bg-white p-4">
                  <h3 className="mb-3 text-lg font-semibold md:text-xl">Energi per kesempatan makan</h3>
                  <div className="grid gap-2 md:grid-cols-2">
                    {occasions.map((occasion) => (
                      <div key={occasion.key} className="flex items-center justify-between rounded bg-slate-50 px-3 py-2 text-sm md:text-base">
                        <span>{occasion.label}</span>
                        <span className="font-semibold">{mealEnergy[occasion.key] ?? 0} kkal</span>
                      </div>
                    ))}
                  </div>
                </div>

                {submitMessage ? (
                  <p className="rounded bg-slate-100 px-4 py-3 text-sm text-slate-700 md:text-base">{submitMessage}</p>
                ) : null}

                <button
                  type="button"
                  className="rounded bg-green-700 px-5 py-2.5 text-sm font-semibold text-white md:text-base"
                  onClick={() => {
                    if (items.length === 0) {
                      setSubmitMessage("Tambahkan minimal satu item sebelum submit.");
                      return;
                    }

                    if (unmatchedItems.length > 0) {
                      setSubmitMessage("Masih ada item yang belum matching.");
                      return;
                    }

                    if (pendingPortion.length > 0) {
                      setSubmitMessage("Masih ada item yang belum punya porsi.");
                      return;
                    }

                    const submitted = submitActiveSession();
                    if (!submitted) {
                      setSubmitMessage("Submit gagal. Coba lagi.");
                      return;
                    }

                    setSubmitMessage("Recall berhasil disubmit. Mengarahkan ke dashboard...");
                    setTimeout(() => {
                      router.push("/dashboard");
                    }, 600);
                  }}
                >
                  Submit recall
                </button>
              </section>
            ) : null}
          </div>
        </section>
      </div>

      <PortionEstimationModal
        open={Boolean(selectedPortionItemId) && stage === "portion"}
        item={selectedPortionItem}
        onClose={() => setSelectedPortionItemId(null)}
        onSave={(portion) => {
          if (!selectedPortionItemId) return;
          setPortion(selectedPortionItemId, portion);
          setSelectedPortionItemId(null);
        }}
      />
    </main>
  );
}
