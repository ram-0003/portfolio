import { Link } from "react-router-dom";
import { Mail, Phone, ExternalLink, Linkedin, Github, MessageSquare } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-24 border-t border-white/5 bg-dark-card/30 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo Brand Frame */}
          <div className="md:col-span-2">
            <h3 className="font-display font-bold text-lg text-white tracking-tight">
              Ramachandran S
            </h3>
            <p className="mt-4 text-gray-400 text-sm max-w-sm leading-relaxed">
              Full-Stack Developer & workflow automation expert. Designing elegant systems, Custom APIs, and AI integrations that delete manual operational workloads.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a 
                href="https://github.com/ramachandran-s" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-full bg-white/5 border border-white/5 hover:border-brand-cyan/30 text-gray-400 hover:text-brand-cyan transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/in/ramchandrans/" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-full bg-white/5 border border-white/5 hover:border-brand-cyan/30 text-gray-400 hover:text-brand-cyan transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links block */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase text-gray-300 tracking-widest mb-4">
              Explore Console
            </h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
              <Link to="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link>
              <Link to="/projects" className="text-gray-400 hover:text-white transition-colors">Projects</Link>
              <Link to="/case-studies" className="text-gray-400 hover:text-white transition-colors">Case Studies</Link>
              <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
              <Link to="/admin" className="text-gray-400 hover:text-brand-cyan transition-colors font-mono text-xs">Admin Login</Link>
            </div>
          </div>

          {/* Direct channels */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase text-gray-300 tracking-widest mb-4">
              Direct Channels
            </h4>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <a 
                href="mailto:ramachandran85966@gmail.com" 
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-brand-cyan shrink-0" />
                <span className="truncate">ramachandran85966@gmail.com</span>
              </a>
              <a 
                href="tel:+919080347710" 
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-brand-purple shrink-0" />
                <span>+91 9080347710</span>
              </a>
              <a 
                href="https://wa.me/919080347710" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 font-mono">
            &copy; {currentYear} Ramachandran S. All systems nominal.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
            <span>Powered by Firestore CMS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
