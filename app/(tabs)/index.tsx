import React from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useWorkout } from "@/context/workout-context";
import { formatDate, getTodayDayKey } from "@/lib/date-utils";
import { DAY_LABELS } from "@/constants/schedule-options";

export default function HomeScreen() {
  const { workouts, schedule, isLoading, hasError, loadData } = useWorkout();

  const todayKey = getTodayDayKey();
  const todayLabel = DAY_LABELS[todayKey] ?? todayKey;
  const scheduledName = schedule[todayKey] ?? null;

  const sorted = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const recent = sorted.slice(0, 7);

  if (isLoading && !hasError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={["bottom"]}>
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {hasError && (
          <View className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
            <Text className="text-red-700 dark:text-red-300">
              Podaci nisu učitani. Pokušaj ponovno.
            </Text>
            <Pressable
              onPress={loadData}
              className="mt-2 self-start rounded-lg bg-red-600 px-4 py-2"
            >
              <Text className="font-medium text-white">Pokušaj ponovno</Text>
            </Pressable>
          </View>
        )}

        <Text className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
          GymBuddy
        </Text>
        <Text className="mt-1 text-gray-600 dark:text-gray-400">
          Danas: {todayLabel}
          {scheduledName ? ` · ${scheduledName}` : ""}
        </Text>

        <Link href="/(tabs)/log" asChild>
          <Pressable className="mt-6 rounded-xl bg-blue-600 py-4">
            <Text className="text-center font-semibold text-white">
              Započni današnji trening
            </Text>
          </Pressable>
        </Link>

        <Text className="mt-8 text-lg font-semibold text-gray-900 dark:text-white">
          Nedavni treningi
        </Text>
        {recent.length === 0 ? (
          <Text className="mt-2 text-gray-500 dark:text-gray-400">
            Nema spremljenih treninga. Započni trening na tabu Log.
          </Text>
        ) : (
          recent.map((w) => (
            <View
              key={w.id}
              className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50"
            >
              <Text className="font-medium text-gray-900 dark:text-white">
                {w.name}
              </Text>
              <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {formatDate(w.date)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
