"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { SAMPLE_TESTIMONIES } from "@/lib/constants";

export function TestimoniesSection() {
  const [form, setForm]           = useState({ name: "", text: "", location: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [testimonies, setTestimonies] = useState<any[]>(SAMPLE_TESTIMONIES);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase.from("testimonies").select("*").eq("status", "approved")
          .order("created_at", { ascending: false }).limit(3);
        if (data && data.length > 0) setTestimonies(data);
      } catch { /* sample */ }
    }
    load();
  }, []); // eslint-disable-line

  const handleSubmit = async () => {
    if (!form.text) return;
    setLoading(true);
    try {
      await supabase.from("testimonies").insert([{
        name: form.name || "Anonymous", location: form.location || "Unknown",
        quote: form.text, status: "pending",
      }]);
      setSubmitted(true);
      setForm({ name: "", text: "", location: "" });
    } catch {
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-py bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

      <div className="page-container">

        {/* ── Section header ── */}
        <div className="text-center mb-14 sm:mb-16 lg:mb-20">
          <p className="eyebrow mb-4">God is Moving</p>
          <h2 className="text-section font-serif font-bold text-[#0A1628] mb-4">Testimonies of Grace</h2>
          <div className="section-divider" />
          <p className="text-gray-400 max-w-sm mx-auto mt-5 font-light text-sm sm:text-base leading-[1.75]">
            Real stories of healing, breakthrough, and restoration from our global prayer community.
          </p>
        </div>

        {/* ── Testimony cards (equal height via flex) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14 sm:mb-16 lg:mb-20">
          {testimonies.slice(0, 3).map((t, idx) => (
            <div key={t.id || idx} className="card-premium relative overflow-hidden flex flex-col p-7 sm:p-8">
              {/* Gold top bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 to-yellow-300" />
              {/* Quote mark */}
              <div className="font-serif text-[5rem] leading-none text-amber-300/20 select-none -mb-2 -mt-1">&ldquo;</div>
              {/* Text */}
              <p className="text-gray-500 text-sm sm:text-[0.9375rem] leading-[1.8] font-light italic flex-1 mb-6">
                {t.quote}
              </p>
              {/* Author */}
              <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                <div>
                  <div className="font-semibold text-[#0A1628] text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{t.location}</div>
                </div>
                <span className="bg-amber-50 text-amber-700 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg border border-amber-100">
                  {t.tag || "Praise Report"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Share testimony panel ── */}
        <div className="bg-gradient-to-br from-[#0A1628] to-[#162040] rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Left — info */}
            <div className="px-8 sm:px-10 lg:px-14 py-12 sm:py-14 flex flex-col justify-center text-center lg:text-left">
              <p className="eyebrow mb-5">Your Story Matters</p>
              <h3 className="text-subsection font-serif font-bold text-white mb-5 leading-tight">
                Share Your Testimony
              </h3>
              <p className="text-white/45 font-light leading-[1.8] mb-8 text-sm sm:text-base max-w-xs mx-auto lg:mx-0">
                Has God done something amazing in your life? Share your story and encourage thousands of believers around the world.
              </p>
              <div className="flex items-start gap-3 bg-white/4 border border-white/8 rounded-2xl px-5 py-4 text-left">
                <span className="text-xl flex-shrink-0 mt-0.5">🕊️</span>
                <p className="text-white/40 text-sm font-light italic leading-[1.7]">
                  &ldquo;The effective, fervent prayer of a righteous man avails much.&rdquo;
                  <span className="block mt-1 not-italic text-white/25 text-xs">— James 5:16</span>
                </p>
              </div>
            </div>

            {/* Right — form */}
            <div className="bg-white/[0.04] border-t lg:border-t-0 lg:border-l border-white/8 px-8 sm:px-10 lg:px-14 py-12 sm:py-14">
              {!submitted ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { field: "name",     label: "Your Name",     ph: "Full name" },
                      { field: "location", label: "Location",      ph: "City, Country" },
                    ].map(({ field, label, ph }) => (
                      <div key={field}>
                        <label className="block text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-2">{label}</label>
                        <input
                          value={(form as any)[field]}
                          onChange={e => setForm({ ...form, [field]: e.target.value })}
                          placeholder={ph}
                          className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-amber-400/45 focus:bg-white/8 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-2">Your Testimony</label>
                    <textarea
                      value={form.text}
                      onChange={e => setForm({ ...form, text: e.target.value })}
                      placeholder="Share what God has done in your life..."
                      rows={5}
                      className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-amber-400/45 focus:bg-white/8 transition-all resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !form.text}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-[#0A1628] font-bold py-4 rounded-2xl text-sm hover:brightness-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-400/10"
                  >
                    {loading ? "Submitting…" : "Submit Testimony 🕊️"}
                  </button>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="text-5xl mb-5">🎉</div>
                  <div className="font-serif text-white text-2xl font-bold mb-3">Thank You!</div>
                  <p className="text-white/40 text-sm mb-8 leading-relaxed max-w-xs mx-auto">Your testimony has been received. To God be the glory!</p>
                  <button onClick={() => setSubmitted(false)}
                    className="text-amber-400 text-sm border border-amber-400/30 px-6 py-2.5 rounded-xl hover:bg-amber-400/10 transition-colors">
                    Submit Another
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* View all */}
        <div className="text-center mt-10 sm:mt-12">
          <Link href="/testimonies"
            className="inline-flex items-center gap-2 text-amber-600 font-semibold text-sm hover:gap-3 transition-all duration-200">
            View All Testimonies <span>→</span>
          </Link>
        </div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
    </section>
  );
}
