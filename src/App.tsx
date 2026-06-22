/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ParticleBackground from "./components/ParticleBackground";
import { motion, AnimatePresence } from "motion/react";

// Import page routes
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import CaseStudies from "./pages/CaseStudies";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

// ScrollToTop handles resetting viewport margins on route shifts
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full text-gray-200 selection:bg-brand-cyan/30 selection:text-white relative">
      {/* Floating Top Header bar */}
      <Navbar />

      {/* Dynamic Route views panel */}
      <main className="flex-1 pb-16 pt-24 md:pt-28 flex flex-col relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
            transition={{
              type: "spring",
              stiffness: 110,
              damping: 19,
              mass: 0.8,
              duration: 0.45
            }}
            className="w-full flex-1 flex flex-col"
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPostDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global systems footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      {/* Scroll to Top helper */}
      <ScrollToTop />

      {/* Global AI Inspired Background Particle Element */}
      <ParticleBackground />

      <AppContent />
    </HashRouter>
  );
}