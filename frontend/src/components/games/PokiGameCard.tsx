"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Game } from "@/types";

interface PokiGameCardProps {
  game: Game;
  size?: 'normal' | 'large' | 'wide';
}

export default function PokiGameCard({ game, size = 'normal' }: PokiGameCardProps) {
  const sizeClasses = {
    normal: "col-span-1 row-span-1",
    large: "col-span-2 row-span-2",
    wide: "col-span-2 row-span-1",
  };

  const fallbackImage = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop";

  return (
    <motion.div
      whileHover={{ y: 2, scale: 0.98 }}
      className={`relative group ${sizeClasses[size]} bg-white dark:bg-primary-light rounded-[1rem] md:rounded-[1.5rem] overflow-hidden shadow-[0_4px_0_0_rgba(0,0,0,0.1)] hover:shadow-none transition-all duration-200 border-2 border-transparent hover:border-white dark:hover:border-accent cursor-pointer`}
    >
      <Link href={`/game/${game.slug}`} className="block w-full h-full">
        <div className="relative w-full h-full aspect-square bg-gray-100 dark:bg-gray-800">
          <Image
            src={game.thumbnail && (game.thumbnail.startsWith('http') || game.thumbnail.startsWith('/')) ? game.thumbnail : fallbackImage}
            alt={game.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={size === 'large' ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 33vw, 20vw"}
            priority={size === 'large'}
          />
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
             <div className="bg-accent text-black font-black px-3 py-1.5 rounded-lg text-xs md:text-sm transform -rotate-1 mb-2">
                PLAY
             </div>
             <span className="text-white text-[10px] md:text-xs font-black uppercase line-clamp-1">
               {game.title}
             </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
