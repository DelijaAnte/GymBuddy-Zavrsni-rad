import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useWorkout } from "@/context/workout-context";
import { useLogWorkout } from "@/hooks/use-log-workout";

const QUICK_WEIGHTS = [40, 50, 60, 70, 80];
const QUICK_REPS = 5;

export default function LogScreen() {
  const router = useRouter();
  const { schedule, addWorkout } = useWorkout();
  const log = useLogWorkout(schedule, addWorkout);

  async function handleSave() {
    const result = await log.buildAndSave();
    if (result.success) {
      log.resetForm();
      Alert.alert("Spremljeno", "Trening je spremljen.");
      router.replace("/(tabs)");
      return;
    }
    Alert.alert("Greška", result.error);
  }

  function handleAddSetFromInput() {
    const ok = log.addSetFromInput();
    if (!ok) {
      Alert.alert(
        "Upozorenje",
        "Unesi ispravnu težinu (broj) i repove (cijeli broj 0–999)."
      );
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Naziv treninga (opcionalno)
          </Text>
          <TextInput
            className="mt-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            value={log.workoutName}
            onChangeText={log.setWorkoutName}
            placeholder="npr. Grudi + triceps"
            placeholderTextColor="#9ca3af"
          />

          <Text className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
            Vježba
          </Text>
          <TextInput
            className="mt-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            value={log.currentExercise}
            onChangeText={(t) => {
              log.setCurrentExercise(t);
              log.lookupLastResult(t);
            }}
            onBlur={() => log.lookupLastResult(log.currentExercise)}
            placeholder="npr. Bench press"
            placeholderTextColor="#9ca3af"
          />
          {log.lastResultText && (
            <Text className="mt-1 text-sm text-blue-600 dark:text-blue-400">
              {log.lastResultText}
            </Text>
          )}

          {log.currentExercise.trim() && (
            <View className="mt-4">
              <Text className="text-base font-medium text-gray-700 dark:text-gray-300">
                Setovi (kg × repovi)
              </Text>
              {log.currentSets.map((s, i) => (
                <Text
                  key={i}
                  className="mt-1 text-sm text-gray-600 dark:text-gray-400"
                >
                  {s.weight} kg × {s.reps}
                </Text>
              ))}
              <View className="mt-2 flex-row gap-2">
                <TextInput
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  value={log.weightInput}
                  onChangeText={log.setWeightInput}
                  placeholder="kg"
                  placeholderTextColor="#9ca3af"
                  keyboardType="decimal-pad"
                />
                <TextInput
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  value={log.repsInput}
                  onChangeText={log.setRepsInput}
                  placeholder="repovi"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                />
                <Pressable
                  onPress={handleAddSetFromInput}
                  className="rounded-lg bg-gray-200 px-4 py-2 dark:bg-gray-700"
                >
                  <Text className="font-medium text-gray-800 dark:text-gray-200">
                    + Set
                  </Text>
                </Pressable>
              </View>
              <View className="mt-2 flex-row flex-wrap gap-2">
                {QUICK_WEIGHTS.map((w) => (
                  <Pressable
                    key={w}
                    onPress={() => log.addSet(w, QUICK_REPS)}
                    className="rounded-lg bg-gray-200 px-3 py-2 dark:bg-gray-700"
                  >
                    <Text className="text-gray-800 dark:text-gray-200">
                      {w}×{QUICK_REPS}
                    </Text>
                  </Pressable>
                ))}
                {log.currentSets.length > 0 && (
                  <Pressable
                    onPress={log.removeLastSet}
                    className="rounded-lg bg-red-100 px-4 py-2 dark:bg-red-900/30"
                  >
                    <Text className="text-red-700 dark:text-red-300">
                      Ukloni set
                    </Text>
                  </Pressable>
                )}
              </View>
              <Pressable
                onPress={log.finishCurrentExercise}
                className="mt-3 self-start rounded-lg bg-green-600 px-4 py-2"
              >
                <Text className="font-medium text-white">Završi vježbu</Text>
              </Pressable>
            </View>
          )}

          {log.exercises.length > 0 && (
            <View className="mt-6">
              <Text className="text-base font-semibold text-gray-900 dark:text-white">
                Dodane vježbe
              </Text>
              {log.exercises.map((ex, i) => (
                <View
                  key={i}
                  className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50"
                >
                  <Text className="font-medium text-gray-900 dark:text-white">
                    {ex.exerciseName}
                  </Text>
                  <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {ex.sets.map((s) => `${s.weight}×${s.reps}`).join(", ")}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Pressable
            onPress={handleSave}
            disabled={log.isSaving || log.exercises.length === 0}
            className="mt-8 rounded-xl bg-blue-600 py-3 disabled:opacity-50"
          >
            {log.isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-center font-semibold text-white">
                Spremi trening
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
