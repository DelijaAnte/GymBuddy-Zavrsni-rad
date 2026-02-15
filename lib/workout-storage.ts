/**
 * Workout and schedule persistence using AsyncStorage.
 * Load/save workouts and weekly schedule with Zod validation on read.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import type {
  Workout,
  WeeklySchedule,
  WorkoutTemplate,
} from "@/types/workout";
import {
  workoutsArraySchema,
  weeklyScheduleSchema,
  workoutSchema,
  templatesArraySchema,
} from "@/lib/validation";

export async function getWorkouts(): Promise<Workout[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    const result = workoutsArraySchema.safeParse(parsed);
    if (!result.success) return [];
    return result.data;
  } catch {
    return [];
  }
}

export type SaveResult = { success: true } | { success: false; error: string };

export async function saveWorkout(workout: Workout): Promise<SaveResult> {
  const parsed = workoutSchema.safeParse(workout);
  if (!parsed.success) {
    return { success: false, error: "Neispravni podaci treninga." };
  }
  try {
    const workouts = await getWorkouts();
    const updated = [...workouts, parsed.data];
    await AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(updated));
    return { success: true };
  } catch {
    return { success: false, error: "Spremanje nije uspjelo." };
  }
}

export async function getSchedule(): Promise<WeeklySchedule | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.SCHEDULE);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    const result = weeklyScheduleSchema.safeParse(parsed);
    if (!result.success) return null;
    return result.data;
  } catch {
    return null;
  }
}

export async function saveSchedule(
  schedule: WeeklySchedule
): Promise<SaveResult> {
  const parsed = weeklyScheduleSchema.safeParse(schedule);
  if (!parsed.success) {
    return { success: false, error: "Neispravni podaci rasporeda." };
  }
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.SCHEDULE,
      JSON.stringify(parsed.data)
    );
    return { success: true };
  } catch {
    return { success: false, error: "Spremanje rasporeda nije uspjelo." };
  }
}

export async function getWorkoutsByExercise(
  exerciseName: string,
  limit: number = 5
): Promise<Workout[]> {
  const workouts = await getWorkouts();
  const filtered = workouts.filter((w) =>
    w.exercises.some((e) => e.exerciseName === exerciseName)
  );
  return filtered.slice(-limit).reverse();
}

export async function getTemplates(): Promise<WorkoutTemplate[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.TEMPLATES);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    const result = templatesArraySchema.safeParse(parsed);
    if (!result.success) return [];
    return result.data;
  } catch {
    return [];
  }
}

export async function saveTemplates(templates: WorkoutTemplate[]): Promise<void> {
  const parsed = templatesArraySchema.safeParse(templates);
  if (!parsed.success) return;
  await AsyncStorage.setItem(
    STORAGE_KEYS.TEMPLATES,
    JSON.stringify(parsed.data)
  );
}
