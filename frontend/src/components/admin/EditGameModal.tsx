"use client";

import { useState, useEffect } from "react";
import { X, Save, Trash2, ShieldCheck, Star } from "lucide-react";
import { Game } from "@/types";
import { adminApi } from "@/lib/api";
import Button from "@/components/ui/Button";

interface EditGameModalProps {
  game: Game;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditGameModal({ game, onClose, onSuccess }: EditGameModalProps) {
  const [formData, setFormData] = useState({
    title: game.title,
    category: game.category,
    playUrl: game.playUrl,
    thumbnail: game.thumbnail,
    customDescription: game.customDescription || "",
    featured: game.featured,
    verified: game.verified,
    active: game.active,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminApi.updateGame(game._id, formData);
      onSuccess();
    } catch (err) {
      alert("Failed to update game");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-primary-light border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">
            Edit <span className="text-accent">Game</span>
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">Game Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-primary-lighter border border-white/5 rounded-2xl py-3 px-6 text-white text-sm font-bold focus:outline-none focus:border-accent/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-primary-lighter border border-white/5 rounded-2xl py-3 px-6 text-white text-sm font-bold focus:outline-none focus:border-accent/40"
              >
                {['Action', 'Puzzle', 'RPG', 'Racing', 'Strategy', 'Arcade', 'Multiplayer', 'Board & Card', 'Simulation', 'Platformer', 'Other'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">Play URL</label>
            <input
              type="text"
              value={formData.playUrl}
              onChange={(e) => setFormData({ ...formData, playUrl: e.target.value })}
              className="w-full bg-primary-lighter border border-white/5 rounded-2xl py-3 px-6 text-white text-sm font-bold focus:outline-none focus:border-accent/40"
            />
          </div>

          <div className="space-y-2">
             <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">Custom SEO Description</label>
             <textarea
                rows={5}
                value={formData.customDescription}
                onChange={(e) => setFormData({ ...formData, customDescription: e.target.value })}
                className="w-full bg-primary-lighter border border-white/5 rounded-2xl py-4 px-6 text-gray-300 text-sm font-medium focus:outline-none focus:border-accent/40 leading-relaxed"
                placeholder="Write 4-6 paragraphs for better SEO..."
             />
          </div>

          <div className="grid grid-cols-3 gap-6 pt-4">
             <div className="bg-primary-lighter p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Active</span>
                <input 
                  type="checkbox" 
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="w-6 h-6 accent-accent"
                />
             </div>
             <div className="bg-primary-lighter p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 text-yellow-500">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Featured</span>
                <input 
                  type="checkbox" 
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="w-6 h-6 accent-yellow-500"
                />
             </div>
             <div className="bg-primary-lighter p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 text-green-500">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Verified</span>
                <input 
                  type="checkbox" 
                  checked={formData.verified}
                  onChange={(e) => setFormData({...formData, verified: e.target.checked})}
                  className="w-6 h-6 accent-green-500"
                />
             </div>
          </div>
        </form>

        <div className="p-8 border-t border-white/5 flex items-center justify-between gap-4">
          <Button variant="ghost" onClick={onClose}>CANCEL</Button>
          <Button icon={Save} isLoading={isSaving} onClick={handleSubmit}>SAVE CHANGES</Button>
        </div>
      </div>
    </div>
  );
}
