import { compressImage } from '@/lib/compress-image'

export interface UploadedImage {
  url: string
  publicId: string
}

/**
 * Compresses a picked file and uploads it straight to Cloudinary using a
 * short-lived signature from /api/upload, so the API secret never reaches the
 * browser. Throws with an Indonesian message ready to show the admin.
 */
export async function uploadImage(rawFile: File): Promise<UploadedImage> {
  const file = await compressImage(rawFile)

  const sigRes = await fetch('/api/upload', { method: 'POST' })
  if (!sigRes.ok) {
    throw new Error(
      sigRes.status === 401
        ? 'Sesi login sudah berakhir. Login ulang lalu coba lagi.'
        : `Gagal meminta izin unggah (HTTP ${sigRes.status}).`
    )
  }
  const { signature, timestamp, cloudName, apiKey } = await sigRes.json()

  const fd = new FormData()
  fd.append('file', file)
  fd.append('signature', signature)
  fd.append('timestamp', timestamp.toString())
  fd.append('api_key', apiKey)
  fd.append('folder', 'zalfa-naqiyya')

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: fd,
  })
  const data = await uploadRes.json()

  if (!data.secure_url) {
    throw new Error(data?.error?.message ?? 'Cloudinary menolak gambar ini.')
  }

  return { url: data.secure_url, publicId: data.public_id ?? '' }
}
