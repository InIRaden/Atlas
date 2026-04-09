"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRecallSessionStore } from "@/store/recall-session";

export default function DashboardPage() {
  const sessions = useRecallSessionStore((state) => state.sessions);

  const grouped = useMemo(
    () => ({
      draft: sessions.filter((session) => session.status === "draft"),
      submitted: sessions.filter((session) => session.status === "submitted"),
    }),
    [sessions],
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <header className="mb-8 rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-card backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex rounded-full bg-atlas-cyan/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-950">
              Your food intake
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-atlas-ink">Atlas Recall Dashboard</h1>
            <p className="mt-1 text-slate-600">Lanjutkan draft atau lihat session yang sudah selesai.</p>
          </div>
          <Link
            href="/recall/new"
            className="rounded-xl bg-atlas-gold px-4 py-2 font-semibold text-slate-900"
          >
            Start New Interview
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl bg-amber-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-amber-700">All sessions</p>
            <p className="mt-1 text-2xl font-semibold">{sessions.length}</p>
          </article>
          <article className="rounded-2xl bg-cyan-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-cyan-700">Draft</p>
            <p className="mt-1 text-2xl font-semibold">{grouped.draft.length}</p>
          </article>
          <article className="rounded-2xl bg-lime-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-lime-700">Submitted</p>
            <p className="mt-1 text-2xl font-semibold">{grouped.submitted.length}</p>
          </article>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur">
          <h2 className="text-xl font-semibold">Draft Interviews</h2>
          <p className="mt-1 text-sm text-slate-500">Session yang masih perlu detail, matching, atau portion.</p>
          <div className="mt-4 space-y-3">
            {grouped.draft.map((session) => (
              <div key={session.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{session.date}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">
                    Pass {session.pass}/6
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {session.context.toUpperCase()} • {session.items.length} items
                </p>
              </div>
            ))}
            {grouped.draft.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No draft session.</p>
            ) : null}
          </div>
        </article>

        <article className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur">
          <h2 className="text-xl font-semibold">Submitted Interviews</h2>
          <p className="mt-1 text-sm text-slate-500">Riwayat recall yang sudah complete dan terkirim.</p>
          <div className="mt-4 space-y-3">
            {grouped.submitted.map((session) => (
              <div key={session.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{session.date}</p>
                  <span className="rounded-full bg-atlas-green/25 px-2 py-1 text-xs font-semibold text-green-800">
                    Submitted
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {session.context.toUpperCase()} • {session.items.length} items logged
                </p>
              </div>
            ))}
            {grouped.submitted.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                No submitted session.
              </p>
            ) : null}
          </div>
        </article>
      </section>
    </main>
  );
}
