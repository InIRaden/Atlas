export default function PhaseSubmit({ goToPhase, setNotice }) {
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