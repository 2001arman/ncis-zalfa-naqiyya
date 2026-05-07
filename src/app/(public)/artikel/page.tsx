import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'

export const metadata: Metadata = { title: 'Artikel & Jurnal – Zalfa Naqiyya' }
export const dynamic = 'force-dynamic'

export default async function ArtikelPage() {
  const posts = await prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 6 }).catch(() => [])

  const fallback = [
    {id:'1',slug:'#',title:'Mengenali Tanda Kecemasan pada Anak Usia Dini',excerpt:'Kecemasan pada anak tidak selalu terlihat seperti pada orang dewasa. Memahami gejala fisik dan perilaku yang tidak biasa sangat penting untuk intervensi dini yang tepat.',coverImage:'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',createdAt:new Date('2024-10-12')},
    {id:'2',slug:'#',title:'Membangun Komunikasi Positif dalam Keluarga',excerpt:'Komunikasi yang efektif adalah kunci dari keharmonisan keluarga. Pelajari strategi praktis untuk mendengarkan aktif dan berbicara dengan empati.',coverImage:'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg',createdAt:new Date('2024-10-05')},
  ]

  const items = posts.length > 0 ? posts : fallback

  return (
    <div className="bg-[#f8faf6] text-[#191c1b] min-h-screen">

      {/* HERO */}
      <section className="text-center mb-20 mt-16 relative px-6 max-w-[1280px] mx-auto">
        <div className="absolute inset-0 -z-10 w-full h-full opacity-50" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%237ab8a0' d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.1,-46.3C90.4,-33.5,96,-18,94.3,-3.1C92.6,11.8,83.6,26,73.8,38.6C64,51.2,53.4,62.2,40.8,70.5C28.2,78.8,13.6,84.4,-1.1,86.2C-15.8,88,-30.6,86,-42.9,78.8C-55.2,71.6,-65,59.2,-73.4,45.8C-81.8,32.4,-88.8,18,-89.7,3.1C-90.6,-11.8,-85.4,-27.2,-76.2,-39.9C-67,-52.6,-53.8,-62.6,-40,-69.9C-26.2,-77.2,-11.8,-81.8,2.8,-86.4C17.4,-91,30.6,-83.6,44.7,-76.4Z' transform='translate(100 100)' opacity='0.1'/%3E%3C/svg%3E\")",backgroundRepeat:'no-repeat',backgroundSize:'cover'}}/>
        <h1 className="text-5xl font-bold text-[#2b6955] mb-6" style={{fontFamily:'Plus Jakarta Sans'}}>Artikel &amp; Jurnal</h1>
        <p className="text-lg text-[#404944] max-w-2xl mx-auto">Baca artikel terbaru seputar psikologi anak, parenting, dan kesehatan mental</p>
      </section>

      {/* GRID */}
      <main className="pb-24 px-6 md:px-16 max-w-[1280px] mx-auto">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {items.map((p) => (
            <article key={p.id} className="bg-white rounded-[24px] overflow-hidden border border-[#7ab8a0]/20 shadow-[0_20px_40px_-15px_rgba(43,105,85,0.08)] hover:shadow-[0_30px_50px_-15px_rgba(43,105,85,0.12)] transition-all duration-300 hover:-translate-y-1 group">
              <div className="p-6">
                {p.coverImage && <img alt={p.title} className="w-full h-64 object-cover rounded-2xl mb-6" src={p.coverImage}/>}
                <span className="inline-block bg-[#F2D086]/20 text-[#8c6b24] px-4 py-1.5 rounded-full font-semibold text-xs mb-4">
                  {new Date(p.createdAt).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}
                </span>
                <h2 className="text-xl font-semibold text-[#2b6955] mb-3 group-hover:text-[#7ab8a0] transition-colors" style={{fontFamily:'Plus Jakarta Sans'}}>{p.title}</h2>
                {p.excerpt && <p className="text-[#404944] mb-6 line-clamp-3">{p.excerpt}</p>}
                <Link href={`/artikel/${p.slug}`} className="text-[#F26D85] font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                  Baca Selengkapnya <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </article>
          ))}
        </section>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-6 mt-12">
          <button className="flex items-center gap-2 text-[#2b6955] font-semibold text-sm opacity-50 cursor-not-allowed">
            <span className="material-symbols-outlined">arrow_back</span>Sebelumnya
          </button>
          <div className="flex gap-2">
            <span className="w-10 h-10 rounded-full bg-[#2b6955] text-white flex items-center justify-center font-semibold text-sm">1</span>
            <span className="w-10 h-10 rounded-full bg-[#e7e9e5] text-[#191c1b] hover:bg-[#7ab8a0]/20 flex items-center justify-center font-semibold text-sm cursor-pointer transition-colors">2</span>
            <span className="w-10 h-10 rounded-full bg-[#e7e9e5] text-[#191c1b] hover:bg-[#7ab8a0]/20 flex items-center justify-center font-semibold text-sm cursor-pointer transition-colors">3</span>
          </div>
          <button className="flex items-center gap-2 text-[#2b6955] font-semibold text-sm hover:text-[#7ab8a0] transition-colors">
            Selanjutnya <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  )
}
