import { useState, useMemo } from 'react';
import { habitTemplates } from '@/lib/habit-templates';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell, Wind, BookOpen, Music, Home, Code, Sparkles, Pill, Target, X, Plus, Zap, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Dumbbell, Wind, BookOpen, Music, Home, Code, Sparkles, Pill, Target,
};

const categoryGradients: Record<string, string> = {
  cognitive: 'from-blue-500/20 to-cyan-500/10',
  physical: 'from-orange-500/20 to-red-500/10',
  wellness: 'from-green-500/20 to-emerald-500/10',
  daily: 'from-purple-500/20 to-pink-500/10',
};

interface QuickAddData {
  templateId: string;
  frequency: number;
  duration: number;
}

interface HabitTemplatesPanelProps {
  onAddHabit: (data: QuickAddData) => void;
}

export function HabitTemplatesPanel({ onAddHabit }: HabitTemplatesPanelProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [frequency, setFrequency] = useState(3);
  const [duration, setDuration] = useState(15);

  const template = selectedTemplate
    ? habitTemplates.find(t => t.id === selectedTemplate)
    : null;

  const handleConfirm = () => {
    if (!selectedTemplate) return;
    onAddHabit({ templateId: selectedTemplate, frequency, duration });
    setSelectedTemplate(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">
        Tap a template to quick-start
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {habitTemplates.filter(t => t.id !== 'custom_habit').map((t) => {
          const Icon = iconMap[t.icon_name] || Target;
          const gradient = categoryGradients[t.category] || 'from-white/5 to-white/0';
          const isSelected = selectedTemplate === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(isSelected ? null : t.id)}
              className={cn(
                "relative p-4 rounded-2xl border border-dashed text-left transition-all duration-300 group",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-white/10 hover:border-white/30 bg-white/5"
              )}
            >
              <div className={cn("absolute inset-0 rounded-2xl bg-gradient-to-br opacity-30", gradient)} />
              <div className="relative z-10 space-y-2">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  isSelected ? "bg-primary/20 text-primary" : "bg-white/10 text-white/60"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">{t.name}</p>
                  <p className="text-[9px] text-white/40 mt-0.5">{t.shortDescription}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedTemplate && template && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="rounded-2xl border-primary/30 bg-primary/5">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-black text-sm">{template.name}</p>
                  <button onClick={() => setSelectedTemplate(null)} className="text-white/40 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs font-bold">Times per week: {frequency}</Label>
                    <Slider min={1} max={7} step={1} value={[frequency]} onValueChange={([v]) => setFrequency(v)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs font-bold">Session length: {duration} min</Label>
                    <Slider min={5} max={60} step={5} value={[duration]} onValueChange={([v]) => setDuration(v)} className="mt-1" />
                  </div>
                </div>

                <Button onClick={handleConfirm} className="w-full rounded-xl gap-2" size="sm">
                  <Plus className="w-4 h-4" /> Add to Your Habits
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
