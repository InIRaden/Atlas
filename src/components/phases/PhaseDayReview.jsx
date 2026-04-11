export default function PhaseDayReview({ goToPhase, setNotice }) {
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