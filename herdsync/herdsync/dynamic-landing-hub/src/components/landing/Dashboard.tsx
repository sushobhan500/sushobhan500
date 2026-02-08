import { 
  Globe, 
  AlertTriangle, 
  Activity, 
  Eye,
  ArrowRight 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const dashboardFeatures = [
  {
    icon: Activity,
    title: "Live Feed",
    description: "Real-time asteroid tracking with velocity and distance metrics updated continuously.",
    stats: "2,847 Active",
  },
  {
    icon: AlertTriangle,
    title: "Hazard Status",
    description: "Instant risk classification showing potentially hazardous objects with color-coded alerts.",
    stats: "127 Hazardous",
  },
  {
    icon: Eye,
    title: "Watchlist",
    description: "Track specific asteroids and receive personalized approach notifications.",
    stats: "Custom Alerts",
  },
  {
    icon: Globe,
    title: "3D Orbit View",
    description: "Interactive visualization of asteroid trajectories relative to Earth's orbit.",
    stats: "Three.js",
  },
];

export function Dashboard() {
  return (
    <section id="dashboard" className="py-24 px-6 relative">
      <div className="absolute inset-0 star-field opacity-15" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest font-[Orbitron]">
            Dashboard Preview
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
            Mission <span className="gradient-text">Control Center</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive monitoring interface designed for clarity and real-time awareness.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {dashboardFeatures.map((feature, i) => (
              <Card 
                key={feature.title} 
                className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors"
              >
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <div className="text-xs font-bold text-accent font-[Orbitron] hidden sm:block">
                    {feature.stats}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Button size="lg" className="w-full gradient-primary text-primary-foreground mt-6 gap-2">
              Access Dashboard <ArrowRight size={18} />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden box-glow">
              <div className="p-4 border-b border-border/50 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="ml-4 text-xs text-muted-foreground font-[Orbitron]">COSMIC WATCH v1.0</span>
              </div>
              <div className="p-6 flex items-center justify-center h-full relative">
                {/* Simulated dashboard content */}
                <div className="absolute inset-6 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                    <div className="text-xs text-muted-foreground">Active NEOs</div>
                    <div className="text-2xl font-bold text-primary font-[Orbitron]">2,847</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-3/4 gradient-primary rounded-full" />
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                    <div className="text-xs text-muted-foreground">Hazardous</div>
                    <div className="text-2xl font-bold text-destructive font-[Orbitron]">127</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-1/4 bg-destructive rounded-full" />
                    </div>
                  </div>
                  <div className="col-span-2 rounded-lg bg-muted/50 p-3 flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 border border-primary/30 rounded-full" />
                      <div className="absolute inset-4 border border-accent/30 rounded-full" />
                      <div className="absolute inset-8 border border-secondary/30 rounded-full" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary animate-pulse" />
                      <div className="absolute w-2 h-2 rounded-full bg-accent animate-orbit" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
