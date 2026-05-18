"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { SAMPLE_TESTIMONIES } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function TestimoniesSection() {
  const [form, setForm] = useState({ name: "", text: "", location: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testimonies, setTestimonies] = useState<any[]>(SAMPLE_TESTIMONIES);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTestimonies() {
      const { data } = await supabase
        .from('testimonies')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (data && data.length > 0) {
        setTestimonies(data);
      }
    }
    fetchTestimonies();
  }, [supabase]);

  const handleSubmit = async () => {
    if (!form.text) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('testimonies').insert([{
        name: form.name || 'Anonymous',
        location: form.location || 'Unknown',
        quote: form.text,
        status: 'pending'
      }]);
      if (error) throw error;
      setSubmitted(true);
      setForm({ name: "", text: "", location: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-[#fafaf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="text-amber-600 text-xs font-bold tracking-[3.5px] uppercase mb-4">God is Moving</div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#0A1628] mb-5">Testimonies of Grace</h2>
          <div className="w-14 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-300 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {testimonies.slice(0, 3).map((t, idx) => (
            <div key={t.id || idx} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden card-hover">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-300" />
              <div className="font-serif text-6xl text-amber-400 leading-none mb-5">"</div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic font-light">{t.quote}</p>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <div>
                  <div className="font-bold text-[#0A1628] text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{t.location}</div>
                </div>
                <Badge variant="gold">{t.tag || "Praise Report"}</Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Share testimony */}
        <div className="bg-gradient-to-br from-[#0A1628] to-[#1a2e50] rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="font-serif text-3xl font-bold text-white mb-4">Share Your Testimony</h3>
            <p className="text-white/60 font-light leading-relaxed">Has God done something amazing in your life? Share your story and encourage thousands of believers around the world.</p>
          </div>
          {!submitted ? (
            <div className="space-y-3">
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Your Name"
                className="w-full bg-white/8 border border-amber-400/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-amber-400/50 transition-colors"
              />
              <input
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder="City, Country"
                className="w-full bg-white/8 border border-amber-400/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-amber-400/50 transition-colors"
              />
              <textarea
                value={form.text}
                onChange={e => setForm({ ...form, text: e.target.value })}
                placeholder="Share what God has done..."
                rows={4}
                className="w-full bg-white/8 border border-amber-400/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none focus:border-amber-400/50 transition-colors resize-none"
              />
              <Button disabled={loading || !form.text} variant="gold" size="lg" onClick={handleSubmit}>
                {loading ? "Submitting..." : "Submit Testimony 🕊️"}
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">🎉</div>
              <div className="font-serif text-white text-2xl font-bold mb-2">Thank You!</div>
              <p className="text-white/55 text-sm mb-5">Your testimony has been received and will be reviewed to glorify God.</p>
              <button onClick={() => setSubmitted(false)} className="text-amber-400 text-sm border border-amber-400/30 px-5 py-2 rounded-full hover:bg-amber-400/10 transition-colors">Submit Another</button>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Link href="/testimonies"><Button variant="outline" size="lg">View All Testimonies →</Button></Link>
        </div>
      </div>
    </section>
  );
}
