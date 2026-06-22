import { useState, useEffect } from "react";
import { getSiteSettings, getSkills } from "../services/firebase";
import { Skill, SiteSettings } from "../types";
import { Terminal, Command, CheckSquare, Target, Cpu, Workflow, GraduationCap } from "lucide-react";

export default function About() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAbout() {
      try {
        const [loadedSettings, loadedSkills] = await Promise.all([
          getSiteSettings(),
          getSkills()
        ]);
        setSettings(loadedSettings);
        setSkills(loadedSkills);
      } catch (e) {
        console.error("About page loaded with fallbacks", e);
      } finally {
        setLoading(false);
      }
    }
    loadAbout();
  }, []);

  const philosophy = [
    {
      title: "Zero Manual Overhead",
      description: "Any task done more than twice must be committed to code. I build programs to wipe out busywork, freeing human talent for premium goals.",
      icon: CheckSquare
    },
    {
      title: "Framer-Grade Precision",
      description: "Software should look as polished as it runs. I adhere to ultra-clean, high-density layouts, clear focus fields, and smooth animation loops.",
      icon: Terminal
    },
    {
      title: "Real Integrations Only",
      description: "No vaporware or superficial placeholders. I engineer genuine backend bridges, full OAuth handshakes, and strict API data validations.",
      icon: Cpu
    }
  ];

  const milestones = [
    {
      year: "2024 - Present",
      title: "Bespoke System Developer & Automations Specialist",
      company: "Contractual Consultations",
      desc: "Architecting custom web applications, multi-channel automated workflows with n8n/Make, and deep API integrations matching enterprise security standards."
    },
    {
      year: "2023",
      title: "Full-Stack Software Engineer",
      company: "Web Solutions Group",
      desc: "Built scalable CRM widgets and single-page apps using React, Node.js, and relational schema blueprints."
    },
    {
      year: "2021 - 2022",
      title: "UI/UX & Mobile Developer Apprentice",
      company: "Freelance / Self-education & Audits",
      desc: "Delved into visual system grids, Material styling, Flutter cross-platform architecture, and custom API connections."
    }
  ];

  const skillCategories = [
    "Workflow Automation",
    "AI / Smart Integrations",
    "Web Development",
    "API / Backend",
    "Mobile App Development"
  ] as const;

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-brand-cyan border-r-2 border-brand-purple"></div>
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest animate-pulse">Decompressing Stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative px-6 md:px-8 max-w-[1580px] mx-auto py-12 md:py-20">
      
      {/* Intro block */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 flex flex-col items-start gap-6">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-cyan">The Story</span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-none">
            About Ramachandran S
          </h1>
          <p className="text-gray-300 text-lg font-light leading-relaxed">
            {settings?.bio || "Experienced full-stack developer and solution architect specialized in identifying manual operational bottlenecks and replacing them with high-reliability automated pipelines, bespoke web tools, and cutting-edge artificial intelligence agents."}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            I approach software not as a series of code files, but as custom-built business machines. For small businesses, founders, and startups, repetitive tasks like sorting invoices, typing client emails, or copy-pasting tracking sheets represent leaked revenue and wasted hours. My goal is to build automated systems that return those hours back to your business balance sheet.
          </p>
        </div>

        {/* Contact panel box on the side */}
        <div className="lg:col-span-5 bg-dark-card/40 rounded-3xl border border-white/5 p-8 backdrop-blur-md flex flex-col gap-6">
          <h3 className="font-display font-semibold text-lg text-white">Direct Coordinates</h3>
          <div className="flex flex-col gap-4 font-mono text-xs text-gray-400">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-gray-500 uppercase">Primary Email:</span>
              <a href="mailto:ramachandran85966@gmail.com" className="text-brand-cyan hover:underline hover:text-white">ramachandran85966@gmail.com</a>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-gray-500 uppercase">WhatsApp:</span>
              <a href="https://wa.me/919080347710" className="text-brand-cyan hover:underline hover:text-white">+91 9080347710</a>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-gray-500 uppercase">GitHub Profile:</span>
              <a href="https://github.com/ramachandran-s" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-brand-cyan hover:underline">/ramachandran-s</a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 uppercase">LinkedIn Profile:</span>
              <a href="https://www.linkedin.com/in/ramchandrans/" target="_blank" rel="noreferrer" className="text-brand-purple hover:underline hover:text-white">/ramchandrans</a>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Row */}
      <section className="py-20 border-t border-white/5 mt-20">
        <h2 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight mb-12">
          Development Philosophy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {philosophy.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-dark-card/20 border border-white/5 rounded-2xl p-6 flex flex-col gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-sans font-semibold text-white text-base">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dynamic Skills categories */}
      <section className="py-20 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-brand-purple block mb-1">Capacities Matrix</span>
            <h2 className="font-display font-bold text-3xl text-white tracking-tight">Tech Stack & Tools Expertise</h2>
          </div>
          <p className="text-gray-400 text-sm max-w-sm">
            Self-updating list of languages, automation stacks, and frameworks used in production workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat, idx) => {
            const catSkills = skills.filter(s => s.category === cat);
            if (catSkills.length === 0) return null;
            return (
              <div key={idx} className="bg-dark-card/30 border border-white/5 rounded-3xl p-6 hover:border-brand-cyan/20 transition-colors">
                <span className="font-mono text-[10px] uppercase text-brand-cyan tracking-widest font-medium mb-3 block">{cat}</span>
                <div className="flex flex-col gap-3">
                  {catSkills.map((skill, si) => (
                    <div key={si} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs text-gray-300">
                        <span className="font-medium">{skill.name}</span>
                        <span className="font-mono text-[10px] text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1">
                        <div 
                          className="bg-gradient-to-r from-brand-cyan to-brand-purple h-1 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Career Timeline Milestones */}
      <section className="py-20 border-t border-white/5">
        <h2 className="font-display font-bold text-3xl text-white tracking-tight mb-12 text-center md:text-left">
          Timeline Milestones
        </h2>
        <div className="relative border-l border-white/10 ml-4 md:ml-6 flex flex-col gap-10">
          {milestones.map((milestone, idx) => (
            <div key={idx} className="relative pl-8 group">
              <span className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-cyan group-hover:scale-130 transition-transform"></span>
              <span className="font-mono text-xs text-brand-purple font-semibold">{milestone.year}</span>
              <h3 className="font-sans font-medium text-lg text-white mt-1">{milestone.title}</h3>
              <span className="text-gray-500 font-mono text-xs">{milestone.company}</span>
              <p className="text-gray-400 text-sm mt-2 max-w-2xl leading-relaxed">{milestone.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
