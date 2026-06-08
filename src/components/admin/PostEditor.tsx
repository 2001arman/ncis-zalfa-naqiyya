'use client'

import { useActionState, useState } from 'react'
import TiptapEditor from '@/components/admin/TiptapEditor'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import { compressImage } from '@/lib/compress-image'
import type { PostFormState } from '@/lib/actions/post.actions'

interface PostEditorProps {
  formAction: (prevState: PostFormState, formData: FormData) => Promise<PostFormState>
  initialData?: {
    title?: string
    excerpt?: string
    content?: string
    coverImage?: string
    published?: boolean
  }
}

export default function PostEditor({ formAction, initialData }: PostEditorProps) {
  const [state, action, pending] = useActionState(formAction, {})
  const [coverPreview, setCoverPreview] = useState<string>(initialData?.coverImage ?? '')
  const [uploading, setUploading] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const rawFile = e.target.files?.[0]
    if (!rawFile) return

    setUploading(true)
    try {
      const file = await compressImage(rawFile)
      // Get signed URL from our API route
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
        setCoverPreview(data.secure_url)
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

      <Input
        id="post-title"
        name="title"
        label="Judul Artikel"
        placeholder="Contoh: 5 Tanda Keterlambatan Wicara yang Perlu Diwaspadai"
        required
        defaultValue={initialData?.title}
        disabled={pending}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="post-excerpt" className="text-sm font-medium text-text font-body">
          Ringkasan <span className="text-text-muted font-normal">(opsional)</span>
        </label>
        <textarea
          id="post-excerpt"
          name="excerpt"
          rows={2}
          placeholder="Deskripsi singkat yang muncul di halaman daftar artikel…"
          defaultValue={initialData?.excerpt ?? ''}
          disabled={pending}
          className="w-full px-4 py-3 rounded-scrapbook border border-surface-dim bg-white text-text font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none placeholder:text-text-muted/60"
        />
      </div>

      {/* Cover image */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text font-body">
          Gambar Cover <span className="text-text-muted font-normal">(opsional)</span>
        </label>
        {coverPreview && (
          <div className="relative w-full max-w-sm aspect-video rounded-2xl overflow-hidden mb-2">
            <Image
              src={coverPreview}
              alt="Preview cover"
              fill
              className="object-cover"
              sizes="400px"
            />
            <button
              type="button"
              onClick={() => setCoverPreview('')}
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
        {/* Hidden input to pass URL to server action */}
        <input type="hidden" name="coverImage" value={coverPreview} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text font-body">Konten Artikel</label>
        <TiptapEditor name="content" defaultValue={initialData?.content} />
      </div>

      {/* Published toggle */}
      <label className="flex items-center gap-3 cursor-pointer w-fit">
        <input
          id="post-published"
          type="checkbox"
          name="published"
          value="true"
          defaultChecked={initialData?.published ?? false}
          disabled={pending}
          className="w-4 h-4 rounded accent-primary"
        />
        <span className="text-sm font-body font-medium text-text">Publikasikan sekarang</span>
      </label>

      <div className="flex items-center gap-3">
        <Button type="submit" isLoading={pending || uploading} id="save-post-btn">
          {pending ? 'Menyimpan…' : 'Simpan Artikel'}
        </Button>
        <a href="/dashboard/posts" className="text-sm font-body text-text-muted hover:text-text">
          Batal
        </a>
      </div>
    </form>
  )
}
