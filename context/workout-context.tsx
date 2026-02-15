/**
 * Workout and schedule global state (Context + useReducer).
 * Loads from storage on mount; exposes dispatch for adding workouts and updating schedule.
 */

import React, { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import * as WorkoutStorage from "@/lib/workout-storage";
import type { SaveResult } from "@/lib/workout-storage";
import type { Workout, WeeklySchedule } from "@/types/workout";

interface WorkoutState {
  workouts: Workout[];
  schedule: WeeklySchedule | null;
  isLoading: boolean;
  hasError: boolean;
}

type WorkoutAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: boolean }
  | { type: "LOAD_WORKOUTS"; payload: Workout[] }
  | { type: "LOAD_SCHEDULE"; payload: WeeklySchedule | null }
  | { type: "ADD_WORKOUT"; payload: Workout }
  | { type: "UPDATE_SCHEDULE"; payload: WeeklySchedule };

const defaultSchedule: WeeklySchedule = {
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
  sunday: null,
};

function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, hasError: action.payload };
    case "LOAD_WORKOUTS":
      return { ...state, workouts: action.payload };
    case "LOAD_SCHEDULE":
      return { ...state, schedule: action.payload };
    case "ADD_WORKOUT":
      return { ...state, workouts: [...state.workouts, action.payload] };
    case "UPDATE_SCHEDULE":
      return { ...state, schedule: action.payload };
    default:
      return state;
  }
}

const initialState: WorkoutState = {
  workouts: [],
  schedule: null,
  isLoading: true,
  hasError: false,
};

interface WorkoutContextValue extends Omit<WorkoutState, "schedule"> {
  schedule: WeeklySchedule;
  loadData: () => Promise<void>;
  addWorkout: (workout: Workout) => Promise<SaveResult>;
  updateSchedule: (schedule: WeeklySchedule) => Promise<SaveResult>;
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  const loadData = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: false });
    try {
      const [workouts, schedule] = await Promise.all([
        WorkoutStorage.getWorkouts(),
        WorkoutStorage.getSchedule(),
      ]);
      dispatch({ type: "LOAD_WORKOUTS", payload: workouts });
      dispatch({ type: "LOAD_SCHEDULE", payload: schedule ?? defaultSchedule });
    } catch {
      dispatch({ type: "SET_ERROR", payload: true });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addWorkout = useCallback(async (workout: Workout) => {
    const result = await WorkoutStorage.saveWorkout(workout);
    if (result.success) dispatch({ type: "ADD_WORKOUT", payload: workout });
    return result;
  }, []);

  const updateSchedule = useCallback(async (schedule: WeeklySchedule) => {
    const result = await WorkoutStorage.saveSchedule(schedule);
    if (result.success) dispatch({ type: "UPDATE_SCHEDULE", payload: schedule });
    return result;
  }, []);

  const value: WorkoutContextValue = {
    ...state,
    schedule: state.schedule ?? defaultSchedule,
    loadData,
    addWorkout,
    updateSchedule,
  };

  return (
    <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
  );
}

export function useWorkout(): WorkoutContextValue {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkout must be used within WorkoutProvider");
  return ctx;
}
