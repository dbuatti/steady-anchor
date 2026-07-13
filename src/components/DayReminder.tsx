import { useMemo } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { cn } from "@/lib/utils";

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Mock data — will be replaced with real data from hooks later
const mockConsistency = [3, 5, 2, 4, 6, 1, 0];

export function DayReminder() {
  const day = format(new Date(), 'EEE').toUpperCase();
  const todayIndex = new Date().getDay(); // 0=Sun, 1=Mon...
  const mondayIndex = 1;

  const maxVal = Math.max(...mockConsistency, 1);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-background overflow-hidden select-none p-8">
      {/* Big Day */}
      <div className={cn(
        "bg-white/10 backdrop-blur-md rounded-[5rem] flex items-center justify-center transition-all duration-700 shadow-2xl border border-white/10",
        "w-[60vw] h-[60vw] max-w-[320px] max-h-[320px]",
        "landscape:w-full landscape:h-full landscape:max-w-none landscape:max-h-none landscape:rounded-none landscape:bg-transparent"
      )}>
        <h1 className={cn(
          "font-black tracking-tighter text-white leading-none text-center",
          "text-[20vw] sm:text-[8rem]",
          "landscape:text-[50vh] landscape:tracking-[-0.02em]"
        )}>
          {day}
        </h1>
      </div>

      {/* Weekly Consistency Chart */}
      <div className="mt-10 w-full max-w-xs">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 text-center mb-5">
          Overall Consistency
        </p>
        <div className="flex items-end justify-center gap-2 h-24">
          {DAYS.map((d, i) => {
            const dayOfWeek = (mondayIndex + i) % 7;
            const isToday = dayOfWeek === todayIndex;
            const value = mockConsistency[i];
            const height = Math.max((value / maxVal) * 100, 4);

            return (
              <div key={d} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-[8px] font-bold text-white/40">{value}</span>
                <div
                  className={cn(
                    "w-full rounded-full transition-all duration-500",
                    isToday ? "bg-primary" : "bg-white/20"
                  )}
                  style={{ height: `${height}%`, minHeight: 4 }}
                />
                <span className={cn(
                  "text-[9px] font-black uppercase",
                  isToday ? "text-primary" : "text-white/40"
                )}>
                  {d}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 landscape:hidden opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white animate-pulse">
          Swipe right to return
        </p>
      </div>
    </div>
  );
}
