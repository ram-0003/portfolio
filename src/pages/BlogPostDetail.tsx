import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBlogPosts } from "../services/firebase";
import { BlogPost } from "../types";
import { ArrowLeft, Clock, Calendar, Share2, Tag, ChevronLeft } from "lucide-react";

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPost() {
      try {
        const posts = await getBlogPosts();
        const found = posts.find(p => p.slug === slug);
        if (found) {
          setPost(found);
        } else {
          console.warn("Post not found by slug", slug);
        }
      } catch (e) {
        console.error("Failed fetching tutorial details", e);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-brand-cyan border-r-2 border-brand-purple"></div>
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest animate-pulse font-medium">Reconstructing Article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center flex flex-col items-center gap-6 px-6">
        <h2 className="font-display font-medium text-2xl text-white">404: Article Protocol Missing</h2>
        <p className="text-gray-400 text-sm">The article slug supplied does not map to any active public logs.</p>
        <Link to="/blog" className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-mono text-xs">
          Return to Blog Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full relative px-6 md:px-8 max-w-4xl mx-auto py-12 md:py-20">
      
      {/* Back button */}
      <Link 
        to="/blog" 
        className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors mb-12 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 text-brand-cyan" />
        Back to the Automation Manual
      </Link>

      {/* Article header metadata info cards */}
      <header className="flex flex-col gap-6 mb-12">
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-mono">
          <span className="px-2.5 py-0.5 rounded-full bg-brand-purple/10 border border-brand-purple/40 text-brand-purple font-mono font-semibold uppercase tracking-wider">
            {post.category}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {post.readingTime}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-gray-400 text-base sm:text-lg font-light leading-relaxed border-l-2 border-brand-cyan pl-6 italic">
          {post.summary}
        </p>
      </header>

      {/* Featured Cover Image */}
      <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 mb-16 shadow-2xl">
        <img 
          src={post.coverImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"} 
          alt={post.title} 
          className="object-cover w-full h-full"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/40 via-transparent to-transparent"></div>
      </div>

      {/* Core Body Rich-Text styled blocks rendering */}
      <section className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-sm sm:text-base flex flex-col gap-6">
        {post.content.split("\n\n").map((part, idx) => {
          if (part.startsWith("### ")) {
            return (
              <h3 key={idx} className="font-display font-medium text-lg sm:text-xl text-white tracking-tight mt-6 mb-2 border-b border-white/5 pb-2">
                {part.replace("### ", "")}
              </h3>
            );
          }
          if (part.startsWith("## ")) {
            return (
              <h2 key={idx} className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight mt-8 mb-3">
                {part.replace("## ", "")}
              </h2>
            );
          }
          if (part.startsWith("1. ") || part.startsWith("2. ") || part.startsWith("3. ")) {
            const num = part.charAt(0);
            const body = part.substring(3);
            const heading = body.split("\n")[0];
            const paragraph = body.split("\n").slice(1).join("\n");
            return (
              <div key={idx} className="bg-white/2 border border-white/5 p-5 rounded-2xl flex gap-4 my-2">
                <span className="font-mono text-base text-brand-purple font-bold">{num}.</span>
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-sans font-semibold text-white text-sm">{heading}</h4>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{paragraph}</p>
                </div>
              </div>
            );
          }
          return (
            <p key={idx} className="whitespace-pre-wrap leading-relaxed font-sans text-gray-300">
              {part}
            </p>
          );
        })}
      </section>

      {/* Tags foot */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center border-t border-white/10 pt-8 mt-16 font-mono text-xs text-gray-500">
          <Tag className="w-4 h-4 text-gray-500 shrink-0" />
          <span>Tags:</span>
          {post.tags.map((tag, ti) => (
            <span key={ti} className="px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5 text-[10px]">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Share / Consult row */}
      <div className="bg-gradient-to-r from-brand-cyan/6 to-brand-purple/6 border border-brand-cyan/20 rounded-3xl p-6 sm:p-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h4 className="font-sans font-semibold text-white text-base">Applied automations ready for you</h4>
          <p className="text-gray-400 text-xs sm:text-sm">I engineer and deploy these n8n/Make workflows direct for client teams.</p>
        </div>
        <Link 
          to={`/contact?service=AutomationConsultation&title=${encodeURIComponent(post.title)}`}
          className="px-6 py-2.5 rounded-full bg-brand-cyan text-dark-bg font-display font-bold text-xs hover:scale-103 transition-transform cursor-pointer shadow-md"
        >
          Integrate System
        </Link>
      </div>

    </div>
  );
}
