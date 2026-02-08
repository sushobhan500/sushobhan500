import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Globe, Activity } from "lucide-react";
import type { User } from "@supabase/supabase-js";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/auth");
      else setUser(session.user);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
      else setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full gradient-cosmic" />
          <span className="font-display text-lg font-bold tracking-wider">
            COSMIC WATCH
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {user.email}
          </span>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>

      <main className="p-6 lg:p-12">
        <h1 className="font-display text-3xl font-bold mb-2 text-glow">
          Mission Control
        </h1>
        <p className="text-muted-foreground mb-8">
          Welcome back, Commander. Your NEO monitoring dashboard is active.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="font-display text-sm tracking-wider">NEAR-EARTH OBJECTS</h3>
            </div>
            <p className="text-3xl font-bold text-primary">—</p>
            <p className="text-xs text-muted-foreground mt-1">Connect NASA API to see live data</p>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-5 w-5 text-warning" />
              <h3 className="font-display text-sm tracking-wider">HAZARDOUS</h3>
            </div>
            <p className="text-3xl font-bold text-warning">—</p>
            <p className="text-xs text-muted-foreground mt-1">Potentially dangerous asteroids</p>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-5 w-5 text-success" />
              <h3 className="font-display text-sm tracking-wider">CLOSEST APPROACH</h3>
            </div>
            <p className="text-3xl font-bold text-success">—</p>
            <p className="text-xs text-muted-foreground mt-1">Nearest object today</p>
          </div>
        </div>
      </main>
    </div>
  );
}
