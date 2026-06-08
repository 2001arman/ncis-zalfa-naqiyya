/**
 * Seed documentation: upload existing static photos in public/images/{kids-growth,paud}
 * to Cloudinary and upsert Documentation rows. Idempotent (keyed on deterministic publicId).
 *
 * Usage: npm run seed:docs   (requires CLOUDINARY_* + DATABASE_URL in .env)
 */
import 'dotenv/config'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { v2 as cloudinary } from 'cloudinary'

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

// folder under public/images  ->  Documentation.category  +  filename prefix
const SOURCES: { dir: string; category: string; prefix: string }[] = [
  { dir: 'kids-growth', category: 'kids-growth', prefix: 'kids-growth' },
  { dir: 'paud', category: 'paud', prefix: 'paud' },
]

async function main() {
  const root = join(process.cwd(), 'public', 'images')
  let count = 0

  for (const src of SOURCES) {
    const dirPath = join(root, src.dir)
    const files = readdirSync(dirPath)
      .filter((f) => f.toLowerCase().endsWith('.webp'))
      .sort()

    console.log(`\n${src.category}: ${files.length} files`)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const base = file.replace(/\.webp$/i, '') // e.g. kg-05 / paud-30
      const publicId = `zalfa-naqiyya/docs/${src.prefix}/${base}`

      const res = await cloudinary.uploader.upload(join(dirPath, file), {
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
      })

      await prisma.documentation.upsert({
        where: { publicId: res.public_id },
        update: { imageUrl: res.secure_url, category: src.category, order: i },
        create: {
          imageUrl: res.secure_url,
          publicId: res.public_id,
          category: src.category,
          order: i,
          published: true,
        },
      })

      count++
      process.stdout.write(`  ${base} -> ${res.secure_url}\n`)
    }
  }

  console.log(`\n✅ Seeded ${count} documentation photos.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
