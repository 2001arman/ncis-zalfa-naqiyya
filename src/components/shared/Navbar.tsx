'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const links = [
  { label: 'Beranda', href: '/' },
  { label: 'Layanan', href: '/layanan' },
  { label: 'Dokumentasi', href: '/dokumentasi' },
  { label: 'Artikel', href: '/artikel' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <nav className="bg-[#FFFDF5]/90 backdrop-blur-md fixed top-0 w-full z-50 border-b border-[#5CB2B2]/10 shadow-[0_4px_20px_-10px_rgba(92,178,178,0.2)]">
        <div className="flex justify-between items-center px-5 py-4 md:px-12 max-w-[1200px] mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5"
            style={{ fontFamily: 'Plus Jakarta Sans' }}
          >
            <img src="/images/logo/logo.webp" alt="Zalfa Naqiyya Psychology Center" className="h-10 md:h-11 w-auto" />
            <span className="hidden sm:block text-lg font-extrabold text-[#5CB2B2] tracking-tight leading-none">Zalfa Naqiyya</span>
          </Link>

          {/* Desktop nav links */}
          <div
            className="hidden md:flex items-center space-x-8 text-sm font-medium"
            style={{ fontFamily: 'Plus Jakarta Sans' }}
          >
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={
                  isActive(l.href)
                    ? 'text-[#5CB2B2] border-b-2 border-[#5CB2B2] pb-1 font-bold hover:scale-105 transition-all duration-300'
                    : 'text-slate-600 hover:text-[#5CB2B2] hover:scale-105 transition-all duration-300'
                }
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              href="/#kontak"
              className="bg-[#5CB2B2] text-white px-6 py-2.5 rounded-[24px] text-sm font-medium hover:scale-105 transition-all duration-300 shadow-lg"
              style={{ fontFamily: 'Plus Jakarta Sans' }}
            >
              Konsultasi Sekarang
            </Link>
          </div>

          {/* Hamburger (mobile only) */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-[#006a6a] hover:bg-[#5CB2B2]/10 transition-colors"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
          >
            <span className="material-symbols-outlined text-3xl">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile menu panel */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-1 px-5 pb-6 pt-2 border-t border-[#5CB2B2]/10 bg-[#FFFDF5]/95">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                  isActive(l.href)
                    ? 'bg-[#5CB2B2]/15 text-[#5CB2B2]'
                    : 'text-slate-600 hover:bg-[#5CB2B2]/10 hover:text-[#5CB2B2]'
                }`}
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/#kontak"
              onClick={() => setMenuOpen(false)}
              className="mt-3 bg-[#5CB2B2] text-white text-center px-6 py-3 rounded-[24px] text-sm font-semibold hover:bg-[#006a6a] transition-colors shadow-md"
              style={{ fontFamily: 'Plus Jakarta Sans' }}
            >
              Konsultasi Sekarang
            </Link>
          </div>
        </div>
      </nav>

      {/* Overlay backdrop (mobile) */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
