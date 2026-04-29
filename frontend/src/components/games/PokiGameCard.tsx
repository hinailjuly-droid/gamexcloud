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
    normal: "col-span-1 row-span-1 aspect-square",
    large: "col-span-2 row-span-2 aspect-square",
    wide: "col-span-2 row-span-1 aspect-[2/1]",
  };

  const fallbackImage = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop";

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative group ${sizeClasses[size]} bg-white dark:bg-primary-light rounded-xl md:rounded-[2rem] overflow-hidden shadow-[0_6px_0_0_rgba(0,0,0,0.15)] hover:shadow-none transition-all duration-200 border-2 border-transparent hover:border-white dark:hover:border-accent cursor-pointer`}
    >
      <Link href={`/game/${game.slug}`} className="block w-full h-full">
        <div className="relative w-full h-full bg-gray-100 dark:bg-gray-800">
          <Image
            src={game.thumbnail && (game.thumbnail.startsWith('http') || game.thumbnail.startsWith('/')) ? game.thumbnail : fallbackImage}
            alt={game.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes={size === 'large' ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 33vw, 20vw"}
            priority={size === 'large'}
          />
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
             <div className="bg-accent text-black font-black px-4 py-2 rounded-xl text-xs md:text-sm transform -rotate-2 mb-2 shadow-lg">
                PLAY NOW
             </div>
             <span className="text-white text-xs md:text-sm font-black uppercase line-clamp-2 drop-shadow-md">
               {game.title}
             </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
