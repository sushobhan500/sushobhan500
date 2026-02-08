import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Bell, 
  Box, 
  MessageCircle, 
  Eye, 
  Database 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "User Authentication",
    description: "Secure login for researchers and enthusiasts to save watched asteroids and set custom alert parameters.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: Activity,
    title: "Real-Time Data Feed",
    description: "Live integration with NASA NeoWs API showing current asteroids, velocity, and distance from Earth.",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
  {
    icon: AlertTriangle,
    title: "Risk Analysis Engine",
    description: "Categorizes asteroids by hazardous status, diameter, and missed distance with clear risk scores.",
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
  },
  {
    icon: Bell,
    title: "Alert & Notifications",
    description: "Built-in scheduling to notify users of upcoming close approach events via the dashboard.",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
  },
  {
    icon: Box,
    title: "3D Visualization",
    description: "Interactive 3D view using Three.js to show asteroid orbits relative to Earth in real-time.",
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/20",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Chat",
    description: "Discuss specific asteroids with the community in live threads using WebSocket technology.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: Eye,
    title: "Asteroid Watchlist",
    description: "Track specific objects with personalized monitoring and receive custom approach alerts.",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
  {
    icon: Database,
    title: "Docker Deployment",
    description: "Fully containerized with Docker Compose for frontend, backend, and database orchestration.",
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/20",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="absolute inset-0 star-field opacity-20" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest font-[Orbitron]">
            Platform Features
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
            Complete <span className="gradient-text">NEO Monitoring</span> Suite
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to track, analyze, and understand Near-Earth Objects.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <Card className={`group hover:box-glow hover:-translate-y-1 transition-all duration-300 bg-card/50 backdrop-blur-sm h-full border ${feature.border}`}>
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-xl ${feature.bg} mb-4`}>
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{feature.description}</p>
                  <Button variant="ghost" size="sm" className={`px-0 ${feature.color} hover:opacity-80`}>
                    Learn more →
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
