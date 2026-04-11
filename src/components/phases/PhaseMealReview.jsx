export default function PhaseMealReview() {
  return (
    <section className="flow-card" aria-live="polite">
      <h3>Meal review</h3>
      <p>Per meal, cek item dan status kelengkapan sebelum lanjut.</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Meal</th>
              <th>Item</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sarapan</td>
              <td>Nasi goreng, Teh manis</td>
              <td><span className="badge-ok">Lengkap</span></td>
              <td>Edit | Hapus</td>
            </tr>
            <tr>
              <td>Snack</td>
              <td>Pisang goreng</td>
              <td><span className="badge-warn">Belum lengkap</span></td>
              <td>Edit | Tambah item</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}