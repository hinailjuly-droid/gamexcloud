"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, Gamepad2, LayoutGrid, Heart, Flame, ShieldCheck } from "lucide-react";
import Button from "../ui/Button";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Explore", href: "/games" },
    { name: "Trending", href: "/trending" },
    { name: "Categories", href: "/#categories" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-primary/80 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 group-hover:rotate-12 transition-transform">
            <Gamepad2 className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tight text-white uppercase italic">
            h5games<span className="text-accent underline decoration-white/10"> space</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-semibold transition-colors ${
                pathname === link.href ? "text-accent" : "text-gray-400 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/search" className="p-2 text-gray-400 hover:text-white transition-colors">
            <Search size={22} />
          </Link>
          <div className="hidden sm:block">
            <Link href="/games">
              <Button size="sm">Play Now</Button>
            </Link>
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary-light border-b border-white/5 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center p-3 rounded-lg text-lg font-bold ${
                    pathname === link.href ? "bg-accent/10 text-accent" : "text-gray-400"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link href="/games" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full mt-4">Browse All Games</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
