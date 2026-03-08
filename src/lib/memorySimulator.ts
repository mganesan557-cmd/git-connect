// Memory stack and heap simulation

export type StackFrame = {
  functionName: string;
  variables: { name: string; value: string; heapRef?: string }[];
  active?: boolean;
};

export type HeapObject = {
  id: string;
  type: string;
  label: string;
  values: string[];
};

export type MemoryStep = {
  description: string;
  stack: StackFrame[];
  heap: HeapObject[];
  highlightStack?: number; // index of highlighted frame
  highlightHeap?: string; // id of highlighted heap object
};

export type MemoryProgram = {
  id: string;
  name: string;
  language: string;
  description: string;
  generate: () => MemoryStep[];
};

// ─── Array Creation ──────────────────────────────

function arrayProgram(): MemoryStep[] {
  const steps: MemoryStep[] = [];

  steps.push({
    description: "Program starts — main() frame created on the stack",
    stack: [{ functionName: "main()", variables: [], active: true }],
    heap: [],
    highlightStack: 0,
  });

  steps.push({
    description: "int x = 10 — local variable x stored on stack",
    stack: [{ functionName: "main()", variables: [{ name: "x", value: "10" }], active: true }],
    heap: [],
    highlightStack: 0,
  });

  steps.push({
    description: "arr = [3, 7, 1, 9] — array allocated on heap, reference stored on stack",
    stack: [{ functionName: "main()", variables: [{ name: "x", value: "10" }, { name: "arr", value: "→ heap@1", heapRef: "h1" }], active: true }],
    heap: [{ id: "h1", type: "Array", label: "int[]", values: ["3", "7", "1", "9"] }],
    highlightStack: 0,
    highlightHeap: "h1",
  });

  steps.push({
    description: "arr[2] = 5 — updating heap object at index 2",
    stack: [{ functionName: "main()", variables: [{ name: "x", value: "10" }, { name: "arr", value: "→ heap@1", heapRef: "h1" }], active: true }],
    heap: [{ id: "h1", type: "Array", label: "int[]", values: ["3", "7", "5", "9"] }],
    highlightHeap: "h1",
  });

  steps.push({
    description: "Calling sum(arr) — new stack frame pushed",
    stack: [
      { functionName: "main()", variables: [{ name: "x", value: "10" }, { name: "arr", value: "→ heap@1", heapRef: "h1" }] },
      { functionName: "sum(arr)", variables: [{ name: "arr", value: "→ heap@1", heapRef: "h1" }, { name: "total", value: "0" }], active: true },
    ],
    heap: [{ id: "h1", type: "Array", label: "int[]", values: ["3", "7", "5", "9"] }],
    highlightStack: 1,
  });

  steps.push({
    description: "Iterating over arr — total accumulates: 3 + 7 + 5 + 9 = 24",
    stack: [
      { functionName: "main()", variables: [{ name: "x", value: "10" }, { name: "arr", value: "→ heap@1", heapRef: "h1" }] },
      { functionName: "sum(arr)", variables: [{ name: "arr", value: "→ heap@1", heapRef: "h1" }, { name: "total", value: "24" }], active: true },
    ],
    heap: [{ id: "h1", type: "Array", label: "int[]", values: ["3", "7", "5", "9"] }],
    highlightStack: 1,
  });

  steps.push({
    description: "sum() returns 24 — frame popped from stack",
    stack: [{ functionName: "main()", variables: [{ name: "x", value: "10" }, { name: "arr", value: "→ heap@1", heapRef: "h1" }, { name: "result", value: "24" }], active: true }],
    heap: [{ id: "h1", type: "Array", label: "int[]", values: ["3", "7", "5", "9"] }],
    highlightStack: 0,
  });

  steps.push({
    description: "Program ends — all memory freed",
    stack: [],
    heap: [],
  });

  return steps;
}

// ─── Object References ───────────────────────────

