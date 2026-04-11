import { useAtlas } from "../../context/AtlasContext";

export default function PhasePortionEstimation() {
  const {
    portionMode, setPortionMode, portionScale, setPortionScale,
    portionGram, setPortionGram
  } = useAtlas();

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