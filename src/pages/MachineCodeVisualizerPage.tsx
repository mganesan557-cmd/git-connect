import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Cpu, Info, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlaybackControls from "@/components/algorithms/PlaybackControls";

type RegisterName = "R1" | "R2" | "R3" | "R4";
type Opcode = "MOV" | "LOAD" | "STORE" | "ADD" | "SUB" | "MUL" | "DIV";
type Stage = "Idle" | "Fetch" | "Decode" | "Execute";
type Operand = { kind: "imm"; value: number } | { kind: "var"; name: string } | { kind: "reg"; name: RegisterName };
type Instruction = { id: number; sourceLine: number; asm: string; op: Opcode; a: Operand; b?: Operand; explain: string };
type GateState = { enabled: boolean; aBit: number; bBit: number; xorOut: number; andOut: number; orOut: number; sumBit: number; carryBit: number; aBits: string; bBits: string };
type Snapshot = {
  pc: number;
  stage: Stage;
  registers: Record<RegisterName, number>;
  memory: Record<string, number>;
  alu: string;
  beginnerText: string;
  microOps: string[];
  signalBits: string;
  gate: GateState;
  transistors: boolean[];
};

const DEFAULT_CODE = `a = 5
b = 3
c = a + b`;
const OPCODE_BITS: Record<Opcode, string> = { MOV: "0001", LOAD: "0010", STORE: "0011", ADD: "0100", SUB: "0101", MUL: "0110", DIV: "0111" };
const REGISTER_BITS: Record<RegisterName, string> = { R1: "0001", R2: "0010", R3: "0011", R4: "0100" };
const EMPTY_REGS: Record<RegisterName, number> = { R1: 0, R2: 0, R3: 0, R4: 0 };
const EMPTY_GATE: GateState = { enabled: false, aBit: 0, bBit: 0, xorOut: 0, andOut: 0, orOut: 0, sumBit: 0, carryBit: 0, aBits: "00000000", bBits: "00000000" };

const to8Bit = (v: number) => (v & 0xff).toString(2).padStart(8, "0");
const split16 = (bits: string) => `${bits.slice(0, 8)} ${bits.slice(8)}`;
const operandLabel = (op?: Operand) => !op ? "N/A" : op.kind === "imm" ? `#${op.value}` : op.kind === "var" ? op.name : op.name;
const decodeBinaryFields = (bitsWithSpace: string) => {
  const bits = bitsWithSpace.replace(/\s+/g, "");
  return { opcode: bits.slice(0, 4), reg: bits.slice(4, 8), operand: bits.slice(8, 16) };
};

function parseOperand(token: string, lineNo: number): Operand {
  const clean = token.trim();
  if (/^-?\d+$/.test(clean)) return { kind: "imm", value: Number(clean) };
  if (/^[a-zA-Z_]\w*$/.test(clean)) return { kind: "var", name: clean };
  throw new Error(`Line ${lineNo}: Invalid operand "${token}"`);
}

