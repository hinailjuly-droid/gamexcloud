"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { gamesApi } from "@/lib/api";
import GameGrid from "@/components/games/GameGrid";
import GameFilters from "@/components/games/GameFilters";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

function HomePageContent() {
  const searchParams = useSearchParams();
  
  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'stars';
  const search = searchParams.get('search') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['games', { page, category, sort, search }],
    queryFn: () => gamesApi.getGames({ page, category, sort, search, limit: 40 }),
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col gap-10">
        {/* Compact Header for Home */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/10 dark:border-white/10 pb-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-black dark:text-white italic uppercase mb-2">
              BROWSE <span className="text-accent underline decoration-white/10">GAMES</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-tight uppercase text-sm">
              {data ? `${data.pagination.total} free online gaming no login titles` : 'Exploring the vault...'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32">
              <GameFilters />
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <GameGrid 
              games={data?.games || []} 
              isLoading={isLoading} 
            />

            {/* Pagination */}
            {data && data.pagination.pages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                <Pagination 
                  currentPage={page} 
                  totalPages={data.pagination.pages} 
                  searchParams={searchParams} 
                />
              </div>
            )}

            {/* SEO Section at Bottom */}
            <section className="mt-20">
               <div className="bg-black/5 dark:bg-white/5 rounded-[2rem] p-10 border-2 border-dashed border-black/10 dark:border-white/10 text-center">
                  <h2 className="text-2xl md:text-4xl font-black mb-4 uppercase italic text-black dark:text-white">The Ultimate Free Gaming Portal</h2>
                  <p className="text-base md:text-lg font-bold text-black/60 dark:text-white/60 max-w-4xl mx-auto leading-relaxed">
                    Play <span className="text-black dark:text-white underline font-black">free online gaming no login</span> on GamxCloud. 
                    Our optimized platform delivers high-performance HTML5 games directly to your browser. 
                    No downloads, no logins, just pure fun.
                  </p>
               </div>
            </section>

            {/* Keywords footer section */}
            <div className="flex flex-wrap justify-center gap-4 text-[10px] md:text-xs font-bold text-black/30 dark:text-white/30 uppercase tracking-widest mt-10">
              <span>free online gaming no login</span>
              <span>•</span>
              <span>no download games</span>
              <span>•</span>
              <span>instant play games</span>
              <span>•</span>
              <span>h5 games cloud</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, searchParams }: any) {
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;
  const pathname = typeof window !== 'undefined' ? require('next/navigation').usePathname() : '';

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pages = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-primary-light flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>
      
      <div className="flex items-center gap-2">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
              currentPage === p 
                ? 'bg-accent text-black shadow-lg ring-1 ring-white/20' 
                : 'text-gray-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-primary-light flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
      >
        <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}

export default function HomePage() { 
  return ( 
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center text-black/20 dark:text-white/20 italic font-black uppercase tracking-tighter'>Loading GamxCloud...</div>}>
      <HomePageContent />
    </Suspense> 
  ); 
}
