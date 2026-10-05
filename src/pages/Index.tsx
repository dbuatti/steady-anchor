import { useState, useEffect, useRef } from 'react';
import { Loader2, Plus } from "lucide-react";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodayTasks } from '@/hooks/useTodayTasks';
import { SimpleTaskCard } from '@/components/SimpleTaskCard';
import { DayReminder } from '@/components/DayReminder';
import { HabitLab } from '@/components/HabitLab';
import { ScreenBreakTimer } from '@/components/ScreenBreakTimer';
import { CoachMarks } from '@/components/CoachMarks';
import { HabitTemplatesPanel } from '@/components/HabitTemplatesPanel';
import { RewardCeremony } from '@/components/dashboard/RewardCeremony';
import { TodayProgress } from '@/components/today/TodayProgress';
import { TodayDoneSummary } from '@/components/today/TodayDoneSummary';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type HubView = 'lab' | 'task' | 'day';

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

/** How long a completed card lingers (for its level-up feedback) before the next one. */
const NEXT_TASK_DELAY_MS = 2000;

export default function Index() {
  const {
    tasks, loading, hubTasks, labTasks, remainingTasks, spotlightTask,
    isHubDone, isAllDone, completedCount, shuffle, completeTask, skipTask,
  } = useTodayTasks();
  const [showAll, setShowAll] = useState(false);
  const [showCeremony, setShowCeremony] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = (searchParams.get('view') as HubView) || 'task';

  // Celebrate the moment everything flips to done (not on every render while done).
  const wasAllDone = useRef(false);
  useEffect(() => {
    if (isAllDone && !wasAllDone.current) setShowCeremony(true);
    wasAllDone.current = isAllDone;
  }, [isAllDone]);

  // Cancel a pending "next task" if the hub unmounts.
  const nextTaskTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(nextTaskTimer.current), []);

  const handleComplete = async (taskId: string) => {
    const result = await completeTask(taskId);
    if (result && !showAll) {
      clearTimeout(nextTaskTimer.current);
      nextTaskTimer.current = setTimeout(() => shuffle(taskId), NEXT_TASK_DELAY_MS);
    }
    return result;
  };

  const handleSkip = async (taskId: string) => {
    await skipTask(taskId);
    shuffle(taskId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-dvh bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-xs font-black text-white/60 uppercase tracking-[0.3em] animate-pulse">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "h-dvh transition-colors duration-1000 overflow-hidden select-none",
      isAllDone ? "bg-black" : isHubDone ? "bg-[#1a0d00]" : "bg-background"
    )}>
      <RewardCeremony
        isOpen={showCeremony}
        onClose={() => setShowCeremony(false)}
        streak={tasks[0]?.habit_level || 0}
        completedCount={completedCount}
      />

      <CoachMarks />

      <div
        className="fixed top-[max(1rem,env(safe-area-inset-top))] right-4 sm:top-8 sm:right-8 z-[100]"
        data-coach="screentimer"
      >
        <ScreenBreakTimer />
      </div>

      <Button
        asChild
        size="icon"
        className="fixed bottom-[calc(88px+env(safe-area-inset-bottom,0px))] right-4 sm:right-6 z-[100] h-14 w-14 rounded-full shadow-2xl"
      >
        <Link to="/create-habit" data-coach="addhabit" aria-label="Add habit" title="Add habit">
          <Plus className="w-7 h-7" />
        </Link>
      </Button>

      <AnimatePresence>
        {(isHubDone || isAllDone) && (
          <motion.div
            key={isAllDone ? 'all' : 'hub'}
            {...fade}
            className={cn(
              "fixed inset-0 z-0 pointer-events-none",
              isAllDone ? "bg-black/80" : "bg-black/40"
            )}
          />
        )}
      </AnimatePresence>

      <div className="h-full relative z-10" data-coach="task-area">
        <AnimatePresence mode="wait">
          {view === 'lab' && (
            <motion.div key="lab" {...fade} className={cn("h-full overflow-y-auto", isAllDone && "opacity-20")}>
              <HabitLab />
            </motion.div>
          )}

          {view === 'task' && (
            <motion.div key="task" {...fade} className="h-full relative overflow-hidden">
              <div className="h-full overflow-y-auto pb-[calc(64px+env(safe-area-inset-bottom,0px))]">
                <div className={cn(
                  // Tight side gutters so the hero card gets the full phone width.
                  "mx-auto w-full max-w-2xl px-4 sm:px-6 pt-20 md:pt-24 space-y-8 md:space-y-10 transition-all duration-1000",
                  isAllDone && "opacity-10 scale-95 grayscale"
                )}>
                  {isHubDone ? (
                    <TodayDoneSummary
                      isAllDone={isAllDone}
                      tasks={[...hubTasks, ...labTasks]}
                      onComplete={handleComplete}
                    />
                  ) : (
                    <>
                      {hubTasks.length > 0 && (
                        <TodayProgress
                          done={hubTasks.length - remainingTasks.length}
                          total={hubTasks.length}
                          showAll={showAll}
                          onToggleShowAll={() => setShowAll(v => !v)}
                          onShuffle={spotlightTask ? () => shuffle(spotlightTask.id) : undefined}
                        />
                      )}

                      {showAll ? (
                        <div className="grid gap-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                          {hubTasks.map(task => (
                            <SimpleTaskCard key={task.id} task={task} onComplete={handleComplete} />
                          ))}
                        </div>
                      ) : (
                        spotlightTask && (
                          <div key={spotlightTask.id} className="animate-in zoom-in-95 duration-500">
                            <SimpleTaskCard
                              task={spotlightTask}
                              onComplete={handleComplete}
                              onShuffle={() => handleSkip(spotlightTask.id)}
                              showShuffle
                            />
                          </div>
                        )
                      )}
                    </>
                  )}

                  {/* Templates quick-add — shown while the user has only a few habits */}
                  {hubTasks.length < 3 && !isHubDone && !showAll && (
                    <div className="pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <HabitTemplatesPanel
                        onAddHabit={(data) => navigate('/create-habit', { state: { templateToPreFill: data } })}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'day' && (
            <motion.div key="day" {...fade} className={cn("h-full overflow-hidden", isAllDone && "opacity-10")}>
              <DayReminder />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
