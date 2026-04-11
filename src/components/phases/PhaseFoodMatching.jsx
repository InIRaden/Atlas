import { useState } from "react";
import { useAtlas } from "../../context/AtlasContext";

// 1. Mengimpor database tiruan yang baru saja kita buat!
import foodsDatabase from "../../data/foods.json";

export default function PhaseFoodMatching() {
  const {
    matchStatus, setMatchStatus, missingType, setMissingType,
    recipeIngredients, setRecipeIngredients, recipeComposition, setRecipeComposition,
    missingFoodName, setMissingFoodName, missingBrand, setMissingBrand,
    missingDescription, setMissingDescription, missingPortionNotes, setMissingPortionNotes,
    selectedFood, setSelectedFood
  } = useAtlas();

  // 2. Membuat state khusus untuk mencatat ketikan user di search bar
  const [searchQuery, setSearchQuery] = useState("");

  // 3. Logika Mesin Pencari: Filter data JSON berdasarkan ketikan (searchQuery)
  const filteredFoods = foodsDatabase.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <input type="text" placeholder="Contoh: beras, telur, minyak" value={recipeIngredients} onChange={(e) => setRecipeIngredients(e.target.value)} />
              </label>
              <label>
                Komposisi atau resep
                <input type="text" placeholder="Contoh: 1 porsi, 2 telur" value={recipeComposition} onChange={(e) => setRecipeComposition(e.target.value)} />
              </label>
            </div>
          ) : (
            <div className="form-grid two-up">
              <label>
                Nama makanan
                <input type="text" placeholder="Contoh: Roti isi rumahan" value={missingFoodName} onChange={(e) => setMissingFoodName(e.target.value)} />
              </label>
              <label>
                Brand
                <input type="text" placeholder="Opsional" value={missingBrand} onChange={(e) => setMissingBrand(e.target.value)} />
              </label>
              <label>
                Deskripsi singkat
                <input type="text" placeholder="Contoh: roti gandum isi ayam" value={missingDescription} onChange={(e) => setMissingDescription(e.target.value)} />
              </label>
              <label>
                Estimasi porsi dan sisa makanan
                <input type="text" placeholder="Contoh: 1 porsi, tersisa 20%" value={missingPortionNotes} onChange={(e) => setMissingPortionNotes(e.target.value)} />
              </label>
            </div>
          )}
        </div>
      ) : (
        <div className="matching-active-flow">
          
          {/* 4. Ini adalah UI Search Bar-nya */}
          <div className="inline-form" style={{ marginBottom: "1.5rem" }}>
            <input
              type="text"
              placeholder="🔍 Cari nama makanan di database... (Contoh: mie, ayam, kopi)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #ccc" }}
            />
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nama Makanan</th>
                  <th>Kategori</th>
                  <th>Brand</th>
                </tr>
              </thead>
              <tbody>
                {/* 5. Tampilkan hasil filter, atau beri pesan jika kosong */}
                {filteredFoods.length > 0 ? (
                    filteredFoods.map((food) => (
                    <tr 
                        key={food.id}
                        // 👇 TAMBAHKAN LOGIKA ONCLICK & STYLING INI
                        onClick={() => setSelectedFood(food)}
                        style={{ 
                        cursor: "pointer", 
                        backgroundColor: selectedFood?.id === food.id ? "#e0f2fe" : "transparent" 
                        }}
                    >
                        <td><strong>{food.name}</strong> <br/><small>{food.englishName}</small></td>
                        <td>{food.category}</td>
                        <td>{food.brand}</td>
                    </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
                      <em>Makanan "{searchQuery}" tidak ditemukan di database. <br/>Silakan pilih tab "Saya tidak menemukan makanan saya".</em>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}