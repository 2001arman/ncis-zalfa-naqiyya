import { compressImage } from '@/lib/compress-image'

export interface UploadedImage {
  url: string
  publicId: string
}

/** Cloudinary rejects single images above 10MB on the free plan. */
const MAX_BYTES = 10 * 1024 * 1024
/** A stalled upload should surface as an error rather than spin forever. */
const TIMEOUT_MS = 60_000

/** Carries the file it came from, so a batch can report exactly what failed. */
export class ImageUploadError extends Error {
  constructor(
    message: string,
    readonly fileName: string
  ) {
    super(message)
    this.name = 'ImageUploadError'
  }
}

function formatSize(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/** Reads a response as JSON without throwing on an HTML error page. */
async function readJson(response: Response): Promise<Record<string, unknown> | null> {
  try {
    return await response.json()
  } catch {
    return null
  }
}

async function fetchWithTimeout(input: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Compresses a picked file and uploads it straight to Cloudinary using a
 * short-lived signature from /api/upload, so the API secret never reaches the
 * browser. Always throws an ImageUploadError whose message is ready to show
 * the admin as-is.
 */
export async function uploadImage(rawFile: File): Promise<UploadedImage> {
  const name = rawFile.name || 'gambar'
  const fail = (message: string) => new ImageUploadError(message, name)

  if (!rawFile.type.startsWith('image/')) {
    throw fail(`"${name}" bukan berkas gambar. Pilih file JPG, PNG, atau WebP.`)
  }

  // Shrink first: a phone photo is usually well over the limit until resized.
  let file: File
  try {
    file = await compressImage(rawFile)
  } catch {
    file = rawFile
  }

  if (file.size > MAX_BYTES) {
    throw fail(
      `"${name}" berukuran ${formatSize(file.size)}, melebihi batas ${formatSize(MAX_BYTES)}. ` +
        'Perkecil resolusinya lalu coba lagi.'
    )
  }

  // 1. Signature from our own API route.
  let sigRes: Response
  try {
    sigRes = await fetchWithTimeout('/api/upload', { method: 'POST' })
  } catch (error) {
    throw fail(
      (error as Error)?.name === 'AbortError'
        ? `Server tidak merespons saat menyiapkan unggahan "${name}".`
        : `Tidak dapat menghubungi server. Periksa koneksi internet, lalu coba lagi.`
    )
  }

  if (!sigRes.ok) {
    throw fail(
      sigRes.status === 401
        ? 'Sesi login sudah berakhir. Login ulang di tab baru, lalu unggah lagi.'
        : `Gagal meminta izin unggah dari server (HTTP ${sigRes.status}).`
    )
  }

  const signed = await readJson(sigRes)
  const { signature, timestamp, cloudName, apiKey } = (signed ?? {}) as Record<string, string>
  if (!signature || !timestamp || !cloudName || !apiKey) {
    throw fail('Konfigurasi Cloudinary belum lengkap di server. Hubungi pengembang.')
  }

  // 2. Straight to Cloudinary.
  const fd = new FormData()
  fd.append('file', file)
  fd.append('signature', signature)
  fd.append('timestamp', String(timestamp))
  fd.append('api_key', apiKey)
  fd.append('folder', 'zalfa-naqiyya')

  let uploadRes: Response
  try {
    uploadRes = await fetchWithTimeout(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: fd }
    )
  } catch (error) {
    throw fail(
      (error as Error)?.name === 'AbortError'
        ? `Unggahan "${name}" melebihi batas waktu. Coba lagi dengan gambar yang lebih kecil.`
        : `Koneksi ke Cloudinary terputus saat mengunggah "${name}".`
    )
  }

  const data = await readJson(uploadRes)
  const cloudinaryMessage = (data?.error as { message?: string } | undefined)?.message

  if (!uploadRes.ok) {
    throw fail(
      cloudinaryMessage
        ? `Cloudinary menolak "${name}": ${cloudinaryMessage}`
        : `Cloudinary menolak "${name}" (HTTP ${uploadRes.status}).`
    )
  }

  const url = data?.secure_url as string | undefined
  if (!url) {
    throw fail(cloudinaryMessage ?? `Cloudinary tidak mengembalikan alamat gambar untuk "${name}".`)
  }

  return { url, publicId: (data?.public_id as string) ?? '' }
}

/** Normalises anything thrown during an upload into a displayable message. */
export function uploadErrorMessage(error: unknown, fileName?: string): string {
  if (error instanceof ImageUploadError) return error.message
  if (error instanceof Error && error.message) {
    return fileName
      ? `Gagal mengunggah "${fileName}". ${error.message}`
      : `Gagal mengunggah gambar. ${error.message}`
  }
  return fileName ? `Gagal mengunggah "${fileName}".` : 'Gagal mengunggah gambar.'
}
