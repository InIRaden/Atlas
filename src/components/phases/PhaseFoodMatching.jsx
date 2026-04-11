export default function PhaseFoodMatching({
  matchStatus, setMatchStatus,
  missingType, setMissingType,
  recipeIngredients, setRecipeIngredients,
  recipeComposition, setRecipeComposition,
  missingFoodName, setMissingFoodName,
  missingBrand, setMissingBrand,
  missingDescription, setMissingDescription,
  missingPortionNotes, setMissingPortionNotes
}) {
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