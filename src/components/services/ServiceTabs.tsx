'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tab = { id: string; icon: string; label: string }

const TABS: Tab[] = [
  { id: 'psikologi', icon: 'psychology', label: 'Psikologi' },
  { id: 'tpa', icon: 'toys', label: 'TPA' },
  { id: 'kb', icon: 'child_care', label: 'KB' },
  { id: 'tk', icon: 'school', label: 'TK' },
  { id: 'bimbel', icon: 'menu_book', label: 'Bimbel' },
]

// --- Psychology data ---
const ASSESSMENTS: string[] = [
  'Tes Intelegensi (IQ)',
  'Tes Kepribadian',
  'Tes Minat & Bakat',
  'Tes Kesiapan Masuk Sekolah (SD)',
  'Skrining Kesehatan Mental (MHCU)',
  'Skrining Tumbuh Kembang Anak',
  'Asesmen Calon, Promosi, & Evaluasi Karyawan',
]

const COUNSELING = [
  'Konseling Anak & Remaja',
  'Konseling Individu Dewasa',
  'Konseling Pasangan (Pra Nikah, Konflik, dll)',
  'Konseling Keluarga',
  'Konseling Karir & Pendidikan',
]

const KIDS_GROWTH = [
  'Little Seed class — 6–18 bulan',
  'Growing Bud class — 18 bulan – 2,5 tahun',
  'Blooming Kids class — 2,5 – 5 tahun',
]

const SELF_HEALING = ['Workshop', 'Art Therapy', 'Support Group']

const OTHER_SERVICES = [
  'Psikoedukasi (webinar / seminar)',
  'Pelatihan Psikologi individu & institusi (coaching, training, gathering, outbond)',
  'Parenting Class',
  'Kids Activity Event (birthday party, dll)',
  'Collaboration with Brand / Community',
]

// --- Education units (Yayasan Prima Nusantara Jaya) ---
type EduUnit = {
  name: string
  usia: string
  izin?: string[]
  visi: string
  misi: string[]
  tujuan: string[]
  photos?: string[]
}

