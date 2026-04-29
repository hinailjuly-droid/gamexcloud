import { gamesApi } from "@/lib/api";
import PokiGameCard from "@/components/games/PokiGameCard";
import { Game, Category } from "@/types";
import Link from "next/link";
import { Search } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch data on the server
  const [featuredGames, trendingGames, popularGames, categories] = await Promise.all([
    gamesApi.getFeaturedGames().catch(() => []),
    gamesApi.getTrendingGames().catch(() => []),
    gamesApi.getPopularGames().catch(() => []),
    gamesApi.getCategories().catch(() => []),
  ]);

  const allGames = [...featuredGames.slice(0, 12), ...trendingGames, ...popularGames].slice(0, 60);

  return (
    <div className="flex flex-col gap-4 md:gap-8 pb-20 pt-4 px-4 md:px-8 max-w-[1600px] mx-auto">
      {/* Search Bar - Compact instead of full Hero */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-b border-black/10 dark:border-white/10">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-black dark:text-white uppercase tracking-tighter">
            BROWSE <span className="text-accent">GAMES</span>
          </h1>
          <p className="text-sm font-bold text-black/50 dark:text-white/50 uppercase">
            {allGames.length}+ Premium titles available now
          </p>
        </div>
        <div className="w-full md:w-auto">
          <Link href="/search">
            <button className="btn-poki w-full justify-center py-2 px-6 text-lg">
              <Search size={20} /> SEARCH
            </button>
          </Link>
        </div>
      </section>

      {/* Categories Horizontal Scroll */}
      <section className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories?.map((cat: Category) => (
          <Link 
            key={cat.slug} 
            href={`/category/${cat.name.toLowerCase()}`}
            className="flex-shrink-0 bg-white dark:bg-primary-light px-4 py-2 rounded-xl font-black text-[10px] md:text-xs border-b-4 border-black/10 text-black dark:text-white hover:border-transparent hover:translate-y-0.5 transition-all"
          >
            {cat.name.toUpperCase()}
          </Link>
        ))}
      </section>

      {/* Main Dense Grid - Start directly with games */}
      <section className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 md:gap-3 grid-flow-dense">
        {/* Large Featured Tiles */}
        {allGames[0] && <PokiGameCard game={allGames[0]} size="large" />}
        {allGames[1] && <PokiGameCard game={allGames[1]} size="normal" />}
        {allGames[2] && <PokiGameCard game={allGames[2]} size="normal" />}
        
        {/* Mixed Tiles */}
        {allGames.slice(3, 15).map((game: Game, idx: number) => {
          let size: 'normal' | 'large' | 'wide' = 'normal';
          if (idx === 5) size = 'large';
          else if (idx === 2 || idx === 8) size = 'wide';
          
          return (
            <PokiGameCard key={game._id} game={game} size={size} />
          );
        })}

        {/* Remaining Tiles */}
        {allGames.slice(15).map((game: Game) => (
          <PokiGameCard key={game._id} game={game} />
        ))}
      </section>

      {/* SEO Section at Bottom */}
      <section className="mt-16">
         <div className="bg-black/5 dark:bg-white/5 rounded-[2rem] p-8 md:p-12 border-2 border-dashed border-black/10 dark:border-white/10 text-center">
            <h2 className="text-2xl md:text-4xl font-black mb-4 uppercase italic text-black dark:text-white leading-tight">The Ultimate Free Gaming Portal</h2>
            <p className="text-sm md:text-base font-bold text-black/60 dark:text-white/60 max-w-4xl mx-auto leading-relaxed">
              Play <span className="text-black dark:text-white underline font-black">free online gaming no login</span> on GamxCloud. 
              Our optimized platform delivers high-performance HTML5 games directly to your browser. 
              No downloads, no logins, just pure fun.
            </p>
         </div>
      </section>

      {/* Keywords footer section */}
      <div className="flex flex-wrap justify-center gap-4 text-[10px] md:text-xs font-bold text-black/30 dark:text-white/30 uppercase tracking-widest mt-6">
        <span>free online gaming no login</span>
        <span>•</span>
        <span>no download games</span>
        <span>•</span>
        <span>instant play games</span>
        <span>•</span>
        <span>h5 games cloud</span>
      </div>
    </div>
  );
}
