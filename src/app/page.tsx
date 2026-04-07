import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-12">
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div className="animate-rise space-y-6">
          <p className="inline-flex rounded-full bg-atlas-cyan/30 px-4 py-2 text-sm font-semibold text-cyan-900">
            Atlas Food • Multiple-Pass Recall
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-atlas-ink md:text-6xl">
            Catat Pola Makan Harian dengan Alur Recall yang Presisi
          </h1>
          <p className="max-w-xl text-lg text-slate-600">
            Atlas Food membantu pengguna merekam konsumsi makanan dengan metode bertahap:
            quick recall, food matching, estimasi porsi visual, smart prompts, hingga
            dashboard nutrisi.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/recall/new"
              className="rounded-2xl bg-atlas-gold px-6 py-3 text-base font-semibold text-slate-900 shadow-card"
            >
              Start Recall Session
            </Link>
            <Link
              href="/dashboard"
              className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700"
            >
              Open Dashboard
            </Link>
          </div>
        </div>

        <div className="animate-rise rounded-[2rem] bg-white/85 p-6 shadow-card" style={{ animationDelay: "120ms" }}>
          <div className="grid gap-4">
            <article className="rounded-2xl border border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50 p-4">
              <h3 className="font-semibold">Personal Tracking</h3>
              <p className="text-sm text-slate-600">
                Mode publik dengan landing page terbuka untuk pengguna personal.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-100 bg-gradient-to-r from-cyan-50 to-sky-50 p-4">
              <h3 className="font-semibold">Status Tersedia/Tidak Tersedia</h3>
              <p className="text-sm text-slate-600">
                Penanda visual cepat saat matching item dengan database makanan.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-100 bg-gradient-to-r from-lime-50 to-green-50 p-4">
              <h3 className="font-semibold">Alat Ukur Rumah Tangga Lokal</h3>
              <p className="text-sm text-slate-600">
                Gunakan gelas, mangkok, sendok, termasuk kebutuhan lokal Indonesia.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
