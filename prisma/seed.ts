/**
 * Prisma seed script — creates the first admin account.
 *
 * Usage:
 *   npx tsx prisma/seed.ts
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcrypt'

// Prisma v7 requires a driver adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const password = await bcrypt.hash('admin123', 12)

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@zalfa.id' },
    update: {},
    create: {
      email: 'admin@zalfa.id',
      name: 'Admin Zalfa',
      password,
    },
  })

  console.log('✅ Admin seeded:', admin.email)
  console.log('   Email:    admin@zalfa.id')
  console.log('   Password: admin123')
  console.log('')
  console.log('⚠️  Change the password after first login!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
