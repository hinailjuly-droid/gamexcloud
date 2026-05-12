"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface AdSlotProps {
  position: "home_hero" | "home_section" | "game_sidebar" | "game_bottom" | "list_inline" | "native" | "skyscraper_left" | "skyscraper_right" | "multiplex";
  className?: string;
  sticky?: boolean;
}

export default function AdSlot({ position, className = "", sticky }: AdSlotProps) {
  const pathname = usePathname();
  const adInitialized = useRef(false);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === "true";
  const pubId = "ca-pub-2724749520266558";
  
  const slotIds = {
    skyscraper_left: "3411654637",
    skyscraper_right: "3411654637",
    game_sidebar: "3411654637",
    game_bottom: "3534943561",
    native: "7531915393",
    multiplex: "7531915393",
    home_hero: "3534943561",
    home_section: "7531915393",
    list_inline: "3534943561",
  };

  useEffect(() => {
    // Reset initialization on path change
    adInitialized.current = false;
  }, [pathname]);

  useEffect(() => {
    if (showAds && !adInitialized.current) {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        adInitialized.current = true;
      } catch (e) {
        console.error("AdSense initialization failed:", e);
      }
    }
  }, [showAds, pathname]);

  if (!showAds) return null;

  const slotId = slotIds[position];
  const isMultiplex = position === "native" || position === "multiplex";

  const sizes = {
    home_hero: "w-full min-h-[90px]",
    home_section: "w-full min-h-[250px] my-12",
    game_sidebar: "w-full min-h-[600px]",
    game_bottom: "w-full min-h-[90px] my-8", 
    list_inline: "w-full min-h-[150px] my-6",
    native: "w-full min-h-[250px]", 
    skyscraper_left: "w-[300px] min-h-[600px] hidden xl:block", 
    skyscraper_right: "w-[300px] min-h-[600px] hidden xl:block",
    multiplex: "w-full min-h-[250px]",
  };

  return (
    <div
      key={`${pathname}-${position}`}
      className={`relative bg-black/5 border border-white/5 rounded-xl flex flex-col items-center justify-center overflow-hidden ${sizes[position]} ${className} ${sticky ? 'sticky top-24' : ''}`}
    >
      <div className="absolute top-2 left-2 text-[8px] text-white/20 uppercase font-bold z-10">
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
    </div>
  );
}
