import { motion } from "framer-motion";
import SyntaxHighlighter from "./SyntaxHighlighter";

const demoCode = `x = 5\ny = 10\nsum = x + y\nprint(f"Sum: {sum}")`;

const steps = [
  { step: 1, line: 1, description: "Assign 5 to variable x", variables: { x: 5 } },
  { step: 2, line: 2, description: "Assign 10 to variable y", variables: { x: 5, y: 10 } },
  { step: 3, line: 3, description: "Calculate x + y → 15, assign to sum", variables: { x: 5, y: 10, sum: 15 } },
  { step: 4, line: 4, description: 'Print "Sum: 15"', variables: { x: 5, y: 10, sum: 15 } },
];

const DemoVisualizer = () => {
  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-border/50 px-5 py-2.5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-warning/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-success/50" />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/60 ml-3">demo.py</span>
      </div>
      <div className="grid md:grid-cols-2 divide-x divide-border/50">
        {/* Code Panel */}
        <div className="p-5">
          <h4 className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.15em] mb-3">Source</h4>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <SyntaxHighlighter code={demoCode} language="Python" />
          </motion.div>
        </div>

        {/* Steps Panel */}
        <div className="p-5">
          <h4 className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.15em] mb-3">Trace</h4>
          <div className="space-y-2.5">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.25 + 0.8 }}
                className="flex gap-2.5 items-start"
              >
                <div className="w-5 h-5 rounded-md bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-mono font-bold">{step.step}</span>
                </div>
                <div>
                  <p className="text-[13px] font-display text-foreground">{step.description}</p>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    {Object.entries(step.variables).map(([key, value]) => (
                      <span key={key} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                        {key}={value}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoVisualizer;
