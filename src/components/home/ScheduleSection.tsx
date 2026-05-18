"use client";
import { WEEKLY_SCHEDULE, WHATSAPP_CHANNEL } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function ScheduleSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="text-amber-600 text-xs font-bold tracking-[3.5px] uppercase mb-4">Join Us Live</div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#0A1628] mb-5">Service Schedule</h2>
          <div className="w-14 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-300 mx-auto rounded-full mb-5" />
          <p className="text-gray-500 max-w-md mx-auto font-light">Morning prayer starts at <strong className="text-amber-600">5:00 AM every day</strong> — Monday through Sunday. Join us live on YouTube.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {WEEKLY_SCHEDULE.map((s, i) => (
            <div key={i} className="flex items-center gap-4 bg-[#fafaf7] rounded-2xl p-5 border border-[#f0ece0] hover:bg-amber-50/50 hover:border-amber-200 transition-all duration-200 group cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0A1628] to-[#1a2e50] flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif font-bold text-[#0A1628] text-base mb-1 truncate">{s.name}</div>
                <div className="text-amber-600 font-semibold text-sm mb-2">{s.time} · {s.day}</div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="gold">{s.type}</Badge>
                  <Badge variant="blue">{s.platform}</Badge>
                </div>
              </div>
              <a href="https://youtube.com/@charisprayer" target="_blank" rel="noopener noreferrer">
                <Button variant="gold" size="sm">Join</Button>
              </a>
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="bg-gradient-to-r from-[#0A1628] to-[#1a2e50] rounded-3xl p-8 sm:p-12 text-center">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">Never Miss a Session</h3>
          <p className="text-white/60 mb-7 max-w-md mx-auto font-light">Join our WhatsApp channel to get notified before every prayer session, receive daily devotionals, and stay connected with the Charis Prayer community.</p>
          <a href={WHATSAPP_CHANNEL} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="xl">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Join WhatsApp Channel — Free
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
