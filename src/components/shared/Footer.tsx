export default function Footer() {
  return (
    <footer className="bg-[#5CB2B2] text-white text-sm leading-relaxed w-full rounded-t-[48px] mt-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-6 py-12 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="bg-white/95 rounded-2xl p-3 inline-block shadow-sm">
            <img src="/images/logo/logo.webp" alt="Zalfa Naqiyya Psychology Center" className="h-16 w-auto" />
          </div>
          <div className="text-2xl font-black italic">Zalfa Naqiyya</div>
          <p className="text-teal-50/80 text-xs" style={{ fontFamily: 'Inter' }}>Bagian dari Yayasan Prima Nusantara Jaya</p>
        </div>
        <div>
          <p className="max-w-md text-teal-50/90 text-sm text-justify" style={{ fontFamily: 'Inter' }}>
            Biro psikologi yang berfokus pada pengembangan kesehatan mental dan tumbuh kembang individu, khususnya anak dan keluarga, melalui pendekatan yang profesional, empatik, dan berbasis kebutuhan individu.
          </p>
        </div>
        <div className="space-y-3 text-teal-50/90 text-sm" style={{ fontFamily: 'Inter' }}>
          <div className="flex gap-2 items-start">
            <span className="material-symbols-outlined text-[20px] shrink-0">location_on</span>
            <span>Jl. A. Wahab Syahrani Gg. Kejaksaan No. 27 RT. 35, Samarinda</span>
          </div>
          <a href="https://wa.me/6285148682579" className="flex gap-2 items-center hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px] shrink-0">chat</span>
            <span>+62 851-4868-2579</span>
          </a>
          <a href="https://instagram.com/zalfanaqiyya.psy" className="flex gap-2 items-center hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px] shrink-0">alternate_email</span>
            <span>@zalfanaqiyya.psy</span>
          </a>
        </div>
      </div>
      <div className="border-t border-white/20 px-6 py-6 text-center">
        <p className="text-teal-50/70 text-xs" style={{ fontFamily: 'Inter' }}>© 2026 Zalfa Naqiyya Psychology Center. Ruang aman untuk bertumbuh dan berdaya.</p>
      </div>
    </footer>
  )
}

