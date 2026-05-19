"use client";
import { WEEKLY_SCHEDULE, WHATSAPP_CHANNEL } from "@/lib/constants";

const WA_SVG = (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export function ScheduleSection() {
  return (
    <section className="py-24 sm:py-32 bg-[#fafaf8] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* Header */}
        <div className="text-center mb-14 sm:mb-18">
          <p className="eyebrow mb-3">Join Us Live</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A1628] mb-4 leading-tight">
            Service Schedule
          </h2>
          <div className="section-divider" />
          <p className="text-gray-400 max-w-sm mx-auto mt-5 font-light leading-relaxed text-sm sm:text-base">
            Morning prayer starts at{" "}
            <strong className="text-amber-600 font-semibold">5:00 AM every day</strong> — Monday through Sunday.
          </p>
        </div>

        {/* Schedule grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-16 sm:mb-20">
          {WEEKLY_SCHEDULE.map((s, i) => (
            <div
              key={i}
              className="group flex items-start gap-4 bg-white border border-gray-100 hover:border-amber-200 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0A1628] to-[#1a2e50] flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif font-bold text-[#0A1628] text-base mb-1 leading-tight">{s.name}</div>
                <div className="text-amber-600 font-semibold text-sm mb-3">{s.time} · {s.day}</div>
                <div className="flex gap-2 flex-wrap">
                  <span className="inline-block bg-amber-50 text-amber-700 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg border border-amber-100">
                    {s.type}
                  </span>
                  <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg border border-blue-100">
                    {s.platform}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp CTA banner */}
        <div className="relative bg-gradient-to-br from-[#0A1628] via-[#0d1e3a] to-[#162040] rounded-3xl overflow-hidden">
          {/* Subtle dot pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "radial-gradient(circle, #C9A227 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }} />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/35 to-transparent" />

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8 px-8 sm:px-14 py-12 sm:py-14 text-center sm:text-left">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                <span className="text-[#25D366] text-[10px] font-black tracking-[3px] uppercase">WhatsApp Channel</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                Never Miss a Session
              </h3>
              <p className="text-white/50 max-w-md font-light leading-relaxed text-sm sm:text-base">
                Join our WhatsApp channel to receive daily devotionals, session reminders, and stay connected with the global Charis Prayer community.
              </p>
            </div>

            <div className="flex-shrink-0">
              <a
                href={WHATSAPP_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-green-900/25 hover:shadow-green-900/40 hover:-translate-y-0.5 text-sm sm:text-base"
              >
                {WA_SVG}
                Join — It&apos;s Free
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </section>
  );
}
