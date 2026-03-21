export default function ServicesLoading() {
  return (
    <main id="conteudo" className="page-shell py-16">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a,#312e81_58%,#6366f1)] px-8 py-10 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
        <div className="h-4 w-28 animate-pulse rounded-full bg-white/20" />
        <div className="mt-4 h-12 w-full max-w-2xl animate-pulse rounded-2xl bg-white/18" />
        <div className="mt-4 h-7 w-full max-w-3xl animate-pulse rounded-2xl bg-white/12" />
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="h-10 w-36 animate-pulse rounded-full bg-white/14" />
          <div className="h-10 w-36 animate-pulse rounded-full bg-white/14" />
          <div className="h-10 w-40 animate-pulse rounded-full bg-white/14" />
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-border bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-100" />
          <div className="space-y-2">
            <div className="h-4 w-44 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto]">
          <div className="h-16 animate-pulse rounded-[1.25rem] bg-slate-100" />
          <div className="h-16 animate-pulse rounded-[1.25rem] bg-slate-100" />
          <div className="h-16 animate-pulse rounded-[1.25rem] bg-slate-100" />
          <div className="h-16 animate-pulse rounded-[1.25rem] bg-slate-100" />
          <div className="h-12 animate-pulse rounded-full bg-slate-200" />
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.08)]"
          >
            <div className="aspect-[4/3] animate-pulse bg-slate-200" />
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="h-7 w-24 animate-pulse rounded-full bg-slate-100" />
                <div className="h-5 w-24 animate-pulse rounded bg-slate-100" />
              </div>
              <div className="h-10 w-4/5 animate-pulse rounded bg-slate-100" />
              <div className="h-20 animate-pulse rounded bg-slate-100" />
              <div className="flex gap-3">
                <div className="h-5 w-20 animate-pulse rounded bg-slate-100" />
                <div className="h-5 w-28 animate-pulse rounded bg-slate-100" />
              </div>
              <div className="flex items-end justify-between gap-4 pt-3">
                <div className="space-y-2">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                  <div className="h-10 w-28 animate-pulse rounded bg-slate-100" />
                </div>
                <div className="h-12 w-36 animate-pulse rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
