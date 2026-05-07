import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import PostEditor from '@/components/admin/PostEditor'
import { updatePost } from '@/lib/actions/post.actions'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Edit Artikel – Zalfa Naqiyya Admin',
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      coverImage: true,
      published: true,
    },
  })

  if (!post) notFound()

  // Bind the post ID to the updatePost action
  const updatePostWithId = updatePost.bind(null, post.id)

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text mb-1">Edit Artikel</h1>
        <p className="text-sm font-body text-text-muted truncate">{post.title}</p>
      </div>
      <PostEditor
        formAction={updatePostWithId}
        initialData={{
          title: post.title,
          excerpt: post.excerpt ?? undefined,
          content: post.content,
          coverImage: post.coverImage ?? undefined,
          published: post.published,
        }}
      />
    </div>
  )
}
