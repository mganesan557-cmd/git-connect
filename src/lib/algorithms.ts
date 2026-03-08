// Algorithm step generators for all supported algorithms

export type AlgorithmCategory = "sorting" | "searching" | "graph" | "data-structure";

export type AlgorithmStep = {
  description: string;
  array?: number[];
  highlights?: number[];      // indices being compared
  swapped?: number[];         // indices being swapped
  sorted?: number[];          // indices confirmed sorted
  found?: number[];           // indices found/matched
  visited?: number[];         // nodes visited (graph/tree)
  current?: number[];         // current node/element
  stack?: number[];           // stack state
  queue?: number[];           // queue state
  nodes?: GraphNode[];        // graph/tree nodes
  edges?: GraphEdge[];        // graph/tree edges
  linkedList?: number[];      // linked list state
  heap?: number[];            // heap state
  pointers?: Record<string, number>; // named pointers (left, right, mid, etc.)
};

export type GraphNode = {
  id: number;
  label: string;
  visited?: boolean;
  current?: boolean;
  distance?: number;
};

export type GraphEdge = {
  from: number;
  to: number;
  weight?: number;
  highlighted?: boolean;
};

export type AlgorithmInfo = {
  id: string;
  name: string;
  category: AlgorithmCategory;
  timeComplexity: { best: string; average: string; worst: string };
  spaceComplexity: string;
  description: string;
  defaultInput: string;
  generateSteps: (input: string) => AlgorithmStep[];
};

// ─── Sorting Algorithms ────────────────────────────────────

function bubbleSort(input: string): AlgorithmStep[] {
  const arr = parseArray(input);
  const steps: AlgorithmStep[] = [];
  const sorted: number[] = [];
  const a = [...arr];
  steps.push({ description: `Starting Bubble Sort with array [${a.join(", ")}]`, array: [...a], highlights: [] });

  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      steps.push({ description: `Comparing elements at index ${j} (${a[j]}) and index ${j + 1} (${a[j + 1]})`, array: [...a], highlights: [j, j + 1], sorted: [...sorted] });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ description: `Swapping ${a[j + 1]} and ${a[j]} because ${a[j + 1]} > ${a[j]}`, array: [...a], swapped: [j, j + 1], sorted: [...sorted] });
      }
    }
    sorted.push(a.length - 1 - i);
  }
  sorted.push(0);
  steps.push({ description: `Bubble Sort complete! Array is now sorted: [${a.join(", ")}]`, array: [...a], sorted: [...sorted] });
  return steps;
}

function selectionSort(input: string): AlgorithmStep[] {
  const arr = parseArray(input);
  const steps: AlgorithmStep[] = [];
  const sorted: number[] = [];
  const a = [...arr];
  steps.push({ description: `Starting Selection Sort with array [${a.join(", ")}]`, array: [...a] });

  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    steps.push({ description: `Pass ${i + 1}: Finding minimum element starting from index ${i}`, array: [...a], current: [i], sorted: [...sorted] });
    for (let j = i + 1; j < a.length; j++) {
      steps.push({ description: `Comparing current minimum ${a[minIdx]} (index ${minIdx}) with ${a[j]} (index ${j})`, array: [...a], highlights: [minIdx, j], sorted: [...sorted] });
      if (a[j] < a[minIdx]) {
        minIdx = j;
        steps.push({ description: `New minimum found: ${a[minIdx]} at index ${minIdx}`, array: [...a], current: [minIdx], sorted: [...sorted] });
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({ description: `Swapping ${a[minIdx]} (index ${minIdx}) with ${a[i]} (index ${i})`, array: [...a], swapped: [i, minIdx], sorted: [...sorted] });
    }
    sorted.push(i);
  }
  sorted.push(a.length - 1);
  steps.push({ description: `Selection Sort complete! [${a.join(", ")}]`, array: [...a], sorted: [...sorted] });
  return steps;
}

