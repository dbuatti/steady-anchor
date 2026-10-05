import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSimpleTasks } from '@/hooks/useSimpleTasks';
import { isHubTask, isLabTask, isTaskResolvedToday } from '@/lib/task-groups';

const pickRandom = <T,>(items: T[]): T | undefined =>
  items[Math.floor(Math.random() * items.length)];

/**
 * Derived state for the Tasks hub: which habits are in play today,
 * whether each group is finished, and the currently spotlighted task.
 */
export function useTodayTasks() {
  const { tasks, loading, completeTask, skipTask } = useSimpleTasks();
  const [spotlightId, setSpotlightId] = useState<string | null>(null);

  const hubTasks = useMemo(() => tasks.filter(t => isHubTask(t)), [tasks]);
  const labTasks = useMemo(() => tasks.filter(isLabTask), [tasks]);
  const remainingTasks = useMemo(() => hubTasks.filter(t => !isTaskResolvedToday(t)), [hubTasks]);

  const isHubDone = hubTasks.length > 0 && remainingTasks.length === 0;
  const isLabDone = labTasks.length > 0 && labTasks.every(t => t.completed_today);
  const isAllDone = isHubDone && isLabDone;
  const completedCount = [...hubTasks, ...labTasks].filter(t => t.completed_today).length;

  // Resolve against fresh query data so the card never shows stale values.
  // Uses hubTasks (not remainingTasks) so a just-completed task can linger for its celebration.
  const spotlightTask = useMemo(
    () => hubTasks.find(t => t.id === spotlightId) ?? null,
    [hubTasks, spotlightId],
  );

  /** Spotlight a different remaining task, avoiding `excludeId` when possible. */
  const shuffle = useCallback((excludeId?: string | null) => {
    const others = remainingTasks.filter(t => t.id !== excludeId);
    setSpotlightId(pickRandom(others.length ? others : remainingTasks)?.id ?? null);
  }, [remainingTasks]);

  // Keep something in the spotlight whenever tasks remain.
  useEffect(() => {
    if (!spotlightTask && remainingTasks.length > 0) shuffle();
  }, [spotlightTask, remainingTasks.length, shuffle]);

  return {
    tasks,
    loading,
    hubTasks,
    labTasks,
    remainingTasks,
    spotlightTask,
    isHubDone,
    isAllDone,
    completedCount,
    shuffle,
    completeTask,
    skipTask,
  };
}
