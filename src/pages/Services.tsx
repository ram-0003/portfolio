import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getServices } from "../services/firebase";
import { Service } from "../types";
import { Check, Code, Layers, Cpu, Sparkles, Workflow, ArrowRight, MousePointer, HelpCircle } from "lucide-react";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const loaded = await getServices();
        setServices(loaded);
      } catch (e) {
        console.error("Failed loading services panel", e);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-brand-cyan border-r-2 border-brand-purple"></div>
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest animate-pulse">Routing Pipelines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative px-6 md:px-8 max-w-[1580px] mx-auto py-12 md:py-20">
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-brand-cyan/5 blur-3xl -z-10 pointer-events-none"></div>

      {/* Header section */}
      <section className="flex flex-col items-start gap-5 mb-16 md:mb-24">
        <span className="font-mono text-xs uppercase tracking-widest text-brand-cyan">Operational Solutions</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-none">
          Professional Service Offerings
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl font-light leading-relaxed max-w-2xl">
          I build custom-engineered software engines and visual automation structures that save business owners manual operational overhead and secure their digital pipelines.
        </p>
      </section>

      {/* Services Grid */}
      <section className="flex flex-col gap-12">
        {services.map((service, index) => (
          <div 
            key={service.id || index} 
            className="bg-dark-card/40 hover:bg-dark-card/60 transition-all duration-300 rounded-3xl border border-white/5 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start hover:border-brand-cyan/20"
          >
            {/* Title / Description */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-brand-cyan">
                {service.title.includes("Web") && <Code className="w-6 h-6" />}
                {(service.title.includes("Android") || service.title.includes("Flutter") || service.title.includes("Mobile")) && <Layers className="w-6 h-6" />}
                {service.title.includes("API") && <Cpu className="w-6 h-6" />}
                {service.title.includes("AI") && <Sparkles className="w-6 h-6" />}
                {service.title.includes("Automation") || service.title.includes("n8n") || service.title.includes("Make") ? <Workflow className="w-6 h-6" /> : null}
                {!service.title.includes("Web") && !service.title.includes("Android") && !service.title.includes("Flutter") && !service.title.includes("Mobile") && !service.title.includes("API") && !service.title.includes("AI") && !service.title.includes("Automation") && !service.title.includes("n8n") && !service.title.includes("Make") && <HelpCircle className="w-6 h-6" />}
              </div>
              <h2 className="font-display font-medium text-2xl text-white tracking-tight">{service.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
              
              {/* Tech stack badges */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {service.techStack.map((tech, ti) => (
                  <span key={ti} className="font-mono text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits list */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500 font-semibold">Business Outcomes</h3>
              <ul className="flex flex-col gap-3">
                {service.benefits.map((benefit, bi) => (
                  <li key={bi} className="flex items-start gap-2.5 text-sm text-gray-300 leading-relaxed">
                    <Check className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Use Cases & CTA */}
            <div className="lg:col-span-4 flex flex-col gap-6 justify-between h-full">
              <div className="flex flex-col gap-3">
                <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500 font-semibold">Typical Use Cases</h3>
                <ul className="flex flex-col gap-1.5 text-xs text-gray-400 font-mono">
                  {service.useCases.map((uc, ui) => (
                    <li key={ui} className="list-disc list-inside hover:text-gray-300">
                      {uc}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Inquiry routing button */}
              <Link
                to={`/contact?service=${encodeURIComponent(service.title)}`}
                className="inline-flex justify-center items-center gap-2 w-full px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white font-display text-sm font-medium hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200"
              >
                Inquire about {service.title}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Trust banner */}
      <section className="mt-20 p-8 rounded-3xl bg-indigo-500/5 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h4 className="font-sans font-medium text-white text-base">Unsure which pipeline solution matches your workflow?</h4>
          <p className="text-gray-400 text-sm">Schedule a free 15-minute system architecture audit conversation.</p>
        </div>
        <Link 
          to="/contact?service=Consultation" 
          className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-display font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 duration-200"
        >
          Book An Audit Call
        </Link>
      </section>
    </div>
  );
}
