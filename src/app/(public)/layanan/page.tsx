import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Layanan & Harga – Zalfa Naqiyya' }

export default function LayananPage() {
  return (
    <div className="bg-[#fef9f1] text-[#1d1c17] overflow-x-hidden min-h-screen">

      {/* HERO */}
      <section className="relative bg-[#006a6a] text-white pt-20 md:pt-24 pb-24 md:pb-32 px-5 md:px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-10 left-10 opacity-20 -rotate-12 hidden md:block"><span className="material-symbols-outlined text-[100px]">edit</span></div>
        <div className="absolute top-20 right-20 opacity-20 rotate-12 hidden md:block"><span className="material-symbols-outlined text-[80px]">favorite</span></div>
        <div className="max-w-3xl relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6" style={{ fontFamily: 'Plus Jakarta Sans' }}>Layanan &amp; Harga</h1>
          <p className="text-base md:text-lg text-[#7fd5d4] max-w-2xl mx-auto">Pilih layanan terbaik untuk mendukung perkembangan optimal dan kesejahteraan mental keluarga Anda. Kami menawarkan pendekatan yang personal dan penuh empati.</p>
        </div>
      </section>

      {/* MAIN */}
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-5 md:px-6 py-12 md:py-20 flex flex-col gap-12 md:gap-20 relative z-10 -mt-8 md:-mt-12" style={{ backgroundImage: 'radial-gradient(rgba(92,178,178,0.1) 2px, transparent 2px)', backgroundSize: '30px 30px' }}>

        {/* TABS */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="overflow-x-auto w-full flex justify-center">
            <div className="bg-[#fef9f1]/85 backdrop-blur-md border border-white/30 py-3 md:py-4 px-4 md:px-6 rounded-full shadow-md flex gap-2 md:gap-4 justify-center min-w-max">
              {[{ icon: 'psychology', label: 'Psikologi', active: true }, { icon: 'child_care', label: 'KB' }, { icon: 'school', label: 'TK' }, { icon: 'toys', label: 'TPA' }].map(t => (
                <button key={t.label} className={`font-semibold text-xs md:text-sm px-4 md:px-6 py-2 rounded-full transition-all flex items-center gap-1 md:gap-2 ${t.active ? 'bg-[#fc758d] text-[#720628]' : 'text-[#3e4948] hover:bg-[#ece8e0]'}`}>
                  <span className="material-symbols-outlined text-[18px] md:text-[20px]">{t.icon}</span>{t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PSIKOLOGI */}
        <section className="flex flex-col gap-12">
          <div className="text-center max-w-2xl mx-auto relative">
            <div className="absolute -top-6 -left-8 text-[#725475] opacity-50 -rotate-12"><span className="material-symbols-outlined text-[40px]">auto_awesome</span></div>
            <h2 className="text-3xl font-bold text-[#1d1c17] mb-4 scribble-underline inline-block" style={{ fontFamily: 'Plus Jakarta Sans' }}>Layanan Psikologi</h2>
            <p className="text-lg text-[#3e4948] mt-4">Sesi konsultasi dan asesmen komprehensif yang dirancang untuk membantu Anda dan buah hati menemukan kembali keseimbangan emosional.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-[24px] p-8 shadow-md relative border border-[#e7e2da] flex flex-col h-full hover:-translate-y-2 transition-transform">
              <div className="absolute top-4 right-4 text-[#bc99be]"><span className="material-symbols-outlined text-[32px]">groups</span></div>
              <h3 className="text-xl font-semibold text-[#1d1c17] mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>Konseling Individu</h3>
              <p className="text-[#3e4948] mb-6 flex-grow">Pendekatan empatik satu lawan satu untuk mengatasi kecemasan, stres, dan tantangan personal.</p>
              <div className="text-[#006a6a] text-3xl font-bold mb-6">Rp 350.000<span className="text-base font-normal text-[#3e4948]">/sesi</span></div>
              <ul className="flex flex-col gap-3 mb-8">
                {['Sesi 60 menit', 'Laporan ringkas'].map(i => <li key={i} className="flex items-start gap-2"><span className="material-symbols-outlined text-[#5cb2b2] text-[20px] mt-1">check_circle</span><span className="text-[#3e4948]">{i}</span></li>)}
              </ul>
              <Link href="/#kontak" className="w-full bg-[#ece8e0] text-[#1d1c17] border-2 border-[#006a6a] font-semibold text-sm py-3 rounded-[24px] hover:bg-[#5cb2b2] hover:text-white hover:border-[#5cb2b2] transition-all mt-auto text-center block">Pilih Layanan</Link>
            </div>
            {/* Card 2 POPULAR */}
            <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-md relative border-2 border-[#fc758d] flex flex-col h-full md:scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#fc758d] text-[#720628] font-semibold text-sm px-4 py-1 rounded-full shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">star</span> POPULAR
              </div>
              <div className="absolute -top-8 right-4 text-[#fc758d] rotate-45"><span className="material-symbols-outlined text-[40px]">push_pin</span></div>
              <h3 className="text-xl font-semibold text-[#1d1c17] mb-2 mt-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>Asesmen Anak</h3>
              <p className="text-[#3e4948] mb-6 flex-grow">Evaluasi mendalam mengenai kesiapan sekolah, minat bakat, dan deteksi dini tumbuh kembang.</p>
              <div className="text-[#006a6a] text-3xl font-bold mb-6">Rp 750.000<span className="text-base font-normal text-[#3e4948]">/paket</span></div>
              <ul className="flex flex-col gap-3 mb-8">
                {['Tes Psikologi Lengkap', 'Konsultasi Hasil (45 mnt)', 'Laporan Tertulis Detail'].map(i => <li key={i} className="flex items-start gap-2"><span className="material-symbols-outlined text-[#5cb2b2] text-[20px] mt-1">check_circle</span><span className="text-[#3e4948]">{i}</span></li>)}
              </ul>
              <Link href="/#kontak" className="w-full bg-[#006a6a] text-white font-semibold text-sm py-3 rounded-[24px] hover:bg-[#5cb2b2] transition-all mt-auto text-center block shadow-md">Pilih Layanan</Link>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-[24px] p-8 shadow-md relative border border-[#e7e2da] flex flex-col h-full hover:-translate-y-2 transition-transform">
              <div className="absolute top-4 right-4 text-[#bc99be]"><span className="material-symbols-outlined text-[32px]">family_restroom</span></div>
              <h3 className="text-xl font-semibold text-[#1d1c17] mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>Konseling Keluarga</h3>
              <p className="text-[#3e4948] mb-6 flex-grow">Ruang aman untuk memfasilitasi komunikasi yang sehat dan resolusi konflik antar anggota keluarga.</p>
              <div className="text-[#006a6a] text-3xl font-bold mb-6">Rp 500.000<span className="text-base font-normal text-[#3e4948]">/sesi</span></div>
              <ul className="flex flex-col gap-3 mb-8">
                {['Sesi 90 menit', 'Max 4 anggota keluarga'].map(i => <li key={i} className="flex items-start gap-2"><span className="material-symbols-outlined text-[#5cb2b2] text-[20px] mt-1">check_circle</span><span className="text-[#3e4948]">{i}</span></li>)}
              </ul>
              <Link href="/#kontak" className="w-full bg-[#ece8e0] text-[#1d1c17] border-2 border-[#006a6a] font-semibold text-sm py-3 rounded-[24px] hover:bg-[#5cb2b2] hover:text-white hover:border-[#5cb2b2] transition-all mt-auto text-center block">Pilih Layanan</Link>
            </div>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="w-full flex justify-center py-8 opacity-40">
          <svg fill="none" height="20" viewBox="0 0 200 20" width="200" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10 Q 25 20, 50 10 T 95 10 T 140 10 T 195 10" stroke="#006a6a" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>

        {/* TPA */}
        <section className="flex flex-col gap-12">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/3 relative mb-10 md:mb-0">
              <img alt="Fasilitas TPA" className="w-full aspect-square object-cover rounded-[24px] shadow-md" src="https://images.pexels.com/photos/1250452/pexels-photo-1250452.jpeg" />
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-[#bc99be] rounded-full w-16 h-16 md:w-24 md:h-24 flex items-center justify-center shadow-md rotate-12">
                <span className="material-symbols-outlined text-[#4c314f] text-[28px] md:text-[40px]">toys_and_games</span>
              </div>
            </div>
            <div className="w-full md:w-2/3 flex flex-col gap-6">
              <div>
                <h2 className="text-3xl font-bold text-[#1d1c17] mb-2 scribble-underline inline-block" style={{ fontFamily: 'Plus Jakarta Sans' }}>TPA (Daycare)</h2>
                <p className="text-lg text-[#3e4948] mt-4">Lingkungan pengasuhan yang aman, penuh kasih, dan stimulatif layaknya di rumah sendiri, memberikan ketenangan bagi orang tua yang bekerja.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Half Day */}
                <div className="bg-white rounded-[24px] p-6 shadow-md border border-[#e7e2da] flex flex-col">
                  <h3 className="text-xl font-semibold text-[#1d1c17] mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>Half Day</h3>
                  <div className="text-[#006a6a] text-3xl font-bold mb-4">Rp 1.500.000<span className="text-base font-normal text-[#3e4948]">/bln</span></div>
                  <ul className="flex flex-col gap-2 mb-6">
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[#5cb2b2] text-[20px]">schedule</span><span className="text-[#3e4948]">07:00 - 13:00</span></li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[#5cb2b2] text-[20px]">restaurant</span><span className="text-[#3e4948]">1x Makan Siang, 1x Snack</span></li>
                  </ul>
                  <Link href="/#kontak" className="mt-auto w-full bg-[#ece8e0] text-[#1d1c17] border-2 border-[#006a6a] font-semibold text-sm py-2 rounded-[24px] hover:bg-[#5cb2b2] hover:text-white transition-all text-center block">Pilih</Link>
                </div>
                {/* Full Day */}
                <div className="bg-white rounded-[24px] p-6 shadow-md border-2 border-[#5cb2b2] flex flex-col relative">
                  <div className="absolute -top-3 right-4 bg-[#5cb2b2] text-[#004242] font-bold text-xs px-3 py-1 rounded-full shadow-sm">BEST VALUE</div>
                  <h3 className="text-xl font-semibold text-[#1d1c17] mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>Full Day</h3>
                  <div className="text-[#006a6a] text-3xl font-bold mb-4">Rp 2.200.000<span className="text-base font-normal text-[#3e4948]">/bln</span></div>
                  <ul className="flex flex-col gap-2 mb-6">
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[#5cb2b2] text-[20px]">schedule</span><span className="text-[#3e4948]">07:00 - 17:00</span></li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[#5cb2b2] text-[20px]">restaurant</span><span className="text-[#3e4948]">2x Makan, 2x Snack</span></li>
                    <li className="flex items-start gap-2"><span className="material-symbols-outlined text-[#5cb2b2] text-[20px]">bed</span><span className="text-[#3e4948]">Fasilitas Tidur Siang</span></li>
                  </ul>
                  <Link href="/#kontak" className="mt-auto w-full bg-[#006a6a] text-white font-semibold text-sm py-2 rounded-[24px] hover:bg-[#5cb2b2] transition-all text-center block">Pilih</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
