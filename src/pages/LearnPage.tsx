import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight, CheckCircle2, Code2, ArrowRight, ArrowLeft, Trophy, Zap, HelpCircle, GraduationCap, Play, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import { allTracks } from "@/data/allTracks";
import { supabase } from "@/integrations/supabase/client";
import type { Question, LessonExample } from "@/data/pythonLessons";

// ── Quiz Section ──────────────────────────────────────────────────────
const QuizSection = ({ questions, onComplete }: { questions: Question[]; onComplete: () => void }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === q.answer) setScore(s => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) setFinished(true);
    else { setCurrent(c => c + 1); setSelected(null); setShowResult(false); }
  };

  if (finished) {
    return (
      <div className="p-5 text-center space-y-3">
        <Trophy className="h-8 w-8 mx-auto text-foreground" />
        <p className="font-display font-bold text-lg">{score}/{questions.length} Correct!</p>
        <p className="text-xs text-muted-foreground font-display">
          {score === questions.length ? "Perfect score! 🎉" : score >= 3 ? "Great job! 👏" : "Keep practicing! 💪"}
        </p>
        <Button size="sm" variant="outline" onClick={onComplete} className="rounded-xl text-xs font-display">Continue</Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[hsl(var(--syntax-function))]">
          <HelpCircle className="h-3.5 w-3.5" />
          <span className="text-[10px] font-display font-bold uppercase tracking-widest">Quiz</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">{current + 1}/{questions.length}</span>
      </div>
      <p className="text-sm font-display font-medium">{q.question}</p>
      <div className="space-y-1.5">
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => handleSelect(i)} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-display border transition-all ${
            showResult ? i === q.answer ? "border-green-500/50 bg-green-500/10 text-foreground" : i === selected ? "border-red-500/50 bg-red-500/10 text-foreground/60" : "border-border/30 text-foreground/40"
            : selected === i ? "border-foreground/30 bg-secondary" : "border-border/50 hover:border-foreground/20 hover:bg-card/50"
          }`}>{opt}</button>
        ))}
      </div>
      {showResult && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <p className="text-[11px] font-display text-muted-foreground leading-relaxed">{q.explanation}</p>
          <Button size="sm" onClick={next} className="rounded-xl text-xs font-display gap-1">
            {current + 1 >= questions.length ? "See Results" : "Next"} <ArrowRight className="h-3 w-3" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

const ExampleCard = ({ example, fallbackLanguage }: { example: LessonExample; fallbackLanguage: string }) => (
  <div className="p-4 rounded-xl bg-secondary/50 border border-border/30">
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-display font-semibold text-sm">{example.title}</h4>
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        {(example.language || fallbackLanguage).toLowerCase()}
      </span>
    </div>
    <p className="text-xs text-foreground/70 font-display mb-3 leading-relaxed">{example.explanation}</p>
    <div className="rounded-lg overflow-hidden border border-border/40 mb-3">
      <SyntaxHighlighter code={example.code} language={example.language || fallbackLanguage} activeLine={null} />
    </div>
    {example.expectedOutput && (
      <div>
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-1.5">Expected Output</span>
        <pre className="text-xs font-mono text-foreground/70 whitespace-pre-wrap">{example.expectedOutput}</pre>
      </div>
    )}
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────
const LearnPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const trackId = searchParams.get("track");
  const topicId = searchParams.get("topic");
  const lessonId = searchParams.get("lesson");

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [snippetCodes, setSnippetCodes] = useState<string[]>([]);
  const routerNavigate = useNavigate();

  // Load user & progress
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        supabase.from("lesson_progress").select("lesson_id").eq("user_id", data.user.id)
          .then(({ data: rows }) => {
            if (rows) setCompletedLessons(new Set(rows.map(r => r.lesson_id)));
          });
      }
    });
  }, []);

  const currentTrack = allTracks.find(t => t.id === trackId);
  const currentTopic = currentTrack?.topics.find(t => t.id === topicId);
  const currentLesson = currentTopic?.lessons.find(l => l.id === lessonId);

  const splitCodeIntoExamples = (code: string, language: string): string[] => {
    const lines = code.split("\n");
    const blocks: string[] = [];
    let current: string[] = [];

    const isCommentHeader = (line: string) => {
      const t = line.trim();
      if (!t) return false;
      if (language === "Python") return t.startsWith("# ");
      if (language === "Ruby") return t.startsWith("# ");
      return t.startsWith("//");
    };

    for (const line of lines) {
      if (isCommentHeader(line) && current.some((l) => l.trim() !== "")) {
        blocks.push(current.join("\n").trimEnd());
        current = [line];
      } else {
        current.push(line);
      }
    }

    if (current.some((l) => l.trim() !== "")) {
      blocks.push(current.join("\n").trimEnd());
    }

    return blocks.length > 1 ? blocks : [code];
  };

  const codeSections = useMemo(
    () => (currentLesson ? splitCodeIntoExamples(currentLesson.code, currentLesson.language) : []),
    [currentLesson?.code, currentLesson?.language]
  );

  useEffect(() => {
    setSnippetCodes(codeSections.map(() => ""));
  }, [currentLesson?.id, codeSections.length]);

  // All lessons flat for a track
  const allTrackLessons = useMemo(() => currentTrack?.topics.flatMap(t => t.lessons) ?? [], [currentTrack]);

  const navigate = (params: Record<string, string | null>) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) { if (v) next.set(k, v); }
    setSearchParams(next);
    setShowQuiz(false);
  };

  const markComplete = async (lid: string) => {
    setCompletedLessons(prev => new Set(prev).add(lid));
    if (userId && trackId) {
      await supabase.from("lesson_progress").upsert({ user_id: userId, track_id: trackId, lesson_id: lid }, { onConflict: "user_id,lesson_id" });
    }
  };

  // ── Library Dashboard ───────────────────────────────────────────────
  if (!trackId) {
    const totalLessons = allTracks.reduce((s, t) => s + t.topics.reduce((s2, tp) => s2 + tp.lessons.length, 0), 0);
    return (
      <div className="p-6 md:p-10 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <GraduationCap className="h-5 w-5" />
            <h1 className="font-display font-bold text-2xl tracking-tight">Learning Library</h1>
          </div>
          <p className="text-sm text-muted-foreground font-display mb-2">
            {allTracks.length} tracks · {totalLessons} lessons · From basics to advanced
          </p>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1.5 flex-1 max-w-xs bg-secondary rounded-full overflow-hidden">
              <motion.div className="h-full bg-foreground rounded-full" initial={{ width: 0 }} animate={{ width: `${(completedLessons.size / Math.max(totalLessons, 1)) * 100}%` }} />
            </div>
            <span className="text-xs font-mono text-muted-foreground">{completedLessons.size}/{totalLessons} complete</span>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allTracks.map((track, i) => {
            const trackLessons = track.topics.flatMap(t => t.lessons);
            const completed = trackLessons.filter(l => completedLessons.has(l.id)).length;
            return (
              <motion.button key={track.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => navigate({ track: track.id })}
                className="text-left p-5 rounded-2xl border border-border bg-card hover:border-foreground/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{track.icon}</span>
                  {completed === trackLessons.length && completed > 0 && <Trophy className="h-4 w-4 text-foreground" />}
                </div>
                <h3 className="font-display font-semibold text-base mb-1">{track.title}</h3>
                <p className="text-xs text-muted-foreground font-display mb-3 line-clamp-2">{track.description}</p>
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${(completed / Math.max(trackLessons.length, 1)) * 100}%` }} />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/60 mt-1.5 block">{completed}/{trackLessons.length} lessons · {track.topics.length} topics</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Track Topics ────────────────────────────────────────────────────
  if (trackId && !topicId && currentTrack) {
    const trackLessons = currentTrack.topics.flatMap(t => t.lessons);
    const completed = trackLessons.filter(l => completedLessons.has(l.id)).length;
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <button onClick={() => navigate({})} className="text-xs text-muted-foreground font-display hover:text-foreground transition-colors mb-6 flex items-center gap-1">← All Tracks</button>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{currentTrack.icon}</span>
          <h1 className="font-display font-bold text-xl tracking-tight">{currentTrack.title}</h1>
        </div>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1.5 flex-1 max-w-xs bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${(completed / Math.max(trackLessons.length, 1)) * 100}%` }} />
          </div>
          <span className="text-xs font-mono text-muted-foreground">{completed}/{trackLessons.length} complete</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {currentTrack.topics.map((topic, i) => {
            const done = topic.lessons.filter(l => completedLessons.has(l.id)).length;
            return (
              <motion.button key={topic.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => navigate({ track: trackId, topic: topic.id })}
                className="text-left p-5 rounded-2xl border border-border bg-card hover:border-foreground/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{topic.icon}</span>
                  {done === topic.lessons.length && done > 0 && <Trophy className="h-4 w-4 text-foreground" />}
                </div>
                <h3 className="font-display font-semibold text-sm mb-1">{topic.title}</h3>
                <p className="text-xs text-muted-foreground font-display mb-3">{topic.lessons.length} lessons</p>
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${(done / topic.lessons.length) * 100}%` }} />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/60 mt-1.5 block">{done}/{topic.lessons.length} complete</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Lesson List (with sidebar concept) ──────────────────────────────
  if (topicId && !lessonId && currentTopic && currentTrack) {
    return (
      <div className="p-6 md:p-10 max-w-3xl mx-auto">
        <button onClick={() => navigate({ track: trackId })} className="text-xs text-muted-foreground font-display hover:text-foreground transition-colors mb-6 flex items-center gap-1">← {currentTrack.title}</button>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">{currentTopic.icon}</span>
          <h1 className="font-display font-bold text-xl tracking-tight">{currentTopic.title}</h1>
        </div>
        <div className="space-y-2">
          {currentTopic.lessons.map((lesson, i) => (
            <motion.button key={lesson.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              onClick={() => navigate({ track: trackId, topic: topicId, lesson: lesson.id })}
              className="w-full text-left flex items-center gap-4 p-4 rounded-xl border border-border hover:border-foreground/20 hover:bg-card transition-all group"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold ${completedLessons.has(lesson.id) ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
                {completedLessons.has(lesson.id) ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-medium text-sm">{lesson.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{lesson.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ── Lesson Detail View ──────────────────────────────────────────────
  if (currentLesson && currentTopic && currentTrack) {
    const lessonIndex = currentTopic.lessons.findIndex(l => l.id === currentLesson.id);
    const prevLesson = currentTopic.lessons[lessonIndex - 1];
    const nextLesson = currentTopic.lessons[lessonIndex + 1];

    const quizQuestions: Question[] = [
      ...(currentLesson.questions || []),
      ...(currentLesson.advancedQuestions || []),
    ];
    const addLineToSnippet = (sectionIndex: number, line: string, _lineNumber: number) => {
      if (!line.trim()) return;
      setSnippetCodes((prev) => {
        const next = [...prev];
        const current = next[sectionIndex] || "";
        next[sectionIndex] = current ? `${current}\n${line}` : line;
        return next;
      });
    };

    const runSnippet = (sectionIndex: number) => {
      const finalCode = (snippetCodes[sectionIndex] || "").trim() || codeSections[sectionIndex] || currentLesson.code;
      routerNavigate(`/visualizer?lang=${encodeURIComponent(currentLesson.language)}&code=${encodeURIComponent(finalCode)}`);
    };

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header bar */}
        <div className="border-b border-border px-4 py-2.5 flex items-center gap-3 bg-card/30">
          <button onClick={() => navigate({ track: trackId, topic: topicId })} className="text-xs text-muted-foreground font-display hover:text-foreground transition-colors flex items-center gap-1">← {currentTopic.title}</button>
          <span className="text-xs text-muted-foreground/40 font-mono ml-auto">{lessonIndex + 1}/{currentTopic.lessons.length}</span>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left: Table of Contents Sidebar */}
          <div className="hidden lg:block w-60 border-r border-border overflow-auto bg-card/20 p-3 shrink-0">
            <h3 className="text-[10px] font-display font-bold uppercase tracking-widest text-muted-foreground mb-3 px-2">{currentTopic.title}</h3>
            <div className="space-y-0.5">
              {currentTopic.lessons.map((l, i) => (
                <button key={l.id} onClick={() => navigate({ track: trackId, topic: topicId, lesson: l.id })}
                  className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-display transition-colors ${
                    l.id === lessonId ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {completedLessons.has(l.id) ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <span className="w-3 text-center font-mono text-[10px] shrink-0">{i + 1}</span>}
                  <span className="truncate">{l.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Center: Content + Code */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Content */}
            <div className="flex-1 overflow-auto border-r border-border p-6 md:p-8">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{currentTopic.icon}</span>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Lesson {lessonIndex + 1}</span>
                </div>
                <h2 className="font-display font-bold text-xl mb-4">{currentLesson.title}</h2>

                <div className="prose-sm space-y-3">
                  {currentLesson.content.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="text-sm text-foreground/80 font-display leading-relaxed">
                      {paragraph.split(/(`[^`]+`)/).map((part, j) =>
                        part.startsWith("`") && part.endsWith("`") ? (
                          <code key={j} className="px-1.5 py-0.5 rounded bg-secondary text-[hsl(var(--syntax-keyword))] text-xs font-mono">{part.slice(1, -1)}</code>
                        ) : part.split(/(\*\*[^*]+\*\*)/).map((seg, k) =>
                          seg.startsWith("**") && seg.endsWith("**") ? (
                            <strong key={k} className="font-semibold text-foreground">{seg.slice(2, -2)}</strong>
                          ) : <span key={k}>{seg}</span>
                        )
                      )}
                    </p>
                  ))}
                </div>

                {/* Tips */}
                <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border/30">
                  <div className="flex items-center gap-1.5 mb-2 text-[hsl(var(--syntax-number))]">
                    <Zap className="h-3 w-3" />
                    <span className="text-[10px] font-display font-bold uppercase tracking-widest">Tips</span>
                  </div>
                  <ul className="space-y-1.5">
                    {currentLesson.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-foreground/70 font-display flex items-start gap-2">
                        <span className="text-muted-foreground/40 mt-0.5">•</span>{tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Extra examples */}
                {currentLesson.examples && currentLesson.examples.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-1.5 text-[hsl(var(--syntax-type))]">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-display font-bold uppercase tracking-widest">More Examples</span>
                    </div>
                    <div className="space-y-3">
                      {currentLesson.examples.map((example, idx) => (
                        <ExampleCard
                          key={`${currentLesson.id}-example-${idx}`}
                          example={example}
                          fallbackLanguage={currentLesson.language}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Expected output */}
                <div className="mt-4 p-4 rounded-xl bg-secondary/50 border border-border/30">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Expected Output</span>
                  <pre className="text-xs font-mono text-foreground/70 whitespace-pre-wrap">{currentLesson.expectedOutput}</pre>
                </div>

                {/* Quiz */}
                {quizQuestions.length > 0 && (
                  <div className="mt-6 rounded-xl border border-border overflow-hidden">
                    {!showQuiz ? (
                      <button onClick={() => setShowQuiz(true)} className="w-full p-4 flex items-center gap-3 hover:bg-card/50 transition-colors">
                        <HelpCircle className="h-4 w-4 text-[hsl(var(--syntax-function))]" />
                        <span className="font-display font-medium text-sm">Take the Quiz ({quizQuestions.length} questions)</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                      </button>
                    ) : (
                      <QuizSection questions={quizQuestions} onComplete={() => setShowQuiz(false)} />
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right: Code */}
            <div className="flex-1 flex flex-col overflow-hidden lg:max-w-[50%]">
              <div className="px-4 py-2 border-b border-border/50 flex items-center gap-2 bg-card/30">
                <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Try It Yourself</span>
                <span className="text-[10px] font-mono text-muted-foreground/50 ml-auto">{currentLesson.language.toLowerCase()}</span>
              </div>
              <div className="flex-1 overflow-auto bg-background p-2 space-y-4">
                {codeSections.map((sectionCode, sectionIndex) => (
                  <div key={`section-${sectionIndex}`} className="rounded-xl border border-border/50 overflow-hidden bg-card/20">
                    {codeSections.length > 1 && (
                      <div className="px-3 py-1.5 border-b border-border/50 bg-secondary/30">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                          Example {sectionIndex + 1}
                        </span>
                      </div>
                    )}
                    <div className="p-1">
                      <SyntaxHighlighter
                        code={sectionCode}
                        language={currentLesson.language}
                        activeLine={null}
                        onLineAction={(line, lineNumber) => addLineToSnippet(sectionIndex, line, lineNumber)}
                        lineActionLabel="Add"
                      />
                    </div>
                    <div className="border-t border-border p-3 space-y-2 bg-card/20">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Line Runner</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-auto h-7 text-[10px] gap-1"
                          onClick={() =>
                            setSnippetCodes((prev) => {
                              const next = [...prev];
                              next[sectionIndex] = "";
                              return next;
                            })
                          }
                        >
                          <Eraser className="h-3 w-3" /> Clear
                        </Button>
                      </div>
                      <textarea
                        value={snippetCodes[sectionIndex] || ""}
                        onChange={(e) =>
                          setSnippetCodes((prev) => {
                            const next = [...prev];
                            next[sectionIndex] = e.target.value;
                            return next;
                          })
                        }
                        placeholder="Click Add next to lines to build a snippet..."
                        className="w-full h-24 bg-secondary rounded-lg px-3 py-2 font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-[11px]"
                          onClick={() =>
                            setSnippetCodes((prev) => {
                              const next = [...prev];
                              next[sectionIndex] = sectionCode;
                              return next;
                            })
                          }
                        >
                          Use This Example
                        </Button>
                        <Button size="sm" className="h-8 text-[11px] gap-1.5 ml-auto" onClick={() => runSnippet(sectionIndex)}>
                          <Play className="h-3 w-3" /> Run Snippet
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {codeSections.length === 0 && (
                  <div className="text-xs text-muted-foreground/60 font-mono p-4">No code available</div>
                )}
              </div>

              {/* Bottom actions */}
              <div className="border-t border-border p-4 flex items-center gap-3 flex-wrap">
                {prevLesson && (
                  <Button variant="outline" size="sm" onClick={() => navigate({ track: trackId, topic: topicId, lesson: prevLesson.id })} className="gap-1 rounded-xl font-display text-xs">
                    <ArrowLeft className="h-3 w-3" /> Previous
                  </Button>
                )}
                {!completedLessons.has(currentLesson.id) ? (
                  <Button onClick={() => markComplete(currentLesson.id)} size="sm" className="gap-2 rounded-xl font-display text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Mark Complete
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-display text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-foreground" /> Completed
                  </div>
                )}
                {nextLesson ? (
                  <Button variant="outline" size="sm" onClick={() => navigate({ track: trackId, topic: topicId, lesson: nextLesson.id })} className="gap-1 rounded-xl font-display text-xs ml-auto">
                    Next <ArrowRight className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => navigate({ track: trackId, topic: topicId })} className="gap-1 rounded-xl font-display text-xs ml-auto">
                    All Lessons <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LearnPage;
