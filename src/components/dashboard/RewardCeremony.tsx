"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Star, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface RewardCeremonyProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  completedCount: number;
}

export const RewardCeremony: React.FC<RewardCeremonyProps> = ({ 
  isOpen, 
  onClose, 
  streak, 
  completedCount 
}) => {
  useEffect(() => {
    if (isOpen) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            className="w-full max-w-md text-center space-y-8"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center opacity-20"
              >
                <div className="w-64 h-64 rounded-full border-4 border-dashed border-white" />
              </motion.div>
              
              <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-orange-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-orange-500/40">
                <Trophy className="w-16 h-16 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                Journey Harmonized
              </h2>
              <p className="text-orange-400 font-black uppercase tracking-[0.3em] text-xs">
                Daily Momentum Achieved
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-4 space-y-1">
                <div className="flex items-center justify-center gap-2 text-orange-400">
                  <Zap className="w-4 h-4 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Streak</span>
                </div>
                <p className="text-3xl font-black text-white">{streak}</p>
                <p className="text-[8px] font-bold text-white/40 uppercase">Days Strong</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-4 space-y-1">
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Tasks</span>
                </div>
                <p className="text-3xl font-black text-white">{completedCount}</p>
                <p className="text-[8px] font-bold text-white/40 uppercase">Completed Today</p>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={onClose}
                className="w-full h-16 rounded-[2rem] bg-white text-orange-600 font-black text-lg hover:bg-white/90 shadow-xl transition-all active:scale-95"
              >
                REST WELL
              </Button>
            </div>

            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] animate-pulse">
              Tap to return to dashboard
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};