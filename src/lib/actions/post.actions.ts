'use server'

import prisma from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/utils'
import { cldPublicIdsInHtml } from '@/lib/cld-url'

export interface PostFormState {
  success?: boolean
  message?: string
  /** Field-level errors, keyed by input name. */
  fieldErrors?: Record<string, string>
}

async function destroyCloudinary(publicId?: string | null) {
  if (!publicId) return
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    // best-effort — the DB write already succeeded, so only log it
    console.error('[post.actions] cloudinary destroy failed', publicId, error)
  }
}

/**
 * Drops Cloudinary assets that no post references any more — covers plus the
 * images embedded in article HTML. Always call this *after* the DB write, so
 * an asset the saved post still uses is counted as in use and survives.
 */
async function destroyOrphanedAssets(publicIds: (string | null | undefined)[]) {
  for (const publicId of new Set(publicIds.filter((id): id is string => !!id))) {
    const stillReferenced = await prisma.post.count({
      where: { OR: [{ coverPublicId: publicId }, { content: { contains: publicId } }] },
    })
    if (stillReferenced === 0) await destroyCloudinary(publicId)
  }
}

/**
 * Resolves the logged-in admin. Returns `null` instead of redirecting so a
 * server action can report "session expired" to the form and let the admin
 * keep the draft they just typed.
 */
async function currentAdmin() {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  if (!email) return null
  return prisma.admin.findUnique({ where: { email }, select: { id: true } })
}

const SESSION_EXPIRED: PostFormState = {
  message:
    'Sesi login sudah berakhir. Buka /login di tab baru, login ulang, lalu tekan Simpan lagi — draf ini tidak hilang.',
}

/** Tiptap emits `<p></p>` for an empty document — treat that as no content. */
function isBlankHtml(html: string): boolean {
  if (/<(img|hr|iframe|video)\b/i.test(html)) return false
  return (
    html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .trim().length === 0
  )
}

/**
 * Builds a slug that does not collide with another post. `slug` is unique in
 * the schema, so without this a second article sharing a title just fails.
 */
async function uniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title) || 'artikel'
  let slug = base

  for (let n = 2; n < 200; n++) {
    const clash = await prisma.post.findUnique({ where: { slug }, select: { id: true } })
    if (!clash || clash.id === excludeId) return slug
    slug = `${base}-${n}`
  }

  return `${base}-${Date.now()}`
}

function parseForm(formData: FormData) {
  return {
    title: ((formData.get('title') as string) ?? '').trim(),
    excerpt: ((formData.get('excerpt') as string) ?? '').trim(),
    content: ((formData.get('content') as string) ?? '').trim(),
    coverImage: ((formData.get('coverImage') as string) ?? '').trim(),
    coverPublicId: ((formData.get('coverPublicId') as string) ?? '').trim(),
    published: formData.get('published') === 'true',
    // Images uploaded from inside the editor during this session — any the
    // admin inserted then deleted again would otherwise leak in Cloudinary.
    contentUploads: ((formData.get('contentUploads') as string) ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean),
  }
}

function validate(title: string, content: string): PostFormState | null {
  const fieldErrors: Record<string, string> = {}
  if (!title) fieldErrors.title = 'Judul artikel wajib diisi.'
  if (!content || isBlankHtml(content)) {
    fieldErrors.content = 'Konten artikel masih kosong. Tulis isi artikel terlebih dahulu.'
  }

  if (Object.keys(fieldErrors).length === 0) return null

  return {
    message: Object.values(fieldErrors).join(' '),
    fieldErrors,
  }
}

/** Turns an unknown Prisma/runtime failure into a message the admin can act on. */
function describeError(error: unknown, fallback: string): PostFormState {
  const code = (error as { code?: string })?.code

  if (code === 'P2002') {
    return { message: 'Sudah ada artikel dengan judul (slug) yang sama. Ubah judulnya sedikit.' }
  }
  if (code === 'P2025') {
    return { message: 'Artikel tidak ditemukan — mungkin sudah dihapus dari tab lain.' }
  }
  if (code === 'P1001' || code === 'P1017') {
    return { message: 'Koneksi ke database terputus. Coba simpan lagi dalam beberapa detik.' }
  }

  const detail = error instanceof Error ? error.message : String(error)
  return { message: `${fallback} (${detail})` }
}

export async function createPost(
  prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const admin = await currentAdmin()
  if (!admin) return SESSION_EXPIRED

  const { title, excerpt, content, coverImage, coverPublicId, published, contentUploads } =
    parseForm(formData)

  const invalid = validate(title, content)
  if (invalid) return invalid

  let slug: string
  try {
    slug = await uniqueSlug(title)
    await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        coverPublicId: coverPublicId || null,
        published,
        authorId: admin.id,
      },
    })
  } catch (error) {
    console.error('[post.actions] createPost failed', error)
    return describeError(error, 'Gagal menyimpan artikel.')
  }

  await destroyOrphanedAssets(contentUploads)

  revalidatePath('/artikel')
  revalidatePath(`/artikel/${slug}`)
  revalidatePath('/dashboard/posts')

  // redirect() throws NEXT_REDIRECT — must stay outside the try/catch above.
  redirect('/dashboard/posts?status=created')
}

export async function updatePost(
  id: string,
  prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const admin = await currentAdmin()
  if (!admin) return SESSION_EXPIRED

  const { title, excerpt, content, coverImage, coverPublicId, published, contentUploads } =
    parseForm(formData)

  const invalid = validate(title, content)
  if (invalid) return invalid

  const existing = await prisma.post.findUnique({
    where: { id },
    select: { coverPublicId: true, slug: true, content: true },
  })
  if (!existing) {
    return { message: 'Artikel tidak ditemukan — mungkin sudah dihapus.' }
  }

  const newPublicId = coverPublicId || null

  let slug: string
  try {
    slug = await uniqueSlug(title, id)
    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        coverPublicId: newPublicId,
        published,
      },
    })
  } catch (error) {
    console.error('[post.actions] updatePost failed', id, error)
    return describeError(error, 'Gagal memperbarui artikel.')
  }

  // Only drop Cloudinary assets once the DB write actually succeeded: the old
  // cover, images dropped from the body, and uploads that never got inserted.
  await destroyOrphanedAssets([
    existing.coverPublicId,
    ...cldPublicIdsInHtml(existing.content),
    ...contentUploads,
  ])

  revalidatePath('/artikel')
  revalidatePath('/dashboard/posts')
  revalidatePath(`/artikel/${slug}`)
  if (existing.slug !== slug) revalidatePath(`/artikel/${existing.slug}`)

  return { success: true, message: 'Artikel berhasil diperbarui.' }
}

export async function deletePost(id: string): Promise<void> {
  const admin = await currentAdmin()
  if (!admin) redirect('/login')

  let assets: (string | null)[] = []
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: { coverPublicId: true, content: true },
    })
    assets = [post?.coverPublicId ?? null, ...cldPublicIdsInHtml(post?.content ?? '')]
    await prisma.post.delete({ where: { id } })
  } catch (error) {
    console.error('[post.actions] deletePost failed', id, error)
    redirect('/dashboard/posts?status=delete-failed')
  }

  await destroyOrphanedAssets(assets)

  revalidatePath('/artikel')
  revalidatePath('/dashboard/posts')
  redirect('/dashboard/posts?status=deleted')
}
