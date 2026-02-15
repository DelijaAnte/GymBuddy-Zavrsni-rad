/**
 * Date helpers for schedule and "today" workout.
 */

import type { DayKey } from "@/types/workout";

const DAY_ORDER: DayKey[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function getTodayDayKey(): DayKey {
  const day = new Date().getDay();
  return DAY_ORDER[day];
}

export function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
