import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Coffee, Star, LayoutGrid, ChevronLeft, X } from 'lucide-react';

const TUTORIAL_KEY = 'steady-anchor-tutorial-seen';

const steps = [
  {
    title: 'Swipe to Navigate',
    body: 'Swipe left or right to move between your Lab, Task, and Day views. Each screen serves a different purpose.',
    icon: <div className="flex gap-4"><ArrowLeft className="w-8 h-8" /><ArrowRight className="w-8 h-8" /></div>,
  },
  {
    title: 'Practice Lab',
    body: 'The Lab is for deep-focus sessions like reading, walking, or language learning. Start a timer and immerse yourself.',
    icon: <LayoutGrid className="w-8 h-8" />,
  },
  {
    title: 'The Coffee Timer',
    body: 'Tap the coffee icon to start a screen break timer. Use this to train yourself to put your phone down for a few minutes and reset.',
    icon: <Coffee className="w-8 h-8" />,
    highlight: 'coffee',
  },
  {
    title: 'Your Progress',
    body: 'The star icon opens your analytics dashboard. Track streaks, consistency, and see how your habits are growing over time.',
    icon: <Star className="w-8 h-8" />,
    highlight: 'star',
  },
  {
    title: 'No Schedule Required',
    body: 'This app is not about time slots or rigid schedules. It\'s about having a clear understanding of what to do at any given moment. Just swipe, see what\'s next, and do it.',
    icon: <ChevronLeft className="w-8 h-8" />,
  },
];

export function NewUserTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(TUTORIAL_KEY);
    if (!seen) {
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(TUTORIAL_KEY, 'true');
    setIsOpen(false);
  };

  const current = steps[step];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-background border border-border rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl space-y-6"
          >
            <div className="flex justify-between items-start">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                {current.icon}
              </div>
              <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight">{current.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{current.body}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === step ? 'bg-primary w-6' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                {step < steps.length - 1 ? (
                  <>
                    <Button variant="ghost" size="sm" className="rounded-xl" onClick={handleDismiss}>
                      Skip
                    </Button>
                    <Button size="sm" className="rounded-xl" onClick={() => setStep(s => s + 1)}>
                      Next
                    </Button>
                  </>
                ) : (
                  <Button size="sm" className="rounded-xl" onClick={handleDismiss}>
                    Got It
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
