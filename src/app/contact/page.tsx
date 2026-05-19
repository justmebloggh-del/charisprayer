"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { SOCIAL_LINKS, WHATSAPP_CHANNEL } from "@/lib/constants";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

const CONTACT_INFO = [
  { icon: <Mail className="w-5 h-5" />, label: "Email", value: "prayer@charisprayer.org" },
  { icon: <Phone className="w-5 h-5" />, label: "Phone", value: "+1 (800) CHARIS-1" },
  { icon: <Clock className="w-5 h-5" />, label: "Morning Prayer", value: "5:00 AM Daily — Mon to Sun" },
  { icon: <MapPin className="w-5 h-5" />, label: "Location", value: "Global Digital Ministry" },
];

const WA_PATH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Get In Touch"
          title="Contact Us"
          description="We'd love to hear from you. Reach out for prayer, partnership, or ministry enquiries."
        />

        {/* Contact content */}
        <section className="section-py bg-white">
          <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">

              {/* Info column */}
              <div>
                <h2 className="text-subsection font-serif font-bold text-[#0A1628] mb-8">Ministry Information</h2>

                <div className="space-y-4 mb-10">
                  {CONTACT_INFO.map(item => (
                    <div key={item.label} className="flex items-start gap-4 p-5 bg-[#fafaf8] rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-sm transition-all">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A1628] to-[#1a2e50] flex items-center justify-center text-amber-400 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1">{item.label}</div>
                        <div className="text-[#0A1628] font-medium text-sm">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* WhatsApp CTA */}
                <a
                  href={WHATSAPP_CHANNEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 bg-[#25D366]/6 border border-[#25D366]/20 rounded-2xl hover:bg-[#25D366]/10 hover:border-[#25D366]/35 transition-all group mb-10"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#25D366]/15 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#25D366]">
                      <path d={WA_PATH} />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[#25D366] font-bold text-sm">Join Our WhatsApp Channel</div>
                    <div className="text-gray-500 text-xs mt-0.5">Daily prayer alerts · Mon–Sun sessions</div>
                  </div>
                  <span className="text-[#25D366] group-hover:translate-x-1 transition-transform text-lg">→</span>
                </a>

                {/* Social links */}
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Follow Us</div>
                  <div className="flex flex-wrap gap-2">
                    {SOCIAL_LINKS.map(s => (
                      <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#fafaf8] border border-gray-200 text-gray-600 text-xs font-semibold hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-all"
                      >
                        {s.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form column */}
              <div>
                <h2 className="text-subsection font-serif font-bold text-[#0A1628] mb-8">Send a Message</h2>

                {!sent ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { key: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                        { key: "email", label: "Email Address", type: "email", placeholder: "your@email.com" },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{f.label}</label>
                          <input
                            type={f.type}
                            placeholder={f.placeholder}
                            value={(form as Record<string, string>)[f.key]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 hover:border-gray-300 transition-colors bg-[#fafaf8]"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                      <input
                        placeholder="How can we help?"
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 hover:border-gray-300 transition-colors bg-[#fafaf8]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Message</label>
                      <textarea
                        placeholder="Your message..."
                        rows={6}
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 hover:border-gray-300 transition-colors resize-none bg-[#fafaf8]"
                      />
                    </div>
                    <button
                      onClick={() => form.name && form.message && setSent(true)}
                      className="w-full bg-gradient-to-r from-[#0A1628] to-[#1a2e50] text-amber-400 font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity text-sm tracking-wide shadow-lg shadow-navy-900/20"
                    >
                      Send Message →
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-[#fafaf8] rounded-3xl border border-gray-100">
                    <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-5">
                      <span className="text-4xl">✉️</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[#0A1628] mb-3">Message Sent!</h3>
                    <p className="text-gray-500 mb-7 font-light text-sm leading-[1.75] max-w-xs mx-auto">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                      className="border-2 border-[#0A1628] text-[#0A1628] font-bold px-7 py-3 rounded-2xl hover:bg-[#0A1628] hover:text-white transition-all text-sm"
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
