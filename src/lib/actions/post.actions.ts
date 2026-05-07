'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/utils'

export interface PostFormState {
  success?: boolean
  message?: string
}

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login')
  }
  return session
}

export async function createPost(
  prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  await requireAdmin()

  const title = (formData.get('title') as string)?.trim()
  const excerpt = (formData.get('excerpt') as string)?.trim()
  const content = (formData.get('content') as string)?.trim()
  const coverImage = (formData.get('coverImage') as string)?.trim()
  const published = formData.get('published') === 'true'

  if (!title || !content) {
    return { message: 'Judul dan konten wajib diisi.' }
  }

  const session = await getServerSession(authOptions)
  const authorEmail = session!.user!.email!

  const admin = await prisma.admin.findUnique({ where: { email: authorEmail } })
  if (!admin) return { message: 'Admin tidak ditemukan.' }

  const slug = slugify(title)

  try {
    await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        published,
        authorId: admin.id,
      },
    })
  } catch {
    return { message: 'Gagal menyimpan artikel. Judul mungkin sudah ada.' }
  }

  revalidatePath('/artikel')
  redirect('/dashboard/posts')
}

export async function updatePost(
  id: string,
  prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  await requireAdmin()

  const title = (formData.get('title') as string)?.trim()
  const excerpt = (formData.get('excerpt') as string)?.trim()
  const content = (formData.get('content') as string)?.trim()
  const coverImage = (formData.get('coverImage') as string)?.trim()
  const published = formData.get('published') === 'true'

  if (!title || !content) {
    return { message: 'Judul dan konten wajib diisi.' }
  }

  const slug = slugify(title)

  try {
    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        published,
      },
    })
  } catch {
    return { message: 'Gagal memperbarui artikel.' }
  }

  revalidatePath('/artikel')
  revalidatePath('/dashboard/posts')
  revalidatePath(`/artikel/${slug}`)

  return { success: true, message: 'Artikel berhasil diperbarui.' }
}

export async function deletePost(id: string): Promise<void> {
  await requireAdmin()

  await prisma.post.delete({ where: { id } })

  revalidatePath('/artikel')
  revalidatePath('/dashboard/posts')
}
