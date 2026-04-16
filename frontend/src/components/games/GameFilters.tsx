"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import Badge from "../ui/Badge";

const CATEGORIES = [
  'Action', 'Puzzle', 'RPG', 'Racing', 'Strategy', 
  'Arcade', 'Multiplayer', 'Board & Card', 'Simulation', 
  'Platformer', 'Other'
];

const SORT_OPTIONS = [
  { label: 'Most Stars', value: 'stars' },
  { label: 'Most Played', value: 'plays' },
  { label: 'Recently Updated', value: 'updated' },
  { label: 'Newest', value: 'newest' },
  { label: 'A-Z', value: 'name' },
];

export default function GameFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'stars';
  const currentSearch = searchParams.get('search') || '';

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page if filtering
    if (key !== 'page') params.delete('page');
    replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    replace(pathname);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Explore 1,000+ games..."
          defaultValue={currentSearch}
          onChange={(e) => {
            const val = e.target.value;
            const handler = setTimeout(() => handleFilterChange('search', val), 500);
            return () => clearTimeout(handler);
          }}
          className="w-full bg-primary-light border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all font-medium"
        />
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-white font-bold mb-4 flex items-center gap-2 uppercase text-xs tracking-widest text-gray-500">
          <Filter size={14} /> Categories
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('category', '')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              !currentCategory ? 'bg-accent text-white' : 'bg-primary-light text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange('category', cat)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                currentCategory === cat ? 'bg-accent text-white' : 'bg-primary-light text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest text-gray-500">Sort By</h4>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleFilterChange('sort', opt.value)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all border ${
                currentSort === opt.value 
                  ? 'bg-accent/10 border-accent text-accent' 
                  : 'bg-primary-light border-white/5 text-gray-400 hover:text-white hover:border-white/10'
              }`}
            >
              {opt.label}
              {currentSort === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(79,142,247,0.8)]" />}
            </button>
          ))}
        </div>
      </div>

      {(currentCategory || currentSearch || currentSort !== 'stars') && (
        <button
          onClick={clearFilters}
          className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-gray-500 hover:text-white transition-colors border border-dashed border-white/10 rounded-xl hover:bg-white/5"
        >
          <X size={14} /> Clear all filters
        </button>
      )}
    </div>
  );
}
