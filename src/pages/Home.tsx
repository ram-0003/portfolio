import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSiteSettings, getProjects, getServices, getBlogPosts, seedDatabaseIfEmpty } from "../services/firebase";
import { Project, Service, BlogPost, SiteSettings } from "../types";
import { ArrowRight, Cpu, Zap, FolderOpen, Code, Layers, Sparkles, Workflow, ArrowUpRight, GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import profilePhoto from "../assets/images/profile_photo_1782095816672.jpg";

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Try to seed data on-demand if Firestore is fresh
        await seedDatabaseIfEmpty();
        
        const [loadedSettings, loadedProjects, loadedServices, loadedPosts] = await Promise.all([
          getSiteSettings(),
          getProjects(),
          getServices(),
          getBlogPosts()
        ]);
        setSettings(loadedSettings);
        setProjects(loadedProjects);
        setServices(loadedServices.slice(0, 6)); // Display leading 6 categories
        setPosts(loadedPosts.slice(0, 3)); // Display leading 3 posts
      } catch (e) {
        console.error("Home data failed to load:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = [
    { label: "Completed Projects", value: "45+", icon: FolderOpen },
    { label: "Processes Automated", value: "110+", icon: Workflow },
    { label: "Tech Stack Modules", value: "24+", icon: Code },
    { label: "Hours Shaved / Month", value: "340h", icon: Zap }
  ];

  const technologies = [
    { name: "React", category: "Frontend" },
    { name: "TypeScript", category: "Languages" },
    { name: "Node.js (Express)", category: "Backend" },
    { name: "PostgreSQL & Firestore", category: "Databases" },
    { name: "OpenAI & Gemini API", category: "AI Systems" },
    { name: "n8n.io", category: "Workflows" },
    { name: "Make.com", category: "Integrations" },
    { name: "Flutter", category: "Mobile" },
    { name: "Docker & Serverless", category: "DevOps" }
  ];

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-brand-cyan border-r-2 border-brand-purple"></div>
          <p className="font-mono text-xs text-gray-500 animate-pulse uppercase tracking-widest">Compiling Assets...</p>
        </div>
      </div>
    );
  }

  const WriteJadhag = projects.find(p => p.title === "WriteJadhag") || projects[0];

  return (
    <div className="w-full relative px-6 md:px-8">
      {/* Dynamic ambient background glowing objects */}
      <div className="absolute top-[10%] left-[20%] w-96 h-96 rounded-full bg-brand-cyan/5 blur-3xl -z-10 pointer-events-none animate-pulse"></div>
      <div className="absolute top-[40%] right-[10%] w-96 h-96 rounded-full bg-brand-purple/5 blur-3xl -z-10 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-7xl mx-auto">
        <div className="lg:col-span-7 flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping"></span>
            <span className="font-mono text-xs uppercase tracking-wider text-brand-cyan font-medium">Open for contract work</span>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05]">
            Building Web Applications & <span className="text-gradient">Automations</span> That Replace Manual Work.
          </h1>

          <p className="text-gray-400 text-lg md:text-xl font-sans font-light leading-relaxed max-w-2xl">
            {settings?.subtitle || "I help businesses streamline operations through custom web applications, AI-powered solutions, and workflow automations that save time and eliminate repetitive tasks."}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2">
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 text-center rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-display font-semibold text-base transition-all shadow-lg shadow-indigo-600/25 duration-200"
            >
              Let's Build Your Solution
            </Link>
            <Link
              to="/projects"
              className="w-full sm:w-auto px-8 py-4 text-center rounded-full bg-white/5 hover:bg-white/8 text-white border border-white/10 font-display font-medium text-base transition-all duration-200"
            >
              View My Work
            </Link>
          </div>
        </div>

        {/* Professional profile photo card */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-[380px] aspect-square rounded-[32px] border border-white/10 overflow-hidden bg-dark-card/25 backdrop-blur-lg shadow-2xl p-3 group">
            {/* Elegant glass card and lightning backglow */}
            <div className="absolute inset-x-0 -top-40 h-80 bg-indigo-500/25 blur-[70px] rounded-full pointer-events-none -z-10 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="w-full h-full rounded-[24px] overflow-hidden border border-white/5 relative bg-[#09090b]">
              <img
                src={profilePhoto}
                alt="Ramachandran S."
                className="w-full h-full object-cover grayscale-[10%] brightness-[96%] group-hover:scale-103 duration-700 transition-transform"
                referrerPolicy="no-referrer"
              />
              
              {/* Elegant overlay badge with human-readable, professional typography */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-5 pt-12 flex flex-col gap-1">
                <div className="font-display font-medium text-xl text-white leading-tight tracking-tight">
                  Ramachandran S.
                </div>
                <div className="font-mono text-[10px] uppercase text-indigo-400 tracking-wider">
                  Automation & Web Systems Architect
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Row */}
      <section className="py-12 bg-dark-card/25 backdrop-blur-md rounded-3xl border border-white/5 max-w-7xl mx-auto my-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/5">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex flex-col items-center justify-center p-4">
                <Icon className="w-5 h-5 text-brand-cyan mb-2 opacity-80" />
                <span className="font-display font-medium text-3xl md:text-4xl text-white tracking-tight">{stat.value}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider mt-1 text-center font-mono">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Services Showcase */}
      <section className="py-20 max-w-7xl mx-auto">
        <div className="text-center flex flex-col items-center gap-4 mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Engineered Capabilities
          </h2>
          <p className="text-gray-400 text-base max-w-2xl">
            Custom web, backend, and integration strategies designed to streamline manual operational tasks and automate digital growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <div key={idx} className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between h-80">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-cyan mb-5">
                  {service.title.includes("Web") && <Code className="w-5 h-5" />}
                  {(service.title.includes("Android") || service.title.includes("Flutter") || service.title.includes("Mobile")) && <Layers className="w-5 h-5" />}
                  {service.title.includes("API") && <Cpu className="w-5 h-5" />}
                  {service.title.includes("AI") && <Sparkles className="w-5 h-5" />}
                  {service.title.includes("n8n") && <Workflow className="w-5 h-5" />}
                  {!service.title.includes("Web") && !service.title.includes("Android") && !service.title.includes("Flutter") && !service.title.includes("Mobile") && !service.title.includes("API") && !service.title.includes("AI") && !service.title.includes("n8n") && <Layers className="w-5 h-5" />}
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{service.description}</p>
              </div>

              <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-xs text-brand-purple font-mono">
                <span>View Specs</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-full hover:bg-white/5 text-sm font-medium text-brand-cyan transition-all border border-brand-cyan/20">
            View All Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Featured Project Showcase */}
      {WriteJadhag && (
        <section className="py-20 max-w-7xl mx-auto border-t border-white/5">
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-brand-cyan mb-2 block">Featured System</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Spotlight: WriteJadhag
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-dark-card/45 rounded-3xl border border-white/5 overflow-hidden p-8 md:p-12">
            <div className="flex flex-col items-start gap-6">
              <span className="px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan font-mono text-xs">
                {WriteJadhag.category}
              </span>
              <h3 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
                {WriteJadhag.title}
              </h3>
              <p className="text-gray-400 hover:text-gray-300 text-base leading-relaxed">
                {WriteJadhag.description}
              </p>

              <div className="flex flex-wrap gap-2 py-2">
                {WriteJadhag.techStack.map((tech, i) => (
                  <span key={i} className="px-3 py-1 rounded-md bg-white/5 text-gray-400 border border-white/5 font-mono text-xs">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 w-full sm:w-auto pt-2">
                <Link
                  to={`/projects`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-brand-cyan text-dark-bg font-display font-bold text-sm transition-all shadow-md hover:shadow-brand-cyan/15 w-full sm:w-auto"
                >
                  Explore Features
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-white/10 group aspect-video">
              <img 
                src="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200&auto=format&fit=crop" 
                alt="WriteJadhag Astrological calculations" 
                className="object-cover w-full h-full duration-700 group-hover:scale-103"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-dark-bg via-transparent to-transparent opacity-60"></div>
            </div>
          </div>
        </section>
      )}

      {/* Technology Showcase Row */}
      <section className="py-20 border-t border-white/5 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 flex flex-col justify-center items-start gap-4">
            <div className="p-2 rounded-2xl bg-white/5 border border-white/8 text-brand-purple">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-3xl text-white tracking-tight leading-tight">
              The Blueprint Stack
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              I curate high-performance frameworks and enterprise automation tools to ensure maximum stability and responsiveness.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {technologies.map((tech, idx) => (
              <div key={idx} className="bg-dark-card/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-1 hover:border-brand-cyan/25 transition-all">
                <span className="font-sans font-semibold text-white text-base">{tech.name}</span>
                <span className="font-mono text-[10px] uppercase text-gray-500 tracking-wider font-medium">{tech.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 max-w-7xl mx-auto border-t border-white/5 text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 animate-bounce">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight max-w-2xl leading-none">
          Ready to Automatize and Replace Your Manual Workload?
        </h2>
        <p className="text-gray-400 text-base max-w-md">
          Don't lose another hour to typing and routing data. Let's design, engineer, and host a custom automated system tailored exactly for your requirements.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
          <Link
            to="/contact"
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-semibold rounded-full text-base tracking-wide transition-all shadow-lg shadow-indigo-600/25 duration-200"
          >
            Let's Build Your Solution
          </Link>
          <Link
            to="/about"
            className="w-full sm:w-auto px-8 py-4 border border-white/10 text-white rounded-full text-base tracking-wide hover:bg-white/5 transition-all duration-200"
          >
            Read Story
          </Link>
        </div>
      </section>
    </div>
  );
}
