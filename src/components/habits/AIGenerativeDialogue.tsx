import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Sparkles, Target, CheckCircle2, Loader2, ArrowRight, Brain, X,
  Dumbbell, Wind, BookOpen, Sparkle, TrendingUp, Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { WizardHabitData } from '@/hooks/useUserHabitWizardTemp';
import { parseHabitInput, estimateProgression } from '@/utils/nlp-parser';

interface AIGenerativeDialogueProps {
  onHabitGenerated: (habitData: Partial<WizardHabitData>) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AIGenerativeDialogue = ({ onHabitGenerated, isOpen, onClose }: AIGenerativeDialogueProps) => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof parseHabitInput> | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [discipline, setDiscipline] = useState(50);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    setShowResult(false);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 1200));

    const parsed = parseHabitInput(input);
    if (discipline < 50) {
      parsed.daily_goal = Math.max(1, Math.round(parsed.daily_goal * 0.7));
    } else if (discipline > 70) {
      parsed.daily_goal = Math.round(parsed.daily_goal * 1.3);
    }
    setResult(parsed);
    setShowResult(true);
    setIsAnalyzing(false);
  };

  const handleAccept = () => {
    if (!result) return;

    const wizardData: Partial<WizardHabitData> = {
      name: result.name,
      habit_key: result.name.toLowerCase().replace(/\s/g, '_').replace(/[^a-z0-9_]/g, ''),
      category: result.category,
      unit: result.unit,
      daily_goal: result.daily_goal,
      frequency_per_week: result.frequency_per_week,
      motivation_type: result.motivation as any,
      energy_per_session: discipline < 40 ? 'very_little' : discipline < 70 ? 'a_bit' : 'moderate',
      consistency_reality: result.frequency_per_week >= 7 ? 'daily' : result.frequency_per_week >= 5 ? 'most_days' : '3-4_days',
      emotional_cost: discipline < 40 ? 'heavy' : 'light',
      time_of_day_fit: result.time_of_day || 'anytime',
      barriers: [],
      icon_name: result.icon_name,
      short_description: result.short_description,
      measurement_type: result.measurement_type,
      is_trial_mode: discipline < 40 || result.unit === 'dose',
      is_fixed: result.is_fixed,
      anchor_practice: result.category === 'anchor',
      auto_chunking: true,
      xp_per_unit: result.xp_per_unit,
      energy_cost_per_unit: result.energy_cost_per_unit,
      growth_type: result.growth_type,
      growth_value: result.growth_value,
      plateau_days_required: result.plateau_days_required,
      window_start: null,
      window_end: null,
      carryover_enabled: false,
      weekly_session_min_duration: result.daily_goal,
    };

    onHabitGenerated(wizardData);
    onClose();
  };

  const progression = result ? estimateProgression(result) : null;

  const iconEl = result?.icon_name === 'Dumbbell' ? <Dumbbell className="w-5 h-5" /> :
    result?.icon_name === 'Wind' || result?.icon_name === 'BookOpen' ? <BookOpen className="w-5 h-5" /> :
    <Target className="w-5 h-5" />;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl"
      >
        <Card className="rounded-3xl shadow-2xl overflow-hidden border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">AI Habit Generator</CardTitle>
                  <p className="text-xs text-muted-foreground">Describe your goal in natural language</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {!showResult && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="relative">
                  <Textarea
                    placeholder="Try: 'I want to meditate for 10 minutes every morning to reduce stress' or '100 pushups in 365 days'"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[120px] rounded-2xl text-base p-4 pr-12 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAnalyze();
                    }}
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Your commitment level</p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground w-16">Gentle</span>
                    <Slider
                      min={0}
                      max={100}
                      step={10}
                      value={[discipline]}
                      onValueChange={([v]) => setDiscipline(v)}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-16 text-right">Driven</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center">
                    {discipline < 30 ? 'Low-pressure start with trial mode, smaller goals' :
                     discipline < 60 ? 'Balanced approach with room to grow' :
                     'Direct path with higher starting goals'}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Press Cmd/Ctrl + Enter to analyze</p>
                  <Button onClick={handleAnalyze} disabled={!input.trim()} className="rounded-xl px-6">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze
                  </Button>
                </div>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-semibold">Analyzing your input...</p>
                <p className="text-sm text-muted-foreground">Detecting goals, timeframe, and progression path</p>
              </motion.div>
            )}

            {showResult && result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="rounded-2xl p-4 border bg-primary/5 border-primary/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkle className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-bold text-sm">{result.confidence >= 70 ? 'High Confidence' : result.confidence >= 50 ? 'Medium Confidence' : 'Low Confidence'}</p>
                      <p className="text-xs opacity-75">{result.confidence}% match</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setShowResult(false)}>
                    Try Again
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 p-3 rounded-xl col-span-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">{iconEl}</div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold">Habit</p>
                      <p className="font-bold">{result.name}</p>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Daily Goal</p>
                    <p className="font-semibold">{result.daily_goal} {result.unit}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Frequency</p>
                    <p className="font-semibold">{result.frequency_per_week}x/week</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Category</p>
                    <p className="font-semibold capitalize">{result.category}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Growth</p>
                    <p className="font-semibold">+{result.growth_value}{result.growth_type === 'percentage' ? '%' : ''}/level</p>
                  </div>
                </div>

                {result.long_term_goal && result.target_days && (
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-xl border border-primary/20 space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <p className="text-xs font-bold text-primary uppercase">Progression Plan</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Start: <strong>{result.daily_goal} {result.unit}</strong></span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span>Target: <strong>{result.long_term_goal} {result.unit}</strong></span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span>in ~<strong>{result.target_days} days</strong></span>
                    </div>
                    {progression && progression.weeksToTarget && (
                      <div className="flex items-end gap-1 h-12">
                        {progression.projectedLevels.slice(0, 12).map((p, i) => {
                          const maxGoal = result.long_term_goal!;
                          const height = Math.max(8, (p.goal / maxGoal) * 100);
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                              <div
                                className="w-full rounded-t bg-primary/40 hover:bg-primary/60 transition-all"
                                style={{ height: `${height}%` }}
                                title={`Week ${p.week}: ${p.goal} ${result.unit}`}
                              />
                              {i % 4 === 0 && <span className="text-[7px] text-muted-foreground">w{p.week}</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground">
                      Goal grows {result.growth_type === 'fixed' ? `${result.growth_value} ${result.unit} per level-up` : `${result.growth_value}% per level-up`}. Steady progress over time.
                    </p>
                  </div>
                )}

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 space-y-2">
                  <p className="text-xs font-bold text-primary uppercase">AI Insights</p>
                  <p className="text-sm">{result.short_description}</p>
                  <p className="text-xs text-muted-foreground italic">Based on: {result.reasoning.join(', ')}</p>
                </div>

                <div className="bg-muted/50 p-4 rounded-xl border border-border space-y-2">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    <p className="text-xs font-bold uppercase">How XP & Streaks Work</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Missing a habit <strong>subtracts XP</strong> from that habit rather than breaking your streak.
                    You're never penalized for off days — your progress grows when you show up, and gently
                    decreases when you don't. The goal increases automatically as you level up, so you're
                    always working at the right difficulty for your current ability.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button onClick={handleAccept} className="flex-1 rounded-xl h-12 text-base font-bold">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Create This Habit
                  </Button>
                  <Button variant="outline" onClick={() => setShowResult(false)} className="rounded-xl h-12">
                    Edit Manually
                  </Button>
                </div>
              </motion.div>
            )}

            {!showResult && !isAnalyzing && (
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-3">Examples to try:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button variant="ghost" className="h-auto rounded-xl justify-start text-left px-3 py-2 hover:bg-primary/5 flex-wrap"
                    onClick={() => setInput('I want to meditate for 10 minutes every morning to reduce stress and anxiety')}>
                    <Wind className="w-4 h-4 mr-2 text-primary shrink-0" />
                    <span className="text-xs">"Meditate 10 min daily"</span>
                  </Button>
                  <Button variant="ghost" className="h-auto rounded-xl justify-start text-left px-3 py-2 hover:bg-primary/5 flex-wrap"
                    onClick={() => setInput('I need to do 20 push-ups daily to get stronger and build muscle')}>
                    <Dumbbell className="w-4 h-4 mr-2 text-primary shrink-0" />
                    <span className="text-xs">"20 push-ups daily"</span>
                  </Button>
                  <Button variant="ghost" className="h-auto rounded-xl justify-start text-left px-3 py-2 hover:bg-primary/5 flex-wrap"
                    onClick={() => setInput('100 pushups in 365 days')}>
                    <Target className="w-4 h-4 mr-2 text-primary shrink-0" />
                    <span className="text-xs">"100 pushups in 365 days"</span>
                  </Button>
                  <Button variant="ghost" className="h-auto rounded-xl justify-start text-left px-3 py-2 hover:bg-primary/5 flex-wrap"
                    onClick={() => setInput('I should read for 30 minutes before bed to improve my knowledge')}>
                    <BookOpen className="w-4 h-4 mr-2 text-primary shrink-0" />
                    <span className="text-xs">"Read 30 min before bed"</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AIGenerativeDialogue;
