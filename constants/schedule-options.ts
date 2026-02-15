/**
 * Opcije za tjedni raspored i labele dana.
 * Jedno mjesto za promjene (Push, Pull, Legs, Full, Odmor).
 */

import type { DayKey } from "@/types/workout";

export const DAY_KEYS: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_LABELS: Record<DayKey, string> = {
  monday: "Ponedjeljak",
  tuesday: "Utorak",
  wednesday: "Srijeda",
  thursday: "Četvrtak",
  friday: "Petak",
  saturday: "Subota",
  sunday: "Nedjelja",
};

/** Vrijednosti za raspored: null = odmor, ostalo = naziv treninga */
export const SCHEDULE_OPTIONS: (string | null)[] = [
  null,
  "Push",
  "Pull",
  "Legs",
  "Full",
];
