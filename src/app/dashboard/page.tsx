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
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Atlas Dashboard</h1>
          <p className="text-slate-600">Draft dan riwayat recall session.</p>
        </div>
        <Link
          href="/recall/new"
          className="rounded-xl bg-atlas-gold px-4 py-2 font-semibold text-slate-900"
        >
          New Session
        </Link>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl bg-white/80 p-6 shadow-card">
          <h2 className="text-xl font-semibold">Draft Sessions</h2>
          <div className="mt-4 space-y-3">
            {grouped.draft.map((session) => (
              <div key={session.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="font-medium">{session.date}</p>
                <p className="text-sm text-slate-500">
                  {session.context.toUpperCase()} • Pass {session.pass}
                </p>
              </div>
            ))}
            {grouped.draft.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No draft session.</p>
            ) : null}
          </div>
        </article>

        <article className="rounded-3xl bg-white/80 p-6 shadow-card">
          <h2 className="text-xl font-semibold">Submitted Sessions</h2>
          <div className="mt-4 space-y-3">
            {grouped.submitted.map((session) => (
              <div key={session.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="font-medium">{session.date}</p>
                <p className="text-sm text-slate-500">
                  {session.context.toUpperCase()} • {session.items.length} items
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
