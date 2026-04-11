import { useEffect, useMemo, useState } from "react";
import PhaseStart from "../components/phases/PhaseStart";
import PhaseFoodMatching from "../components/phases/PhaseFoodMatching";
import PhaseMealSetup from "../components/phases/PhaseMealSetup";
import PhaseQuickList from "../components/phases/PhaseQuickList";
import PhaseAssociatedPrompts from "../components/phases/PhaseAssociatedPrompts";
import PhaseDetailQuestions from "../components/phases/PhaseDetailQuestions";
import PhasePortionEstimation from "../components/phases/PhasePortionEstimation";
import PhaseMealReview from "../components/phases/PhaseMealReview";
import PhaseDayReview from "../components/phases/PhaseDayReview";
import PhaseSubmit from "../components/phases/PhaseSubmit";
import PhaseResult from "../components/phases/PhaseResult";
import { useAtlas } from "../context/AtlasContext";

function getCurrentRoute() {
  return window.location.hash === "#/demo" ? "demo" : "home";
}

const FINAL_PHASES = [
  { id: "start", phase: "PHASE 0", title: "Mulai Hari Recall", state: "START" },
  { id: "meal-setup", phase: "PHASE 1", title: "Meal Occasion Setup", state: "MEAL_SETUP" },
  { id: "quick-list", phase: "PHASE 2", title: "Quick List (First Pass)", state: "QUICK_LIST" },
  { id: "food-matching", phase: "PHASE 3", title: "Food Matching (Second Pass)", state: "FOOD_MATCHING" },
  { id: "associated-prompts", phase: "PHASE 4", title: "Associated Food Prompts", state: "PROMPTS" },
  { id: "detail-questions", phase: "PHASE 5", title: "Detail Questions", state: "DETAIL_QUESTIONS" },
  { id: "portion", phase: "PHASE 6", title: "Portion Estimation", state: "PORTION_ESTIMATION" },
  { id: "meal-review", phase: "PHASE 7", title: "Meal Review", state: "MEAL_REVIEW" },
  { id: "day-review", phase: "PHASE 8", title: "Day Review (Final Pass)", state: "DAY_REVIEW" },
  { id: "submit", phase: "PHASE 9", title: "Submit Intake Harian", state: "SUBMITTED" },
  { id: "result", phase: "PHASE 10", title: "Hasil Nilai Gizi", state: "COMPLETED" }
];

const STORAGE_KEY = "atlas-food-final-flow-v1";

