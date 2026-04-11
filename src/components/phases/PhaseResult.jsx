export default function PhaseResult({ exportData }) {
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