function compileSource(source: string): { instructions: Instruction[]; variables: string[] } {
  const lines = source.split("\n").map((line) => line.trim()).filter(Boolean);
  const vars = new Set<string>();
  const instructions: Instruction[] = [];
  let id = 0;
  const push = (inst: Omit<Instruction, "id">) => instructions.push({ ...inst, id: id++ });

  lines.forEach((line, index) => {
    const lineNo = index + 1;
    const match = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
    if (!match) throw new Error(`Line ${lineNo}: Expected assignment like x = expression`);
    const target = match[1];
    const rhs = match[2].trim();
    vars.add(target);
    const binary = rhs.match(/^(.+?)\s*([+\-*/])\s*(.+)$/);

    if (binary) {
      const left = parseOperand(binary[1], lineNo);
      const right = parseOperand(binary[3], lineNo);
      const op = ({ "+": "ADD", "-": "SUB", "*": "MUL", "/": "DIV" } as Record<string, Opcode>)[binary[2]];
      push({ sourceLine: lineNo, asm: left.kind === "imm" ? `MOV R1, ${left.value}` : `LOAD R1, ${left.name}`, op: left.kind === "imm" ? "MOV" : "LOAD", a: { kind: "reg", name: "R1" }, b: left, explain: left.kind === "imm" ? `Move constant ${left.value} into register R1` : `Load variable ${left.name} from memory into register R1` });
      push({ sourceLine: lineNo, asm: right.kind === "imm" ? `MOV R2, ${right.value}` : `LOAD R2, ${right.name}`, op: right.kind === "imm" ? "MOV" : "LOAD", a: { kind: "reg", name: "R2" }, b: right, explain: right.kind === "imm" ? `Move constant ${right.value} into register R2` : `Load variable ${right.name} from memory into register R2` });
      push({ sourceLine: lineNo, asm: `${op} R1, R2`, op, a: { kind: "reg", name: "R1" }, b: { kind: "reg", name: "R2" }, explain: `${op} values in R1 and R2, keep result in R1` });
      push({ sourceLine: lineNo, asm: `STORE R1, ${target}`, op: "STORE", a: { kind: "reg", name: "R1" }, b: { kind: "var", name: target }, explain: `Store result from R1 into memory variable ${target}` });
      if (left.kind === "var") vars.add(left.name);
      if (right.kind === "var") vars.add(right.name);
      return;
    }

    const single = parseOperand(rhs, lineNo);
    push({ sourceLine: lineNo, asm: single.kind === "imm" ? `MOV R1, ${single.value}` : `LOAD R1, ${single.name}`, op: single.kind === "imm" ? "MOV" : "LOAD", a: { kind: "reg", name: "R1" }, b: single, explain: single.kind === "imm" ? `Move constant ${single.value} into register R1` : `Load variable ${single.name} from memory into register R1` });
    push({ sourceLine: lineNo, asm: `STORE R1, ${target}`, op: "STORE", a: { kind: "reg", name: "R1" }, b: { kind: "var", name: target }, explain: `Store R1 into memory variable ${target}` });
    if (single.kind === "var") vars.add(single.name);
  });

  return { instructions, variables: [...vars] };
}

function encodeInstruction(inst: Instruction, addrMap: Record<string, number>) {
  const op = OPCODE_BITS[inst.op];
  const regA = inst.a.kind === "reg" ? REGISTER_BITS[inst.a.name] : "0000";
  if ((inst.op === "ADD" || inst.op === "SUB" || inst.op === "MUL" || inst.op === "DIV") && inst.b?.kind === "reg") return split16(`${op}${regA}${REGISTER_BITS[inst.b.name]}0000`);
  if ((inst.op === "MOV" || inst.op === "LOAD" || inst.op === "STORE") && inst.b) {
    const low = inst.b.kind === "imm" ? to8Bit(inst.b.value) : inst.b.kind === "var" ? to8Bit(addrMap[inst.b.name] ?? 0) : to8Bit(0);
    return split16(`${op}${regA}${low}`);
  }
  return split16(`${op}${regA}00000000`);
}

function gateForInstruction(inst: Instruction, regs: Record<RegisterName, number>): GateState {
  if (inst.op !== "ADD" || inst.a.kind !== "reg" || inst.b?.kind !== "reg") return { ...EMPTY_GATE };
  const a = regs[inst.a.name];
  const b = regs[inst.b.name];
  const aBit = a & 1;
  const bBit = b & 1;
  const xorOut = aBit ^ bBit;
  const andOut = aBit & bBit;
  return { enabled: true, aBit, bBit, xorOut, andOut, orOut: aBit | bBit, sumBit: xorOut, carryBit: andOut, aBits: to8Bit(a), bBits: to8Bit(b) };
}

