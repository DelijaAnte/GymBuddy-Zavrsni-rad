/**
 * Zod schemas for workout and schedule data.
 * Used for runtime validation on storage read/write and at boundaries.
 */

import { z } from "zod";

export const setLogSchema = z.object({
  weight: z.number().min(0),
  reps: z.number().int().min(0),
  note: z.string().optional(),
});

export const exerciseLogSchema = z.object({
  exerciseName: z.string().min(1),
  sets: z.array(setLogSchema),
});

export const workoutSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  templateId: z.string().nullable(),
  name: z.string().min(1),
  exercises: z.array(exerciseLogSchema),
});

export const workoutTemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  exerciseNames: z.array(z.string().min(1)),
});

export const weeklyScheduleSchema = z.object({
  monday: z.string().nullable(),
  tuesday: z.string().nullable(),
  wednesday: z.string().nullable(),
  thursday: z.string().nullable(),
  friday: z.string().nullable(),
  saturday: z.string().nullable(),
  sunday: z.string().nullable(),
});

export type SetLogInput = z.infer<typeof setLogSchema>;
export type ExerciseLogInput = z.infer<typeof exerciseLogSchema>;
export type WorkoutInput = z.infer<typeof workoutSchema>;
export type WorkoutTemplateInput = z.infer<typeof workoutTemplateSchema>;
export type WeeklyScheduleInput = z.infer<typeof weeklyScheduleSchema>;

export const workoutsArraySchema = z.array(workoutSchema);
export const templatesArraySchema = z.array(workoutTemplateSchema);
