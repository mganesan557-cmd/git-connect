import { useState, useRef, useEffect } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
import { useSearchParams, useNavigate } from "react-router-dom";
import { Play, Eye, ChevronDown, Terminal, Cpu, Loader2, Target, Lightbulb, BookOpen, ChevronRight, Code2, MessageSquare, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import { AnalysisLoader } from "@/components/AnalysisLoader";
import { AfsvIcon } from "@/components/AfsvIcon";
import { ModeToggle } from "@/components/ModeToggle";

const languages = ["Python", "JavaScript", "TypeScript", "Java", "C", "C++", "Go", "Rust", "Ruby", "PHP", "Kotlin", "Swift"] as const;

const defaultCode: Record<string, string> = {
  Python: `# Fibonacci sequence\ndef fibonacci(n):\n    a, b = 0, 1\n    result = []\n    for i in range(n):\n        result.append(a)\n        a, b = b, a + b\n    return result\n\nprint(fibonacci(8))`,
  JavaScript: `// Fibonacci sequence\nfunction fibonacci(n) {\n  let a = 0, b = 1;\n  const result = [];\n  for (let i = 0; i < n; i++) {\n    result.push(a);\n    [a, b] = [b, a + b];\n  }\n  return result;\n}\n\nconsole.log(fibonacci(8));`,
  TypeScript: `// Fibonacci with types\nfunction fibonacci(n: number): number[] {\n  let a: number = 0, b: number = 1;\n  const result: number[] = [];\n  for (let i = 0; i < n; i++) {\n    result.push(a);\n    [a, b] = [b, a + b];\n  }\n  return result;\n}\n\nconsole.log(fibonacci(8));`,
  Java: `public class Main {\n  public static void main(String[] args) {\n    int n = 8;\n    int a = 0, b = 1;\n    for (int i = 0; i < n; i++) {\n      System.out.print(a + " ");\n      int temp = a;\n      a = b;\n      b = temp + b;\n    }\n  }\n}`,
  C: `#include <stdio.h>\n\nint main() {\n    int n = 8, a = 0, b = 1;\n    for (int i = 0; i < n; i++) {\n        printf("%d ", a);\n        int temp = a;\n        a = b;\n        b = temp + b;\n    }\n    return 0;\n}`,
  "C++": `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n = 8, a = 0, b = 1;\n    for (int i = 0; i < n; i++) {\n        cout << a << " ";\n        int temp = a;\n        a = b;\n        b = temp + b;\n    }\n    return 0;\n}`,
  Go: `package main\n\nimport "fmt"\n\nfunc main() {\n    n := 8\n    a, b := 0, 1\n    for i := 0; i < n; i++ {\n        fmt.Print(a, " ")\n        a, b = b, a+b\n    }\n}`,
  Rust: `fn main() {\n    let n = 8;\n    let (mut a, mut b) = (0u64, 1u64);\n    for _ in 0..n {\n        print!("{} ", a);\n        let temp = a;\n        a = b;\n        b = temp + b;\n    }\n}`,
  Ruby: `# Fibonacci sequence\ndef fibonacci(n)\n  a, b = 0, 1\n  n.times do\n    print "#{a} "\n    a, b = b, a + b\n  end\nend\n\nfibonacci(8)`,
  PHP: `<?php\n$n = 8;\n$a = 0;\n$b = 1;\nfor ($i = 0; $i < $n; $i++) {\n    echo $a . " ";\n    $temp = $a;\n    $a = $b;\n    $b = $temp + $b;\n}\n?>`,
  Kotlin: `fun main() {\n    val n = 8\n    var a = 0\n    var b = 1\n    for (i in 0 until n) {\n        print("$a ")\n        val temp = a\n        a = b\n        b = temp + b\n    }\n}`,
  Swift: `var a = 0\nvar b = 1\nlet n = 8\nfor _ in 0..<n {\n    print(a, terminator: " ")\n    let temp = a\n    a = b\n    b = temp + b\n}`,
};

type Step = {
  step: number;
  line: number;
  code?: string;
  description: string;
  purpose?: string;
  importance?: string;
  whatIfRemoved?: string;
  concept?: string;
  explanation?: string;
  variables: Record<string, string | number>;
};

type AnalysisResult = {
  steps: Step[];
  output: string;
};

type RuntimeInputRequest = {
  id: string;
  label: string;
  line: number;
};

const VISUALIZER_STATE_KEY = "visualizer-state-v1";
const VISUALIZER_CACHE_KEY = "visualizer-analysis-cache-v1";
const VISUALIZER_CACHE_LIMIT = 20;

const normalizeStep = (item: unknown, fallbackIndex: number): Step => {
  const step = (item as Partial<Step>) || {};
  return {
    step: typeof step.step === "number" ? step.step : fallbackIndex + 1,
    line: typeof step.line === "number" ? step.line : 0,
    code: step.code,
    description: step.description || "",
    purpose: step.purpose,
    importance: step.importance,
    whatIfRemoved: step.whatIfRemoved,
    concept: step.concept,
    explanation: step.explanation,
    variables: step.variables && typeof step.variables === "object" ? step.variables : {},
  };
};

const normalizeSteps = (rawSteps: unknown): Step[] => {
  if (!Array.isArray(rawSteps)) return [];
  return rawSteps.map((item, index) => normalizeStep(item, index));
};

const detectRuntimeInputRequests = (language: string, code: string): RuntimeInputRequest[] => {
  const lines = code.split("\n");
  const requests: RuntimeInputRequest[] = [];
  let counter = 0;

  const pushRequest = (line: number, label: string) => {
    requests.push({ id: `inp_${counter++}`, line, label });
  };

  lines.forEach((line, idx) => {
    const lineNo = idx + 1;
    const clean = line.trim();
    if (!clean || clean.startsWith("#") || clean.startsWith("//")) return;

    if (language === "Python") {
      const matches = clean.match(/\binput\s*\(/g);
      matches?.forEach((_, i) => pushRequest(lineNo, `Python input on line ${lineNo}${matches.length > 1 ? ` (#${i + 1})` : ""}`));
      return;
    }

    if (language === "JavaScript" || language === "TypeScript") {
      if (/\bprompt\s*\(/.test(clean)) pushRequest(lineNo, `Prompt value for line ${lineNo}`);
      if (/readline|question\s*\(/i.test(clean)) pushRequest(lineNo, `Console input for line ${lineNo}`);
      return;
    }

    if (language === "C") {
      const count = (clean.match(/\bscanf\s*\(/g) || []).length;
      for (let i = 0; i < count; i++) pushRequest(lineNo, `scanf value ${count > 1 ? `#${i + 1} ` : ""}for line ${lineNo}`);
      return;
    }

    if (language === "C++") {
      const count = (clean.match(/>>/g) || []).length;
      if (/\bcin\b/.test(clean) && count > 0) {
        for (let i = 0; i < count; i++) pushRequest(lineNo, `cin value #${i + 1} for line ${lineNo}`);
      }
      return;
    }

    if (language === "Java") {
      if (/Scanner|nextInt|nextLine|nextDouble|next\(/.test(clean)) pushRequest(lineNo, `Scanner input for line ${lineNo}`);
      return;
    }

    if (language === "Go") {
      if (/fmt\.Scan|fmt\.Scanf|fmt\.Scanln/.test(clean)) pushRequest(lineNo, `Scan input for line ${lineNo}`);
      return;
    }

    if (language === "Rust") {
      if (/read_line|stdin\(\)/.test(clean)) pushRequest(lineNo, `stdin value for line ${lineNo}`);
      return;
    }

    if (language === "Ruby") {
      if (/\bgets\b/.test(clean)) pushRequest(lineNo, `gets input for line ${lineNo}`);
      return;
    }

    if (language === "PHP") {
      if (/readline\s*\(|fgets\s*\(/.test(clean)) pushRequest(lineNo, `stdin input for line ${lineNo}`);
      return;
    }

    if (language === "Kotlin") {
      if (/readLine\s*\(/.test(clean)) pushRequest(lineNo, `readLine input for line ${lineNo}`);
      return;
    }

    if (language === "Swift") {
      if (/readLine\s*\(/.test(clean)) pushRequest(lineNo, `readLine input for line ${lineNo}`);
    }
  });

  return requests;
};

const parseQuotedText = (line: string) => {
  const match = line.match(/["'`](.*?)["'`]/);
  return match?.[1] ?? "";
};

const collectTerminalOutputBetween = (
  language: string,
  code: string,
  fromLineExclusive: number,
  toLineInclusive: number,
) => {
  const lines = code.split("\n");
  const out: string[] = [];
  for (let i = Math.max(1, fromLineExclusive + 1); i <= Math.min(lines.length, toLineInclusive); i++) {
    const line = lines[i - 1].trim();
    if (!line) continue;
    if (language === "Python" && /^\s*print\s*\(/.test(line)) {
      const t = parseQuotedText(line);
      if (t) out.push(t);
    } else if ((language === "JavaScript" || language === "TypeScript") && /console\.log\s*\(/.test(line)) {
      const t = parseQuotedText(line);
      if (t) out.push(t);
    } else if (language === "Java" && /System\.out\.(print|println)\s*\(/.test(line)) {
      const t = parseQuotedText(line);
      if (t) out.push(t);
    } else if (language === "C" && /\bprintf\s*\(/.test(line)) {
      const t = parseQuotedText(line);
      if (t) out.push(t);
    } else if (language === "C++" && /\bcout\b/.test(line)) {
      const t = parseQuotedText(line);
      if (t) out.push(t);
    } else if (language === "Go" && /fmt\.(Print|Printf|Println)\s*\(/.test(line)) {
      const t = parseQuotedText(line);
      if (t) out.push(t);
    } else if (language === "Ruby" && /\bputs\b|\bprint\b/.test(line)) {
      const t = parseQuotedText(line);
      if (t) out.push(t);
    } else if (language === "PHP" && /\becho\b/.test(line)) {
      const t = parseQuotedText(line);
      if (t) out.push(t);
    } else if ((language === "Kotlin" || language === "Swift") && /\bprint\s*\(/.test(line)) {
      const t = parseQuotedText(line);
      if (t) out.push(t);
    }
  }
  return out;
};

const getInputPromptForLine = (language: string, code: string, lineNo: number) => {
  const line = code.split("\n")[lineNo - 1]?.trim() ?? "";
  if (!line) return "input >";
  if (language === "Python" && /\binput\s*\(/.test(line)) {
    const t = parseQuotedText(line);
    return t || "input >";
  }
  if ((language === "JavaScript" || language === "TypeScript") && /\bprompt\s*\(/.test(line)) {
    const t = parseQuotedText(line);
    return t || "input >";
  }
  return "input >";
};

const VisualizerPage = () => {
  const [language, setLanguage] = useState<string>("Python");
  const [code, setCode] = useState(defaultCode["Python"]);
  const [output, setOutput] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [runtimeInputRequests, setRuntimeInputRequests] = useState<RuntimeInputRequest[]>([]);
  const [runtimeInputValues, setRuntimeInputValues] = useState<Record<string, string>>({});
  const [runtimeInputIndex, setRuntimeInputIndex] = useState(0);
  const [runtimeTranscript, setRuntimeTranscript] = useState<string[]>([]);
  const stepsEndRef = useRef<HTMLDivElement>(null);
  const analysisCacheRef = useRef<Record<string, AnalysisResult>>({});

  const getCacheKey = (lang: string, source: string, runtimeValues?: Record<string, string>) =>
    `${lang}::${source}::${JSON.stringify(runtimeValues || {})}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(VISUALIZER_CACHE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, AnalysisResult>;
      if (parsed && typeof parsed === "object") {
        const normalized: Record<string, AnalysisResult> = {};
        for (const [key, value] of Object.entries(parsed)) {
          normalized[key] = {
            steps: normalizeSteps(value?.steps),
            output: typeof value?.output === "string" ? value.output : "",
          };
        }
        analysisCacheRef.current = normalized;
      }
    } catch {
      // Ignore malformed local cache.
    }
  }, []);

  useEffect(() => {
    const hasQueryPreset = Boolean(searchParams.get("lang") || searchParams.get("code"));
    if (hasQueryPreset) return;
    try {
      const raw = localStorage.getItem(VISUALIZER_STATE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<{
        language: string;
        code: string;
        output: string;
        steps: Step[];
        activeStep: number | null;
      }>;
      if (parsed.language) setLanguage(parsed.language);
      if (typeof parsed.code === "string") setCode(parsed.code);
      if (typeof parsed.output === "string") setOutput(parsed.output);
      if (Array.isArray(parsed.steps)) setSteps(normalizeSteps(parsed.steps));
      if (parsed.activeStep === null || typeof parsed.activeStep === "number") setActiveStep(parsed.activeStep ?? null);
    } catch {
      // Ignore malformed local cache.
    }
  }, [searchParams]);

  useEffect(() => {
    try {
      localStorage.setItem(
        VISUALIZER_STATE_KEY,
        JSON.stringify({ language, code, output, steps, activeStep })
      );
    } catch {
      // Ignore storage quota errors.
    }
  }, [language, code, output, steps, activeStep]);

  useEffect(() => {
    if (running) return;
    setRuntimeInputRequests([]);
    setRuntimeInputValues({});
    setRuntimeInputIndex(0);
    setRuntimeTranscript([]);
  }, [language, code]);

  // Load code/language from URL params (used by Learn "Run Snippet")
  useEffect(() => {
    const paramLang = searchParams.get("lang");
    const paramCode = searchParams.get("code");
    if (!paramLang || !paramCode) return;

    if (language !== paramLang) setLanguage(paramLang);
    setCode(paramCode);
    setSteps([]);
    setOutput("");
    setActiveStep(null);
    setExpandedSteps(new Set());
    setIsEditing(false);
    setRuntimeInputRequests([]);
    setRuntimeInputValues({});
    setRuntimeInputIndex(0);
    setRuntimeTranscript([]);
  }, [searchParams]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(defaultCode[lang] || "");
    setSteps([]);
    setOutput("");
    setActiveStep(null);
    setLangOpen(false);
    setExpandedSteps(new Set());
    setRuntimeInputRequests([]);
    setRuntimeInputValues({});
    setRuntimeInputIndex(0);
    setRuntimeTranscript([]);
  };

  const toggleExpanded = (stepIndex: number) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepIndex)) next.delete(stepIndex);
      else next.add(stepIndex);
      return next;
    });
  };

  const goToTutorForStep = (step: Step) => {
    const stepSummary = [
      `Language: ${language}`,
      `Line: ${step.line}`,
      step.code ? `Code: ${step.code}` : "",
      `Step description: ${step.description}`,
      step.purpose ? `Purpose: ${step.purpose}` : "",
      step.importance ? `Importance: ${step.importance}` : "",
      step.whatIfRemoved ? `What if removed: ${step.whatIfRemoved}` : "",
      step.concept ? `Concept: ${step.concept}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const tutorPrompt = `Explain this code execution step in simple terms with examples:\n\n${stepSummary}\n\nPlease also suggest one quick practice question.`;
    navigate(`/tutor?q=${encodeURIComponent(tutorPrompt)}`);
  };

  const executeAnalysis = async (resolvedRuntimeInputs: Record<string, string>) => {
    setRunning(true);
    setSteps([]);
    setOutput("");
    setActiveStep(null);
    setExpandedSteps(new Set());
    setIsEditing(false);
    setRuntimeInputRequests([]);
    setRuntimeInputIndex(0);
    setRuntimeTranscript([]);

    try {
      const hasRuntimeInputs = Object.keys(resolvedRuntimeInputs).length > 0;
      const cacheKey = getCacheKey(language, code, resolvedRuntimeInputs);
      const cached = !hasRuntimeInputs ? analysisCacheRef.current[cacheKey] : null;
      if (cached) {
        setSteps(cached.steps);
        setOutput(cached.output);
        setActiveStep(cached.steps.length ? cached.steps.length - 1 : null);
        setRunning(false);
        return;
      }

      // ── Smart fetch: streams when edge fn supports SSE, falls back to JSON ──
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token ?? SUPABASE_ANON_KEY;

      const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
          "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          code,
          language,
          runtimeInputs: resolvedRuntimeInputs,
          runtimeInputSequence: Object.values(resolvedRuntimeInputs),
        }),
      });

      if (!response.ok || !response.body) {
        const errText = await response.text().catch(() => "Analysis failed");
        let errMsg = "Analysis failed";
        try { errMsg = (JSON.parse(errText) as { error?: string }).error ?? errMsg; } catch { /* */ }
        if (response.status === 429) errMsg = "Rate limit exceeded, please try again later.";
        if (response.status === 402) errMsg = "Usage limit reached. Please add credits.";
        toast.error(errMsg);
        setOutput(`Error: ${errMsg}`);
        setRunning(false);
        return;
      }

      const contentType = response.headers.get("content-type") ?? "";
      const isStreaming = contentType.includes("text/event-stream");

      let collectedSteps: Step[] = [];
      let collectedOutput = "";

      if (isStreaming) {
        // ── SSE streaming path (new edge fn): steps appear one-by-one ──
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let sseBuf = "";
        let ndjsonBuf = "";
        let stepCount = 0;

        outer: while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          sseBuf += decoder.decode(value, { stream: true });
          const sseLines = sseBuf.split("\n");
          sseBuf = sseLines.pop() ?? "";

          for (const sseLine of sseLines) {
            if (!sseLine.startsWith("data: ")) continue;
            const payload = sseLine.slice(6).trim();
            if (payload === "[DONE]") break outer;

            try {
              const parsed = JSON.parse(payload) as { choices?: Array<{ delta?: { content?: string } }> };
              if ((parsed as unknown as { error?: { message?: string } }).error) {
                const sseErr = (parsed as unknown as { error: { message?: string } }).error.message ?? "AI error";
                toast.error(sseErr);
                setOutput(`Error: ${sseErr}`);
                break outer;
              }
              const token = parsed.choices?.[0]?.delta?.content;
              if (!token) continue;

              ndjsonBuf += token;
              const ndjsonLines = ndjsonBuf.split("\n");
              ndjsonBuf = ndjsonLines.pop() ?? "";

              for (const ndjsonLine of ndjsonLines) {
                const trimmed = ndjsonLine.trim();
                if (!trimmed) continue;
                try {
                  const obj = JSON.parse(trimmed) as Record<string, unknown>;
                  if ("output" in obj) {
                    collectedOutput = String(obj.output ?? "");
                    setOutput(collectedOutput);
                  } else if ("step" in obj || "line" in obj) {
                    const s = normalizeStep(obj, stepCount++);
                    collectedSteps.push(s);
                    setSteps((prev) => [...prev, s]);
                    setActiveStep(collectedSteps.length - 1);
                  }
                } catch { /* incomplete JSON line */ }
              }
            } catch { /* malformed SSE chunk */ }
          }
        }

        // Flush remaining buffer
        if (ndjsonBuf.trim()) {
          try {
            const obj = JSON.parse(ndjsonBuf.trim()) as Record<string, unknown>;
            if ("output" in obj) {
              collectedOutput = String(obj.output ?? "");
              setOutput(collectedOutput);
            } else if ("step" in obj || "line" in obj) {
              const s = normalizeStep(obj, stepCount++);
              collectedSteps.push(s);
              setSteps((prev) => [...prev, s]);
              setActiveStep(collectedSteps.length - 1);
            }
          } catch { /* */ }
        }
      } else {
        // ── JSON fallback path (current deployed edge fn) ──
        const data = await response.json() as { steps?: unknown; output?: string; error?: string };
        if (data?.error) {
          toast.error(data.error);
          setOutput(`Error: ${data.error}`);
          setRunning(false);
          return;
        }
        collectedSteps = normalizeSteps(data.steps);
        collectedOutput = data.output || "";
        setSteps(collectedSteps);
        setActiveStep(collectedSteps.length ? collectedSteps.length - 1 : null);
        setOutput(collectedOutput);
      }

      // Persist to local cache
      if (!hasRuntimeInputs && collectedSteps.length > 0) {
        const nextCache = {
          ...analysisCacheRef.current,
          [cacheKey]: { steps: collectedSteps, output: collectedOutput },
        };
        const entries = Object.entries(nextCache);
        if (entries.length > VISUALIZER_CACHE_LIMIT) {
          const toKeep = entries.slice(entries.length - VISUALIZER_CACHE_LIMIT);
          analysisCacheRef.current = Object.fromEntries(toKeep);
        } else {
          analysisCacheRef.current = nextCache;
        }
        try {
          localStorage.setItem(VISUALIZER_CACHE_KEY, JSON.stringify(analysisCacheRef.current));
        } catch { /* storage quota */ }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Analysis failed";
      setOutput(`Error: ${msg}`);
      toast.error(msg);
    } finally {
      setRunning(false);
    }
  };

  const analyzeCode = async () => {
    if (runtimeInputRequests.length > 0 && runtimeInputIndex < runtimeInputRequests.length) {
      await submitRuntimeInputs();
      return;
    }

    const requests = detectRuntimeInputRequests(language, code);
    if (requests.length === 0) {
      await executeAnalysis({});
      return;
    }

    setRuntimeInputRequests(requests);
    const nextValues: Record<string, string> = {};
    requests.forEach((req) => {
      nextValues[req.id] = "";
    });
    setRuntimeInputValues(nextValues);
    setRuntimeInputIndex(0);
    const firstInputLine = requests[0].line;
    const introOut = collectTerminalOutputBetween(language, code, 0, firstInputLine);
    const firstPrompt = getInputPromptForLine(language, code, firstInputLine);
    setRuntimeTranscript([...introOut, firstPrompt]);
    setOutput("");
    setSteps([]);
    setActiveStep(null);
  };

  const submitRuntimeInputs = async () => {
    if (runtimeInputRequests.length === 0) return;
    const currentReq = runtimeInputRequests[runtimeInputIndex];
    if (!currentReq) return;
    const currentValue = (runtimeInputValues[currentReq.id] ?? "").trim();
    if (!currentValue) {
      toast.info("Enter input value first.");
      return;
    }

    const enteredLine = `> ${currentValue}`;
    const nextIndex = runtimeInputIndex + 1;
    const currentLine = currentReq.line;

    if (nextIndex < runtimeInputRequests.length) {
      const nextReq = runtimeInputRequests[nextIndex];
      const betweenOut = collectTerminalOutputBetween(language, code, currentLine, nextReq.line);
      const nextPrompt = getInputPromptForLine(language, code, nextReq.line);
      setRuntimeTranscript((prev) => [...prev, enteredLine, ...betweenOut, nextPrompt]);
      setRuntimeInputIndex(nextIndex);
      return;
    }

    const tailOut = collectTerminalOutputBetween(language, code, currentLine, code.split("\n").length);
    setRuntimeTranscript((prev) => [...prev, enteredLine, ...tailOut]);

    const finalInputs: Record<string, string> = {};
    runtimeInputRequests.forEach((req, i) => {
      finalInputs[`input_${i + 1}`] = (runtimeInputValues[req.id] ?? "").trim();
    });
    await executeAnalysis(finalInputs);
  };

  const currentVars = activeStep !== null ? (steps[activeStep]?.variables ?? {}) : {};
  const activeLine = activeStep !== null && steps[activeStep] ? steps[activeStep].line : null;
  const waitingForRuntimeInput = runtimeInputRequests.length > 0 && runtimeInputIndex < runtimeInputRequests.length;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <div className="border-b border-border bg-card/60 backdrop-blur-md px-4 md:px-6 py-3 flex items-center gap-3 flex-wrap relative z-50">
        <div className="flex items-center gap-2.5 mr-4">
          <AfsvIcon className="w-5 h-5 text-foreground" />
          <h1 className="font-display font-semibold text-sm tracking-tight hidden md:block">recurrr</h1>
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm font-mono border border-border hover:border-foreground/20 transition-all duration-200"
          >
            {language}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
          </button>
          {langOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
              <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-xl overflow-hidden z-50 shadow-2xl max-h-64 overflow-y-auto min-w-[140px]">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`block w-full text-left px-4 py-2.5 text-sm font-mono transition-colors ${lang === language ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                      }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <ModeToggle />
          <Button size="sm" variant="outline" onClick={analyzeCode} disabled={running} className="gap-2 rounded-lg font-display text-xs">
            <Play className="h-3 w-3" /> {waitingForRuntimeInput ? "Enter" : "Run"}
          </Button>
          <Button size="sm" onClick={analyzeCode} disabled={running} className="gap-2 rounded-lg font-display text-xs">
            {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3" />}
            {waitingForRuntimeInput ? "Continue" : "Visualize"}
          </Button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 grid md:grid-cols-2 overflow-hidden">
        {/* Code Editor with syntax highlighting */}
        <div className="border-r border-border flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b border-border/50 flex items-center gap-2 bg-card/30">
            <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Editor</span>
            <span className="text-[10px] font-mono text-muted-foreground/50 ml-auto">{language.toLowerCase()}</span>
          </div>
          <div className="flex-1 overflow-auto relative bg-background">
            {isEditing ? (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onBlur={() => setIsEditing(false)}
                className="w-full h-full bg-transparent pl-14 pr-4 py-1 font-mono text-sm resize-none focus:outline-none leading-[1.75rem]"
                spellCheck={false}
                autoFocus
              />
            ) : (
              <div
                className="p-1 cursor-text min-h-full"
                onClick={() => setIsEditing(true)}
              >
                <SyntaxHighlighter code={code} language={language} activeLine={activeLine} />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col overflow-hidden">
          {/* Execution Steps */}
          <div className="flex-1 overflow-auto">
            <div className="px-4 py-2 border-b border-border/50 flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
              <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Execution Trace</span>
              {steps.length > 0 && (
                <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                  {steps.length} steps
                </span>
              )}
            </div>
            <div className="p-2 space-y-1">
              <AnimatePresence mode="popLayout">
                {steps.map((step, i) => (
                  <motion.div
                    key={`step-${step.step}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.12 }}
                    className={`rounded-xl border transition-all duration-150 ${i === activeStep
                      ? "border-border bg-card shadow-sm"
                      : "border-transparent hover:border-border/50 hover:bg-card/30"
                      }`}
                  >
                    <div
                      className="flex gap-2.5 items-start p-2.5 cursor-pointer"
                      onClick={() => {
                        setActiveStep(i);
                        toggleExpanded(i);
                      }}
                    >
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[10px] font-mono font-bold transition-colors ${i === activeStep ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                        }`}>
                        {step.step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-display font-medium leading-snug">{step.description}</p>
                        {step.code && (
                          <code className="text-[11px] font-mono text-muted-foreground mt-1 block truncate bg-secondary/50 px-2 py-0.5 rounded">
                            {step.code}
                          </code>
                        )}
                        <span className="text-[10px] font-mono text-muted-foreground/60 mt-0.5 block">line {step.line}</span>
                      </div>
                      <ChevronRight className={`h-3.5 w-3.5 text-muted-foreground/40 shrink-0 transition-transform duration-200 mt-1 ${expandedSteps.has(i) ? "rotate-90" : ""
                        }`} />
                    </div>

                    <AnimatePresence>
                      {expandedSteps.has(i) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <div className="px-2.5 pb-2.5 space-y-1.5">
                            {(step.purpose || step.explanation) && (
                              <ExplanationCard
                                icon={<Target className="h-3 w-3" />}
                                label="Purpose"
                                color="text-[hsl(var(--syntax-function))]"
                                text={step.purpose || step.explanation || ""}
                              />
                            )}
                            {step.importance && (
                              <ExplanationCard
                                icon={<Lightbulb className="h-3 w-3" />}
                                label="Importance"
                                color="text-[hsl(var(--syntax-number))]"
                                text={step.importance}
                              />
                            )}
                            {step.whatIfRemoved && (
                              <ExplanationCard
                                icon={<AlertTriangle className="h-3 w-3" />}
                                label="What If Removed?"
                                color="text-[hsl(var(--syntax-keyword))]"
                                text={step.whatIfRemoved}
                              />
                            )}
                            {step.concept && (
                              <ExplanationCard
                                icon={<BookOpen className="h-3 w-3" />}
                                label="Concept"
                                color="text-[hsl(var(--syntax-string))]"
                                text={step.concept}
                              />
                            )}
                            <div className="pt-1 flex justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-[11px] gap-1.5 rounded-md font-display"
                                onClick={() => goToTutorForStep(step)}
                              >
                                <MessageSquare className="h-3 w-3" />
                                Explain Concept In Tutor
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
              {steps.length === 0 && !running && (
                <div className="text-center py-20 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mx-auto">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-display">
                      Click <span className="font-semibold text-foreground">Visualize</span> to begin
                    </p>
                    <p className="text-xs text-muted-foreground/50 font-display mt-1">Line-by-line analysis with explanations</p>
                  </div>
                </div>
              )}
              {running && steps.length === 0 && <AnalysisLoader />}
              <div ref={stepsEndRef} />
            </div>
          </div>

          {/* Memory Panel */}
          <div className="border-t border-border">
            <div className="px-4 py-2 border-b border-border/50 flex items-center gap-2 bg-card/30">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Memory</span>
            </div>
            <div className="p-2.5 flex flex-wrap gap-1.5 min-h-[44px]">
              {Object.entries(currentVars).length > 0 ? (
                Object.entries(currentVars).map(([key, value]) => (
                  <motion.div
                    key={key}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="px-2 py-1 rounded-md bg-secondary border border-border/50 text-[11px] font-mono"
                  >
                    <span className="text-[hsl(var(--syntax-variable))]">{key}</span>
                    <span className="mx-1 text-muted-foreground/40">=</span>
                    <span className="text-foreground font-semibold">{String(value)}</span>
                  </motion.div>
                ))
              ) : (
                <span className="text-[10px] text-muted-foreground/40 font-mono">no variables</span>
              )}
            </div>
          </div>

          {/* Output */}
          <div className="border-t border-border">
            <div className="px-4 py-2 border-b border-border/50 flex items-center gap-2 bg-card/30">
              <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Output</span>
            </div>
            <div className="p-3 min-h-[44px]">
              {runtimeInputRequests.length > 0 && !running ? (
                <div className="space-y-2">
                  {runtimeTranscript.length > 0 && (
                    <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">{runtimeTranscript.join("\n")}</pre>
                  )}
                  {runtimeInputRequests[runtimeInputIndex] && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[hsl(var(--syntax-function))] shrink-0">
                        {`input_${runtimeInputIndex + 1} >`}
                      </span>
                      <input
                        value={runtimeInputValues[runtimeInputRequests[runtimeInputIndex].id] ?? ""}
                        onChange={(e) =>
                          setRuntimeInputValues((prev) => ({
                            ...prev,
                            [runtimeInputRequests[runtimeInputIndex].id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") void submitRuntimeInputs();
                        }}
                        className="flex-1 bg-secondary rounded-md px-2 py-1.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-foreground/20"
                        placeholder={runtimeInputRequests[runtimeInputIndex].label}
                        autoFocus
                      />
                    </div>
                  )}
                  <Button size="sm" className="text-xs rounded-lg mt-1" onClick={() => void submitRuntimeInputs()}>
                    Enter and Continue
                  </Button>
                </div>
              ) : output ? (
                <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">{output}</pre>
              ) : (
                <span className="text-[10px] text-muted-foreground/40 font-mono">
                  {running ? "running..." : "no output"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Small reusable card for explanation sections
const ExplanationCard = ({ icon, label, color, text }: { icon: React.ReactNode; label: string; color: string; text: string }) => (
  <div className="p-2.5 rounded-lg bg-secondary/50 border border-border/30">
    <div className={`flex items-center gap-1.5 mb-1 ${color}`}>
      {icon}
      <span className="text-[10px] font-display font-bold uppercase tracking-[0.15em]">{label}</span>
    </div>
    <p className="text-[12px] font-display text-foreground/80 leading-relaxed">{text}</p>
  </div>
);

export default VisualizerPage;
