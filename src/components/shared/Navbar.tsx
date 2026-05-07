'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { label: 'Beranda', href: '/' },
  { label: 'Layanan', href: '/layanan' },
  { label: 'Artikel', href: '/artikel' },
]

export default function Navbar() {
  const pathname = usePathname()
  return (
    <nav className="bg-[#FFFDF5]/90 backdrop-blur-md fixed top-0 w-full z-50 border-b border-[#5CB2B2]/10 shadow-[0_4px_20px_-10px_rgba(92,178,178,0.2)]">
      <div className="flex justify-between items-center px-6 py-4 md:px-12 max-w-[1200px] mx-auto">
        <Link href="/" className="text-xl font-extrabold text-[#5CB2B2] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          Zalfa Naqiyya
        </Link>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          {links.map(l => {
            const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href.split('#')[0]) && l.href.split('#')[0] !== '/'
            return (
              <Link key={l.href} href={l.href}
                className={active
                  ? 'text-[#5CB2B2] border-b-2 border-[#5CB2B2] pb-1 font-bold hover:scale-105 transition-all duration-300'
                  : 'text-slate-600 hover:text-[#5CB2B2] hover:scale-105 transition-all duration-300'}>
                {l.label}
              </Link>
            )
          })}
        </div>
        <div className="hidden md:block">
          <Link href="/#kontak" className="bg-[#5CB2B2] text-white px-6 py-2.5 rounded-[24px] text-sm font-medium hover:scale-105 transition-all duration-300 shadow-lg" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Konsultasi Sekarang
          </Link>
        </div>
        <button className="md:hidden text-[#006a6a]">
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
      </div>
    </nav>
  )
}
