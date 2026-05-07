'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface ConsultationFormState {
  success?: boolean
  message?: string
  errors?: {
    name?: string[]
    phone?: string[]
    service?: string[]
    message?: string[]
  }
}

const SERVICES = [
  'Konsultasi Tumbuh Kembang',
  'Terapi Wicara',
  'Parenting Coaching',
  'Evaluasi Perkembangan',
  'Konsultasi Online',
]

export async function submitConsultation(
  prevState: ConsultationFormState,
  formData: FormData
): Promise<ConsultationFormState> {
  const name = (formData.get('name') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim()
  const service = (formData.get('service') as string)?.trim()
  const message = (formData.get('message') as string)?.trim()

  const errors: ConsultationFormState['errors'] = {}

  if (!name || name.length < 2) {
    errors.name = ['Nama minimal 2 karakter.']
  }
  if (!phone || phone.length < 8) {
    errors.phone = ['Nomor telepon tidak valid.']
  }
  if (!service || !SERVICES.includes(service)) {
    errors.service = ['Pilih layanan yang tersedia.']
  }

  if (Object.keys(errors).length > 0) {
    return { errors, message: 'Periksa kembali data Anda.' }
  }

  try {
    await prisma.consultation.create({
      data: { name, phone, service, message: message || null },
    })

    return {
      success: true,
      message: 'Terima kasih! Kami akan menghubungi Anda segera.',
    }
  } catch {
    return {
      message: 'Terjadi kesalahan. Silakan coba lagi.',
    }
  }
}

export async function updateConsultationStatus(
  id: string,
  status: 'NEW' | 'CONTACTED' | 'RESOLVED'
): Promise<void> {
  await prisma.consultation.update({
    where: { id },
    data: { status },
  })
  revalidatePath('/dashboard/consultations')
}
