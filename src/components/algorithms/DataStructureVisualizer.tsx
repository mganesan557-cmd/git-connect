import { motion } from "framer-motion";
import { AlgorithmStep } from "@/lib/algorithms";
import { ArrowRight } from "lucide-react";

interface DataStructureVisualizerProps {
  step: AlgorithmStep;
  type: string;
}

const DataStructureVisualizer = ({ step, type }: DataStructureVisualizerProps) => {
  // Stack visualization
  if (step.stack !== undefined) {
    return (
      <div className="flex flex-col items-center gap-1 py-4">
        <span className="text-[10px] font-mono text-muted-foreground/50 mb-2 uppercase tracking-widest">Stack (top ↑)</span>
        {step.stack.length === 0 ? (
          <div className="text-xs text-muted-foreground/40 font-mono py-6">empty</div>
        ) : (
          [...step.stack].reverse().map((val, i) => (
            <motion.div
              key={`${i}-${val}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`px-8 py-2 rounded-md border text-sm font-mono font-semibold text-center min-w-[80px] ${
                i === 0 ? "bg-[hsl(var(--syntax-number))] text-background border-transparent" : "bg-secondary border-border"
              }`}
            >
              {val}
            </motion.div>
          ))
        )}
      </div>
    );
  }

  // Queue visualization
  if (step.queue !== undefined) {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">Queue (front → back)</span>
        <div className="flex items-center gap-1">
          {step.queue.length === 0 ? (
            <div className="text-xs text-muted-foreground/40 font-mono py-6">empty</div>
          ) : (
            step.queue.map((val, i) => (
              <motion.div
                key={`${i}-${val}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`px-4 py-2 rounded-md border text-sm font-mono font-semibold ${
                  i === 0 ? "bg-[hsl(var(--syntax-function))] text-background border-transparent" : "bg-secondary border-border"
                }`}
              >
                {val}
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Linked List visualization
  if (step.linkedList !== undefined) {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">Linked List</span>
        <div className="flex items-center gap-0.5 flex-wrap justify-center">
          {step.linkedList.length === 0 ? (
            <div className="text-xs text-muted-foreground/40 font-mono py-6">empty</div>
          ) : (
            step.linkedList.map((val, i) => (
              <div key={i} className="flex items-center gap-0.5">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`px-3 py-2 rounded-md border text-sm font-mono font-semibold ${
                    step.current?.includes(i)
                      ? "bg-[hsl(var(--syntax-string))] text-background border-transparent"
                      : "bg-secondary border-border"
                  }`}
                >
                  {val}
                </motion.div>
                {i < step.linkedList!.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground/40" />}
              </div>
            ))
          )}
          <ArrowRight className="h-3 w-3 text-muted-foreground/40" />
          <span className="text-[10px] font-mono text-muted-foreground/40">null</span>
        </div>
      </div>
    );
  }

  // Tree/Heap visualization (array representation as level-order)
  if (step.heap !== undefined) {
    const heap = step.heap;
    if (heap.length === 0) return <div className="text-xs text-muted-foreground/40 font-mono py-8 text-center">empty</div>;

    // Calculate levels
    const levels: number[][] = [];
    let start = 0;
    let levelSize = 1;
    while (start < heap.length) {
      levels.push(heap.slice(start, start + levelSize));
      start += levelSize;
      levelSize *= 2;
    }

    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">
          {type === "heap" ? "Heap" : "Binary Tree"}
        </span>
        {levels.map((level, li) => (
          <div key={li} className="flex items-center justify-center gap-2">
            {level.map((val, vi) => {
              const globalIdx = (1 << li) - 1 + vi;
              return (
                <motion.div
                  key={`${li}-${vi}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: globalIdx * 0.05 }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono font-bold border ${
                    step.current?.includes(globalIdx)
                      ? "bg-[hsl(var(--syntax-number))] text-background border-transparent"
                      : step.found?.includes(globalIdx)
                      ? "bg-[hsl(var(--syntax-string))] text-background border-transparent"
                      : "bg-secondary border-border"
                  }`}
                >
                  {val}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default DataStructureVisualizer;
