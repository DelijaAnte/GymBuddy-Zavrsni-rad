import React from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWorkout } from "@/context/workout-context";
import { formatDate } from "@/lib/date-utils";

export default function ProgressScreen() {
  const { workouts, isLoading, hasError, loadData } = useWorkout();

  const sorted = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const recent = sorted.slice(0, 20);

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
              Povijest nije učitana. Pokušaj ponovno.
            </Text>
            <Pressable
              onPress={loadData}
              className="mt-2 self-start rounded-lg bg-red-600 px-4 py-2"
            >
              <Text className="font-medium text-white">Pokušaj ponovno</Text>
            </Pressable>
          </View>
        )}

        <Text className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          Povijest treninga
        </Text>
        {recent.length === 0 ? (
          <Text className="mt-4 text-gray-500 dark:text-gray-400">
            Nema spremljenih treninga. Započni trening na tabu Log.
          </Text>
        ) : (
          recent.map((w) => (
            <View
              key={w.id}
              className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
            >
              <Text className="font-medium text-gray-900 dark:text-white">
                {w.name}
              </Text>
              <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {formatDate(w.date)}
              </Text>
              <View className="mt-2">
                {w.exercises.map((ex, i) => (
                  <Text
                    key={i}
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    {ex.exerciseName}:{" "}
                    {ex.sets.map((s) => `${s.weight}×${s.reps}`).join(", ")}
                  </Text>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
