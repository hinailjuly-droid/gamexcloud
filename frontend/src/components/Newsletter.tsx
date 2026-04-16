"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <div className="bg-accent rounded-[2.5rem] p-10 relative overflow-hidden group">
      <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]" />
      <div className="relative z-10 text-center">
        <AnimatePresence mode="wait">
          {!subscribed ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-3xl font-black text-white italic uppercase leading-none mb-4 tracking-tighter">
                Stay in the <span className="underline decoration-white/30">Loop</span>
              </h4>
              <p className="text-white/80 text-sm font-bold mb-8 italic">
                Get the latest HTML5 guides and game gems delivered weekly.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com" 
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-white/50 placeholder:text-white/40 font-bold text-center"
                />
                <button 
                  type="submit"
                  className="w-full bg-white text-accent font-black italic uppercase py-4 rounded-2xl shadow-xl transition-all hover:bg-gray-100 active:scale-95"
                >
                  SUBSCRIBE NOW
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="py-6"
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-white/20">
                <Check className="text-accent" size={40} strokeWidth={4} />
              </div>
              <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">
                You are subscribed
              </h4>
              <p className="text-white/90 text-sm font-bold italic max-w-[280px] mx-auto leading-relaxed">
                We have successfully received your subscription request. We will reach you in 48-72 hours.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
