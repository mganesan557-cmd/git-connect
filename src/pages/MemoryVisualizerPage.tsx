import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Layers, Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import PlaybackControls from "@/components/algorithms/PlaybackControls";
import { memoryPrograms, MemoryStep, MemoryProgram, StackFrame, HeapObject } from "@/lib/memorySimulator";

const MemoryVisualizerPage = () => {
  const [selectedProg, setSelectedProg] = useState(memoryPrograms[0]);
  const [steps, setSteps] = useState<MemoryStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectProgram = (prog: MemoryProgram) => {
    setSelectedProg(prog);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setDropdownOpen(false);
  };

  const run = () => {
    const s = selectedProg.generate();
    setSteps(s);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const stepForward = useCallback(() => setCurrentStep(p => Math.min(p + 1, steps.length - 1)), [steps.length]);
  const stepBackward = () => setCurrentStep(p => Math.max(p - 1, 0));
  const reset = () => { setCurrentStep(0); setIsPlaying(false); };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      timerRef.current = setTimeout(() => stepForward(), 1000 / speed);
    } else if (currentStep >= steps.length - 1) setIsPlaying(false);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, currentStep, steps.length, speed, stepForward]);

  const currentData = steps[currentStep];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card/60 backdrop-blur-md px-4 md:px-6 py-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 mr-2">
          <Layers className="h-4 w-4 text-[hsl(var(--syntax-variable))]" />
          <h1 className="font-display font-semibold text-sm tracking-tight hidden md:block">Memory Visualizer</h1>
        </div>

        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm font-display border border-border hover:border-foreground/20 transition-all">
            <span className="truncate">{selectedProg.name}</span>
            <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-xl overflow-hidden z-20 shadow-2xl min-w-[240px]">
                {memoryPrograms.map(prog => (
                  <button key={prog.id} onClick={() => selectProgram(prog)} className={`block w-full text-left px-4 py-2 text-sm font-display transition-colors ${prog.id === selectedProg.id ? "bg-foreground text-background" : "hover:bg-secondary"}`}>
                    {prog.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <Button size="sm" onClick={run} className="gap-2 rounded-lg font-display text-xs ml-auto">
          <Layers className="h-3 w-3" /> Run Simulation
        </Button>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto p-4">
        {currentData ? (
          <div className="space-y-4 max-w-5xl mx-auto">
            <PlaybackControls isPlaying={isPlaying} currentStep={currentStep} totalSteps={steps.length} speed={speed} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onStepForward={stepForward} onStepBackward={stepBackward} onReset={reset} onSpeedChange={setSpeed} />

            {/* Memory panels */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Stack */}
              <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
                <div className="px-4 py-2 border-b border-border/50 bg-card/30 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[hsl(var(--syntax-function))]" />
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Stack Memory</span>
                  <span className="text-[10px] font-mono text-muted-foreground/50 ml-auto">↑ grows up</span>
                </div>
                <div className="p-3 space-y-1.5 flex flex-col-reverse min-h-[200px]">
                  <AnimatePresence>
                    {currentData.stack.map((frame, i) => (
                      <StackFrameViz key={`${frame.functionName}-${i}`} frame={frame} highlighted={i === currentData.highlightStack} />
                    ))}
                  </AnimatePresence>
                  {currentData.stack.length === 0 && (
                    <div className="text-xs text-muted-foreground/40 font-mono text-center py-8">stack empty</div>
                  )}
                </div>
              </div>

              {/* Heap */}
              <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
                <div className="px-4 py-2 border-b border-border/50 bg-card/30 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[hsl(var(--syntax-string))]" />
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Heap Memory</span>
                </div>
                <div className="p-3 space-y-2 min-h-[200px]">
                  <AnimatePresence>
                    {currentData.heap.map(obj => (
                      <HeapObjectViz key={obj.id} obj={obj} highlighted={obj.id === currentData.highlightHeap} />
                    ))}
                  </AnimatePresence>
                  {currentData.heap.length === 0 && (
                    <div className="text-xs text-muted-foreground/40 font-mono text-center py-8">heap empty</div>
                  )}
                </div>
              </div>
            </div>

            {/* Step description */}
            <motion.div key={`desc-${currentStep}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-secondary/50 border border-border/30">
              <div className="flex items-center gap-1.5 mb-1">
                <Info className="h-3 w-3 text-[hsl(var(--syntax-function))]" />
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Step {currentStep + 1}</span>
              </div>
              <p className="text-[13px] font-display text-foreground/90 leading-relaxed">{currentData.description}</p>
            </motion.div>

            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <motion.div className="h-full bg-foreground rounded-full" animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} transition={{ duration: 0.2 }} />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mx-auto">
                <Layers className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground font-display">Select a program and click <span className="font-semibold text-foreground">Run Simulation</span></p>
              <p className="text-xs text-muted-foreground/50 font-display">Watch how stack frames and heap objects change during execution</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StackFrameViz = ({ frame, highlighted }: { frame: StackFrame; highlighted: boolean }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className={`rounded-lg border p-2.5 transition-all duration-200 ${
      highlighted
        ? "border-[hsl(var(--syntax-function))] bg-[hsl(var(--syntax-function)/0.1)] shadow-sm"
        : frame.active
        ? "border-border bg-card"
        : "border-border/50 bg-secondary/30"
    }`}
  >
    <div className="text-[11px] font-mono font-bold mb-1.5 flex items-center gap-1.5">
      {frame.active && <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--syntax-function))] animate-pulse" />}
      {frame.functionName}
    </div>
    {frame.variables.map((v, i) => (
      <div key={i} className="flex items-center gap-1.5 text-[10px] font-mono ml-3">
        <span className="text-[hsl(var(--syntax-variable))]">{v.name}</span>
        <span className="text-muted-foreground/40">=</span>
        <span className={v.heapRef ? "text-[hsl(var(--syntax-keyword))]" : "text-foreground font-semibold"}>
          {v.value}
        </span>
        {v.heapRef && <ArrowRight className="h-2.5 w-2.5 text-[hsl(var(--syntax-keyword))]" />}
      </div>
    ))}
  </motion.div>
);

const HeapObjectViz = ({ obj, highlighted }: { obj: HeapObject; highlighted: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className={`rounded-lg border p-2.5 transition-all duration-200 ${
      highlighted
        ? "border-[hsl(var(--syntax-string))] bg-[hsl(var(--syntax-string)/0.1)] shadow-sm"
        : "border-border bg-card"
    }`}
  >
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{obj.id}</span>
      <span className="text-[10px] font-mono font-bold text-[hsl(var(--syntax-type))]">{obj.label}</span>
      <span className="text-[9px] font-mono text-muted-foreground/50 ml-auto">{obj.type}</span>
    </div>
    <div className="flex flex-wrap gap-1">
      {obj.values.map((val, i) => (
        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary border border-border/50">
          {val}
        </span>
      ))}
    </div>
  </motion.div>
);

export default MemoryVisualizerPage;
