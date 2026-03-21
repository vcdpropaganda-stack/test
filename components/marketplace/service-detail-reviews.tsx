type Review = {
  id: string;
  rating: number;
  comment: string | null;
  client: { full_name?: string | null } | null;
};

type ServiceDetailReviewsProps = {
  reviews: Review[] | undefined;
};

export function ServiceDetailReviews({ reviews }: ServiceDetailReviewsProps) {
  return (
    <section className="mt-8 rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-8">
      <h2 className="font-sans text-[1.9rem] leading-tight font-bold tracking-[-0.03em] text-slate-950 sm:text-2xl sm:tracking-tight">
        Avaliações de clientes
      </h2>
      <div className="mt-6 space-y-4">
        {(reviews ?? []).length > 0 ? (
          reviews!.map((review) => (
            <article
              key={review.id}
              className="rounded-[1.5rem] border border-border bg-surface p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-slate-950">
                  {review.client?.full_name ?? "Cliente"}
                </p>
                <p className="text-sm font-semibold text-primary-strong">
                  Nota {review.rating}/5
                </p>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-strong">
                {review.comment || "Cliente avaliou o serviço sem comentário adicional."}
              </p>
            </article>
          ))
        ) : (
          <p className="text-sm leading-7 text-muted-strong">
            Este serviço ainda não recebeu avaliações públicas.
          </p>
        )}
      </div>
    </section>
  );
}
