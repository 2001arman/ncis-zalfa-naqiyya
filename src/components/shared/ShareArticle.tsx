'use client'

import { useEffect, useState } from 'react'

interface ShareArticleProps {
  url: string
  title: string
  /** Cover image, used by Pinterest as the pinned media. */
  image?: string
}

interface ShareTarget {
  name: string
  href: string
  /** Brand colour for the button. */
  color: string
  path: string
}

function buildTargets(url: string, title: string, image?: string): ShareTarget[] {
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)

  const targets: ShareTarget[] = [
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      color: '#1877F2',
      path: 'M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5Z',
    },
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
      color: '#0F1419',
      path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933Zm-1.29 19.5h2.039L6.486 3.24H4.298l13.313 17.413Z',
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      color: '#0A66C2',
      path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0Z',
    },
    {
      name: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${t}%20${u}`,
      color: '#25D366',
      path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z',
    },
  ]

  targets.push({
    name: 'Pinterest',
    href:
      `https://pinterest.com/pin/create/button/?url=${u}&description=${t}` +
      (image ? `&media=${encodeURIComponent(image)}` : ''),
    color: '#E60023',
    path: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0Z',
  })

  return targets
}

/** Opens a share dialog in a small centred window instead of a full tab. */
function openPopup(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
  // Let modifier-clicks and middle-clicks behave like a normal link.
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return

  const width = 620
  const height = 640
  const left = window.screenX + (window.outerWidth - width) / 2
  const top = window.screenY + (window.outerHeight - height) / 2
  const popup = window.open(
    href,
    'share',
    `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`
  )
  if (popup) event.preventDefault()
}

export default function ShareArticle({ url, title, image }: ShareArticleProps) {
  const [copied, setCopied] = useState(false)
  const [canShareNatively, setCanShareNatively] = useState(false)

  // Checked after mount: reading navigator during render would desync SSR.
  useEffect(() => {
    setCanShareNatively(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      // Clipboard is blocked outside a secure context — fall back to a prompt.
      window.prompt('Salin tautan artikel ini:', url)
    }
  }

  async function shareNatively() {
    try {
      await navigator.share({ title, url })
    } catch {
      // The user dismissed the sheet; nothing to report.
    }
  }

  const circle =
    'w-12 h-12 rounded-full flex items-center justify-center text-white shadow-[0_6px_16px_-8px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5CB2B2]'

  return (
    <section className="mt-12 pt-8 border-t border-[#bfc9c3]/30">
      <h2
        className="text-[18px] font-bold text-[#2b6955] mb-4"
        style={{ fontFamily: 'Plus Jakarta Sans' }}
      >
        Bagikan artikel ini
      </h2>

      <div className="flex flex-wrap items-center gap-3">
        {buildTargets(url, title, image).map((target) => (
          <a
            key={target.name}
            href={target.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => openPopup(e, target.href)}
            aria-label={`Bagikan ke ${target.name}`}
            title={`Bagikan ke ${target.name}`}
            className={circle}
            style={{ backgroundColor: target.color }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path d={target.path} />
            </svg>
          </a>
        ))}

        <button
          type="button"
          onClick={copyLink}
          aria-label="Salin tautan artikel"
          title="Salin tautan"
          className={`${circle} bg-[#5CB2B2]`}
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
            {copied ? 'check' : 'link'}
          </span>
        </button>

        {canShareNatively && (
          <button
            type="button"
            onClick={shareNatively}
            aria-label="Bagikan lewat aplikasi lain"
            title="Bagikan lainnya"
            className={`${circle} bg-[#F26D85]`}
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              share
            </span>
          </button>
        )}

        <span
          role="status"
          aria-live="polite"
          className={`text-[13px] text-[#2b6955] font-medium transition-opacity duration-200 ${
            copied ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ fontFamily: 'Inter' }}
        >
          Tautan tersalin
        </span>
      </div>
    </section>
  )
}
