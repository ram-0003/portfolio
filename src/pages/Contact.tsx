import { useState, useEffect, FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { addContactMessage } from "../services/firebase";
import { Mail, Phone, MessageSquare, Linkedin, CheckCircle2, AlertCircle, Command } from "lucide-react";
import { motion } from "motion/react";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check if dynamic pre-fill parameters are supplied
    const prefilledService = searchParams.get("service");
    const prefilledTitle = searchParams.get("title");
    
    if (prefilledService) {
      if (prefilledService === "Consultation" || prefilledService === "AutomationConsultation") {
        setMessage(`Hi Ramachandran, I would like to schedule a 15-minute system architecture audit call for my business operational pipelines. ${prefilledTitle ? `I read your article: "${prefilledTitle}" and would love to integrate a similar system.` : ""}`);
      } else {
        setMessage(`Hi Ramachandran, I am interested in inquiring about your "${prefilledService}" service offerings for my company.`);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Light validations
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage("Please complete all required fields (Name, Email, and Message).");
      return;
    }

    setSubmitting(true);
    try {
      // Structure exact document satisfying strict Firestore Security Rules
      const payload = {
        name,
        email,
        phone: phone || "Not Provided",
        whatsapp: whatsapp || "Not Provided",
        message,
        createdAt: new Date().toISOString(),
        status: "unread" as const
      };

      await addContactMessage(payload);
      setFormSubmitted(true);
      
      // Cleanup
      setName("");
      setEmail("");
      setPhone("");
      setWhatsapp("");
      setMessage("");
    } catch (err) {
      console.error("Firestore message submission failure", err);
      setErrorMessage("System experienced an issue posting your message. Please write to me directly at ramachandran85966@gmail.com.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full relative px-6 md:px-8 max-w-7xl mx-auto py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      <div className="absolute top-[20%] left-[10%] w-96 h-96 rounded-full bg-brand-cyan/5 blur-3xl -z-10 pointer-events-none"></div>

      {/* Left block Info column */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-cyan">Operational Interface</span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-none">
            Let's Build Your Solution
          </h1>
          <p className="text-gray-400 text-base leading-relaxed sm:text-lg font-light">
            I help businesses, small operations, and professional startup teams delete manual tasks. Contact me to start planning custom-hosted automated models or system integrations.
          </p>
        </div>

        {/* Channels contact details */}
        <div className="flex flex-col gap-4">
          <h3 className="font-mono text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Direct Channels</h3>
          
          <a 
            href="mailto:ramachandran85966@gmail.com" 
            className="flex items-center gap-4 bg-dark-card/30 hover:bg-dark-card/65 border border-white/5 p-4 rounded-2xl transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan group-hover:scale-105 transition-transform shrink-0">
              <Mail className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-[10px] uppercase font-mono text-gray-500 font-medium">Mail Directly</span>
              <span className="text-gray-200 text-sm font-semibold truncate">ramachandran85966@gmail.com</span>
            </div>
          </a>

          <a 
            href="tel:+919080347710" 
            className="flex items-center gap-4 bg-dark-card/30 hover:bg-dark-card/65 border border-white/5 p-4 rounded-2xl transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple group-hover:scale-105 transition-transform shrink-0">
              <Phone className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-gray-500 font-medium">Call Directly</span>
              <span className="text-gray-200 text-sm font-semibold">+91 9080347710</span>
            </div>
          </a>

          <a 
            href="https://wa.me/919080347710" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-4 bg-dark-card/30 hover:bg-dark-card/65 border border-white/5 p-4 rounded-2xl transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
              <MessageSquare className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-gray-500 font-medium font-semibold">Immediate WhatsApp Chat</span>
              <span className="text-emerald-400 text-sm font-semibold">Message Active (+91 9080347710)</span>
            </div>
          </a>

          <a 
            href="https://www.linkedin.com/in/ramchandrans/" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-4 bg-dark-card/30 hover:bg-dark-card/65 border border-white/5 p-4 rounded-2xl transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform shrink-0">
              <Linkedin className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-gray-500 font-medium">Professional Channel</span>
              <span className="text-blue-400 text-sm font-semibold">linkedin.com/in/ramchandrans/</span>
            </div>
          </a>
        </div>
      </div>

      {/* Right block Contact form column */}
      <div className="lg:col-span-7 bg-dark-card/45 rounded-3xl border border-white/7 p-8 md:p-12 shadow-2xl backdrop-blur-md">
        
        {formSubmitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-2xl text-white tracking-tight">Transmission complete</h3>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Your inquiry has been successfully loaded into the Firestore system queue. I will examine the coordinates and respond within 24 hours.
            </p>
            <button 
              onClick={() => setFormSubmitted(false)}
              className="mt-4 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              Send New Transmission
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="font-display font-semibold text-xl text-white">System Inquiry Protocol</h2>
              <p className="text-gray-500 text-xs font-mono">Fill in the connection details below</p>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/15 text-red-400 text-xs flex gap-2.5 items-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase text-gray-400 ml-1">Your Name <span className="text-brand-cyan">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="E.g., John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-neutral-900/50 border border-white/8 rounded-xl p-3 text-sm text-white focus:outline-hidden focus:border-brand-cyan/60 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase text-gray-400 ml-1">Your Business Email <span className="text-brand-cyan">*</span></label>
                <input
                  type="email"
                  required
                  placeholder="E.g., john@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-neutral-900/50 border border-white/8 rounded-xl p-3 text-sm text-white focus:outline-hidden focus:border-brand-cyan/60 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase text-gray-400 ml-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="E.g., +1 234 567 890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-neutral-900/50 border border-white/8 rounded-xl p-3 text-sm text-white focus:outline-hidden focus:border-brand-cyan/60 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase text-gray-400 ml-1">WhatsApp (Optional)</label>
                <input
                  type="tel"
                  placeholder="E.g., +1 234 567 890"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="bg-neutral-900/50 border border-white/8 rounded-xl p-3 text-sm text-white focus:outline-hidden focus:border-brand-cyan/60 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase text-gray-400 ml-1">Operational Description / Message <span className="text-brand-cyan">*</span></label>
              <textarea
                required
                rows={5}
                placeholder="What repetitive spreadsheet tasks, web forms, coordinates calculations, or automated notification system would you like built?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-neutral-900/50 border border-white/8 rounded-xl p-3.5 text-sm text-white focus:outline-hidden focus:border-brand-cyan/60 transition-colors resize-none leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-display font-semibold text-base hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 duration-200"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Routing Transmission...</span>
                </>
              ) : (
                <>
                  <Command className="w-4 h-4" />
                  <span>Transmit Setup Request</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
