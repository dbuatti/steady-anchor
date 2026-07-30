
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatTimeDisplay } from '@/utils/time-utils';

interface TimerDetail {
  label: string;
  remaining: number;
  isPaused: boolean;
  habitKey: string;
}

export const FloatingTimer = () => {
  const [activeTimer, setActiveTimer] = useState<TimerDetail | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleTimerUpdate = (e: CustomEvent<TimerDetail>) => {
      setActiveTimer(e.detail);
    };

    window.addEventListener('habit-timer-update', handleTimerUpdate as EventListener);
    return () => window.removeEventListener('habit-timer-update', handleTimerUpdate as EventListener);
  }, []);

  if (!activeTimer) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className="fixed bottom-40 right-6 z-[110]"
      >
        <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl p-3 shadow-2xl flex items-center gap-4 text-foreground min-w-[200px]">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <Timer className="w-5 h-5 text-primary animate-pulse" />
          </div>
          
          <div className="flex-grow pr-2">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-50 truncate max-w-[120px]">
              {activeTimer.label}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-[8px] font-black uppercase opacity-40">Rem:</span>
              <p className="text-xl font-black tabular-nums">
                {formatTimeDisplay(activeTimer.remaining)}
              </p>
            </div>
          </div>

          <Button 
            size="icon" 
            variant="ghost" 
            className="rounded-full hover:bg-secondary h-8 w-8"
            onClick={() => navigate('/')}
          >
            <ExternalLink className="w-4 h-4 opacity-50" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};