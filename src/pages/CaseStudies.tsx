import { useState, useEffect } from "react";
import { getCaseStudies } from "../services/firebase";
import { CaseStudy } from "../types";
import { ArrowRight, CheckSquare, Zap, BookOpen, Clock, Layers, ArrowUpRight, ChevronRight, HelpCircle } from "lucide-react";

export default function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStudy, setActiveStudy] = useState<CaseStudy | null>(null);

  useEffect(() => {
    async function loadCaseStudies() {
      try {
        const loaded = await getCaseStudies();
        setCaseStudies(loaded);
        if (loaded.length > 0) {
          setActiveStudy(loaded[0]); // Default to first available study
        }
      } catch (e) {
        console.error("Failed loading case studies", e);
      } finally {
        setLoading(false);
      }
    }
    loadCaseStudies();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-brand-cyan border-r-2 border-brand-purple"></div>
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest animate-pulse font-medium">Analyzing Architectures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative px-6 md:px-8 max-w-[1580px] mx-auto py-12 md:py-20">
      
      {/* Page Title */}
      <section className="flex flex-col items-start gap-5 mb-16">
        <span className="font-mono text-xs uppercase tracking-widest text-brand-purple font-semibold">Operational Diagnostics</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-none">
          Work Case Studies
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl font-light leading-relaxed">
          Deep-dive assessments of client processes, showing how old manual workflows were audited, diagrammed, and entirely replaced with error-free software bridges.
        </p>
      </section>

      {caseStudies.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-mono text-sm border border-dashed border-white/10 rounded-3xl">
          No case studies logged yet in active CMS collections.
        </div>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Case Studies lists select tabs */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <span className="font-mono text-[10px] uppercase text-gray-500 font-semibold mb-1 block">Active Audits</span>
            {caseStudies.map((study, sIdx) => (
              <button
                key={study.id || sIdx}
                onClick={() => setActiveStudy(study)}
                className={`w-full p-5 text-left rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col gap-1.5 ${
                  activeStudy?.id === study.id
                    ? "bg-brand-cyan/8 border-brand-cyan/40 shadow-lg"
                    : "bg-dark-card/30 border-white/5 hover:bg-white/3 hover:border-white/10"
                }`}
              >
                <span className="font-mono text-[9px] uppercase tracking-wider text-brand-cyan">{study.client}</span>
                <span className="font-sans font-semibold text-white text-sm line-clamp-2 leading-snug">{study.title}</span>
                <span className="font-mono text-[9px] text-gray-500 mt-2 flex items-center justify-end gap-1 font-semibold">
                  Read Audit
                  <ChevronRight className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>

          {/* Right Case Study full view detail sheet */}
          {activeStudy && (
            <div className="lg:col-span-8 bg-dark-card/45 rounded-3xl border border-white/10 p-8 md:p-12 flex flex-col gap-8 shadow-2xl animate-fade-in">
              {/* Header metadata */}
              <div className="flex flex-col gap-3 border-b border-white/5 pb-6">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-cyan/15 border border-brand-cyan/35 text-brand-cyan font-mono text-[10px] font-semibold uppercase">
                    Client: {activeStudy.client}
                  </span>
                </div>
                <h2 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight leading-snug">{activeStudy.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{activeStudy.description}</p>
              </div>

              {/* Problem section */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-3 flex items-center gap-1.5 text-red-400 font-mono text-xs uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-red-400" />
                  <span>The Bottleneck</span>
                </div>
                <div className="md:col-span-9">
                  <p className="text-gray-300 text-sm leading-relaxed">{activeStudy.problem}</p>
                </div>
              </div>

              {/* Solution section */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-t border-white/5 pt-6">
                <div className="md:col-span-3 flex items-center gap-1.5 text-brand-cyan font-mono text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-brand-cyan" />
                  <span>The Solution</span>
                </div>
                <div className="md:col-span-9">
                  <p className="text-gray-300 text-sm leading-relaxed">{activeStudy.solution}</p>
                </div>
              </div>

              {/* Process section */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-t border-white/5 pt-6">
                <div className="md:col-span-3 flex items-center gap-1.5 text-brand-purple font-mono text-xs uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-brand-purple" />
                  <span>The Process</span>
                </div>
                <div className="md:col-span-9">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{activeStudy.process}</p>
                </div>
              </div>

              {/* Results metrics */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-t border-white/5 pt-6">
                <div className="md:col-span-3 flex items-center gap-1.5 text-emerald-400 font-mono text-xs uppercase tracking-wider">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  <span>Metrics & Results</span>
                </div>
                <div className="md:col-span-9 bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl">
                  <p className="text-gray-300 text-xs leading-relaxed font-semibold">{activeStudy.results}</p>
                </div>
              </div>

              {/* Lessons Learned */}
              {activeStudy.lessons && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-t border-white/5 pt-6">
                  <div className="md:col-span-3 flex items-center gap-1.5 text-yellow-400 font-mono text-xs uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-yellow-400" />
                    <span>Lessons Learned</span>
                  </div>
                  <div className="md:col-span-9">
                    <p className="text-gray-400 text-xs leading-relaxed italic">{activeStudy.lessons}</p>
                  </div>
                </div>
              )}

              {/* Tech Stack used */}
              <div className="border-t border-white/10 pt-6 mt-2 flex flex-wrap gap-2 items-center justify-between text-xs text-gray-500 font-mono">
                <div className="flex gap-1.5 flex-wrap items-center">
                  <span>Stack Node Integration:</span>
                  {activeStudy.techStack.map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5 text-[9px]">
                      {tech}
                    </span>
                  ))}
                </div>
                <span>Logged: {new Date(activeStudy.createdAt).toLocaleDateString()}</span>
              </div>

            </div>
          )}

        </section>
      )}

    </div>
  );
}
