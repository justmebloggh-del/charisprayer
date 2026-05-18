import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog & News" };

const POSTS = [
  { id: 1, title: "5 Powerful Prayers for Breakthrough", category: "Prayer", author: "Rev Emmanuel Oduro Cosby", date: "May 15, 2025", excerpt: "Discover five powerful prayers that will unlock breakthrough in every area of your life.", readTime: "5 min read" },
  { id: 2, title: "Understanding the Power of Midnight Prayer", category: "Teaching", author: "Rev Emmanuel Oduro Cosby", date: "May 10, 2025", excerpt: "Why midnight is a strategic time for spiritual warfare and intercession.", readTime: "7 min read" },
  { id: 3, title: "How to Build a Daily Prayer Habit", category: "Devotional", author: "Admin", date: "May 8, 2025", excerpt: "Practical steps to establish a consistent and powerful daily prayer routine.", readTime: "4 min read" },
  { id: 4, title: "The Science of Answered Prayer", category: "Faith", author: "Rev Emmanuel Oduro Cosby", date: "May 1, 2025", excerpt: "Exploring the biblical principles behind why God answers prayer.", readTime: "6 min read" },
  { id: 5, title: "Morning Prayer: Why 5AM Changes Everything", category: "Prayer", author: "Rev Emmanuel Oduro Cosby", date: "Apr 25, 2025", excerpt: "The spiritual significance of the early morning hour and why our prayer sessions begin at 5AM.", readTime: "5 min read" },
  { id: 6, title: "Healing Through Prayer: Real Stories", category: "Testimony", author: "Admin", date: "Apr 18, 2025", excerpt: "Documented accounts of miraculous healings through the Charis Prayer ministry.", readTime: "8 min read" },
];

const catColor: Record<string, "gold" | "blue" | "green" | "purple" | "red"> = {
  Prayer: "gold", Teaching: "blue", Devotional: "green", Faith: "purple", Testimony: "green", News: "red",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="bg-gradient-to-br from-[#0A1628] to-[#1a2e50] py-20 text-center">
          <div className="text-amber-400 text-xs font-bold tracking-[3.5px] uppercase mb-4">Ministry Updates</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Blog & News</h1>
          <p className="text-white/50 max-w-md mx-auto font-light">Teachings, devotionals, and ministry updates from Charis Prayer.</p>
        </div>

        <section className="py-20 bg-[#fafaf7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {POSTS.map(p => (
                <article key={p.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm card-hover cursor-pointer">
                  <div className="h-44 bg-gradient-to-br from-[#0A1628] to-[#1a2e50] flex items-center justify-center">
                    <div className="text-5xl">📖</div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={catColor[p.category] ?? "gold"}>{p.category}</Badge>
                      <span className="text-gray-400 text-xs">{p.readTime}</span>
                    </div>
                    <h2 className="font-serif text-lg font-bold text-[#0A1628] mb-2 leading-snug">{p.title}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 font-light">{p.excerpt}</p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{p.author}</span>
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
