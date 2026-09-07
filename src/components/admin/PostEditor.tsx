'use client'

import { useActionState, useCallback, useEffect, useRef, useState } from 'react'
import TiptapEditor from '@/components/admin/TiptapEditor'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
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
    coverPublicId?: string
    published?: boolean
  }
}

type Notice = { kind: 'success' | 'error'; text: string }

export default function PostEditor({ formAction, initialData }: PostEditorProps) {
  const [state, action, pending] = useActionState(formAction, {})
  const [coverPreview, setCoverPreview] = useState<string>(initialData?.coverImage ?? '')
  const [coverPublicId, setCoverPublicId] = useState<string>(initialData?.coverPublicId ?? '')
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<Notice | null>(null)
  // Bumped per message so an identical repeat still re-triggers the animation.
  const [toastSeq, setToastSeq] = useState(0)
  const excerptRef = useRef<HTMLTextAreaElement>(null)
  const excerptMinHeight = useRef(0)

  const showToast = useCallback((notice: Notice) => {
    setToast(notice)
    setToastSeq((seq) => seq + 1)
  }, [])

  // Surface whatever the server action returned as a floating toast — a banner
  // at the top of this form scrolls out of view before the admin can read it.
  useEffect(() => {
    if (!state.message) return
    showToast({ kind: state.success ? 'success' : 'error', text: state.message })
  }, [state, showToast])

  /** Grow the excerpt box to fit its text, never shrinking past its rows={2} height. */
  const growExcerpt = useCallback(() => {
    const el = excerptRef.current
    if (!el) return
    const style = getComputedStyle(el)
    // box-sizing is border-box, but scrollHeight excludes borders
    const borders = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
    el.style.height = 'auto'
    el.style.height = `${Math.max(el.scrollHeight + borders, excerptMinHeight.current)}px`
  }, [])

  useEffect(() => {
    const el = excerptRef.current
    if (!el) return
    // Lock in the natural rows={2} height as the floor before auto-sizing starts.
    excerptMinHeight.current = el.offsetHeight
    growExcerpt()
    window.addEventListener('resize', growExcerpt)
    return () => window.removeEventListener('resize', growExcerpt)
  }, [growExcerpt])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const rawFile = e.target.files?.[0]
    if (!rawFile) return

    setUploading(true)
    try {
      const file = await compressImage(rawFile)

      // Get signed upload params from our API route
      const sigRes = await fetch('/api/upload', { method: 'POST' })
      if (!sigRes.ok) {
        throw new Error(
          sigRes.status === 401
            ? 'Sesi login sudah berakhir. Login ulang lalu coba lagi.'
            : `Gagal meminta izin unggah (HTTP ${sigRes.status}).`
        )
      }
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

      if (!data.secure_url) {
        throw new Error(data?.error?.message ?? 'Cloudinary menolak gambar ini.')
      }

      setCoverPreview(data.secure_url)
      setCoverPublicId(data.public_id ?? '')
      showToast({ kind: 'success', text: 'Gambar cover berhasil diunggah.' })
    } catch (error) {
      showToast({
        kind: 'error',
        text: `Gagal mengunggah gambar. ${error instanceof Error ? error.message : ''}`.trim(),
      })
    } finally {
      setUploading(false)
      e.target.value = '' // allow re-picking the same file after a failure
    }
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      {toast && (
        <Toast
          key={toastSeq}
          kind={toast.kind}
          text={toast.text}
          onClose={() => setToast(null)}
        />
      )}

      <Input
        id="post-title"
        name="title"
        label="Judul Artikel"
        placeholder="Contoh: 5 Tanda Keterlambatan Wicara yang Perlu Diwaspadai"
        required
        defaultValue={initialData?.title}
        disabled={pending}
        error={state.fieldErrors?.title}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="post-excerpt" className="text-sm font-medium text-text font-body">
          Ringkasan <span className="text-text-muted font-normal">(opsional)</span>
        </label>
        <textarea
          id="post-excerpt"
          name="excerpt"
          ref={excerptRef}
          rows={2}
          onInput={growExcerpt}
          placeholder="Deskripsi singkat yang muncul di halaman daftar artikel…"
          defaultValue={initialData?.excerpt ?? ''}
          disabled={pending}
          className="w-full px-4 py-3 rounded-scrapbook border border-surface-dim bg-white text-text font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none overflow-hidden placeholder:text-text-muted/60"
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
              onClick={() => { setCoverPreview(''); setCoverPublicId('') }}
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
        {uploading && (
          <p className="text-xs font-body text-text-muted">Mengunggah gambar…</p>
        )}
        {/* Hidden inputs to pass URL + Cloudinary id to server action */}
        <input type="hidden" name="coverImage" value={coverPreview} />
        <input type="hidden" name="coverPublicId" value={coverPublicId} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text font-body">Konten Artikel</label>
        <TiptapEditor name="content" defaultValue={initialData?.content} />
        {state.fieldErrors?.content && (
          <p className="text-xs text-secondary font-body">{state.fieldErrors.content}</p>
        )}
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
          {pending ? 'Menyimpan…' : uploading ? 'Menunggu unggahan…' : 'Simpan Artikel'}
        </Button>
        <a href="/dashboard/posts" className="text-sm font-body text-text-muted hover:text-text">
          Batal
        </a>
      </div>
    </form>
  )
}
