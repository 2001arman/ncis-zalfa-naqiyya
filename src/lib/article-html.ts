import { cldUrl } from '@/lib/cld-url'

/**
 * Width the article column tops out at — no point shipping more pixels.
 * `c_limit` only ever shrinks: a bare `w_` would upscale a small image and ship
 * a blurry, heavier file than the original.
 */
const DISPLAY_TRANSFORM = 'c_limit,f_auto,q_auto,w_1280'
/** Bigger render kept aside for the zoom modal, where detail actually matters. */
const ZOOM_TRANSFORM = 'c_limit,f_auto,q_auto,w_2000'

function readAttr(attrs: string, name: string): string | null {
  const match = new RegExp(`\\s${name}=["']([^"']*)["']`, 'i').exec(attrs)
  return match ? match[1] : null
}

function dropAttr(attrs: string, name: string): string {
  return attrs.replace(new RegExp(`\\s${name}=["'][^"']*["']`, 'gi'), '')
}

/**
 * Prepares stored article HTML for the public page:
 * - inline images get Cloudinary auto format/quality at a capped width
 * - the editor's pixel `width`/`height` become a responsive inline style, so a
 *   resized image keeps its intended size without overflowing a phone screen
 * - each image carries a higher-resolution `data-zoom-src` for the zoom modal
 */
export function prepareArticleHtml(html: string): string {
  return html.replace(/<img\b([^>]*)>/gi, (tag, rawAttrs: string) => {
    const src = readAttr(rawAttrs, 'src')
    if (!src) return tag

    let attrs = rawAttrs

    // Pixel dimensions from the editor's resize handles → responsive CSS.
    const width = readAttr(attrs, 'width')
    if (width && /^\d+(\.\d+)?$/.test(width)) {
      attrs = dropAttr(dropAttr(attrs, 'width'), 'height')
      attrs += ` style="width:${Math.round(Number(width))}px;max-width:100%;height:auto"`
    }

    attrs = attrs.replace(
      new RegExp(`\\ssrc=["']${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i'),
      ` src="${cldUrl(src, DISPLAY_TRANSFORM)}"`
    )

    attrs += ` data-zoom-src="${cldUrl(src, ZOOM_TRANSFORM)}"`
    if (!/\sloading=/i.test(attrs)) attrs += ' loading="lazy"'
    if (!/\sdecoding=/i.test(attrs)) attrs += ' decoding="async"'

    return `<img${attrs}>`
  })
}
