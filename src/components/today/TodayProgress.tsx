import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TodayProgressProps {
  done: number;
  total: number;
  showAll: boolean;
  onToggleShowAll: () => void;
  onShuffle?: () => void;
}

/** Compact header for the Tasks hub: progress through today's habits plus view controls. */
export function TodayProgress({ done, total, showAll, onToggleShowAll, onShuffle }: TodayProgressProps) {
  return (
    <div className="flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50">
          Today · <span className="text-white tabular-nums">{done}</span>/{total}
        </p>
        <div className="flex gap-1" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 flex-1 max-w-8 rounded-full transition-colors duration-500",
                i < done ? "bg-primary" : "bg-white/15"
              )}
            />
          ))}
        </div>
      </div>

      {total > 1 && (
        <div className="flex items-center gap-1 shrink-0">
          {onShuffle && !showAll && (
            <Button
              onClick={onShuffle}
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all active:rotate-180 duration-500"
              aria-label="Shuffle task"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
          <button
            onClick={onToggleShowAll}
            aria-pressed={showAll}
            className="h-9 px-4 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all active:scale-95"
          >
            {showAll ? 'One at a time' : 'Show all'}
          </button>
        </div>
      )}
    </div>
  );
}
