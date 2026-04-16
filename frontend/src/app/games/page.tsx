"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { gamesApi } from "@/lib/api";
import GameGrid from "@/components/games/GameGrid";
import GameFilters from "@/components/games/GameFilters";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import Button from "@/components/ui/Button";
import AdSlot from "@/components/ads/AdSlot";

export default function GamesPage() {
  const searchParams = useSearchParams();
  
  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'stars';
  const search = searchParams.get('search') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['games', { page, category, sort, search }],
    queryFn: () => gamesApi.getGames({ page, category, sort, search, limit: 44 }),
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase mb-2">
              Browse <span className="text-accent underline decoration-white/10">Games</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-tight">
              {data ? `Showing ${data.pagination.total} open-source titles` : 'Exploring the vault...'}
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

            {/* AdSlot - List Inline */}
            <AdSlot position="list_inline" />

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
        className="w-10 h-10 rounded-xl border border-white/5 bg-primary-light flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>
      
      <div className="flex items-center gap-2">
        {startPage > 1 && (
          <>
            <button 
              onClick={() => handlePageChange(1)} 
              className="w-10 h-10 rounded-xl text-sm font-black text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            >
              1
            </button>
            <span className="text-gray-700 font-bold px-1">...</span>
          </>
        )}
        
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
              currentPage === p 
                ? 'bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-white/20' 
                : 'text-gray-500 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10'
            }`}
          >
            {p}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            <span className="text-gray-700 font-bold px-1">...</span>
            <button 
              onClick={() => handlePageChange(totalPages)} 
              className="w-10 h-10 rounded-xl text-sm font-black text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="w-10 h-10 rounded-xl border border-white/5 bg-primary-light flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
      >
        <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
