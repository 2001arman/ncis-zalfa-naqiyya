import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import { deleteDocumentation } from '@/lib/actions/documentation.actions'
import { docCategoryLabel } from '@/lib/documentation'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import DeleteButton from '@/components/admin/DeleteButton'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Dokumentasi – Zalfa Naqiyya Admin',
}

export default async function DocumentationPage() {
  const docs = await prisma.documentation.findMany({
    orderBy: [{ category: 'asc' }, { order: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text mb-1">Dokumentasi</h1>
          <p className="text-sm font-body text-text-muted">Kelola foto kegiatan yang tampil di website.</p>
        </div>
        <Link href="/dashboard/documentation/new">
          <Button id="new-doc-btn">+ Tambah Foto</Button>
        </Link>
      </div>

      <div className="bg-white rounded-scrapbook shadow-ambient overflow-x-auto">
        <table className="w-full text-sm font-body min-w-[560px]">
          <thead>
            <tr className="border-b border-surface-dim bg-surface-container">
              {['Foto', 'Kategori', 'Keterangan', 'Status', 'Aksi'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-dim">
            {docs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-text-muted">
                  Belum ada dokumentasi. Unggah yang pertama!
                </td>
              </tr>
            ) : (
              docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface-container">
                      <Image src={doc.imageUrl} alt={doc.caption ?? 'Dokumentasi'} fill className="object-cover" sizes="64px" />
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="surface">{docCategoryLabel(doc.category)}</Badge>
                  </td>
                  <td className="px-5 py-3 text-text-muted max-w-[220px] truncate">{doc.caption ?? '—'}</td>
                  <td className="px-5 py-3">
                    <Badge variant={doc.published ? 'primary' : 'surface'}>
                      {doc.published ? 'Tampil' : 'Tersembunyi'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/documentation/${doc.id}`} className="text-xs font-medium text-primary hover:underline">
                        Edit
                      </Link>
                      <span className="text-surface-dim">|</span>
                      <DeleteButton
                        action={async () => {
                          'use server'
                          await deleteDocumentation(doc.id)
                        }}
                        confirmText="Hapus dokumentasi ini?"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
