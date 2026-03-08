import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, GitBranch, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import PlaybackControls from "@/components/algorithms/PlaybackControls";
import { recursionFunctions, RecursionStep, RecursionNode, RecursionFunction } from "@/lib/recursionTree";
import AlgorithmChat from "@/components/algorithms/AlgorithmChat";
import { AlgorithmInfo } from "@/lib/algorithms";

// Build a fake AlgorithmInfo for the chat context
function toAlgoInfo(fn: RecursionFunction): AlgorithmInfo {
  return {
    id: fn.id, name: fn.name, category: "sorting",
    timeComplexity: { best: "—", average: "—", worst: "—" },
    spaceComplexity: "—", description: fn.description, defaultInput: fn.defaultInput,
    generateSteps: () => [],
  };
}

const RecursionTreePage = () => {
  const [selectedFn, setSelectedFn] = useState(recursionFunctions[0]);
  const [input, setInput] = useState(recursionFunctions[0].defaultInput);
  const [steps, setSteps] = useState<RecursionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectFunction = (fn: RecursionFunction) => {
    setSelectedFn(fn);
    setInput(fn.defaultInput);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setDropdownOpen(false);
  };

  const run = () => {
    const s = selectedFn.generate(input);
    setSteps(s);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const stepForward = useCallback(() => setCurrentStep(p => Math.min(p + 1, steps.length - 1)), [steps.length]);
  const stepBackward = () => setCurrentStep(p => Math.max(p - 1, 0));
  const reset = () => { setCurrentStep(0); setIsPlaying(false); };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      timerRef.current = setTimeout(() => stepForward(), 800 / speed);
    } else if (currentStep >= steps.length - 1) setIsPlaying(false);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, currentStep, steps.length, speed, stepForward]);

  const currentData = steps[currentStep];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card/60 backdrop-blur-md px-4 md:px-6 py-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 mr-2">
          <GitBranch className="h-4 w-4 text-[hsl(var(--syntax-type))]" />
          <h1 className="font-display font-semibold text-sm tracking-tight hidden md:block">Recursion Tree</h1>
        </div>

        {/* Selector */}
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm font-display border border-border hover:border-foreground/20 transition-all">
            <span className="truncate">{selectedFn.name}</span>
            <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-xl overflow-hidden z-20 shadow-2xl min-w-[200px]">
                {recursionFunctions.map(fn => (
                  <button key={fn.id} onClick={() => selectFunction(fn)} className={`block w-full text-left px-4 py-2 text-sm font-display transition-colors ${fn.id === selectedFn.id ? "bg-foreground text-background" : "hover:bg-secondary"}`}>
                    {fn.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-32 bg-secondary rounded-lg px-3 py-1.5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 border border-border"
            placeholder="Input"
          />
          <Button size="sm" onClick={run} className="gap-2 rounded-lg font-display text-xs">
            <GitBranch className="h-3 w-3" /> Visualize
          </Button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 grid md:grid-cols-[1fr,300px] overflow-hidden">
        {/* Tree visualization */}
        <div className="flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-4">
            {currentData ? (
              <div className="space-y-4">
                <PlaybackControls isPlaying={isPlaying} currentStep={currentStep} totalSteps={steps.length} speed={speed} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onStepForward={stepForward} onStepBackward={stepBackward} onReset={reset} onSpeedChange={setSpeed} />
                <div className="rounded-xl border border-border bg-card/50 p-6 min-h-[300px] overflow-auto">
                  <TreeNodeViz node={currentData.tree} activeId={currentData.activeNodeId} />
                </div>
                <motion.div key={`desc-${currentStep}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-secondary/50 border border-border/30">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Info className="h-3 w-3 text-[hsl(var(--syntax-function))]" />
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">
                      Step {currentStep + 1} • {currentData.phase === "call" ? "📞 Call" : "↩️ Return"}
                    </span>
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
                    <GitBranch className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground font-display">Select a recursive function and click <span className="font-semibold text-foreground">Visualize</span></p>
                  <p className="text-xs text-muted-foreground/50 font-display">Watch the recursion tree grow and collapse</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step log */}
        <div className="flex flex-col overflow-hidden border-l border-border">
          <div className="px-4 py-2 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Call Log</span>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-0.5">
            {steps.map((step, i) => (
              <motion.button
                key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
                className={`w-full text-left p-2 rounded-lg text-[11px] font-display transition-colors ${
                  i === currentStep ? "bg-card border border-border text-foreground" : i < currentStep ? "text-muted-foreground/60 hover:bg-card/50" : "text-muted-foreground/30"
                }`}
              >
                <span className="font-mono text-[10px] text-muted-foreground/40 mr-1.5">{i + 1}.</span>
                <span className={step.phase === "return" ? "text-[hsl(var(--syntax-string))]" : ""}>{step.phase === "call" ? "📞" : "↩️"}</span>{" "}
                {step.description.slice(0, 60)}{step.description.length > 60 ? "..." : ""}
              </motion.button>
            ))}
            {steps.length === 0 && <p className="text-xs text-muted-foreground/40 font-mono text-center py-8">No steps yet</p>}
          </div>
        </div>
      </div>

      <AlgorithmChat algorithm={toAlgoInfo(selectedFn)} />
    </div>
  );
};

// ─── Tree Node Component ───────────────────────────

const TreeNodeViz = ({ node, activeId }: { node: RecursionNode; activeId: number }) => {
  const isActive = node.id === activeId;
  const hasReturn = node.returnValue !== undefined;
  const childCount = node.children.length;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`px-3 py-2 rounded-xl border text-center min-w-[80px] transition-all duration-200 ${
          isActive
            ? "bg-[hsl(var(--syntax-number))] text-background border-transparent shadow-lg shadow-[hsl(var(--syntax-number))/0.3]"
            : hasReturn
            ? "bg-[hsl(var(--syntax-string)/0.15)] border-[hsl(var(--syntax-string)/0.3)]"
            : "bg-secondary border-border"
        }`}
      >
        <div className="text-[11px] font-mono font-bold">{node.name}({node.args})</div>
        {hasReturn && (
          <div className={`text-[10px] font-mono mt-0.5 ${isActive ? "text-background/70" : "text-[hsl(var(--syntax-string))]"}`}>
            → {node.returnValue}
          </div>
        )}
      </motion.div>

      {childCount > 0 && (
        <div className="relative mt-1">
          <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-border" />

          <div className="pt-4 flex items-start justify-center">
            {node.children.map((child, i) => (
              <div key={child.id} className="relative flex flex-col items-center px-3 pt-4">
                {childCount > 1 && (
                  <div
                    className={`absolute top-0 h-px bg-border ${
                      i < childCount / 2 ? "left-1/2 right-0" : "left-0 right-1/2"
                    }`}
                  />
                )}
                <div className="absolute top-0 left-1/2 h-4 w-px -translate-x-1/2 bg-border" />
                <TreeNodeViz node={child} activeId={activeId} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecursionTreePage;
