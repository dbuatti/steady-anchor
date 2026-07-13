interface ParsedHabit {
  name: string;
  category: 'cognitive' | 'physical' | 'wellness' | 'daily' | 'anchor';
  unit: 'min' | 'reps' | 'dose';
  measurement_type: 'timer' | 'unit' | 'binary';
  daily_goal: number;
  frequency_per_week: number;
  long_term_goal: number | null;
  target_days: number | null;
  icon_name: string;
  short_description: string;
  motivation: string;
  time_of_day: string | null;
  confidence: number;
  reasoning: string[];
  growth_value: number;
  growth_type: 'fixed' | 'percentage';
  xp_per_unit: number;
  energy_cost_per_unit: number;
  is_fixed: boolean;
  is_trial_mode: boolean;
  plateau_days_required: number;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  physical: ['run', 'walk', 'jog', 'swim', 'pushup', 'push-up', 'situp', 'pullup', 'gym', 'workout', 'exercise', 'lift', 'squat', 'yoga', 'stretch', 'cardio', 'strength', 'fitness', 'sport', 'cycling', 'bike', 'hike', 'dance'],
  cognitive: ['study', 'learn', 'read', 'think', 'write', 'code', 'program', 'focus', 'brain', 'mental', 'puzzle', 'chess', 'language', 'practice', 'lesson', 'course', 'research', 'meditate', 'meditation'],
  wellness: ['meditate', 'breathe', 'mindful', 'calm', 'sleep', 'rest', 'relax', 'stress', 'anxiety', 'health', 'wellness', 'medication', 'pill', 'vitamin', 'water', 'hydrate', 'stretch', 'therapy', 'journal'],
  daily: ['clean', 'cook', 'dishes', 'laundry', 'chores', 'tidy', 'organize', 'brush', 'teeth', 'shower', 'groom', 'hygiene'],
  anchor: ['routine', 'morning', 'evening', 'anchor', 'foundation', 'core', 'essential', 'priority'],
};

const UNIT_PATTERNS = [
  { regex: /(\d+)\s*(minute|min|minutes)\b/i, unit: 'min' as const, type: 'timer' as const },
  { regex: /(\d+)\s*(hour|hr|hours)\b/i, unit: 'min' as const, type: 'timer' as const, multiplier: 60 },
  { regex: /(\d+)\s*(rep|reps|pushup|push-up|situp|pullup|km|mile|page|pages|lap|laps)\b/i, unit: 'reps' as const, type: 'unit' as const },
  { regex: /(\d+)\s*(dose|pill|pills|tablet|tablets)\b/i, unit: 'dose' as const, type: 'binary' as const },
  { regex: /(\d+)\s*(time|times)\b/i, unit: 'reps' as const, type: 'unit' as const },
];

const FREQUENCY_PATTERNS = [
  { regex: /(twice|2x|two times)\s*(a\s*)?(day|daily)/i, value: 14 },
  { regex: /(once|1x)\s*(a\s*)?(day|daily)|every\s*day|daily/i, value: 7 },
  { regex: /(\d+)\s*(time|times?)\s*(a|per)\s*(day|daily)/i, extract: true },
  { regex: /(every|each)\s*(morning|evening|night|afternoon)/i, value: 7 },
  { regex: /(\d+)\s*(time|times?)\s*(a|per)\s*week/i, extract: true },
  { regex: /(weekly|once\s*a\s*week|1x\s*week)/i, value: 1 },
  { regex: /(weekend)/i, value: 2 },
];

const TIME_OF_DAY_PATTERNS = [
  { regex: /(first thing|when i wake|wake up|in the morning|morning|a\.?m\.?)/i, value: 'morning' },
  { regex: /(lunch|noon|midday|afternoon)/i, value: 'midday' },
  { regex: /(evening|before bed|at night|night|p\.?m\.?|dinner|sunset)/i, value: 'evening' },
];

const TIMEFRAME_PATTERNS = [
  { regex: /in\s+(\d+)\s*(day|days)/i, extract: true },
  { regex: /in\s+(\d+)\s*(month|months)/i, extract: true, multiplier: 30 },
  { regex: /in\s+(\d+)\s*(year|years)/i, extract: true, multiplier: 365 },
  { regex: /in\s+(a|one)\s*(year)/i, value: 365 },
  { regex: /by\s+(the\s+)?end\s+of\s+(the\s+)?(year|month)/i, value: 365 },
  { regex: /overn?e?\s*(year|day|month)/i },
];

