import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import Badge from "./ui/Badge";
import { motion } from "framer-motion";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group bg-primary-light border border-white/5 rounded-[2rem] overflow-hidden flex flex-col h-full hover:border-accent/30 transition-all duration-300 ${featured ? 'md:flex-row md:col-span-2' : ''}`}
    >
      <Link href={`/blog/${post.slug}`} className={`relative overflow-hidden block ${featured ? 'md:w-1/2 min-h-[300px]' : 'aspect-video'}`}>
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="accent" className="bg-accent text-white border-none shadow-lg">
            {post.category}
          </Badge>
        </div>
      </Link>

      <div className={`p-8 flex flex-col flex-grow ${featured ? 'md:w-1/2 justify-center' : ''}`}>
        <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
          <span className="flex items-center gap-1.5 font-mono">
            <Calendar size={14} className="text-accent" />
            {new Date(post.publishedAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1.5 font-mono">
            <Clock size={14} className="text-accent" />
            {post.readTime}
          </span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className={`font-black text-white italic uppercase mb-4 group-hover:text-accent transition-colors leading-tight ${featured ? 'text-3xl md:text-4xl' : 'text-xl'}`}>
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-400 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-primary-lighter flex items-center justify-center">
              {post.author.name.toLowerCase() === 'GamxCloud team' ? (
                <Image 
                  src="/assets/team/h5games_team.png" 
                  alt="GamxCloud Team" 
                  width={32} 
                  height={32} 
                  className="object-cover w-full h-full"
                />
              ) : (
                <Image 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  width={32} 
                  height={32} 
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <span className="text-xs font-black text-white uppercase italic tracking-tighter">{post.author.name}</span>
          </div>

          <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 text-xs font-black text-accent uppercase italic hover:translate-x-1 transition-transform">
            READ MORE <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
