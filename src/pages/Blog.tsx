import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBlogPosts } from "../services/firebase";
import { BlogPost } from "../types";
import { Search, Clock, ArrowRight, Tag, Bookmark } from "lucide-react";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogData() {
      try {
        const loaded = await getBlogPosts();
        // Exclude drafts from public view
        const publishedOnly = loaded.filter(p => p.status === "published");
        setPosts(publishedOnly);
        setFilteredPosts(publishedOnly);
      } catch (e) {
        console.error("Error loading blog posts into page view", e);
      } finally {
        setLoading(false);
      }
    }
    loadBlogData();
  }, []);

  useEffect(() => {
    let result = posts;

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by Keyword
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    setFilteredPosts(result);
  }, [searchQuery, selectedCategory, posts]);

  const categories = ["All", "Workflow Automation", "API Development", "Web Engineering", "Tutorials"];

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-brand-cyan border-r-2 border-brand-purple"></div>
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest animate-pulse font-medium">Indexation of Articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative px-6 md:px-8 max-w-[1580px] mx-auto py-12 md:py-20">
      
      {/* Blog Hero Heading */}
      <section className="flex flex-col items-start gap-5 mb-12">
        <span className="font-mono text-xs uppercase tracking-widest text-brand-cyan">Tech Publications</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-none animate-fade-in">
          The Automation Manual
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl font-light leading-relaxed">
          Technical insights, tutorials, workflow blueprints, and solutions to automate repetitive operations.
        </p>
      </section>

      {/* Filter Row */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 border-b border-white/5 pb-8">
        
        {/* Tab filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-display text-xs tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-brand-purple/15 text-brand-purple border border-brand-purple/40 font-medium"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Text search */}
        <div className="relative w-full md:w-80">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search tutorials & protocols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-card/50 border border-white/8 rounded-full py-2.5 pl-11 pr-5 text-sm text-white focus:outline-hidden focus:border-brand-purple/60 font-mono transition-all"
          />
        </div>

      </section>

      {/* Articles list */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-mono text-sm border border-dashed border-white/10 rounded-3xl">
          Zero tutorials published match query parameters.
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => (
            <article 
              key={post.id || idx}
              className="bg-dark-card/35 rounded-3xl border border-white/5 overflow-hidden flex flex-col justify-between hover:border-brand-purple/35 transition-all duration-300 group"
            >
              <div>
                {/* Cover Image container */}
                <div className="relative aspect-video w-full overflow-hidden border-b border-white/5">
                  <img 
                    src={post.coverImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"} 
                    alt={post.title} 
                    className="object-cover w-full h-full duration-500 group-hover:scale-102"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-transparent to-transparent"></div>
                  <span className="absolute bottom-4 left-4 px-2 py-0.5 rounded bg-brand-purple/10 border border-brand-purple/40 text-brand-purple font-mono text-[9px] uppercase tracking-wider font-semibold">
                    {post.category}
                  </span>
                </div>

                {/* Article body info */}
                <div className="p-6 md:p-8 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readingTime}</span>
                    <span>&bull;</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <h3 className="font-display font-medium text-lg leading-snug text-white group-hover:text-brand-purple transition-all line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>
              </div>

              {/* Action read button link */}
              <div className="px-6 md:px-8 pb-6 pt-2">
                <Link
                  to={`/blog/${post.slug}`}
                  className="font-display font-semibold text-xs text-brand-cyan hover:text-brand-purple transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  Retrieve Article Protocol
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </article>
          ))}
        </section>
      )}

    </div>
  );
}