function insertionSort(input: string): AlgorithmStep[] {
  const arr = parseArray(input);
  const steps: AlgorithmStep[] = [];
  const a = [...arr];
  const sorted: number[] = [0];
  steps.push({ description: `Starting Insertion Sort. First element ${a[0]} is already "sorted"`, array: [...a], sorted: [0] });

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    steps.push({ description: `Picking element ${key} at index ${i} to insert into sorted portion`, array: [...a], current: [i], sorted: [...sorted] });
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      steps.push({ description: `${a[j]} > ${key}, shifting ${a[j]} right`, array: [...a], highlights: [j, j + 1], sorted: [...sorted] });
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
    sorted.push(i);
    steps.push({ description: `Inserted ${key} at index ${j + 1}`, array: [...a], found: [j + 1], sorted: [...sorted] });
  }
  steps.push({ description: `Insertion Sort complete! [${a.join(", ")}]`, array: [...a], sorted: Array.from({ length: a.length }, (_, i) => i) });
  return steps;
}

function mergeSort(input: string): AlgorithmStep[] {
  const arr = parseArray(input);
  const steps: AlgorithmStep[] = [];
  const a = [...arr];
  steps.push({ description: `Starting Merge Sort with array [${a.join(", ")}]`, array: [...a] });

  function merge(arr: number[], l: number, m: number, r: number) {
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);
    steps.push({ description: `Merging subarrays [${left.join(",")}] and [${right.join(",")}]`, array: [...arr], highlights: Array.from({ length: r - l + 1 }, (_, i) => l + i) });
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        steps.push({ description: `Placing ${left[i]} (from left) at index ${k}`, array: [...arr], found: [k] });
        i++;
      } else {
        arr[k] = right[j];
        steps.push({ description: `Placing ${right[j]} (from right) at index ${k}`, array: [...arr], found: [k] });
        j++;
      }
      k++;
    }
    while (i < left.length) { arr[k] = left[i]; i++; k++; }
    while (j < right.length) { arr[k] = right[j]; j++; k++; }
    steps.push({ description: `Merged result: [${arr.slice(l, r + 1).join(",")}]`, array: [...arr], sorted: Array.from({ length: r - l + 1 }, (_, i) => l + i) });
  }

  function sort(arr: number[], l: number, r: number) {
    if (l < r) {
      const m = Math.floor((l + r) / 2);
      steps.push({ description: `Dividing [${arr.slice(l, r + 1).join(",")}] at midpoint index ${m}`, array: [...arr], current: [m] });
      sort(arr, l, m);
      sort(arr, m + 1, r);
      merge(arr, l, m, r);
    }
  }

  sort(a, 0, a.length - 1);
  steps.push({ description: `Merge Sort complete! [${a.join(", ")}]`, array: [...a], sorted: Array.from({ length: a.length }, (_, i) => i) });
  return steps;
}

function quickSort(input: string): AlgorithmStep[] {
  const arr = parseArray(input);
  const steps: AlgorithmStep[] = [];
  const a = [...arr];
  const sortedIndices: Set<number> = new Set();
  steps.push({ description: `Starting Quick Sort with array [${a.join(", ")}]`, array: [...a] });

  function partition(low: number, high: number): number {
    const pivot = a[high];
    steps.push({ description: `Choosing pivot: ${pivot} (index ${high})`, array: [...a], current: [high] });
    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({ description: `Comparing ${a[j]} with pivot ${pivot}`, array: [...a], highlights: [j, high], sorted: [...sortedIndices] });
      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        if (i !== j) steps.push({ description: `${a[j]} < ${pivot}, swapping elements at ${i} and ${j}`, array: [...a], swapped: [i, j], sorted: [...sortedIndices] });
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    steps.push({ description: `Placing pivot ${pivot} at its correct position ${i + 1}`, array: [...a], found: [i + 1], sorted: [...sortedIndices] });
    sortedIndices.add(i + 1);
    return i + 1;
  }

  function sort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    } else if (low === high) {
      sortedIndices.add(low);
    }
  }

  sort(0, a.length - 1);
  steps.push({ description: `Quick Sort complete! [${a.join(", ")}]`, array: [...a], sorted: Array.from({ length: a.length }, (_, i) => i) });
  return steps;
}

