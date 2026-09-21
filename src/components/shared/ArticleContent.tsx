'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface ArticleContentProps {
  html: string
  className?: string
  style?: React.CSSProperties
}

interface Slide {
  src: string
  alt: string
}

const MIN_SCALE = 1
const MAX_SCALE = 5

/**
 * Renders article HTML and turns every image inside it into a zoomable one:
 * clicking opens a modal where the picture can be zoomed and panned.
 */
export default function ArticleContent({ html, className, style }: ArticleContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [slides, setSlides] = useState<Slide[]>([])
  const [index, setIndex] = useState<number | null>(null)

  // Collect the images once the HTML is in the DOM, and make them look clickable.
  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    const images = Array.from(root.querySelectorAll('img'))
    images.forEach((img) => {
      img.style.cursor = 'zoom-in'
      img.setAttribute('tabindex', '0')
      img.setAttribute('role', 'button')
      if (!img.getAttribute('aria-label')) {
        img.setAttribute('aria-label', `Perbesar gambar${img.alt ? `: ${img.alt}` : ''}`)
      }
    })

    setSlides(
      images.map((img) => ({
        src: img.dataset.zoomSrc || img.currentSrc || img.src,
        alt: img.alt || '',
      }))
    )
  }, [html])

  const openAt = useCallback((target: HTMLImageElement) => {
    const root = containerRef.current
    if (!root) return
    const images = Array.from(root.querySelectorAll('img'))
    const position = images.indexOf(target)
    if (position >= 0) setIndex(position)
  }, [])

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        style={style}
        onClick={(e) => {
          const target = e.target as HTMLElement
          if (target.tagName === 'IMG') openAt(target as HTMLImageElement)
        }}
        onKeyDown={(e) => {
          const target = e.target as HTMLElement
          if (target.tagName !== 'IMG') return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openAt(target as HTMLImageElement)
          }
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {index !== null && slides[index] && (
        <Lightbox
          slides={slides}
          index={index}
          onIndexChange={setIndex}
          onClose={() => setIndex(null)}
        />
      )}
    </>
  )
}

interface LightboxProps {
  slides: Slide[]
  index: number
  onIndexChange: (next: number) => void
  onClose: () => void
}

function Lightbox({ slides, index, onIndexChange, onClose }: LightboxProps) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const panRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(
    null
  )

  const slide = slides[index]
  const many = slides.length > 1

  const reset = useCallback(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  const go = useCallback(
    (delta: number) => {
      onIndexChange((index + delta + slides.length) % slides.length)
      reset()
    },
    [index, slides.length, onIndexChange, reset]
  )

  const zoomBy = useCallback((delta: number) => {
    setScale((current) => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, current + delta))
      if (next === MIN_SCALE) setOffset({ x: 0, y: 0 })
      return next
    })
  }, [])

  // Keyboard control + scroll lock for as long as the modal is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' && many) go(1)
      else if (e.key === 'ArrowLeft' && many) go(-1)
      else if (e.key === '+' || e.key === '=') zoomBy(0.5)
      else if (e.key === '-') zoomBy(-0.5)
      else if (e.key === '0') reset()
    }
    window.addEventListener('keydown', onKey)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, go, zoomBy, reset, many])

  function onPointerDown(e: React.PointerEvent) {
    if (scale <= 1) return
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    panRef.current = { startX: e.clientX, startY: e.clientY, originX: offset.x, originY: offset.y }
  }

  function onPointerMove(e: React.PointerEvent) {
    const pan = panRef.current
    if (!pan) return
    setOffset({
      x: pan.originX + (e.clientX - pan.startX),
      y: pan.originY + (e.clientY - pan.startY),
    })
  }

  const controlClass =
    'w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-colors backdrop-blur-sm disabled:opacity-40 disabled:hover:bg-white/15'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={slide.alt || 'Gambar artikel'}
      className="fixed inset-0 z-[70] bg-black/92 flex flex-col animate-toast-in"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Controls */}
      <div className="flex items-center justify-end gap-2 p-4 shrink-0">
        <button type="button" onClick={() => zoomBy(-0.5)} className={controlClass} aria-label="Perkecil" disabled={scale <= MIN_SCALE}>
          −
        </button>
        <span className="text-white/80 text-sm font-body tabular-nums w-14 text-center">
          {Math.round(scale * 100)}%
        </span>
        <button type="button" onClick={() => zoomBy(0.5)} className={controlClass} aria-label="Perbesar" disabled={scale >= MAX_SCALE}>
          +
        </button>
        <button type="button" onClick={reset} className={`${controlClass} text-xs`} aria-label="Reset zoom">
          1:1
        </button>
        <button type="button" onClick={onClose} className={controlClass} aria-label="Tutup gambar">
          ×
        </button>
      </div>

      {/* Stage */}
      <div
        className="flex-1 min-h-0 flex items-center justify-center overflow-hidden px-4 pb-4"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        onWheel={(e) => zoomBy(e.deltaY < 0 ? 0.25 : -0.25)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slide.src}
          alt={slide.alt}
          draggable={false}
          onDoubleClick={() => (scale > 1 ? reset() : setScale(2.5))}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => {
            panRef.current = null
          }}
          onPointerCancel={() => {
            panRef.current = null
          }}
          className="max-w-full max-h-full object-contain select-none touch-none"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: panRef.current ? 'none' : 'transform 0.18s ease-out',
            cursor: scale > 1 ? 'grab' : 'zoom-in',
          }}
        />
      </div>

      {many && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Gambar sebelumnya"
            className={`${controlClass} absolute left-4 top-1/2 -translate-y-1/2`}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Gambar berikutnya"
            className={`${controlClass} absolute right-4 top-1/2 -translate-y-1/2`}
          >
            ›
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-xs font-body">
            {index + 1} / {slides.length}
          </p>
        </>
      )}
    </div>
  )
}
