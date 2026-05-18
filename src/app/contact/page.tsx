"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SOCIAL_LINKS, WHATSAPP_CHANNEL } from "@/lib/constants";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#0A1628] to-[#1a2e50] py-20 text-center">
          <div className="text-amber-400 text-xs font-bold tracking-[3.5px] uppercase mb-4">Get In Touch</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-white/50 max-w-md mx-auto font-light">We'd love to hear from you. Reach out for prayer, partnership, or ministry enquiries.</p>
        </div>

        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

              {/* Info */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-[#0A1628] mb-6">Ministry Information</h2>
                <div className="space-y-5 mb-10">
                  {[
                    ["📧", "Email", "prayer@charisprayer.org"],
                    ["📞", "Phone", "+1 (800) CHARIS-1"],
                    ["🕐", "Morning Prayer", "5:00 AM Daily — Mon to Sun"],
                    ["📍", "Location", "Global Digital Ministry"],
                  ].map(([icon, label, value]) => (
                    <div key={label} className="flex items-start gap-4 p-4 bg-[#fafaf7] rounded-2xl border border-gray-100">
                      <div className="text-2xl">{icon}</div>
                      <div>
                        <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">{label}</div>
                        <div className="text-[#0A1628] font-medium">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* WhatsApp CTA */}
                <a
                  href={WHATSAPP_CHANNEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 bg-[#25D366]/8 border border-[#25D366]/25 rounded-2xl hover:bg-[#25D366]/12 transition-all group mb-8"
                >
                  <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#25D366] flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <div>
                    <div className="text-[#25D366] font-bold text-base">Join Our WhatsApp Channel</div>
                    <div className="text-gray-500 text-sm">Get notified for every prayer session · Mon–Sun</div>
                  </div>
                  <span className="text-[#25D366] ml-auto group-hover:translate-x-1 transition-transform text-xl">→</span>
                </a>

                {/* Social links */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Follow Us</div>
                  <div className="flex flex-wrap gap-2">
                    {SOCIAL_LINKS.map(s => (
                      <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 text-xs font-medium hover:border-amber-300 hover:text-amber-600 transition-all"
                      >
                        {s.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-[#0A1628] mb-6">Send a Message</h2>
                {!sent ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { key: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                        { key: "email", label: "Email Address", type: "email", placeholder: "your@email.com" },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{f.label}</label>
                          <input
                            type={f.type}
                            placeholder={f.placeholder}
                            value={(form as any)[f.key]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subject</label>
                      <input
                        placeholder="How can we help?"
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                      <textarea
                        placeholder="Your message..."
                        rows={6}
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors resize-none"
                      />
                    </div>
                    <button
                      onClick={() => form.name && form.message && setSent(true)}
                      className="w-full bg-gradient-to-r from-[#0A1628] to-[#1a2e50] text-amber-400 font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity text-sm tracking-wide"
                    >
                      Send Message →
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-[#fafaf7] rounded-3xl border border-gray-100">
                    <div className="text-6xl mb-5">✉️</div>
                    <h3 className="font-serif text-2xl font-bold text-[#0A1628] mb-3">Message Sent!</h3>
                    <p className="text-gray-500 mb-6 font-light">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                      className="border-2 border-[#0A1628] text-[#0A1628] font-bold px-6 py-2.5 rounded-xl hover:bg-[#0A1628] hover:text-white transition-all text-sm"
                    >
                      Send Another
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
