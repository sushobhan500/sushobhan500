import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Telescope, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EarthGlobe from "@/components/EarthGlobe";
import spaceBg from "@/assets/space-bg.jpg";

const features = [
  {
    icon: Telescope,
    title: "Real-Time Tracking",
    desc: "Live data from NASA NeoWs API showing asteroids passing near Earth.",
  },
  {
    icon: Shield,
    title: "Risk Analysis",
    desc: "Automated hazard classification with proximity-based risk scores.",
  },
  {
    icon: Zap,
    title: "Smart Alerts",
    desc: "Get notified about close-approach events before they happen.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${spaceBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/70" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full gradient-cosmic" />
          <span className="font-display text-lg font-bold tracking-wider text-foreground">
            COSMIC WATCH
          </span>
        </div>
        <Button
          onClick={() => navigate("/auth")}
          className="font-display text-xs tracking-widest"
        >
          Sign In
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex min-h-[calc(100vh-72px)] flex-col lg:flex-row items-center px-6 lg:px-12">
        {/* Left content */}
        <motion.div
          className="flex-1 max-w-xl py-12 lg:py-0"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-glow">
            Monitor Near-Earth Objects in{" "}
            <span className="text-primary">Real Time</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Track asteroids, analyze impact risks, and receive alerts — all
            powered by live NASA data. Join researchers and enthusiasts
            safeguarding our planet.
          </p>
          <div className="mt-8 flex gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="font-display text-xs tracking-widest"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="font-display text-xs tracking-widest border-primary/30 text-primary hover:bg-primary/10"
            >
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* 3D Earth */}
        <motion.div
          className="flex-1 h-[400px] lg:h-[600px] w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <EarthGlobe />
        </motion.div>
      </div>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 px-6 lg:px-12 py-20"
      >
        <motion.h2
          className="text-center font-display text-3xl font-bold mb-16 text-glow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why Cosmic Watch?
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass rounded-xl p-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <f.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 lg:px-12 pb-20 text-center">
        <motion.div
          className="glass rounded-2xl p-12 max-w-3xl mx-auto box-glow"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Ready to explore the cosmos?
          </h2>
          <p className="text-muted-foreground mb-8">
            Sign up as a Researcher or Enthusiast and start tracking today.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="font-display text-xs tracking-widest"
          >
            Join Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
