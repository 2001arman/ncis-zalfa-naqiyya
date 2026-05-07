import PostEditor from '@/components/admin/PostEditor'
import { createPost } from '@/lib/actions/post.actions'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artikel Baru – Zalfa Naqiyya Admin',
}

export default function NewPostPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text mb-1">Artikel Baru</h1>
        <p className="text-sm font-body text-text-muted">
          Tulis dan publikasikan artikel baru.
        </p>
      </div>
      <PostEditor formAction={createPost} />
    </div>
  )
}