export default function Demo() {
  // 3 BARIS INI YANG TADI KETIDAKSENGAJAAN TERHAPUS:
  const [route, setRoute] = useState(getCurrentRoute);
  const [isOpen, setIsOpen] = useState(false);
  const [flowIndex, setFlowIndex] = useState(0);

  // State notice kita biarkan di sini karena hanya dipakai sementara
  const [notice, setNotice] = useState("");

  // Buka brankas AtlasContext untuk mengambil semua data
  const {
    entryMode, setEntryMode,
    sessionDate, setSessionDate,
    dayType, setDayType,
    mealSlots, setMealSlots,
    newMealName, setNewMealName,
    foodNotes, setFoodNotes,
    drinkNotes, setDrinkNotes,
    matchStatus, setMatchStatus,
    missingType, setMissingType,
    recipeIngredients, setRecipeIngredients,
    recipeComposition, setRecipeComposition,
    missingFoodName, setMissingFoodName,
    missingBrand, setMissingBrand,
    missingDescription, setMissingDescription,
    missingPortionNotes, setMissingPortionNotes,
    portionMode, setPortionMode,
    portionScale, setPortionScale,
    portionGram, setPortionGram
  } = useAtlas();
  
  useEffect(() => {
    function handleHashChange() {
      setRoute(getCurrentRoute());
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (route !== "demo") {
      setFlowIndex(0);
    }
  }, [route]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (typeof parsed !== "object" || parsed === null) return;

      if (typeof parsed.flowIndex === "number") {
        setFlowIndex(Math.max(0, Math.min(parsed.flowIndex, FINAL_PHASES.length - 1)));
      }
      if (typeof parsed.entryMode === "string") setEntryMode(parsed.entryMode);
      if (typeof parsed.sessionDate === "string") setSessionDate(parsed.sessionDate);
      if (typeof parsed.dayType === "string") setDayType(parsed.dayType);
      if (Array.isArray(parsed.mealSlots)) setMealSlots(parsed.mealSlots);
      if (typeof parsed.foodNotes === "string") setFoodNotes(parsed.foodNotes);
      if (typeof parsed.drinkNotes === "string") setDrinkNotes(parsed.drinkNotes);
      if (typeof parsed.matchStatus === "string") setMatchStatus(parsed.matchStatus);
      if (typeof parsed.missingType === "string") setMissingType(parsed.missingType);
      if (typeof parsed.recipeIngredients === "string") setRecipeIngredients(parsed.recipeIngredients);
      if (typeof parsed.recipeComposition === "string") setRecipeComposition(parsed.recipeComposition);
      if (typeof parsed.missingFoodName === "string") setMissingFoodName(parsed.missingFoodName);
      if (typeof parsed.missingBrand === "string") setMissingBrand(parsed.missingBrand);
      if (typeof parsed.missingDescription === "string") setMissingDescription(parsed.missingDescription);
      if (typeof parsed.missingPortionNotes === "string") setMissingPortionNotes(parsed.missingPortionNotes);
      if (typeof parsed.portionMode === "string") setPortionMode(parsed.portionMode);
      if (typeof parsed.portionScale === "string") setPortionScale(parsed.portionScale);
      if (typeof parsed.portionGram === "string") setPortionGram(parsed.portionGram);
      setNotice("Draft terakhir berhasil dipulihkan.");
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const snapshot = {
      flowIndex,
      entryMode,
      sessionDate,
      dayType,
      mealSlots,
      foodNotes,
      drinkNotes,
      matchStatus,
      missingType,
      recipeIngredients,
      recipeComposition,
      missingFoodName,
      missingBrand,
      missingDescription,
      missingPortionNotes,
      portionMode,
      portionScale,
      portionGram
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }, [
    flowIndex,
    entryMode,
    sessionDate,
    dayType,
    mealSlots,
    foodNotes,
    drinkNotes,
    matchStatus,
    missingType,
    recipeIngredients,
    recipeComposition,
    missingFoodName,
    missingBrand,
    missingDescription,
    missingPortionNotes,
    portionMode,
    portionScale,
    portionGram
  ]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 2500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const activePhase = FINAL_PHASES[flowIndex];
  const progressPercent = Math.round(((flowIndex + 1) / FINAL_PHASES.length) * 100);
  const isLastPhase = flowIndex === FINAL_PHASES.length - 1;
  const isFirstPhase = flowIndex === 0;
  const maxPhaseNumber = FINAL_PHASES.length - 1;

  const entryModeLabel = useMemo(() => {
    if (entryMode === "tracking") return "Personal tracking tanpa akun";
    if (entryMode === "survey") return "Melalui link survei atau studi";
    return "Login akun biasa";
  }, [entryMode]);

  const dayTypeLabel = dayType === "weekend" ? "Weekend" : "Weekday";

  const phaseIndexMap = useMemo(
    () =>
      FINAL_PHASES.reduce((acc, item, index) => {
        acc[item.id] = index;
        return acc;
      }, {}),
    []
  );

  function nextPhase() {
    if (phaseValidationError) {
      setNotice(phaseValidationError);
      return;
    }
    setFlowIndex((prev) => Math.min(prev + 1, FINAL_PHASES.length - 1));
  }

  function prevPhase() {
    setFlowIndex((prev) => Math.max(prev - 1, 0));
  }

  function goToPhase(phaseId) {
    const target = phaseIndexMap[phaseId];
    if (typeof target === "number") {
      setFlowIndex(target);
    }
  }

  function addMealSlot() {
    if (!newMealName.trim()) {
      setNotice("Nama meal tidak boleh kosong.");
      return;
    }

    setMealSlots((prev) => [
      ...prev,
      {
        name: newMealName.trim(),
        time: ""
      }
    ]);
    setNewMealName("");
    setNotice("Meal baru berhasil ditambahkan.");
  }

  function countLines(text) {
    return text
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean).length;
  }

  function getPhaseValidationError(phaseId) {
    if (phaseId === "start") {
      if (!sessionDate) return "Tanggal recall wajib diisi sebelum lanjut.";
      if (!entryMode) return "Pilih jalur masuk terlebih dahulu.";
    }

    if (phaseId === "meal-setup") {
      if (!mealSlots.length) return "Tambahkan minimal satu sesi makan.";
      const hasInvalidMeal = mealSlots.some((meal) => !meal.name || !meal.name.trim());
      if (hasInvalidMeal) return "Nama meal tidak boleh kosong.";
    }

    if (phaseId === "quick-list") {
      if (countLines(foodNotes) + countLines(drinkNotes) < 1) {
        return "Isi minimal satu item makanan atau minuman.";
      }
    }

    if (phaseId === "food-matching" && matchStatus === "missing") {
      if (missingType === "homemade") {
        if (!recipeIngredients.trim() || !recipeComposition.trim()) {
          return "Isi bahan utama dan komposisi untuk makanan homemade.";
        }
      } else if (!missingFoodName.trim() || !missingDescription.trim() || !missingPortionNotes.trim()) {
        return "Isi nama, deskripsi, dan estimasi porsi untuk missing food.";
      }
    }

    if (phaseId === "portion") {
      if (portionMode === "gram") {
        const gramValue = Number(portionGram);
        if (!Number.isFinite(gramValue) || gramValue <= 0) {
          return "Input gram harus lebih besar dari 0.";
        }
      }
    }

    return "";
  }

  const phaseValidationError = getPhaseValidationError(activePhase.id);

  function updateMealTime(index, value) {
    setMealSlots((prev) => prev.map((item, i) => (i === index ? { ...item, time: value } : item)));
  }

  function exportData(fileType) {
    const summary = {
      jalurMasuk: entryModeLabel,
      tanggal: sessionDate,
      konteksHari: dayTypeLabel,
      faseAktif: activePhase.id,
      mealSlots,
      catatanMakanan: foodNotes,
      catatanMinuman: drinkNotes,
      estimasiPorsi: {
        mode: portionMode,
        skalaVisual: portionScale,
        gram: portionGram
      }
    };

    const payload =
      fileType === "csv"
        ? [
            "field,value",
            `jalur_masuk,${entryModeLabel}`,
            `tanggal,${sessionDate}`,
            `konteks_hari,${dayTypeLabel}`,
            `fase_aktif,${activePhase.id}`,
            `meal_count,${mealSlots.length}`,
            `portion_mode,${portionMode}`,
            `portion_gram,${portionGram}`
          ].join("\n")
        : JSON.stringify(summary, null, 2);

    const blob = new Blob([payload], {
      type: fileType === "csv" ? "text/csv;charset=utf-8" : "application/json;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `atlas-food-summary.${fileType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setNotice(`File ${fileType.toUpperCase()} berhasil diunduh.`);
  }

  function renderPhaseContent() {
      if (activePhase.id === "start") return <PhaseStart />;
      if (activePhase.id === "meal-setup") return <PhaseMealSetup addMealSlot={addMealSlot} updateMealTime={updateMealTime} />;
      if (activePhase.id === "quick-list") return <PhaseQuickList />;
      if (activePhase.id === "food-matching") return <PhaseFoodMatching />;
      if (activePhase.id === "associated-prompts") return <PhaseAssociatedPrompts goToPhase={goToPhase} setNotice={setNotice} nextPhase={nextPhase} />;
      if (activePhase.id === "detail-questions") return <PhaseDetailQuestions />;
      if (activePhase.id === "portion") return <PhasePortionEstimation />;
      if (activePhase.id === "meal-review") return <PhaseMealReview />;
      if (activePhase.id === "day-review") return <PhaseDayReview goToPhase={goToPhase} setNotice={setNotice} />;
      if (activePhase.id === "submit") return <PhaseSubmit goToPhase={goToPhase} setNotice={setNotice} />;
      
      return <PhaseResult exportData={exportData} />;
    }
    
  if (route === "demo") {
    return (
      <main className="survey-shell" aria-labelledby="survey-title">
        <section className="survey-frame">
          <header className="survey-brandbar">
            <h1 id="survey-title">Atlas Food</h1>
          </header>

          <div className="survey-toprow">
            <p>Recall hari ini: 1</p>
            <nav aria-label="Tautan utilitas survey">
              <button
                type="button"
                className="utility-link-btn"
                onClick={() => setNotice("Video tutorial akan segera tersedia.")}
              >
                Lihat video tutorial
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = "#/";
                }}
              >
                Keluar
              </button>
            </nav>
          </div>

          <div className="survey-content">
            <section className="flow-layout" aria-live="polite">
              <aside className="state-machine" aria-label="Progress flow">
                <h2>Flowchart</h2>
                <div className="flowchart-track" aria-label="Flowchart fase">
                  {FINAL_PHASES.map((phase, index) => (
                    <div key={`flowchart-${phase.id}`} className="flowchart-step">
                      <span className={`flowchart-node ${index < flowIndex ? "done" : index === flowIndex ? "active" : "todo"}`}>
                        {index}
                      </span>
                      <small>{phase.state}</small>
                      {index < FINAL_PHASES.length - 1 ? <i className="flowchart-arrow" aria-hidden="true">→</i> : null}
                    </div>
                  ))}
                </div>
                <ul>
                  {FINAL_PHASES.map((step, index) => (
                    <li
                      key={step.id}
                      className={index < flowIndex ? "done" : index === flowIndex ? "active" : "todo"}
                    >
                      <span>{step.phase}</span>
                      <strong>{step.title}</strong>
                      <em>{step.state}</em>
                    </li>
                  ))}
                </ul>
              </aside>

              <div className="flow-main">
                <section className="flow-meta" aria-label="Ringkasan sesi">
                  <article>
                    <p>Jalur masuk</p>
                    <strong>{entryModeLabel}</strong>
                  </article>
                  <article>
                    <p>Tanggal recall</p>
                    <strong>{sessionDate}</strong>
                  </article>
                  <article>
                    <p>Konteks hari</p>
                    <strong>{dayTypeLabel}</strong>
                  </article>
                </section>

                <header className="flow-header">
                  <p>{activePhase.phase} dari {maxPhaseNumber}</p>
                  <h2>{activePhase.title}</h2>
                  <span>Status: {activePhase.state}</span>
                  <div className="flow-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercent}>
                    <i style={{ width: `${progressPercent}%` }} />
                  </div>
                  <small>Progress alur: {progressPercent}% selesai</small>
                </header>

                {renderPhaseContent()}

                <div className="flow-nav">
                  <p>Navigasi: kembali untuk revisi, lanjut untuk ke fase berikutnya.</p>
                  <button type="button" className="back-btn" onClick={prevPhase} disabled={isFirstPhase}>
                    Kembali
                  </button>
                  {isLastPhase ? (
                    <button
                      type="button"
                      className="continue-btn"
                      onClick={() => {
                        window.location.hash = "#/";
                      }}
                    >
                      Selesai ke Beranda
                    </button>
                  ) : (
                    <button type="button" className="continue-btn" onClick={nextPhase} disabled={Boolean(phaseValidationError)}>
                      Lanjut Fase
                    </button>
                  )}
                </div>

                {phaseValidationError ? <p className="validation-hint">{phaseValidationError}</p> : null}

                {notice ? <div className="notice-bar" role="status">{notice}</div> : null}
              </div>
            </section>
          </div>

          <footer className="survey-footer">
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => setNotice("Halaman kebijakan privasi belum dihubungkan.")}
            >
              Kebijakan privasi
            </button>
            <span>|</span>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => setNotice("Halaman syarat dan ketentuan belum dihubungkan.")}
            >
              Syarat dan ketentuan
            </button>
          </footer>
        </section>
      </main>
    );
  }
}