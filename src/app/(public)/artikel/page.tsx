import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { cldUrl } from '@/lib/cld-url'

export const metadata: Metadata = { title: 'Artikel & Jurnal – Zalfa Naqiyya' }
export const dynamic = 'force-dynamic'

export default async function ArtikelPage() {
  const items = await prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 6 }).catch(() => [])

  return (
    <div className="bg-[#f8faf6] text-[#191c1b] min-h-screen">

      {/* HERO */}
      <section className="text-center mb-20 mt-16 relative px-6 max-w-[1280px] mx-auto">
        <div className="absolute inset-0 -z-10 w-full h-full opacity-50" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%237ab8a0' d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.1,-46.3C90.4,-33.5,96,-18,94.3,-3.1C92.6,11.8,83.6,26,73.8,38.6C64,51.2,53.4,62.2,40.8,70.5C28.2,78.8,13.6,84.4,-1.1,86.2C-15.8,88,-30.6,86,-42.9,78.8C-55.2,71.6,-65,59.2,-73.4,45.8C-81.8,32.4,-88.8,18,-89.7,3.1C-90.6,-11.8,-85.4,-27.2,-76.2,-39.9C-67,-52.6,-53.8,-62.6,-40,-69.9C-26.2,-77.2,-11.8,-81.8,2.8,-86.4C17.4,-91,30.6,-83.6,44.7,-76.4Z' transform='translate(100 100)' opacity='0.1'/%3E%3C/svg%3E\")",backgroundRepeat:'no-repeat',backgroundSize:'cover'}}/>
        <h1 className="text-3xl md:text-5xl font-bold text-[#2b6955] mb-6" style={{fontFamily:'Plus Jakarta Sans'}}>Artikel &amp; Jurnal</h1>
        <p className="text-lg text-[#404944] max-w-2xl mx-auto">Baca artikel terbaru seputar psikologi anak, parenting, dan kesehatan mental</p>
      </section>

      {/* GRID */}
      <main className="pb-16 md:pb-24 px-5 md:px-16 max-w-[1280px] mx-auto">
        {items.length === 0 ? (
          <p className="text-center text-[#404944] py-20">Belum ada artikel. Nantikan tulisan terbaru kami.</p>
        ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {items.map((p) => (
            <Link href={`/artikel/${p.slug}`} key={p.id} className="block bg-white rounded-[24px] overflow-hidden border border-[#7ab8a0]/20 shadow-[0_20px_40px_-15px_rgba(43,105,85,0.08)] hover:shadow-[0_30px_50px_-15px_rgba(43,105,85,0.12)] transition-all duration-300 hover:-translate-y-1 group">
              <div className="p-6">
                {p.coverImage && <img alt={p.title} className="w-full h-64 object-cover rounded-2xl mb-6" src={cldUrl(p.coverImage, 'f_auto,q_auto,w_800')}/>}
                <span className="inline-block bg-[#F2D086]/20 text-[#8c6b24] px-4 py-1.5 rounded-full font-semibold text-xs mb-4">
                  {new Date(p.createdAt).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}
                </span>
                <h2 className="text-xl font-semibold text-[#2b6955] mb-3 group-hover:text-[#7ab8a0] transition-colors" style={{fontFamily:'Plus Jakarta Sans'}}>{p.title}</h2>
                {p.excerpt && <p className="text-[#404944] mb-6 line-clamp-3">{p.excerpt}</p>}
                <div className="text-[#F26D85] font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  Baca Selengkapnya <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </section>
        )}
      </main>
    </div>
  )
}