function runProgram(instructions: Instruction[], machineRows: string[]): Snapshot[] {
  const snapshots: Snapshot[] = [];
  const registers: Record<RegisterName, number> = { ...EMPTY_REGS };
  const memory: Record<string, number> = {};
  const push = (s: Omit<Snapshot, "registers" | "memory">) => snapshots.push({ ...s, registers: { ...registers }, memory: { ...memory } });
  const readOp = (op?: Operand) => !op ? 0 : op.kind === "imm" ? op.value : op.kind === "var" ? memory[op.name] ?? 0 : registers[op.name];

  push({ pc: -1, stage: "Idle", alu: "Idle", beginnerText: "Program loaded. Press play to start the fetch-decode-execute cycle.", microOps: ["PC points to first instruction", "Control unit ready"], signalBits: "0000000000000000", gate: { ...EMPTY_GATE }, transistors: [false, false, false, false, false, false] });

  instructions.forEach((inst, pc) => {
    const signalBits = (machineRows[pc] ?? "00000000 00000000").replace(" ", "");
    const target = inst.a.kind === "reg" ? inst.a.name : "R1";
    push({ pc, stage: "Fetch", alu: `Fetching instruction ${pc}`, beginnerText: `The CPU fetches instruction ${pc + 1}.`, microOps: [`MAR <- PC (${pc})`, "MDR <- instruction[MAR]", "IR <- MDR"], signalBits, gate: { ...EMPTY_GATE }, transistors: [false, false, false, false, false, false] });
    push({ pc, stage: "Decode", alu: `Decoding ${inst.op}`, beginnerText: `The control unit decodes ${inst.op}.`, microOps: [`Opcode = ${inst.op}`, `A = ${operandLabel(inst.a)}`, `B = ${operandLabel(inst.b)}`], signalBits, gate: { ...EMPTY_GATE }, transistors: [false, false, false, false, false, false] });

    const before = { ...registers };
    const gate = gateForInstruction(inst, before);
    let alu = "No ALU operation";
    let beginnerText = inst.explain;
    const microOps: string[] = [];

    if (inst.op === "MOV") {
      registers[target] = readOp(inst.b);
      alu = `${target} <- ${registers[target]}`;
      beginnerText = `The CPU moves a value directly into ${target}.`;
      microOps.push("Read operand", `Write ${target}`);
    } else if (inst.op === "LOAD" && inst.b?.kind === "var") {
      registers[target] = memory[inst.b.name] ?? 0;
      alu = `${target} <- MEM[${inst.b.name}]`;
      beginnerText = `The CPU reads variable ${inst.b.name} from memory into ${target}.`;
      microOps.push(`Address bus <- &${inst.b.name}`, "Data bus <- memory", `Write ${target}`);
    } else if (inst.op === "STORE" && inst.b?.kind === "var") {
      memory[inst.b.name] = registers[target];
      alu = `MEM[${inst.b.name}] <- ${target}`;
      beginnerText = `The CPU writes ${target} into memory location ${inst.b.name}.`;
      microOps.push(`Address bus <- &${inst.b.name}`, `Data bus <- ${target}`, "Write memory");
    } else if (inst.b?.kind === "reg") {
      const rhs = registers[inst.b.name];
      if (inst.op === "ADD") {
        registers[target] += rhs;
        alu = `${target} <- ${target} + ${inst.b.name}`;
        beginnerText = `The CPU is adding the value stored in register ${target} with the value stored in register ${inst.b.name}.`;
      } else if (inst.op === "SUB") {
        registers[target] -= rhs;
        alu = `${target} <- ${target} - ${inst.b.name}`;
        beginnerText = `The ALU subtracts ${inst.b.name} from ${target}.`;
      } else if (inst.op === "MUL") {
        registers[target] *= rhs;
        alu = `${target} <- ${target} * ${inst.b.name}`;
        beginnerText = `The ALU multiplies ${target} and ${inst.b.name}.`;
      } else if (inst.op === "DIV") {
        registers[target] = rhs === 0 ? 0 : Math.trunc(registers[target] / rhs);
        alu = `${target} <- ${target} / ${inst.b.name}`;
        beginnerText = rhs === 0 ? "Division by zero detected. This simulator writes 0 as fallback." : `The ALU divides ${target} by ${inst.b.name}.`;
      }
      microOps.push(`ALU IN A <- ${target}`, `ALU IN B <- ${inst.b.name}`, `ALU OP <- ${inst.op}`, `Writeback ${target}`);
    }

    push({
      pc,
      stage: "Execute",
      alu,
      beginnerText,
      microOps,
      signalBits,
      gate,
      transistors: gate.enabled ? [Boolean(gate.aBit), Boolean(gate.bBit), Boolean(gate.xorOut), Boolean(gate.andOut), Boolean(gate.sumBit), Boolean(gate.carryBit)] : [false, false, false, false, false, false],
    });
  });
  return snapshots;
}

