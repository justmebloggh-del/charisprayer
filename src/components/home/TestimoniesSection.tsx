"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { SAMPLE_TESTIMONIES } from "@/lib/constants";

export function TestimoniesSection() {
  const [form, setForm] = useState({ name: "", text: "", location: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testimonies, setTestimonies] = useState<any[]>(SAMPLE_TESTIMONIES);
  const supabase = createClient();

  useEffect(() => {
    async function fetch() {
      try {
        const { data } = await supabase.from("testimonies").select("*").eq("status", "approved").order("created_at", { ascending: false }).limit(3);
        if (data && data.length > 0) setTestimonies(data);
      } catch { /* sample data */ }
    }
    fetch();
  }, []); // eslint-disable-line

  const handleSubmit = async () => {
    if (!form.text) return;
    setLoading(true);
    try {
      await supabase.from("testimonies").insert([{ name: form.name || "Anonymous", location: form.location || "Unknown", quote: form.text, status: "pending" }]);
      setSubmitted(true);
      setForm({ name: "", text: "", location: "" });
    } catch {
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 sm:py-32 bg-[#fafaf8]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="eyebrow mb-3">God is Moving</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A1628] mb-5 leading-tight">
            Testimonies of Grace
          </h2>
          <div className="section-divider" />
        </div>

        {/* Testimonies grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 sm:mb-20">
          {testimonies.slice(0, 3).map((t, idx) => (
            <div key={t.id || idx} className="card-premium relative overflow-hidden p-7 sm:p-8">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-300" />
              <div className="font-serif text-6xl text-amber-400/30 leading-none mb-4 select-none">"</div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 font-light italic">{t.quote}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <div className="font-bold text-[#0A1628] text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{t.location}</div>
                </div>
                <span className="bg-amber-50 text-amber-700 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg">
                  {t.tag || "Praise Report"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Share testimony */}
        <div className="bg-gradient-to-br from-[#0A1628] to-[#162040] rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left side */}
            <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
              <p className="eyebrow mb-4">Your Story Matters</p>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-5 leading-tight">
                Share Your Testimony
              </h3>
              <p className="text-white/55 font-light leading-relaxed mb-6 text-sm sm:text-base">
                Has God done something amazing in your life? Share your story and encourage thousands of believers around the world.
              </p>
              <div className="flex items-center gap-3 text-white/35 text-sm">
                <span className="text-2xl">🕊️</span>
                <span className="font-light italic">"The effective, fervent prayer of a righteous man avails much." — James 5:16</span>
              </div>
            </div>

            {/* Right side — form */}
            <div className="bg-white/[0.04] p-8 sm:p-12 lg:p-14 border-t lg:border-t-0 lg:border-l border-white/8">
              {!submitted ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-2">Your Name</label>
                      <input
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Full name"
                        className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm outline-none focus:border-amber-400/60 focus:bg-white/12 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-2">Location</label>
                      <input
                        value={form.location}
                        onChange={e => setForm({ ...form, location: e.target.value })}
                        placeholder="City, Country"
                        className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm outline-none focus:border-amber-400/60 focus:bg-white/12 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-2">Your Testimony</label>
                    <textarea
                      value={form.text}
                      onChange={e => setForm({ ...form, text: e.target.value })}
                      placeholder="Share what God has done in your life..."
                      rows={5}
                      className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm outline-none focus:border-amber-400/60 focus:bg-white/12 transition-all resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !form.text}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-[#0A1628] font-bold py-4 rounded-2xl text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-400/20"
                  >
                    {loading ? "Submitting..." : "Submit Testimony 🕊️"}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-5">🎉</div>
                  <div className="font-serif text-white text-2xl font-bold mb-3">Thank You!</div>
                  <p className="text-white/50 text-sm mb-6 leading-relaxed">Your testimony has been received. To God be the glory!</p>
                  <button onClick={() => setSubmitted(false)} className="text-amber-400 text-sm border border-amber-400/30 px-6 py-2.5 rounded-xl hover:bg-amber-400/10 transition-colors">
                    Submit Another
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/testimonies" className="inline-flex items-center gap-2 text-amber-600 font-semibold text-sm hover:gap-3 transition-all duration-200">
            View All Testimonies <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
