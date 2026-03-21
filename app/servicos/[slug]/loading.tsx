export default function ServiceDetailLoading() {
  return (
    <main id="conteudo" className="page-shell py-16">
      <div className="mb-6 h-11 w-52 animate-pulse rounded-full bg-slate-200" />
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
            <div className="aspect-[16/10] animate-pulse bg-slate-200" />
          </div>
          <div className="rounded-[2rem] border border-border bg-white p-8">
            <div className="h-8 w-72 animate-pulse rounded-xl bg-slate-200" />
            <div className="mt-5 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-[92%] animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-[80%] animate-pulse rounded bg-slate-200" />
            </div>
          </div>
          <div className="rounded-[2rem] border border-border bg-white p-8">
            <div className="h-8 w-64 animate-pulse rounded-xl bg-slate-200" />
            <div className="mt-6 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-soft px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-2">
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  </div>
                  <div className="h-11 w-36 animate-pulse rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-slate-950 p-8">
            <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
            <div className="mt-4 h-10 w-56 animate-pulse rounded bg-white/10" />
            <div className="mt-6 space-y-3">
              <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
            </div>
          </div>
          <div className="rounded-[2rem] border border-border bg-white p-8">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-[88%] animate-pulse rounded bg-slate-200" />
          </div>
        </aside>
      </div>
    </main>
  );
}
