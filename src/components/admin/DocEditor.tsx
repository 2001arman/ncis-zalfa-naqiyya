'use client'

import { useActionState, useState } from 'react'
import Image from 'next/image'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { DOC_CATEGORIES } from '@/lib/documentation'
import type { DocFormState } from '@/lib/actions/documentation.actions'

interface DocEditorProps {
  formAction: (prevState: DocFormState, formData: FormData) => Promise<DocFormState>
  initialData?: {
    caption?: string
    category?: string
    imageUrl?: string
    publicId?: string
    order?: number
    published?: boolean
  }
}

export default function DocEditor({ formAction, initialData }: DocEditorProps) {
  const [state, action, pending] = useActionState(formAction, {})
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? '')
  const [publicId, setPublicId] = useState(initialData?.publicId ?? '')
  const [uploading, setUploading] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const sigRes = await fetch('/api/upload', { method: 'POST' })
      const { signature, timestamp, cloudName, apiKey } = await sigRes.json()

      const fd = new FormData()
      fd.append('file', file)
      fd.append('signature', signature)
      fd.append('timestamp', timestamp.toString())
      fd.append('api_key', apiKey)
      fd.append('folder', 'zalfa-naqiyya')

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: fd,
      })
      const data = await uploadRes.json()

      if (data.secure_url) {
        setImageUrl(data.secure_url)
        setPublicId(data.public_id ?? '')
      } else {
        alert('Gagal mengunggah gambar.')
      }
    } catch {
      alert('Gagal mengunggah gambar.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      {state.message && (
        <div
          role={state.success ? 'status' : 'alert'}
          className={`rounded-scrapbook px-4 py-3 text-sm font-body border ${
            state.success
              ? 'bg-primary/10 border-primary/30 text-primary'
              : 'bg-secondary/10 border-secondary/30 text-secondary'
          }`}
        >
          {state.message}
        </div>
      )}

      {/* Image */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text font-body">Gambar Dokumentasi</label>
        {imageUrl && (
          <div className="relative w-full max-w-sm aspect-video rounded-2xl overflow-hidden mb-2">
            <Image src={imageUrl} alt="Preview" fill className="object-cover" sizes="400px" />
            <button
              type="button"
              onClick={() => { setImageUrl(''); setPublicId('') }}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/70"
              aria-label="Hapus gambar"
            >
              ×
            </button>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading || pending}
          className="text-sm font-body text-text-muted file:mr-3 file:rounded-xl file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary hover:file:bg-primary/20 transition-colors"
        />
        {uploading && <p className="text-xs text-text-muted font-body">Mengunggah…</p>}
        <input type="hidden" name="imageUrl" value={imageUrl} />
        <input type="hidden" name="publicId" value={publicId} />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="doc-category" className="text-sm font-medium text-text font-body">Kategori</label>
        <select
          id="doc-category"
          name="category"
          required
          defaultValue={initialData?.category ?? ''}
          disabled={pending}
          className="w-full px-4 py-3 rounded-scrapbook border border-surface-dim bg-white text-text font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
        >
          <option value="" disabled>Pilih kategori…</option>
          {DOC_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      <Input
        id="doc-caption"
        name="caption"
        label="Keterangan (opsional)"
        placeholder="Contoh: Cooking Class di Burger King"
        defaultValue={initialData?.caption}
        disabled={pending}
      />

      <Input
        id="doc-order"
        name="order"
        type="number"
        label="Urutan"
        placeholder="0"
        defaultValue={initialData?.order?.toString() ?? '0'}
        disabled={pending}
      />

      <label className="flex items-center gap-3 cursor-pointer w-fit">
        <input
          id="doc-published"
          type="checkbox"
          name="published"
          value="true"
          defaultChecked={initialData?.published ?? true}
          disabled={pending}
          className="w-4 h-4 rounded accent-primary"
        />
        <span className="text-sm font-body font-medium text-text">Tampilkan di website</span>
      </label>

      <div className="flex items-center gap-3">
        <Button type="submit" isLoading={pending || uploading} disabled={!imageUrl} id="save-doc-btn">
          {pending ? 'Menyimpan…' : 'Simpan Dokumentasi'}
        </Button>
        <a href="/dashboard/documentation" className="text-sm font-body text-text-muted hover:text-text">
          Batal
        </a>
      </div>
    </form>
  )
}
