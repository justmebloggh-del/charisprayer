import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & News — Charis Prayer",
  description: "Teachings, devotionals, and ministry updates from Charis Prayer.",
};

const POSTS = [
  { id: 1, emoji: "⚡", title: "5 Powerful Prayers for Breakthrough", category: "Prayer", author: "Rev Emmanuel Oduro Cosby", date: "May 15, 2025", excerpt: "Discover five powerful prayers that will unlock breakthrough in every area of your life.", readTime: "5 min read", color: "from-amber-500/20 to-amber-900/30" },
  { id: 2, emoji: "🌙", title: "Understanding the Power of Midnight Prayer", category: "Teaching", author: "Rev Emmanuel Oduro Cosby", date: "May 10, 2025", excerpt: "Why midnight is a strategic time for spiritual warfare and intercession.", readTime: "7 min read", color: "from-blue-600/20 to-blue-900/30" },
  { id: 3, emoji: "📿", title: "How to Build a Daily Prayer Habit", category: "Devotional", author: "Admin", date: "May 8, 2025", excerpt: "Practical steps to establish a consistent and powerful daily prayer routine.", readTime: "4 min read", color: "from-emerald-600/20 to-emerald-900/30" },
  { id: 4, emoji: "✨", title: "The Science of Answered Prayer", category: "Faith", author: "Rev Emmanuel Oduro Cosby", date: "May 1, 2025", excerpt: "Exploring the biblical principles behind why God answers prayer.", readTime: "6 min read", color: "from-purple-600/20 to-purple-900/30" },
  { id: 5, emoji: "🌅", title: "Morning Prayer: Why 5AM Changes Everything", category: "Prayer", author: "Rev Emmanuel Oduro Cosby", date: "Apr 25, 2025", excerpt: "The spiritual significance of the early morning hour and why our prayer sessions begin at 5AM.", readTime: "5 min read", color: "from-amber-500/20 to-orange-900/30" },
  { id: 6, emoji: "🕊️", title: "Healing Through Prayer: Real Stories", category: "Testimony", author: "Admin", date: "Apr 18, 2025", excerpt: "Documented accounts of miraculous healings through the Charis Prayer ministry.", readTime: "8 min read", color: "from-sky-600/20 to-sky-900/30" },
];

const catStyle: Record<string, string> = {
  Prayer:     "bg-amber-400/15 text-amber-400 border-amber-400/25",
  Teaching:   "bg-blue-500/15 text-blue-400 border-blue-400/25",
  Devotional: "bg-emerald-500/15 text-emerald-400 border-emerald-400/25",
  Faith:      "bg-purple-500/15 text-purple-400 border-purple-400/25",
  Testimony:  "bg-sky-500/15 text-sky-400 border-sky-400/25",
  News:       "bg-rose-500/15 text-rose-400 border-rose-400/25",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Ministry Updates"
          title="Blog &amp; News"
          description="Teachings, devotionals, and ministry updates from Charis Prayer."
        />

        {/* Blog grid */}
        <section className="section-py bg-[#fafaf8]">
          <div className="page-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {POSTS.map(p => (
                <article key={p.id} className="card-premium overflow-hidden cursor-pointer group flex flex-col">
                  {/* Cover */}
                  <div className={`h-44 bg-gradient-to-br ${p.color} bg-[#0d1a30] flex items-center justify-center relative overflow-hidden flex-shrink-0`}>
                    <span className="text-6xl select-none group-hover:scale-110 transition-transform duration-500">{p.emoji}</span>
                    <div className="absolute top-3 left-3">
                      <span className={`inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-lg border ${catStyle[p.category] ?? catStyle.Prayer}`}>
                        {p.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/40 text-white/70 text-[10px] font-medium px-2.5 py-1 rounded-lg">
                      {p.readTime}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="font-serif text-lg font-bold text-[#0A1628] mb-2 leading-snug group-hover:text-amber-700 transition-colors">
                      {p.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-[1.75] mb-5 font-light line-clamp-2 flex-1">{p.excerpt}</p>
                    <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-100 pt-4 mt-auto">
                      <span className="font-medium text-gray-500 truncate max-w-[140px]">{p.author}</span>
                      <span>{p.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
