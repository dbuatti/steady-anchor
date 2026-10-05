import { Moon, Sparkles } from "lucide-react";
import { SimpleTaskRow } from "@/components/SimpleTaskRow";
import type { SimpleTask, TaskCompletionResult } from "@/hooks/useSimpleTasks";

interface TodayDoneSummaryProps {
  isAllDone: boolean;
  tasks: SimpleTask[];
  onComplete: (taskId: string) => Promise<TaskCompletionResult | undefined>;
}

/** Shown once every hub task is resolved: a calm wind-down state with quick-log rows. */
export function TodayDoneSummary({ isAllDone, tasks, onComplete }: TodayDoneSummaryProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
          {isAllDone ? <Sparkles className="w-8 h-8 text-white/60" /> : <Moon className="w-8 h-8 text-white/40" />}
        </div>
        <h3 className="text-3xl font-black text-white/40 uppercase italic tracking-tighter">
          {isAllDone ? "Journey Harmonized" : "Central Tasks Done"}
        </h3>
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
          {isAllDone ? "Everything complete" : "Quick log remaining tasks"}
        </p>
      </div>

      <div className="grid gap-2.5 max-w-md mx-auto">
        {tasks.map(task => (
          <SimpleTaskRow key={task.id} task={task} onComplete={onComplete} />
        ))}
      </div>
    </div>
  );
}
