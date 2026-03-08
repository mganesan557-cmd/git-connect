import { Link } from "react-router-dom";
import { Eye, MessageSquare, Clock, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

const quickActions = [
  { to: "/visualizer", label: "Open Visualizer", icon: Eye, description: "Paste code and visualize execution" },
  { to: "/tutor", label: "AI Tutor", icon: MessageSquare, description: "Ask questions about code" },
  { to: "/examples", label: "Examples", icon: Play, description: "Learn from curated examples" },
];

const recentSessions = [
  { title: "Binary Search Implementation", language: "Python", time: "2 hours ago" },
  { title: "Fibonacci Recursion", language: "JavaScript", time: "Yesterday" },
  { title: "Bubble Sort Algorithm", language: "C++", time: "3 days ago" },
];

const DashboardHome = () => {
  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display tracking-tight mb-0.5">Dashboard</h1>
        <p className="text-sm text-muted-foreground font-display mb-8">Welcome back to recurrr</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-3 mb-10">
        {quickActions.map((action, i) => (
          <motion.div key={action.to} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link to={action.to} className="glass-card p-5 block group hover:border-foreground/15 transition-all duration-200">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mb-3 group-hover:bg-foreground group-hover:text-background transition-colors">
                <action.icon className="h-4 w-4" />
              </div>
              <h3 className="font-display font-semibold text-sm mb-0.5">{action.label}</h3>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold font-display">Recent Sessions</h2>
          <Link to="/saved" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-display">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-1.5">
          {recentSessions.map((session, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="glass-card px-4 py-3 flex items-center justify-between"
            >
              <div>
                <h4 className="font-display font-medium text-[13px]">{session.title}</h4>
                <p className="text-[10px] text-muted-foreground font-mono">{session.language}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                <Clock className="h-3 w-3" />
                {session.time}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
