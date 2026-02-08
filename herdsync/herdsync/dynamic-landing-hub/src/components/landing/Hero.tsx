import { ArrowRight, Play, Globe, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated star background */}
      <div className="absolute inset-0 star-field opacity-50" />
      
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Orbiting asteroid visual */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] pointer-events-none hidden lg:block">
        <div className="absolute inset-0 border border-primary/20 rounded-full" />
        <div className="absolute w-4 h-4 rounded-full bg-accent animate-orbit shadow-lg shadow-accent/50" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase rounded-full bg-primary/10 text-primary border border-primary/30">
            <AlertTriangle size={14} /> Real-Time NEO Monitoring
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          <span className="text-foreground">Track</span>{" "}
          <span className="gradient-text">Near-Earth</span>
          <br />
          <span className="text-foreground">Objects in</span>{" "}
          <span className="text-primary text-glow">Real-Time</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Cosmic Watch transforms complex NASA asteroid data into clear risk assessments,
          live alerts, and stunning 3D visualizations for researchers and space enthusiasts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" className="text-base px-8 gap-2 gradient-primary text-primary-foreground animate-pulse-glow">
            <Globe size={18} /> Launch Dashboard <ArrowRight size={18} />
          </Button>
          <Button size="lg" variant="outline" className="text-base px-8 gap-2 border-primary/30 hover:bg-primary/10">
            <Play size={18} /> Watch Demo
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "2,500+", label: "NEOs Tracked" },
            { value: "24/7", label: "Live Monitoring" },
            { value: "NASA", label: "Data Source" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-primary font-[Orbitron]">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
