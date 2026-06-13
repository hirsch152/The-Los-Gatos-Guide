/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Calendar, Clock, ArrowRight, X, Sparkles, BookOpen, User, ArrowLeft } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebaseConfig";
import { Post } from "../types";

const CATEGORY_FILTERS = [
  { label: "All", value: "all" },
  { label: "Local events", value: "events" },
  { label: "Eats", value: "eats" },
  { label: "Weekend Plans", value: "plans" },
] as const;

const getCategoryLabel = (category: string) => {
  return CATEGORY_FILTERS.find((item) => item.value === category)?.label || category;
};

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const toHtmlContent = (body: string) => {
  if (!body) return "<p>Details coming soon.</p>";
  if (/<[a-z][\s\S]*>/i.test(body)) return body;

  return body
    .split(/\n{2,}/)
    .map((paragraph) => `<p class="mb-4">${escapeHtml(paragraph.trim())}</p>`)
    .join("");
};

const estimateReadTime = (text: string) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
};

interface NewsletterPostsProps {
  onSubscribeClick: () => void;
  selectedCityId: string;
  newsletterName: string;
}

export default function NewsletterPosts({ onSubscribeClick, selectedCityId, newsletterName }: NewsletterPostsProps) {
  // Database states
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalPost, setActiveModalPost] = useState<Post | null>(null);

  useEffect(() => {
    setSelectedCategory("all");
    setSearchQuery("");
  }, [selectedCityId]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        let postsQuery = query(
          collection(db, "posts"),
          where("status", "==", "published"),
          where("cityId", "==", selectedCityId)
        );

        if (selectedCategory && selectedCategory !== "all") {
          postsQuery = query(postsQuery, where("category", "==", selectedCategory));
        }

        const querySnapshot = await getDocs(postsQuery);
        const fetched: Post[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const body = data.body || data.content || "";
          const teaser = data.excerpt || data.subtitle || data.teaser || "";
          fetched.push({
            id: docSnap.id,
            category: data.category || "uncategorized",
            title: data.title || "",
            date: data.date || "",
            readTime: data.readTime || estimateReadTime(`${teaser} ${body}`),
            teaser: teaser || "Open this guide for details.",
            content: toHtmlContent(body),
            image: data.image || "📰",
            featured: data.featured || false,
            startTime: data.startTime || data.time || "",
            endTime: data.endTime || "",
            venue: data.venue || "",
            sourceUrl: data.sourceUrl || "",
          });
        });

        fetched.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return String(b.date).localeCompare(String(a.date));
        });

        setPosts(fetched);
      } catch (err: any) {
        console.error("Error fetching published posts:", err);
        try {
          handleFirestoreError(err, OperationType.GET, `posts?status=published&cityId=${selectedCityId}&category=${selectedCategory}`);
        } catch (fError) {
          // Keep fallback message clean
        }
        setError("Unable to connect to the published posts feed. Please check back shortly.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [selectedCityId, selectedCategory]);

  const categories = useMemo(() => {
    return CATEGORY_FILTERS;
  }, []);

  // Filter & search logic
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.teaser.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCategoryLabel(post.category).toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [posts, searchQuery]);

  return (
    <section id="posts-section" className="py-10 sm:py-16 bg-brand-bg/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading + Intro Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 pb-4 border-b border-brand-border/60">
          <div className="space-y-2">
            <span className="text-[#C89B3C] font-mono font-bold text-xs uppercase tracking-widest block">
              INSIDE LOOK • DIRECT ARCHIVES
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-brand-dark tracking-tight">
              Latest from {newsletterName}
            </h2>
            <p className="text-brand-muted text-sm sm:text-base max-w-xl">
              Preview our recent editions below. We write simple, local guides focused on our community, neighborhoods, and small businesses.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brand-muted" id="search-icon-posts" />
            <input
              type="text"
              placeholder="Search past guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border rounded-xl text-xs text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
              id="posts-search-field"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text text-xs cursor-pointer"
                id="search-clear-btn"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Tab Cluster */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none" id="categories-cluster">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.value;
            return (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-brand-primary text-white shadow-sm"
                    : "bg-white text-brand-muted hover:text-brand-dark border border-brand-border"
                }`}
                id={`category-filter-${category.value}`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Loading or Error or Bento Grid State */}
        {loading ? (
          <div className="py-24 text-center space-y-4" id="posts-loading-stage">
            <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mx-auto" />
            <p className="text-xs text-brand-muted font-medium">Fetching curated local archives from Firestore...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center space-y-3 bg-red-50/50 border border-red-100 rounded-2xl" id="posts-error-stage">
            <span className="inline-block text-2xl">📡</span>
            <h3 className="font-serif font-bold text-lg text-red-950">Connection Issue</h3>
            <p className="text-red-700 text-xs max-w-sm mx-auto leading-relaxed">{error}</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="posts-grid-container">
            {filteredPosts.map((post) => {
              return (
                <motion.article
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  key={post.id}
                  className="bg-white border border-brand-border rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 relative group"
                  id={`post-card-${post.id}`}
                >
                  <div className="p-6 space-y-4">
                    {/* Badge + Header meta */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-brand-primary font-mono bg-brand-blush/30 px-2.5 py-1 rounded">
                        {getCategoryLabel(post.category)}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-brand-muted">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Headline */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-serif font-extrabold text-brand-text group-hover:text-brand-primary transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-brand-muted text-xs leading-relaxed font-sans line-clamp-3">
                        {post.teaser}
                      </p>
                    </div>
                  </div>

                  {/* Card Action footer bar */}
                  <div className="px-6 py-4.5 border-t border-brand-border/50 bg-brand-bg/5 flex items-center justify-between">
                    <span className="text-xs text-brand-muted font-medium font-mono">{post.date}</span>
                    <button
                      onClick={() => setActiveModalPost(post)}
                      className="text-xs font-bold text-brand-primary hover:text-brand-dark inline-flex items-center gap-1 cursor-pointer group/link"
                      id={`read-more-btn-${post.id}`}
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="col-span-full py-16 text-center space-y-3 bg-white border border-brand-border rounded-2xl" id="no-search-results">
            <span className="inline-block text-3xl">☕</span>
            <h3 className="font-serif font-bold text-lg text-brand-text">No published posts found</h3>
            <p className="text-brand-muted text-xs max-w-sm mx-auto">
              There are no published posts for this town and category yet.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 bg-brand-primary text-white font-semibold text-xs rounded-xl"
              id="reset-filter-search"
            >
              Reset Search
            </button>
          </div>
        )}

      </div>

      {/* Editorial Reader Modal Backdrop */}
      <AnimatePresence>
        {activeModalPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center p-4"
            id="editorial-modal-backdrop"
          >
            {/* Modal Body Card */}
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              className="bg-white border border-brand-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
              id="editorial-modal-card"
            >
              
              {/* Modal Banner Title */}
              <div className="bg-brand-bg px-6 py-4 border-b border-brand-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{activeModalPost.image}</span>
                  <div>
                    <span className="block text-[10px] tracking-widest text-[#C89B3C] font-extrabold uppercase leading-none">
                      {getCategoryLabel(activeModalPost.category)}
                    </span>
                    <span className="block text-xs text-brand-muted mt-0.5">
                      Published on {activeModalPost.date} • {activeModalPost.readTime}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModalPost(null)}
                  className="p-1.5 rounded-lg border border-brand-border hover:bg-brand-border/40 text-brand-muted hover:text-brand-text transition cursor-pointer"
                  id="close-modal-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Reader Content */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed text-brand-text" id="modal-content-scroller">
                
                {/* Styled Title inside modal */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-brand-dark tracking-tight leading-snug">
                    {activeModalPost.title}
                  </h1>
                  {(activeModalPost.startTime || activeModalPost.venue) && (
                    <p className="mt-2 text-xs text-brand-muted">
                      {[activeModalPost.startTime && `${activeModalPost.startTime}${activeModalPost.endTime ? ` - ${activeModalPost.endTime}` : ""}`, activeModalPost.venue]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  )}
                </div>

                {/* Subtext description / rich text parser */}
                <div 
                  className="prose prose-sm prose-wine text-brand-text"
                  dangerouslySetInnerHTML={{ __html: activeModalPost.content }}
                  id="modal-article-html"
                />

                {activeModalPost.sourceUrl && (
                  <a
                    href={activeModalPost.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:text-brand-dark"
                  >
                    View original source
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}

                {/* Simulated Local Author sign-off */}
                <div className="pt-6 border-t border-brand-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                      P
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-brand-text">{newsletterName} Editorial Team</h5>
                      <p className="text-[10px] text-brand-muted">Fresh, local updates direct from town squares.</p>
                    </div>
                  </div>
                  
                  {/* Share item indicator */}
                  <div className="text-[10px] text-brand-muted font-medium bg-brand-bg md:px-2.5 md:py-1 rounded border border-brand-border/50">
                    Sponsorships Open
                  </div>
                </div>

                {/* Post Footer Newsletter CTA */}
                <div className="bg-brand-bg/50 border border-brand-border/60 rounded-xl p-5 mt-4 space-y-3 text-center">
                  <h4 className="font-serif font-black text-brand-dark text-base">Enjoyed this past issue preview?</h4>
                  <p className="text-brand-muted text-xs max-w-md mx-auto">
                    Get actual interactive local insider guides delivered straight to your inbox once a week. Never miss out on local gems again.
                  </p>
                  <button
                    onClick={() => {
                      setActiveModalPost(null);
                      // Let scroll handle it
                      onSubscribeClick();
                    }}
                    className="px-5 py-2.5 bg-brand-primary text-white rounded-lg text-xs font-bold shadow-sm hover:bg-brand-dark transition cursor-pointer"
                    id="modal-sub-button-overlay"
                  >
                    Subscribe Free Now
                  </button>
                </div>

              </div>
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
