import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Trash2, Code2, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type SavedSession = {
  id: string;
  algorithm_id: string;
  algorithm_name: string;
  input_data: string;
  steps_json: unknown[];
  created_at: string;
  title: string | null;
};

const SavedSessionsPage = () => {
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSessions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("saved_algorithm_sessions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load sessions");
    } else {
      setSessions((data as unknown as SavedSession[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchSessions(); }, []);

  const deleteSession = async (id: string) => {
    const { error } = await supabase.from("saved_algorithm_sessions").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete session");
    } else {
      setSessions(prev => prev.filter(s => s.id !== id));
      toast.success("Session deleted");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display tracking-tight mb-1">Saved Sessions</h1>
        <p className="text-muted-foreground font-display mb-8">Your saved algorithm visualizations</p>
      </motion.div>

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground font-display">
          <Code2 className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No saved sessions yet</p>
          <p className="text-xs mt-1 text-muted-foreground/50">Run an algorithm visualization and click Save to get started</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 flex flex-col cursor-pointer hover:border-foreground/20 transition-colors"
              onClick={() => navigate(`/algorithms?load=${session.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-secondary flex items-center gap-1">
                  <Zap className="h-2.5 w-2.5" />
                  {session.algorithm_name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <h3 className="font-display font-semibold mb-1">{session.title || session.algorithm_name}</h3>
              <p className="text-xs text-muted-foreground font-mono mb-3">
                {(session.steps_json as unknown[]).length} steps • Input: {session.input_data.slice(0, 40)}{session.input_data.length > 40 ? "..." : ""}
              </p>
              <div className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {new Date(session.created_at).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSessionsPage;
