"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Button from "@/components/ui/Button";
import { 
  Settings, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  UserPlus, 
  Globe, 
  Database,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const passwordMutation = useMutation({
    mutationFn: (data: any) => adminApi.changePassword(data),
    onSuccess: () => {
      setStatus({ type: 'success', message: 'Password updated successfully!' });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err: any) => {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to update password' });
    }
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }
    passwordMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <div className="flex bg-black min-h-screen">
      <AdminSidebar />
      
      <main className="flex-grow p-10">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
            SYSTEM<span className="text-accent underline">SETTINGS</span>
          </h1>
          <p className="text-gray-500 font-medium tracking-tight">Configure account security and global platform parameters.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* Password Change */}
           <div className="bg-primary-light border border-white/5 rounded-[2.5rem] p-10">
              <div className="flex items-center gap-3 mb-10">
                 <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
                    <Lock size={20} />
                 </div>
                 <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Security <span className="text-red-500">Update</span></h3>
              </div>

              {status && (
                <div className={`mb-8 p-5 rounded-2xl flex items-center gap-3 text-sm font-bold border ${status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                   {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                   {status.message}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Current Password</label>
                    <input 
                       type="password" 
                       required
                       value={currentPassword}
                       onChange={(e) => setCurrentPassword(e.target.value)}
                       className="w-full bg-primary-lighter border border-white/5 rounded-2xl py-4 px-6 text-white text-sm font-bold focus:outline-none focus:border-accent/40 transition-all"
                       placeholder="••••••••"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">New Password</label>
                    <input 
                       type="password" 
                       required
                       value={newPassword}
                       onChange={(e) => setNewPassword(e.target.value)}
                       className="w-full bg-primary-lighter border border-white/5 rounded-2xl py-4 px-6 text-white text-sm font-bold focus:outline-none focus:border-accent/40 transition-all"
                       placeholder="••••••••"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Confirm New Password</label>
                    <input 
                       type="password" 
                       required
                       value={confirmPassword}
                       onChange={(e) => setConfirmPassword(e.target.value)}
                       className="w-full bg-primary-lighter border border-white/5 rounded-2xl py-4 px-6 text-white text-sm font-bold focus:outline-none focus:border-accent/40 transition-all"
                       placeholder="••••••••"
                    />
                 </div>
                 <Button type="submit" className="w-full h-14" isLoading={passwordMutation.isPending} icon={KeyRound}>
                    SECURE NEW PASSWORD
                 </Button>
              </form>
           </div>

           {/* Platform Config */}
           <div className="flex flex-col gap-10">
              <div className="bg-primary-light border border-white/5 rounded-[2.5rem] p-10">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                       <Globe size={20} />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Global <span className="text-accent">Configs</span></h3>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-primary-lighter rounded-2xl border border-white/5">
                       <div className="flex flex-col gap-0.5">
                          <span className="text-white font-bold text-sm">Maintenance Mode</span>
                          <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Public Site Offline</span>
                       </div>
                       <input type="checkbox" className="w-10 h-6 accent-accent rounded-full cursor-not-allowed" disabled />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-primary-lighter rounded-2xl border border-white/5">
                       <div className="flex flex-col gap-0.5">
                          <span className="text-white font-bold text-sm">AdSense Placement</span>
                          <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Global Toggle</span>
                       </div>
                       <input type="checkbox" defaultChecked className="w-10 h-6 accent-accent rounded-full" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-primary-lighter rounded-2xl border border-white/5">
                       <div className="flex flex-col gap-0.5">
                          <span className="text-white font-bold text-sm">Crawler Frequency</span>
                          <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Monthly Sync</span>
                       </div>
                       <Badge variant="accent">30 DAYS</Badge>
                    </div>
                 </div>
              </div>

              <div className="bg-primary-light border border-white/5 rounded-[2.5rem] p-10 flex-grow">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
                       <Database size={20} />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">System <span className="text-indigo-500">Info</span></h3>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-primary-lighter rounded-2xl border border-white/5 text-center">
                       <span className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Node.js</span>
                       <span className="text-white font-bold">v18.17.0</span>
                    </div>
                    <div className="p-4 bg-primary-lighter rounded-2xl border border-white/5 text-center">
                       <span className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">MDB Version</span>
                       <span className="text-white font-bold">6.0.4</span>
                    </div>
                    <div className="p-4 bg-primary-lighter rounded-2xl border border-white/5 text-center">
                       <span className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Uptime</span>
                       <span className="text-accent font-bold">14d 6h</span>
                    </div>
                    <div className="p-4 bg-primary-lighter rounded-2xl border border-white/5 text-center">
                       <span className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Region</span>
                       <span className="text-white font-bold">us-east-1</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
