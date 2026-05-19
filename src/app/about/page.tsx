import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FounderSection } from "@/components/home/FounderSection";
import { Badge } from "@/components/ui/Badge";
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
        {/* Hero banner */}
        <div className="bg-gradient-to-br from-[#04090f] via-[#0A1628] to-[#0e1d38] py-16 sm:py-24 text-center relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(201,162,39,0.08) 0%, transparent 60%)" }} />
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <div className="text-amber-400 text-xs font-bold tracking-[3.5px] uppercase mb-4">Our Story</div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
              A Ministry Born<br /><span className="gold-shimmer">from Grace</span>
            </h1>
            <p className="text-white/50 text-base sm:text-lg font-light leading-relaxed">
              Charis Prayer is a global digital prayer ministry dedicated to igniting prayer movements and transforming lives through daily encounters with God's presence.
            </p>
          </div>
        </div>

        {/* Founder section */}
        <FounderSection />

        {/* Values */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14">
              <div className="text-amber-600 text-xs font-bold tracking-[3.5px] uppercase mb-4">What We Believe</div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A1628] mb-5">Our Core Values</h2>
              <div className="w-14 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-300 mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {VALUES.map(v => (
                <div key={v.title} className="bg-[#fafaf7] border border-[#f0ece0] rounded-2xl p-7 card-hover">
                  <div className="text-4xl mb-4">{v.icon}</div>
                  <h3 className="font-serif text-xl font-bold text-[#0A1628] mb-3">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-[#04090f] via-[#0A1628] to-[#0e1d38] relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(201,162,39,0.06) 0%, transparent 60%)" }} />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14">
              <div className="text-amber-400 text-xs font-bold tracking-[3.5px] uppercase mb-4">Ministry Journey</div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">Our History</h2>
              <div className="w-14 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-300 mx-auto rounded-full" />
            </div>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-amber-400/60 via-amber-400/30 to-transparent" />
              <div className="space-y-8 sm:space-y-10">
                {TIMELINE.map((t, i) => (
                  <div key={i} className="flex gap-4 sm:gap-8 pl-12 sm:pl-14 relative">
                    <div className="absolute left-0 top-1 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-400/20">
                      <span className="text-[#0A1628] font-black text-[10px] tracking-tight">{t.year}</span>
                    </div>
                    <div className="flex-1 pb-2">
                      <h3 className="font-serif text-xl font-bold text-white mb-2">{t.title}</h3>
                      <p className="text-white/55 text-sm leading-relaxed font-light">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-16 sm:py-24 bg-[#fafaf7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14">
              <div className="text-amber-600 text-xs font-bold tracking-[3.5px] uppercase mb-4">The Team</div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A1628] mb-5">Ministry Leadership</h2>
              <div className="w-14 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-300 mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {LEADERSHIP.map(l => (
                <div key={l.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center card-hover">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0A1628] to-[#1a2e50] flex items-center justify-center text-amber-400 text-2xl mx-auto mb-4">🙏</div>
                  <h3 className="font-serif font-bold text-[#0A1628] text-base mb-1 leading-tight">{l.name}</h3>
                  <div className="mb-3"><Badge variant="gold">{l.role}</Badge></div>
                  <p className="text-gray-500 text-xs leading-relaxed font-light">{l.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1628] mb-4">Join the Prayer Movement</h2>
            <p className="text-[#0A1628]/65 mb-7 sm:mb-8 font-light leading-relaxed text-sm sm:text-base">Every morning at 5:00 AM, thousands gather from across the world to encounter God's presence. Join us — it will change your life.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/prayers" className="inline-flex items-center justify-center gap-2 bg-[#0A1628] text-amber-400 font-bold px-7 py-3.5 rounded-2xl text-sm hover:bg-[#1a2e50] transition-colors">🎧 Stream Daily Prayers</a>
              <a href="/prayer-request" className="inline-flex items-center justify-center gap-2 bg-white/80 text-[#0A1628] font-bold px-7 py-3.5 rounded-2xl text-sm hover:bg-white transition-colors">🙏 Submit Prayer Request</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
