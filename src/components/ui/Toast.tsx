'use client'

import { useEffect, useState } from 'react'

export interface ToastProps {
  kind: 'success' | 'error'
  text: string
  /** Auto-dismiss delay in ms. Defaults: 4s for success, 8s for errors. */
  duration?: number
  /** Called once the toast hides itself, so the parent can drop its state. */
  onClose?: () => void
  /**
   * Query param to strip from the URL once shown — keeps a redirect like
   * `?status=created` from replaying the toast on every refresh.
   */
  stripQueryParam?: string
}

export default function Toast({
  kind,
  text,
  duration,
  onClose,
  stripQueryParam,
}: ToastProps) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!stripQueryParam) return
    const url = new URL(window.location.href)
    if (!url.searchParams.has(stripQueryParam)) return
    url.searchParams.delete(stripQueryParam)
    window.history.replaceState(null, '', url.pathname + url.search)
  }, [stripQueryParam])

  useEffect(() => {
    const ms = duration ?? (kind === 'success' ? 4000 : 8000)
    const hide = setTimeout(() => setLeaving(true), ms)
    // keep the node mounted through the fade-out
    const drop = setTimeout(() => onClose?.(), ms + 200)
    return () => {
      clearTimeout(hide)
      clearTimeout(drop)
    }
  }, [kind, duration, onClose])

  const isSuccess = kind === 'success'

  return (
    <div
      role={isSuccess ? 'status' : 'alert'}
      aria-live="polite"
      className={`fixed bottom-6 right-4 left-4 sm:left-auto sm:w-[380px] z-50 transition-all duration-200 ${
        leaving ? 'opacity-0 translate-y-2' : 'animate-toast-in'
      }`}
    >
      <div
        className={`flex items-start gap-3 rounded-scrapbook px-4 py-3.5 shadow-ambient border text-sm font-body ${
          isSuccess
            ? 'bg-white border-primary/30 text-primary'
            : 'bg-white border-secondary/30 text-secondary'
        }`}
      >
        <span
          className={`shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[12px] font-bold ${
            isSuccess ? 'bg-primary' : 'bg-secondary'
          }`}
          aria-hidden="true"
        >
          {isSuccess ? '✓' : '!'}
        </span>

        <p className="flex-1 leading-relaxed">{text}</p>

        <button
          type="button"
          onClick={() => {
            setLeaving(true)
            setTimeout(() => onClose?.(), 200)
          }}
          aria-label="Tutup notifikasi"
          className="shrink-0 -mr-1 -mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-container transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  )
}
