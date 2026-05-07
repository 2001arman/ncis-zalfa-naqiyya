import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateUploadSignature } from '@/lib/cloudinary'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await generateUploadSignature('zalfa-naqiyya')
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed to sign upload' }, { status: 500 })
  }
}
