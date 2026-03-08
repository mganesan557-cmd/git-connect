import { motion } from "framer-motion";
import { AlgorithmStep } from "@/lib/algorithms";

interface GraphVisualizerProps {
  step: AlgorithmStep;
}

const GraphVisualizer = ({ step }: GraphVisualizerProps) => {
  const nodes = step.nodes || [];
  const edges = step.edges || [];

  if (nodes.length === 0) return null;

  // Simple circular layout
  const cx = 150, cy = 120, r = 80;
  const positions = nodes.map((_, i) => ({
    x: cx + r * Math.cos((2 * Math.PI * i) / nodes.length - Math.PI / 2),
    y: cy + r * Math.sin((2 * Math.PI * i) / nodes.length - Math.PI / 2),
  }));

  const nodeMap = new Map(nodes.map((n, i) => [n.id, i]));

  return (
    <div className="flex justify-center py-4">
      <svg width="300" height="240" className="overflow-visible">
        {/* Edges */}
        {edges.map((edge, i) => {
          const fromIdx = nodeMap.get(edge.from);
          const toIdx = nodeMap.get(edge.to);
          if (fromIdx === undefined || toIdx === undefined) return null;
          return (
            <g key={`e-${i}`}>
              <line
                x1={positions[fromIdx].x}
                y1={positions[fromIdx].y}
                x2={positions[toIdx].x}
                y2={positions[toIdx].y}
                stroke={edge.highlighted ? "hsl(var(--syntax-function))" : "hsl(var(--muted-foreground) / 0.25)"}
                strokeWidth={edge.highlighted ? 2.5 : 1.5}
              />
              {edge.weight !== undefined && edge.weight !== 1 && (
                <text
                  x={(positions[fromIdx].x + positions[toIdx].x) / 2}
                  y={(positions[fromIdx].y + positions[toIdx].y) / 2 - 6}
                  className="text-[9px] font-mono"
                  fill="hsl(var(--muted-foreground))"
                  textAnchor="middle"
                >
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}
        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={`n-${node.id}`}>
            <motion.circle
              cx={positions[i].x}
              cy={positions[i].y}
              r={16}
              fill={
                node.current ? "hsl(var(--syntax-number))"
                : node.visited ? "hsl(var(--syntax-string) / 0.6)"
                : "hsl(var(--muted) / 0.8)"
              }
              stroke={node.current ? "hsl(var(--syntax-number))" : "hsl(var(--border))"}
              strokeWidth={1.5}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
            />
            <text
              x={positions[i].x}
              y={positions[i].y + 3.5}
              textAnchor="middle"
              className="text-[10px] font-mono font-bold"
              fill={node.current || node.visited ? "hsl(var(--background))" : "hsl(var(--foreground))"}
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default GraphVisualizer;
