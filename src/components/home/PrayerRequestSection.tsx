"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function PrayerRequestSection() {
  const [form, setForm] = useState({ name: "", email: "", request: "", urgent: false, priv: false });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async () => {
    if (!form.request) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('prayer_requests').insert([{
        name: form.name || 'Anonymous',
        email: form.email,
        request: form.request,
        is_private: form.priv,
        status: 'pending'
      }]);
      
      if (error) throw error;
      setDone(true);
    } catch (err) {
      console.error("Error submitting prayer request:", err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="text-4xl sm:text-5xl mb-4 sm:mb-5">🙏</div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A1628] mb-4">We're Praying For You</h2>
        <p className="text-[#0A1628]/65 text-base sm:text-lg mb-7 sm:mb-10 font-light leading-relaxed">Submit your prayer request and our dedicated prayer team will intercede for you. No request is too big or too small for God.</p>

        {!done ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 text-left shadow-2xl border border-amber-200/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email (optional)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Prayer Request <span className="text-amber-500">*</span></label>
              <textarea
                value={form.request}
                onChange={e => setForm({ ...form, request: e.target.value })}
                placeholder="Share your prayer request here... God hears your heart and so do we."
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors resize-none"
              />
            </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-4 mt-6">
                <div className="flex gap-5 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                    <input type="checkbox" checked={form.urgent} onChange={e => setForm({ ...form, urgent: e.target.checked })} className="accent-amber-500 w-4 h-4" />
                    🔴 Urgent Prayer
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                    <input type="checkbox" checked={form.priv} onChange={e => setForm({ ...form, priv: e.target.checked })} className="accent-amber-500 w-4 h-4" />
                    🔒 Keep Private
                  </label>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.request}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#0A1628] to-[#1a2e50] text-amber-400 font-bold px-7 py-3 rounded-2xl hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Request →"}
                </button>
              </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-amber-200/50">
            <div className="text-5xl sm:text-7xl mb-5">🕊️</div>
            <h3 className="font-serif text-3xl font-bold text-[#0A1628] mb-3">Your Prayer is Received</h3>
            <p className="text-gray-500 mb-2 italic">"The effective, fervent prayer of a righteous man avails much."</p>
            <p className="text-amber-600 italic text-sm mb-7">— James 5:16</p>
            <button
              onClick={() => { setDone(false); setForm({ name: "", email: "", request: "", urgent: false, priv: false }); }}
              className="border-2 border-[#0A1628] text-[#0A1628] font-bold px-7 py-3 rounded-2xl hover:bg-[#0A1628] hover:text-white transition-all text-sm"
            >
              Submit Another Request
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
