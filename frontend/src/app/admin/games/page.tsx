"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Star, 
  CheckCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EditGameModal from "@/components/admin/EditGameModal";
import { Game, GamesResponse } from "@/types";

export default function GamesManagerPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  const { data, isLoading } = useQuery<GamesResponse>({
    queryKey: ['admin', 'games', { page, search, category }],
    queryFn: () => adminApi.getGames({ page, search, category, limit: 15 }),
    placeholderData: (previousData) => previousData,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, type }: { id: string, type: 'feature' | 'verify' }) => 
      type === 'feature' ? adminApi.toggleFeature(id) : adminApi.toggleVerify(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'games'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteGame(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'games'] }),
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to deactivate this game? It will no longer appear on the website.")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="flex bg-black min-h-screen">
      <AdminSidebar />
      
      <main className="flex-grow p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
              VAULT<span className="text-accent underline">MANAGER</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-tight">Manage, edit, and verify all games in the database.</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-primary-light border border-white/5 rounded-3xl p-6 mb-8 flex flex-col md:flex-row gap-6">
          <div className="flex-grow relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-accent" size={18} />
            <input 
               type="text" 
               placeholder="Search by name or title..." 
               value={search}
               onChange={(e) => { setSearch(e.target.value); setPage(1); }}
               className="w-full bg-primary-lighter border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-accent/40"
            />
          </div>
          <div className="w-full md:w-64">
             <select 
               value={category}
               onChange={(e) => { setCategory(e.target.value); setPage(1); }}
               className="w-full bg-primary-lighter border border-white/5 rounded-xl py-3 px-6 text-white text-sm font-bold focus:outline-none focus:border-accent/40"
             >
                <option value="">All Categories</option>
                {['Action', 'Puzzle', 'RPG', 'Racing', 'Strategy', 'Arcade', 'Multiplayer', 'Board & Card', 'Simulation', 'Platformer', 'Other'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
             </select>
          </div>
        </div>

        {/* Games Table */}
        <div className="bg-primary-light border border-white/5 rounded-[2.5rem] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                <th className="py-6 pl-8">Game</th>
                <th className="py-6">Category</th>
                <th className="py-6">Stars</th>
                <th className="py-6">Status</th>
                <th className="py-6">Features</th>
                <th className="py-6 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-bold">
              {isLoading ? (
                <tr>
                   <td colSpan={6} className="py-20 text-center text-gray-500 italic">Exploring the vault...</td>
                </tr>
              ) : data?.games.map((game) => (
                <tr key={game._id} className="group hover:bg-white/5 transition-all">
                  <td className="py-5 pl-8">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-primary-lighter rounded-xl flex items-center justify-center text-white/10 font-black text-xl overflow-hidden shrink-0">
                          {game.title?.[0]}
                       </div>
                       <div className="min-w-0">
                          <h4 className="text-white text-sm truncate group-hover:text-accent transition-colors">{game.title}</h4>
                          <span className="text-[10px] text-gray-600 uppercase tracking-widest font-black">{game.license}</span>
                       </div>
                    </div>
                  </td>
                  <td className="py-5 text-xs">
                     <Badge variant="accent">{game.category}</Badge>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-1.5 text-xs text-yellow-400">
                      <Star size={14} className="fill-yellow-400" />
                      {game.stars.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-5">
                     {game.active ? (
                       <Badge variant="success">Active</Badge>
                     ) : (
                       <Badge variant="default">Inactive</Badge>
                     )}
                  </td>
                  <td className="py-5">
                     <div className="flex gap-2">
                        <button 
                           onClick={() => toggleMutation.mutate({ id: game._id, type: 'feature' })}
                           className={`p-2 rounded-lg transition-all ${game.featured ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-white/5 text-gray-600 border border-transparent hover:border-white/10'}`}
                        >
                           <Star size={14} className={game.featured ? 'fill-yellow-500' : ''} />
                        </button>
                        <button 
                           onClick={() => toggleMutation.mutate({ id: game._id, type: 'verify' })}
                           className={`p-2 rounded-lg transition-all ${game.verified ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-white/5 text-gray-600 border border-transparent hover:border-white/10'}`}
                        >
                           <CheckCircle size={14} />
                        </button>
                     </div>
                  </td>
                  <td className="py-5 pr-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button onClick={() => setEditingGame(game)} className="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-lg border border-transparent hover:border-white/10">
                          <Edit3 size={16} />
                       </button>
                       <a href={`/game/${game.slug}`} target="_blank" className="p-2 text-gray-500 hover:text-accent transition-colors bg-white/5 rounded-lg border border-transparent hover:border-white/10">
                          <ExternalLink size={16} />
                       </a>
                       <button onClick={() => handleDelete(game._id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors bg-white/5 rounded-lg border border-transparent hover:border-white/10">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {data && data.pagination.pages > 1 && (
            <div className="p-8 border-t border-white/5 flex items-center justify-between">
               <span className="text-xs font-black text-gray-600 uppercase tracking-widest">Page {page} of {data.pagination.pages}</span>
               <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                     <ChevronLeft size={16} /> PREV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))} disabled={page === data.pagination.pages}>
                     NEXT <ChevronRight size={16} />
                  </Button>
               </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {editingGame && (
          <EditGameModal 
            game={editingGame} 
            onClose={() => setEditingGame(null)} 
            onSuccess={() => {
               setEditingGame(null);
               queryClient.invalidateQueries({ queryKey: ['admin', 'games'] });
            }}
          />
        )}
      </main>
    </div>
  );
}
