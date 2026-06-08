/**
 * Insert Cloudinary delivery transforms into an image URL.
 * Cuts bandwidth (the real cost ceiling) by serving auto format + auto quality
 * at a capped width. Non-Cloudinary URLs (e.g. static /images/*) pass through unchanged.
 *
 * Client-safe — no Cloudinary SDK import.
 */
export function cldUrl(url: string, transform = 'f_auto,q_auto'): string {
  if (!url || !url.includes('/image/upload/')) return url
  // Avoid double-inserting if a transform is already present right after /upload/.
  if (url.includes(`/image/upload/${transform}/`)) return url
  return url.replace('/image/upload/', `/image/upload/${transform}/`)
}
