/**
 * Client-side image compression before upload.
 * Downscales to maxDim and re-encodes as WebP — caps upload size (avoids
 * Cloudinary's ~10MB single-image limit), trims storage, speeds uploads.
 *
 * Falls back to the original file if the browser can't decode it (e.g. HEIC on
 * some browsers) — the caller should still handle upload normally.
 */
export async function compressImage(
  file: File,
  { maxDim = 1600, quality = 0.8 }: { maxDim?: number; quality?: number } = {}
): Promise<File> {
  if (!file.type.startsWith('image/')) return file

  try {
    const bitmap = await createImageBitmap(file)
    let { width, height } = bitmap

    if (Math.max(width, height) > maxDim) {
      const scale = maxDim / Math.max(width, height)
      width = Math.round(width * scale)
      height = Math.round(height * scale)
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close?.()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality)
    )
    if (!blob || blob.size >= file.size) return file // no gain → keep original

    return new File([blob], file.name.replace(/\.\w+$/, '.webp'), { type: 'image/webp' })
  } catch {
    return file
  }
}
