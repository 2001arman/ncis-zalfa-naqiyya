'use client'

import Link from 'next/link'
import { useState } from 'react'
import Button from '@/components/ui/Button'

const navItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Layanan & Harga', href: '/layanan' },
  { label: 'Artikel', href: '/artikel' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-surface-dim">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-heading font-bold text-xl text-primary tracking-tight"
          >
            Zalfa Naqiyya
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-body font-medium text-text-muted hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="hidden md:inline-flex"
              onClick={() =>
                document
                  .getElementById('consultation')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Konsultasi Gratis
            </Button>

            {/* Hamburger */}
            <button
              id="mobile-menu-toggle"
              className="md:hidden p-2 rounded-lg text-text-muted hover:text-primary hover:bg-surface-container transition-colors"
              aria-label="Toggle navigation menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav
            className="md:hidden pb-4 flex flex-col gap-2 border-t border-surface-dim mt-2 pt-4"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-2 py-2 rounded-lg text-sm font-body font-medium text-text-muted hover:text-primary hover:bg-surface-container transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button
              size="sm"
              className="mt-2 w-full"
              onClick={() => {
                setMenuOpen(false)
                document
                  .getElementById('consultation')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Konsultasi Gratis
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
