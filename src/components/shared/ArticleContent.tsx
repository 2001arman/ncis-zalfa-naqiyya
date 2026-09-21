'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import ImageLightbox, { type LightboxSlide } from '@/components/shared/ImageLightbox'

interface ArticleContentProps {
  html: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Renders article HTML and turns every image inside it into a zoomable one:
 * clicking opens the shared lightbox. The images come from a stored HTML
 * string, so they're picked up from the DOM rather than passed in as data.
 */
export default function ArticleContent({ html, className, style }: ArticleContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [slides, setSlides] = useState<LightboxSlide[]>([])
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
    const position = Array.from(root.querySelectorAll('img')).indexOf(target)
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

      {index !== null && (
        <ImageLightbox
          slides={slides}
          index={index}
          onIndexChange={setIndex}
          onClose={() => setIndex(null)}
        />
      )}
    </>
  )
}
