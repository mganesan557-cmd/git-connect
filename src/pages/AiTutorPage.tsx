import { useState, useRef, useEffect } from "react";
import { Send, User, Trash2, Heart } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { streamChat, ChatMessage } from "@/lib/streamChat";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import { AfsvIcon } from "@/components/AfsvIcon";

const CHAT_HISTORY_KEY = "ai-tutor-chat-history-v1";
const initialMessages: ChatMessage[] = [
  { role: "assistant", content: "Hi! I'm your **AI Code Tutor**. Ask me anything about algorithms, data structures, code concepts, or paste any code and I'll explain how it works." },
];

const AiTutorPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoPromptSent, setAutoPromptSent] = useState(false);
  const [likedAssistantMessages, setLikedAssistantMessages] = useState<Record<number, boolean>>({});
  const endRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAT_HISTORY_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ChatMessage[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setMessages(parsed);
      }
    } catch {
      // Ignore malformed local cache.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch {
      // Ignore storage quota errors.
    }
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const appendAssistantChunk = (chunk: string) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === "assistant") {
        const next = [...prev];
        next[next.length - 1] = { ...last, content: `${last.content}${chunk}` };
        return next;
      }
      return [...prev, { role: "assistant", content: chunk }];
    });
  };

  const sendMessage = async (rawInput: string) => {
    if (!rawInput.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: rawInput };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (rawInput === input) setInput("");
    setLoading(true);

    try {
      await streamChat({
        messages: newMessages.filter(m => m !== initialMessages[0]),
        onDelta: appendAssistantChunk,
        onDone: () => {
          setLoading(false);
        },
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

  const handleSend = async () => {
    await sendMessage(input);
  };

  useEffect(() => {
    const prompt = searchParams.get("q");
    if (!prompt || autoPromptSent) return;

    setAutoPromptSent(true);
    setInput(prompt);
    void sendMessage(prompt);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("q");
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, autoPromptSent]);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border px-6 py-3 flex items-center justify-between">
        <h1 className="font-display font-semibold text-sm flex items-center gap-2">
          <AfsvIcon className="h-4 w-4" /> AI Tutor Chat
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setMessages(initialMessages);
            setLikedAssistantMessages({});
            localStorage.removeItem(CHAT_HISTORY_KEY);
          }}
          className="text-xs gap-1.5"
        >
          <Trash2 className="h-3 w-3" /> Clear
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8 space-y-8">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="w-10 h-10 rounded-xl bg-secondary border border-border/50 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <motion.div
                  animate={loading && i === messages.length - 1 ? { rotate: 360 } : { rotate: 0 }}
                  transition={loading && i === messages.length - 1 ? { duration: 1.1, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
                >
                  <AfsvIcon className="h-5 w-5 text-foreground" />
                </motion.div>
              </div>
            )}
            <div
              className={`max-w-3xl px-5 py-4 rounded-2xl text-[15px] font-display leading-relaxed ${msg.role === "user"
                ? "bg-primary text-primary-foreground ml-auto rounded-tr-sm shadow-md hover:shadow-lg transition-shadow"
                : "glass-card w-full rounded-tl-sm border-border/40 shadow-sm hover:shadow-md transition-shadow"
                }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-p:leading-relaxed prose-pre:p-0 prose-invert max-w-none text-foreground/90 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 marker:text-foreground [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:mb-5 [&>ul]:my-5 [&>ul]:space-y-2">
                  <ReactMarkdown
                    components={{
                      code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return match ? (
                          <div className="rounded-xl overflow-hidden border border-border/60 my-5 bg-[#0a0a0a] shadow-lg">
                            <div className="px-4 py-2 border-b border-border/40 bg-zinc-900/50 flex items-center justify-between">
                              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{match[1]}</span>
                            </div>
                            <div className="py-2 overflow-x-auto">
                              <SyntaxHighlighter
                                code={String(children).replace(/\n$/, "")}
                                language={match[1]}
                              />
                            </div>
                          </div>
                        ) : (
                          <code className="bg-secondary/80 text-foreground px-1.5 py-0.5 rounded-md font-mono text-[0.85em] border border-border/50" {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}

              {msg.role === "assistant" && (
                <div className="mt-4 pt-3 border-t border-border/40 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-2.5 rounded-lg text-[11px] gap-1.5 ${likedAssistantMessages[i] ? "text-rose-500" : "text-muted-foreground"}`}
                    onClick={() =>
                      setLikedAssistantMessages((prev) => ({
                        ...prev,
                        [i]: !prev[i],
                      }))
                    }
                  >
                    <Heart className={`h-3.5 w-3.5 ${likedAssistantMessages[i] ? "fill-current" : ""}`} />
                    {likedAssistantMessages[i] ? "Liked" : "Like"}
                  </Button>
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
          </motion.div>
        ))}
        {loading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary border border-border/50 flex items-center justify-center shrink-0 mt-1 shadow-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
              >
                <AfsvIcon className="h-5 w-5 text-foreground/70" />
              </motion.div>
            </div>
            <div className="glass-card w-full max-w-3xl px-5 py-4 rounded-2xl rounded-tl-sm border-border/40 shadow-sm flex items-center h-[56px]">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-border p-4">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask about any code concept..."
            className="flex-1 bg-secondary rounded-xl px-4 py-3 text-sm font-display focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()} size="icon" className="rounded-xl h-11 w-11">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiTutorPage;
