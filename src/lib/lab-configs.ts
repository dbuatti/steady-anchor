import type { LucideIcon } from "lucide-react";
import { BookOpen, CloudSun, Languages } from "lucide-react";
import type { LabTaskName } from "@/lib/task-groups";

export interface LabConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  adhdTip: string;
  detailLabel: string;
  detailPlaceholder: string;
  futureVision: {
    unit: string;
    multiplier: number;
    projections: { years: number; text: string }[];
  };
  microSteps: { id: string; label: string; icon: string }[];
}

/** Copy and visuals for each Practice Lab habit. */
export const LAB_CONFIGS: Record<LabTaskName, LabConfig> = {
  'Walking': {
    icon: CloudSun,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    adhdTip: "The transition is the hardest part. Don't think about the walk, just think about the shoes.",
    detailLabel: "Extra minutes or steps?",
    detailPlaceholder: "e.g. 5 extra mins",
    futureVision: {
      unit: "hours outside",
      multiplier: 1, // based on minutes
      projections: [
        { years: 1, text: "60 hours of fresh air" },
        { years: 3, text: "A stronger, calmer heart" },
        { years: 5, text: "2,000 miles of exploration" }
      ]
    },
    microSteps: [
      { id: 'shoes', label: "Shoes on", icon: "👟" },
      { id: 'door', label: "Door open", icon: "🚪" },
      { id: 'outside', label: "Step outside", icon: "🌳" }
    ]
  },
  'Duolingo': {
    icon: Languages,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    adhdTip: "Forget the streak. Forget the leaderboard. Just focus on one single sound today.",
    detailLabel: "How many lessons?",
    detailPlaceholder: "e.g. 2 lessons",
    futureVision: {
      unit: "lessons",
      multiplier: 1,
      projections: [
        { years: 1, text: "365 new concepts learned" },
        { years: 3, text: "Conversational confidence" },
        { years: 5, text: "Fluent in a second world" }
      ]
    },
    microSteps: [
      { id: 'phone', label: "Phone in hand", icon: "📱" },
      { id: 'open', label: "App open", icon: "🦉" },
      { id: 'start', label: "Start 1 lesson", icon: "✨" }
    ]
  },
  'Reading': {
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    adhdTip: "If your mind wanders, that's okay. It's just your brain exploring. Gently come back to the next word.",
    detailLabel: "Pages or chapters?",
    detailPlaceholder: "e.g. 10 pages",
    futureVision: {
      unit: "books",
      multiplier: 0.05, // 10 mins ~ 5 pages
      projections: [
        { years: 1, text: "12 books finished" },
        { years: 3, text: "A library of new ideas" },
        { years: 5, text: "A transformed perspective" }
      ]
    },
    microSteps: [
      { id: 'grab', label: "Grab book", icon: "📖" },
      { id: 'open', label: "Open to page", icon: "🔖" },
      { id: 'sentence', label: "Read 1 sentence", icon: "✍️" }
    ]
  }
};
