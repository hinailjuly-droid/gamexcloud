"use client";

import { useQuery } from "@tanstack/react-query";
import { blogApi } from "@/lib/api";
import BlogCard from "@/components/BlogCard";
import { BlogResponse } from "@/types";
import { Loader2, Search, Filter } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function BlogListingPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<BlogResponse>({
    queryKey: ['blog', 'posts', page],
    queryFn: () => blogApi.getPosts({ page, limit: 10 }),
  });


  if (isLoading) {
    return (
      <div className="flex bg-black min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  const posts = data?.posts || [];
  const featuredPost = posts.find(p => p.featured) || posts[0];
  const otherPosts = posts.filter(p => p._id !== featuredPost?._id);

  return (
    <div className="bg-black min-h-screen pb-32">
      {/* Header Section */}
      <section className="relative py-24 overflow-hidden border-b border-white/5 bg-primary-light/10">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/20 text-accent text-xs font-black uppercase italic mb-8"
          >
            h5games space blog
          </motion.div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white italic uppercase tracking-tighter mb-8 max-w-5xl mx-auto leading-none">
            Level up your <span className="text-accent underline decoration-white/10">knowledge</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">
            Dive into the technical mechanics, history, and future of browser-based gaming with our expert guides and developer spotlight.
          </p>
        </div>
      </section>

      {/* Filters & Content */}
      <div className="container mx-auto px-4 -mt-10 relative z-20">

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPost && (
            <BlogCard post={featuredPost} featured={true} />
          )}

          {otherPosts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-32 bg-primary-light/20 rounded-[3rem] border border-dashed border-white/5">
             <h3 className="text-2xl font-bold text-gray-600 uppercase italic">No articles found</h3>
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination.pages > 1 && (
          <div className="mt-20 flex justify-center gap-4">
            {Array.from({ length: data.pagination.pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-12 h-12 rounded-2xl font-black text-sm transition-all border flex items-center justify-center ${page === i + 1 ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' : 'bg-primary-light text-gray-500 border-white/5 hover:border-white/20'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
