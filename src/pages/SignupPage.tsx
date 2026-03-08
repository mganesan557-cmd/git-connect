import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AfsvIcon } from "@/components/AfsvIcon";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name }, emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Check your email to confirm.");
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
          <h1 className="text-xl font-bold font-display mt-4">Create your account</h1>
          <p className="text-muted-foreground text-xs mt-1 font-display">Start visualizing code for free</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="font-display text-xs">Full Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required className="rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="font-display text-xs">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="font-display text-xs">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" minLength={6} required className="rounded-lg" />
          </div>
          <Button type="submit" className="w-full rounded-lg font-display text-sm" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6 font-display">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
