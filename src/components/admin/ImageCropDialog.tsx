'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import { cldIsCropped, cldWithCrop, cldWithoutCrop } from '@/lib/cld-url'

interface ImageCropDialogProps {
  src: string
  onApply: (nextSrc: string) => void
  onClose: () => void
}

/** Crop box in the displayed image's coordinate space (CSS pixels). */
interface Box {
  x: number
  y: number
  w: number
  h: number
}

type DragMode =
  | { kind: 'new'; originX: number; originY: number }
  | { kind: 'move'; grabX: number; grabY: number }
  | { kind: 'resize'; corner: Corner }

type Corner = 'nw' | 'ne' | 'sw' | 'se'

const RATIOS: { label: string; value: number | null }[] = [
  { label: 'Bebas', value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:4', value: 3 / 4 },
  { label: '16:9', value: 16 / 9 },
]

const MIN_SIZE = 24

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export default function ImageCropDialog({ src, onApply, onClose }: ImageCropDialogProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragMode | null>(null)

  const [box, setBox] = useState<Box | null>(null)
  const [ratio, setRatio] = useState<number | null>(null)
  const [ready, setReady] = useState(false)

  const isCropped = cldIsCropped(src)

  /** Displayed size of the image, which is the coordinate space `box` lives in. */
  const displayed = useCallback(() => {
    const el = imgRef.current
    return { w: el?.clientWidth ?? 0, h: el?.clientHeight ?? 0 }
  }, [])

  const resetBox = useCallback(
    (forRatio: number | null) => {
      const { w, h } = displayed()
      if (!w || !h) return

      // Start at 80% of the frame, centred, honouring the chosen ratio.
      let boxW = w * 0.8
      let boxH = h * 0.8
      if (forRatio) {
        if (boxW / boxH > forRatio) boxW = boxH * forRatio
        else boxH = boxW / forRatio
      }
      setBox({ x: (w - boxW) / 2, y: (h - boxH) / 2, w: boxW, h: boxH })
    },
    [displayed]
  )

  useEffect(() => {
    if (ready) resetBox(ratio)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratio, ready])

  useEffect(() => {
    const onResize = () => resetBox(ratio)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [ratio, resetBox])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const pointFromEvent = useCallback((e: React.PointerEvent | PointerEvent) => {
    const rect = frameRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  /** Applies the active ratio by shrinking whichever side is too long. */
  const constrain = useCallback(
    (next: Box, bounds: { w: number; h: number }, anchor?: Corner): Box => {
      let { x, y, w, h } = next

      if (ratio) {
        if (w / h > ratio) w = h * ratio
        else h = w / ratio
        // Keep the dragged corner pinned while the opposite side moves.
        if (anchor === 'nw') {
          x = next.x + next.w - w
          y = next.y + next.h - h
        } else if (anchor === 'ne') {
          y = next.y + next.h - h
        } else if (anchor === 'sw') {
          x = next.x + next.w - w
        }
      }

      w = clamp(w, MIN_SIZE, bounds.w)
      h = clamp(h, MIN_SIZE, bounds.h)
      x = clamp(x, 0, bounds.w - w)
      y = clamp(y, 0, bounds.h - h)

      return { x, y, w, h }
    },
    [ratio]
  )

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const drag = dragRef.current
      if (!drag) return

      const bounds = displayed()
      const { x: px, y: py } = pointFromEvent(e)
      const cx = clamp(px, 0, bounds.w)
      const cy = clamp(py, 0, bounds.h)

      setBox((current) => {
        if (drag.kind === 'new') {
          return constrain(
            {
              x: Math.min(drag.originX, cx),
              y: Math.min(drag.originY, cy),
              w: Math.abs(cx - drag.originX),
              h: Math.abs(cy - drag.originY),
            },
            bounds,
            cx < drag.originX ? (cy < drag.originY ? 'nw' : 'sw') : cy < drag.originY ? 'ne' : 'se'
          )
        }

        if (!current) return current

        if (drag.kind === 'move') {
          return {
            ...current,
            x: clamp(cx - drag.grabX, 0, bounds.w - current.w),
            y: clamp(cy - drag.grabY, 0, bounds.h - current.h),
          }
        }

        // resize: the corner opposite the dragged one stays put
        const right = current.x + current.w
        const bottom = current.y + current.h
        const next: Box =
          drag.corner === 'se'
            ? { x: current.x, y: current.y, w: cx - current.x, h: cy - current.y }
            : drag.corner === 'sw'
              ? { x: cx, y: current.y, w: right - cx, h: cy - current.y }
              : drag.corner === 'ne'
                ? { x: current.x, y: cy, w: cx - current.x, h: bottom - cy }
                : { x: cx, y: cy, w: right - cx, h: bottom - cy }

        if (next.w < MIN_SIZE || next.h < MIN_SIZE) return current
        return constrain(next, bounds, drag.corner)
      })
    },
    [constrain, displayed, pointFromEvent]
  )

  useEffect(() => {
    const stop = () => {
      dragRef.current = null
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
  }, [onPointerMove])

  function startNew(e: React.PointerEvent) {
    if (e.button !== 0) return
    const { x, y } = pointFromEvent(e)
    dragRef.current = { kind: 'new', originX: x, originY: y }
  }

  function startMove(e: React.PointerEvent) {
    if (e.button !== 0 || !box) return
    e.stopPropagation()
    const { x, y } = pointFromEvent(e)
    dragRef.current = { kind: 'move', grabX: x - box.x, grabY: y - box.y }
  }

  function startResize(e: React.PointerEvent, corner: Corner) {
    if (e.button !== 0) return
    e.stopPropagation()
    dragRef.current = { kind: 'resize', corner }
  }

  function apply() {
    const img = imgRef.current
    if (!img || !box) return

    // Displayed pixels → the asset's own pixels, which is what c_crop expects.
    const scaleX = img.naturalWidth / img.clientWidth
    const scaleY = img.naturalHeight / img.clientHeight

    const x = Math.max(0, Math.round(box.x * scaleX))
    const y = Math.max(0, Math.round(box.y * scaleY))
    const w = Math.max(1, Math.min(Math.round(box.w * scaleX), img.naturalWidth - x))
    const h = Math.max(1, Math.min(Math.round(box.h * scaleY), img.naturalHeight - y))

    onApply(cldWithCrop(src, `c_crop,x_${x},y_${y},w_${w},h_${h}`))
  }

  const handleClass =
    'absolute w-4 h-4 bg-white border-2 border-primary rounded-full shadow'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Potong gambar"
      className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-scrapbook shadow-ambient w-full max-w-3xl max-h-full overflow-auto">
        <div className="flex items-center justify-between px-5 py-3 border-b border-surface-dim">
          <h2 className="font-heading font-bold text-text">Potong Gambar</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-container"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-body text-text-muted">Rasio:</span>
            {RATIOS.map((r) => (
              <button
                key={r.label}
                type="button"
                onClick={() => setRatio(r.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-colors ${
                  ratio === r.value
                    ? 'bg-primary text-white'
                    : 'text-text-muted hover:bg-surface-container'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex justify-center bg-surface-container rounded-2xl p-3">
            <div
              ref={frameRef}
              className="relative inline-block select-none touch-none"
              onPointerDown={startNew}
            >
              {/* Intentionally a plain <img>: next/image can't measure an
                  arbitrary Cloudinary crop, and we need naturalWidth here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={src}
                alt="Gambar yang akan dipotong"
                draggable={false}
                onLoad={() => setReady(true)}
                className="block max-h-[55vh] max-w-full w-auto rounded-xl"
              />

              {box && (
                <>
                  {/* Dim everything outside the selection */}
                  <div
                    className="absolute inset-0 bg-black/50 pointer-events-none rounded-xl"
                    style={{
                      clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${box.x}px ${box.y}px, ${box.x}px ${box.y + box.h}px, ${box.x + box.w}px ${box.y + box.h}px, ${box.x + box.w}px ${box.y}px, ${box.x}px ${box.y}px)`,
                    }}
                  />
                  <div
                    className="absolute border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)] cursor-move"
                    style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
                    onPointerDown={startMove}
                  >
                    <span
                      className={`${handleClass} -left-2 -top-2 cursor-nwse-resize`}
                      onPointerDown={(e) => startResize(e, 'nw')}
                    />
                    <span
                      className={`${handleClass} -right-2 -top-2 cursor-nesw-resize`}
                      onPointerDown={(e) => startResize(e, 'ne')}
                    />
                    <span
                      className={`${handleClass} -left-2 -bottom-2 cursor-nesw-resize`}
                      onPointerDown={(e) => startResize(e, 'sw')}
                    />
                    <span
                      className={`${handleClass} -right-2 -bottom-2 cursor-nwse-resize`}
                      onPointerDown={(e) => startResize(e, 'se')}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="text-xs font-body text-text-muted">
            Seret di dalam gambar untuk membuat area baru, geser kotak untuk memindahkan, atau tarik
            titik sudut untuk mengubah ukuran. Potongan tidak menghapus gambar asli.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-t border-surface-dim">
          <Button type="button" size="sm" onClick={apply} disabled={!box}>
            Terapkan Potongan
          </Button>
          {isCropped && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onApply(cldWithoutCrop(src))}
            >
              Kembalikan Utuh
            </Button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-body text-text-muted hover:text-text"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}
