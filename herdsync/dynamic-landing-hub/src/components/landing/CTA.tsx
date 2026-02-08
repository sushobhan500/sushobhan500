import { ArrowRight, Rocket, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section id="community" className="py-24 px-6 relative">
      <div className="absolute inset-0 star-field opacity-20" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl gradient-primary p-12 sm:p-16 text-center"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-secondary/20 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex p-4 rounded-2xl bg-white/10 mb-6">
            <Rocket className="h-10 w-10 text-primary-foreground" />
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-bold text-primary-foreground tracking-tight mb-4">
            Ready to Explore the Cosmos?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Join thousands of researchers, astronomers, and space enthusiasts already using Cosmic Watch.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-base px-8 gap-2 bg-background text-foreground hover:bg-background/90"
            >
              Launch App <ArrowRight size={18} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base px-8 gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <MessageCircle size={18} /> Join Community
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
