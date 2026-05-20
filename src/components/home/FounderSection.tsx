import Image from 'next/image'

export default function FounderSection() {
  return (
    <section className="section-spacing" style={{ background: 'var(--canvas)' }}>
      <div className="site-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(2.5rem, 5vw, 5rem)',
          alignItems: 'center',
        }}>
          {/* Portrait */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {/* Gold ring */}
            <div style={{
              position: 'absolute',
              width: 'min(340px, 90%)', height: 'min(340px, 90%)',
              borderRadius: '50%',
              border: '1px solid rgba(201,162,39,0.2)',
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            }} />
            <div style={{
              position: 'absolute',
              width: 'min(300px, 80%)', height: 'min(300px, 80%)',
              borderRadius: '50%',
              border: '1px solid rgba(201,162,39,0.1)',
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            }} />

            <div style={{
              width: 'min(280px, 85vw)', height: 'min(280px, 85vw)',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid var(--border-gold)',
              boxShadow: '0 0 60px rgba(201,162,39,0.15)',
              position: 'relative',
              zIndex: 1,
            }}>
              <Image
                src="/rev-emmanuel.jpg"
                alt="Rev. Emmanuel Oduro Cosby"
                fill
                style={{ objectFit: 'cover', objectPosition: 'top' }}
                sizes="280px"
              />
            </div>
          </div>

          {/* Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <span className="section-label">Ministry Leader</span>

            <div>
              <h2 className="t-h1 font-display" style={{ marginBottom: '0.25rem' }}>Rev. Emmanuel</h2>
              <h2 className="t-h1 font-display" style={{ color: 'var(--gold-light)' }}>Oduro Cosby</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p className="t-body">
                Rev. Emmanuel Oduro Cosby is a man of God called to the ministry of intercession and
                prayer. With a burning passion for souls and a deep reverence for the Word of God,
                he has led thousands into powerful encounters with the living God.
              </p>
              <p className="t-body">
                Founded on the principle that prayer changes everything, Charis Prayer stands as a
                global community where believers come together daily to seek the face of God, intercede
                for nations, and experience the transforming grace of the Holy Spirit.
              </p>
            </div>

            <blockquote style={{
              borderLeft: '3px solid var(--gold)',
              paddingLeft: '1.25rem',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: '1.0625rem',
              color: 'var(--text-2)',
              lineHeight: 1.7,
              marginTop: '0.5rem',
            }}>
              "Prayer is not our last resort. It is our first response and our greatest weapon."
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
