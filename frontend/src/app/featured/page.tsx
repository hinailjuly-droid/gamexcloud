"use client";

import { useQuery } from "@tanstack/react-query";
import { gamesApi } from "@/lib/api";
import GameGrid from "@/components/games/GameGrid";
import { Star } from "lucide-react";

export default function FeaturedGamesPage() {
  const { data: featuredGames, isLoading } = useQuery({
    queryKey: ['games', 'featured'],
    queryFn: () => gamesApi.getFeaturedGames(),
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
          <Star size={28} />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase mb-2">
            Featured <span className="text-accent underline decoration-white/10">Gems</span>
          </h1>
          <p className="text-gray-500 font-medium tracking-tight">
            Hand-picked premium titles from our curators.
          </p>
        </div>
      </div>

      <GameGrid 
        games={featuredGames || []} 
        isLoading={isLoading} 
      />
    </div>
  );
}
