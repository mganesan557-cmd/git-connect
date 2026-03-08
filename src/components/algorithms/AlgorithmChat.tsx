import { useState, useRef, useEffect } from "react";
import { Send, Bot, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { streamChat, ChatMessage } from "@/lib/streamChat";
import { AlgorithmInfo } from "@/lib/algorithms";

interface AlgorithmChatProps {
  algorithm: AlgorithmInfo;
}

const ALGO_CHAT_HISTORY_KEY = "algorithm-chat-history-v1";

const AlgorithmChat = ({ algorithm }: AlgorithmChatProps) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const prevAlgoId = useRef(algorithm.id);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`${ALGO_CHAT_HISTORY_KEY}:${algorithm.id}`);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ChatMessage[];
      if (Array.isArray(parsed)) setMessages(parsed);
    } catch {
      // Ignore malformed local cache.
    }
  }, [algorithm.id]);

  useEffect(() => {
    try {
      localStorage.setItem(`${ALGO_CHAT_HISTORY_KEY}:${algorithm.id}`, JSON.stringify(messages));
    } catch {
      // Ignore storage quota errors.
    }
  }, [algorithm.id, messages]);

  // Reset chat when algorithm changes
  useEffect(() => {
    if (prevAlgoId.current !== algorithm.id) {
      prevAlgoId.current = algorithm.id;
    }
  }, [algorithm.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length === newMessages.length + 1) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: newMessages,
        algorithmContext: {
          name: algorithm.name,
          category: algorithm.category,
          description: algorithm.description,
          timeComplexity: algorithm.timeComplexity,
          spaceComplexity: algorithm.spaceComplexity,
        },
        onDelta: upsertAssistant,
        onDone: () => setLoading(false),
        onError: (err) => {
          toast.error(err);
          setLoading(false);
        },
      });
    } catch {
      toast.error("Failed to connect to AI tutor");
      setLoading(false);
    }
  };

  const quickQuestions = [
    `How does ${algorithm.name} work?`,
    `Why is the time complexity ${algorithm.timeComplexity.worst}?`,
    `When should I use ${algorithm.name}?`,
  ];

  return (
    <>
      {/* Toggle button */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button onClick={() => setOpen(true)} size="icon" className="h-12 w-12 rounded-full shadow-lg">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] rounded-2xl border border-border bg-background shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="border-b border-border px-4 py-3 flex items-center justify-between bg-card/60">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-[hsl(var(--syntax-function))]" />
                <span className="font-display font-semibold text-xs">Ask about {algorithm.name}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-3 space-y-3">
              {messages.length === 0 && (
                <div className="space-y-2 pt-4">
                  <p className="text-xs text-muted-foreground font-display text-center mb-3">Quick questions:</p>
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(q); }}
                      className="block w-full text-left px-3 py-2 rounded-lg bg-secondary hover:bg-accent text-xs font-display transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-3 w-3" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-xs prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 text-xs">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="bg-secondary px-3 py-2 rounded-xl">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.2s" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder={`Ask about ${algorithm.name}...`}
                  className="flex-1 bg-secondary rounded-lg px-3 py-2 text-xs font-display focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <Button onClick={handleSend} disabled={loading || !input.trim()} size="icon" className="rounded-lg h-8 w-8">
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AlgorithmChat;
