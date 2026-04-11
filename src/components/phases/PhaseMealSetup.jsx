export default function PhaseMealSetup({
  mealSlots, updateMealTime,
  newMealName, setNewMealName,
  addMealSlot
}) {
  return (
    <section className="flow-card" aria-live="polite">
      <h3>Meal occasion setup</h3>
      <p>Tambahkan sesi makan: breakfast, lunch, dinner, snack. Waktu perkiraan opsional tetapi disarankan.</p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Meal</th>
              <th>Waktu perkiraan</th>
            </tr>
          </thead>
          <tbody>
            {mealSlots.map((meal, index) => (
              <tr key={`${meal.name}-${index}`}>
                <td>{meal.name}</td>
                <td>
                  <input
                    type="time"
                    value={meal.time}
                    onChange={(e) => updateMealTime(index, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="inline-form">
        <input
          type="text"
          placeholder="Tambah meal baru, contoh: Supper"
          value={newMealName}
          onChange={(e) => setNewMealName(e.target.value)}
        />
        <button type="button" className="ghost-btn" onClick={addMealSlot}>
          + Tambah meal
        </button>
      </div>
    </section>
  );
}