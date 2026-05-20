'use client'

import { useAudio } from '@/context/AudioContext'
import { AnimatePresence, motion } from 'framer-motion'
import * as Slider from '@radix-ui/react-slider'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Music2, Upload
} from 'lucide-react'

function formatTime(s: number) {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function GlobalAudioPlayer() {
  const { currentTrack, isPlaying, progress, currentTime, duration, volume, togglePlay, seek, setVolume, next, prev, close } = useAudio()

  const hasFile = !!currentTrack?.file_url

  return (
    <AnimatePresence>
      {currentTrack && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100]"
          style={{ background: 'rgba(11,17,32,0.96)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(79,70,229,0.15)' }}
        >
          {/* Progress bar */}
          <div
            style={{ position: 'relative', height: '3px', background: 'rgba(255,255,255,0.06)', cursor: hasFile ? 'pointer' : 'default' }}
            onClick={(e) => {
              if (!hasFile) return
              const rect = e.currentTarget.getBoundingClientRect()
              seek(((e.clientX - rect.left) / rect.width) * 100)
            }}
          >
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #4F46E5, #818CF8)', transition: 'width 0.3s linear', width: `${progress}%` }} />
          </div>

          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.75rem clamp(1rem,4vw,2rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>

              {/* Track info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flex: '1', minWidth: 0 }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'var(--card)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                  {currentTrack.cover_url
                    ? <img src={currentTrack.cover_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <Music2 size={18} color="var(--gold)" />
                  }
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentTrack.title}
                  </p>
                  {hasFile ? (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '1px' }}>{currentTrack.category}</p>
                  ) : (
                    <p style={{ fontSize: '0.7rem', color: 'var(--amber)', marginTop: '1px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Upload size={10} /> Upload audio file in Admin
                    </p>
                  )}
                </div>

                {/* Waveform */}
                {isPlaying && hasFile && (
                  <div className="waveform" style={{ marginLeft: '0.5rem' }}>
                    {[18, 28, 14, 32, 22, 30, 16, 26].map((h, i) => (
                      <div key={i} className="waveform-bar" style={{ height: `${h}px`, animationDelay: `${i * 0.07}s` }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                <button onClick={prev} className="btn btn-icon btn-ghost btn-sm" style={{ color: 'var(--text-2)' }} aria-label="Previous">
                  <SkipBack size={17} />
                </button>
                <button
                  onClick={hasFile ? togglePlay : undefined}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  title={!hasFile ? 'No audio file — upload one in Admin' : undefined}
                  style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: hasFile ? 'var(--gold)' : 'var(--elevated)',
                    color: hasFile ? '#000' : 'var(--text-3)',
                    border: hasFile ? 'none' : '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: hasFile ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                    opacity: hasFile ? 1 : 0.5,
                  }}
                >
                  {isPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" style={{ marginLeft: '2px' }} />}
                </button>
                <button onClick={next} className="btn btn-icon btn-ghost btn-sm" style={{ color: 'var(--text-2)' }} aria-label="Next">
                  <SkipForward size={17} />
                </button>
              </div>

              {/* Time — only meaningful when there's a file */}
              {hasFile && (
                <span className="audio-time" style={{ fontSize: '0.75rem', color: 'var(--text-3)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              )}

              {/* Volume — hide on mobile */}
              {hasFile && (
                <div className="audio-volume" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '4px', display: 'flex' }}
                  >
                    {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <div style={{ width: '72px' }}>
                    <Slider.Root
                      value={[volume * 100]}
                      onValueChange={([v]) => setVolume(v / 100)}
                      max={100} step={1}
                      style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '16px', cursor: 'pointer' }}
                    >
                      <Slider.Track style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '99px', height: '3px', flexGrow: 1, position: 'relative' }}>
                        <Slider.Range style={{ background: 'var(--gold)', borderRadius: '99px', position: 'absolute', height: '100%' }} />
                      </Slider.Track>
                      <Slider.Thumb style={{ display: 'block', width: '12px', height: '12px', background: 'var(--gold)', borderRadius: '50%', border: 'none', outline: 'none', cursor: 'grab' }} />
                    </Slider.Root>
                  </div>
                </div>
              )}

              {/* Close */}
              <button
                onClick={close}
                style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '4px', display: 'flex', flexShrink: 0 }}
                aria-label="Close player"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