const MachineCodeVisualizerPage = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [error, setError] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [binaryRows, setBinaryRows] = useState<string[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [addressMap, setAddressMap] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [beginnerMode, setBeginnerMode] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runVisualization = () => {
    try {
      const { instructions: inst, variables } = compileSource(code);
      const map = Object.fromEntries(variables.map((name, idx) => [name, idx + 1]));
      const machine = inst.map((i) => encodeInstruction(i, map));
      setInstructions(inst);
      setBinaryRows(machine);
      setSnapshots(runProgram(inst, machine));
      setAddressMap(map);
      setCurrentStep(0);
      setIsPlaying(false);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to compile source");
      setInstructions([]);
      setBinaryRows([]);
      setSnapshots([]);
      setAddressMap({});
      setCurrentStep(0);
      setIsPlaying(false);
    }
  };

  const totalSteps = snapshots.length;
  const currentSnapshot = snapshots[currentStep];
  const previousSnapshot = currentStep > 0 ? snapshots[currentStep - 1] : undefined;
  const currentInstructionIndex = currentSnapshot?.pc ?? -1;
  const sourceLines = useMemo(() => code.split("\n"), [code]);
  const currentBinary = currentInstructionIndex >= 0 ? binaryRows[currentInstructionIndex] : null;
  const decodedBits = currentBinary ? decodeBinaryFields(currentBinary) : null;

  const stepForward = useCallback(() => setCurrentStep((p) => Math.min(p + 1, Math.max(0, totalSteps - 1))), [totalSteps]);
  const stepBackward = () => setCurrentStep((p) => Math.max(p - 1, 0));
  const reset = () => { setCurrentStep(0); setIsPlaying(false); };

  useEffect(() => {
    if (isPlaying && totalSteps > 0 && currentStep < totalSteps - 1) timerRef.current = setTimeout(() => stepForward(), 900 / speed);
    else if (currentStep >= totalSteps - 1) setIsPlaying(false);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, currentStep, totalSteps, speed, stepForward]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="border-b border-border bg-card/60 backdrop-blur-md px-4 md:px-6 py-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-[hsl(var(--syntax-keyword))]" />
          <h1 className="font-display font-semibold text-sm tracking-tight">Code to Machine Visualizer</h1>
        </div>
        <button onClick={() => setBeginnerMode((v) => !v)} className={`ml-auto px-3 py-1.5 rounded-lg text-xs border transition-colors ${beginnerMode ? "bg-foreground text-background border-foreground" : "bg-secondary border-border text-muted-foreground"}`}>Beginner Mode: {beginnerMode ? "On" : "Off"}</button>
        <Button size="sm" onClick={runVisualization} className="gap-2 rounded-lg font-display text-xs"><PlayCircle className="h-3.5 w-3.5" /> Run Visualization</Button>
      </div>

      <div className="flex-1 grid lg:grid-cols-[1fr,1.15fr,1.1fr] overflow-hidden">
        <section className="border-r border-border p-4 overflow-auto">
          <h2 className="text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">Layer 1: Source Code</h2>
          <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full min-h-[280px] bg-secondary rounded-xl p-3 border border-border font-mono text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20" />
          <div className="mt-3 rounded-lg bg-secondary/60 border border-border p-3"><p className="text-[11px] font-display text-muted-foreground">Supported format: `x = 5`, `x = y`, `x = a + b`, `x = a - 2`, `x = a * b`, `x = a / b`</p></div>
          {error && <div className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">{error}</div>}
          {instructions.length > 0 && <div className="mt-4 rounded-xl border border-border bg-card/50 p-3"><h3 className="text-[11px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">Source Line Focus</h3>{sourceLines.map((line, idx) => <div key={`${idx}-${line}`} className={`font-mono text-xs px-2 py-1 rounded ${instructions[currentInstructionIndex]?.sourceLine === idx + 1 ? "bg-foreground text-background" : "text-muted-foreground"}`}>{idx + 1}. {line}</div>)}</div>}
        </section>

        <section className="border-r border-border p-4 overflow-auto">
          <h2 className="text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">Layer 2 + 3: Assembly and Binary</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card/40 p-2"><p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">Assembly</p><div className="space-y-1">{instructions.map((inst, idx) => <div key={inst.id} className={`rounded-lg px-2 py-1.5 text-xs border ${currentInstructionIndex === idx ? "bg-[hsl(var(--syntax-number)/0.2)] border-[hsl(var(--syntax-number)/0.4)]" : "bg-secondary/40 border-border/50"}`}><p className="font-mono">{inst.asm}</p><p className="text-[10px] text-muted-foreground mt-1">{inst.explain}</p></div>)}</div></div>
            <div className="rounded-xl border border-border bg-card/40 p-2"><p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">Machine Code (Binary)</p><div className="space-y-1">{binaryRows.map((bits, idx) => { const [hi, lo] = bits.split(" "); return <div key={`${bits}-${idx}`} className={`rounded-lg px-2 py-1.5 text-xs border ${currentInstructionIndex === idx ? "bg-[hsl(var(--syntax-string)/0.2)] border-[hsl(var(--syntax-string)/0.35)]" : "bg-secondary/40 border-border/50"}`}><div className="font-mono flex gap-1"><span className="px-1 rounded bg-background/60">{hi}</span><span className="px-1 rounded bg-background/60">{lo}</span></div></div>; })}</div></div>
          </div>
          <div className="mt-3 rounded-xl border border-border bg-secondary/40 p-3"><div className="flex items-center gap-1.5 mb-1"><Info className="h-3 w-3 text-[hsl(var(--syntax-function))]" /><p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">Binary Meaning</p></div><p className="text-xs text-foreground/85">CPUs execute instructions as binary patterns. `1` means voltage present and `0` means no voltage.</p></div>
          <div className="mt-3 rounded-xl border border-border bg-card/40 p-3"><p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">Instruction Decode (Current Step)</p>{decodedBits && currentInstructionIndex >= 0 ? <div className="grid grid-cols-3 gap-2 text-xs font-mono"><div className="rounded-lg border border-border bg-secondary/40 p-2"><p className="text-[10px] text-muted-foreground mb-1">Opcode</p><p>{decodedBits.opcode}</p><p className="text-[10px] text-muted-foreground mt-1">{instructions[currentInstructionIndex]?.op}</p></div><div className="rounded-lg border border-border bg-secondary/40 p-2"><p className="text-[10px] text-muted-foreground mb-1">Reg</p><p>{decodedBits.reg}</p><p className="text-[10px] text-muted-foreground mt-1">{operandLabel(instructions[currentInstructionIndex]?.a)}</p></div><div className="rounded-lg border border-border bg-secondary/40 p-2"><p className="text-[10px] text-muted-foreground mb-1">Operand</p><p>{decodedBits.operand}</p><p className="text-[10px] text-muted-foreground mt-1">{operandLabel(instructions[currentInstructionIndex]?.b)}</p></div></div> : <p className="text-xs text-muted-foreground/60">Move through steps to inspect decoded fields.</p>}</div>
        </section>

        <section className="p-4 overflow-auto">
          <h2 className="text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">Layer 4 to 7: CPU, Gates, Transistors, Signals</h2>
          <PlaybackControls isPlaying={isPlaying} currentStep={currentStep} totalSteps={totalSteps} speed={speed} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onStepForward={stepForward} onStepBackward={stepBackward} onReset={reset} onSpeedChange={setSpeed} />
          <div className="mt-3 rounded-xl border border-border bg-card/40 p-3"><p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">Timeline</p><input type="range" min={0} max={Math.max(0, totalSteps - 1)} step={1} value={currentStep} onChange={(e) => { setCurrentStep(Number(e.target.value)); setIsPlaying(false); }} className="w-full h-1 accent-foreground" disabled={totalSteps <= 1} /></div>
          <div className="mt-3 rounded-xl border border-border bg-card/40 p-3"><p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">CPU Pipeline Stage</p><div className="grid grid-cols-3 gap-2">{(["Fetch", "Decode", "Execute"] as const).map((s) => <div key={s} className={`rounded-lg border px-2 py-1.5 text-center text-xs font-mono ${currentSnapshot?.stage === s ? "border-[hsl(var(--syntax-function)/0.5)] bg-[hsl(var(--syntax-function)/0.15)]" : "border-border bg-secondary/40 text-muted-foreground"}`}>{s}</div>)}</div></div>

          <div className="mt-3 grid gap-3">
            <div className="rounded-xl border border-border bg-card/40 p-3"><p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">Registers</p><div className="grid grid-cols-2 gap-2">{(Object.keys(EMPTY_REGS) as RegisterName[]).map((reg) => { const value = currentSnapshot?.registers[reg] ?? 0; const changed = previousSnapshot && previousSnapshot.registers[reg] !== value; return <div key={reg} className={`rounded-lg border px-2 py-1.5 ${changed ? "border-[hsl(var(--syntax-number)/0.6)] bg-[hsl(var(--syntax-number)/0.1)]" : "border-border bg-secondary/40"}`}><p className="text-[10px] text-muted-foreground font-mono">{reg}</p><p className="font-mono text-sm">{value}</p><p className="font-mono text-[10px] text-muted-foreground">{to8Bit(value)}</p></div>; })}</div></div>
            <div className="rounded-xl border border-border bg-card/40 p-3"><p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">Memory</p><div className="space-y-1.5">{Object.entries(currentSnapshot?.memory ?? {}).map(([name, value]) => { const prev = previousSnapshot?.memory[name]; const changed = prev !== undefined && prev !== value; return <div key={name} className={`rounded-lg border px-2 py-1.5 flex justify-between font-mono text-xs ${changed ? "border-[hsl(var(--syntax-string)/0.6)] bg-[hsl(var(--syntax-string)/0.1)] animate-pulse" : "border-border bg-secondary/40"}`}><span>{name} @0x{(addressMap[name] ?? 0).toString(16).padStart(2, "0")}</span><span>{value} ({to8Bit(value)})</span></div>; })}</div></div>
            <div className="rounded-xl border border-border bg-card/40 p-3"><p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-1">ALU / CPU Status</p><p className="text-xs font-display text-foreground/90">{currentSnapshot?.alu}</p><ul className="mt-2 space-y-1">{(currentSnapshot?.microOps ?? []).map((m, i) => <li key={`${m}-${i}`} className="text-[11px] font-mono text-foreground/85">{i + 1}. {m}</li>)}</ul></div>
            <div className="rounded-xl border border-border bg-card/40 p-3"><p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">Logic Gates (AND / OR / XOR)</p>{currentSnapshot?.gate.enabled ? <><div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-2"><div className="rounded border border-border bg-secondary/40 p-2">A = {currentSnapshot.gate.aBits}</div><div className="rounded border border-border bg-secondary/40 p-2">B = {currentSnapshot.gate.bBits}</div></div><div className="grid grid-cols-3 gap-2 text-xs font-mono"><div className="rounded border border-border bg-secondary/40 p-2 text-center">XOR<br /><span className="text-sm">{currentSnapshot.gate.xorOut}</span></div><div className="rounded border border-border bg-secondary/40 p-2 text-center">AND<br /><span className="text-sm">{currentSnapshot.gate.andOut}</span></div><div className="rounded border border-border bg-secondary/40 p-2 text-center">OR<br /><span className="text-sm">{currentSnapshot.gate.orOut}</span></div></div><div className="mt-2 flex gap-2 text-xs font-mono"><span className="px-2 py-1 rounded border border-border bg-secondary/40">SUM = {currentSnapshot.gate.sumBit}</span><span className="px-2 py-1 rounded border border-border bg-secondary/40">CARRY = {currentSnapshot.gate.carryBit}</span></div></> : <p className="text-xs text-muted-foreground/70">Gate adder view activates during ADD execute stage.</p>}</div>
            <div className="rounded-xl border border-border bg-card/40 p-3"><p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">Transistor Switches</p><div className="grid grid-cols-3 gap-2">{["T1", "T2", "T3", "T4", "T5", "T6"].map((name, idx) => { const on = currentSnapshot?.transistors[idx] ?? false; return <div key={name} className={`rounded border px-2 py-2 text-center ${on ? "border-[hsl(var(--syntax-number)/0.55)] bg-[hsl(var(--syntax-number)/0.15)]" : "border-border bg-secondary/40"}`}><p className="text-[10px] font-mono text-muted-foreground">{name}</p><p className={`text-xs font-mono ${on ? "text-foreground animate-pulse" : "text-muted-foreground"}`}>{on ? "ON (1)" : "OFF (0)"}</p></div>; })}</div></div>
            <div className="rounded-xl border border-border bg-card/40 p-3"><p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">Electrical Signals</p><p className="text-[11px] text-muted-foreground mb-2">1 = voltage present, 0 = no voltage</p><div className="grid grid-cols-8 gap-1">{(currentSnapshot?.signalBits ?? "0000000000000000").split("").map((bit, idx) => { const on = bit === "1"; const pulse = on && currentSnapshot?.stage === "Execute"; return <div key={`${bit}-${idx}`} className={`h-7 rounded text-[10px] font-mono flex items-center justify-center border ${on ? "bg-[hsl(var(--syntax-string)/0.25)] border-[hsl(var(--syntax-string)/0.5)]" : "bg-secondary/40 border-border"} ${pulse ? "animate-pulse" : ""}`}>{bit}</div>; })}</div></div>
          </div>
        </section>
      </div>

      <div className="border-t border-border bg-secondary/30 px-4 py-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-1">Current Step Explanation</p>
        <p className="text-sm font-display text-foreground/90">{currentSnapshot ? (beginnerMode ? currentSnapshot.beginnerText : currentInstructionIndex >= 0 ? `${instructions[currentInstructionIndex]?.explain} | Stage: ${currentSnapshot.stage}` : "Program ready.") : "Run visualization to see explanation."}</p>
      </div>
    </div>
  );
};

export default MachineCodeVisualizerPage;
