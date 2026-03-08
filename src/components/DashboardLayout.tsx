import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Eye, BookOpen, MessageSquare, Save, User, LogOut, Menu, X, Zap, GraduationCap, GitBranch, Layers, Columns, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AfsvIcon } from "@/components/AfsvIcon";
import { ModeToggle } from "@/components/ModeToggle";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/visualizer", label: "Code Visualizer", icon: Eye },
  { to: "/algorithms", label: "Algorithm Visualizer", icon: Zap },
  { to: "/recursion", label: "Recursion Tree", icon: GitBranch },
  { to: "/memory", label: "Memory Visualizer", icon: Layers },
  { to: "/machine", label: "Code to Machine", icon: Cpu },
  { to: "/compare", label: "Compare Algorithms", icon: Columns },
  { to: "/learn", label: "Learn Code", icon: GraduationCap },
  { to: "/examples", label: "Examples", icon: BookOpen },
  { to: "/tutor", label: "AI Tutor", icon: MessageSquare },
  { to: "/saved", label: "Saved", icon: Save },
  { to: "/profile", label: "Profile", icon: User },
];

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-56 bg-card border-r border-border flex flex-col transition-transform duration-200 md:translate-x-0 md:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2.5">
            <AfsvIcon className="w-6 h-6 text-foreground" />
            <span className="font-display font-semibold text-sm tracking-tight">recurrr</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-auto">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-display transition-colors",
                location.pathname === item.to
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border flex flex-col gap-2">
          <div className="px-3 py-1 flex items-center justify-between">
            <span className="text-[13px] font-display text-muted-foreground">Appearance</span>
            <ModeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-display text-muted-foreground hover:text-foreground hover:bg-secondary w-full transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-background/50 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
