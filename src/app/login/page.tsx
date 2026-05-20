'use client'

import Image from 'next/image'
import { useActionState } from 'react'
import { login } from './actions'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null)
  const [showPw, setShowPw] = useState(false)

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

      {/* Left panel — branding */}
      <div style={{ background: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', gap: '2rem', borderRight: '1px solid var(--border)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border-gold)', boxShadow: 'var(--shadow-gold)' }}>
          <Image src="/charislogo.jpg" alt="Charis Prayer" width={80} height={80} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.75rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Charis Prayer</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--gold)', fontStyle: 'italic' }}>Where Grace Meets Prayer</p>
        </div>
        <blockquote style={{ maxWidth: '280px', textAlign: 'center', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '0.9375rem', color: 'var(--text-2)', lineHeight: 1.7 }}>
          "The effective, fervent prayer of a righteous man avails much." — James 5:16
        </blockquote>
        <div style={{ width: '40px', height: '1px', background: 'var(--border-gold)' }} />
        <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', textAlign: 'center' }}>
          Rev. Emmanuel Oduro Cosby
        </p>
      </div>

      {/* Right panel — form */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.75rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Admin Sign In</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-3)' }}>Sign in to manage the Charis Prayer platform.</p>
          </div>

          <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Email Address</label>
              <input name="email" type="email" required autoComplete="email" className="input-field" placeholder="admin@charispray.com" />
            </div>

            <div>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password" type={showPw ? 'text' : 'password'}
                  required autoComplete="current-password"
                  className="input-field" placeholder="••••••••"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display: 'flex' }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {state?.error && (
              <div style={{ padding: '0.875rem 1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--r-sm)', fontSize: '0.875rem', color: '#FCA5A5' }}>
                {state.error}
              </div>
            )}

            <button type="submit" disabled={pending} className="btn btn-gold btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}>
              {pending && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
              {pending ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  )
}
