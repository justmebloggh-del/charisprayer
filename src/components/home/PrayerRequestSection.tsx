"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Shield, Zap, Heart } from "lucide-react";

export function PrayerRequestSection() {
  const [form, setForm] = useState({ name: "", email: "", request: "", urgent: false, priv: false });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async () => {
    if (!form.request) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("prayer_requests").insert([{
        name: form.name || "Anonymous",
        email: form.email,
        request: form.request,
        is_private: form.priv,
        status: "pending",
      }]);
      if (error) throw error;
      setDone(true);
    } catch {
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-py bg-gradient-to-br from-[#04090f] via-[#0A1628] to-[#0d1e3a] relative overflow-hidden">
      {/* Decorative radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.07) 0%, transparent 60%)" }} />
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #C9A227 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

      <div className="relative page-container">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

          {/* Left info panel — 2 cols */}
          <div className="lg:col-span-2">
            <p className="eyebrow mb-4">We're Here For You</p>
            <h2 className="text-section font-serif font-bold text-white mb-5">
              We're Praying<br />For You
            </h2>
            <div className="w-14 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-300 mb-7 rounded-full" />

            <p className="text-white/55 font-light leading-relaxed mb-8 text-base">
              Submit your prayer request and our dedicated prayer team will intercede for you. No request is too big or too small — God hears every cry.
            </p>

            {/* Feature badges */}
            <div className="space-y-4 mb-10">
              {[
                { icon: <Heart className="w-4 h-4" />, title: "Prayed Over Daily", desc: "Every request receives personal intercession by our team." },
                { icon: <Shield className="w-4 h-4" />, title: "Completely Confidential", desc: "Your private requests are never shared publicly." },
                { icon: <Zap className="w-4 h-4" />, title: "Urgent Prayers Available", desc: "Flag urgent needs for immediate intercession." },
              ].map(item => (
                <div key={item.title} className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold mb-0.5">{item.title}</div>
                    <div className="text-white/40 text-xs font-light">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scripture */}
            <div className="bg-white/4 border border-amber-400/15 rounded-2xl p-5">
              <p className="text-white/55 text-sm font-light italic leading-relaxed">
                &ldquo;The effective, fervent prayer of a righteous man avails much.&rdquo;
              </p>
              <p className="text-amber-400 text-xs mt-2 font-semibold">— James 5:16</p>
            </div>
          </div>

          {/* Right form — 3 cols */}
          <div className="lg:col-span-3">
            <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-7 sm:p-10">
              {!done ? (
                <div className="space-y-5">
                  <h3 className="font-serif text-xl font-bold text-white mb-2">Submit Your Request</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/45 text-[11px] font-semibold uppercase tracking-wider mb-2">Your Name</label>
                      <input
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Full name (optional)"
                        className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-white/45 text-[11px] font-semibold uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com (optional)"
                        className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/45 text-[11px] font-semibold uppercase tracking-wider mb-2">
                      Prayer Request <span className="text-amber-400">*</span>
                    </label>
                    <textarea
                      value={form.request}
                      onChange={e => setForm({ ...form, request: e.target.value })}
                      placeholder="Share your prayer request here... God hears your heart and so do we."
                      rows={6}
                      className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
                    <div className="flex gap-6 flex-wrap">
                      <label className="flex items-center gap-2.5 cursor-pointer text-sm text-white/55 hover:text-white/80 transition-colors">
                        <input
                          type="checkbox"
                          checked={form.urgent}
                          onChange={e => setForm({ ...form, urgent: e.target.checked })}
                          className="accent-amber-500 w-4 h-4 rounded"
                        />
                        <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> Urgent Prayer</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer text-sm text-white/55 hover:text-white/80 transition-colors">
                        <input
                          type="checkbox"
                          checked={form.priv}
                          onChange={e => setForm({ ...form, priv: e.target.checked })}
                          className="accent-amber-500 w-4 h-4 rounded"
                        />
                        <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-white/40" /> Keep Private</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading || !form.request}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-[#0A1628] font-bold py-4 rounded-2xl text-sm hover:brightness-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-amber-400/15 tracking-wide"
                  >
                    {loading ? "Submitting..." : "Submit Prayer Request →"}
                  </button>

                  <p className="text-white/25 text-[11px] text-center">
                    We receive hundreds of requests daily. Every one is prayed over.
                  </p>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-20 h-20 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🕊️</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-3">Prayer Received</h3>
                  <p className="text-white/50 text-sm mb-2 font-light leading-relaxed max-w-xs mx-auto">
                    Your request has been submitted. Our team will intercede for you.
                  </p>
                  <p className="text-amber-400/60 text-xs italic mb-8">"The effective, fervent prayer of a righteous man avails much." — James 5:16</p>
                  <button
                    onClick={() => { setDone(false); setForm({ name: "", email: "", request: "", urgent: false, priv: false }); }}
                    className="text-amber-400 text-sm border border-amber-400/30 px-7 py-3 rounded-2xl hover:bg-amber-400/10 transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
