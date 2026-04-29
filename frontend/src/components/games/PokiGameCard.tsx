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
      whileHover={{ y: 4, scale: 0.98 }}
      className={`relative group ${sizeClasses[size]} bg-white rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_8px_0_0_rgba(0,0,0,0.1)] hover:shadow-none transition-all duration-200 border-4 border-transparent hover:border-white cursor-pointer`}
    >
      <Link href={`/game/${game.slug}`} className="block w-full h-full">
        <div className="relative w-full h-full aspect-square">
          <Image
            src={game.thumbnail && (game.thumbnail.startsWith('http') || game.thumbnail.startsWith('/')) ? game.thumbnail : fallbackImage}
            alt={game.title}
            fill
            className="object-cover"
            sizes={size === 'large' ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
            priority={size === 'large'}
          />
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <div className="bg-accent text-black font-black px-4 py-2 rounded-xl text-sm md:text-base transform -rotate-2">
                PLAY NOW
             </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
