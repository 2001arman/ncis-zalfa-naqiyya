import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#5CB2B2] text-white text-sm leading-relaxed w-full rounded-t-[48px] mt-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 px-6 py-12 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="text-2xl font-black italic">Zalfa Naqiyya</div>
        </div>
        <div>
          <p className="max-w-md text-teal-50/90 text-sm text-justify" style={{ fontFamily: 'Inter' }}>
            Pusat Psikologi yang berdedikasi menyediakan ruang aman untuk setiap individu bertumbuh, berdaya, dan menemukan kembali keseimbangan mental mereka melalui pendekatan holistik dan penuh empati.
          </p>
        </div>
      </div>
      <div className="border-t border-white/20 px-6 py-6 text-center">
        <p className="text-teal-50/70 text-xs" style={{ fontFamily: 'Inter' }}>© 2026 Zalfa Naqiyya Psychology Center. Ruang aman untuk bertumbuh dan berdaya.</p>
      </div>
    </footer>
  )
}

