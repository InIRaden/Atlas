export default function PhaseAssociatedPrompts({ goToPhase, setNotice, nextPhase }) {
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