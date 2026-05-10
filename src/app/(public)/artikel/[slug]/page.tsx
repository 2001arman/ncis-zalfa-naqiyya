import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    select: { title: true, excerpt: true, coverImage: true },
  })

  if (!post) {
    if (slug === 'dummy-1' || slug === 'dummy-2') {
      return { title: 'Artikel Dummy – Zalfa Naqiyya', description: 'Ini adalah contoh artikel.' }
    }
    return { title: 'Artikel Tidak Ditemukan' }
  }

  return {
    title: `${post.title} – Zalfa Naqiyya`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function ArtikelDetailPage({ params }: Props) {
  const { slug } = await params

  let post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true } } },
  }) as any

  if (!post) {
    if (slug === 'dummy-1' || slug === 'dummy-2') {
      post = {
        id: slug,
        slug,
        title: slug === 'dummy-1' ? 'Mengenali Tanda Kecemasan pada Anak Usia Dini' : 'Membangun Komunikasi Positif dalam Keluarga',
        excerpt: 'Ini adalah artikel dummy. Kecemasan pada anak tidak selalu terlihat seperti pada orang dewasa.',
        content: '<p>Kecemasan adalah emosi alami yang dialami oleh setiap orang, termasuk anak-anak. Namun, pada usia dini, anak-anak seringkali belum memiliki kemampuan untuk mengungkapkan perasaan cemas mereka dengan kata-kata.</p><h2>Mengapa Anak Bisa Merasa Cemas?</h2><p>Perubahan rutinitas, lingkungan baru seperti masuk prasekolah, atau dinamika keluarga dapat menjadi pemicu kecemasan pada anak.</p><blockquote>"Memahami bahasa tubuh dan perilaku perubahan sekecil apapun adalah kunci untuk memberikan rasa aman yang dibutuhkan anak saat mereka merasa cemas."</blockquote><h2>Tanda-tanda Umum Kecemasan</h2><ul><li><strong>Perubahan Pola Tidur:</strong> Kesulitan untuk tidur, sering terbangun di malam hari, atau mengalami mimpi buruk.</li><li><strong>Keluhan Fisik Tanpa Sebab Medis:</strong> Sering mengeluh sakit perut atau pusing terutama saat menghadapi situasi tertentu.</li></ul>',
        coverImage: slug === 'dummy-1' ? 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' : 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg',
        createdAt: new Date(),
        updatedAt: new Date(),
        published: true,
        authorId: 'dummy',
        author: { name: 'Tim Psikolog Zalfa Naqiyya' }
      }
    } else {
      notFound()
    }
  }

  // Fetch related articles
  const relatedPosts = await prisma.post.findMany({
    where: { published: true, id: { not: post.id } },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  const fallbackRelated = [
    { id: '1', slug: '#', title: 'Mengenali Tanda Kecemasan pada Anak Usia Dini', excerpt: 'Kecemasan pada anak tidak selalu terlihat seperti pada orang dewasa. Memahami gejala fisik dan perilaku yang tidak biasa sangat penting untuk intervensi dini yang tepat.', coverImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', createdAt: new Date('2024-10-12') },
    { id: '2', slug: '#', title: 'Membangun Komunikasi Positif dalam Keluarga', excerpt: 'Komunikasi yang efektif adalah kunci dari keharmonisan keluarga. Pelajari strategi praktis untuk mendengarkan aktif dan berbicara dengan empati.', coverImage: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg', createdAt: new Date('2024-10-05') },
    { id: '3', slug: '#', title: 'Mengenal Terapi Bermain untuk Mengatasi Trauma', excerpt: 'Terapi bermain efektif membantu anak.', coverImage: 'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg', createdAt: new Date('2024-09-28') },
  ]

  const items = relatedPosts.length >= 3 ? relatedPosts : fallbackRelated

  return (
    <div className="bg-[#f8faf6] text-[#191c1b] min-h-screen">
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 md:px-16 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1 md:gap-2 text-[12px] text-[#707974] overflow-hidden" style={{ fontFamily: 'Inter' }}>
          <Link className="hover:text-[#2b6955] transition-colors shrink-0" href="/">Beranda</Link>
          <span className="material-symbols-outlined text-[16px] shrink-0">chevron_right</span>
          <Link className="hover:text-[#2b6955] transition-colors shrink-0" href="/artikel">Artikel</Link>
          <span className="material-symbols-outlined text-[16px] shrink-0">chevron_right</span>
          <span className="text-[#191c1b] truncate">{post.title}</span>
        </nav>

        {/* Article Header */}
        <article className="max-w-[800px] mx-auto bg-white rounded-[32px] p-6 md:p-12 shadow-[0_20px_40px_-15px_rgba(43,105,85,0.08)] mb-[120px] relative">
          {/* Organic decorative blob */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#b0f0d6] opacity-50 rounded-full blur-2xl -z-10"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#ffdad9] opacity-50 rounded-full blur-2xl -z-10"></div>

          <div className="mb-6 flex items-center gap-3">
            <span className="inline-block bg-[#F2D086] text-[#191c1b] px-4 py-1.5 rounded-full font-semibold text-[14px] shadow-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Psikologi Anak
            </span>
          </div>

          <h1 className="text-[32px] md:text-[48px] font-bold text-[#5CB2B2] mb-6 leading-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#404944] mb-8 pb-8 border-b border-[#bfc9c3]/30" style={{ fontFamily: 'Inter' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#eceeeb] flex items-center justify-center text-[#2b6955]">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
              </div>
              <span>{post.author?.name || 'Tim Psikolog Zalfa Naqiyya'}</span>
            </div>
            <span>•</span>
            <span>{formatDate(post.createdAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">timer</span> 5 Menit Baca</span>
          </div>

          {post.coverImage && (
            <div className="w-full h-[300px] md:h-[400px] rounded-[24px] overflow-hidden mb-10 shadow-md">
              <img alt={post.title} className="w-full h-full object-cover" src={post.coverImage} />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none text-[16px] md:text-[18px] text-[#404944] leading-[1.8] font-normal 
               prose-headings:text-[#2b6955] prose-headings:font-bold prose-headings:font-['Plus_Jakarta_Sans']
               prose-a:text-[#5CB2B2] 
               prose-blockquote:bg-[#B2C9B2]/20 prose-blockquote:border-[#5CB2B2] prose-blockquote:text-[#404944] prose-blockquote:italic prose-blockquote:rounded-r-2xl prose-blockquote:p-6 prose-blockquote:border-l-4 prose-blockquote:my-8
               prose-li:marker:text-[#5CB2B2]"
            style={{ fontFamily: 'Inter' }}
            dangerouslySetInnerHTML={{ __html: post.content }}>
          </div>
        </article>

        {/* Artikel Lainnya */}
        <section className="mb-[120px]">
          <h3 className="text-[32px] font-bold text-[#2b6955] text-center mb-12" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Artikel Lainnya
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((p) => (
              <Link key={p.id} href={`/artikel/${p.slug}`} className="block bg-white rounded-[24px] p-6 shadow-[0_8px_24px_-12px_rgba(43,105,85,0.15)] hover:shadow-[0_12px_32px_-12px_rgba(43,105,85,0.2)] transition-all duration-300 transform hover:-translate-y-1 border border-[#B2C9B2]/20">
                <div className="w-full h-48 rounded-[16px] overflow-hidden mb-4 bg-[#eceeeb]">
                  {p.coverImage && <img alt={p.title} className="w-full h-full object-cover" src={p.coverImage} />}
                </div>
                <span className="inline-block text-[12px] text-[#5CB2B2] mb-2 font-semibold" style={{ fontFamily: 'Inter' }}>Psikologi</span>
                <h4 className="text-[18px] font-semibold text-[#191c1b] mb-2 leading-snug line-clamp-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>{p.title}</h4>
                <p className="text-[12px] text-[#404944] flex items-center gap-1" style={{ fontFamily: 'Inter' }}>
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span> {formatDate(p.createdAt)}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-[#FFF8E7] rounded-[32px] p-8 md:p-12 text-center relative overflow-hidden">
          {/* Blob accents for CTA */}
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#F26D85]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-[#7AB8A0]/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h3 className="text-[32px] font-bold text-[#2C6E6A] mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>Butuh konsultasi?</h3>
            <p className="text-[16px] text-[#404944] mb-8 max-w-md mx-auto" style={{ fontFamily: 'Inter' }}>
              Tim psikolog kami siap membantu perjalanan Anda dan buah hati menuju kesejahteraan emosional yang lebih baik.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://wa.me/" className="flex items-center justify-center gap-2 bg-[#5CB2B2] text-white px-8 py-3 rounded-full font-semibold text-[14px] hover:bg-[#2C6E6A] transition-colors w-full sm:w-auto shadow-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                <span className="material-symbols-outlined text-[20px]">chat</span>
                WhatsApp Kami
              </a>
              <Link href="/#kontak" className="flex items-center justify-center gap-2 bg-transparent border-2 border-[#5CB2B2] text-[#5CB2B2] px-8 py-3 rounded-full font-semibold text-[14px] hover:bg-[#7AB8A0]/10 transition-colors w-full sm:w-auto" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                <span className="material-symbols-outlined text-[20px]">event_available</span>
                Daftar Online
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
