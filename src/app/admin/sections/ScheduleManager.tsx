'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import type { ScheduleItem } from '@/lib/types'

interface Props { initial: ScheduleItem[] }

const FALLBACK: Omit<ScheduleItem, 'id' | 'updated_at'>[] = [
  { day: 'Monday',    short: 'MON', sort_order: 1, time_start: '5:00 AM', time_end: '6:00 AM', theme: 'Praise & Worship',       icon: '🎵', color: '#F59E0B' },
  { day: 'Tuesday',   short: 'TUE', sort_order: 2, time_start: '5:00 AM', time_end: '6:00 AM', theme: 'Faith Declarations',     icon: '🗡️', color: '#EF4444' },
  { day: 'Wednesday', short: 'WED', sort_order: 3, time_start: '5:00 AM', time_end: '6:00 AM', theme: 'Intercession',           icon: '🌍', color: '#3B82F6' },
  { day: 'Thursday',  short: 'THU', sort_order: 4, time_start: '5:00 AM', time_end: '6:00 AM', theme: 'Healing & Restoration',  icon: '✨', color: '#8B5CF6' },
  { day: 'Friday',    short: 'FRI', sort_order: 5, time_start: '5:00 AM', time_end: '6:00 AM', theme: 'Breakthrough Prayer',    icon: '⚡', color: '#EC4899' },
  { day: 'Saturday',  short: 'SAT', sort_order: 6, time_start: '5:00 AM', time_end: '6:00 AM', theme: 'Family & Nations',       icon: '🏡', color: '#10B981' },
  { day: 'Sunday',    short: 'SUN', sort_order: 7, time_start: '5:00 AM', time_end: '6:00 AM', theme: 'Thanksgiving & Worship', icon: '🙌', color: '#C9A227' },
]

function mergeWithFallback(from_db: ScheduleItem[]): ScheduleRow[] {
  return FALLBACK.map((fb) => {
    const db = from_db.find(d => d.day === fb.day)
    return db
      ? { ...db }
      : { id: '', ...fb, updated_at: '', _new: true } as ScheduleRow
  })
}

type ScheduleRow = ScheduleItem & { _new?: boolean }

