import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Anchor, FlaskConical, Layers, Trophy, Brain,
  ArrowRight, Zap, Sparkles, MessageSquare,
  BookOpen, Wind, Dumbbell, Clock, Target,
  ShieldCheck, TrendingUp, Star, Compass, Info
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <Anchor className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase italic">Steady Anchor</span>
          </div>
          <Link to="/login">
            <Button variant="ghost" className="font-bold text-muted-foreground hover:text-foreground">Login</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden">
        <div className="container mx-auto px-6 text-center space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Built for ADHD & Neurodivergence</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter max-w-4xl mx-auto">
            Build habits your <br />
            brain can <span className="text-primary">actually keep.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            The first modular habit tracker that adapts to your energy, reduces overwhelm, and grows with you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/login">
              <Button size="lg" className="h-16 px-10 text-lg rounded-2xl font-black gap-2 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.4)] transition-all hover:scale-105 active:scale-95">
                Get Started <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Link to="/help">
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-2xl font-black border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-all hover:scale-105 active:scale-95">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Glow Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px]" />
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 bg-white/5 border-y border-border">
        <div className="container mx-auto px-6 max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Why typical habit apps fail</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              They're built for neurotypical brains. Steady Anchor is built differently.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: "Rigid Goals", desc: "Most apps lock you into fixed daily targets. Miss one day and the whole system feels broken." },
              { icon: Zap, title: "Burnout Cycles", desc: "They push you to increase intensity constantly, ignoring your energy levels and life circumstances." },
              { icon: Layers, title: "One-Size-Fits-All", desc: "They don't account for ADHD, neurodivergence, or the natural ebb and flow of human motivation." },
            ].map((item, i) => (
              <Card key={i} className="rounded-[32px] border-white/10 bg-white/5 p-8 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-destructive" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Three Modes */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Three modes, one flow</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your habits evolve through modes designed to match your capacity — no grinding required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: FlaskConical, color: "text-info",
                title: "Trial Mode",
                sub: "Anchoring",
                desc: "New habits start here. No pressure to grow — just show up consistently and build the routine.",
                bg: "bg-info/10 border-info/20",
              },
              {
                icon: TrendingUp, color: "text-primary",
                title: "Adaptive Growth",
                sub: "Scaling",
                desc: "Once stable, your goals adapt automatically. Struggle? Growth pauses. No guilt, no shame.",
                bg: "bg-primary/10 border-primary/20",
              },
              {
                icon: ShieldCheck, color: "text-success",
                title: "Fixed Mode",
                sub: "Maintenance",
                desc: "For habits at their ideal level. The goal stays fixed, the focus stays on effortless consistency.",
                bg: "bg-success/10 border-success/20",
              },
            ].map((mode, i) => (
              <Card key={i} className={`rounded-[32px] border ${mode.bg} p-8 space-y-6`}>
                <div className={`w-14 h-14 rounded-2xl ${mode.bg} flex items-center justify-center`}>
                  <mode.icon className={`w-7 h-7 ${mode.color}`} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{mode.sub}</p>
                  <h3 className="text-2xl font-black uppercase tracking-tight mt-1">{mode.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{mode.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white/5 border-y border-border">
        <div className="container mx-auto px-6 max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Key Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build habits that actually last.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Anchor, title: "Anchor Practices", desc: "Designate core habits that keep you grounded and consistent, even on chaotic days." },
              { icon: Layers, title: "Modular Capsules", desc: "Break larger sessions into smaller, manageable chunks to reduce overwhelm." },
              { icon: Trophy, title: "XP & Leveling", desc: "Earn experience for every completed session and watch your habits level up." },
              { icon: Clock, title: "Practice Lab", desc: "Design habits with a guided interview that identifies energy costs and timing." },
              { icon: Brain, title: "Neurodivergent Mode", desc: "Smaller increments, longer plateaus, and reduced cognitive load for ADHD brains." },
              { icon: Star, title: "Adaptive Scheduling", desc: "Goals adjust dynamically to your actual performance, never to arbitrary targets." },
            ].map((feat, i) => (
              <Card key={i} className="rounded-[32px] border-border bg-card/50 p-8 space-y-4 hover:border-primary/30 transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <feat.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">{feat.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* See It In Action */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">See It In Action</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real examples of how habits look inside the app.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, label: "Cognitive Growth", name: "Study Session", goal: "25min", progress: "1/2 capsules", pct: 50, color: "text-success" },
              { icon: Wind, label: "Wellness Anchor", name: "Morning Meditation", goal: "10min", progress: "Completed!", pct: 100, color: "text-primary" },
              { icon: Dumbbell, label: "Physical Daily", name: "Push-ups", goal: "30 reps", progress: "15/30 reps", pct: 50, color: "text-warning" },
            ].map((ex, i) => (
              <Card key={i} className="rounded-[32px] border-border bg-card/50 p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <ex.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{ex.name}</h3>
                    <p className="text-sm text-muted-foreground">{ex.label}</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className={`text-4xl font-black ${ex.color}`}>{ex.goal}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Daily Goal</p>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Progress: {ex.progress}</span>
                  <span className={`${ex.color} font-semibold`}>{ex.pct}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className={`${ex.color === 'text-success' ? 'bg-success' : ex.color === 'text-primary' ? 'bg-primary' : 'bg-warning'} h-full rounded-full`} style={{ width: `${ex.pct}%` }}></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/5 border-y border-border">
        <div className="container mx-auto px-6 max-w-4xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from people transforming their habits with Steady Anchor.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-[32px] border-border bg-card/50 p-8 space-y-4">
              <MessageSquare className="w-8 h-8 text-primary" />
              <p className="leading-relaxed text-muted-foreground italic">
                "This app finally helped me stick to meditation. The 'Trial Mode' took all the pressure off, and the small increments actually work for my ADHD brain."
              </p>
              <p className="font-bold">— Alex P.</p>
            </Card>
            <Card className="rounded-[32px] border-border bg-card/50 p-8 space-y-4">
              <MessageSquare className="w-8 h-8 text-primary" />
              <p className="leading-relaxed text-muted-foreground italic">
                "I used to dread my project work, but breaking it into capsules made it so much more manageable. I'm actually making consistent progress now!"
              </p>
              <p className="font-bold">— Jamie L.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Got questions? We've got answers.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border-b border-border">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">
                What's the difference between Trial, Growth, and Fixed modes?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4 space-y-3">
                <p><strong className="text-foreground">Trial Mode:</strong> Focuses purely on consistency. No pressure to increase your goal — your only job is to show up.</p>
                <p><strong className="text-foreground">Adaptive Growth Mode:</strong> Once stable, the system suggests small increments. If you struggle, growth pauses automatically to prevent burnout.</p>
                <p><strong className="text-foreground">Fixed (Maintenance) Mode:</strong> For habits with an ideal, unchanging goal. The system focuses on maintaining consistency without any goal adjustments.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-b border-border">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">
                What are Anchor Practices?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                Anchor Practices are core habits you designate to keep you grounded and consistent, especially during busy or chaotic periods. They're your non-negotiable foundation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-b border-border">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">
                How do Capsules prevent overwhelm?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                Capsules break down larger habit sessions into smaller, more manageable chunks. For example, a 30-minute meditation session becomes three 10-minute capsules. Complete one at a time, at your own pace.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-b border-border">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">
                What if I miss a day?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                Nothing bad happens. Missing is part of being human. Steady Anchor adapts to your actual pace and never punishes you for taking time off. The system is designed around you, not the other way around.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 bg-white/5 border-t border-border relative overflow-hidden">
        <div className="container mx-auto px-6 text-center space-y-10 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black leading-none tracking-tighter uppercase">
            Start your last <br />
            <span className="text-primary">habit tracker.</span>
          </h2>
          <Link to="/login">
            <Button size="lg" className="h-16 px-12 text-xl rounded-2xl font-black gap-3 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.4)]">
              Get Started Free <ArrowRight className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 border-t border-border py-12">
        <div className="container mx-auto px-6 text-center text-muted-foreground space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Anchor className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-black text-lg tracking-tighter uppercase italic">Steady Anchor</span>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} Steady Anchor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
