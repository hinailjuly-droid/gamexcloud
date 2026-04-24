"use client";

import { useQuery } from "@tanstack/react-query";
import { blogApi } from "@/lib/api";
import { useParams } from "next/navigation";
import { BlogPost } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";
import { Loader2, Gamepad2 } from "lucide-react";
import Newsletter from "@/components/Newsletter";

export default function BlogPostPage() {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['blog', 'post', slug],
    queryFn: () => blogApi.getPostBySlug(slug as string),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex bg-black min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex bg-black min-h-screen items-center justify-center text-white">
        Post not found
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pb-32">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="container mx-auto px-4 absolute inset-0 flex flex-col justify-end pb-20">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-accent text-xs font-black uppercase italic tracking-widest mb-8 hover:translate-x-[-4px] transition-all bg-white/5 px-6 py-2.5 rounded-full border border-white/10 hover:bg-white/10"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          
          <Badge variant="accent" className="w-fit mb-6 px-4 py-1.5 text-xs font-black uppercase italic shadow-lg">
            {post.category}
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white italic uppercase tracking-tighter mb-8 max-w-5xl leading-none">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 text-xs font-bold text-gray-300 uppercase tracking-widest border-t border-white/10 pt-8 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-white/20 shadow-xl overflow-hidden bg-primary-lighter">
                {post.author.name.toLowerCase() === 'GamxCloud team' ? (
                  <Image 
                    src="/assets/team/h5games_team.png" 
                    alt="GamxCloud Team" 
                    width={48} 
                    height={48} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Image 
                    src={post.author.avatar} 
                    alt={post.author.name} 
                    width={48} 
                    height={48} 
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <span className="text-white font-black italic uppercase tracking-widest text-[10px]">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <Calendar size={16} className="text-accent" />
              {new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-2 font-mono">
              <Clock size={16} className="text-accent" />
              {post.readTime}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <article className="lg:col-span-8">
            <div className="max-w-none text-gray-400 font-medium leading-loose">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-8 mt-12" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-6 mt-16 flex items-center gap-4 before:w-2 before:h-8 before:bg-accent before:rounded-full" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-4 mt-10" {...props} />,
                  p: ({node, ...props}) => <p className="mb-6" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-8 space-y-3" {...props} />,
                  li: ({node, ...props}) => <li className="marker:text-accent" {...props} />,
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto my-12 rounded-[2rem] border border-white/5 bg-primary-light/30">
                      <table className="w-full text-left border-collapse" {...props} />
                    </div>
                  ),
                  thead: ({node, ...props}) => <thead className="bg-accent/10 border-b border-white/5" {...props} />,
                  th: ({node, ...props}) => <th className="p-6 text-xs font-black text-accent uppercase italic tracking-widest" {...props} />,
                  td: ({node, ...props}) => <td className="p-6 text-sm border-b border-white/5 text-gray-300" {...props} />,
                  tr: ({node, ...props}) => <tr className="hover:bg-white/5 transition-colors" {...props} />,
                  code: ({node, inline, ...props}: any) => (
                    inline 
                      ? <code className="bg-accent/10 text-accent px-1.5 py-0.5 rounded font-mono text-sm" {...props} />
                      : <div className="p-6 bg-primary-light border border-white/5 rounded-2xl my-8 overflow-x-auto"><code className="font-mono text-sm text-gray-300 block" {...props} /></div>
                  ),
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-accent bg-accent/5 p-8 rounded-2xl italic my-10 text-gray-300 relative overflow-hidden">
                       <div className="relative z-10">{props.children}</div>
                    </blockquote>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Share & Actions */}
            <div className="bg-primary-light border border-white/5 rounded-[2.5rem] p-8 flex flex-col gap-6 scale-95 origin-top-right">
               <h4 className="text-gray-500 font-black italic uppercase text-xs text-center tracking-widest border-b border-white/5 pb-4">Share this Article</h4>
               <div className="grid grid-cols-4 gap-3">
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} 
                    target="_blank" rel="noopener noreferrer" 
                    className="h-14 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-2xl flex items-center justify-center transition-all hover:scale-105"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=Check%20out%20this%20article:%20${encodeURIComponent(post.title)}`} 
                    target="_blank" rel="noopener noreferrer" 
                    className="h-14 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] rounded-2xl flex items-center justify-center transition-all hover:scale-105"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </a>
                  <a 
                    href={`https://api.whatsapp.com/send?text=Read%20this:%20${encodeURIComponent(post.title)}%20at%20${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} 
                    target="_blank" rel="noopener noreferrer" 
                    className="h-14 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-2xl flex items-center justify-center transition-all hover:scale-105"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.012 2C6.486 2 2 6.486 2 12.012c0 1.748.45 3.447 1.305 4.93L2 22l5.244-1.275a10 10 0 004.768 1.198h.004c5.524 0 10-4.486 10-10.011 0-5.526-4.476-10.012-10-10.012zm0 18.024c-1.488 0-2.95-.39-4.238-1.127l-.304-.176-3.149.765.778-3.08-.204-.32a8.03 8.03 0 01-1.246-4.305C3.65 7.6 7.55 3.7 12.016 3.7c4.466 0 8.366 3.9 8.366 8.366 0 4.467-3.9 8.368-8.368 8.368z"/></svg>
                  </a>
                  <button 
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied!');
                    }}
                    className="h-14 bg-primary-lighter hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl flex items-center justify-center border border-white/5 transition-all hover:scale-105"
                  >
                    <Share2 size={22} />
                  </button>
               </div>
            </div>

            {/* Newsletter */}
            <Newsletter />
          </aside>
        </div>
      </div>
    </div>
  );
}
