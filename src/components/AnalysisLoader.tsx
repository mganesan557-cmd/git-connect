import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Code2, Search, Cpu, Zap, Eye, BrainCircuit, Layers, GitBranch } from "lucide-react";

const analysisPhases = [
  { icon: Code2, text: "Parsing source code...", color: "text-[hsl(var(--syntax-function))]" },
  { icon: Search, text: "Identifying variables & scope...", color: "text-[hsl(var(--syntax-variable))]" },
  { icon: GitBranch, text: "Tracing control flow...", color: "text-[hsl(var(--syntax-keyword))]" },
  { icon: Layers, text: "Mapping data structures...", color: "text-[hsl(var(--syntax-string))]" },
  { icon: BrainCircuit, text: "Analyzing logic patterns...", color: "text-[hsl(var(--syntax-number))]" },
  { icon: Cpu, text: "Simulating execution...", color: "text-[hsl(var(--syntax-function))]" },
  { icon: Zap, text: "Computing variable states...", color: "text-[hsl(var(--syntax-variable))]" },
  { icon: Eye, text: "Building visualization...", color: "text-[hsl(var(--syntax-keyword))]" },
];

const funFacts = [
  "Python was named after Monty Python, not the snake 🐍",
  "The first computer bug was an actual bug — a moth! 🦟",
  "There are ~700 programming languages in the world 🌍",
  "The first programmer was Ada Lovelace in the 1840s 👩‍💻",
  "JavaScript was created in just 10 days ⚡",
  "The term 'debugging' came from removing a real bug from hardware 🔧",
];

export const AnalysisLoader = () => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * funFacts.length));
  const [dots, setDots] = useState("");

  useEffect(() => {
    const phaseTimer = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % analysisPhases.length);
    }, 1800);
    return () => clearInterval(phaseTimer);
  }, []);

  useEffect(() => {
    const factTimer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % funFacts.length);
    }, 4000);
    return () => clearInterval(factTimer);
  }, []);

  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(dotTimer);
  }, []);

  const phase = analysisPhases[phaseIndex];
  const Icon = phase.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6 px-4">
      {/* Animated icon ring */}
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-secondary/80 border border-border flex items-center justify-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={phaseIndex}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className={`h-7 w-7 ${phase.color}`} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground absolute -bottom-1 -right-1" />
      </div>

      {/* Phase text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phaseIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="text-center"
        >
          <p className="text-sm font-display font-medium text-foreground">
            {phase.text}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {analysisPhases.map((_, i) => (
          <motion.div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              i === phaseIndex ? "bg-foreground" : i < phaseIndex ? "bg-muted-foreground/40" : "bg-secondary"
            }`}
            animate={i === phaseIndex ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Fun fact */}
      <AnimatePresence mode="wait">
        <motion.div
          key={factIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-4 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/30 max-w-xs"
        >
          <p className="text-[11px] font-display text-muted-foreground text-center leading-relaxed">
            💡 {funFacts[factIndex]}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
