/**
 * Seed 3 starter articles with Cloudinary cover images.
 * Idempotent — upserts the admin author and posts (keyed on slug).
 *
 * Usage: npm run seed:articles   (requires CLOUDINARY_* + DATABASE_URL in .env)
 */
import 'dotenv/config'
import { join } from 'node:path'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { v2 as cloudinary } from 'cloudinary'
import bcrypt from 'bcryptjs'

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, DATABASE_URL } = process.env

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set')
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error('CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET must be set in .env')
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: DATABASE_URL }) })

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

interface SeedArticle {
  title: string
  excerpt: string
  content: string
  coverSource: string // path under public/images
}

const ARTICLES: SeedArticle[] = [
  {
    title: 'Mengenali Tanda Kecemasan pada Anak Usia Dini',
    excerpt:
      'Kecemasan pada anak tidak selalu terlihat seperti pada orang dewasa. Memahami gejala fisik dan perilaku yang tidak biasa sangat penting untuk intervensi dini yang tepat.',
    coverSource: 'kids-growth/kg-05.webp',
    content: `
<p>Kecemasan adalah emosi alami yang dialami setiap orang, termasuk anak-anak. Namun pada usia dini, anak seringkali belum memiliki kemampuan untuk mengungkapkan perasaan cemas mereka dengan kata-kata, sehingga muncul melalui perilaku dan keluhan fisik.</p>
<h2>Mengapa Anak Bisa Merasa Cemas?</h2>
<p>Perubahan rutinitas, lingkungan baru seperti masuk prasekolah, atau dinamika dalam keluarga dapat menjadi pemicu kecemasan pada anak. Setiap anak merespons perubahan dengan cara yang berbeda.</p>
<blockquote>"Memahami bahasa tubuh dan perubahan perilaku sekecil apa pun adalah kunci untuk memberikan rasa aman yang dibutuhkan anak saat mereka merasa cemas."</blockquote>
<h2>Tanda-tanda yang Perlu Diperhatikan</h2>
<ul>
<li><strong>Perubahan pola tidur:</strong> sulit tidur, sering terbangun, atau mimpi buruk.</li>
<li><strong>Keluhan fisik tanpa sebab medis:</strong> sering mengeluh sakit perut atau pusing menjelang situasi tertentu.</li>
<li><strong>Menarik diri:</strong> enggan berpisah dengan orang tua atau menghindari aktivitas yang biasanya disukai.</li>
</ul>
<p>Jika tanda-tanda ini menetap dan mengganggu aktivitas harian anak, berkonsultasi dengan psikolog anak dapat membantu menemukan pendekatan yang tepat.</p>
`.trim(),
  },
  {
    title: 'Membangun Komunikasi Positif dalam Keluarga',
    excerpt:
      'Komunikasi yang efektif adalah kunci keharmonisan keluarga. Pelajari strategi praktis untuk mendengarkan aktif dan berbicara dengan empati kepada buah hati.',
    coverSource: 'paud/paud-30.webp',
    content: `
<p>Komunikasi yang sehat adalah fondasi dari hubungan keluarga yang hangat. Cara kita berbicara dan mendengarkan anak membentuk rasa percaya diri serta keamanan emosional mereka.</p>
<h2>Dengarkan Lebih Dahulu</h2>
<p>Mendengarkan aktif berarti memberi perhatian penuh tanpa langsung menghakimi atau menyela. Tataplah mata anak, dan akui perasaannya sebelum memberi solusi.</p>
<blockquote>"Anak yang merasa didengar akan lebih mudah belajar mengelola emosi dan menyampaikan kebutuhannya secara sehat."</blockquote>
<h2>Strategi Praktis</h2>
<ul>
<li><strong>Gunakan bahasa "Aku":</strong> sampaikan perasaan tanpa menyalahkan, misalnya "Aku merasa khawatir ketika…".</li>
<li><strong>Validasi emosi:</strong> akui perasaan anak meski Anda tidak setuju dengan perilakunya.</li>
<li><strong>Sediakan waktu khusus:</strong> obrolan ringan saat makan atau sebelum tidur mempererat kedekatan.</li>
</ul>
<p>Komunikasi positif bukan tentang sempurna, melainkan konsisten hadir dan terbuka bagi anak.</p>
`.trim(),
  },
  {
    title: 'Manfaat Terapi Bermain untuk Tumbuh Kembang Anak',
    excerpt:
      'Bermain bukan sekadar hiburan, melainkan bahasa alami anak untuk mengekspresikan emosi. Kenali bagaimana terapi bermain mendukung perkembangan anak secara menyeluruh.',
    coverSource: 'kids-growth/kg-08.webp',
    content: `
<p>Bagi anak, bermain adalah cara utama memahami dunia dan mengekspresikan perasaan yang belum bisa mereka ungkapkan dengan kata-kata. Terapi bermain memanfaatkan hal ini sebagai pendekatan psikologis yang menyenangkan dan bermakna.</p>
<h2>Apa Itu Terapi Bermain?</h2>
<p>Terapi bermain adalah metode yang menggunakan permainan terstruktur untuk membantu anak memproses emosi, mengatasi kecemasan, serta mengembangkan keterampilan sosial dan motorik.</p>
<blockquote>"Melalui bermain, anak belajar mengatur emosi, memecahkan masalah, dan membangun kepercayaan diri dengan cara yang alami."</blockquote>
<h2>Manfaat Utama</h2>
<ul>
<li><strong>Regulasi emosi:</strong> anak belajar mengenali dan menenangkan perasaannya.</li>
<li><strong>Keterampilan sosial:</strong> bermain bersama melatih kerja sama dan empati.</li>
<li><strong>Stimulasi kognitif & motorik:</strong> aktivitas bermain mendukung perkembangan otak dan fisik.</li>
</ul>
<p>Di Zalfa Naqiyya, pendekatan play-based learning menjadi bagian dari Kids Growth Program untuk mendukung tumbuh kembang anak secara optimal.</p>
`.trim(),
  },
]

async function main() {
  const password = await bcrypt.hash('admin123', 12)
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@zalfa.id' },
    update: {},
    create: { email: 'admin@zalfa.id', name: 'Admin Zalfa', password },
  })
  console.log('Admin author:', admin.email)

  const imagesRoot = join(process.cwd(), 'public', 'images')

  for (const article of ARTICLES) {
    const slug = slugify(article.title)

    const upload = await cloudinary.uploader.upload(join(imagesRoot, article.coverSource), {
      public_id: `zalfa-naqiyya/articles/${slug}`,
      overwrite: true,
      resource_type: 'image',
    })

    await prisma.post.upsert({
      where: { slug },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        coverImage: upload.secure_url,
        published: true,
        authorId: admin.id,
      },
      create: {
        slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        coverImage: upload.secure_url,
        published: true,
        authorId: admin.id,
      },
    })

    console.log(`  ✓ ${article.title}  ->  ${upload.secure_url}`)
  }

  console.log(`\n✅ Seeded ${ARTICLES.length} articles.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
