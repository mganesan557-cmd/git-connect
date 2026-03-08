import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ProfilePage = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");

  const handleSave = () => {
    toast.success("Profile updated");
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display tracking-tight mb-1">Profile</h1>
        <p className="text-muted-foreground font-display mb-8">Manage your account settings</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs font-mono uppercase">Visualizations</span>
          </div>
          <p className="text-2xl font-display font-bold">24</p>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs font-mono uppercase">Saved Sessions</span>
          </div>
          <p className="text-2xl font-display font-bold">3</p>
        </div>
      </div>

      {/* Form */}
      <div className="glass-card p-6 space-y-5">
        <div className="space-y-2">
          <Label className="font-display text-sm flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-muted-foreground" /> Full Name
          </Label>
          <Input value={name} onChange={e => setName(e.target.value)} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label className="font-display text-sm flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email
          </Label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label className="font-display text-sm flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-muted-foreground" /> Password
          </Label>
          <Input type="password" placeholder="••••••••" className="rounded-xl" />
        </div>
        <Button onClick={handleSave} className="rounded-xl font-display">Save changes</Button>
      </div>
    </div>
  );
};

export default ProfilePage;