// Photo strip filtered by category; hidden entirely when there are no photos.
// Includes a "Lihat Semua" button linking to the full documentation page.
function DocSection({ title, photos }: { title: string; photos: string[] }) {
  if (photos.length === 0) return null
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-[#1d1c17]" style={{ fontFamily: 'Plus Jakarta Sans' }}>{title}</h3>
        <Link href="/dokumentasi" className="inline-flex items-center gap-1 text-sm font-semibold text-[#006a6a] hover:text-[#004f50] transition-colors">
          Lihat Semua <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {photos.map((src, i) => (
          <div key={src} className="overflow-hidden rounded-[18px] shadow-md group aspect-[4/3]">
            <img src={src} alt={`${title} ${i + 1}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </div>
  )
}

const SHARED_VISI = 'Terwujudnya generasi berprofil kelulusan yang berorientasi pada cerdas literasi dan inovatif.'

const SHARED_MISI = [
  'Menanamkan nilai-nilai ibadah dan akhlak mulia melalui pembiasaan dalam kegiatan pembelajaran sehari-hari.',
  'Menumbuhkan kecintaan terhadap budaya lokal, menghargai budaya global, dan menghormati perbedaan dalam kegiatan belajar.',
  'Mengembangkan pengetahuan dan keterampilan berpikir tingkat tinggi (HOTS) — menganalisis, mengevaluasi, dan mencipta melalui pembelajaran yang mendorong berpikir kritis, kreatif, kolaboratif, mandiri, dan komunikatif.',
  'Mewujudkan lingkungan sekolah yang sehat dan peduli, dengan menerapkan prinsip PHBS (Perilaku Hidup Bersih dan Sehat), ramah anak, serta peduli terhadap lingkungan.',
  'Menyediakan lingkungan belajar yang kaya literasi, seperti pojok baca, alat peraga edukatif, serta media pembelajaran berbasis gambar dan suara.',
  'Mengintegrasikan pembelajaran yang kreatif dan variatif melalui eksperimen sederhana dan kegiatan seni, untuk merangsang rasa ingin tahu dan imajinasi anak.',
]

const SHARED_TUJUAN = [
  'Terwujudnya generasi yang taat dalam menjalankan kegiatan keagamaan.',
  'Terwujudnya kemitraan yang sinergis antara sekolah dengan orang tua, masyarakat, dan dunia usaha/industri.',
  'Terwujudnya generasi yang mampu berpikir kritis, kreatif, kolaboratif, mandiri, dan komunikatif.',
  'Terwujudnya peserta didik dengan perilaku hidup sehat dan kepedulian terhadap lingkungan sekitar.',
  'Terwujudnya metode pembelajaran literasi yang interaktif, seperti bercerita, bernyanyi, dan bermain peran.',
  'Terwujudnya potensi anak usia dini yang berkembang secara optimal melalui pembelajaran yang kreatif dan menyenangkan.',
]

const EDU_UNITS: Record<string, EduUnit> = {
  tpa: {
    name: 'PAUD - TPA Zalfa Naqiyya (Daycare)',
    usia: '1 – 7 Tahun',
    photos: ['/images/paud/paud-30.webp', '/images/paud/paud-10.webp', '/images/paud/paud-57.webp'],
    visi: 'Terwujudnya layanan pengasuhan dan pendidikan anak usia dini yang aman, nyaman, islami, serta mendukung tumbuh kembang anak secara optimal.',
    misi: [
      'Memberikan layanan pengasuhan yang aman, nyaman, dan penuh kasih sayang.',
      'Menanamkan nilai-nilai agama dan akhlak mulia sejak dini melalui pembiasaan sehari-hari.',
      'Menstimulasi perkembangan motorik, bahasa, sosial emosional, dan kognitif anak sesuai tahap perkembangan.',
      'Menjalin kerja sama yang baik antara lembaga dan orang tua dalam pemantauan tumbuh kembang anak.',
      'Menciptakan lingkungan belajar dan bermain yang sehat, bersih, dan ramah anak.',
    ],
    tujuan: [
      'Terwujudnya anak yang mandiri, aktif, sehat, dan ceria.',
      'Terwujudnya stimulasi tumbuh kembang anak secara optimal sesuai usia perkembangan.',
      'Terwujudnya lingkungan pengasuhan yang aman, nyaman, dan ramah anak.',
      'Terwujudnya pembiasaan perilaku hidup bersih, sehat, dan disiplin sejak dini.',
      'Terwujudnya kerjasama yang harmonis antara lembaga dan orang tua.',
    ],
  },
  kb: {
    name: 'PAUD - KB Zalfa Naqiyya',
    usia: '2 – 4 Tahun',
    izin: ['Terakreditasi B', 'NIS: 00.495.0', 'NSS: 002.64.72.000.006.024', 'NPSN: 69899063'],
    photos: ['/images/paud/paud-55.webp', '/images/paud/paud-20.webp', '/images/paud/paud-40.webp'],
    visi: SHARED_VISI,
    misi: SHARED_MISI,
    tujuan: SHARED_TUJUAN,
  },
  tk: {
    name: 'PAUD - TK Alif Zalfa Naqiyya',
    usia: '4 – 6 Tahun',
    izin: ['NIS: 00.579.0', 'NSS: 002.64.72.050.006.029', 'NPSN: 70060184'],
    photos: ['/images/paud/paud-50.webp', '/images/paud/paud-60.webp', '/images/paud/paud-67.webp'],
    visi: SHARED_VISI,
    misi: SHARED_MISI,
    tujuan: SHARED_TUJUAN,
  },
  bimbel: {
    name: 'Bimbingan Belajar Zalfa Naqiyya',
    usia: '4 – 7 Tahun',
    photos: ['/images/paud/paud-35.webp', '/images/paud/paud-45.webp', '/images/paud/paud-25.webp'],
    visi: 'Terwujudnya peserta didik yang unggul dalam kemampuan akademik, literasi, karakter, dan keterampilan belajar kreatif.',
    misi: [
      'Membantu peserta didik memahami materi pembelajaran sesuai tahap perkembangan dan kebutuhan belajar.',
      'Menumbuhkan motivasi belajar, rasa percaya diri, dan kemandirian akademik peserta didik.',
      'Mengembangkan kemampuan literasi, numerasi, dan berpikir kritis melalui pembelajaran interaktif.',
      'Menyediakan pendampingan belajar yang kreatif, menyenangkan, dan berorientasi pada potensi anak.',
      'Menjalin komunikasi aktif dengan orang tua dalam mendukung perkembangan akademik anak.',
    ],
    tujuan: [
      'Terwujudnya peserta didik yang memiliki kemampuan akademik sesuai tahap perkembangannya.',
      'Terwujudnya peserta didik yang percaya diri dan memiliki motivasi belajar tinggi.',
      'Terwujudnya suasana belajar yang aktif, kreatif, dan menyenangkan.',
      'Terwujudnya peningkatan kemampuan literasi, numerasi, dan pemecahan masalah peserta didik.',
      'Terwujudnya sinergi antara lembaga bimbingan belajar dan orang tua dalam mendukung keberhasilan belajar anak.',
    ],
  },
}

const ctaBtn =
  'w-full bg-[#006a6a] text-white font-semibold text-sm py-3 rounded-[24px] hover:bg-[#5cb2b2] transition-all text-center block shadow-md'

function InfoCard({
  icon,
  title,
  desc,
  items,
  cta,
}: {
  icon: string
  title: string
  desc?: string
  items: string[]
  cta?: string
}) {
  return (
    <div className="bg-white rounded-[24px] p-8 shadow-md relative border border-[#e7e2da] flex flex-col h-full">
      <div className="absolute top-4 right-4 text-[#bc99be]"><span className="material-symbols-outlined text-[32px]">{icon}</span></div>
      <h3 className="text-xl font-semibold text-[#1d1c17] mb-2 pr-8" style={{ fontFamily: 'Plus Jakarta Sans' }}>{title}</h3>
      {desc && <p className="text-[#3e4948] mb-4">{desc}</p>}
      <ul className="flex flex-col gap-3 mb-8">
        {items.map(i => (
          <li key={i} className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[#5cb2b2] text-[20px] mt-0.5">check_circle</span>
            <span className="text-[#3e4948]">{i}</span>
          </li>
        ))}
      </ul>
      <Link href="/#kontak" className={`${ctaBtn} mt-auto`}>{cta ?? 'Hubungi Kami'}</Link>
    </div>
  )
}

function PsikologiPanel({ kgPhotos }: { kgPhotos: string[] }) {
  return (
    <div className="flex flex-col gap-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-[#1d1c17] mb-4 inline-block" style={{ fontFamily: 'Plus Jakarta Sans' }}>Layanan Psikologi</h2>
        <p className="text-lg text-[#3e4948] mt-2">Asesmen psikologis dan konseling untuk memahami kondisi individu secara komprehensif — aspek kognitif, emosional, perilaku, dan sosial.</p>
      </div>

      {/* Psychological Assessment price list */}
      <div className="bg-white rounded-[24px] p-6 md:p-10 shadow-md border border-[#e7e2da]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-[16px] bg-[#B2C9B2] flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-white">assignment</span>
          </div>
          <h3 className="text-2xl font-semibold text-[#1d1c17]" style={{ fontFamily: 'Plus Jakarta Sans' }}>Psychological Assessment</h3>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          {ASSESSMENTS.map(a => (
            <li key={a} className="flex items-start gap-2 py-3 border-b border-[#ece8e0]">
              <span className="material-symbols-outlined text-[#5cb2b2] text-[20px] mt-0.5">check_circle</span>
              <span className="text-[#3e4948] font-medium">{a}</span>
            </li>
          ))}
        </ul>
        <Link href="/#kontak" className={`${ctaBtn} mt-8 md:w-auto md:px-10 md:inline-block`}>Jadwalkan Asesmen</Link>
      </div>

      {/* Counseling, Kids Growth, Self Healing, Other */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InfoCard icon="diversity_3" title="Counseling" desc="Sesi konseling tatap muka maupun daring sesuai kebutuhan Anda." items={COUNSELING} cta="Hubungi Kami" />
        <InfoCard icon="child_care" title="Kids Growth Program" desc="Program stimulasi tumbuh kembang berbasis play-based learning." items={KIDS_GROWTH} cta="Daftar Kids Growth" />
        <InfoCard icon="self_improvement" title="Self Healing Activity" desc="Kegiatan reflektif dan kreatif untuk kesejahteraan mental." items={SELF_HEALING} cta="Hubungi Kami" />
        <InfoCard icon="more_horiz" title="Other Related Services" desc="Layanan edukatif dan kolaboratif dalam konteks yang lebih luas." items={OTHER_SERVICES} cta="Hubungi Kami" />
      </div>

      {/* Kids Growth documentation */}
      <DocSection title="Dokumentasi Kids Growth Program" photos={kgPhotos} />
    </div>
  )
}

function EduPanel({ unit, photos }: { unit: EduUnit; photos: string[] }) {
  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="bg-white rounded-[24px] p-6 md:p-10 shadow-md border border-[#e7e2da]">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1d1c17]" style={{ fontFamily: 'Plus Jakarta Sans' }}>{unit.name}</h2>
          <span className="bg-[#fc758d] text-[#720628] font-semibold text-xs px-3 py-1 rounded-full">Usia {unit.usia}</span>
        </div>
        {unit.izin && (
          <div className="flex flex-wrap gap-2">
            {unit.izin.map(i => (
              <span key={i} className="bg-[#ece8e0] text-[#3e4948] text-xs font-medium px-3 py-1 rounded-full">{i}</span>
            ))}
          </div>
        )}
        {/* Visi */}
        <div className="mt-6 bg-[#F2D086]/20 p-6 rounded-[20px] border-2 border-dashed border-[#F2D086]">
          <h3 className="text-lg font-semibold text-[#1d1c17] mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>Visi</h3>
          <p className="text-[#3e4948] italic">&ldquo;{unit.visi}&rdquo;</p>
        </div>
      </div>

      {/* Misi & Tujuan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {([
          { title: 'Misi', icon: 'flag', items: unit.misi, color: '#006a6a' },
          { title: 'Tujuan', icon: 'emoji_events', items: unit.tujuan, color: '#a7344d' },
        ] as const).map(sec => (
          <div key={sec.title} className="bg-white rounded-[24px] p-8 shadow-md border border-[#e7e2da]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: sec.color }}>
                <span className="material-symbols-outlined text-white text-[20px]">{sec.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-[#1d1c17]" style={{ fontFamily: 'Plus Jakarta Sans' }}>{sec.title}</h3>
            </div>
            <ol className="flex flex-col gap-3">
              {sec.items.map((it, idx) => (
                <li key={it} className="flex gap-3">
                  <span className="text-sm font-bold w-6 h-6 rounded-full bg-[#ece8e0] text-[#3e4948] flex items-center justify-center shrink-0">{idx + 1}</span>
                  <span className="text-[#3e4948] text-sm leading-relaxed">{it}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <DocSection title="Dokumentasi Kegiatan" photos={photos} />

      <div className="text-center">
        <Link href="/#kontak" className="bg-[#006a6a] text-white px-8 py-3 rounded-[24px] text-sm font-semibold hover:bg-[#5cb2b2] transition-all shadow-md inline-flex items-center gap-2">
          Hubungi Kami untuk biaya &amp; pendaftaran <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  )
}

export default function ServiceTabs({ docsByCategory = {} }: { docsByCategory?: Record<string, string[]> }) {
  const [active, setActive] = useState('psikologi')

  // Category-filtered, max 4 per section. Empty → section hidden.
  // TPA/KB/TK fall back to the shared "paud" pool when their own category is empty.
  const PAUD_FALLBACK = ['tpa', 'kb', 'tk']
  const kgPhotos = (docsByCategory['kids-growth'] ?? []).slice(0, 4)
  const eduPhotos = (catId: string) => {
    const own = docsByCategory[catId] ?? []
    if (own.length > 0) return own.slice(0, 4)
    if (PAUD_FALLBACK.includes(catId)) {
      const pool = docsByCategory['paud'] ?? []
      if (pool.length === 0) return []
      // Distinct, non-overlapping slice per tab (wraps if the pool is small).
      const offset = (PAUD_FALLBACK.indexOf(catId) * 4) % pool.length
      return Array.from({ length: Math.min(4, pool.length) }, (_, i) => pool[(offset + i) % pool.length])
    }
    return []
  }

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {/* TABS */}
      <div className="flex justify-center">
        <div className="overflow-x-auto w-full flex justify-center pb-3">
          <div className="bg-[#fef9f1]/85 backdrop-blur-md border border-white/30 py-3 md:py-4 px-4 md:px-6 rounded-full shadow-md flex gap-2 md:gap-4 justify-center min-w-max">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`font-semibold text-xs md:text-sm px-4 md:px-6 py-2 rounded-full transition-all flex items-center gap-1 md:gap-2 ${active === t.id ? 'bg-[#fc758d] text-[#720628]' : 'text-[#3e4948] hover:bg-[#ece8e0]'}`}
              >
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PANEL */}
      {active === 'psikologi' ? <PsikologiPanel kgPhotos={kgPhotos} /> : <EduPanel unit={EDU_UNITS[active]} photos={eduPhotos(active)} />}
    </div>
  )
}
