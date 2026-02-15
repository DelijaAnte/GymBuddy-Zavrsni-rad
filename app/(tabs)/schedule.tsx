import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWorkout } from "@/context/workout-context";
import {
  DAY_KEYS,
  DAY_LABELS,
  SCHEDULE_OPTIONS,
} from "@/constants/schedule-options";
import type { DayKey, WeeklySchedule } from "@/types/workout";

export default function ScheduleScreen() {
  const { schedule, updateSchedule, isLoading } = useWorkout();
  const [local, setLocal] = useState<WeeklySchedule | null>(null);

  useEffect(() => {
    if (schedule) setLocal({ ...schedule });
  }, [schedule]);

  const handleDay = useCallback(
    (day: DayKey, value: string | null) => {
      if (!local) return;
      const next = { ...local, [day]: value };
      setLocal(next);
      updateSchedule(next);
    },
    [local, updateSchedule]
  );

  if (isLoading && !local) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const sched = local ?? schedule;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={["bottom"]}>
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Text className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Odaberi trening za svaki dan (prazno = odmor)
        </Text>
        {DAY_KEYS.map((day) => (
          <View
            key={day}
            className="mt-4 flex-row items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
          >
            <Text className="text-base font-medium text-gray-900 dark:text-white">
              {DAY_LABELS[day]}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {SCHEDULE_OPTIONS.map((opt) => (
                <Pressable
                  key={opt ?? "rest"}
                  onPress={() => handleDay(day, opt)}
                  className={`rounded-lg px-3 py-2 ${
                    (sched?.[day] ?? null) === opt
                      ? "bg-blue-600"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <Text
                    className={
                      (sched?.[day] ?? null) === opt
                        ? "font-medium text-white"
                        : "text-gray-700 dark:text-gray-300"
                    }
                  >
                    {opt ?? "Odmor"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
