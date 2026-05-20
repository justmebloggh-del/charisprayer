'use client'

import { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react'
import type { Audio as AudioTrack } from '@/lib/types'

interface AudioState {
  currentTrack: AudioTrack | null
  isPlaying: boolean
  progress: number      // 0–100
  duration: number      // seconds
  currentTime: number   // seconds
  volume: number        // 0–1
  queue: AudioTrack[]
  queueIndex: number
}

interface AudioContextValue extends AudioState {
  play: (track: AudioTrack, queue?: AudioTrack[]) => void
  togglePlay: () => void
  seek: (pct: number) => void
  setVolume: (v: number) => void
  next: () => void
  prev: () => void
  close: () => void
}

const Ctx = createContext<AudioContextValue | null>(null)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [state, setState] = useState<AudioState>({
    currentTrack: null,
    isPlaying: false,
    progress: 0,
    duration: 0,
    currentTime: 0,
    volume: 0.8,
    queue: [],
    queueIndex: 0,
  })

  // Create audio element once
  useEffect(() => {
    const audio = new Audio()
    audio.volume = 0.8
    audio.preload = 'metadata'
    audioRef.current = audio

    const onTimeUpdate = () => {
      if (!audio.duration) return
      setState(s => ({
        ...s,
        currentTime: audio.currentTime,
        progress: (audio.currentTime / audio.duration) * 100,
        duration: audio.duration,
      }))
    }

    const onEnded = () => {
      setState(s => {
        if (s.queueIndex < s.queue.length - 1) {
          const next = s.queueIndex + 1
          audio.src = s.queue[next].file_url
          audio.play().catch(() => {})
          return { ...s, queueIndex: next, currentTrack: s.queue[next] }
        }
        return { ...s, isPlaying: false, progress: 0 }
      })
    }

    const onLoadedMetadata = () => {
      setState(s => ({ ...s, duration: audio.duration }))
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [])

  const play = useCallback((track: AudioTrack, queue?: AudioTrack[]) => {
    const audio = audioRef.current
    if (!audio) return
    const q = queue ?? [track]
    const idx = q.findIndex(t => t.id === track.id)
    if (track.file_url) {
      audio.src = track.file_url
      audio.play().catch(() => {})
    } else {
      audio.pause()
      audio.src = ''
    }
    setState(s => ({
      ...s,
      currentTrack: track,
      isPlaying: !!track.file_url,
      progress: 0,
      currentTime: 0,
      duration: track.file_url ? s.duration : 0,
      queue: q,
      queueIndex: idx >= 0 ? idx : 0,
    }))
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !state.currentTrack) return
    if (state.isPlaying) {
      audio.pause()
      setState(s => ({ ...s, isPlaying: false }))
    } else {
      audio.play().catch(() => {})
      setState(s => ({ ...s, isPlaying: true }))
    }
  }, [state.isPlaying, state.currentTrack])

  const seek = useCallback((pct: number) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    audio.currentTime = (pct / 100) * audio.duration
    setState(s => ({ ...s, progress: pct }))
  }, [])

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = v
    setState(s => ({ ...s, volume: v }))
  }, [])

  const next = useCallback(() => {
    setState(s => {
      if (s.queueIndex >= s.queue.length - 1) return s
      const idx = s.queueIndex + 1
      const track = s.queue[idx]
      const audio = audioRef.current
      if (audio) {
        if (track.file_url) { audio.src = track.file_url; audio.play().catch(() => {}) }
        else { audio.pause(); audio.src = '' }
      }
      return { ...s, queueIndex: idx, currentTrack: track, isPlaying: !!track.file_url, progress: 0, currentTime: 0, duration: track.file_url ? s.duration : 0 }
    })
  }, [])

  const prev = useCallback(() => {
    setState(s => {
      const audio = audioRef.current
      if (audio && audio.currentTime > 3) {
        audio.currentTime = 0
        return { ...s, progress: 0, currentTime: 0 }
      }
      if (s.queueIndex <= 0) return s
      const idx = s.queueIndex - 1
      const track = s.queue[idx]
      if (audio) {
        if (track.file_url) { audio.src = track.file_url; audio.play().catch(() => {}) }
        else { audio.pause(); audio.src = '' }
      }
      return { ...s, queueIndex: idx, currentTrack: track, isPlaying: !!track.file_url, progress: 0, currentTime: 0, duration: track.file_url ? s.duration : 0 }
    })
  }, [])

  const close = useCallback(() => {
    const audio = audioRef.current
    if (audio) { audio.pause(); audio.src = '' }
    setState(s => ({ ...s, currentTrack: null, isPlaying: false, progress: 0 }))
  }, [])

  return (
    <Ctx.Provider value={{ ...state, play, togglePlay, seek, setVolume, next, prev, close }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAudio() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAudio must be inside AudioProvider')
  return ctx
}
