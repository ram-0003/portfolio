import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, getSiteSettings } from "../services/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { Menu, X, Command, Terminal, LogOut, Code, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SiteSettings } from "../types";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const location = useLocation();

  // Active theme preference controller
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("site-theme") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("site-theme", theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(console.error);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Projects", href: "/projects" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" }
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/portfolio");
    } catch (e) {
      console.error("Signout error", e);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const displayName = settings?.name || "Ramachandran S";
  const firstName = displayName.split(" ")[0];
  const restOfName = displayName.includes(" ") ? displayName.substring(firstName.length).trim() : "";
  const initialLetter = displayName.charAt(0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 pt-4 pb-2">
      <nav className="mx-auto max-w-[1580px] w-full rounded-full bg-dark-card/65 backdrop-blur-md border border-white/8 p-2 px-6 flex items-center justify-between shadow-2xl">
        <Link to="/" className="flex items-center gap-3 font-display font-medium text-lg leading-none tracking-tight group">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/20 duration-300 group-hover:scale-105">
            {initialLetter}
          </div>
          <span className="text-white group-hover:text-brand-cyan transition-colors font-semibold">
            {firstName} {restOfName && (
              <span className="text-brand-cyan font-mono text-xs ml-1 border border-brand-cyan/20 px-1.5 py-0.5 rounded-full bg-brand-cyan/5">
                {restOfName}
              </span>
            )}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`px-4 py-2 rounded-full font-display text-sm tracking-wide transition-all duration-200 ${
                isActive(link.href)
                  ? "bg-brand-cyan/10 text-brand-cyan font-medium border border-brand-cyan/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action button */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-all cursor-pointer flex items-center justify-center duration-200"
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-brand-cyan" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-linear-to-r from-brand-cyan/10 to-brand-purple/10 text-white font-mono text-xs border border-brand-cyan/20 hover:border-brand-cyan/40 transition-all font-medium"
              >
                <Terminal className="w-3.5 h-3.5 text-brand-cyan" />
                CMS Console
              </Link>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 rounded-full bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/5 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-slate-200 transition-all font-semibold text-sm shadow-md duration-200"
            >
              Let's Build
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-all cursor-pointer flex items-center justify-center mr-1"
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-brand-cyan" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
          </button>

          {user && (
            <Link
              to="/admin"
              className="p-2 bg-brand-cyan/10 text-brand-cyan rounded-full border border-brand-cyan/20"
              title="Admin CMS"
            >
              <Terminal className="w-4 h-4" />
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-400 hover:text-white focus:outline-none"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer drop-down */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute left-4 right-4 mt-2 p-5 bg-dark-card/95 border border-white/10 rounded-3xl backdrop-blur-lg shadow-2xl flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-2xl font-display text-base transition-all ${
                    isActive(link.href)
                      ? "bg-brand-cyan/15 text-brand-cyan border-l-4 border-l-brand-cyan pl-6"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="border-t border-white/5 pt-4">
              {user ? (
                <div className="flex flex-col gap-2.5">
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 text-white font-mono text-sm border border-white/10"
                  >
                    <Terminal className="w-4 h-4 text-brand-cyan" />
                    Admin Control Panel
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex justify-center items-center gap-2 px-5 py-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-5 py-3.5 rounded-2xl bg-white text-black font-semibold hover:bg-slate-200 transition-all"
                >
                  Let's Build Your Solution
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