// ─── Searching Algorithms ───────────────────────────────────

function linearSearch(input: string): AlgorithmStep[] {
  const parts = input.split("|");
  const arr = parseArray(parts[0]);
  const target = parseInt(parts[1]?.trim() || "5");
  const steps: AlgorithmStep[] = [];
  steps.push({ description: `Linear Search: Looking for ${target} in [${arr.join(", ")}]`, array: [...arr] });

  for (let i = 0; i < arr.length; i++) {
    steps.push({ description: `Checking index ${i}: ${arr[i]} ${arr[i] === target ? "== " : "!= "}${target}`, array: [...arr], current: [i], pointers: { i } });
    if (arr[i] === target) {
      steps.push({ description: `Found ${target} at index ${i}!`, array: [...arr], found: [i] });
      return steps;
    }
  }
  steps.push({ description: `${target} not found in the array`, array: [...arr] });
  return steps;
}

function binarySearch(input: string): AlgorithmStep[] {
  const parts = input.split("|");
  const arr = parseArray(parts[0]).sort((a, b) => a - b);
  const target = parseInt(parts[1]?.trim() || "5");
  const steps: AlgorithmStep[] = [];
  steps.push({ description: `Binary Search: Looking for ${target} in sorted array [${arr.join(", ")}]`, array: [...arr] });

  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push({ description: `Checking midpoint index ${mid}: value ${arr[mid]}. Search range: [${left}..${right}]`, array: [...arr], current: [mid], highlights: [left, right], pointers: { left, mid, right } });

    if (arr[mid] === target) {
      steps.push({ description: `Found ${target} at index ${mid}!`, array: [...arr], found: [mid] });
      return steps;
    } else if (arr[mid] < target) {
      steps.push({ description: `${arr[mid]} < ${target}, searching right half`, array: [...arr], pointers: { left: mid + 1, right } });
      left = mid + 1;
    } else {
      steps.push({ description: `${arr[mid]} > ${target}, searching left half`, array: [...arr], pointers: { left, right: mid - 1 } });
      right = mid - 1;
    }
  }
  steps.push({ description: `${target} not found in the array`, array: [...arr] });
  return steps;
}

// ─── Graph Algorithms ───────────────────────────────────────

function parseGraph(input: string): { nodeCount: number; adjList: Map<number, { to: number; weight: number }[]> } {
  const lines = input.trim().split("\n").map(l => l.trim()).filter(Boolean);
  const adjList = new Map<number, { to: number; weight: number }[]>();
  const allNodes = new Set<number>();

  for (const line of lines) {
    const parts = line.split(/[\s,->]+/).map(Number).filter(n => !isNaN(n));
    if (parts.length >= 2) {
      const [from, to, weight = 1] = parts;
      allNodes.add(from);
      allNodes.add(to);
      if (!adjList.has(from)) adjList.set(from, []);
      adjList.get(from)!.push({ to, weight });
      if (!adjList.has(to)) adjList.set(to, []);
    }
  }
  return { nodeCount: allNodes.size, adjList };
}

