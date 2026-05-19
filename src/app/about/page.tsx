import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { FounderSection } from "@/components/home/FounderSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Rev Emmanuel Oduro Cosby | Charis Prayer",
  description: "Learn about Rev Emmanuel Oduro Cosby and the Charis Prayer ministry mission, vision, and history.",
};

const TIMELINE = [
  { year: "2003", title: "The Call", desc: "Rev Emmanuel Oduro Cosby receives a divine mandate to ignite prayer movements across the globe through intercession and worship." },
  { year: "2008", title: "First Prayer Community", desc: "The first local prayer group is founded with 12 faithful intercessors, meeting daily at 5:00 AM." },
  { year: "2014", title: "Digital Ministry Begins", desc: "The ministry launches online, reaching believers across Africa, Europe, and North America through social media." },
  { year: "2019", title: "YouTube Live Prayer", desc: "Daily live prayer sessions begin on YouTube, growing to 50,000+ viewers in under a year." },
  { year: "2022", title: "Charis Prayer Platform", desc: "The official Charis Prayer digital platform launches, unifying audio, video, prayer requests, and global community." },
  { year: "2025", title: "85+ Nations", desc: "The ministry now reaches over 85 nations, with 12,400+ prayer warriors joining daily at 5:00 AM." },
];

const LEADERSHIP = [
  { name: "Rev Emmanuel Oduro Cosby", role: "Founder & Lead Pastor", bio: "A seasoned minister with 20+ years of dedicated service in prayer and intercession." },
  { name: "Pastor Grace Cosby", role: "Director of Intercession", bio: "Leads the prayer team and oversees testimony and prayer request ministry." },
  { name: "Elder James Mensah", role: "Head of Worship", bio: "Directs the music and worship ministry, bringing the atmosphere of heaven into every service." },
  { name: "Minister Sarah Asante", role: "Youth & Digital Ministry", bio: "Oversees the digital presence, social media outreach, and youth engagement." },
];

const VALUES = [
  { icon: "🙏", title: "Prayer-First", desc: "Everything we do flows from and returns to fervent, faith-filled prayer." },
  { icon: "📖", title: "Word-Centered", desc: "We anchor every prayer, teaching, and ministry action in the infallible Word of God." },
  { icon: "🌍", title: "Global Reach", desc: "We believe no boundary can limit God's grace — every nation is our mission field." },
  { icon: "✨", title: "Spirit-Led", desc: "We yield completely to the Holy Spirit in every service, prayer, and decision." },
  { icon: "❤️", title: "Community", desc: "We build a family of believers who carry each other's burdens in love." },
  { icon: "🔥", title: "Revival", desc: "We carry a burning mandate to see communities, cities, and nations transformed." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Our Story"
          title={<>A Ministry Born<br /><span className="gold-shimmer">from Grace</span></>}
          description="Charis Prayer is a global digital prayer ministry dedicated to igniting prayer movements and transforming lives through daily encounters with God's presence."
          stats={[["20+", "Years of Ministry"], ["85+", "Nations Reached"], ["100K+", "Lives Touched"]]}
        />

        <FounderSection />

        {/* Core Values */}
        <section className="section-py bg-white">
          <div className="page-container">
            <div className="text-center mb-14 sm:mb-16">
              <p className="eyebrow mb-3">What We Believe</p>
              <h2 className="text-section font-serif font-bold text-[#0A1628] mb-5">Our Core Values</h2>
              <div className="section-divider" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {VALUES.map(v => (
                <div key={v.title} className="card-premium p-7 hover:border-amber-200 hover:shadow-md transition-all duration-300">
                  <div className="text-4xl mb-4">{v.icon}</div>
                  <h3 className="font-serif text-xl font-bold text-[#0A1628] mb-3">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-[1.75] font-light">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-py bg-gradient-to-br from-[#04090f] via-[#0A1628] to-[#0d1e3a] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(201,162,39,0.06) 0%, transparent 60%)" }} />
          <div className="relative z-10 max-w-4xl mx-auto page-container">
            <div className="text-center mb-14 sm:mb-16">
              <p className="eyebrow mb-3">Ministry Journey</p>
              <h2 className="text-section font-serif font-bold text-white mb-5">Our History</h2>
              <div className="section-divider" />
            </div>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-amber-400/60 via-amber-400/30 to-transparent" />
              <div className="space-y-8 sm:space-y-10">
                {TIMELINE.map((t, i) => (
                  <div key={i} className="flex gap-4 sm:gap-8 pl-14 sm:pl-16 relative">
                    <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-400/20">
                      <span className="text-[#0A1628] font-black text-[10px] tracking-tight">{t.year}</span>
                    </div>
                    <div className="flex-1 pb-2">
                      <h3 className="font-serif text-xl font-bold text-white mb-2">{t.title}</h3>
                      <p className="text-white/50 text-sm leading-[1.75] font-light">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="section-py bg-[#fafaf8]">
          <div className="page-container">
            <div className="text-center mb-14 sm:mb-16">
              <p className="eyebrow mb-3">The Team</p>
              <h2 className="text-section font-serif font-bold text-[#0A1628] mb-5">Ministry Leadership</h2>
              <div className="section-divider" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {LEADERSHIP.map(l => (
                <div key={l.name} className="card-premium p-6 text-center hover:border-amber-200 hover:shadow-md transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0A1628] to-[#1a2e50] flex items-center justify-center text-2xl mx-auto mb-4">🙏</div>
                  <h3 className="font-serif font-bold text-[#0A1628] text-base mb-1 leading-tight">{l.name}</h3>
                  <div className="inline-block bg-amber-50 text-amber-700 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg mb-3 border border-amber-100">{l.role}</div>
                  <p className="text-gray-500 text-xs leading-[1.7] font-light">{l.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="section-py bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-center">
          <div className="max-w-2xl mx-auto px-5 sm:px-6">
            <h2 className="text-subsection font-serif font-bold text-[#0A1628] mb-4">Join the Prayer Movement</h2>
            <p className="text-[#0A1628]/65 mb-8 font-light leading-[1.75] text-sm sm:text-base">
              Every morning at 5:00 AM, thousands gather from across the world to encounter God&apos;s presence. Join us — it will change your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/prayers" className="inline-flex items-center justify-center gap-2 bg-[#0A1628] text-amber-400 font-bold px-7 py-3.5 rounded-2xl text-sm hover:bg-[#1a2e50] transition-colors">
                Stream Daily Prayers
              </a>
              <a href="/prayer-request" className="inline-flex items-center justify-center gap-2 bg-white/80 text-[#0A1628] font-bold px-7 py-3.5 rounded-2xl text-sm hover:bg-white transition-colors">
                Submit Prayer Request
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
