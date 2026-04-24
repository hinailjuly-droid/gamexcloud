"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Gamepad2, TrendingUp, Star, LayoutGrid, Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { gamesApi } from "@/lib/api";
import GameGrid from "@/components/games/GameGrid";
import GameCard from "@/components/games/GameCard";
import Button from "@/components/ui/Button";
import { Game, Category, BlogPost } from "@/types";
import { blogApi } from "@/lib/api";
import BlogCard from "@/components/BlogCard";
import { BookOpen } from "lucide-react";

export default function HomePage() {
  const { data: featuredGames, isLoading: featuredLoading } = useQuery<Game[]>({
    queryKey: ["games", "featured"],
    queryFn: () => gamesApi.getFeaturedGames(),
  });

  const { data: trendingGames, isLoading: trendingLoading } = useQuery<Game[]>({
    queryKey: ["games", "trending"],
    queryFn: () => gamesApi.getTrendingGames(),
  });

  const { data: popularGames, isLoading: popularLoading } = useQuery<Game[]>({
    queryKey: ["games", "popular"],
    queryFn: () => gamesApi.getPopularGames(),
  });

  const { data: latestPosts } = useQuery<any>({
    queryKey: ["blog", "latest"],
    queryFn: () => blogApi.getPosts({ limit: 3, featured: 'true' }),
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => gamesApi.getCategories(),
  });

  const categoryIcons: Record<string, any> = {
    'Puzzle': LayoutGrid,
    'Mahjong': LayoutGrid,
    'Hidden Object': Search,
    'Card & Solitaire': Gamepad2,
    'Match 3': LayoutGrid,
    'Action & Arcade': Gamepad2,
    'Sports': Star,
    'Racing': TrendingUp,
    'Strategy & Simulation': LayoutGrid,
    'Word Games': Search,
    'Board Games': LayoutGrid,
    'Multiplayer': Gamepad2,
  };

  const getCategoryThumbnail = (name: string) => {
    const mapping: Record<string, string> = {
      'Puzzle': '/assets/categories/puzzle.png',
      'Mahjong': '/assets/categories/mahjong.png',
      'Hidden Object': '/assets/categories/hidden_object.png',
      'Card & Solitaire': '/assets/categories/card_solitaire.png',
      'Match 3': '/assets/categories/match3.png',
      'Action & Arcade': '/assets/categories/action_arcade.png',
      'Sports': '/assets/categories/sports.png',
      'Racing': '/assets/categories/racing.png',
      'Strategy & Simulation': '/assets/categories/strategy_sim.png',
      'Word Games': '/assets/categories/word.png',
      'Board Games': '/assets/categories/board.png',
      'Multiplayer': '/assets/categories/multiplayer.png',
    };
    return (mapping[name] || '/assets/categories/puzzle.png') + '?v=3';
  };

  function ShieldCheck({ size }: { size: number }) {
    return <Star size={size} />; // Fallback icon for simplicity
  }

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10" />
        
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="accent" className="mb-6 uppercase tracking-widest py-1.5 px-4 animate-bounce">
              100% Free HTML5 Games
            </Badge>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 tracking-tighter leading-tight italic uppercase">
              GAMX<span className="text-accent underline decoration-white/10">CLOUD</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
              Play 1000+ Premium Web Games Directly In Your Browser. <br className="hidden md:block" />
              <span className="text-white">No Download. No Login. Just Play.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/games">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-xl font-black italic">
                  START PLAYING <ChevronRight className="ml-1" />
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10 text-xl font-bold" icon={Search}>
                  FIND GAMES
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Game Icons Decorative */}
        <div className="absolute top-20 right-10 opacity-10 animate-float hidden lg:block">
          <Gamepad2 size={120} className="text-white" />
        </div>
        <div className="absolute bottom-20 left-10 opacity-10 animate-float-delayed hidden lg:block">
          <TrendingUp size={100} className="text-accent" />
        </div>
      </section>

      {/* Hero Section End */}

      {/* Featured Games Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2 uppercase italic">
              Our <span className="text-accent italic tracking-normal underline decoration-white/10">Games</span>
            </h2>
            <p className="text-gray-500 font-medium">Hand-picked premium titles from our curators.</p>
          </div>
          <Link href="/games" className="text-accent font-black uppercase text-sm tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
            Explore All <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <GameGrid games={featuredGames?.slice(0, 30) || []} isLoading={featuredLoading} />

        <div className="mt-16 flex justify-center">
          <Link href="/games">
            <button className="relative group overflow-hidden bg-accent text-white font-black italic text-2xl px-12 py-5 rounded-2xl transition-all shadow-2xl shadow-accent/20 hover:scale-[1.02] active:scale-95 border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative z-10 flex items-center gap-3 drop-shadow-md">
                VIEW ALL GAMES <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories" className="bg-primary-light/30 py-24 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase italic">
              Browse by <span className="text-accent">Category</span>
            </h2>
            <div className="w-20 h-1.5 bg-accent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories?.filter(c => c.name !== 'Other').map((cat, index) => {
              const Icon = categoryIcons[cat.name] || LayoutGrid;
              return (
                <motion.div
                  key={cat.slug}
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={`/category/${cat.name.toLowerCase()}`}
                    className="relative flex flex-col items-center justify-center h-48 bg-primary-light border border-white/5 rounded-2xl overflow-hidden group shadow-lg"
                  >
                    <div className="absolute inset-0 bg-black/60 z-10 group-hover:bg-black/40 transition-colors duration-500" />
                    <img 
                      src={getCategoryThumbnail(cat.name)} 
                      alt={cat.name} 
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-125 transition-transform duration-700 scale-110 origin-top-left" 
                    />
                    <div className="relative z-20 flex flex-col items-center p-4">
                      <span className="font-black text-white text-xl mb-1 tracking-tight text-shadow-md">{cat.name}</span>
                      <span className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em]">{cat.count} Games</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending & Popular Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Trending */}
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
                <Flame size={28} />
              </div>
              <h2 className="text-3xl font-black text-white uppercase italic">Trending <span className="text-red-500">Now</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {trendingGames?.slice(0, 4).map((game) => (
                <GameCard key={game._id} game={game} />
              ))}
            </div>
            <Link href="/trending" className="inline-block mt-8">
              <Button variant="outline" size="sm">Explore Trending</Button>
            </Link>
          </div>

          {/* Popular */}
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                <Star size={28} />
              </div>
              <h2 className="text-3xl font-black text-white uppercase italic">Most <span className="text-accent">Played</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {popularGames?.slice(0, 4).map((game) => (
                <GameCard key={game._id} game={game} />
              ))}
            </div>
            <Link href="/games?sort=plays" className="inline-block mt-8">
              <Button variant="outline" size="sm">Explore Popular</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase italic">
              Latest from <span className="text-accent underline decoration-white/10">GamxCloud</span>
            </h2>
          </div>
          <Link href="/blog" className="text-accent font-black uppercase text-sm tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
            Check the Blog <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts?.posts?.map((post: any) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      </section>

      {/* Blog Preview Section End */}

      {/* Newsletter / CTA Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="bg-gradient-to-r from-accent to-blue-700 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 italic uppercase">Ready for the Next level?</h2>
            <p className="text-accent-light text-xl mb-10 max-w-2xl mx-auto font-bold uppercase tracking-tight">
              Access thousands of free games with no restrictions.
            </p>
            <Link href="/games">
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white hover:bg-white hover:opacity-90 border-none h-16 px-12 text-xl font-black italic relative z-20"
                style={{ color: 'black' }}
              >
                BROWSE ALL GAMES
              </Button>
            </Link>
          </motion.div>
          
          {/* Decorative icons */}
          <div className="absolute top-10 left-10 text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
            <Gamepad2 size={120} />
          </div>
          <div className="absolute bottom-10 right-10 text-white/10 -rotate-12 group-hover:-rotate-45 transition-transform duration-1000">
            <Search size={100} />
          </div>
        </div>
      </section>
    </div>
  );
}

// Internal reusable components needed by HomePage
function Badge({ children, variant, className, ...props }: any) {
  const styles = {
    accent: "bg-accent/10 text-accent border border-accent/20",
    default: "bg-gray-800 text-gray-300",
  };
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${styles[variant as keyof typeof styles] || styles.default} ${className}`} {...props}>
      {children}
    </span>
  );
}

function Flame({ size }: { size: number }) {
  return <TrendingUp size={size} className="text-red-500" />;
}
