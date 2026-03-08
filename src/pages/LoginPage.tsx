import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AfsvIcon } from "@/components/AfsvIcon";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
          <div className="flex items-center gap-2.5 mb-2">
            <AfsvIcon className="w-5 h-5 text-foreground" />
            <span className="font-display font-semibold text-sm">recurrr</span>
          </div>
          <h1 className="text-xl font-bold font-display mt-4">Welcome back</h1>
          <p className="text-muted-foreground text-xs mt-1 font-display">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="font-display text-xs">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="font-display text-xs">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="rounded-lg" />
          </div>
          <Button type="submit" className="w-full rounded-lg font-display text-sm" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6 font-display">
          Don't have an account?{" "}
          <Link to="/signup" className="text-foreground hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
