// Recursion tree data structures and generators

export type RecursionNode = {
  id: number;
  name: string;
  args: string;
  returnValue?: string;
  children: RecursionNode[];
  depth: number;
};

export type RecursionStep = {
  description: string;
  activeNodeId: number;
  phase: "call" | "return";
  tree: RecursionNode;
};

export type RecursionFunction = {
  id: string;
  name: string;
  description: string;
  defaultInput: string;
  generate: (input: string) => RecursionStep[];
};

let nodeIdCounter = 0;

function cloneTree(node: RecursionNode): RecursionNode {
  return {
    ...node,
    children: node.children.map(cloneTree),
  };
}

function findNode(node: RecursionNode, id: number): RecursionNode | null {
  if (node.id === id) return node;
  for (const child of node.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

// ─── Fibonacci ────────────────────────────────────

function fibonacciTree(input: string): RecursionStep[] {
  const n = parseInt(input.trim()) || 5;
  nodeIdCounter = 0;
  const steps: RecursionStep[] = [];

  function fib(val: number, parent: RecursionNode | null, root: RecursionNode | null): { result: number; node: RecursionNode } {
    const node: RecursionNode = { id: nodeIdCounter++, name: "fib", args: `${val}`, children: [], depth: parent ? parent.depth + 1 : 0 };
    if (parent) parent.children.push(node);
    const currentRoot = root || node;

    steps.push({
      description: `Calling fib(${val})`,
      activeNodeId: node.id,
      phase: "call",
      tree: cloneTree(currentRoot),
    });

    if (val <= 1) {
      node.returnValue = `${val}`;
      steps.push({
        description: `Base case: fib(${val}) returns ${val}`,
        activeNodeId: node.id,
        phase: "return",
        tree: cloneTree(currentRoot),
      });
      return { result: val, node };
    }

    const left = fib(val - 1, node, currentRoot);
    const right = fib(val - 2, node, currentRoot);
    const result = left.result + right.result;
    node.returnValue = `${result}`;

    steps.push({
      description: `fib(${val}) = fib(${val - 1}) + fib(${val - 2}) = ${left.result} + ${right.result} = ${result}`,
      activeNodeId: node.id,
      phase: "return",
      tree: cloneTree(currentRoot),
    });

    return { result, node };
  }

  fib(Math.min(n, 8), null, null); // Cap at 8 to keep it reasonable
  return steps;
}

// ─── Factorial ────────────────────────────────────

function factorialTree(input: string): RecursionStep[] {
  const n = parseInt(input.trim()) || 5;
  nodeIdCounter = 0;
  const steps: RecursionStep[] = [];

  function fact(val: number, parent: RecursionNode | null, root: RecursionNode | null): { result: number; node: RecursionNode } {
    const node: RecursionNode = { id: nodeIdCounter++, name: "fact", args: `${val}`, children: [], depth: parent ? parent.depth + 1 : 0 };
    if (parent) parent.children.push(node);
    const currentRoot = root || node;

    steps.push({
      description: `Calling fact(${val})`,
      activeNodeId: node.id,
      phase: "call",
      tree: cloneTree(currentRoot),
    });

    if (val <= 1) {
      node.returnValue = "1";
      steps.push({
        description: `Base case: fact(${val}) returns 1`,
        activeNodeId: node.id,
        phase: "return",
        tree: cloneTree(currentRoot),
      });
      return { result: 1, node };
    }

    const sub = fact(val - 1, node, currentRoot);
    const result = val * sub.result;
    node.returnValue = `${result}`;

    steps.push({
      description: `fact(${val}) = ${val} × fact(${val - 1}) = ${val} × ${sub.result} = ${result}`,
      activeNodeId: node.id,
      phase: "return",
      tree: cloneTree(currentRoot),
    });

    return { result, node };
  }

  fact(Math.min(n, 10), null, null);
  return steps;
}

// ─── Power ────────────────────────────────────────

function powerTree(input: string): RecursionStep[] {
  const parts = input.split(",").map(s => parseInt(s.trim()));
  const base = parts[0] || 2;
  const exp = Math.min(parts[1] || 4, 10);
  nodeIdCounter = 0;
  const steps: RecursionStep[] = [];

  function power(b: number, e: number, parent: RecursionNode | null, root: RecursionNode | null): { result: number; node: RecursionNode } {
    const node: RecursionNode = { id: nodeIdCounter++, name: "pow", args: `${b}, ${e}`, children: [], depth: parent ? parent.depth + 1 : 0 };
    if (parent) parent.children.push(node);
    const currentRoot = root || node;

    steps.push({
      description: `Calling pow(${b}, ${e})`,
      activeNodeId: node.id,
      phase: "call",
      tree: cloneTree(currentRoot),
    });

    if (e === 0) {
      node.returnValue = "1";
      steps.push({
        description: `Base case: pow(${b}, 0) returns 1`,
        activeNodeId: node.id,
        phase: "return",
        tree: cloneTree(currentRoot),
      });
      return { result: 1, node };
    }

    if (e % 2 === 0) {
      const half = power(b, e / 2, node, currentRoot);
      const result = half.result * half.result;
      node.returnValue = `${result}`;
      steps.push({
        description: `pow(${b}, ${e}) = pow(${b}, ${e / 2})² = ${half.result}² = ${result}`,
        activeNodeId: node.id,
        phase: "return",
        tree: cloneTree(currentRoot),
      });
      return { result, node };
    } else {
      const sub = power(b, e - 1, node, currentRoot);
      const result = b * sub.result;
      node.returnValue = `${result}`;
      steps.push({
        description: `pow(${b}, ${e}) = ${b} × pow(${b}, ${e - 1}) = ${b} × ${sub.result} = ${result}`,
        activeNodeId: node.id,
        phase: "return",
        tree: cloneTree(currentRoot),
      });
      return { result, node };
    }
  }

  power(base, exp, null, null);
  return steps;
}

// ─── Merge Sort Recursion ─────────────────────────

function mergeSortTree(input: string): RecursionStep[] {
  const arr = input.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
  nodeIdCounter = 0;
  const steps: RecursionStep[] = [];

  function msort(a: number[], parent: RecursionNode | null, root: RecursionNode | null): { sorted: number[]; node: RecursionNode } {
    const node: RecursionNode = { id: nodeIdCounter++, name: "sort", args: `[${a.join(",")}]`, children: [], depth: parent ? parent.depth + 1 : 0 };
    if (parent) parent.children.push(node);
    const currentRoot = root || node;

    steps.push({
      description: `Calling sort([${a.join(", ")}])`,
      activeNodeId: node.id,
      phase: "call",
      tree: cloneTree(currentRoot),
    });

    if (a.length <= 1) {
      node.returnValue = `[${a.join(",")}]`;
      steps.push({
        description: `Base case: [${a.join(", ")}] already sorted`,
        activeNodeId: node.id,
        phase: "return",
        tree: cloneTree(currentRoot),
      });
      return { sorted: a, node };
    }

    const mid = Math.floor(a.length / 2);
    const left = msort(a.slice(0, mid), node, currentRoot);
    const right = msort(a.slice(mid), node, currentRoot);

    // Merge
    const merged: number[] = [];
    let i = 0, j = 0;
    while (i < left.sorted.length && j < right.sorted.length) {
      if (left.sorted[i] <= right.sorted[j]) merged.push(left.sorted[i++]);
      else merged.push(right.sorted[j++]);
    }
    while (i < left.sorted.length) merged.push(left.sorted[i++]);
    while (j < right.sorted.length) merged.push(right.sorted[j++]);

    node.returnValue = `[${merged.join(",")}]`;
    steps.push({
      description: `Merged [${left.sorted.join(",")}] + [${right.sorted.join(",")}] → [${merged.join(",")}]`,
      activeNodeId: node.id,
      phase: "return",
      tree: cloneTree(currentRoot),
    });

    return { sorted: merged, node };
  }

  msort(arr.slice(0, 8), null, null);
  return steps;
}

export const recursionFunctions: RecursionFunction[] = [
  { id: "fibonacci", name: "Fibonacci", description: "Compute the nth Fibonacci number recursively", defaultInput: "5", generate: fibonacciTree },
  { id: "factorial", name: "Factorial", description: "Compute n! recursively", defaultInput: "5", generate: factorialTree },
  { id: "power", name: "Fast Power", description: "Compute base^exp using divide and conquer", defaultInput: "2, 8", generate: powerTree },
  { id: "merge-sort", name: "Merge Sort (Recursion)", description: "Visualize merge sort's divide and conquer tree", defaultInput: "38, 27, 43, 3, 9, 82", generate: mergeSortTree },
];
