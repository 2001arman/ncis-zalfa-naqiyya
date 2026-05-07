import prisma from '@/lib/prisma'
import ConsultationsTable from './ConsultationsTable'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Konsultasi – Zalfa Naqiyya Admin',
}

export default async function ConsultationsPage() {
  const consultations = await prisma.consultation.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text mb-1">Konsultasi Masuk</h1>
        <p className="text-sm font-body text-text-muted">
          Kelola semua permintaan konsultasi dari calon klien.
        </p>
      </div>
      <ConsultationsTable consultations={consultations} />
    </div>
  )
}