function bfs(input: string): AlgorithmStep[] {
  const { adjList } = parseGraph(input);
  const steps: AlgorithmStep[] = [];
  const nodes = [...adjList.keys()].sort((a, b) => a - b);
  if (nodes.length === 0) return [{ description: "No valid graph input" }];

  const start = nodes[0];
  const visited = new Set<number>();
  const queue = [start];
  visited.add(start);

  const makeNodes = (cur?: number): GraphNode[] =>
    nodes.map(id => ({ id, label: String(id), visited: visited.has(id), current: id === cur }));
  const makeEdges = (highlighted?: [number, number]): GraphEdge[] => {
    const edges: GraphEdge[] = [];
    adjList.forEach((neighbors, from) => {
      neighbors.forEach(({ to, weight }) => {
        edges.push({ from, to, weight, highlighted: highlighted ? highlighted[0] === from && highlighted[1] === to : false });
      });
    });
    return edges;
  };

  steps.push({ description: `BFS starting from node ${start}`, nodes: makeNodes(start), edges: makeEdges(), queue: [...queue] });

  while (queue.length > 0) {
    const current = queue.shift()!;
    steps.push({ description: `Visiting node ${current}`, nodes: makeNodes(current), edges: makeEdges(), queue: [...queue], current: [current] });

    const neighbors = adjList.get(current) || [];
    for (const { to } of neighbors) {
      if (!visited.has(to)) {
        visited.add(to);
        queue.push(to);
        steps.push({ description: `Discovered node ${to} from node ${current}, adding to queue`, nodes: makeNodes(to), edges: makeEdges([current, to]), queue: [...queue] });
      }
    }
  }
  steps.push({ description: `BFS complete! Visited all reachable nodes`, nodes: makeNodes(), edges: makeEdges() });
  return steps;
}

function dfs(input: string): AlgorithmStep[] {
  const { adjList } = parseGraph(input);
  const steps: AlgorithmStep[] = [];
  const nodes = [...adjList.keys()].sort((a, b) => a - b);
  if (nodes.length === 0) return [{ description: "No valid graph input" }];

  const start = nodes[0];
  const visited = new Set<number>();
  const stackState: number[] = [start];

  const makeNodes = (cur?: number): GraphNode[] =>
    nodes.map(id => ({ id, label: String(id), visited: visited.has(id), current: id === cur }));
  const makeEdges = (highlighted?: [number, number]): GraphEdge[] => {
    const edges: GraphEdge[] = [];
    adjList.forEach((neighbors, from) => {
      neighbors.forEach(({ to, weight }) => {
        edges.push({ from, to, weight, highlighted: highlighted ? highlighted[0] === from && highlighted[1] === to : false });
      });
    });
    return edges;
  };

  steps.push({ description: `DFS starting from node ${start}`, nodes: makeNodes(start), edges: makeEdges(), stack: [...stackState] });

  function dfsRecurse(node: number) {
    visited.add(node);
    steps.push({ description: `Visiting node ${node}`, nodes: makeNodes(node), edges: makeEdges(), stack: [...stackState], current: [node] });

    const neighbors = adjList.get(node) || [];
    for (const { to } of neighbors) {
      if (!visited.has(to)) {
        stackState.push(to);
        steps.push({ description: `Going deeper: node ${node} → node ${to}`, nodes: makeNodes(to), edges: makeEdges([node, to]), stack: [...stackState] });
        dfsRecurse(to);
        stackState.pop();
        steps.push({ description: `Backtracking from node ${to} to node ${node}`, nodes: makeNodes(node), edges: makeEdges(), stack: [...stackState] });
      }
    }
  }

  dfsRecurse(start);
  steps.push({ description: `DFS complete! Visited all reachable nodes`, nodes: makeNodes(), edges: makeEdges() });
  return steps;
}

