import { UserPlus, Satellite, BarChart3, BellRing } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up securely to access personalized asteroid tracking and custom alerts.",
  },
  {
    step: "02",
    icon: Satellite,
    title: "Connect to NASA",
    description: "Platform fetches live asteroid data from NASA NeoWs API automatically.",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "Analyze Risks",
    description: "View risk scores, trajectories, and hazard classifications for each NEO.",
  },
  {
    step: "04",
    icon: BellRing,
    title: "Get Alerts",
    description: "Receive notifications when watched asteroids approach Earth.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 star-field opacity-10" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest font-[Orbitron]">
            How It Works
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
            Start <span className="text-primary text-glow">Monitoring</span> in Minutes
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-5 relative z-10 box-glow">
                <item.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-xs font-bold text-primary font-[Orbitron] mb-2">{item.step}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