export default function ScheduleManager({ initial }: Props) {
  const [rows, setRows] = useState<ScheduleRow[]>(() => mergeWithFallback(initial))
  const [saving, setSaving] = useState<string | null>(null)
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)

  function update(day: string, field: keyof ScheduleRow, value: string) {
    setRows(prev => prev.map(r => r.day === day ? { ...r, [field]: value } : r))
    setStatus(null)
  }

  async function saveRow(row: ScheduleRow) {
    setSaving(row.day)
    setStatus(null)
    const supabase = createClient()

    const payload = {
      day: row.day,
      short: row.short,
      sort_order: row.sort_order,
      time_start: row.time_start.trim(),
      time_end: row.time_end.trim(),
      theme: row.theme.trim(),
      icon: row.icon.trim(),
      color: row.color.trim(),
      updated_at: new Date().toISOString(),
    }

    let err
    if (row._new || !row.id) {
      const { error } = await supabase.from('schedule_items').insert(payload)
      err = error
    } else {
      const { error } = await supabase.from('schedule_items').update(payload).eq('id', row.id)
      err = error
    }

    setSaving(null)
    if (err) {
      setStatus({ type: 'err', msg: err.message })
    } else {
      setRows(prev => prev.map(r => r.day === row.day ? { ...r, _new: false } : r))
      setStatus({ type: 'ok', msg: `${row.day} schedule saved.` })
    }
  }

  async function saveAll() {
    setSaving('all')
    setStatus(null)
    const supabase = createClient()
    let errMsg = ''

    for (const row of rows) {
      const payload = {
        day: row.day,
        short: row.short,
        sort_order: row.sort_order,
        time_start: row.time_start.trim(),
        time_end: row.time_end.trim(),
        theme: row.theme.trim(),
        icon: row.icon.trim(),
        color: row.color.trim(),
        updated_at: new Date().toISOString(),
      }

      if (row._new || !row.id) {
        const { error } = await supabase.from('schedule_items').insert(payload)
        if (error) errMsg = error.message
      } else {
        const { error } = await supabase.from('schedule_items').update(payload).eq('id', row.id)
        if (error) errMsg = error.message
      }
    }

    setSaving(null)
    if (errMsg) {
      setStatus({ type: 'err', msg: errMsg })
    } else {
      setRows(prev => prev.map(r => ({ ...r, _new: false })))
      setStatus({ type: 'ok', msg: 'All schedule times saved successfully.' })
    }
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text)' }}>Weekly Schedule</h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>
            Edit prayer times and themes for each day. Changes appear live on the homepage.
          </p>
        </div>
        <button
          onClick={saveAll}
          disabled={saving === 'all'}
          className="btn btn-gold btn-sm"
          style={{ gap: '0.5rem' }}
        >
          {saving === 'all'
            ? <><Loader2 size={14} className="animate-spin" /> Saving All…</>
            : <><Save size={14} /> Save All</>}
        </button>
      </div>

      {/* Status */}
      {status && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.75rem 1rem', borderRadius: 'var(--r-sm)', marginBottom: '1.5rem',
          background: status.type === 'ok' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
          border: `1px solid ${status.type === 'ok' ? 'rgba(34,197,94,0.20)' : 'rgba(239,68,68,0.20)'}`,
          color: status.type === 'ok' ? 'var(--green)' : 'var(--red)',
          fontSize: '0.8125rem',
        }}>
          {status.type === 'ok' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
          {status.msg}
        </div>
      )}

      {/* Schedule rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {rows.map(row => (
          <div
            key={row.day}
            className="card"
            style={{ padding: '1.125rem 1.25rem', display: 'grid', alignItems: 'center', gap: '0.875rem', gridTemplateColumns: '90px 1fr 1fr 2fr 44px' }}
          >
            {/* Day label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{row.icon}</span>
              <div>
                <p style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: row.color }}>{row.short}</p>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text)' }}>{row.day}</p>
              </div>
            </div>

            {/* Start time */}
            <div>
              <label style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                Start
              </label>
              <div style={{ position: 'relative' }}>
                <Clock size={12} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
                <input
                  className="input-field"
                  style={{ paddingLeft: '1.75rem', fontSize: '0.8125rem', height: '2.125rem' }}
                  value={row.time_start}
                  onChange={e => update(row.day, 'time_start', e.target.value)}
                  placeholder="5:00 AM"
                />
              </div>
            </div>

            {/* End time */}
            <div>
              <label style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                End
              </label>
              <div style={{ position: 'relative' }}>
                <Clock size={12} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
                <input
                  className="input-field"
                  style={{ paddingLeft: '1.75rem', fontSize: '0.8125rem', height: '2.125rem' }}
                  value={row.time_end}
                  onChange={e => update(row.day, 'time_end', e.target.value)}
                  placeholder="6:00 AM"
                />
              </div>
            </div>

            {/* Theme */}
            <div>
              <label style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                Theme
              </label>
              <input
                className="input-field"
                style={{ fontSize: '0.8125rem', height: '2.125rem' }}
                value={row.theme}
                onChange={e => update(row.day, 'theme', e.target.value)}
                placeholder="Theme"
              />
            </div>

            {/* Save row */}
            <button
              onClick={() => saveRow(row)}
              disabled={saving === row.day}
              className="btn btn-ghost btn-sm btn-icon"
              title="Save this day"
              style={{ width: '36px', height: '36px', borderRadius: 'var(--r-sm)', flexShrink: 0 }}
            >
              {saving === row.day
                ? <Loader2 size={14} className="animate-spin" />
                : <Save size={14} />}
            </button>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '1.25rem' }}>
        Times are displayed in BST (GMT+1). You can type any format, e.g. &quot;5:00 AM&quot; or &quot;05:00&quot;.
      </p>
    </div>
  )
}