function dijkstra(input: string): AlgorithmStep[] {
  const { adjList } = parseGraph(input);
  const steps: AlgorithmStep[] = [];
  const nodes = [...adjList.keys()].sort((a, b) => a - b);
  if (nodes.length === 0) return [{ description: "No valid graph input" }];

  const start = nodes[0];
  const dist = new Map<number, number>();
  const visited = new Set<number>();
  nodes.forEach(n => dist.set(n, n === start ? 0 : Infinity));

  const makeNodes = (cur?: number): GraphNode[] =>
    nodes.map(id => ({ id, label: `${id}(${dist.get(id) === Infinity ? "∞" : dist.get(id)})`, visited: visited.has(id), current: id === cur, distance: dist.get(id) }));
  const makeEdges = (highlighted?: [number, number]): GraphEdge[] => {
    const edges: GraphEdge[] = [];
    adjList.forEach((neighbors, from) => {
      neighbors.forEach(({ to, weight }) => {
        edges.push({ from, to, weight, highlighted: highlighted ? highlighted[0] === from && highlighted[1] === to : false });
      });
    });
    return edges;
  };

  steps.push({ description: `Dijkstra starting from node ${start}. All distances set to ∞ except source (0)`, nodes: makeNodes(start), edges: makeEdges() });

  for (let iter = 0; iter < nodes.length; iter++) {
    let u = -1;
    let minDist = Infinity;
    for (const n of nodes) {
      if (!visited.has(n) && (dist.get(n) ?? Infinity) < minDist) {
        minDist = dist.get(n)!;
        u = n;
      }
    }
    if (u === -1) break;

    visited.add(u);
    steps.push({ description: `Selecting node ${u} with shortest distance ${dist.get(u)}`, nodes: makeNodes(u), edges: makeEdges() });

    const neighbors = adjList.get(u) || [];
    for (const { to, weight } of neighbors) {
      if (!visited.has(to)) {
        const newDist = dist.get(u)! + weight;
        if (newDist < (dist.get(to) ?? Infinity)) {
          dist.set(to, newDist);
          steps.push({ description: `Updated distance to node ${to}: ${newDist} (via node ${u}, edge weight ${weight})`, nodes: makeNodes(to), edges: makeEdges([u, to]) });
        }
      }
    }
  }

  steps.push({ description: `Dijkstra complete! Final distances: ${nodes.map(n => `${n}=${dist.get(n)}`).join(", ")}`, nodes: makeNodes(), edges: makeEdges() });
  return steps;
}

// ─── Data Structures ────────────────────────────────────────

function stackOps(input: string): AlgorithmStep[] {
  const ops = input.split(",").map(s => s.trim());
  const steps: AlgorithmStep[] = [];
  const stack: number[] = [];
  steps.push({ description: "Empty stack initialized", stack: [] });

  for (const op of ops) {
    if (op.toLowerCase() === "pop") {
      if (stack.length > 0) {
        const val = stack.pop()!;
        steps.push({ description: `Pop: Removed ${val} from top of stack`, stack: [...stack], current: [] });
      } else {
        steps.push({ description: "Pop: Stack is empty! Cannot pop", stack: [] });
      }
    } else {
      const num = parseInt(op);
      if (!isNaN(num)) {
        stack.push(num);
        steps.push({ description: `Push: Added ${num} to top of stack`, stack: [...stack], current: [stack.length - 1] });
      }
    }
  }
  steps.push({ description: `Final stack state: [${stack.join(", ")}] (top is rightmost)`, stack: [...stack] });
  return steps;
}

function queueOps(input: string): AlgorithmStep[] {
  const ops = input.split(",").map(s => s.trim());
  const steps: AlgorithmStep[] = [];
  const queue: number[] = [];
  steps.push({ description: "Empty queue initialized", queue: [] });

  for (const op of ops) {
    if (op.toLowerCase().startsWith("deq")) {
      if (queue.length > 0) {
        const val = queue.shift()!;
        steps.push({ description: `Dequeue: Removed ${val} from front of queue`, queue: [...queue] });
      } else {
        steps.push({ description: "Dequeue: Queue is empty!", queue: [] });
      }
    } else {
      const num = parseInt(op);
      if (!isNaN(num)) {
        queue.push(num);
        steps.push({ description: `Enqueue: Added ${num} to back of queue`, queue: [...queue], current: [queue.length - 1] });
      }
    }
  }
  steps.push({ description: `Final queue: [${queue.join(", ")}] (front is leftmost)`, queue: [...queue] });
  return steps;
}

