export default function PhaseDetailQuestions() {
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