const schedule = [
  { day: 'Monday',    short: 'MON', time: '6:00 AM', theme: 'Praise & Worship',       icon: '🎵', color: '#F59E0B' },
  { day: 'Tuesday',   short: 'TUE', time: '6:00 AM', theme: 'Faith Declarations',     icon: '🗡️', color: '#EF4444' },
  { day: 'Wednesday', short: 'WED', time: '6:00 AM', theme: 'Intercession',            icon: '🌍', color: '#3B82F6' },
  { day: 'Thursday',  short: 'THU', time: '6:00 AM', theme: 'Healing & Restoration',  icon: '✨', color: '#8B5CF6' },
  { day: 'Friday',    short: 'FRI', time: '6:00 AM', theme: 'Breakthrough Prayer',    icon: '⚡', color: '#EC4899' },
  { day: 'Saturday',  short: 'SAT', time: '8:00 AM', theme: 'Family & Nations',       icon: '🏡', color: '#10B981' },
  { day: 'Sunday',    short: 'SUN', time: '9:00 AM', theme: 'Thanksgiving & Worship', icon: '🙌', color: '#C9A227' },
]

export default function ScheduleSection() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <section className="section-spacing" style={{ background: 'var(--surface)' }}>
      <div className="site-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <span className="section-label">Weekly Schedule</span>
          <h2 className="t-h1 font-display">Join Us in Prayer</h2>
          <p className="t-body" style={{ maxWidth: '480px' }}>
            Every session is streamed live. Tune in daily and let God meet you in the place of prayer.
          </p>
        </div>

        {/* Mobile: horizontal scroll. Desktop: grid */}
        <div className="schedule-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
          gap: '1rem',
        }}>
          {schedule.map(s => {
            const isToday = s.day === today
            return (
              <div
                key={s.day}
                className="card"
                style={{
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  textAlign: 'center',
                  alignItems: 'center',
                  borderColor: isToday ? 'var(--border-gold)' : undefined,
                  background: isToday ? 'linear-gradient(135deg, rgba(201,162,39,0.06), rgba(201,162,39,0.02))' : undefined,
                  boxShadow: isToday ? 'var(--shadow-gold)' : undefined,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {isToday && (
                  <span style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
                  }} />
                )}

                <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{s.icon}</span>

                <div>
                  <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: s.color, marginBottom: '0.25rem' }}>{s.short}</p>
                  <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: isToday ? 'var(--gold-light)' : 'var(--text)' }}>{s.day}</p>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--text-2)', lineHeight: 1.4 }}>{s.theme}</p>

                <div style={{
                  fontSize: '0.75rem', fontWeight: 600, color: isToday ? 'var(--gold)' : 'var(--text-3)',
                  background: isToday ? 'var(--gold-muted)' : 'var(--elevated)',
                  padding: '0.25rem 0.625rem', borderRadius: 'var(--r-full)',
                  border: `1px solid ${isToday ? 'var(--border-gold)' : 'var(--border)'}`,
                }}>
                  {s.time} WAT
                </div>

                {isToday && (
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.08em' }}>TODAY</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
