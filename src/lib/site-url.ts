import { headers } from 'next/headers'

const FALLBACK_HOST = 'www.zalfanaqiyya.com'

/**
 * Builds an absolute URL for the current request.
 *
 * Share targets need a full URL, and reading it from the request headers keeps
 * it correct on the live domain, on Vercel previews, and on localhost without
 * anything to configure.
 */
export async function absoluteUrl(path: string): Promise<string> {
  const headerList = await headers()
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host') ?? FALLBACK_HOST
  const isLocal = /^(localhost|127\.|\[::1\])/.test(host)
  const protocol = headerList.get('x-forwarded-proto') ?? (isLocal ? 'http' : 'https')

  return `${protocol}://${host}${path.startsWith('/') ? path : `/${path}`}`
}
