'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'

interface AdminShellProps {
  children: React.ReactNode
  userName?: string | null
}

export default function AdminShell({ children, userName }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop sidebar (rendered inside Sidebar itself at lg+) */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center px-4 md:px-6 border-b border-surface-dim bg-white gap-3 sticky top-0 z-30">
          {/* Hamburger — mobile only */}
          <button
            id="admin-menu-toggle"
            className="lg:hidden p-2 rounded-lg text-text-muted hover:bg-surface-container transition-colors"
            aria-label="Buka menu navigasi"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo — mobile only */}
          <span className="lg:hidden font-heading font-bold text-base text-primary">
            Zalfa Naqiyya
          </span>

          {/* Welcome text */}
          <p className="text-sm font-body text-text-muted ml-auto">
            Selamat datang,{' '}
            <span className="font-semibold text-text">{userName}</span>
          </p>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
