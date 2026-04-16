"use client";

import Link from "next/link";
import { Gamepad2, Code2, Share2, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Gamepad2 className="text-white" size={18} />
              </div>
              <span className="text-xl font-black tracking-tight text-white uppercase italic">
            h5games<span className="text-accent underline decoration-white/10"> space</span>
          </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              The premium gateway to the best open-source HTML5 games. Play instantly in your browser, no downloads or login required.
            </p>
            <div className="flex gap-4">
              {/* Social sharing removed as per request */}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/games" className="text-gray-500 hover:text-accent transition-colors">All Games</Link></li>
              <li><Link href="/featured" className="text-gray-500 hover:text-accent transition-colors">Our Games</Link></li>
              <li><Link href="/trending" className="text-gray-500 hover:text-accent transition-colors">Trending</Link></li>
              <li><Link href="/new" className="text-gray-500 hover:text-accent transition-colors">New Games</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/blog" className="text-gray-500 hover:text-accent transition-colors font-bold text-accent/80">Blog & Guides</Link></li>
              <li><Link href="/about" className="text-gray-500 hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/privacy-policy" className="text-gray-500 hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-gray-500 hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="/dmca" className="text-gray-500 hover:text-accent transition-colors">DMCA Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-xs font-medium uppercase tracking-widest">
            © {currentYear} H5Games Space | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
