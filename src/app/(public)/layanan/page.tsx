import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import ServiceTabs from '@/components/services/ServiceTabs'

export const metadata: Metadata = { title: 'Layanan & Harga – Zalfa Naqiyya' }

export const dynamic = 'force-dynamic'

export default async function LayananPage() {
  const docs = await prisma.documentation
    .findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      select: { imageUrl: true, category: true },
    })
    .catch(() => [])

  const docsByCategory: Record<string, string[]> = {}
  for (const d of docs) {
    ;(docsByCategory[d.category] ??= []).push(d.imageUrl)
  }

  return (
    <div className="bg-[#fef9f1] text-[#1d1c17] overflow-x-hidden min-h-screen">

      {/* HERO */}
      <section className="relative bg-[#006a6a] text-white pt-20 md:pt-24 pb-24 md:pb-32 px-5 md:px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-10 left-10 opacity-20 -rotate-12 hidden md:block"><span className="material-symbols-outlined text-[100px]">edit</span></div>
        <div className="absolute top-20 right-20 opacity-20 rotate-12 hidden md:block"><span className="material-symbols-outlined text-[80px]">favorite</span></div>
        <div className="max-w-3xl relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6" style={{ fontFamily: 'Plus Jakarta Sans' }}>Layanan &amp; Harga</h1>
          <p className="text-base md:text-lg text-[#7fd5d4] max-w-2xl mx-auto">Layanan psikologi Zalfa Naqiyya Psychology Center serta unit pendidikan anak usia dini di bawah Yayasan Prima Nusantara Jaya — pilih kategori untuk melihat detailnya.</p>
        </div>
      </section>

      {/* MAIN */}
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-5 md:px-6 py-12 md:py-20 relative z-10 -mt-8 md:-mt-12" style={{ backgroundImage: 'radial-gradient(rgba(92,178,178,0.1) 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
        <ServiceTabs docsByCategory={docsByCategory} />
      </main>
    </div>
  )
}
