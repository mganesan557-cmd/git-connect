import { motion } from "framer-motion";
import { AlgorithmStep } from "@/lib/algorithms";

interface ArrayBarsProps {
  step: AlgorithmStep;
  previousStep?: AlgorithmStep;
}

const ArrayBars = ({ step, previousStep }: ArrayBarsProps) => {
  const arr = step.array || [];
  if (arr.length === 0) return null;

  const maxVal = Math.max(...arr, 1);
  const prevArr = previousStep?.array || [];

  const getBarColor = (index: number) => {
    if (step.found?.includes(index)) return "bg-[hsl(var(--syntax-string))]";
    if (step.swapped?.includes(index)) return "bg-[hsl(var(--syntax-keyword))]";
    if (step.current?.includes(index)) return "bg-[hsl(var(--syntax-number))]";
    if (step.highlights?.includes(index)) return "bg-[hsl(var(--syntax-function))]";
    if (step.sorted?.includes(index)) return "bg-[hsl(var(--syntax-string))] opacity-60";
    return "bg-muted-foreground/30";
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <Legend color="bg-[hsl(var(--syntax-number))]" label="Current" />
        <Legend color="bg-[hsl(var(--syntax-keyword))]" label="Swapped" />
        <Legend color="bg-[hsl(var(--syntax-function))]" label="Compared" />
        <Legend color="bg-[hsl(var(--syntax-string))]" label="Found / Sorted" />
        <Legend color="bg-muted-foreground/40" label="Other" />
      </div>
      <div className="rounded-lg border border-border/60 bg-secondary/20 p-2">
        <div className="flex items-end gap-1 h-52 px-1">
      {arr.map((val, i) => {
        const heightPercent = (val / maxVal) * 100;
        const changed = prevArr[i] !== undefined && prevArr[i] !== val;
        return (
          <motion.div
            key={i}
            className="flex-1 flex flex-col items-center justify-end gap-1 min-w-0"
            layout
            transition={{ duration: 0.22 }}
          >
            <span className={`text-[9px] font-mono ${changed ? "text-foreground" : "text-muted-foreground"}`}>{val}</span>
            <motion.div
              className={`w-full rounded-t-md border border-background/20 transition-colors duration-200 ${getBarColor(i)} ${changed ? "ring-1 ring-[hsl(var(--syntax-number))]" : ""}`}
              style={{ height: `${Math.max(heightPercent, 4)}%` }}
              layout
              transition={{ duration: 0.22 }}
            />
            {step.pointers && Object.entries(step.pointers).map(([name, idx]) =>
              idx === i ? (
                <span key={name} className="text-[8px] font-mono text-[hsl(var(--syntax-type))] font-bold">{name}</span>
              ) : null
            )}
            <span className="text-[8px] font-mono text-muted-foreground/60">{i}</span>
          </motion.div>
        );
      })}
        </div>
      </div>
    </div>
  );
};

const Legend = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-1.5 rounded-md bg-secondary/40 border border-border/40 px-2 py-1">
    <span className={`inline-block h-2 w-2 rounded-sm ${color}`} />
    <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
  </div>
);

export default ArrayBars;
