"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { gamesApi } from "@/lib/api";
import GameGrid from "@/components/games/GameGrid";
import { Search as SearchIcon, XCircle, Lightbulb } from "lucide-react";
import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => gamesApi.searchGames({ q: query, limit: 24 }),
    enabled: query.length > 1,
  });

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim().length > 1) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 min-h-[70vh]">
      <div className="max-w-4xl mx-auto mb-20 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase mb-8">
          Search the <span className="text-accent underline decoration-white/10">Vault</span>
        </h1>
        
        <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
            <SearchIcon size={24} />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search titles, tags, or categories..."
            className="w-full bg-primary-light border border-white/10 rounded-[2rem] py-6 pl-16 pr-24 text-xl text-white placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all font-bold shadow-2xl"
          />
          <div className="absolute right-4 inset-y-0 flex items-center">
             <Button type="submit" size="sm" className="h-10 px-6 rounded-full font-black uppercase text-xs italic">
                FIND
             </Button>
          </div>
        </form>

        {query && (
          <p className="mt-8 text-gray-500 font-medium tracking-tight">
            Found {data?.pagination.total || 0} results for <span className="text-white">"{query}"</span>
          </p>
        )}
      </div>

      {!query ? (
        <div className="flex flex-col items-center justify-center py-20 bg-primary-light/20 rounded-[3rem] border border-dashed border-white/5">
           <SearchIcon size={64} className="text-gray-800 mb-6" />
           <h3 className="text-2xl font-bold text-gray-600 uppercase italic">Type something to begin</h3>
           <p className="text-gray-700 mt-2 font-medium">Find your next favorite game in the h5games space database.</p>
        </div>
      ) : (
        <GameGrid games={data?.games || []} isLoading={isLoading} />
      )}

      {query && data?.games.length === 0 && !isLoading && (
         <div className="flex flex-col items-center justify-center py-20 bg-primary-light/50 rounded-[3rem] border border-white/5 text-center">
           <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
              <XCircle size={40} />
           </div>
           <h3 className="text-2xl font-bold text-white uppercase italic mb-2">No Results Found</h3>
           <p className="text-gray-500 max-w-sm mb-10">We couldn't find any games matching your request. Try using broader keywords.</p>
           
           <div className="bg-primary/50 p-8 rounded-2xl border border-white/5 max-w-md w-full">
              <div className="flex items-center gap-2 text-accent mb-4 font-bold text-sm uppercase tracking-widest justify-center">
                 <Lightbulb size={16} /> Suggestions
              </div>
              <ul className="text-gray-400 text-sm space-y-3 font-medium">
                 <li>Check for typos or misspellings</li>
                 <li>Try searching by category (e.g. "Action")</li>
                 <li>Try simpler, generic terms (e.g. "Space")</li>
                 <li>Browse all games to discover new titles</li>
              </ul>
           </div>
         </div>
      )}
    </div>
  );
}
