"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface AdSlotProps {
  position: "home_hero" | "home_section" | "game_sidebar" | "game_bottom" | "list_inline" | "native" | "skyscraper_left" | "skyscraper_right" | "multiplex";
  className?: string;
  sticky?: boolean;
}

export default function AdSlot({ position, className = "", sticky }: AdSlotProps) {
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

  // Real AdSense Slot IDs provided by user
  const slotIds = {
    skyscraper_left: "3411654637",
    skyscraper_right: "3411654637",
    game_sidebar: "3411654637",
    game_bottom: "3534943561", // Under-game banner
    native: "7531915393",       // Multiplex ad
    multiplex: "7531915393",    // Multiplex ad
    home_hero: "3534943561",
    home_section: "7531915393",
    list_inline: "3534943561",
  };

  const slotId = slotIds[position];
  const isMultiplex = position === "native" || position === "multiplex";

  // Dimensions
  const sizes = {
    home_hero: "w-full min-h-[90px] md:min-h-[250px]",
    home_section: "w-full max-w-7xl mx-auto min-h-[250px] my-12",
    game_sidebar: "w-full min-h-[600px]",
    game_bottom: "w-full min-h-[90px] md:min-h-[280px] my-8", 
    list_inline: "w-full min-h-[150px] my-6",
    native: "w-full min-h-[250px]", 
    skyscraper_left: "w-[300px] min-h-[600px] hidden xl:flex", 
    skyscraper_right: "w-[300px] min-h-[600px] hidden xl:flex",
    multiplex: "w-full min-h-[250px]",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className={`relative bg-primary-lighter/5 border border-white/5 rounded-xl flex flex-col items-center justify-center overflow-hidden ${sizes[position]} ${className} ${sticky ? 'sticky top-24' : ''}`}
    >
      <div className="absolute top-2 left-2 text-[10px] font-black text-white/10 uppercase tracking-[0.2em] z-10 pointer-events-none">
        Advertisement
      </div>
      
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client={pubId}
        data-ad-slot={slotId}
        data-ad-format={isMultiplex ? "autorelaxed" : "auto"}
        data-full-width-responsive="true"
      ></ins>
      
      {/* Decorative background patterns */}
      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-accent/5 rounded-full blur-2xl -z-10" />
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-white/5 rounded-full blur-xl -z-10" />
    </motion.div>
  );
}
