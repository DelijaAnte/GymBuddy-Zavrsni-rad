/**
 * Hook za logiku ekrana Log: unos treninga, vježbi, setova i "zadnji put".
 * Izvučeno iz log.tsx radi čitljivosti i ponovne upotrebe.
 */

import { useCallback, useState } from "react";
import * as WorkoutStorage from "@/lib/workout-storage";
import { getTodayDayKey, todayISO } from "@/lib/date-utils";
import type { Workout, ExerciseLog, SetLog } from "@/types/workout";

export type AddWorkoutFn = (
  workout: Workout
) => Promise<{ success: true } | { success: false; error: string }>;

const MAX_REPS = 999;
const MIN_WEIGHT = 0;
const MIN_REPS = 0;

export function useLogWorkout(
  schedule: Record<string, string | null>,
  addWorkout: AddWorkoutFn
) {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);
  const [currentExercise, setCurrentExercise] = useState("");
  const [currentSets, setCurrentSets] = useState<SetLog[]>([]);
  const [lastResultText, setLastResultText] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const [repsInput, setRepsInput] = useState("");

  const todayKey = getTodayDayKey();
  const scheduledTemplateId = schedule[todayKey];

  /** Dohvaća zadnje treninge za vježbu i formatira tekst (zadnja 2–3 seta). */
  const lookupLastResult = useCallback(async (name: string) => {
    if (!name.trim()) {
      setLastResultText(null);
      return;
    }
    const past = await WorkoutStorage.getWorkoutsByExercise(name.trim(), 1);
    if (past.length === 0) {
      setLastResultText(null);
      return;
    }
    const w = past[0];
    const ex = w.exercises.find((e) => e.exerciseName === name.trim());
    if (!ex || ex.sets.length === 0) {
      setLastResultText(null);
      return;
    }
    const lastSets = ex.sets.slice(-3);
    const parts = lastSets.map((s) => `${s.weight} kg × ${s.reps}`);
    setLastResultText(`Zadnji put: ${parts.join(", ")}`);
  }, []);

  /** Dodaje set s validacijom (težina ≥ 0, repovi 0–MAX_REPS). */
  function addSet(weight: number, reps: number): boolean {
    if (!currentExercise.trim()) return false;
    if (weight < MIN_WEIGHT || reps < MIN_REPS || reps > MAX_REPS) return false;
    setCurrentSets((prev) => [...prev, { weight, reps }]);
    setWeightInput("");
    setRepsInput("");
    return true;
  }

  /** Dodaje set iz input polja (parsira brojeve). */
  function addSetFromInput(): boolean {
    const w = parseFloat(weightInput.replace(",", "."));
    const r = parseInt(repsInput, 10);
    if (Number.isNaN(w) || Number.isNaN(r)) return false;
    const ok = addSet(w, r);
    if (ok) {
      setWeightInput("");
      setRepsInput("");
    }
    return ok;
  }

  function finishCurrentExercise() {
    if (!currentExercise.trim() || currentSets.length === 0) return;
    setExercises((prev) => [
      ...prev,
      { exerciseName: currentExercise.trim(), sets: [...currentSets] },
    ]);
    setCurrentExercise("");
    setCurrentSets([]);
    setLastResultText(null);
  }

  function removeLastSet() {
    setCurrentSets((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  }

  async function buildAndSave(): Promise<
    { success: true } | { success: false; error: string }
  > {
    const name = workoutName.trim() || "Trening";
    if (exercises.length === 0) {
      return { success: false, error: "Dodaj barem jednu vježbu s setovima." };
    }
    setIsSaving(true);
    try {
      const workout: Workout = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        date: todayISO(),
        templateId: scheduledTemplateId,
        name,
        exercises,
      };
      return await addWorkout(workout);
    } finally {
      setIsSaving(false);
    }
  }

  /** Nakon uspješnog spremanja: reset forme. Poziva se iz ekrana nakon addWorkout. */
  function resetForm() {
    setWorkoutName("");
    setExercises([]);
    setCurrentExercise("");
    setCurrentSets([]);
    setLastResultText(null);
  }

  return {
    workoutName,
    setWorkoutName,
    exercises,
    currentExercise,
    setCurrentExercise,
    currentSets,
    lastResultText,
    isSaving,
    weightInput,
    repsInput,
    setWeightInput,
    setRepsInput,
    lookupLastResult,
    addSet,
    addSetFromInput,
    finishCurrentExercise,
    removeLastSet,
    buildAndSave,
    resetForm,
  };
}