function linkedListOps(input: string): AlgorithmStep[] {
  const ops = input.split(",").map(s => s.trim());
  const steps: AlgorithmStep[] = [];
  const list: number[] = [];
  steps.push({ description: "Empty linked list initialized", linkedList: [] });

  for (const op of ops) {
    if (op.toLowerCase().startsWith("del")) {
      if (list.length > 0) {
        const val = list.pop()!;
        steps.push({ description: `Removed ${val} from end of linked list`, linkedList: [...list] });
      }
    } else {
      const num = parseInt(op);
      if (!isNaN(num)) {
        list.push(num);
        steps.push({ description: `Appended ${num} to linked list`, linkedList: [...list], current: [list.length - 1] });
      }
    }
  }
  steps.push({ description: `Final linked list: ${list.map(v => `[${v}]`).join(" → ")} → null`, linkedList: [...list] });
  return steps;
}

function binaryTreeInsert(input: string): AlgorithmStep[] {
  const arr = parseArray(input);
  const steps: AlgorithmStep[] = [];
  const tree: (number | null)[] = [];

  function insert(val: number) {
    if (tree.length === 0) {
      tree.push(val);
      steps.push({ description: `Inserting ${val} as root`, heap: [...tree.filter(v => v !== null) as number[]], current: [0] });
      return;
    }
    let i = 0;
    while (i < tree.length) {
      if (tree[i] === null) break;
      steps.push({ description: `Comparing ${val} with node ${tree[i]} at position ${i}`, heap: [...tree.filter(v => v !== null) as number[]], current: [i] });
      if (val < tree[i]!) {
        i = 2 * i + 1;
      } else {
        i = 2 * i + 2;
      }
    }
    while (tree.length <= i) tree.push(null);
    tree[i] = val;
    steps.push({ description: `Inserted ${val} at position ${i}`, heap: tree.filter(v => v !== null) as number[], found: [i] });
  }

  steps.push({ description: `Building BST from values [${arr.join(", ")}]`, heap: [] });
  for (const val of arr) insert(val);
  steps.push({ description: `BST construction complete with ${arr.length} nodes`, heap: tree.filter(v => v !== null) as number[] });
  return steps;
}

function heapOps(input: string): AlgorithmStep[] {
  const arr = parseArray(input);
  const steps: AlgorithmStep[] = [];
  const heap: number[] = [];

  function siftUp(i: number) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (heap[parent] > heap[i]) {
        steps.push({ description: `Sifting up: ${heap[i]} < parent ${heap[parent]}, swapping`, heap: [...heap], highlights: [i, parent] });
        [heap[parent], heap[i]] = [heap[i], heap[parent]];
        i = parent;
      } else break;
    }
  }

  steps.push({ description: `Building min-heap from [${arr.join(", ")}]`, heap: [] });
  for (const val of arr) {
    heap.push(val);
    steps.push({ description: `Inserted ${val} into heap`, heap: [...heap], current: [heap.length - 1] });
    siftUp(heap.length - 1);
    steps.push({ description: `Heap after insertion: [${heap.join(", ")}]`, heap: [...heap] });
  }
  steps.push({ description: `Min-heap construction complete: [${heap.join(", ")}]`, heap: [...heap], sorted: Array.from({ length: heap.length }, (_, i) => i) });
  return steps;
}

// ─── Helpers ────────────────────────────────────────────────

function parseArray(input: string): number[] {
  return input.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
}

// ─── Algorithm Catalog ─────────────────────────────────────

