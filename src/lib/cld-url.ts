/**
 * Cloudinary delivery URL helpers.
 *
 * A delivery URL looks like:
 *   https://res.cloudinary.com/<cloud>/image/upload/<transforms…>/v123/<public_id>.<ext>
 *
 * Transforms are applied left to right, which matters once crops are involved:
 * a crop must run before the scale-down, or its coordinates address the wrong
 * pixels. Everything here inserts new transforms *after* the existing ones.
 *
 * Client-safe — no Cloudinary SDK import.
 */

const UPLOAD_MARKER = '/image/upload/'

/** A path segment Cloudinary reads as a delivery transform, not part of the id. */
function isTransformSegment(segment: string): boolean {
  return segment.includes(',') || /^[a-z]{1,3}_[^/]+$/.test(segment)
}

interface ParsedCldUrl {
  /** Everything up to and including `/image/upload/`. */
  prefix: string
  /** Delivery transform segments already on the URL, in order. */
  transforms: string[]
  /** Version marker (if any) plus the public id and extension. */
  rest: string
}

function parseCldUrl(url: string): ParsedCldUrl | null {
  const marker = url.indexOf(UPLOAD_MARKER)
  if (marker === -1) return null

  const prefix = url.slice(0, marker + UPLOAD_MARKER.length)
  const segments = url.slice(marker + UPLOAD_MARKER.length).split('/')

  const transforms: string[] = []
  // Never consume the last segment — that is always the public id itself.
  while (segments.length > 1 && isTransformSegment(segments[0])) {
    transforms.push(segments.shift() as string)
  }

  return { prefix, transforms, rest: segments.join('/') }
}

function buildCldUrl({ prefix, transforms, rest }: ParsedCldUrl): string {
  return prefix + [...transforms, rest].join('/')
}

/**
 * Insert Cloudinary delivery transforms into an image URL.
 * Cuts bandwidth (the real cost ceiling) by serving auto format + auto quality
 * at a capped width. Non-Cloudinary URLs (e.g. static /images/*) pass through unchanged.
 */
export function cldUrl(url: string, transform = 'f_auto,q_auto'): string {
  const parsed = parseCldUrl(url)
  if (!parsed) return url
  if (parsed.transforms.includes(transform)) return url

  return buildCldUrl({ ...parsed, transforms: [...parsed.transforms, transform] })
}

/**
 * Appends a crop transform, so cropping is non-destructive — the original asset
 * stays untouched in Cloudinary and repeated crops simply chain.
 */
export function cldWithCrop(url: string, crop: string): string {
  const parsed = parseCldUrl(url)
  if (!parsed) return url

  return buildCldUrl({ ...parsed, transforms: [...parsed.transforms, crop] })
}

/** Strips every crop transform, returning the image to its full frame. */
export function cldWithoutCrop(url: string): string {
  const parsed = parseCldUrl(url)
  if (!parsed) return url

  return buildCldUrl({
    ...parsed,
    transforms: parsed.transforms.filter((t) => !t.includes('c_crop')),
  })
}

/** Whether this URL already carries a crop transform. */
export function cldIsCropped(url: string): boolean {
  const parsed = parseCldUrl(url)
  return !!parsed?.transforms.some((t) => t.includes('c_crop'))
}

/**
 * Recovers the Cloudinary `public_id` from a delivery URL, so assets referenced
 * only inside article HTML can still be destroyed when they're removed.
 * Returns null for anything that isn't a Cloudinary image URL.
 */
export function cldPublicId(url: string): string | null {
  const parsed = parseCldUrl(url)
  if (!parsed) return null

  const segments = parsed.rest.split(/[?#]/)[0].split('/').filter(Boolean)
  // Drop the version marker if one is present.
  if (segments.length > 0 && /^v\d+$/.test(segments[0])) segments.shift()
  if (segments.length === 0) return null

  segments[segments.length - 1] = segments[segments.length - 1].replace(/\.[a-z0-9]+$/i, '')
  return segments.join('/') || null
}

/** Every Cloudinary public_id referenced by an `<img>` inside article HTML. */
export function cldPublicIdsInHtml(html: string): string[] {
  const ids = new Set<string>()
  for (const match of html.matchAll(/<img\b[^>]*?\ssrc=["']([^"']+)["']/gi)) {
    const id = cldPublicId(match[1])
    if (id) ids.add(id)
  }
  return [...ids]
}
