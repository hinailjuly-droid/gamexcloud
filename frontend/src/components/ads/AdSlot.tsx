"use client";

import { motion } from "framer-motion";

interface AdSlotProps {
  position: "home_hero" | "home_section" | "game_sidebar" | "game_bottom" | "list_inline";
  className?: string;
}

export default function AdSlot({ position, className = "" }: AdSlotProps) {
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === "true";
  
  if (!showAds) return null;

  // AdSense placeholder styling
  const sizes = {
    home_hero: "w-full min-h-[90px] md:min-h-[250px]",
    home_section: "w-full max-w-7xl mx-auto min-h-[100px] my-12",
    game_sidebar: "w-full min-h-[600px]",
    game_bottom: "w-full min-h-[250px] my-8",
    list_inline: "w-full min-h-[150px] my-6",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className={`relative bg-primary-lighter/30 border border-white/5 rounded-lg flex flex-col items-center justify-center p-4 overflow-hidden ${sizes[position]} ${className}`}
    >
      <div className="absolute top-2 left-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
        Advertisement
      </div>
      
      {/* Visual Placeholder for AdSense */}
      <div className="text-gray-700 text-xs font-medium text-center max-w-[200px]">
        AdSense Placement
        <p className="text-[10px] opacity-70 mt-1">Ref: {position}</p>
      </div>

      {/* Actual AdSense code would go here in the future */}
      {/* 
      <ins className="adsbygoogle"
           style={{display: 'block'}}
           data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
           data-ad-slot="XXXXXXXXXX"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      */}
      
      {/* Decorative patterns to make it look "premium" even as a placeholder */}
      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-accent/5 rounded-full blur-2xl" />
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-white/5 rounded-full blur-xl" />
    </motion.div>
  );
}
