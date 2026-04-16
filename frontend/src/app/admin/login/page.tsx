"use client";

import { useState } from "react";
import { adminApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { KeyRound, Mail, ShieldCheck, AlertCircle } from "lucide-react";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await adminApi.login({ email, password });
      Cookies.set("token", data.token, { expires: 1/3 }); // 8 hours
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -z-0" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-primary-light border border-white/5 p-10 rounded-[3rem] shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-accent/20">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            ADMIN<span className="text-accent underline">LOGIN</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-2">Secure access to h5games space backend</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-accent transition-colors" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-primary-lighter border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-accent/40 transition-all font-bold"
                placeholder="admin@pixelvault.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Password</label>
            <div className="relative group">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-accent transition-colors" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-primary-lighter border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-accent/40 transition-all font-bold"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-14" isLoading={isLoading} size="lg">
            SIGN IN TO VAULT
          </Button>
        </form>

        <div className="mt-8 text-center">
           <Link href="/" className="text-xs font-black text-gray-600 hover:text-white uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              ← Return to public site
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
