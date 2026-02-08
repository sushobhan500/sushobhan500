import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Telescope, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import spaceBg from "@/assets/space-bg.jpg";

type Role = "researcher" | "enthusiast";

export default function Auth() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("enthusiast");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { role: selectedRole },
          },
        });
        if (error) throw error;
        toast.success("Check your email for a verification link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/dashboard",
      });
      if (result.error) throw result.error;
    } catch (err: any) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center"
      style={{
        backgroundImage: `url(${spaceBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-background/80" />

      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Back</span>
      </button>

      <motion.div
        className="relative z-10 w-full max-w-md glass rounded-2xl p-8 mx-4 box-glow"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full gradient-cosmic" />
          <h1 className="font-display text-2xl font-bold text-glow">
            {isSignUp ? "Join Cosmic Watch" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {isSignUp
              ? "Create your account to start tracking NEOs"
              : "Sign in to your monitoring dashboard"}
          </p>
        </div>

        {/* Google Sign In */}
        <Button
          variant="outline"
          className="w-full mb-6 border-primary/30 hover:bg-primary/10"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-cosmic-deep px-3 text-muted-foreground">
              or continue with email
            </span>
          </div>
        </div>

        {/* Role Selection (sign up only) */}
        {isSignUp && (
          <div className="mb-6">
            <Label className="text-sm text-muted-foreground mb-3 block">
              I am a...
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("researcher")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  selectedRole === "researcher"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                <FlaskConical className="h-6 w-6" />
                <span className="font-display text-xs tracking-wider">
                  Researcher
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("enthusiast")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  selectedRole === "enthusiast"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                <Telescope className="h-6 w-6" />
                <span className="font-display text-xs tracking-wider">
                  Enthusiast
                </span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="astronaut@nasa.gov"
              required
              className="mt-1 bg-secondary/50 border-border"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-sm text-muted-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="mt-1 bg-secondary/50 border-border"
            />
          </div>
          <Button type="submit" className="w-full font-display text-xs tracking-widest" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
