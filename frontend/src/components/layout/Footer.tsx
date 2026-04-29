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
            gamx<span className="text-accent underline decoration-white/10">cloud</span>
          </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              The premium gateway to the best open-source HTML5 games. Play instantly in your browser, no downloads or login required.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://discord.gg/2pQKYUha" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#5865F2]/10 hover:bg-[#5865F2] text-[#5865F2] hover:text-white rounded-full flex items-center justify-center transition-all duration-300 group"
              >
                <svg 
                  className="w-5 h-5 fill-current" 
                  viewBox="0 0 127.14 96.36"
                >
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.39,80.21a105.73,105.73,0,0,0,32.17,16.15,77.7,77.7,0,0,0,6.89-11.11,64.62,64.62,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a64.59,64.59,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.52-51.06-19.1-72.13ZM42.45,65.69C36.18,65.69,31,60,31,53s5.07-12.73,11.44-12.73S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5.07-12.73,11.44-12.73S96.28,46,96.17,53,91.12,65.69,84.69,65.69Z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/games" className="text-gray-500 hover:text-accent transition-colors">All Games</Link></li>
              <li><Link href="/featured" className="text-gray-500 hover:text-accent transition-colors">Our Games</Link></li>
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
            © {currentYear} GamxCloud | All Rights Reserved
          </p>
          <div className="text-[10px] text-gray-700 uppercase tracking-widest font-bold">
            free online gaming no login
          </div>
        </div>

      </div>
    </footer>
  );
}
