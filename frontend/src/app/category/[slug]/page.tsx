"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { gamesApi } from "@/lib/api";
import GameGrid from "@/components/games/GameGrid";
import { ChevronRight, Gamepad2, LayoutGrid, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

export default function CategoryPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  
  // Format slug to proper category name (e.g. "board-card" -> "Board & Card")
  const categoryName = (slug as string)
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace('Board Card', 'Board & Card');

  const { data, isLoading } = useQuery({
    queryKey: ['games', { category: categoryName, page }],
    queryFn: () => gamesApi.getGames({ category: categoryName, page, limit: 24 }),
  });

  const categoryIcons: Record<string, any> = {
    Action: Gamepad2,
    Puzzle: LayoutGrid,
    RPG: Star,
    Racing: TrendingUp,
    'Board & Card': LayoutGrid,
  };

  const Icon = categoryIcons[categoryName] || Gamepad2;

  return (
    <div className="pb-20">
      {/* Category Hero */}
      <div className="bg-primary-light/50 border-b border-white/5 pt-12 pb-16 relative overflow-hidden">
        {/* Background Blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/5 rounded-full blur-[80px] -z-10" />

        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-accent text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-accent/20">
              <Icon size={40} />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase mb-4">
              {categoryName} <span className="text-accent underline decoration-white/10">Games</span>
            </h1>
            <p className="text-gray-400 max-w-2xl font-medium tracking-tight leading-relaxed">
              Explore the best free open-source {categoryName} games. Play directly in your browser with optimized performance and high-quality graphics.
            </p>
            
            <div className="mt-8 flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span className="text-accent">{categoryName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black text-white italic uppercase flex items-center gap-3">
             Vault <span className="text-accent">Results</span>
             <Badge variant="accent" className="ml-2">{data?.pagination.total || 0}</Badge>
          </h2>
        </div>

        <GameGrid games={data?.games || []} isLoading={isLoading} />

        {/* Simplistic Pagination for Category Page */}
        {data && data.pagination.pages > 1 && (
            <div className="mt-20 flex justify-center">
               <div className="flex items-center gap-4">
                  {page > 1 && (
                    <Link href={`/category/${slug}?page=${page - 1}`} className="text-gray-400 hover:text-accent font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                      <ChevronRight size={16} className="rotate-180" /> Previous
                    </Link>
                  )}
                  <span className="text-white font-black italic text-xl">
                    {page} <span className="text-gray-600 font-normal not-italic mx-2">/</span> {data.pagination.pages}
                  </span>
                  {page < data.pagination.pages && (
                    <Link href={`/category/${slug}?page=${page + 1}`} className="text-gray-400 hover:text-accent font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                      Next <ChevronRight size={16} />
                    </Link>
                  )}
               </div>
            </div>
        )}
      </div>
    </div>
  );
}