export const algorithmCatalog: AlgorithmInfo[] = [
  // Sorting
  { id: "bubble-sort", name: "Bubble Sort", category: "sorting", timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" }, spaceComplexity: "O(1)", description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.", defaultInput: "64, 34, 25, 12, 22, 11, 90", generateSteps: bubbleSort },
  { id: "selection-sort", name: "Selection Sort", category: "sorting", timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" }, spaceComplexity: "O(1)", description: "Finds the minimum element and places it at the beginning, repeating for each position.", defaultInput: "64, 25, 12, 22, 11", generateSteps: selectionSort },
  { id: "insertion-sort", name: "Insertion Sort", category: "sorting", timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" }, spaceComplexity: "O(1)", description: "Builds the sorted array one item at a time by inserting each element into its correct position.", defaultInput: "12, 11, 13, 5, 6", generateSteps: insertionSort },
  { id: "merge-sort", name: "Merge Sort", category: "sorting", timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" }, spaceComplexity: "O(n)", description: "Divides the array in half, sorts each half, then merges them back together.", defaultInput: "38, 27, 43, 3, 9, 82, 10", generateSteps: mergeSort },
  { id: "quick-sort", name: "Quick Sort", category: "sorting", timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" }, spaceComplexity: "O(log n)", description: "Picks a pivot, partitions elements around it, and recursively sorts the partitions.", defaultInput: "10, 80, 30, 90, 40, 50, 70", generateSteps: quickSort },
  // Searching
  { id: "linear-search", name: "Linear Search", category: "searching", timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" }, spaceComplexity: "O(1)", description: "Checks each element sequentially until the target is found or the list ends.", defaultInput: "4, 2, 7, 1, 9, 3 | 7", generateSteps: linearSearch },
  { id: "binary-search", name: "Binary Search", category: "searching", timeComplexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" }, spaceComplexity: "O(1)", description: "Efficiently searches a sorted array by repeatedly dividing the search interval in half.", defaultInput: "2, 5, 8, 12, 16, 23, 38, 56, 72, 91 | 23", generateSteps: binarySearch },
  // Graph
  { id: "bfs", name: "Breadth-First Search", category: "graph", timeComplexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" }, spaceComplexity: "O(V)", description: "Explores all neighbors at the present depth before moving to nodes at the next depth level.", defaultInput: "0 1\n0 2\n1 3\n2 4\n3 5\n4 5", generateSteps: bfs },
  { id: "dfs", name: "Depth-First Search", category: "graph", timeComplexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" }, spaceComplexity: "O(V)", description: "Explores as far as possible along each branch before backtracking.", defaultInput: "0 1\n0 2\n1 3\n2 4\n3 5\n4 5", generateSteps: dfs },
  { id: "dijkstra", name: "Dijkstra's Shortest Path", category: "graph", timeComplexity: { best: "O(V²)", average: "O(V²)", worst: "O(V²)" }, spaceComplexity: "O(V)", description: "Finds the shortest path from source to all vertices in a weighted graph.", defaultInput: "0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5", generateSteps: dijkstra },
  // Data Structures
  { id: "stack", name: "Stack", category: "data-structure", timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" }, spaceComplexity: "O(n)", description: "Last-In-First-Out (LIFO) data structure. Push adds to top, Pop removes from top.", defaultInput: "5, 3, 8, pop, 1, pop, 7", generateSteps: stackOps },
  { id: "queue", name: "Queue", category: "data-structure", timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" }, spaceComplexity: "O(n)", description: "First-In-First-Out (FIFO) data structure. Enqueue adds to back, Dequeue removes from front.", defaultInput: "5, 3, 8, deq, 1, deq, 7", generateSteps: queueOps },
  { id: "linked-list", name: "Linked List", category: "data-structure", timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" }, spaceComplexity: "O(n)", description: "Linear data structure where elements are linked using pointers.", defaultInput: "10, 20, 30, del, 40, 50", generateSteps: linkedListOps },
  { id: "binary-tree", name: "Binary Search Tree", category: "data-structure", timeComplexity: { best: "O(log n)", average: "O(log n)", worst: "O(n)" }, spaceComplexity: "O(n)", description: "Tree where each node has at most two children, with left < parent < right.", defaultInput: "50, 30, 70, 20, 40, 60, 80", generateSteps: binaryTreeInsert },
  { id: "heap", name: "Min Heap", category: "data-structure", timeComplexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" }, spaceComplexity: "O(n)", description: "Complete binary tree where parent is smaller than children. Used in priority queues.", defaultInput: "35, 33, 42, 10, 14, 19, 27, 44", generateSteps: heapOps },
];

export const categories = [
  { id: "sorting", label: "Sorting Algorithms" },
  { id: "searching", label: "Searching Algorithms" },
  { id: "graph", label: "Graph Algorithms" },
  { id: "data-structure", label: "Data Structures" },
] as const;
