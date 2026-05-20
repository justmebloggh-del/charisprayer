import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', gap: '1.5rem' }}>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(5rem,14vw,10rem)', fontWeight: 800, color: 'var(--elevated)', lineHeight: 1, userSelect: 'none' }}>404</p>
      <h1 className="t-h2 font-display">Page Not Found</h1>
      <p className="t-body" style={{ maxWidth: '360px' }}>The page you're looking for doesn't exist or has been moved.</p>
      <Link href="/" className="btn btn-gold btn-lg">Return Home</Link>
    </div>
  )
}
