"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatCard from "@/components/admin/StatCard";
import { 
  BarChart3, 
  TrendingUp, 
  Play, 
  Eye, 
  Share2, 
  MousePointer2,
  PieChart,
  Calendar
} from "lucide-react";

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => adminApi.getAnalytics(),
  });

  if (isLoading) return <div className="flex bg-black min-h-screen items-center justify-center text-white">Loading Analytics...</div>;

  return (
    <div className="flex bg-black min-h-screen">
      <AdminSidebar />
      
      <main className="flex-grow p-10">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
            INSIGHTS<span className="text-accent underline">ENGINE</span>
          </h1>
          <p className="text-gray-500 font-medium tracking-tight">Deep dive into player behavior and traffic sources.</p>
        </div>

        {/* Charts Section Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
           <div className="bg-primary-light border border-white/5 rounded-[2.5rem] p-10 h-80 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Daily <span className="text-accent">Engagement</span></h3>
                 <Calendar className="text-gray-600" size={18} />
              </div>
              <div className="flex-grow flex items-end gap-2 px-4 pb-4">
                 {/* Visual Mock of Bar Chart since we don't have Recharts installed */}
                 {data?.daily.slice(-14).map((day: any, i: number) => (
                   <div key={i} className="flex-grow bg-white/5 rounded-t-lg relative group transition-all hover:bg-accent/40" style={{ height: `${(day.views / 200) * 100}%` }}>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-accent text-white text-[8px] font-black py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                         {day.views} Views
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-[8px] font-bold text-gray-700 uppercase -rotate-45">
                         {day.date.split('-').slice(1).join('/')}
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-primary-light border border-white/5 rounded-[2.5rem] p-10 h-80 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Category <span className="text-accent">Performance</span></h3>
                 <PieChart className="text-gray-600" size={18} />
              </div>
              <div className="flex-grow flex flex-col justify-center gap-4">
                 {data?.categoryStats.slice(0, 5).map((cat: any, i: number) => (
                    <div key={i} className="space-y-1">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                          <span>{cat._id}</span>
                          <span className="text-white">{cat.totalPlays.toLocaleString()} Plays</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${['bg-accent', 'bg-blue-600', 'bg-indigo-600', 'bg-violet-600', 'bg-purple-600'][i % 5]}`} style={{ width: `${(cat.totalPlays / data.topByPlays[0].plays) * 100}%` }} />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Top 20 Games Table */}
        <div className="bg-primary-light border border-white/5 rounded-[2.5rem] p-10 overflow-hidden">
           <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                 <TrendingUp size={20} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Performance <span className="text-accent underline decoration-white/5">Leaderboard</span></h3>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                    <th className="pb-6 pl-4">Rank</th>
                    <th className="pb-6">Game Title</th>
                    <th className="pb-6">Category</th>
                    <th className="pb-6">Total Plays</th>
                    <th className="pb-6">Conversion</th>
                    <th className="pb-6 pr-4 text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-bold">
                  {data?.topByPlays.map((game: any, index: number) => (
                    <tr key={index} className="group hover:bg-white/5 transition-all text-sm">
                      <td className="py-5 pl-4 text-gray-600 font-black">#{index + 1}</td>
                      <td className="py-5">
                         <span className="text-white group-hover:text-accent transition-colors">{game.title}</span>
                      </td>
                      <td className="py-5">
                         <span className="text-[10px] bg-white/5 text-gray-500 px-2 py-1 rounded-full uppercase tracking-widest">{game.category}</span>
                      </td>
                      <td className="py-5 text-gray-300">
                         {game.plays.toLocaleString()}
                      </td>
                      <td className="py-5">
                         <div className="flex items-center gap-2">
                           <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500" style={{ width: `${Math.min((game.plays / (game.views || 1)) * 100, 100)}%` }} />
                           </div>
                           <span className="text-[10px] text-gray-500">
                             {Math.round((game.plays / (game.views || 1)) * 100)}%
                           </span>
                         </div>
                      </td>
                      <td className="py-5 pr-4 text-right text-green-500">
                         <TrendingUp size={14} className="inline mr-1" /> 12%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      </main>
    </div>
  );
}
