import prisma from '@/lib/prisma'
import Card from '@/components/ui/Card'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Dashboard – Zalfa Naqiyya Admin',
}

export default async function DashboardPage() {
  const [totalPosts, publishedPosts, totalConsultations, newConsultations] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.consultation.count(),
      prisma.consultation.count({ where: { status: 'NEW' } }),
    ])

  const recentConsultations = await prisma.consultation.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, name: true, service: true, status: true, createdAt: true },
  })

  const stats = [
    { label: 'Total Artikel', value: totalPosts, sub: `${publishedPosts} dipublikasi`, icon: '✏️', color: 'text-primary' },
    { label: 'Konsultasi Masuk', value: totalConsultations, sub: `${newConsultations} baru`, icon: '📋', color: 'text-secondary' },
  ]

  const statusColors: Record<string, string> = {
    NEW: 'bg-secondary/15 text-secondary',
    CONTACTED: 'bg-tertiary/15 text-tertiary',
    RESOLVED: 'bg-primary/15 text-primary',
  }

  const statusLabels: Record<string, string> = {
    NEW: 'Baru',
    CONTACTED: 'Dihubungi',
    RESOLVED: 'Selesai',
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text mb-1">Dashboard</h1>
        <p className="text-sm font-body text-text-muted">Ringkasan aktivitas website Anda.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {stats.map((stat) => (
          <Card key={stat.label} variant="pastel" className="flex items-center gap-5">
            <div className="text-4xl">{stat.icon}</div>
            <div>
              <p className="text-xs text-text-muted font-body uppercase tracking-wider">{stat.label}</p>
              <p className={`font-heading text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-text-muted font-body mt-0.5">{stat.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent consultations */}
      <div>
        <h2 className="font-heading font-semibold text-lg text-text mb-4">Konsultasi Terbaru</h2>
        <div className="bg-white rounded-scrapbook shadow-ambient overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-surface-dim bg-surface-container">
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Nama</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider hidden sm:table-cell">Layanan</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-dim">
              {recentConsultations.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-text-muted">
                    Belum ada konsultasi masuk.
                  </td>
                </tr>
              ) : (
                recentConsultations.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container/60 transition-colors">
                    <td className="px-5 py-3 font-medium text-text">{c.name}</td>
                    <td className="px-5 py-3 text-text-muted hidden sm:table-cell">{c.service}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[c.status] ?? ''}`}>
                        {statusLabels[c.status] ?? c.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
