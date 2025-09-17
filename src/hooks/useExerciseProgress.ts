import { useState, useEffect } from 'react';

type ExerciseProgress = {
  completed: boolean;
  lastCompleted?: string;
  streak: number;
  totalCompleted: number;
};

type ExerciseProgressMap = {
  [key: string]: ExerciseProgress;
};

export const useExerciseProgress = () => {
  const [progress, setProgress] = useState<ExerciseProgressMap>({});
  const [dailyProgress, setDailyProgress] = useState<{
    completed: string[];
    lastUpdated: string;
  }>({ completed: [], lastUpdated: '' });

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('exerciseProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }

    const savedDailyProgress = localStorage.getItem('dailyExerciseProgress');
    if (savedDailyProgress) {
      const parsed = JSON.parse(savedDailyProgress);
      // Reset daily progress if it's a new day
      const today = new Date().toDateString();
      if (parsed.lastUpdated !== today) {
        setDailyProgress({ completed: [], lastUpdated: today });
      } else {
        setDailyProgress(parsed);
      }
    } else {
      setDailyProgress({
        completed: [],
        lastUpdated: new Date().toDateString(),
      });
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(progress).length > 0) {
      localStorage.setItem('exerciseProgress', JSON.stringify(progress));
    }
  }, [progress]);

  useEffect(() => {
    if (dailyProgress.lastUpdated) {
      localStorage.setItem('dailyExerciseProgress', JSON.stringify(dailyProgress));
    }
  }, [dailyProgress]);

  const completeExercise = (exerciseId: string) => {
    const today = new Date().toDateString();
    const lastCompleted = progress[exerciseId]?.lastCompleted;
    const isNewDay = lastCompleted !== today;

    // Update exercise progress
    setProgress((prev) => {
      const currentStreak = prev[exerciseId]?.streak || 0;
      const newStreak = isNewDay ? currentStreak + 1 : currentStreak;

      return {
        ...prev,
        [exerciseId]: {
          completed: true,
          lastCompleted: today,
          streak: newStreak,
          totalCompleted: (prev[exerciseId]?.totalCompleted || 0) + (isNewDay ? 1 : 0),
        },
      };
    });

    // Update daily progress if not already completed today
    if (!dailyProgress.completed.includes(exerciseId)) {
      setDailyProgress((prev) => ({
        ...prev,
        completed: [...prev.completed, exerciseId],
        lastUpdated: today,
      }));
    }
  };

  const getExerciseProgress = (exerciseId: string): ExerciseProgress => {
    return progress[exerciseId] || { completed: false, streak: 0, totalCompleted: 0 };
  };

  const getDailyProgress = () => {
    return {
      completed: dailyProgress.completed.length,
      total: 4, // Total number of exercises
      lastUpdated: dailyProgress.lastUpdated,
    };
  };

  return {
    completeExercise,
    getExerciseProgress,
    getDailyProgress,
  };
};
