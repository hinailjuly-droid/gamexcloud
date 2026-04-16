"use client";

import React, { useState } from "react";
import { Check, Mail, Twitter, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSent(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase mb-6">
          Get in <span className="text-accent underline decoration-white/10">Touch</span>
        </h1>
        <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">Have a suggestion, bug report, or DMCA request? Let us know and we'll get back to you.</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-primary-light border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MessageSquare size={120} className="text-white" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Name</label>
                    <input 
                       type="text" 
                       required
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       className="w-full bg-primary-lighter border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-accent/50 transition-all font-bold placeholder:text-gray-700 shadow-inner"
                       placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Email</label>
                    <input 
                       type="email" 
                       required
                       value={formData.email}
                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                       className="w-full bg-primary-lighter border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-accent/50 transition-all font-bold placeholder:text-gray-700 shadow-inner"
                       placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Subject</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-primary-lighter border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-accent/50 transition-all font-bold appearance-none cursor-pointer shadow-inner"
                  >
                     <option>General Inquiry</option>
                     <option>Bug Report</option>
                     <option>Game Submission</option>
                     <option>DMCA Request</option>
                     <option>Advertising</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Message</label>
                  <textarea 
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-primary-lighter border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-accent/50 transition-all font-bold resize-none placeholder:text-gray-700 shadow-inner"
                    placeholder="What's on your mind?"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90 text-white font-black italic uppercase py-5 rounded-2xl transition-all shadow-xl shadow-accent/20 active:scale-[0.98] text-lg tracking-widest"
                >
                  SEND MESSAGE
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary-light border border-white/10 rounded-[4rem] p-16 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
              <div className="relative z-10">
                <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-accent/40">
                  <Check className="text-white" size={48} strokeWidth={4} />
                </div>
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-6">
                  Message Sent Successfully
                </h2>
                <div className="w-20 h-1 bg-accent mx-auto mb-8 rounded-full" />
                <p className="text-gray-400 text-lg font-bold italic max-w-md mx-auto leading-relaxed">
                  Your inquiry has been successfully received. We will reach you in <span className="text-white">48-72 hours</span> via the email provided.
                </p>
                <button 
                  onClick={() => setIsSent(false)}
                  className="mt-12 text-accent uppercase font-black italic text-xs tracking-widest hover:text-white transition-colors"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
