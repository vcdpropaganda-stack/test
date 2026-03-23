"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { format, addMonths, eachDayOfInterval, endOfMonth, endOfWeek, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { createBookingAction } from "@/app/servicos/[slug]/actions";
import { Button } from "@/components/ui/button";

type AvailabilitySlot = {
  id: string;
  start_at: string;
  end_at: string;
  is_available: boolean;
};

type BookedSlot = {
  scheduled_start: string;
  scheduled_end: string;
};

type AvailabilityCalendarProps = {
  slug: string;
  serviceId: string;
  providerProfileId: string;
  totalPriceCents: number;
  availability: AvailabilitySlot[];
  bookedSlots: BookedSlot[];
};

function getDayKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

const brazilTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  hour: "2-digit",
  minute: "2-digit",
});

function formatBrazilTime(value: string) {
  return brazilTimeFormatter.format(new Date(value));
}

function ReserveButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="sm:min-w-[11rem]" disabled={pending}>
      {pending ? "Reservando..." : "Reservar horário"}
    </Button>
  );
}

export function AvailabilityCalendar({
  slug,
  serviceId,
  providerProfileId,
  totalPriceCents,
  availability,
  bookedSlots,
}: AvailabilityCalendarProps) {
  const availableSlots = useMemo(() => {
    return availability
      .filter((slot) => slot.is_available)
      .filter(
        (slot) =>
          !bookedSlots.some(
            (booking) =>
              booking.scheduled_start === slot.start_at &&
              booking.scheduled_end === slot.end_at
          )
      )
      .sort(
        (a, b) =>
          new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
      );
  }, [availability, bookedSlots]);

  const slotsByDay = useMemo(() => {
    const map = new Map<string, AvailabilitySlot[]>();

    availableSlots.forEach((slot) => {
      const key = getDayKey(parseISO(slot.start_at));
      const current = map.get(key) ?? [];
      current.push(slot);
      map.set(key, current);
    });

    return map;
  }, [availableSlots]);

  const firstAvailableDate = useMemo(() => {
    const firstSlot = availableSlots[0];
    return firstSlot ? parseISO(firstSlot.start_at) : null;
  }, [availableSlots]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(firstAvailableDate);

  const months = useMemo(() => {
    const baseDate = firstAvailableDate ?? new Date();
    return [startOfMonth(baseDate), startOfMonth(addMonths(baseDate, 1))];
  }, [firstAvailableDate]);

  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);

  const selectedDayKey = selectedDate ? getDayKey(selectedDate) : null;
  const selectedSlots = selectedDayKey ? slotsByDay.get(selectedDayKey) ?? [] : [];
  const visibleMonth = months[selectedMonthIndex] ?? months[0];
  const calendarStart = startOfWeek(startOfMonth(visibleMonth), {
    locale: ptBR,
    weekStartsOn: 0,
  });
  const calendarEnd = endOfWeek(endOfMonth(visibleMonth), {
    locale: ptBR,
    weekStartsOn: 0,
  });
  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  return (
    <div className="space-y-6">
      <div className="rounded-[1.5rem] border border-border bg-slate-50/80 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-slate-950">
            <CalendarDays className="h-4 w-4 text-primary-strong" />
            <p className="font-semibold capitalize">
              {format(visibleMonth, "MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setSelectedMonthIndex((current) => Math.max(0, current - 1))
              }
              disabled={selectedMonthIndex === 0}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-primary/30 hover:text-primary-strong disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Ver mês anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="hidden items-center gap-2 sm:flex">
              {months.map((monthDate, index) => (
                <button
                  key={monthDate.toISOString()}
                  type="button"
                  onClick={() => setSelectedMonthIndex(index)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold capitalize transition",
                    selectedMonthIndex === index
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-primary/30 hover:text-primary-strong",
                  ].join(" ")}
                >
                  {format(monthDate, "MMM", { locale: ptBR })}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setSelectedMonthIndex((current) =>
                  Math.min(months.length - 1, current + 1)
                )
              }
              disabled={selectedMonthIndex === months.length - 1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-primary/30 hover:text-primary-strong disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Ver próximo mês"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 sm:hidden">
          {months.map((monthDate, index) => (
            <button
              key={monthDate.toISOString()}
              type="button"
              onClick={() => setSelectedMonthIndex(index)}
              className={[
                "rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition",
                selectedMonthIndex === index
                  ? "bg-slate-950 text-white"
                  : "border border-slate-200 bg-white text-slate-700",
              ].join(" ")}
            >
              {format(monthDate, "MMM", { locale: ptBR })}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayKey = getDayKey(day);
            const daySlots = slotsByDay.get(dayKey) ?? [];
            const isAvailable = daySlots.length > 0;
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => {
                  if (isAvailable) {
                    setSelectedDate(day);
                  }
                }}
                disabled={!isAvailable}
                className={[
                  "flex aspect-square items-center justify-center rounded-2xl border text-sm font-semibold transition",
                  !isSameMonth(day, visibleMonth) &&
                    "border-transparent text-slate-300",
                  isSameMonth(day, visibleMonth) && !isAvailable &&
                    "border-slate-200 bg-white text-slate-300 line-through opacity-70",
                  isSameMonth(day, visibleMonth) && isAvailable &&
                    "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100",
                  isSelected &&
                    "border-slate-950 bg-slate-950 text-white hover:bg-slate-950",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-label={
                  isAvailable
                    ? `${format(day, "dd 'de' MMMM", { locale: ptBR })} com horários disponíveis`
                    : `${format(day, "dd 'de' MMMM", { locale: ptBR })} indisponível`
                }
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-border bg-surface-soft p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-2 text-slate-700">
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            Dias com horários livres
          </span>
          <span className="inline-flex items-center gap-2 text-slate-700">
            <span className="h-3 w-3 rounded-full bg-slate-300" />
            Dias sem horários disponíveis
          </span>
        </div>
        <p className="mt-3 text-xs leading-5 text-muted-strong">
          Todos os horários são exibidos no fuso do Brasil: GMT-3, das 08:00 às 18:00.
        </p>
      </div>

      <div>
        <h3 className="font-sans text-[1.35rem] font-bold tracking-tight text-slate-950 sm:text-2xl">
          {selectedDate
            ? `Horários em ${format(selectedDate, "EEEE, dd 'de' MMMM", {
                locale: ptBR,
              })}`
            : "Selecione um dia no calendário"}
        </h3>
        <div className="mt-4 space-y-3">
          {selectedSlots.length > 0 ? (
            selectedSlots.map((slot) => (
              <div
                key={slot.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                    <Clock3 className="h-4 w-4 text-primary-strong" />
                    {formatBrazilTime(slot.start_at)} - {formatBrazilTime(slot.end_at)}
                  </p>
                  <p className="mt-1 text-sm text-muted-strong">
                    Horário disponível para reserva imediata.
                  </p>
                </div>
                <form action={createBookingAction} className="contents">
                  <input type="hidden" name="slug" value={slug} />
                  <input type="hidden" name="service_id" value={serviceId} />
                  <input
                    type="hidden"
                    name="provider_profile_id"
                    value={providerProfileId}
                  />
                  <input type="hidden" name="scheduled_start" value={slot.start_at} />
                  <input type="hidden" name="scheduled_end" value={slot.end_at} />
                  <input type="hidden" name="total_price_cents" value={totalPriceCents} />
                  <ReserveButton />
                </form>
              </div>
            ))
          ) : (
            <p className="text-sm leading-7 text-muted-strong">
              Este dia não tem horários disponíveis. Escolha outra data para continuar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
