import { useState, useEffect } from "react";
import { getProjects } from "../services/firebase";
import { Project } from "../types";
import { Search, Globe, Github, Layers, ArrowUpRight, X, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const loaded = await getProjects();
        setProjects(loaded);
        setFilteredProjects(loaded);
      } catch (e) {
        console.error("Projects retrieval error", e);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  useEffect(() => {
    let result = projects;
    
    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory || p.type === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.techStack.some(t => t.toLowerCase().includes(q))
      );
    }

    setFilteredProjects(result);
  }, [searchQuery, selectedCategory, projects]);

  const categories = ["All", "Web Application", "Workflow Automation", "API Integration", "Mobile UI"];

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-brand-cyan border-r-2 border-brand-purple"></div>
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest animate-pulse">Scanning Code Bases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative px-6 md:px-8 max-w-7xl mx-auto py-12 md:py-20">
      
      {/* Page Title */}
      <section className="flex flex-col items-start gap-5 mb-12">
        <span className="font-mono text-xs uppercase tracking-widest text-brand-cyan">Engineering Showrooms</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-none">
          Systems Portfolio
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl leading-relaxed font-light">
          Concrete systems designed and deployed to substitute tedious manual spreadsheet trackers, coordinates reference charts, and messaging pipelines.
        </p>
      </section>

      {/* Interactive Controls Row */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 border-b border-white/5 pb-8">
        
        {/* Category switcher */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-display text-xs tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/40 font-medium"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search query input */}
        <div className="relative w-full md:w-80">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search keywords or systems tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-card/50 border border-white/8 rounded-full py-2.5 pl-11 pr-5 text-sm text-white focus:outline-hidden focus:border-brand-cyan/60 font-mono transition-all"
          />
        </div>

      </section>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-mono text-sm border border-dashed border-white/10 rounded-3xl">
          No automation modules match query parameters.
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, idx) => (
            <div 
              key={project.id || idx} 
              className="bg-dark-card/35 hover:bg-dark-card/55 transition-all duration-300 rounded-3xl border border-white/5 overflow-hidden flex flex-col justify-between hover:border-brand-cyan/25 hover:shadow-2xl hover:shadow-brand-cyan/5 group"
            >
              <div>
                {/* Simulated frame / Top image */}
                <div className="relative aspect-video w-full overflow-hidden border-b border-white/5 bg-neutral-900/40">
                  <img 
                    src={project.images?.[0] || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"} 
                    alt={project.title} 
                    className="object-cover w-full h-full duration-500 group-hover:scale-102"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-dark-bg/90 via-transparent to-transparent"></div>
                  <span className="absolute bottom-4 left-4 px-2.5 py-1 rounded bg-brand-cyan/10 border border-brand-cyan/40 text-brand-cyan font-mono text-[10px] uppercase font-semibold">
                    {project.category || project.type}
                  </span>
                </div>

                {/* Info and descriptives */}
                <div className="p-6 md:p-8 flex flex-col gap-3">
                  <h3 className="font-display font-medium text-xl text-white group-hover:text-brand-cyan transition-colors">{project.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{project.description}</p>
                  
                  {/* Tech stack row */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.techStack.map((tech, ti) => (
                      <span key={ti} className="font-mono text-[9px] px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer actions */}
              <div className="px-6 md:px-8 pb-6 pt-2 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => setActiveProject(project)}
                  className="font-display font-semibold text-xs text-brand-purple hover:text-brand-cyan transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  Inspect Case Blueprint
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-3">
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noreferrer" title="Demo Link" className="text-gray-400 hover:text-white transition-colors">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" title="Source Files" className="text-gray-400 hover:text-white transition-colors">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </section>
      )}

      {/* Expandable Project Specs Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-bg/85 backdrop-blur-md">
          <div 
            className="w-full max-w-4xl bg-dark-card border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[85vh]"
          >
            {/* Modal header frame */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-cyan" />
                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-semibold">System Blueprint Summary</span>
              </div>
              <button 
                onClick={() => setActiveProject(null)} 
                className="p-1.5 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal content body (scrollable) */}
            <div className="p-8 flex-1 overflow-y-auto flex flex-col gap-8">
              
              <div className="flex flex-col gap-3">
                <span className="font-mono text-xs text-brand-cyan uppercase tracking-wider">{activeProject.type}</span>
                <h2 className="font-display font-bold text-3xl text-white tracking-tight">{activeProject.title}</h2>
                <p className="text-gray-300 text-base leading-relaxed">{activeProject.description}</p>
              </div>

              {/* Long form details */}
              {activeProject.content && (
                <div className="bg-white/2 border border-white/5 p-5 rounded-2xl flex flex-col gap-2">
                  <h4 className="font-sans font-semibold text-white text-sm">System Mechanics</h4>
                  <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{activeProject.content}</p>
                </div>
              )}

              {/* Challenges vs. Results bento section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-2xl flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <h4 className="font-sans font-semibold text-sm">Operational Challenge</h4>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{activeProject.challenges}</p>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <h4 className="font-sans font-semibold text-sm">System Outcome Achieved</h4>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{activeProject.results}</p>
                </div>
              </div>

              {/* Features list */}
              {activeProject.features?.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-gray-500">Core Modular Features</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeProject.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed bg-white/2 p-2 px-3.5 rounded-full border border-white/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0 mt-1.5"></span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specs and tags */}
              <div className="flex flex-wrap gap-4 items-center justify-between border-t border-white/5 pt-6 text-xs text-gray-400 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Stack:</span>
                  <div className="flex flex-wrap gap-1">
                    {activeProject.techStack.map((t, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5 text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <span>Created: {new Date(activeProject.createdAt).toLocaleDateString()}</span>
              </div>

            </div>

            {/* Modal footer credentials */}
            <div className="px-6 py-4 border-t border-white/10 bg-white/3 flex items-center justify-end gap-3">
              {activeProject.githubUrl && (
                <a 
                  href={activeProject.githubUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-4 py-2 border border-white/10 rounded-full text-xs text-gray-300 hover:text-white hover:bg-white/5 inline-flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub Codebase
                </a>
              )}
              {activeProject.demoUrl && (
                <a 
                  href={activeProject.demoUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-4 py-2 rounded-full bg-brand-cyan text-dark-bg font-semibold text-xs hover:scale-102 transition-transform inline-flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Live Integration Demo
                </a>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
