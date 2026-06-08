'use server'

import prisma from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface DocFormState {
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

function revalidateDocs() {
  revalidatePath('/dokumentasi')
  revalidatePath('/')
  revalidatePath('/layanan')
  revalidatePath('/dashboard/documentation')
}

function parseForm(formData: FormData) {
  const caption = (formData.get('caption') as string)?.trim()
  const category = (formData.get('category') as string)?.trim()
  const imageUrl = (formData.get('imageUrl') as string)?.trim()
  const publicId = (formData.get('publicId') as string)?.trim()
  const orderRaw = (formData.get('order') as string)?.trim()
  const published = formData.get('published') === 'true'
  const order = orderRaw ? parseInt(orderRaw, 10) || 0 : 0
  return { caption, category, imageUrl, publicId, order, published }
}

export async function createDocumentation(
  prevState: DocFormState,
  formData: FormData
): Promise<DocFormState> {
  await requireAdmin()

  const { caption, category, imageUrl, publicId, order, published } = parseForm(formData)

  if (!category || !imageUrl) {
    return { message: 'Kategori dan gambar wajib diisi.' }
  }

  try {
    await prisma.documentation.create({
      data: {
        caption: caption || null,
        category,
        imageUrl,
        publicId: publicId || null,
        order,
        published,
      },
    })
  } catch {
    return { message: 'Gagal menyimpan dokumentasi.' }
  }

  revalidateDocs()
  redirect('/dashboard/documentation')
}

export async function updateDocumentation(
  id: string,
  prevState: DocFormState,
  formData: FormData
): Promise<DocFormState> {
  await requireAdmin()

  const { caption, category, imageUrl, publicId, order, published } = parseForm(formData)

  if (!category || !imageUrl) {
    return { message: 'Kategori dan gambar wajib diisi.' }
  }

  try {
    await prisma.documentation.update({
      where: { id },
      data: {
        caption: caption || null,
        category,
        imageUrl,
        publicId: publicId || null,
        order,
        published,
      },
    })
  } catch {
    return { message: 'Gagal memperbarui dokumentasi.' }
  }

  revalidateDocs()
  return { success: true, message: 'Dokumentasi berhasil diperbarui.' }
}

export async function deleteDocumentation(id: string): Promise<void> {
  await requireAdmin()

  const doc = await prisma.documentation.findUnique({ where: { id } })

  await prisma.documentation.delete({ where: { id } })

  // Best-effort removal from Cloudinary; ignore failures so the row still deletes.
  if (doc?.publicId) {
    try {
      await cloudinary.uploader.destroy(doc.publicId)
    } catch {
      // swallow — DB row already removed
    }
  }

  revalidateDocs()
}
