import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Columns, Play, Pause, RotateCcw, SkipForward, SkipBack, Info, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { algorithmCatalog, AlgorithmStep, AlgorithmInfo } from "@/lib/algorithms";
import ArrayBars from "@/components/algorithms/ArrayBars";
import AlgorithmChat from "@/components/algorithms/AlgorithmChat";

const sortingAlgos = algorithmCatalog.filter(a => a.category === "sorting");

const AlgorithmComparisonPage = () => {
  const [leftAlgo, setLeftAlgo] = useState<AlgorithmInfo>(sortingAlgos[0]);
  const [rightAlgo, setRightAlgo] = useState<AlgorithmInfo>(sortingAlgos[4] || sortingAlgos[1]);
  const [input, setInput] = useState("64, 34, 25, 12, 22, 11, 90");
  const [leftSteps, setLeftSteps] = useState<AlgorithmStep[]>([]);
  const [rightSteps, setRightSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [leftDropdown, setLeftDropdown] = useState(false);
  const [rightDropdown, setRightDropdown] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const maxSteps = Math.max(leftSteps.length, rightSteps.length);

  const run = () => {
    const ls = leftAlgo.generateSteps(input);
    const rs = rightAlgo.generateSteps(input);
    setLeftSteps(ls);
    setRightSteps(rs);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const stepForward = useCallback(() => setCurrentStep(p => Math.min(p + 1, maxSteps - 1)), [maxSteps]);
  const stepBackward = () => setCurrentStep(p => Math.max(p - 1, 0));
  const reset = () => { setCurrentStep(0); setIsPlaying(false); };

  useEffect(() => {
    if (isPlaying && currentStep < maxSteps - 1) {
      timerRef.current = setTimeout(() => stepForward(), 800 / speed);
    } else if (currentStep >= maxSteps - 1) setIsPlaying(false);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, currentStep, maxSteps, speed, stepForward]);

  // Count metrics from steps
  const countMetrics = (steps: AlgorithmStep[], upTo: number) => {
    let comparisons = 0, swaps = 0;
    for (let i = 0; i <= Math.min(upTo, steps.length - 1); i++) {
      if (steps[i].highlights && steps[i].highlights!.length > 0) comparisons++;
      if (steps[i].swapped && steps[i].swapped!.length > 0) swaps++;
    }
    return { comparisons, swaps, stepsCount: Math.min(upTo + 1, steps.length) };
  };

  const leftMetrics = countMetrics(leftSteps, currentStep);
  const rightMetrics = countMetrics(rightSteps, currentStep);
  const leftCurrent = leftSteps[Math.min(currentStep, leftSteps.length - 1)];
  const rightCurrent = rightSteps[Math.min(currentStep, rightSteps.length - 1)];

  const AlgoDropdown = ({ algo, setAlgo, open, setOpen, side }: { algo: AlgorithmInfo; setAlgo: (a: AlgorithmInfo) => void; open: boolean; setOpen: (o: boolean) => void; side: string }) => (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary text-xs font-display border border-border hover:border-foreground/20 transition-all max-w-[180px]">
        <span className="truncate">{algo.name}</span>
        <ChevronDown className={`h-3 w-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className={`absolute top-full mt-1 ${side === "right" ? "right-0" : "left-0"} bg-card border border-border rounded-xl overflow-hidden z-20 shadow-2xl min-w-[180px]`}>
            {sortingAlgos.map(a => (
              <button key={a.id} onClick={() => { setAlgo(a); setOpen(false); setLeftSteps([]); setRightSteps([]); }} className={`block w-full text-left px-3 py-2 text-xs font-display transition-colors ${a.id === algo.id ? "bg-foreground text-background" : "hover:bg-secondary"}`}>
                {a.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  // Build a combined algo info for chat context
  const combinedAlgoInfo: AlgorithmInfo = {
    ...leftAlgo,
    name: `${leftAlgo.name} vs ${rightAlgo.name}`,
    description: `Comparing ${leftAlgo.name} and ${rightAlgo.name} side by side`,
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card/60 backdrop-blur-md px-4 md:px-6 py-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 mr-2">
          <Columns className="h-4 w-4 text-[hsl(var(--syntax-keyword))]" />
          <h1 className="font-display font-semibold text-sm tracking-tight hidden md:block">Compare Algorithms</h1>
        </div>

        <AlgoDropdown algo={leftAlgo} setAlgo={setLeftAlgo} open={leftDropdown} setOpen={setLeftDropdown} side="left" />
        <span className="text-[10px] font-mono text-muted-foreground">vs</span>
        <AlgoDropdown algo={rightAlgo} setAlgo={setRightAlgo} open={rightDropdown} setOpen={setRightDropdown} side="right" />

        <div className="flex items-center gap-2 ml-auto">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-48 bg-secondary rounded-lg px-3 py-1.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-foreground/20 border border-border"
            placeholder="Values separated by commas"
          />
          <Button size="sm" onClick={run} className="gap-2 rounded-lg font-display text-xs">
            <Columns className="h-3 w-3" /> Compare
          </Button>
        </div>
      </div>

      {/* Main content */}
      {leftSteps.length > 0 && rightSteps.length > 0 ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Playback */}
          <div className="border-b border-border px-4 py-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <Button size="icon" variant="outline" onClick={reset} className="h-7 w-7 rounded-lg"><RotateCcw className="h-3 w-3" /></Button>
                <Button size="icon" variant="outline" onClick={stepBackward} disabled={currentStep <= 0} className="h-7 w-7 rounded-lg"><SkipBack className="h-3 w-3" /></Button>
                <Button size="icon" onClick={isPlaying ? () => setIsPlaying(false) : () => setIsPlaying(true)} disabled={currentStep >= maxSteps - 1 && !isPlaying} className="h-7 w-7 rounded-lg">
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
                <Button size="icon" variant="outline" onClick={stepForward} disabled={currentStep >= maxSteps - 1} className="h-7 w-7 rounded-lg"><SkipForward className="h-3 w-3" /></Button>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground ml-1">{currentStep + 1}/{maxSteps}</span>
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-[10px] font-mono text-muted-foreground">Speed</span>
                <input type="range" min="0.25" max="3" step="0.25" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="w-16 h-1 accent-foreground" />
                <span className="text-[10px] font-mono text-muted-foreground w-8">{speed}x</span>
              </div>
            </div>
          </div>

          {/* Side by side */}
          <div className="flex-1 grid grid-cols-2 overflow-hidden">
            {/* Left panel */}
            <div className="border-r border-border flex flex-col overflow-auto">
              <div className="px-4 py-2 border-b border-border/50 bg-card/30">
                <span className="text-[11px] font-display font-semibold">{leftAlgo.name}</span>
                <span className="text-[9px] font-mono text-muted-foreground ml-2">{leftAlgo.timeComplexity.worst}</span>
              </div>
              <div className="flex-1 p-4">
                {leftCurrent && (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-border bg-card/50 p-4 min-h-[160px] flex items-center justify-center">
                      <ArrayBars step={leftCurrent} />
                    </div>
                    <p className="text-[11px] font-display text-muted-foreground leading-relaxed">{leftCurrent.description}</p>
                  </div>
                )}
              </div>
              <MetricsPanel metrics={leftMetrics} algo={leftAlgo} />
            </div>

            {/* Right panel */}
            <div className="flex flex-col overflow-auto">
              <div className="px-4 py-2 border-b border-border/50 bg-card/30">
                <span className="text-[11px] font-display font-semibold">{rightAlgo.name}</span>
                <span className="text-[9px] font-mono text-muted-foreground ml-2">{rightAlgo.timeComplexity.worst}</span>
              </div>
              <div className="flex-1 p-4">
                {rightCurrent && (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-border bg-card/50 p-4 min-h-[160px] flex items-center justify-center">
                      <ArrayBars step={rightCurrent} />
                    </div>
                    <p className="text-[11px] font-display text-muted-foreground leading-relaxed">{rightCurrent.description}</p>
                  </div>
                )}
              </div>
              <MetricsPanel metrics={rightMetrics} algo={rightAlgo} />
            </div>
          </div>

          {/* Progress */}
          <div className="border-t border-border px-4 py-2">
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <motion.div className="h-full bg-foreground rounded-full" animate={{ width: `${((currentStep + 1) / maxSteps) * 100}%` }} transition={{ duration: 0.2 }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mx-auto">
              <Columns className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground font-display">Select two algorithms and click <span className="font-semibold text-foreground">Compare</span></p>
            <p className="text-xs text-muted-foreground/50 font-display">Watch them run side by side on the same data</p>
          </div>
        </div>
      )}

      <AlgorithmChat algorithm={combinedAlgoInfo} />
    </div>
  );
};

const MetricsPanel = ({ metrics, algo }: { metrics: { comparisons: number; swaps: number; stepsCount: number }; algo: AlgorithmInfo }) => (
  <div className="border-t border-border p-3">
    <div className="flex items-center gap-1.5 mb-2">
      <BarChart3 className="h-3 w-3 text-muted-foreground" />
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Metrics</span>
    </div>
    <div className="grid grid-cols-3 gap-1.5">
      <div className="flex flex-col items-center p-1.5 rounded-lg bg-secondary">
        <span className="text-[9px] font-mono text-muted-foreground/50">Comparisons</span>
        <span className="text-[13px] font-mono font-bold">{metrics.comparisons}</span>
      </div>
      <div className="flex flex-col items-center p-1.5 rounded-lg bg-secondary">
        <span className="text-[9px] font-mono text-muted-foreground/50">Swaps</span>
        <span className="text-[13px] font-mono font-bold">{metrics.swaps}</span>
      </div>
      <div className="flex flex-col items-center p-1.5 rounded-lg bg-secondary">
        <span className="text-[9px] font-mono text-muted-foreground/50">Steps</span>
        <span className="text-[13px] font-mono font-bold">{metrics.stepsCount}</span>
      </div>
    </div>
    <div className="mt-1.5 text-[9px] font-mono text-muted-foreground/50 text-center">
      Worst: {algo.timeComplexity.worst} • Space: {algo.spaceComplexity}
    </div>
  </div>
);

export default AlgorithmComparisonPage;
