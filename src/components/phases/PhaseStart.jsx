export default function PhaseStart({
  entryMode, 
  setEntryMode,
  sessionDate, 
  setSessionDate,
  dayType, 
  setDayType
}) {
  return (
    <section className="flow-card" aria-live="polite">
      <h3>Mulai hari baru</h3>
      <p className="lead-copy">Mari ingat kembali semua yang Anda makan dan minum kemarin.</p>

      <div className="option-grid">
        <button type="button" className={`option-card ${entryMode === "login" ? "active" : ""}`} onClick={() => setEntryMode("login")}>
          Login akun biasa
        </button>
        <button type="button" className={`option-card ${entryMode === "survey" ? "active" : ""}`} onClick={() => setEntryMode("survey")}>
          Link survei atau studi
        </button>
        <button type="button" className={`option-card ${entryMode === "tracking" ? "active" : ""}`} onClick={() => setEntryMode("tracking")}>
          Personal tracking tanpa akun
        </button>
      </div>

      <div className="form-grid two-up">
        <label>
          Tanggal recall
          <input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} />
        </label>
        <label>
          Konteks hari
          <select value={dayType} onChange={(e) => setDayType(e.target.value)}>
            <option value="weekday">Weekday</option>
            <option value="weekend">Weekend</option>
          </select>
        </label>
      </div>
    </section>
  );
}