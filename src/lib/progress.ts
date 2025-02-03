// @/lib/progress.ts
import { getCurrentUser } from "./auth";
import { User } from "./types";

export interface UserProgress {
  currentLevel: number;
  completedLevels: number[];
  isComplete: boolean;
}

export async function getUserProgress(): Promise<UserProgress | null> {
  const user: User | null = await getCurrentUser();
  
  if (!user) {
    return null; // If user not found, return null
  }

  const completedLevels: number[] = [];
  let currentLevel = 0;

  // Predefine the level keys
  const levelKeys: (keyof User)[] = [
    "level0", "level1", "level2", "level3", "level4", "level5", "level6"
  ];

  // Check completed levels
  for (const key of levelKeys) {
    if (user[key]) {
      const levelIndex = parseInt(key.replace("level", ""), 10); // Extract index from key
      completedLevels.push(levelIndex);
    }
  }

  // Determine the next level
  if (completedLevels.length > 0) {
    currentLevel = Math.min(Math.max(...completedLevels) + 1, 6);
  }

  // Return the user's progress
  return {
    currentLevel,
    completedLevels,
    isComplete: user.level6 === true // Check if level 6 is completed
  };
}
