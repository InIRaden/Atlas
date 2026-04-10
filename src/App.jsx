import { useEffect, useMemo, useState } from "react";

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

function App() {
  const [route, setRoute] = useState(getCurrentRoute);
  const [isOpen, setIsOpen] = useState(false);
  const [flowIndex, setFlowIndex] = useState(0);

  const [entryMode, setEntryMode] = useState("login");
  const [sessionDate, setSessionDate] = useState("2026-04-10");
  const [dayType, setDayType] = useState("weekday");

  const [newMealName, setNewMealName] = useState("");
  const [mealSlots, setMealSlots] = useState([
    { name: "Sarapan", time: "07:30" },
    { name: "Makan Siang", time: "12:30" },
    { name: "Makan Malam", time: "19:00" },
    { name: "Snack", time: "16:00" }
  ]);

  const [foodNotes, setFoodNotes] = useState("Nasi goreng\nTelur dadar\nSambal");
  const [drinkNotes, setDrinkNotes] = useState("Teh manis\nAir putih");

  const [matchStatus, setMatchStatus] = useState("matched");
  const [missingType, setMissingType] = useState("homemade");
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeComposition, setRecipeComposition] = useState("");
  const [missingFoodName, setMissingFoodName] = useState("");
  const [missingBrand, setMissingBrand] = useState("");
  const [missingDescription, setMissingDescription] = useState("");
  const [missingPortionNotes, setMissingPortionNotes] = useState("");
  const [portionMode, setPortionMode] = useState("visual");
  const [portionScale, setPortionScale] = useState("same");
  const [portionGram, setPortionGram] = useState("150");
  const [notice, setNotice] = useState("");

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
    if (activePhase.id === "start") {
      return (
        <section className="flow-card" aria-live="polite">
          <h3>Mulai hari baru</h3>
          <p className="lead-copy">Mari ingat kembali semua yang Anda makan dan minum kemarin.</p>

          <div className="option-grid">
            <button type="button" className={`option-card ${entryMode === "login" ? "active" : ""}`} onClick={() => setEntryMode("login")}>
              Login akun biasa
            </button>
            <button type="button" className={`option-card ${entryMode === "survey" ? "active" : ""}`} onClick={() => setEntryMode("survey")}>
              Link survei atau studi
            </button>
            <button type="button" className={`option-card ${entryMode === "tracking" ? "active" : ""}`} onClick={() => setEntryMode("tracking")}>
              Personal tracking tanpa akun
            </button>
          </div>

          <div className="form-grid two-up">
            <label>
              Tanggal recall
              <input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} />
            </label>
            <label>
              Konteks hari
              <select value={dayType} onChange={(e) => setDayType(e.target.value)}>
                <option value="weekday">Weekday</option>
                <option value="weekend">Weekend</option>
              </select>
            </label>
          </div>
        </section>
      );
    }

    if (activePhase.id === "meal-setup") {
      return (
        <section className="flow-card" aria-live="polite">
          <h3>Meal occasion setup</h3>
          <p>Tambahkan sesi makan: breakfast, lunch, dinner, snack. Waktu perkiraan opsional tetapi disarankan.</p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Meal</th>
                  <th>Waktu perkiraan</th>
                </tr>
              </thead>
              <tbody>
                {mealSlots.map((meal, index) => (
                  <tr key={`${meal.name}-${index}`}>
                    <td>{meal.name}</td>
                    <td>
                      <input
                        type="time"
                        value={meal.time}
                        onChange={(e) => updateMealTime(index, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="inline-form">
            <input
              type="text"
              placeholder="Tambah meal baru, contoh: Supper"
              value={newMealName}
              onChange={(e) => setNewMealName(e.target.value)}
            />
            <button type="button" className="ghost-btn" onClick={addMealSlot}>
              + Tambah meal
            </button>
          </div>
        </section>
      );
    }

    if (activePhase.id === "quick-list") {
      return (
        <section className="flow-card" aria-live="polite">
          <h3>Quick list (first pass recall)</h3>
          <p>Brain dump tanpa interupsi. Ketik 1 item per baris, belum ada validasi di tahap ini.</p>

          <div className="form-grid two-up">
            <label>
              Daftar makanan
              <textarea rows="8" value={foodNotes} onChange={(e) => setFoodNotes(e.target.value)} />
            </label>
            <label>
              Daftar minuman
              <textarea rows="8" value={drinkNotes} onChange={(e) => setDrinkNotes(e.target.value)} />
            </label>
          </div>
        </section>
      );
    }

    if (activePhase.id === "food-matching") {
      return (
        <section className="flow-card" aria-live="polite">
          <h3>Food matching (second pass)</h3>
          <p>Konversi raw text menjadi item terstruktur berdasarkan database makanan.</p>

          <div className="status-actions">
            <button type="button" className={matchStatus === "matched" ? "active" : ""} onClick={() => setMatchStatus("matched")}>Ditemukan</button>
            <button type="button" className={matchStatus === "similar" ? "active" : ""} onClick={() => setMatchStatus("similar")}>Mirip</button>
            <button type="button" className={matchStatus === "missing" ? "active" : ""} onClick={() => setMatchStatus("missing")}>Saya tidak menemukan makanan saya</button>
          </div>

          {matchStatus === "missing" ? (
            <div className="missing-flow">
              <h4>Missing Food Flow</h4>
              <p>Apakah makanan ini homemade, dan apakah Anda tahu bahan-bahannya?</p>

              <div className="status-actions">
                <button type="button" className={missingType === "homemade" ? "active" : ""} onClick={() => setMissingType("homemade")}>Ya, homemade</button>
                <button type="button" className={missingType === "unknown" ? "active" : ""} onClick={() => setMissingType("unknown")}>Tidak tahu detail bahan</button>
              </div>

              {missingType === "homemade" ? (
                <div className="form-grid two-up">
                  <label>
                    Bahan utama
                    <input
                      type="text"
                      placeholder="Contoh: beras, telur, minyak"
                      value={recipeIngredients}
                      onChange={(e) => setRecipeIngredients(e.target.value)}
                    />
                  </label>
                  <label>
                    Komposisi atau resep
                    <input
                      type="text"
                      placeholder="Contoh: 1 porsi, 2 telur"
                      value={recipeComposition}
                      onChange={(e) => setRecipeComposition(e.target.value)}
                    />
                  </label>
                </div>
              ) : (
                <div className="form-grid two-up">
                  <label>
                    Nama makanan
                    <input
                      type="text"
                      placeholder="Contoh: Roti isi rumahan"
                      value={missingFoodName}
                      onChange={(e) => setMissingFoodName(e.target.value)}
                    />
                  </label>
                  <label>
                    Brand
                    <input
                      type="text"
                      placeholder="Opsional"
                      value={missingBrand}
                      onChange={(e) => setMissingBrand(e.target.value)}
                    />
                  </label>
                  <label>
                    Deskripsi singkat
                    <input
                      type="text"
                      placeholder="Contoh: roti gandum isi ayam"
                      value={missingDescription}
                      onChange={(e) => setMissingDescription(e.target.value)}
                    />
                  </label>
                  <label>
                    Estimasi porsi dan sisa makanan
                    <input
                      type="text"
                      placeholder="Contoh: 1 porsi, tersisa 20%"
                      value={missingPortionNotes}
                      onChange={(e) => setMissingPortionNotes(e.target.value)}
                    />
                  </label>
                </div>
              )}
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Raw item</th>
                    <th>Hasil matching</th>
                    <th>Kategori</th>
                    <th>Brand</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Nasi goreng</td>
                    <td>Fried rice, egg</td>
                    <td>Makanan utama</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>Teh manis</td>
                    <td>Sweetened iced tea</td>
                    <td>Minuman</td>
                    <td>Teh Botol (similar)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </section>
      );
    }

    if (activePhase.id === "associated-prompts") {
      return (
        <section className="flow-card" aria-live="polite">
          <h3>Associated food prompts (third pass)</h3>
          <p>Sistem memberi prompt khas Intake24 agar item yang sering terlupa bisa ikut tercatat.</p>
          <ul className="prompt-list">
            <li>Apakah ada minuman yang diminum bersama meal ini?</li>
            <li>Apakah ada gula, saus, atau condiments tambahan?</li>
            <li>Apakah ada item lain yang dimakan bersamaan?</li>
          </ul>
          <div className="demo-actions">
            <button
              type="button"
              className="continue-btn"
              onClick={() => {
                goToPhase("food-matching");
                setNotice("Silakan match item baru pada fase Food Matching.");
              }}
            >
              + Tambah item baru
            </button>
            <button type="button" className="back-btn" onClick={nextPhase}>Lewati prompt</button>
          </div>
          <p className="micro-note">Jika menambah item baru, alur kembali ke phase food matching untuk item tersebut.</p>
        </section>
      );
    }

    if (activePhase.id === "detail-questions") {
      return (
        <section className="flow-card" aria-live="polite">
          <h3>Detail questions (conditional)</h3>
          <p>Pertanyaan detail muncul tergantung jenis item agar atribut makanan lebih akurat.</p>
          <div className="form-grid three-up">
            <label>
              Kopi: pakai gula?
              <select defaultValue="ya">
                <option value="ya">Ya</option>
                <option value="tidak">Tidak</option>
              </select>
            </label>
            <label>
              Kopi: pakai susu?
              <select defaultValue="ya">
                <option value="ya">Ya</option>
                <option value="tidak">Tidak</option>
              </select>
            </label>
            <label>
              Ayam: metode masak
              <select defaultValue="goreng">
                <option value="goreng">Digoreng</option>
                <option value="bakar">Dibakar</option>
                <option value="rebus">Direbus</option>
              </select>
            </label>
          </div>
        </section>
      );
    }

    if (activePhase.id === "portion") {
      return (
        <section className="flow-card" aria-live="polite">
          <h3>Portion estimation</h3>
          <p>Untuk semua item tervalidasi: pilih visual less/same/more atau input gram langsung.</p>

          <div className="status-actions">
            <button type="button" className={portionMode === "visual" ? "active" : ""} onClick={() => setPortionMode("visual")}>Mode visual</button>
            <button type="button" className={portionMode === "gram" ? "active" : ""} onClick={() => setPortionMode("gram")}>Input gram</button>
          </div>

          {portionMode === "visual" ? (
            <div className="portion-visual">
              <div className="portion-gallery">
                <button type="button">Less</button>
                <button type="button" className="active">Same</button>
                <button type="button">More</button>
              </div>
              <div className="status-actions">
                <button type="button" className={portionScale === "less" ? "active" : ""} onClick={() => setPortionScale("less")}>Less</button>
                <button type="button" className={portionScale === "same" ? "active" : ""} onClick={() => setPortionScale("same")}>Same</button>
                <button type="button" className={portionScale === "more" ? "active" : ""} onClick={() => setPortionScale("more")}>More</button>
              </div>
            </div>
          ) : (
            <div className="inline-form">
              <input type="number" min="0" value={portionGram} onChange={(e) => setPortionGram(e.target.value)} />
              <span className="tag">gram</span>
            </div>
          )}
        </section>
      );
    }

    if (activePhase.id === "meal-review") {
      return (
        <section className="flow-card" aria-live="polite">
          <h3>Meal review</h3>
          <p>Per meal, cek item dan status kelengkapan sebelum lanjut.</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Meal</th>
                  <th>Item</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sarapan</td>
                  <td>Nasi goreng, Teh manis</td>
                  <td><span className="badge-ok">Lengkap</span></td>
                  <td>Edit | Hapus</td>
                </tr>
                <tr>
                  <td>Snack</td>
                  <td>Pisang goreng</td>
                  <td><span className="badge-warn">Belum lengkap</span></td>
                  <td>Edit | Tambah item</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (activePhase.id === "day-review") {
      return (
        <section className="flow-card" aria-live="polite">
          <h3>Day review (final pass)</h3>
          <p>Apakah Anda lupa sesuatu yang dimakan atau diminum kemarin?</p>
          <div className="demo-actions">
            <button
              type="button"
              className="continue-btn"
              onClick={() => {
                goToPhase("food-matching");
                setNotice("Anda kembali ke Food Matching untuk menambah item.");
              }}
            >
              Ya, tambah item
            </button>
            <button type="button" className="back-btn" onClick={() => goToPhase("submit")}>Tidak, lanjut submit</button>
          </div>
          <p className="micro-note">Jika memilih tambah item, alur kembali ke phase food matching.</p>
        </section>
      );
    }

    if (activePhase.id === "submit") {
      return (
        <section className="flow-card" aria-live="polite">
          <h3>Submit intake harian</h3>
          <p>Data intake dikirim, dipetakan ke nutrient database, dan item missing diberi flag review.</p>
          <div className="formula-box">
            <p>nutrient_final = (amount_per_100g / 100) x estimated_grams</p>
          </div>
          <div className="demo-actions">
            <button
              type="button"
              className="continue-btn"
              onClick={() => {
                goToPhase("result");
                setNotice("Intake harian berhasil disubmit.");
              }}
            >
              Submit sekarang
            </button>
            <button type="button" className="back-btn" onClick={() => goToPhase("day-review")}>Kembali cek data</button>
          </div>
        </section>
      );
    }

    return (
      <section className="flow-card" aria-live="polite">
        <h3>Hasil nilai gizi</h3>
        <p>Ringkasan nilai gizi harian setelah submit.</p>
        <div className="dashboard-grid">
          <article>
            <p>Total energi</p>
            <strong>1.842 kkal</strong>
          </article>
          <article>
            <p>Protein</p>
            <strong>68,2 g</strong>
          </article>
          <article>
            <p>Lemak</p>
            <strong>70,1 g</strong>
          </article>
          <article>
            <p>Karbohidrat</p>
            <strong>228,4 g</strong>
          </article>
        </div>
        <div className="demo-actions">
          <button type="button" className="continue-btn" onClick={() => exportData("csv")}>Unduh CSV</button>
          <button type="button" className="back-btn" onClick={() => exportData("json")}>Unduh JSON</button>
        </div>
      </section>
    );
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

  return (
    <div className="page-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Atlas Food beranda">
          <img src="/logo.svg" alt="Atlas Food" />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="site-nav"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Menu
        </button>

        <nav className={`site-nav ${isOpen ? "open" : ""}`} id="site-nav" aria-label="Navigasi utama">
          <a className="active" href="#">Beranda</a>
          <a href="#">Tentang</a>
          <a href="#">Metodologi</a>
          <a href="#">Fitur</a>
          <a href="#">Sumber daya</a>
          <a className="contact-btn" href="#">Hubungi Kami</a>
        </nav>
      </header>

      <main className="hero-wrap">
        <section className="hero-copy">
          <span className="hero-kicker" aria-hidden="true">
            {'\''}
          </span>
          <h1>Cara mudah mengukur pola makan harian</h1>
          <p>
            Atlas Food adalah sistem dietary recall berbasis multiple-pass yang membantu pengguna
            mencatat intake makanan dan minuman secara lebih akurat.
          </p>
          <button
            type="button"
            className="demo-btn"
            onClick={() => {
              window.location.hash = "#/demo";
            }}
          >
            Coba Demo Alur Final
          </button>
        </section>

        <section className="hero-media" aria-label="Ilustrasi Atlas Food">
          <img src="/hero.svg" alt="Ilustrasi Atlas Food" />
        </section>
      </main>
    </div>
  );
}

export default App;
