import { gamesApi, blogApi } from "@/lib/api";
import PokiGameCard from "@/components/games/PokiGameCard";
import { Game, Category } from "@/types";
import Link from "next/link";
import { Search, Gamepad2, TrendingUp, Star, ChevronRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch data on the server
  const [featuredGames, trendingGames, popularGames, categories] = await Promise.all([
    gamesApi.getFeaturedGames().catch(() => []),
    gamesApi.getTrendingGames().catch(() => []),
    gamesApi.getPopularGames().catch(() => []),
    gamesApi.getCategories().catch(() => []),
  ]);

  const allGames = [...featuredGames.slice(0, 8), ...trendingGames, ...popularGames].slice(0, 48);

  return (
    <div className="flex flex-col gap-10 md:gap-16 pb-20 pt-4 px-4 md:px-8 max-w-[1600px] mx-auto">
      {/* Top Bar / Search Hero */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/10 rounded-[2.5rem] p-8 md:p-12 border-4 border-white/20 backdrop-blur-sm">
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-black text-black leading-none mb-4 uppercase tracking-tighter">
            GAMX<span className="text-white drop-shadow-[0_2px_0_rgba(0,0,0,1)]">CLOUD</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-black/80 max-w-xl">
            100% FREE GAMES. NO DOWNLOAD. NO LOGIN.
          </p>
        </div>
        <div className="w-full md:w-auto">
          <Link href="/search">
            <button className="btn-poki w-full justify-center">
              <Search size={24} /> SEARCH GAMES
            </button>
          </Link>
        </div>
      </section>

      {/* Categories Horizontal Scroll */}
      <section className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {categories?.map((cat: Category) => (
          <Link 
            key={cat.slug} 
            href={`/category/${cat.name.toLowerCase()}`}
            className="flex-shrink-0 bg-white px-6 py-3 rounded-2xl font-black text-sm md:text-base border-b-4 border-black/10 hover:border-transparent hover:translate-y-1 transition-all"
          >
            {cat.name.toUpperCase()}
          </Link>
        ))}
      </section>

      {/* Main Dense Grid */}
      <section className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 md:gap-6 grid-auto-flow-dense">
        {/* Large Featured Tile */}
        {allGames[0] && <PokiGameCard game={allGames[0]} size="large" />}
        
        {/* Mixed Tiles */}
        {allGames.slice(1, 10).map((game: Game, idx: number) => (
          <PokiGameCard key={game._id} game={game} size={idx % 7 === 0 ? 'wide' : 'normal'} />
        ))}

        {/* Another Large Tile */}
        {allGames[10] && <PokiGameCard game={allGames[10]} size="large" />}

        {/* Remaining Tiles */}
        {allGames.slice(11).map((game: Game) => (
          <PokiGameCard key={game._id} game={game} />
        ))}
      </section>

      {/* SEO Section at Bottom */}
      <section className="mt-20 text-center">
         <div className="bg-black/5 rounded-[3rem] p-12 border-4 border-dashed border-black/10">
            <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase italic">Why Play on GamxCloud?</h2>
            <p className="text-lg md:text-xl font-bold text-black/70 max-w-4xl mx-auto leading-relaxed">
              We provide the ultimate <span className="text-black underline font-black">free online gaming no login</span> experience. 
              Our platform is designed for speed and accessibility, allowing you to jump into action in seconds. 
              Whether you are looking for puzzles, action, or racing games, GamxCloud has it all.
            </p>
         </div>
      </section>

      {/* Keywords footer section as requested */}
      <div className="flex flex-wrap justify-center gap-4 text-[10px] md:text-xs font-bold text-black/40 uppercase tracking-widest mt-10">
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
