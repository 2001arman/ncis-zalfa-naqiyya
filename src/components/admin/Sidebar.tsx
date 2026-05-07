'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Artikel', href: '/dashboard/posts', icon: '✏️' },
  { label: 'Konsultasi', href: '/dashboard/consultations', icon: '📋' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-surface-dim flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-surface-dim">
        <Link href="/dashboard" className="font-heading font-bold text-lg text-primary">
          Zalfa Naqiyya
        </Link>
        <p className="text-xs text-text-muted font-body mt-0.5">Admin Dashboard</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1" aria-label="Admin navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
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
}
