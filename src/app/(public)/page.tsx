import prisma from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import ConsultationForm from '@/components/forms/ConsultationForm'

export const dynamic = 'force-dynamic'

const FALLBACK_GALLERY = [
  '/images/kids-growth/kg-05.webp',
  '/images/paud/paud-57.webp',
  '/images/kids-growth/kg-08.webp',
  '/images/paud/paud-30.webp',
  '/images/paud/paud-10.webp',
  '/images/kids-growth/kg-20.webp',
  '/images/paud/paud-55.webp',
  '/images/kids-growth/kg-03.webp',
]

export default async function HomePage() {
  const articles = await prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 3 }).catch(() => [])
  const galleryDocs = await prisma.documentation.findMany({ where: { published: true }, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }], take: 8, select: { imageUrl: true } }).catch(() => [])
  const galleryImages = galleryDocs.length > 0 ? galleryDocs.map((d) => d.imageUrl) : FALLBACK_GALLERY

  return (
    <div className="bg-[#FDF8F0] text-[#1d1c17] overflow-x-hidden">

      {/* HERO */}
      <section className="relative flex items-center justify-center pt-10 pb-16 md:pt-12 md:pb-20 px-5 md:px-6 overflow-hidden bg-[#FDF8F0]">
        <div className="absolute top-20 left-10 opacity-40 -rotate-12 pointer-events-none hidden sm:block">
          <span className="material-symbols-outlined text-5xl md:text-6xl text-[#fc758d]">favorite</span>
        </div>
        <div className="absolute bottom-20 right-10 md:right-20 opacity-30 rotate-12 pointer-events-none hidden sm:block">
          <span className="material-symbols-outlined text-6xl md:text-8xl text-[#7fd5d4]">star</span>
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
          <div className="space-y-5 md:space-y-6 max-w-xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#006a6a] relative leading-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Ruang Tumbuh yang{' '}
              <span className="relative inline-block">
                Aman
                <svg className="absolute -bottom-2 left-0 w-full h-4 text-[#fc758d] opacity-60" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <path d="M0 10 Q 50 20 100 10" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>{' '}
              dan Bermakna
            </h1>
            <p className="text-base md:text-lg text-[#3e4948] leading-relaxed">
              Pusat psikologi yang berdedikasi menciptakan lingkungan nyaman bagi anak, remaja, dan keluarga untuk berkembang secara optimal melalui pendekatan holistik dan suportif.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4">
              <a href="https://wa.me/6285148682579" className="bg-[#006a6a] text-white px-6 md:px-8 py-3 md:py-3.5 rounded-[24px] text-sm font-semibold hover:-translate-y-0.5 transition-transform shadow-lg flex items-center gap-2" style={{ fontFamily: 'Inter' }}>
                <span className="material-symbols-outlined fill-icon">forum</span>WhatsApp
              </a>
              <Link href="/#kontak" className="border-2 border-[#006a6a] text-[#006a6a] px-6 md:px-8 py-3 md:py-3.5 rounded-[24px] text-sm font-semibold hover:bg-[#f8f3eb] transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined">edit_calendar</span>Daftar
              </Link>
            </div>
          </div>
          <div className="relative h-[280px] sm:h-[380px] lg:h-[500px] w-full rounded-[32px] md:rounded-[48px] overflow-hidden shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500 bg-[#f2ede5]">
            <img alt="Kegiatan anak Zalfa Naqiyya" className="w-full h-full object-cover" src="/images/paud/paud-55.webp" />
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-12 md:py-20 px-5 md:px-6 bg-[#fef9f1]">
        <div className="max-w-[1200px] mx-auto text-center space-y-10 md:space-y-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[#a7344d] inline-block relative" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Nilai-Nilai Kami
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {[
              { num: '01', bg: '#B2C9B2', icon: 'psychiatry', title: 'Growth', desc: 'Mendukung perkembangan individu secara berkelanjutan', tc: '#004f50' },
              { num: '02', bg: '#F8D4D4', icon: 'favorite', title: 'Empathy', desc: 'Mengedepankan pemahaman dan kepekaan terhadap setiap individu', tc: '#871b37', mt: true },
              { num: '03', bg: '#D8CCE8', icon: 'health_and_safety', title: 'Safe Space', desc: 'Ruang yang aman, nyaman, dan bebas dari penilaian', tc: '#593d5c' },
              { num: '04', bg: '#F2D086', icon: 'auto_awesome', title: 'Meaningful', desc: 'Pengalaman belajar yang relevan dan berdampak', tc: '#1d1c17', mt: true },
              { num: '05', bg: '#B2C9B2', icon: 'all_inclusive', title: 'Holistic', desc: 'Melihat individu secara menyeluruh', tc: '#004f50' },
            ].map(v => (
              <div key={v.num} className={`p-6 rounded-[32px] flex flex-col items-center text-center space-y-4 hover:-translate-y-1 transition-transform duration-300 relative shadow-md ${v.mt ? 'lg:mt-8' : ''}`} style={{ backgroundColor: v.bg }}>
                <span className="absolute top-4 left-4 text-2xl font-bold opacity-30" style={{ color: v.tc }}>{v.num}</span>
                <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center mt-4">
                  <span className="material-symbols-outlined text-3xl" style={{ color: v.tc }}>{v.icon}</span>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: v.tc, fontFamily: 'Plus Jakarta Sans' }}>{v.title}</h3>
                <p className="text-sm opacity-80" style={{ color: v.tc }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="tentang" className="py-12 md:py-20 px-5 md:px-6 bg-white relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative h-[400px] w-full rounded-[40px] overflow-hidden shadow-xl -rotate-2">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <div className="w-16 h-8 bg-[#e7e2da] rounded-full border-4 border-white shadow-sm" />
            </div>
            <img alt="Tentang Zalfa Naqiyya" className="w-full h-full object-cover" src="/images/kids-growth/kg-05.webp" />
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-[#006a6a]" style={{ fontFamily: 'Plus Jakarta Sans' }}>Tentang Kami</h2>
            <p className="text-lg text-[#3e4948] leading-relaxed">Zalfa Naqiyya Psychology Center merupakan layanan biro psikologi yang berfokus pada pengembangan kesehatan mental dan tumbuh kembang individu, khususnya anak dan keluarga. Kami hadir sebagai ruang aman yang mendukung proses tumbuh kembang secara utuh melalui pendekatan yang profesional, empatik, dan berbasis kebutuhan individu. Setiap layanan dirancang untuk memberikan pengalaman yang tidak hanya solutif, tetapi juga bermakna.</p>
            <div className="bg-[#F2D086]/20 p-8 rounded-[32px] border-2 border-[#F2D086] border-dashed relative">
              <span className="material-symbols-outlined absolute -top-5 -left-5 text-4xl text-[#F2D086] bg-white rounded-full p-2">lightbulb</span>
              <h3 className="text-xl font-semibold text-[#1d1c17] mb-3" style={{ fontFamily: 'Plus Jakarta Sans' }}>Visi Kami</h3>
              <p className="text-[#3e4948] italic">&quot;Ruang tumbuh yang aman dan bermakna untuk perkembangan diri yang utuh.&quot;</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-12 md:py-20 px-5 md:px-6 bg-[#fef9f1]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#a7344d] inline-block relative" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Layanan Kami
              <svg className="absolute -bottom-3 left-0 w-full h-4 text-[#bc99be] opacity-50 z-[-1]" preserveAspectRatio="none" viewBox="0 0 100 20"><path d="M0 10 Q 25 0 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="6" /></svg>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: 'assignment', title: 'Psychological Assessment', desc: 'Asesmen psikologis komprehensif meliputi aspek kognitif, emosional, perilaku, dan sosial — dari tes IQ, kepribadian, minat & bakat, hingga skrining tumbuh kembang.', ic: '#B2C9B2', hov: 'hover:bg-[#B2C9B2]/30', rot: '-rotate-3 group-hover:-rotate-6' },
              { icon: 'diversity_3', title: 'Counseling', desc: 'Konseling untuk anak & remaja, individu dewasa, pasangan (pra nikah & konflik), keluarga, serta karir dan pendidikan.', ic: '#D8CCE8', hov: 'hover:bg-[#D8CCE8]/30', rot: 'rotate-3 group-hover:rotate-6' },
              { icon: 'child_care', title: 'Kids Growth Program', desc: 'Program stimulasi tumbuh kembang anak berbasis play-based learning untuk berkembang optimal dalam aspek kognitif, emosional, sosial, motorik, dan perilaku.', ic: '#F2D086', hov: 'hover:bg-[#F2D086]/30', rot: 'rotate-3 group-hover:rotate-6' },
              { icon: 'self_improvement', title: 'Self Healing Activity', desc: 'Kegiatan reflektif dan kreatif — workshop, art therapy, dan support group — untuk menenangkan emosi dan meningkatkan kesejahteraan mental.', ic: '#F8D4D4', hov: 'hover:bg-[#F8D4D4]/30', rot: 'rotate-6 group-hover:rotate-12' },
              { icon: 'more_horiz', title: 'Other Related Services', desc: 'Psikoedukasi, pelatihan psikologi untuk individu & institusi, parenting class, kids activity event, hingga kolaborasi dengan brand & komunitas.', ic: '#B2C9B2', hov: 'hover:bg-[#B2C9B2]/30', rot: '-rotate-6 group-hover:-rotate-12' },
            ].map(s => (
              <div key={s.title} className={`bg-[#ece8e0] rounded-[40px] p-8 shadow-md relative overflow-hidden group ${s.hov} transition-colors duration-300`}>
                <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-[200px]">{s.icon}</span>
                </div>
                <div className="relative z-10 space-y-4">
                  <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center shadow-md ${s.rot} transition-transform`} style={{ backgroundColor: s.ic }}>
                    <span className="material-symbols-outlined text-white text-3xl">{s.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#1d1c17]" style={{ fontFamily: 'Plus Jakarta Sans' }}>{s.title}</h3>
                  <p className="text-[#3e4948]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAM HIGHLIGHT */}
      <section className="py-12 md:py-20 px-5 md:px-6 bg-[#F2D086] relative">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-16">
            <div className="inline-block px-4 py-2 bg-white/40 rounded-full text-sm font-semibold text-[#1d1c17]">Program Unggulan</div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1d1c17]" style={{ fontFamily: 'Plus Jakarta Sans' }}>Kids Growth Program</h2>
            <p className="text-base md:text-lg text-[#3e4948] max-w-2xl mx-auto">Program berbasis play-based learning dengan tiga growth stages: Little Seed (6–18 bln), Growing Bud (18 bln–2,5 thn), dan Blooming Kids (2,5–5 thn).</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {[
              { color: '#006a6a', icon: 'toys', title: 'Growth Stages', tc: 'text-[#006a6a]', items: ['Little Seed (6–18 bln)', 'Growing Bud (18 bln–2,5 thn)', 'Blooming Kids (2,5–5 thn)'], mt: 'sm:mt-12' },
              { color: '#a7344d', icon: 'psychology', title: 'Aspek Perkembangan', tc: 'text-[#a7344d]', items: ['Kognitif & Bahasa', 'Emosi & Sosial', 'Motorik & Perilaku'], mt: 'sm:-mt-4' },
              { color: '#725475', icon: 'flag', title: 'Pendekatan', tc: 'text-[#725475]', items: ['Play-based Learning', 'Pengalaman Menyenangkan', 'Bermakna & Optimal'], mt: 'sm:mt-12' },
            ].map(c => (
              <div key={c.title} className={`bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[32px] shadow-md relative ${c.mt}`}>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-[#F2D086]" style={{ backgroundColor: c.color }}>
                  <span className="material-symbols-outlined text-white text-xl">{c.icon}</span>
                </div>
                <h3 className={`text-xl font-semibold text-center mt-4 mb-4 ${c.tc}`} style={{ fontFamily: 'Plus Jakarta Sans' }}>{c.title}</h3>
                <ul className="space-y-3 text-[#3e4948]">
                  {c.items.map(i => <li key={i} className="flex items-start gap-2"><span className="material-symbols-outlined text-[#bc99be]">check_circle</span>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 md:mt-12">
            <Link href="/#kontak" className="bg-[#006a6a] text-white px-6 md:px-8 py-3 md:py-4 rounded-[24px] text-base md:text-xl font-semibold hover:bg-[#004f50] transition-colors shadow-lg inline-flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Jadwalkan Sesi Kids Growth <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="py-12 md:py-20 px-5 md:px-6 bg-[#fef9f1]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-end mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#006a6a]" style={{ fontFamily: 'Plus Jakarta Sans' }}>Artikel &amp; Jurnal</h2>
            <Link href="/artikel" className="flex items-center gap-1 text-xs md:text-sm font-semibold text-[#006a6a] hover:text-[#004f50]">
              Lihat Semua <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map((a) => (
                <Link key={a.id} href={`/artikel/${a.slug}`} className="bg-white rounded-[32px] overflow-hidden shadow-md group cursor-pointer border border-[#ece8e0] hover:-translate-y-1 transition-transform duration-300">
                  {a.coverImage && <div className="h-48 overflow-hidden"><img src={a.coverImage} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>}
                  <div className="p-6 space-y-3">
                    <span className="px-3 py-1 bg-[#D8CCE8] text-[#593d5c] text-xs font-bold rounded-full">Psikologi</span>
                    <h3 className="text-xl font-semibold text-[#1d1c17] line-clamp-2 group-hover:text-[#006a6a] transition-colors" style={{ fontFamily: 'Plus Jakarta Sans' }}>{a.title}</h3>
                    {a.excerpt && <p className="text-[#3e4948] line-clamp-2 text-sm">{a.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { tag: 'Self-Healing', title: 'Pentingnya Menciptakan "Ruang Aman" bagi Tumbuh Kembang Anak', desc: 'Lingkungan yang suportif sangat krusial dalam membentuk resiliensi mental anak sejak dini.', tagBg: 'bg-[#D8CCE8]', tagTc: 'text-[#593d5c]', img: '/images/kids-growth/kg-20.webp' },
                { tag: 'Kids Growth', title: 'Mengenal Terapi Bermain: Solusi Ceria Atasi Kecemasan Anak', desc: 'Bermain bukan sekadar hiburan, melainkan bahasa natural anak dalam mengekspresikan emosi.', tagBg: 'bg-[#F2D086]', tagTc: 'text-[#1d1c17]', img: '/images/kids-growth/kg-08.webp' },
                { tag: 'Tips Psikologi', title: 'Teknik Sederhana Manajemen Stres untuk Orang Tua Milenial', desc: 'Menjaga kewarasan orang tua adalah langkah pertama sebelum mendampingi anak bertumbuh.', tagBg: 'bg-[#B2C9B2]', tagTc: 'text-[#004f50]', img: '/images/paud/paud-57.webp' },
              ].map(a => (
                <div key={a.title} className="bg-white rounded-[32px] overflow-hidden shadow-md group cursor-pointer border border-[#ece8e0]">
                  <div className="h-48 overflow-hidden"><img alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={a.img} /></div>
                  <div className="p-6 space-y-3">
                    <span className={`px-3 py-1 ${a.tagBg} ${a.tagTc} text-xs font-bold rounded-full`}>{a.tag}</span>
                    <h3 className="text-xl font-semibold text-[#1d1c17] line-clamp-2 group-hover:text-[#006a6a] transition-colors" style={{ fontFamily: 'Plus Jakarta Sans' }}>{a.title}</h3>
                    <p className="text-[#3e4948] line-clamp-2 text-sm">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-12 md:py-20 px-5 md:px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-[#a7344d] inline-block relative" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Galeri Kegiatan
              <svg className="absolute -bottom-3 left-0 w-full h-4 text-[#F2D086] opacity-60 z-[-1]" preserveAspectRatio="none" viewBox="0 0 100 20"><path d="M0 10 Q 25 0 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="6" /></svg>
            </h2>
            <p className="text-[#3e4948] mt-4 max-w-2xl mx-auto">Momen tumbuh kembang dan keceriaan anak-anak dalam program Kids Growth serta PAUD Zalfa Naqiyya.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {galleryImages.map((src, i) => (
              <div key={src} className="overflow-hidden rounded-[20px] md:rounded-[28px] shadow-md group aspect-square">
                <img src={src} alt={`Galeri kegiatan ${i + 1}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / REGISTRATION */}
      <section id="kontak" className="py-12 md:py-20 px-5 md:px-6 bg-[#B2C9B2]/20 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto mt-6 md:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
            <div className="lg:col-span-3 bg-white p-6 md:p-12 rounded-[32px] md:rounded-[40px] shadow-md relative">
              <div className="absolute top-8 right-8 opacity-20 pointer-events-none">
                <span className="material-symbols-outlined text-5xl text-[#006a6a]">edit_document</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#006a6a] mb-6 md:mb-8" style={{ fontFamily: 'Plus Jakarta Sans' }}>Daftar Sesi Konsultasi</h2>
              <ConsultationForm />
            </div>
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-[#006a6a] p-8 rounded-[40px] shadow-md text-white relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
                <div className="absolute top-10 -left-10 w-20 h-20 bg-white/10 rounded-full blur-lg" />
                <h3 className="text-xl font-semibold mb-6 relative z-10" style={{ fontFamily: 'Plus Jakarta Sans' }}>Hubungi Kami</h3>
                <div className="space-y-6 relative z-10">
                  {[
                    { icon: 'location_on', label: 'Alamat', val: 'Jl. A. Wahab Syahrani Gg. Kejaksaan No. 27 RT. 35, Samarinda', href: undefined },
                    { icon: 'chat', label: 'WhatsApp', val: '+62 851-4868-2579', href: 'https://wa.me/6285148682579' },
                    { icon: 'alternate_email', label: 'Instagram', val: '@zalfanaqiyya.psy', href: 'https://instagram.com/zalfanaqiyya.psy' },
                  ].map(c => {
                    const Inner = (
                      <>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-white">{c.icon}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold mb-1">{c.label}</h4>
                          <p className="text-white/80 text-sm whitespace-pre-line">{c.val}</p>
                        </div>
                      </>
                    )
                    return c.href ? (
                      <a key={c.label} href={c.href} className="flex gap-4 items-start hover:opacity-90 transition-opacity">{Inner}</a>
                    ) : (
                      <div key={c.label} className="flex gap-4 items-start">{Inner}</div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING WA */}
      <a href="https://wa.me/6285148682579" className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 group flex items-center">
        <div className="absolute right-full mr-4 bg-white px-4 py-2 rounded-full shadow-lg text-[#006a6a] text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Konsultasi via WhatsApp
        </div>
        <div className="w-13 h-13 md:w-16 md:h-16 bg-[#25D366] rounded-full text-white flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] relative hover:scale-110 transition-transform duration-300">
          <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-40" />
          <svg className="w-8 h-8 fill-current relative z-10"
            width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 15H15V12.5H5V15V15M5 11.25H20V8.75H5V11.25V11.25M5 7.5H20V5H5V7.5V7.5M0 25V2.5C0 1.8125 0.244792 1.22396 0.734375 0.734375C1.22396 0.244792 1.8125 0 2.5 0H22.5C23.1875 0 23.776 0.244792 24.2656 0.734375C24.7552 1.22396 25 1.8125 25 2.5V17.5C25 18.1875 24.7552 18.776 24.2656 19.2656C23.776 19.7552 23.1875 20 22.5 20H5L0 25V25M3.9375 17.5H22.5V17.5V17.5V2.5V2.5V2.5H2.5V2.5V2.5V18.9062L3.9375 17.5V17.5M2.5 17.5V17.5V2.5V2.5V2.5V2.5V2.5V2.5V17.5V17.5V17.5V17.5V17.5" fill="white" />
          </svg>
        </div>
      </a>
    </div>
  )
}
