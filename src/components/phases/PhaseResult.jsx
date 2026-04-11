import { useAtlas } from "../../context/AtlasContext";

export default function PhaseResult({ exportData }) {
  // Ambil Makanan Terpilih dan Porsi Gram dari Brankas
  const { selectedFood, portionGram } = useAtlas();

  // --- LOGIKA PERHITUNGAN GIZI OTOMATIS ---
  let totalKkal = 0, totalProtein = 0, totalFat = 0, totalCarbs = 0;

  // Jika user memilih makanan DAN memasukkan gram
  if (selectedFood && portionGram) {
    const gramNumber = Number(portionGram);
    
    // Rumus Intake24: (Gizi per 100g / 100) * Input Gram
    const multiplier = gramNumber / 100;
    
    totalKkal = (selectedFood.nutritionPer100g.calories * multiplier).toFixed(1);
    totalProtein = (selectedFood.nutritionPer100g.protein * multiplier).toFixed(1);
    totalFat = (selectedFood.nutritionPer100g.fat * multiplier).toFixed(1);
    totalCarbs = (selectedFood.nutritionPer100g.carbs * multiplier).toFixed(1);
  }

  return (
    <section className="flow-card" aria-live="polite">
      <h3>Hasil nilai gizi</h3>
      <p>Ringkasan nilai gizi harian berdasarkan {portionGram ? portionGram : "0"} gram <strong>{selectedFood ? selectedFood.name : "Makanan Belum Dipilih"}</strong>.</p>
      
      <div className="dashboard-grid">
        <article>
          <p>Total energi</p>
          <strong>{totalKkal} kkal</strong>
        </article>
        <article>
          <p>Protein</p>
          <strong>{totalProtein} g</strong>
        </article>
        <article>
          <p>Lemak</p>
          <strong>{totalFat} g</strong>
        </article>
        <article>
          <p>Karbohidrat</p>
          <strong>{totalCarbs} g</strong>
        </article>
      </div>
      
      <div className="demo-actions">
        <button type="button" className="continue-btn" onClick={() => exportData("csv")}>Unduh CSV</button>
        <button type="button" className="back-btn" onClick={() => exportData("json")}>Unduh JSON</button>
      </div>
    </section>
  );
}