import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Brain, Layers, MessageSquare, ArrowRight, Eye, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import DemoVisualizer from "@/components/DemoVisualizer";
import { AfsvIcon } from "@/components/AfsvIcon";
import { ModeToggle } from "@/components/ModeToggle";

const features = [
  {
    icon: Brain,
    title: "AI Code Explanations",
    description: "Line-by-line explanations of how your code executes. Purpose, importance, and what breaks if removed.",
  },
  {
    icon: Layers,
    title: "Multi-Language Support",
    description: "Python, JavaScript, Java, C, C++, Go, Rust, Ruby, and more — all with real-time visualization.",
  },
  {
    icon: Eye,
    title: "Memory Visualization",
    description: "Watch variables change in real-time as your program steps through each line of execution.",
  },
  {
    icon: MessageSquare,
    title: "AI Tutor",
    description: "Ask questions about any code concept and get instant, intelligent explanations.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <AfsvIcon className="w-6 h-6 text-foreground" />
            <span className="font-display font-semibold text-sm tracking-tight">recurrr</span>
          </Link>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-display text-xs">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="font-display text-xs rounded-full px-5">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 dot-grid">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/60 backdrop-blur mb-8">
              <AfsvIcon className="w-3.5 h-3.5 text-foreground" />
              <span className="text-[10px] font-mono text-muted-foreground tracking-[0.15em] uppercase">AI-Powered Code Learning</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6 font-display">
              See how your code
              <br />
              <span className="text-gradient">actually runs.</span>
            </h1>
            <p className="text-base text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed font-display">
              Visualize execution step-by-step. Watch variables change.
              Understand every line with AI explanations.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/visualizer">
                <Button size="lg" className="rounded-full px-8 gap-2 font-display text-sm">
                  <Play className="h-3.5 w-3.5" /> Start Visualizing
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="lg" className="rounded-full px-8 gap-2 font-display text-sm">
                  Create Account <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <DemoVisualizer />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-display mb-3">
              Everything you need to understand code
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto font-display">
              Execution visualization, memory tracking, and AI tutoring — all in one place.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="glass-card p-6 group hover:border-foreground/15 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-foreground group-hover:text-background transition-colors">
                  <feature.icon className="h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold font-display mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-display">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AfsvIcon className="w-4 h-4 text-muted-foreground" />
            <span className="font-display text-xs text-muted-foreground">recurrr</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground font-display">
            <Link to="/visualizer" className="hover:text-foreground transition-colors">Visualizer</Link>
            <Link to="/examples" className="hover:text-foreground transition-colors">Examples</Link>
            <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
