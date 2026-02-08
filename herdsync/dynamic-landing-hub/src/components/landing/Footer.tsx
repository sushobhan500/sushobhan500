import { Rocket, Github, Twitter } from "lucide-react";

const footerLinks = [
  {
    title: "Platform",
    links: ["Dashboard", "Features", "Asteroid Feed", "3D Visualization"],
  },
  {
    title: "Resources",
    links: ["API Docs", "NASA NeoWs", "Research Hub", "Community"],
  },
  {
    title: "Project",
    links: ["About", "Tech Stack", "Contribute", "Docker Setup"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Data Usage", "Credits"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 py-16 px-6 relative">
      <div className="absolute inset-0 star-field opacity-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Rocket size={16} className="text-primary-foreground" />
              </div>
              <span className="text-lg font-bold font-[Orbitron]">
                <span className="text-primary">COSMIC</span>WATCH
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Real-time Near-Earth Object monitoring for researchers and space enthusiasts.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary/20 transition-colors">
                <Github size={18} className="text-muted-foreground hover:text-primary" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary/20 transition-colors">
                <Twitter size={18} className="text-muted-foreground hover:text-primary" />
              </a>
            </div>
          </div>
          
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-semibold text-sm mb-4 font-[Orbitron] text-primary">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Cosmic Watch. Built for space safety awareness.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by <span className="text-primary">NASA NeoWs API</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
