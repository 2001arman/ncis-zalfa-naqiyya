'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Artikel', href: '/dashboard/posts', icon: '✏️' },
  { label: 'Dokumentasi', href: '/dashboard/documentation', icon: '🖼️' },
  { label: 'Konsultasi', href: '/dashboard/consultations', icon: '📋' },
]

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  const content = (
    <aside className="w-64 h-full bg-white border-r border-surface-dim flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-surface-dim flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="font-heading font-bold text-lg text-primary" onClick={onClose}>
            Zalfa Naqiyya
          </Link>
          <p className="text-xs text-text-muted font-body mt-0.5">Admin Dashboard</p>
        </div>
        {/* Close button (mobile only) */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-text-muted hover:bg-surface-container transition-colors"
            aria-label="Tutup sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1" aria-label="Admin navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-muted hover:bg-surface-container hover:text-text'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer links */}
      <div className="px-3 py-4 border-t border-surface-dim flex flex-col gap-1">
        <Link
          href="/"
          target="_blank"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-text-muted hover:bg-surface-container hover:text-text transition-colors"
        >
          <span>🌐</span> Lihat Website
        </Link>
        <button
          id="sidebar-logout"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-text-muted hover:bg-secondary/10 hover:text-secondary transition-colors w-full text-left"
        >
          <span>🚪</span> Keluar
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop: static sidebar */}
      <div className="hidden lg:flex h-screen sticky top-0">
        {content}
      </div>

      {/* Mobile: drawer overlay */}
      {open !== undefined && (
        <>
          {/* Backdrop */}
          <div
            className={cn(
              'lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300',
              open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            )}
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div
            className={cn(
              'lg:hidden fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out',
              open ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            {content}
          </div>
        </>
      )}
    </>
  )
}
