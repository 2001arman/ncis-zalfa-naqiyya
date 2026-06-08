import DocEditor from '@/components/admin/DocEditor'
import { createDocumentation } from '@/lib/actions/documentation.actions'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dokumentasi Baru – Zalfa Naqiyya Admin',
}

export default function NewDocumentationPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text mb-1">Dokumentasi Baru</h1>
        <p className="text-sm font-body text-text-muted">Unggah foto kegiatan untuk ditampilkan di website.</p>
      </div>
      <DocEditor formAction={createDocumentation} />
    </div>
  )
}
