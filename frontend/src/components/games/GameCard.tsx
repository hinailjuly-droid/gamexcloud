"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Play, CheckCircle } from "lucide-react";
import { Game } from "@/types";
import Badge from "../ui/Badge";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const categoryArt: Record<string, string> = {
    Action: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    Puzzle: "https://images.unsplash.com/photo-1586281314110-66122d48c78f?q=80&w=800&auto=format&fit=crop",
    RPG: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    Racing: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800&auto=format&fit=crop",
    Strategy: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop",
    Arcade: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    Multiplayer: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    Simulation: "https://images.unsplash.com/photo-1533236897111-3e94666b2edf?q=80&w=800&auto=format&fit=crop",
    Platformer: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=800&auto=format&fit=crop",
    Other: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
  };

  const fallbackImage = categoryArt[game.category] || categoryArt.Other;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-primary-light rounded-xl overflow-hidden border border-white/5 hover:border-accent/30 transition-all duration-300"
    >
      <Link href={`/game/${game.slug}`}>
        <div className="relative aspect-[16/10] overflow-hidden">
          {/* Thumbnail Image with Category Fallback */}
          <div className="absolute inset-0 bg-primary-lighter">
            <Image
              src={game.thumbnail && (game.thumbnail.startsWith('http') || game.thumbnail.startsWith('/')) ? game.thumbnail : fallbackImage}
              alt={game.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-60" />
          
          {/* Hover Play Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/40 backdrop-blur-sm">
            <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/50 scale-90 group-hover:scale-100 transition-transform duration-300">
              <Play className="fill-white text-white ml-1" size={28} />
            </div>
          </div>

          {/* Verification Badge */}
          {game.verified && (
            <div className="absolute top-3 left-3 bg-green-500/90 text-white p-1 rounded-full backdrop-blur-sm">
              <CheckCircle size={14} />
            </div>
          )}

          {/* Stars Badge */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-yellow-400">
            <Star size={12} className="fill-yellow-400" />
            {game.stars > 1000 ? `${(game.stars / 1000).toFixed(1)}k` : game.stars}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-white leading-tight line-clamp-1 group-hover:text-accent transition-colors">
              {game.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="accent">{game.category}</Badge>
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">{game.license}</span>
          </div>

          <div className="flex items-center justify-end mt-auto">
            <div className="text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity">
              Play Now →
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
