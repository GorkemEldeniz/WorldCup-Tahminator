export const ISTANBUL_TZ = "Europe/Istanbul";

export const MATCHDAY_WINDOW_START_HOUR = 16; // window opens 16:00 Istanbul
export const MATCHDAY_WINDOW_END_HOUR = 10; // window closes 10:00 Istanbul next day

export const MAX_TEAM_SCORE = 5;
export const GOAL_DIFF_PENALTY = 1.5;
export const EXACT_SCORE_BONUS = 5;
export const EARLY_BONUS_CAP_HOURS = 10;

export const STREAK_MULTIPLIERS: { threshold: number; multiplier: number }[] = [
  { threshold: 7, multiplier: 2.0 },
  { threshold: 5, multiplier: 1.5 },
  { threshold: 3, multiplier: 1.25 },
];
