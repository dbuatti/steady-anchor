import { isSameDay } from 'date-fns';
import type { SimpleTask } from '@/hooks/useSimpleTasks';

/** Habits that live in the Practice Lab tab rather than the Tasks hub. */
export const LAB_TASK_NAMES = ['Walking', 'Duolingo', 'Reading'] as const;
export type LabTaskName = typeof LAB_TASK_NAMES[number];

/** Habits with their own dedicated UI (e.g. the floating screen-break timer). */
export const SCREEN_BREAK_TASK_NAME = 'Screen Break';

export const isLabTask = (task: SimpleTask) =>
  (LAB_TASK_NAMES as readonly string[]).includes(task.name);

export const isTaskSkippedToday = (task: SimpleTask, now = new Date()) =>
  !!task.last_skipped_at && isSameDay(new Date(task.last_skipped_at), now);

export const isTaskResolvedToday = (task: SimpleTask) =>
  task.completed_today || isTaskSkippedToday(task);

/** Some habits only make sense during part of the day. */
const isInTimeWindow = (task: SimpleTask, hour: number) => {
  if (task.name === 'Brush Teeth (Morning)') return hour < 12;
  if (task.name === 'Brush Teeth (Evening)') return hour >= 18;
  return true;
};

/** Habits shown as cards in the Tasks hub right now. */
export const isHubTask = (task: SimpleTask, now = new Date()) =>
  !isLabTask(task) &&
  task.name !== SCREEN_BREAK_TASK_NAME &&
  isInTimeWindow(task, now.getHours());
