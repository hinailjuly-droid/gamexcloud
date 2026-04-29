"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, Gamepad2, Moon, Sun } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Check initial theme
    const isLight = document.documentElement.classList.contains('light');
    setIsDarkMode(!isLight);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  };

  const navLinks = [
    { name: "GAMES", href: "/games" },
    { name: "BLOG", href: "/blog" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-primary/90 backdrop-blur-xl border-b-4 border-black/10 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo - Compact */}
        <Link href="/" className="flex items-center gap-2 group bg-white dark:bg-primary-light p-2 rounded-2xl border-b-4 border-black/10 shadow-sm transition-colors">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Gamepad2 className="text-black" size={18} />
          </div>
          <span className="text-lg font-black tracking-tighter text-black dark:text-white uppercase">
            GAMX<span className="text-accent">CLOUD</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-4 py-2 rounded-xl font-black transition-all ${
                pathname === link.href ? "bg-accent text-black shadow-[0_4px_0_0_#e6c400]" : "text-black dark:text-white hover:bg-white/20"
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-3 bg-white dark:bg-primary-light rounded-xl border-b-4 border-black/10 hover:border-transparent hover:translate-y-1 transition-all text-black dark:text-white"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link href="/search" className="p-3 bg-white dark:bg-primary-light rounded-xl border-b-4 border-black/10 hover:border-transparent hover:translate-y-1 transition-all">
            <Search size={22} className="text-black dark:text-white" />
          </Link>
        </nav>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
           <button 
            onClick={toggleTheme}
            className="p-3 bg-white dark:bg-primary-light rounded-xl border-b-4 border-black/10 text-black dark:text-white"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className="p-3 bg-white dark:bg-primary-light rounded-xl border-b-4 border-black/10 text-black dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white dark:bg-primary border-b-4 border-black/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-4 rounded-2xl text-xl font-black ${
                    pathname === link.href ? "bg-accent text-black" : "text-black dark:text-white bg-black/5 dark:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                href="/search" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-4 rounded-2xl text-xl font-black bg-white dark:bg-primary-light border-4 border-black/5 text-black dark:text-white flex items-center gap-2"
              >
                <Search size={24} /> SEARCH
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
