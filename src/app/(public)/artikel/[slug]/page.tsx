import { notFound } from 'next/navigation'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    select: { title: true, excerpt: true, coverImage: true },
  })

  if (!post) return { title: 'Artikel Tidak Ditemukan' }

  return {
    title: `${post.title} – Zalfa Naqiyya`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function ArtikelDetailPage({ params }: Props) {
  const { slug } = await params

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true } } },
  })

  if (!post) notFound()

  return (
    <article className="py-section">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10">
          <Badge variant="primary" className="mb-4">Artikel</Badge>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-text-muted font-body">
            <span>{formatDate(post.createdAt)}</span>
            {post.author && (
              <>
                <span>·</span>
                <span>Oleh {post.author.name}</span>
              </>
            )}
          </div>
        </header>

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative w-full aspect-video rounded-scrapbook overflow-hidden mb-10">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {/* Content (Tiptap HTML) */}
        <div
          className="prose prose-stone max-w-none font-body
            prose-headings:font-heading prose-headings:text-text
            prose-p:text-text-muted prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  )
}