const MOTIVATION_PATTERNS = [
  { regex: /to\s+(reduce|lower|ease)\s+(stress|anxiety)/i, value: 'stress_reduction' },
  { regex: /for\s+(stress|anxiety|calm|relax)/i, value: 'stress_reduction' },
  { regex: /to\s+(get|become|be)\s+(strong|fit|health)/i, value: 'health_improvement' },
  { regex: /for\s+(strength|health|fitness|muscle)/i, value: 'health_improvement' },
  { regex: /to\s+(learn|improve|master|develop)/i, value: 'skill_development' },
  { regex: /to\s+(grow|evolve|better\s+myself)/i, value: 'personal_growth' },
  { regex: /(routine|consistency|habit)/i, value: 'routine_building' },
  { regex: /(creative|art|music|draw|write)/i, value: 'creative_expression' },
];

const ICON_MAP: Record<string, string> = {
  physical: 'Dumbbell',
  wellness: 'Wind',
  cognitive: 'BookOpen',
  daily: 'Home',
  anchor: 'Anchor',
};

export function parseHabitInput(text: string): ParsedHabit {
  const lower = text.toLowerCase();
  const reasoning: string[] = [];
  let confidence = 40;

  // 1. Extract action phrase (the core habit name)
  const actionMatch = text.match(/(?:I want to|I need to|I should|I will|I\'d like to|i want to|i need to)\s+(.+?)(?:\s+(to|for|in|by|so|every|daily|each|before|after|at|during|until|whenever))?$/i)
    || text.match(/^(?:do|practice|start)\s+(.+)/i)
    || text.match(/^([A-Z][a-z]+(?:\s+[a-z]+){0,4})/);

  let name = '';
  if (actionMatch) {
    name = actionMatch[1] || actionMatch[0];
    name = name.replace(/\s+(to|for|in|by|so|every|daily|each|before|after|at|during)\s+.*$/i, '').trim();
    confidence += 15;
    reasoning.push('Extracted action phrase');
  }

  // 2. Detect unit and daily goal
  let unit: 'min' | 'reps' | 'dose' = 'min';
  let measurement_type: 'timer' | 'unit' | 'binary' = 'timer';
  let daily_goal = 0;
  let multiplier = 1;

  for (const pattern of UNIT_PATTERNS) {
    const match = lower.match(pattern.regex);
    if (match) {
      daily_goal = parseInt(match[1]);
      unit = pattern.unit;
      measurement_type = pattern.type;
      if ('multiplier' in pattern && pattern.multiplier) {
        daily_goal *= pattern.multiplier;
      }
      confidence += 20;
      reasoning.push(`Detected unit: ${daily_goal} ${unit}`);
      break;
    }
  }

  // 3. Detect long-term goal (e.g., "100 pushups in 365 days")
  let long_term_goal: number | null = null;
  let target_days: number | null = null;

  // Check for "get to/do X unit in/within/by Y"
  const longGoalMatch = lower.match(/(?:get to|reach|achieve|do|hit)\s+(\d+)\s*(?:reps?|pushups?|push-ups?|minutes?|mins?|times?|km|miles?)?\s*(?:in|within|by|over|across)\s+(.+)/i);
  if (longGoalMatch) {
    const goalVal = parseInt(longGoalMatch[1]);
    const timeframe = longGoalMatch[2].toLowerCase();
    
    for (const tPattern of TIMEFRAME_PATTERNS) {
      const tMatch = timeframe.match(tPattern.regex);
      if (tMatch) {
        if ('extract' in tPattern && tPattern.extract && tMatch[1]) {
          target_days = parseInt(tMatch[1]);
          if ('multiplier' in tPattern && tPattern.multiplier) {
            target_days *= tPattern.multiplier;
          }
        } else if (tPattern.value) {
          target_days = tPattern.value;
        }
        break;
      }
    }
    
    if (target_days && target_days > 0 && goalVal > 0) {
      long_term_goal = goalVal;
      if (daily_goal === 0) {
        daily_goal = Math.max(1, Math.round(goalVal * 0.05)); // Start at 5% of target
      }
      confidence += 25;
      reasoning.push(`Detected long-term goal: ${goalVal} in ~${target_days} days`);
    }
  }

  // If no long-term but there's a raw number+unit (like "100 pushups"), treat as daily goal
  if (daily_goal > 0 && !long_term_goal) {
    // Check if it's very large — likely a long-term goal, not daily
    if ((unit === 'reps' && daily_goal > 50) || (unit === 'min' && daily_goal > 120)) {
      long_term_goal = daily_goal;
      target_days = 90; // Default 3 months
      daily_goal = Math.max(1, Math.round(daily_goal * 0.05));
      confidence += 10;
      reasoning.push(`Large goal (${long_term_goal}) treated as long-term target, starting at ${daily_goal}`);
    }
  }

  // Fallback daily goal if still 0
  if (daily_goal === 0) {
    daily_goal = 10;
    if (!name.toLowerCase().includes('meditate') && unit === 'min') {
      daily_goal = 15;
    }
  }

  // 4. Detect frequency
  let frequency_per_week = 3;
  for (const pattern of FREQUENCY_PATTERNS) {
    const match = lower.match(pattern.regex);
    if (match) {
      if ('extract' in pattern && pattern.extract && match[1]) {
        frequency_per_week = parseInt(match[1]) * (lower.includes('day') || lower.includes('daily') ? 7 : 1);
      } else if (pattern.value) {
        frequency_per_week = Math.min(pattern.value, 14);
      }
      confidence += 10;
      reasoning.push(`Detected frequency: ${frequency_per_week}x/week`);
      break;
    }
  }

  // 5. Detect category + set icon + build name if empty
  let category: ParsedHabit['category'] = 'daily';
  let icon_name = 'Target';

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) {
      category = cat as ParsedHabit['category'];
      icon_name = ICON_MAP[cat] || 'Target';
      confidence += 10;
      reasoning.push(`Detected category: ${cat}`);
      break;
    }
  }

  if (unit === 'dose') {
    category = 'wellness';
    icon_name = 'Pill';
  }

  // 6. Build name from remaining text
  if (!name || name.length < 2) {
    if (long_term_goal) {
      name = `Reach ${long_term_goal} ${unit === 'reps' ? 'reps' : unit === 'min' ? 'min' : ''}`;
    } else {
      name = text.split(/[.!?]/)[0].trim().replace(/^(i want to|i need to|i should|i will)\s+/i, '');
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }
  }
  name = name.charAt(0).toUpperCase() + name.slice(1);
  if (name.length > 60) name = name.substring(0, 57) + '...';

  // 7. Detect time of day
  let time_of_day: string | null = null;
  for (const pattern of TIME_OF_DAY_PATTERNS) {
    if (lower.match(pattern.regex)) {
      time_of_day = pattern.value as string;
      confidence += 5;
      reasoning.push(`Detected time: ${time_of_day}`);
      break;
    }
  }

  // 8. Detect motivation
  let motivation = 'personal_growth';
  for (const pattern of MOTIVATION_PATTERNS) {
    if (lower.match(pattern.regex)) {
      motivation = pattern.value;
      confidence += 5;
      reasoning.push(`Detected motivation: ${motivation}`);
      break;
    }
  }

  // 9. Build short description
  const catLabels: Record<string, string> = {
    physical: 'Physical',
    cognitive: 'Cognitive',
    wellness: 'Wellness',
    daily: 'Daily',
    anchor: 'Anchor',
  };

  // 10. Calculate growth parameters based on goal
  let growth_type: 'fixed' | 'percentage' = unit === 'min' ? 'percentage' : 'fixed';
  let growth_value = unit === 'min' ? 20 : unit === 'reps' ? 2 : 0;

  // If there's a long-term goal with a timeframe, adjust growth to match
  if (long_term_goal && target_days && target_days > 0 && daily_goal > 0) {
    const current = daily_goal;
    const target = long_term_goal;
    const sessionsNeeded = target_days * (frequency_per_week / 7);
    const totalGrowthNeeded = target - current;
    
    if (growth_type === 'fixed' && totalGrowthNeeded > 0 && sessionsNeeded > 0) {
      const growthPerLevel = growth_value;
      const levelUpsNeeded = Math.ceil(totalGrowthNeeded / growthPerLevel);
      
      if (levelUpsNeeded > sessionsNeeded) {
        // Too slow — increase growth per level
        const adjustedGrowth = Math.ceil(totalGrowthNeeded / sessionsNeeded);
        growth_value = Math.max(growth_value, adjustedGrowth);
        reasoning.push(`Adjusted growth to +${growth_value}/level to hit target`);
      }
    } else if (growth_type === 'percentage' && totalGrowthNeeded > 0 && sessionsNeeded > 0) {
      // For percentage, calculate required growth per level-up
      // Starting from current, need to reach target in N level-ups (roughly N sessions)
      // current * (1 + growth/100)^N = target
      // growth = 100 * ((target/current)^(1/N) - 1)
      const ratio = target / current;
      if (ratio > 1 && sessionsNeeded > 0) {
        const requiredGrowth = Math.round(100 * (Math.pow(ratio, 1 / sessionsNeeded) - 1));
        growth_value = Math.max(growth_value, Math.min(requiredGrowth, 100));
        reasoning.push(`Adjusted growth to +${growth_value}%/level to hit target`);
      }
    }
  }

  // 11. Calculate XP & energy
  let xp_per_unit: number;
  let energy_cost_per_unit: number;
  if (unit === 'min') {
    xp_per_unit = 3;
    energy_cost_per_unit = 6;
  } else if (unit === 'reps') {
    xp_per_unit = 6;
    energy_cost_per_unit = 0.5;
  } else {
    xp_per_unit = 200;
    energy_cost_per_unit = 0;
  }

  let short_description = `A ${catLabels[category] || 'daily'} habit`;
  if (motivation !== 'personal_growth') {
    short_description += ` focused on ${motivation.replace(/_/g, ' ')}`;
  }
  if (long_term_goal && target_days) {
    short_description += `. Target: ${long_term_goal} ${unit} in ${target_days} days`;
  }

  const is_fixed = unit === 'dose';
  const is_trial_mode = unit === 'dose';

  return {
    name,
    category,
    unit,
    measurement_type,
    daily_goal,
    frequency_per_week: Math.max(1, Math.min(frequency_per_week, 14)),
    long_term_goal,
    target_days,
    icon_name,
    short_description,
    motivation,
    time_of_day,
    confidence: Math.min(confidence, 100),
    reasoning,
    growth_value,
    growth_type,
    xp_per_unit,
    energy_cost_per_unit,
    is_fixed,
    is_trial_mode,
    plateau_days_required: is_trial_mode ? 14 : 7,
  };
}

