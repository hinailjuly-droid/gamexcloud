"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface AdSlotProps {
  position: "home_hero" | "home_section" | "game_sidebar" | "game_bottom" | "list_inline" | "native" | "skyscraper_left" | "skyscraper_right";
  className?: string;
  adSlot?: string; // Optional specific slot ID
  sticky?: boolean;
}

export default function AdSlot({ position, className = "", adSlot, sticky }: AdSlotProps) {
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === "true";
  const pubId = "ca-pub-2724749520266558";
  
  useEffect(() => {
    if (showAds) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [showAds]);

  if (!showAds) return null;

  // Mapping positions to default slots
  // High CTR Strategy: These should be matched with real AdSense IDs
  const defaultSlots = {
    home_hero: "1234567890",
    home_section: "2345678901",
    game_sidebar: "3456789012",
    game_bottom: "4567890123", // Large Rectangle / Leaderboard (High CTR)
    list_inline: "5678901234",
    native: "6789012345",      // Native Ad for Grids
    skyscraper_left: "7890123456", // Left Skyscraper
    skyscraper_right: "8901234567", // Right Skyscraper
  };

  const slotId = adSlot || defaultSlots[position];

  // AdSense placeholder styling and dimensions
  const sizes = {
    home_hero: "w-full min-h-[90px] md:min-h-[250px]",
    home_section: "w-full max-w-7xl mx-auto min-h-[100px] my-12",
    game_sidebar: "w-full min-h-[600px]",
    game_bottom: "w-full min-h-[250px] md:min-h-[280px] my-8", // Under-game banner
    list_inline: "w-full min-h-[150px] my-6",
    native: "w-full min-h-[250px] h-full", // Native ad in grid
    skyscraper_left: "w-[300px] min-h-[600px] hidden xl:flex", 
    skyscraper_right: "w-[300px] min-h-[600px] hidden xl:flex",
  };

  const isSkyscraper = position === "skyscraper_left" || position === "skyscraper_right";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className={`relative bg-primary-lighter/30 border border-white/5 rounded-xl flex flex-col items-center justify-center overflow-hidden ${sizes[position]} ${className} ${sticky ? 'sticky top-24' : ''}`}
    >
      <div className="absolute top-2 left-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] z-10 pointer-events-none">
        Advertisement
      </div>
      
      {/* Actual AdSense Tag */}
      <ins
        className="adsbygoogle"
        style={{ 
          display: "block", 
          width: "100%", 
          height: "100%",
          minWidth: position === "native" ? "250px" : undefined 
        }}
        data-ad-client={pubId}
        data-ad-slot={slotId}
        data-ad-format={position === "native" ? "fluid" : "auto"}
        data-ad-layout-key={position === "native" ? "-fb+5w+4e-db+86" : undefined}
        data-full-width-responsive="true"
      ></ins>
      
      {/* Decorative patterns (background only) */}
      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-accent/5 rounded-full blur-2xl -z-10" />
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-white/5 rounded-full blur-xl -z-10" />
    </motion.div>
  );
}
