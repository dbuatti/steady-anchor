import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Lightbulb, Target, Anchor, Zap, ShieldCheck, Brain, Clock, Layers,
  Trophy, Star, TrendingUp, Info, CheckCircle2, FlaskConical, ArrowRight,
  Dumbbell, Wind, BookOpen, Sparkles, Compass
} from 'lucide-react';

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <Anchor className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-black text-lg tracking-tighter uppercase italic">Steady Anchor</span>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="rounded-xl font-bold text-sm h-10 px-5 border-white/20">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-16 pb-32">

        {/* Hero */}
        <section className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-[2.5rem] bg-primary/20 flex items-center justify-center">
            <Anchor className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9]">
            How Steady Anchor Works
          </h1>
          <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            A habit system designed for the way your brain actually works — adaptive, modular, and judgment-free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/login">
              <Button size="lg" className="h-14 px-8 rounded-2xl font-black text-base gap-2">
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* The Problem */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black tracking-tighter text-center">Why typical habit apps fail</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Brain, title: "Rigid Goals", desc: "Most apps lock you into fixed daily targets. Miss one day and the whole system feels broken." },
              { icon: Zap, title: "Burnout Cycles", desc: "They push you to increase intensity constantly, ignoring your energy levels and life circumstances." },
              { icon: Layers, title: "One-Size-Fits-All", desc: "They don't account for ADHD, neurodivergence, or the natural ebb and flow of human motivation." },
            ].map((item, i) => (
              <Card key={i} className="rounded-2xl border-white/10 bg-white/5">
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground/70 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* The Solution: How it Works */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black tracking-tighter">Three modes, one flow</h2>
            <p className="text-muted-foreground/70">Your habits evolve through modes designed to match your capacity.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: FlaskConical, color: "bg-info/10 text-info border-info/20",
                title: "Trial Mode (Anchoring)",
                desc: "New habits start here. No pressure to grow — just show up consistently. Focus on anchoring the behavior before increasing the load.",
              },
              {
                icon: Zap, color: "bg-warning/10 text-warning border-warning/20",
                title: "Adaptive Growth Mode",
                desc: "Once stable, Steady Anchor suggests small, smart increments. If you're struggling, growth pauses automatically — no guilt, no shame.",
              },
              {
                icon: ShieldCheck, color: "bg-success/10 text-success border-success/20",
                title: "Fixed (Maintenance) Mode",
                desc: "For habits at their ideal level. The goal is fixed, the focus is on effortless consistency — brushing teeth, medication, daily anchors.",
              },
            ].map((mode, i) => (
              <div key={i} className={`flex items-start gap-5 p-5 rounded-2xl border ${mode.color}`}>
                <div className="p-3 rounded-xl shrink-0 bg-white/10">
                  <mode.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base">{mode.title}</h3>
                  <p className="text-sm text-muted-foreground/70 mt-1 leading-relaxed">{mode.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Features */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black tracking-tighter">Key Features</h2>
            <p className="text-muted-foreground/70">Built from the ground up for sustainable growth.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Brain, title: "Neurodivergent Mode", desc: "Smaller increments, longer plateaus, modular capsules, and reduced cognitive load." },
              { icon: Layers, title: "Modular Capsules", desc: "Break sessions into manageable chunks. 30 minutes of study becomes three 10-minute capsules." },
              { icon: Trophy, title: "XP & Leveling", desc: "Earn experience for every session. Level up your habits and unlock a sense of progression." },
              { icon: Clock, title: "Practice Lab", desc: "Design habits with a guided interview that identifies energy costs, timing, and potential barriers." },
              { icon: Star, title: "Anchor Practices", desc: "Designate core habits to keep you grounded even on chaotic days." },
              { icon: TrendingUp, title: "Adaptive Scheduling", desc: "The system adjusts goals based on your actual performance, not arbitrary targets." },
            ].map((feat, i) => (
              <Card key={i} className="rounded-2xl border-white/10 bg-white/5">
                <CardContent className="p-5 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <feat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm">{feat.title}</h3>
                    <p className="text-xs text-muted-foreground/70 leading-relaxed">{feat.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black tracking-tighter">Frequently Asked Questions</h2>
          </div>

          <Card className="rounded-2xl border-white/10 bg-white/5">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full space-y-2">
                {[
                  { q: "What makes this different from other habit trackers?", a: "Steady Anchor is built specifically for ADHD and neurodivergent brains. It's not about grinding — it's about consistency. Goals adapt to your energy, not the other way around." },
                  { q: "Is it really free?", a: "Yes. The core app is free to use. No hidden paywalls for essential features." },
                  { q: "How does the XP system work?", a: "You earn XP for each completed session. As you accumulate XP, your habit levels up. This provides a sense of progression without the pressure of unbroken streaks." },
                  { q: "What if I miss a day?", a: "Nothing bad happens. Missing is part of being human. The system adapts to your actual pace and never punishes you for taking time off." },
                  { q: "Can I use it for team or group habit tracking?", a: "Currently Steady Anchor is designed for individual use. Group features may be added in the future." },
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-b border-white/10">
                    <AccordionTrigger className="text-sm font-semibold text-left hover:no-underline py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground/70 leading-relaxed pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* Final CTA */}
        <section className="text-center space-y-6 pt-8 border-t border-white/10">
          <h2 className="text-4xl font-black tracking-tighter leading-[0.9]">
            Ready to find your <br />
            <span className="text-primary">steady anchor</span>?
          </h2>
          <p className="text-muted-foreground/70 max-w-md mx-auto">
            Start building habits that actually stick, at your own pace, with a system that adapts to you.
          </p>
          <Link to="/login">
            <Button size="lg" className="h-14 px-10 rounded-2xl font-black text-base gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground/50 pt-4">
          <p>&copy; {new Date().getFullYear()} Steady Anchor. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default HelpPage;