export function estimateProgression(habit: ParsedHabit): {
  weeksToTarget: number | null;
  projectedLevels: { week: number; goal: number; level: number }[];
} {
  if (!habit.long_term_goal || !habit.target_days) {
    return { weeksToTarget: null, projectedLevels: [] };
  }

  const projectedLevels: { week: number; goal: number; level: number }[] = [];
  let currentGoal = habit.daily_goal;
  let currentLevel = 1;
  let currentXp = 0;
  const xpPerSession = habit.unit === 'min'
    ? currentGoal * habit.xp_per_unit * 60
    : habit.unit === 'reps'
    ? currentGoal * habit.xp_per_unit
    : habit.xp_per_unit;

  // Simulate over the target period
  const totalSessions = Math.ceil(habit.target_days * (habit.frequency_per_week / 7));
  let weekCount = 1;

  for (let session = 1; session <= totalSessions; session++) {
    // Earn XP
    currentXp += xpPerSession;

    // Check level-up
    const xpForNext = getXpForNextHabitLevel(currentLevel);
    if (currentXp >= xpForNext) {
      currentXp -= xpForNext;
      currentLevel++;

      // Increase goal
      if (habit.growth_type === 'fixed' && habit.growth_value > 0) {
        currentGoal += habit.growth_value;
      } else if (habit.growth_type === 'percentage' && habit.growth_value > 0) {
        currentGoal = Math.round(currentGoal * (1 + habit.growth_value / 100));
      }

      // Update XP per session for future sessions
      if (habit.unit === 'min') {
        // xpPerSession = currentGoal * 3 * 60; // will recalc
      }
    }

    if (session % Math.max(1, Math.round(habit.frequency_per_week)) === 0) {
      projectedLevels.push({
        week: weekCount++,
        goal: currentGoal,
        level: currentLevel,
      });
    }

    if (currentGoal >= habit.long_term_goal) {
      projectedLevels.push({
        week: weekCount,
        goal: habit.long_term_goal,
        level: currentLevel,
      });
      return { weeksToTarget: weekCount, projectedLevels };
    }
  }

  return {
    weeksToTarget: currentGoal >= habit.long_term_goal ? weekCount : null,
    projectedLevels,
  };
}

function getXpForNextHabitLevel(level: number): number {
  const BASE_XP_PER_LEVEL = 300;
  const MAX_XP_PER_LEVEL = 1200;
  if (level <= 0) return BASE_XP_PER_LEVEL;
  const calculated = Math.round(BASE_XP_PER_LEVEL * Math.pow(1.5, level - 1));
  return Math.min(calculated, MAX_XP_PER_LEVEL);
}
