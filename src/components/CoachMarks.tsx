import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { X, ArrowRight, Coffee, BarChart3, LayoutGrid, Plus, Eye } from 'lucide-react';

interface CoachStep {
  selector: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

const COACH_KEY = 'steady-anchor-coach-seen';

const steps: CoachStep[] = [
  {
    selector: '[data-coach="analytics"]',
    title: 'Your Progress',
    body: 'This button opens your analytics dashboard. Track streaks, consistency, and habit growth over time.',
    icon: <BarChart3 className="w-5 h-5" />,
    placement: 'right',
  },
  {
    selector: '[data-coach="screentimer"]',
    title: 'Screen Break Timer',
    body: 'Tap the coffee icon to start a timer. Use this to train yourself to put your phone down, reset your focus, and take a healthy break.',
    icon: <Coffee className="w-5 h-5" />,
    placement: 'left',
  },
  {
    selector: '[data-coach="task-area"]',
    title: 'Swipe to Navigate',
    body: 'Swipe left or right here to move between your Lab, daily Tasks, and Day view. Each screen serves a different purpose.',
    icon: <LayoutGrid className="w-5 h-5" />,
    placement: 'bottom',
  },
  {
    selector: '[data-coach="showall"]',
    title: 'Show All Tasks',
    body: 'Toggle this switch to see all your tasks at once instead of one at a time. Useful for getting an overview of your day.',
    icon: <Eye className="w-5 h-5" />,
    placement: 'top',
  },
  {
    selector: '[data-coach="addhabit"]',
    title: 'Add New Habit',
    body: 'Tap the + button to create a new custom habit. You can also choose from pre-built templates on the main screen.',
    icon: <Plus className="w-5 h-5" />,
    placement: 'left',
  },
];

export function CoachMarks() {
  const [activeStep, setActiveStep] = useState(-1);
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const seen = localStorage.getItem(COACH_KEY);
    if (!seen) {
      const timer = setTimeout(() => setActiveStep(0), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateRect = useCallback(() => {
    if (activeStep < 0) return;
    const el = document.querySelector(steps[activeStep].selector);
    if (el) {
      setElementRect(el.getBoundingClientRect());
    }
  }, [activeStep]);

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [updateRect]);

  const handleDismiss = () => {
    localStorage.setItem(COACH_KEY, 'true');
    setActiveStep(-1);
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(s => s + 1);
    } else {
      handleDismiss();
    }
  };

  if (activeStep < 0 || !elementRect) return null;

  const step = steps[activeStep];

  const getTooltipPosition = () => {
    const gap = 16;
    const tooltipWidth = 280;
    const tooltipHeight = 180;

    let top = 0, left = 0;
    const cx = elementRect.left + elementRect.width / 2;
    const cy = elementRect.top + elementRect.height / 2;

    switch (step.placement) {
      case 'top':
        top = elementRect.top - tooltipHeight - gap;
        left = cx - tooltipWidth / 2;
        break;
      case 'bottom':
        top = elementRect.bottom + gap;
        left = cx - tooltipWidth / 2;
        break;
      case 'left':
        top = cy - tooltipHeight / 2;
        left = elementRect.left - tooltipWidth - gap;
        break;
      case 'right':
        top = cy - tooltipHeight / 2;
        left = elementRect.right + gap;
        break;
    }

    // Keep within viewport
    top = Math.max(20, Math.min(top, window.innerHeight - tooltipHeight - 20));
    left = Math.max(20, Math.min(left, window.innerWidth - tooltipWidth - 20));

    return { top, left };
  };

  const pos = getTooltipPosition();

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none">
      {/* Dim overlay with hole punch */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'auto' }}>
        <defs>
          <mask id="coach-hole">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={elementRect.left - 8}
              y={elementRect.top - 8}
              width={elementRect.width + 16}
              height={elementRect.height + 16}
              rx={16}
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.6)"
          mask="url(#coach-hole)"
          onClick={handleNext}
        />
      </svg>

      {/* Pulse ring around element */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: elementRect.left - 12,
          top: elementRect.top - 12,
          width: elementRect.width + 24,
          height: elementRect.height + 24,
        }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-full h-full rounded-2xl border-2 border-primary"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>

      {/* Tooltip card */}
      <motion.div
        className="absolute pointer-events-auto"
        style={{ top: pos.top, left: pos.left, width: 280 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <div className="bg-background border border-border rounded-2xl p-5 shadow-2xl space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              {step.icon}
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <p className="font-black text-sm">{step.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.body}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeStep ? 'bg-primary w-5' : 'bg-white/20 w-1.5'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="rounded-xl h-8 text-xs" onClick={handleDismiss}>
                Skip
              </Button>
              <Button size="sm" className="rounded-xl h-8 text-xs gap-1" onClick={handleNext}>
                {activeStep < steps.length - 1 ? 'Next' : 'Done'} <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