function objectRefsProgram(): MemoryStep[] {
  const steps: MemoryStep[] = [];

  steps.push({
    description: "main() starts",
    stack: [{ functionName: "main()", variables: [], active: true }],
    heap: [],
    highlightStack: 0,
  });

  steps.push({
    description: "person = {name: 'Alice', age: 25} — object allocated on heap",
    stack: [{ functionName: "main()", variables: [{ name: "person", value: "→ heap@1", heapRef: "h1" }], active: true }],
    heap: [{ id: "h1", type: "Object", label: "Person", values: ["name: 'Alice'", "age: 25"] }],
    highlightStack: 0,
    highlightHeap: "h1",
  });

  steps.push({
    description: "scores = [95, 87, 92] — array on heap, referenced by person.scores",
    stack: [{ functionName: "main()", variables: [{ name: "person", value: "→ heap@1", heapRef: "h1" }], active: true }],
    heap: [
      { id: "h1", type: "Object", label: "Person", values: ["name: 'Alice'", "age: 25", "scores: → heap@2"] },
      { id: "h2", type: "Array", label: "int[]", values: ["95", "87", "92"] },
    ],
    highlightHeap: "h2",
  });

  steps.push({
    description: "alias = person — alias references the SAME object (not a copy)",
    stack: [{ functionName: "main()", variables: [{ name: "person", value: "→ heap@1", heapRef: "h1" }, { name: "alias", value: "→ heap@1", heapRef: "h1" }], active: true }],
    heap: [
      { id: "h1", type: "Object", label: "Person", values: ["name: 'Alice'", "age: 25", "scores: → heap@2"] },
      { id: "h2", type: "Array", label: "int[]", values: ["95", "87", "92"] },
    ],
    highlightStack: 0,
  });

  steps.push({
    description: "alias.age = 26 — modifying through alias changes the original object",
    stack: [{ functionName: "main()", variables: [{ name: "person", value: "→ heap@1", heapRef: "h1" }, { name: "alias", value: "→ heap@1", heapRef: "h1" }], active: true }],
    heap: [
      { id: "h1", type: "Object", label: "Person", values: ["name: 'Alice'", "age: 26", "scores: → heap@2"] },
      { id: "h2", type: "Array", label: "int[]", values: ["95", "87", "92"] },
    ],
    highlightHeap: "h1",
  });

  steps.push({
    description: "Calling birthday(person) — new frame, same reference",
    stack: [
      { functionName: "main()", variables: [{ name: "person", value: "→ heap@1", heapRef: "h1" }, { name: "alias", value: "→ heap@1", heapRef: "h1" }] },
      { functionName: "birthday(p)", variables: [{ name: "p", value: "→ heap@1", heapRef: "h1" }], active: true },
    ],
    heap: [
      { id: "h1", type: "Object", label: "Person", values: ["name: 'Alice'", "age: 26", "scores: → heap@2"] },
      { id: "h2", type: "Array", label: "int[]", values: ["95", "87", "92"] },
    ],
    highlightStack: 1,
  });

  steps.push({
    description: "p.age += 1 — age becomes 27, visible in main() too",
    stack: [
      { functionName: "main()", variables: [{ name: "person", value: "→ heap@1", heapRef: "h1" }, { name: "alias", value: "→ heap@1", heapRef: "h1" }] },
      { functionName: "birthday(p)", variables: [{ name: "p", value: "→ heap@1", heapRef: "h1" }], active: true },
    ],
    heap: [
      { id: "h1", type: "Object", label: "Person", values: ["name: 'Alice'", "age: 27", "scores: → heap@2"] },
      { id: "h2", type: "Array", label: "int[]", values: ["95", "87", "92"] },
    ],
    highlightHeap: "h1",
  });

  steps.push({
    description: "birthday() returns — frame popped, person.age is 27",
    stack: [{ functionName: "main()", variables: [{ name: "person", value: "→ heap@1", heapRef: "h1" }, { name: "alias", value: "→ heap@1", heapRef: "h1" }], active: true }],
    heap: [
      { id: "h1", type: "Object", label: "Person", values: ["name: 'Alice'", "age: 27", "scores: → heap@2"] },
      { id: "h2", type: "Array", label: "int[]", values: ["95", "87", "92"] },
    ],
    highlightStack: 0,
  });

  return steps;
}

// ─── Recursive Stack ─────────────────────────────

function recursiveStackProgram(): MemoryStep[] {
  const steps: MemoryStep[] = [];
  const n = 5;

  steps.push({
    description: "Calling factorial(5) — building up stack frames recursively",
    stack: [{ functionName: "main()", variables: [{ name: "n", value: "5" }], active: true }],
    heap: [],
    highlightStack: 0,
  });

  // Build up
  const frames: StackFrame[] = [{ functionName: "main()", variables: [{ name: "n", value: "5" }] }];
  for (let i = n; i >= 1; i--) {
    frames.push({ functionName: `fact(${i})`, variables: [{ name: "n", value: `${i}` }], active: true });
    if (frames.length > 1) frames[frames.length - 2].active = false;
    steps.push({
      description: i > 1 ? `fact(${i}) calls fact(${i - 1}) — new frame pushed` : `fact(1) — base case reached`,
      stack: frames.map(f => ({ ...f })),
      heap: [],
      highlightStack: frames.length - 1,
    });
  }

  // Unwind
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
    frames.pop();
    if (frames.length > 0) {
      frames[frames.length - 1].active = true;
      if (frames[frames.length - 1].functionName.startsWith("fact")) {
        frames[frames.length - 1].variables.push({ name: "return", value: `${result}` });
      }
    }
    steps.push({
      description: `fact(${i}) returns ${result} — frame popped`,
      stack: frames.map(f => ({ ...f })),
      heap: [],
      highlightStack: frames.length - 1,
    });
  }

  // Final
  frames[0].variables.push({ name: "result", value: `${result}` });
  steps.push({
    description: `main() receives ${result} — complete`,
    stack: frames.map(f => ({ ...f })),
    heap: [],
    highlightStack: 0,
  });

  return steps;
}

export const memoryPrograms: MemoryProgram[] = [
  { id: "arrays", name: "Arrays & Function Calls", language: "Pseudo", description: "See how arrays live on the heap while local variables live on the stack", generate: arrayProgram },
  { id: "objects", name: "Object References", language: "Pseudo", description: "Understand how references work — aliasing, pass-by-reference, and mutations", generate: objectRefsProgram },
  { id: "recursive-stack", name: "Recursive Call Stack", language: "Pseudo", description: "Watch the stack grow and shrink during factorial(5) recursion", generate: recursiveStackProgram },
];
