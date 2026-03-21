export default function ServicesLoading() {
  return (
    <main id="conteudo" className="page-shell py-10 sm:py-16">
      <section className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a,#312e81_58%,#6366f1)] px-5 py-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:rounded-[2rem] sm:px-8 sm:py-10">
        <div className="h-4 w-28 animate-pulse rounded-full bg-white/20" />
        <div className="mt-4 h-10 w-full max-w-2xl animate-pulse rounded-2xl bg-white/18 sm:h-12" />
        <div className="mt-4 h-6 w-full max-w-3xl animate-pulse rounded-2xl bg-white/12 sm:h-7" />
        <div className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
          <div className="h-8 w-28 animate-pulse rounded-full bg-white/14 sm:h-10 sm:w-36" />
          <div className="h-8 w-28 animate-pulse rounded-full bg-white/14 sm:h-10 sm:w-36" />
          <div className="h-8 w-32 animate-pulse rounded-full bg-white/14 sm:h-10 sm:w-40" />
        </div>
      </section>

      <section className="mt-6 rounded-[1.6rem] border border-border bg-white p-4 sm:mt-10 sm:rounded-[2rem] sm:p-6">
        <div className="mb-5 flex items-center gap-3 sm:mb-6">
          <div className="h-11 w-11 animate-pulse rounded-2xl bg-slate-100 sm:h-12 sm:w-12" />
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

      <section className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-3 lg:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:rounded-[2rem] sm:shadow-[0_20px_55px_rgba(15,23,42,0.08)]"
          >
            <div className="aspect-[4/3] animate-pulse bg-slate-200" />
            <div className="space-y-3 p-3.5 sm:space-y-4 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100 sm:h-7 sm:w-24" />
                <div className="h-4 w-18 animate-pulse rounded bg-slate-100 sm:h-5 sm:w-24" />
              </div>
              <div className="h-8 w-4/5 animate-pulse rounded bg-slate-100 sm:h-10" />
              <div className="h-14 animate-pulse rounded bg-slate-100 sm:h-20" />
              <div className="flex gap-3">
                <div className="h-4 w-16 animate-pulse rounded bg-slate-100 sm:h-5 sm:w-20" />
                <div className="h-4 w-22 animate-pulse rounded bg-slate-100 sm:h-5 sm:w-28" />
              </div>
              <div className="flex items-end justify-between gap-4 pt-3">
                <div className="space-y-2">
                  <div className="h-3 w-16 animate-pulse rounded bg-slate-100 sm:w-20" />
                  <div className="h-8 w-20 animate-pulse rounded bg-slate-100 sm:h-10 sm:w-28" />
                </div>
                <div className="h-10 w-24 animate-pulse rounded-full bg-slate-200 sm:h-12 sm:w-36" />
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
