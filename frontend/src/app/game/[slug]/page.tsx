"use client";

// BUILD_TAG: 2026-05-12_V2_ADS_REMOVED
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { gamesApi } from "@/lib/api";
import { Game } from "@/types";
import Header from "@/components/layout/Header";
import GameGrid from "@/components/games/GameGrid";
import GamePlayer from "@/components/games/GamePlayer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import AdSlot from "@/components/ads/AdSlot";
import { Star, Eye, Play, Code2, Share2, ChevronRight, LayoutGrid, Calendar, Quote } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Newsletter from "@/components/Newsletter";

export default function GameDetailPage() {
  const { slug } = useParams();

  const { data: game, isLoading, error } = useQuery<Game & { related: Game[] }>({
    queryKey: ['game', slug],
    queryFn: () => gamesApi.getGameBySlug(slug as string),
    enabled: !!slug,
  });

  const viewMutation = useMutation({
    mutationFn: (id: string) => gamesApi.trackView(id),
  });

  const playMutation = useMutation({
    mutationFn: (id: string) => gamesApi.trackPlay(id),
  });

  useEffect(() => {
    if (game?._id) {
      viewMutation.mutate(game._id);
    }

    // Trigger H5 Interstitial Ad for Beta
    if (typeof window !== 'undefined' && (window as any).adBreak) {
      console.log('🎬 Triggering H5 adBreak...');
      (window as any).adBreak({
        type: 'start',
        name: 'game-start',
      });
    }
  }, [game?._id, slug]);

  if (isLoading) return <div className="container mx-auto px-4 py-20 text-center text-white">Loading...</div>;
  if (error || !game) return <div className="container mx-auto px-4 py-20 text-center text-white">Game not found</div>;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${game.title} on GamxCloud`,
        text: `Play ${game.title} - Free HTML5 Game`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="pb-20">
      {/* Breadcrumbs */}
      <div className="bg-primary/50 border-b border-white/5 mb-8">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/games" className="hover:text-white transition-colors">Games</Link>
          <ChevronRight size={12} />
          <Link href={`/category/${game.category.toLowerCase()}`} className="hover:text-white transition-colors">{game.category}</Link>
          <ChevronRight size={12} />
          <span className="text-accent">{game.title}</span>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 flex flex-col xl:flex-row gap-8 justify-center items-start">
        {/* Left Skyscraper (Desktop Only) */}
        <AdSlot position="skyscraper_left" sticky className="mt-24" />

        {/* Main Layout Container */}
        <div className="flex-grow max-w-7xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Game Area */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                      {game.title}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="accent">{game.category}</Badge>
                    {game.verified && <Badge variant="success">Verified</Badge>}
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1.5 text-yellow-400">
                    <Star size={18} className="fill-yellow-400" />
                    <span className="font-bold">{game.stars.toLocaleString()} Stars</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-accent-light">
                    <Play size={18} className="fill-accent-light" />
                    <span className="font-bold">{game.plays.toLocaleString()} Plays</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Eye size={18} />
                    <span className="font-bold">{game.views.toLocaleString()} Views</span>
                  </div>
                </div>
              </div>

              {/* Game Player */}
              <div onClick={() => playMutation.mutate(game._id)}>
                <GamePlayer 
                  playUrl={game.playUrl} 
                  githubUrl={game.githubUrl} 
                  title={game.title} 
                  standalone={game.standalone}
                />
              </div>

              {/* Game Details Section */}
              <div className="bg-primary-light border border-white/5 rounded-[2rem] p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1.5 h-8 bg-accent rounded-full" />
                  <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">About Game</h2>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <div className="text-lg text-gray-400 leading-relaxed mb-8 flex gap-4">
                    <Quote className="text-accent shrink-0" size={32} />
                    <p className="italic font-medium">{game.description || "No description available for this game."}</p>
                  </div>
                  
                  <div className="text-gray-300 space-y-4 text-base leading-loose whitespace-pre-line">
                    <p>
                      Welcome to the ultimate online gaming experience with {game.title}, a premier title in the {game.category} genre! Whether you are a casual player looking for some quick fun or a seasoned gamer aiming for high scores, {game.title} is designed to offer endless entertainment. Playable directly in your browser without any downloads, this game combines stunning visuals with smooth gameplay mechanics.
                    </p>
                    <p>
                      In {game.title}, players will dive into beautifully crafted levels that challenge your reflexes, strategy, and problem-solving skills. The developers have optimized the game to run seamlessly on both desktop and mobile devices, ensuring you can enjoy uncompromised performance wherever you go. As part of our curated {game.category} collection, it stands out for its engaging dynamics and intuitive controls. Master the unique mechanics and beat your own records!
                    </p>
                    <p>
                      Why wait? Dive into {game.title} right now and discover why it is so highly rated among players worldwide. Enjoy the captivating graphics, the immersive background score, and the thrill of the completely free gameplay that will keep you glued to your screen for hours!
                    </p>
                    <h3 className="text-xl font-bold text-white mt-8 mb-4">How to Play {game.title}</h3>
                    <p>
                      Getting started is incredibly easy! The game typically uses simple mouse clicks, taps, or basic keyboard controls depending on your device. Follow the on-screen tutorial during your first session to learn the core mechanics. Your main objective is to complete the level requirements, score maximum points, and unlock further challenges. Pay attention to power-ups and special items that appear—they can give you a massive advantage! Remember to save your progress and share your top scores with your friends.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              {/* Actions Card */}
              <div className="bg-primary-light border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest text-center mb-2">Share With Friends</h3>
                <div className="grid grid-cols-4 gap-2">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" className="h-12 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-xl flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=Play%20${encodeURIComponent(game.title)}`} target="_blank" rel="noopener noreferrer" className="h-12 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] rounded-xl flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </a>
                  <a href={`https://api.whatsapp.com/send?text=Play%20${encodeURIComponent(game.title)}%20here:%20${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" className="h-12 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-xl flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.012 2C6.486 2 2 6.486 2 12.012c0 1.748.45 3.447 1.305 4.93L2 22l5.244-1.275a10 10 0 004.768 1.198h.004c5.524 0 10-4.486 10-10.011 0-5.526-4.476-10.012-10-10.012zm0 18.024c-1.488 0-2.95-.39-4.238-1.127l-.304-.176-3.149.765.778-3.08-.204-.32a8.03 8.03 0 01-1.246-4.305C3.65 7.6 7.55 3.7 12.016 3.7c4.466 0 8.366 3.9 8.366 8.366 0 4.467-3.9 8.368-8.368 8.368z"/></svg>
                  </a>
                  <Button variant="outline" className="h-12 rounded-xl text-gray-400 border-white/5 hover:text-white" onClick={handleShare}>
                    <Share2 size={18} />
                  </Button>
                </div>
              </div>
              
              <Newsletter />


            </div>
          </div>
        </div>

        {/* Right Skyscraper (Desktop Only) */}
        <AdSlot position="skyscraper_right" sticky className="mt-24" />
      </div>

      {/* Related Games - Full Width Grid Below */}
      <div className="container mx-auto px-4 mt-20">
        <div className="flex items-center justify-between mb-10 px-2">
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">More <span className="text-accent">{game.category}</span></h3>
        </div>
        <GameGrid games={game.related || []} />
      </div>
      {/* Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoGame",
            "name": game.title,
            "description": game.description,
            "genre": game.category,
            "url": `https://gamxcloud.xyz/game/${game.slug}`,
            "image": game.thumbnail,
            "author": {
              "@type": "Organization",
              "name": "GamxCloud Authors"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "bestRating": "5",
              "ratingCount": game.stars || 10
            },
            "offeredBy": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
    </div>
  );
}
