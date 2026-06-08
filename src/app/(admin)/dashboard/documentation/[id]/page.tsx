import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import DocEditor from '@/components/admin/DocEditor'
import { updateDocumentation } from '@/lib/actions/documentation.actions'
import { docCategoryLabel } from '@/lib/documentation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Edit Dokumentasi – Zalfa Naqiyya Admin',
}

export default async function EditDocumentationPage({ params }: Props) {
  const { id } = await params

  const doc = await prisma.documentation.findUnique({ where: { id } })
  if (!doc) notFound()

  const updateWithId = updateDocumentation.bind(null, doc.id)

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text mb-1">Edit Dokumentasi</h1>
        <p className="text-sm font-body text-text-muted truncate">
          {docCategoryLabel(doc.category)}{doc.caption ? ` — ${doc.caption}` : ''}
        </p>
      </div>
      <DocEditor
        formAction={updateWithId}
        initialData={{
          caption: doc.caption ?? undefined,
          category: doc.category,
          imageUrl: doc.imageUrl,
          publicId: doc.publicId ?? undefined,
          order: doc.order,
          published: doc.published,
        }}
      />
    </div>
  )
}
