import { useAtlas } from "../../context/AtlasContext";

export default function PhaseQuickList() {
  const { foodNotes, setFoodNotes, drinkNotes, setDrinkNotes } = useAtlas();

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