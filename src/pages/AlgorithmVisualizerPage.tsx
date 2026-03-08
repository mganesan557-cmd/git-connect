import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Zap, Clock, HardDrive, Info, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { algorithmCatalog, categories, AlgorithmStep, AlgorithmInfo } from "@/lib/algorithms";
import ArrayBars from "@/components/algorithms/ArrayBars";
import GraphVisualizer from "@/components/algorithms/GraphVisualizer";
import DataStructureVisualizer from "@/components/algorithms/DataStructureVisualizer";
import PlaybackControls from "@/components/algorithms/PlaybackControls";
import AlgorithmChat from "@/components/algorithms/AlgorithmChat";

const AlgorithmVisualizerPage = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmInfo>(algorithmCatalog[0]);
  const [input, setInput] = useState(algorithmCatalog[0].defaultInput);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectAlgorithm = (algo: AlgorithmInfo) => {
    setSelectedAlgo(algo);
    setInput(algo.defaultInput);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setDropdownOpen(false);
  };

  const runVisualization = () => {
    const generatedSteps = selectedAlgo.generateSteps(input);
    setSteps(generatedSteps);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const saveSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to save sessions");
      return;
    }
    const { error } = await (supabase.from("saved_algorithm_sessions") as any).insert({
      user_id: user.id,
      algorithm_id: selectedAlgo.id,
      algorithm_name: selectedAlgo.name,
      input_data: input,
      steps_json: steps,
      title: `${selectedAlgo.name} - ${new Date().toLocaleDateString()}`,
    });
    if (error) {
      toast.error("Failed to save session");
    } else {
      toast.success("Session saved!");
    }
  };

  const stepForward = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const stepBackward = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      timerRef.current = setTimeout(() => stepForward(), 800 / speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, currentStep, steps.length, speed, stepForward]);

  const currentStepData = steps[currentStep];
  const previousStepData = currentStep > 0 ? steps[currentStep - 1] : undefined;
  const isGraphAlgo = selectedAlgo.category === "graph";
  const isDataStructure = selectedAlgo.category === "data-structure";
  const isArrayAlgo = selectedAlgo.category === "sorting" || selectedAlgo.category === "searching";

  const getRenderableStep = (index: number) => {
    if (!steps.length) return undefined;
    if (isArrayAlgo) {
      for (let i = index; i >= 0; i--) {
        if (steps[i]?.array && steps[i].array!.length > 0) return steps[i];
      }
    } else if (isGraphAlgo) {
      for (let i = index; i >= 0; i--) {
        if ((steps[i]?.nodes && steps[i].nodes!.length > 0) || (steps[i]?.edges && steps[i].edges!.length > 0)) return steps[i];
      }
    } else if (isDataStructure) {
      for (let i = index; i >= 0; i--) {
        if (steps[i]?.stack || steps[i]?.queue || steps[i]?.linkedList || steps[i]?.heap) return steps[i];
      }
    }
    return steps[index] ?? steps[0];
  };

  const renderStepData = getRenderableStep(currentStep);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card/60 backdrop-blur-md px-4 md:px-6 py-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 mr-2">
          <Zap className="h-4 w-4 text-[hsl(var(--syntax-number))]" />
          <h1 className="font-display font-semibold text-sm tracking-tight hidden md:block">Algorithm Visualizer</h1>
        </div>

        {/* Algorithm Selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm font-display border border-border hover:border-foreground/20 transition-all duration-200 max-w-[220px]"
          >
            <span className="truncate">{selectedAlgo.name}</span>
            <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-xl overflow-hidden z-20 shadow-2xl max-h-80 overflow-y-auto min-w-[240px]">
                {categories.map(cat => (
                  <div key={cat.id}>
                    <div className="px-3 py-1.5 text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.15em] bg-secondary/50">
                      {cat.label}
                    </div>
                    {algorithmCatalog.filter(a => a.category === cat.id).map(algo => (
                      <button
                        key={algo.id}
                        onClick={() => selectAlgorithm(algo)}
                        className={`block w-full text-left px-4 py-2 text-sm font-display transition-colors ${
                          algo.id === selectedAlgo.id ? "bg-foreground text-background" : "hover:bg-secondary"
                        }`}
                      >
                        {algo.name}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <Button size="sm" onClick={runVisualization} className="gap-2 rounded-lg font-display text-xs ml-auto">
          <Zap className="h-3 w-3" /> Visualize Algorithm
        </Button>
        {steps.length > 0 && (
          <Button size="sm" variant="outline" onClick={saveSession} className="gap-2 rounded-lg font-display text-xs">
            <Save className="h-3 w-3" /> Save
          </Button>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 grid md:grid-cols-[1fr,320px] overflow-hidden">
        {/* Left: Input + Visualization */}
        <div className="flex flex-col overflow-hidden border-r border-border">
          {/* Input panel */}
          <div className="border-b border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Input Data</span>
            </div>
            {isGraphAlgo ? (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-secondary rounded-lg px-3 py-2 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-foreground/20 h-20"
                placeholder="Enter edges: from to [weight] (one per line)"
                spellCheck={false}
              />
            ) : (
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-secondary rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                placeholder={selectedAlgo.category === "searching" ? "array values | target" : "Enter values separated by commas"}
                spellCheck={false}
              />
            )}
            <p className="text-[10px] text-muted-foreground/50 font-mono mt-1.5">{selectedAlgo.description}</p>
          </div>

          {/* Visualization area */}
          <div className="flex-1 overflow-auto p-4">
            {steps.length > 0 && currentStepData ? (
              <div className="space-y-4">
                {/* Playback controls */}
                <PlaybackControls
                  isPlaying={isPlaying}
                  currentStep={currentStep}
                  totalSteps={steps.length}
                  speed={speed}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onStepForward={stepForward}
                  onStepBackward={stepBackward}
                  onReset={reset}
                  onSpeedChange={setSpeed}
                />

                {/* Visualization */}
                <div className="rounded-xl border border-border bg-card/50 p-4 min-h-[200px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div key={currentStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                      {renderStepData ? (
                        <>
                          {isArrayAlgo && <ArrayBars step={renderStepData} previousStep={previousStepData} />}
                          {isGraphAlgo && <GraphVisualizer step={renderStepData} />}
                          {isDataStructure && <DataStructureVisualizer step={renderStepData} type={selectedAlgo.id} />}
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground/60 font-mono text-center py-8">No renderable data for this step yet.</p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="rounded-xl border border-border/50 bg-secondary/30 p-3">
                  <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">Timeline</p>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(0, steps.length - 1)}
                    step={1}
                    value={currentStep}
                    onChange={(e) => {
                      setCurrentStep(Number(e.target.value));
                      setIsPlaying(false);
                    }}
                    className="w-full h-1 accent-foreground"
                    disabled={steps.length <= 1}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
                    <span>Step 1</span>
                    <span>Step {steps.length}</span>
                  </div>
                </div>

                {/* Step description */}
                <motion.div
                  key={`desc-${currentStep}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-secondary/50 border border-border/30"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Info className="h-3 w-3 text-[hsl(var(--syntax-function))]" />
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Step {currentStep + 1}</span>
                  </div>
                  <p className="text-[13px] font-display text-foreground/90 leading-relaxed">{currentStepData.description}</p>
                </motion.div>

                {/* Progress bar */}
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-foreground rounded-full"
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mx-auto">
                    <Zap className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-display text-muted-foreground">
                      Select an algorithm and click <span className="font-semibold text-foreground">Visualize</span>
                    </p>
                    <p className="text-xs text-muted-foreground/50 font-display mt-1">Step-by-step animation with explanations</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Complexity + Step log */}
        <div className="flex flex-col overflow-hidden">
          {/* Complexity Panel */}
          <div className="border-b border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Complexity</span>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-1.5">
                <ComplexityBadge label="Best" value={selectedAlgo.timeComplexity.best} />
                <ComplexityBadge label="Average" value={selectedAlgo.timeComplexity.average} />
                <ComplexityBadge label="Worst" value={selectedAlgo.timeComplexity.worst} />
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-secondary">
                <HardDrive className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-mono text-muted-foreground">Space</span>
                <span className="text-[11px] font-mono font-semibold ml-auto">{selectedAlgo.spaceComplexity}</span>
              </div>
            </div>
          </div>

          {/* Step log */}
          <div className="flex-1 overflow-auto">
            <div className="px-4 py-2 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Step Log</span>
            </div>
            <div className="p-2 space-y-0.5">
              {steps.map((step, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
                  className={`w-full text-left p-2 rounded-lg text-[11px] font-display transition-colors ${
                    i === currentStep
                      ? "bg-card border border-border text-foreground"
                      : i < currentStep
                      ? "text-muted-foreground/60 hover:bg-card/50"
                      : "text-muted-foreground/30"
                  }`}
                >
                  <span className="font-mono text-[10px] text-muted-foreground/40 mr-1.5">{i + 1}.</span>
                  {step.description}
                </motion.button>
              ))}
              {steps.length === 0 && (
                <p className="text-xs text-muted-foreground/40 font-mono text-center py-8">No steps yet</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Floating AI Chat */}
      <AlgorithmChat algorithm={selectedAlgo} />
    </div>
  );
};

const ComplexityBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col items-center p-2 rounded-lg bg-secondary">
    <span className="text-[9px] font-mono text-muted-foreground/50 uppercase">{label}</span>
    <span className="text-[11px] font-mono font-bold">{value}</span>
  </div>
);

export default AlgorithmVisualizerPage;
