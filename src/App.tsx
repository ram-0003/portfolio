/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ParticleBackground from "./components/ParticleBackground";

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

export default function App() {
  return (
    <HashRouter>
      {/* Scroll to Top helper */}
      <ScrollToTop />

      {/* Global AI Inspired Background Particle Element */}
      <ParticleBackground />

      <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden text-gray-200 selection:bg-brand-cyan/30 selection:text-white">
        {/* Floating Top Header bar */}
        <Navbar />

        {/* Dynamic Route views panel */}
        <main className="flex-1 pb-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        {/* Global systems footer */}
        <Footer />
      </div>
    </HashRouter>
  );
}