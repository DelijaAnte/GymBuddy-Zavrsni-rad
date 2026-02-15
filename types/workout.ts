/**
 * Workout and schedule type definitions for GymBuddy.
 * Used for storage, context, and validation (Zod schemas in lib/validation).
 */

export interface SetLog {
  weight: number;
  reps: number;
  note?: string;
}

export interface ExerciseLog {
  exerciseName: string;
  sets: SetLog[];
}

export interface Workout {
  id: string;
  date: string; // ISO date
  templateId: string | null;
  name: string;
  exercises: ExerciseLog[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exerciseNames: string[];
}

export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface WeeklySchedule {
  monday: string | null;
  tuesday: string | null;
  wednesday: string | null;
  thursday: string | null;
  friday: string | null;
  saturday: string | null;
  sunday: string | null;
}
