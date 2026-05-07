import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinarySignatureResult {
  signature: string
  timestamp: number
  cloudName: string
  apiKey: string
}

/**
 * Generates a signed upload signature so the browser can upload
 * directly to Cloudinary without exposing the API secret.
 */
export async function generateUploadSignature(
  folder = 'zalfa-naqiyya'
): Promise<CloudinarySignatureResult> {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  )

  return {
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
  }
}

export default cloudinary
