import Link from 'next/link'
import prisma from '@/lib/prisma'
import { deletePost } from '@/lib/actions/post.actions'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Artikel – Zalfa Naqiyya Admin',
}

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text mb-1">Artikel</h1>
          <p className="text-sm font-body text-text-muted">Kelola konten artikel website.</p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button id="new-post-btn">+ Artikel Baru</Button>
        </Link>
      </div>

      <div className="bg-white rounded-scrapbook shadow-ambient overflow-x-auto">
        <table className="w-full text-sm font-body min-w-[520px]">
          <thead>
            <tr className="border-b border-surface-dim bg-surface-container">
              {['Judul', 'Status', 'Diperbarui', 'Aksi'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-dim">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-text-muted">
                  Belum ada artikel. Buat yang pertama!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-text">{post.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">/artikel/{post.slug}</p>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={post.published ? 'primary' : 'surface'}>
                      {post.published ? 'Dipublikasi' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-text-muted whitespace-nowrap">
                    {formatDate(post.updatedAt)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/posts/${post.id}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <span className="text-surface-dim">|</span>
                      <Link
                        href={`/artikel/${post.slug}`}
                        target="_blank"
                        className="text-xs font-medium text-text-muted hover:text-text hover:underline"
                      >
                        Lihat
                      </Link>
                      <span className="text-surface-dim">|</span>
                      <form
                        action={async () => {
                          'use server'
                          await deletePost(post.id)
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs font-medium text-secondary hover:underline"
                          onClick={(e) => {
                            if (!confirm(`Hapus artikel "${post.title}"?`)) e.preventDefault()
                          }}
                        >
                          Hapus
                        </button>
                      </form>
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
