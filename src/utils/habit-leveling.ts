import { UserHabitRecord } from "@/types/habit";

/**
 * Standardized XP Rewards based on effort:
 * - Time: 1 second = 1 XP (1 minute = 60 XP)
 * - Count: 1 rep = 25 XP (Matches ~10-15 seconds of physical effort)
 * - Binary: 1 completion = 200 XP (High reward for critical adherence)
 */

const BASE_XP_PER_LEVEL = 300;
const MAX_XP_PER_LEVEL = 1200; // Cap the curve to prevent glacial leveling

/**
 * Calculates the XP required to reach the NEXT level from the current level.
 */
export const getXpForNextHabitLevel = (level: number): number => {
  if (level <= 0) return BASE_XP_PER_LEVEL;
  // Base 300 XP, growing by 50% each level, but capped at 1200
  const calculated = Math.round(BASE_XP_PER_LEVEL * Math.pow(1.5, level - 1));
  return Math.min(calculated, MAX_XP_PER_LEVEL);
};

/**
 * Calculates the current level based on total XP.
 */
export const calculateHabitLevel = (xp: number): number => {
  let level = 1;
  let remainingXp = xp;
  
  while (true) {
    const xpNeeded = getXpForNextHabitLevel(level);
    if (remainingXp >= xpNeeded) {
      remainingXp -= xpNeeded;
      level++;
    } else {
      break;
    }
  }
  
  return level;
};

/**
 * Returns a multiplier based on the current streak.
 */
export const getStreakMultiplier = (streak: number): number => {
  if (streak >= 30) return 1.25;
  if (streak >= 7) return 1.1;
  return 1.0;
};

/**
 * Calculates how much XP is earned for a single completion of a Simple Task.
 */
export const getXpGainForTask = (type: 'count' | 'time', value: number, multiplier: number = 1.0): number => {
  // value is seconds for 'time', reps for 'count'
  const baseMultiplier = type === 'count' ? 25 : 1;
  return Math.round(value * baseMultiplier * multiplier);
};

/**
 * Calculates how much XP is earned for a Dashboard Habit completion.
 */
export const getXpGainPerCompletion = (
  value: number, 
  unit: string, 
  isBonus: boolean = false, 
  streak: number = 0,
  effortMultiplier: number = 1.0
): number => {
  let unitMultiplier = 1;
  
  if (unit === 'min') unitMultiplier = 60;
  else if (unit === 'reps') unitMultiplier = 25;
  else if (unit === 'dose') unitMultiplier = 200;

  const streakMultiplier = getStreakMultiplier(streak);
  const baseXP = value * unitMultiplier * effortMultiplier * streakMultiplier;
  
  return isBonus ? Math.round(baseXP * 0.5) : Math.round(baseXP);
};

/**
 * Returns the XP earned within the current level and the total needed for next level.
 */
export const getLevelXpStats = (xp: number) => {
  let level = 1;
  let remainingXp = xp;
  
  while (true) {
    const xpNeeded = getXpForNextHabitLevel(level);
    if (remainingXp >= xpNeeded) {
      remainingXp -= xpNeeded;
      level++;
    } else {
      return {
        currentLevel: level,
        xpInLevel: remainingXp,
        xpNeededForNext: xpNeeded,
        totalXp: xp
      };
    }
  }
};