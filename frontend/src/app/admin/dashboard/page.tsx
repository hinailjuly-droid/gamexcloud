"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatCard from "@/components/admin/StatCard";
import { 
  Gamepad2, 
  Play, 
  Eye, 
  CheckCircle, 
  Star, 
  RefreshCcw, 
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  ShieldCheck
} from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { DashboardData } from "@/types";

export default function AdminDashboardPage() {
  const { data, isLoading, refetch } = useQuery<DashboardData>({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminApi.getDashboard(),
  });

  const handleManualFetch = async () => {
    if (confirm("Start fetching new games from GitHub? This runs in the background.")) {
      try {
        await adminApi.triggerFetch();
        alert("Fetch triggered successfully!");
      } catch (err) {
        alert("Failed to trigger fetch.");
      }
    }
  };

  if (isLoading) return <div className="flex bg-black min-h-screen items-center justify-center text-white">Loading Dashboard...</div>;

  const stats = data?.stats;

  return (
    <div className="flex bg-black min-h-screen">
      <AdminSidebar />
      
      <main className="flex-grow p-10 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
              COMMAND<span className="text-accent underline">CENTER</span>
            </h1>
            <p className="text-gray-500 font-medium">Overview of the h5games space ecosystem performance.</p>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" icon={RefreshCcw} size="sm" onClick={() => refetch()}>Refresh Data</Button>
            <Button icon={Gamepad2} size="sm" onClick={handleManualFetch}>Manual GitHub Sync</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard title="Total Games" value={stats?.totalGames || 0} icon={Gamepad2} color="accent" />
          <StatCard title="Active Games" value={stats?.activeGames || 0} icon={CheckCircle} color="green" />
          <StatCard title="Monthly Plays" value={stats?.monthlyPlays || 0} icon={Play} color="yellow" trend={{ value: 12, isUp: true }} />
          <StatCard title="Monthly Views" value={stats?.monthlyViews || 0} icon={Eye} color="accent" trend={{ value: 5, isUp: false }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Top Games Table */}
          <div className="lg:col-span-8 bg-primary-light border border-white/5 rounded-[2.5rem] p-8">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Most Popular <span className="text-accent">Titles</span></h3>
                <Link href="/admin/games?sort=plays" className="text-xs font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">View All</Link>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                      <th className="pb-4 pl-4">Game</th>
                      <th className="pb-4">Category</th>
                      <th className="pb-4">Plays</th>
                      <th className="pb-4">Views</th>
                      <th className="pb-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data?.topGames.map((game) => (
                      <tr key={game.slug} className="group hover:bg-white/5 transition-all text-sm">
                        <td className="py-4 pl-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary-lighter rounded-lg flex items-center justify-center font-black text-white/20 select-none">
                                 {game.title?.[0]}
                              </div>
                              <span className="font-bold text-white group-hover:text-accent transition-colors">{game.title}</span>
                           </div>
                        </td>
                        <td className="py-4 text-gray-400 font-medium">{game.category}</td>
                        <td className="py-4 font-bold text-gray-300">{game.plays?.toLocaleString()}</td>
                        <td className="py-4 font-bold text-gray-400">{game.views?.toLocaleString()}</td>
                        <td className="py-4">
                           <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-black rounded uppercase">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>

          {/* Category Breakdown */}
          <div className="lg:col-span-4 bg-primary-light border border-white/5 rounded-[2.5rem] p-8 flex flex-col gap-8">
             <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Caterory <span className="text-accent">Distribution</span></h3>
             
             <div className="space-y-4 flex-grow">
                {data?.categoryBreakdown.slice(0, 8).map((cat) => (
                  <div key={cat._id} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                       <span className="text-gray-400">{cat._id}</span>
                       <span className="text-white">{cat.count}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <div 
                          className="h-full bg-accent" 
                          style={{ width: `${(cat.count / (stats?.totalGames || 1)) * 100}%` }}
                       />
                    </div>
                  </div>
                ))}
             </div>
             
             <div className="pt-6 border-t border-white/5">
                <div className="p-6 bg-accent rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
                   <div className="relative z-10">
                      <h4 className="text-white font-black italic text-lg uppercase mb-1">Verify Queue</h4>
                      <p className="text-white/80 text-xs font-bold uppercase">42 Games waiting review</p>
                   </div>
                   <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-white group-hover:translate-x-2 transition-transform" />
                   < ShieldCheck size={80} className="absolute -bottom-4 -right-4 opacity-10 text-white rotate-12" />
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
