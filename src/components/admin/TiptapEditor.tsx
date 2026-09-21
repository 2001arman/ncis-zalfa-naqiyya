'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditor, useEditorState, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import { cn } from '@/lib/utils'
import { uploadImage, uploadErrorMessage } from '@/lib/upload-image'
import ImageCropDialog from '@/components/admin/ImageCropDialog'

export interface EditorNotice {
  kind: 'success' | 'error'
  text: string
}

interface TiptapEditorProps {
  name: string
  defaultValue?: string
  className?: string
  /** Lets the parent surface upload results in its own toast. */
  onNotice?: (notice: EditorNotice) => void
}

export default function TiptapEditor({
  name,
  defaultValue = '',
  className,
  onNotice,
}: TiptapEditorProps) {
  const [uploadingCount, setUploadingCount] = useState(0)
  // Every asset uploaded from here this session. Submitted alongside the HTML
  // so the server can drop the ones the admin inserted and then deleted again.
  const [uploadedIds, setUploadedIds] = useState<string[]>([])
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Paste/drop handlers are bound when the editor is created, so they read the
  // current uploader through a ref instead of closing over a stale one.
  const addFilesRef = useRef<(files: File[]) => void>(() => {})

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { class: 'rounded-2xl' },
        // Drag handles on the corners; height follows width so the picture
        // never gets squashed. Styling for the handles lives in globals.css.
        resize: {
          enabled: true,
          directions: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
          minWidth: 80,
          minHeight: 60,
          alwaysPreserveAspectRatio: true,
        },
      }),
    ],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: [
          'min-h-[320px] px-5 py-4 outline-none font-body text-text prose prose-stone max-w-none',
          'prose-headings:font-heading prose-headings:text-text',
          'prose-p:text-text-muted prose-p:leading-relaxed',
          'prose-img:rounded-2xl prose-img:my-6',
        ].join(' '),
      },
      handlePaste: (_view, event) => {
        const files = imageFilesFrom(event.clipboardData)
        if (files.length === 0) return false
        event.preventDefault()
        addFilesRef.current(files)
        return true
      },
      handleDrop: (_view, event) => {
        const files = imageFilesFrom((event as DragEvent).dataTransfer)
        if (files.length === 0) return false
        event.preventDefault()
        addFilesRef.current(files)
        return true
      },
    },
  })

  /**
   * Uploads each file to Cloudinary and drops it into the document. Runs
   * sequentially so multiple pasted images keep their order.
   */
  const addFiles = useCallback(
    async (files: File[]) => {
      if (!editor || files.length === 0) return

      setUploadingCount((n) => n + files.length)
      let inserted = 0
      // Collected rather than reported one by one: a single toast is visible at
      // a time, so per-file alerts would overwrite each other in a batch.
      const failures: string[] = []

      for (const file of files) {
        try {
          const { url, publicId } = await uploadImage(file)
          if (publicId) setUploadedIds((ids) => [...ids, publicId])
          editor
            .chain()
            .focus()
            .setImage({ src: url, alt: file.name.replace(/\.\w+$/, '') })
            .run()
          inserted++
        } catch (error) {
          failures.push(uploadErrorMessage(error, file.name))
        } finally {
          setUploadingCount((n) => n - 1)
        }
      }

      if (failures.length > 0) {
        onNotice?.({
          kind: 'error',
          text:
            failures.length === 1
              ? failures[0]
              : `${failures.length} gambar gagal diunggah. ${failures.join(' ')}`,
        })
        return
      }

      if (inserted > 0) {
        onNotice?.({
          kind: 'success',
          text:
            inserted === 1
              ? 'Gambar disisipkan ke dalam artikel.'
              : `${inserted} gambar disisipkan ke dalam artikel.`,
        })
      }
    },
    [editor, onNotice]
  )

  useEffect(() => {
    addFilesRef.current = (files) => void addFiles(files)
  }, [addFiles])

  /**
   * Tiptap v3 no longer re-renders the component on every transaction
   * (`shouldRerenderOnTransaction` defaults to false), so reading
   * `editor.getHTML()` during render would keep returning the *initial* HTML
   * and the hidden input below would submit stale/empty content.
   * `useEditorState` subscribes to exactly the slices we render.
   */
  const editorState = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      html: !e || e.isEmpty ? '' : e.getHTML(),
      isH2: !!e?.isActive('heading', { level: 2 }),
      isH3: !!e?.isActive('heading', { level: 3 }),
      isBold: !!e?.isActive('bold'),
      isItalic: !!e?.isActive('italic'),
      isBulletList: !!e?.isActive('bulletList'),
      isOrderedList: !!e?.isActive('orderedList'),
      isBlockquote: !!e?.isActive('blockquote'),
      isImage: !!e?.isActive('image'),
      selectedImageSrc: (e?.getAttributes('image')?.src as string | undefined) ?? '',
    }),
  })

  const toolbarBtn = (
    label: string,
    action: () => void,
    isActive?: boolean
  ) => (
    <button
      key={label}
      type="button"
      onMouseDown={(e) => {
        e.preventDefault()
        action()
      }}
      className={cn(
        'px-2.5 py-1.5 rounded-lg text-sm font-body font-medium transition-colors',
        isActive
          ? 'bg-primary text-white'
          : 'text-text-muted hover:bg-surface-container hover:text-text'
      )}
      title={label}
      aria-label={label}
    >
      {label}
    </button>
  )

  return (
    <div className={cn('rounded-scrapbook border border-surface-dim overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-surface-dim bg-surface-container">
        {toolbarBtn('H2', () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), editorState?.isH2)}
        {toolbarBtn('H3', () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), editorState?.isH3)}
        {toolbarBtn('B', () => editor?.chain().focus().toggleBold().run(), editorState?.isBold)}
        {toolbarBtn('I', () => editor?.chain().focus().toggleItalic().run(), editorState?.isItalic)}
        {toolbarBtn('• List', () => editor?.chain().focus().toggleBulletList().run(), editorState?.isBulletList)}
        {toolbarBtn('1. List', () => editor?.chain().focus().toggleOrderedList().run(), editorState?.isOrderedList)}
        {toolbarBtn('Quote', () => editor?.chain().focus().toggleBlockquote().run(), editorState?.isBlockquote)}
        <div className="h-5 w-px bg-surface-dim mx-1" />
        {toolbarBtn('🖼 Gambar', () => fileInputRef.current?.click())}
        {editorState?.isImage && (
          <>
            {toolbarBtn('✂ Potong', () => setCropSrc(editorState.selectedImageSrc))}
            {toolbarBtn('Ukuran Asli', () =>
              editor?.chain().focus().updateAttributes('image', { width: null, height: null }).run()
            )}
            {toolbarBtn('Hapus Gambar', () => editor?.chain().focus().deleteSelection().run())}
          </>
        )}
        <div className="h-5 w-px bg-surface-dim mx-1" />
        {toolbarBtn('↩ Undo', () => editor?.chain().focus().undo().run())}
        {toolbarBtn('↪ Redo', () => editor?.chain().focus().redo().run())}

        {uploadingCount > 0 && (
          <span className="ml-auto text-xs font-body text-text-muted">
            Mengunggah {uploadingCount} gambar…
          </span>
        )}
      </div>

      {cropSrc && (
        <ImageCropDialog
          src={cropSrc}
          onClose={() => setCropSrc(null)}
          onApply={(nextSrc) => {
            // Cropping changes the aspect ratio, so drop any manual size and
            // let the image lay out naturally again.
            editor
              ?.chain()
              .focus()
              .updateAttributes('image', { src: nextSrc, width: null, height: null })
              .run()
            setCropSrc(null)
          }}
        />
      )}

      {/* Hidden picker driven by the toolbar button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          e.target.value = '' // let the same file be picked again
          void addFiles(files)
        }}
      />

      {/* Editor */}
      <EditorContent editor={editor} />

      <p className="px-5 pb-3 text-xs font-body text-text-muted">
        Sisipkan gambar lewat tombol 🖼 Gambar, atau langsung tempel (paste) dan seret (drag) file ke
        dalam editor. Klik gambar untuk mengubah ukuran lewat titik sudutnya, atau memotongnya.
      </p>

      {/* Hidden inputs to pass HTML + this session's uploads to the form */}
      <input
        type="hidden"
        name={name}
        value={editorState?.html ?? ''}
        readOnly
      />
      <input type="hidden" name={`${name}Uploads`} value={uploadedIds.join(',')} readOnly />
    </div>
  )
}

function imageFilesFrom(source: DataTransfer | null | undefined): File[] {
  return Array.from(source?.files ?? []).filter((file) => file.type.startsWith('image/'))
}
