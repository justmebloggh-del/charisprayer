import Link from 'next/link'
import { ArrowRight, Heart, Shield, Lock } from 'lucide-react'

export default function PrayerCTA() {
  return (
    <section className="section-spacing" style={{ background: 'var(--surface)' }}>
      <div className="site-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(2.5rem, 5vw, 5rem)',
          alignItems: 'center',
        }}>
          {/* Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <span className="section-label">Prayer Request</span>
            <h2 className="t-h1 font-display">What Are You<br />Believing God For?</h2>
            <p className="t-body" style={{ maxWidth: '420px' }}>
              No burden is too heavy, no dream too big. Share your heart with us.
              Our intercession team prays over every request, personally and faithfully.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { icon: Heart, text: 'Prayed for personally by our team' },
                { icon: Shield, text: 'Handled with care and compassion' },
                { icon: Lock, text: 'Private requests stay confidential' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gold-muted)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={15} style={{ color: 'var(--gold)' }} />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>{text}</p>
                </div>
              ))}
            </div>

            <Link href="/prayer-request" className="btn btn-gold btn-lg" style={{ width: 'fit-content' }}>
              Submit Your Prayer
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Visual card */}
          <div style={{
            background: 'linear-gradient(135deg, var(--card), rgba(79,70,229,0.04))',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--r-xl)',
            padding: 'clamp(2rem, 4vw, 3rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-gold)',
          }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '5rem', lineHeight: 0.8, color: 'var(--gold)', opacity: 0.25 }}>"</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)', color: 'var(--text)', lineHeight: 1.6, fontStyle: 'italic' }}>
              The effective, fervent prayer of a righteous man avails much.
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--gold)', fontWeight: 600 }}>— James 5:16 NKJV</p>

            <div style={{ height: '1px', background: 'var(--border-gold)', opacity: 0.4 }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { n: '10K+', l: 'Prayers submitted' },
                { n: '98%', l: 'Report answered prayer' },
              ].map(s => (
                <div key={s.l} style={{ textAlign: 'center', padding: '1rem', background: 'var(--elevated)', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.75rem', color: 'var(--gold-light)' }}>{s.n}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '2px' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
