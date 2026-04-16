"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, color = "accent" }: StatCardProps) {
  const colors: Record<string, string> = {
    accent: "text-accent bg-accent/10 border-accent/20",
    green: "text-green-500 bg-green-500/10 border-green-500/20",
    red: "text-red-500 bg-red-500/10 border-red-500/20",
    yellow: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-primary-light border border-white/5 rounded-3xl p-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colors[color]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trend.value}%
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-3xl font-black text-white italic">{value}</p>
      </div>
    </motion.div>
  );
}
