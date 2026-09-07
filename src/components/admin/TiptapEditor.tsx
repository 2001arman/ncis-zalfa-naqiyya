'use client'

import { useEditor, useEditorState, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { cn } from '@/lib/utils'

interface TiptapEditorProps {
  name: string
  defaultValue?: string
  className?: string
}

export default function TiptapEditor({ name, defaultValue = '', className }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: [
          'min-h-[320px] px-5 py-4 outline-none font-body text-text prose prose-stone max-w-none',
          'prose-headings:font-heading prose-headings:text-text',
          'prose-p:text-text-muted prose-p:leading-relaxed',
        ].join(' '),
      },
    },
  })

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
        {toolbarBtn('↩ Undo', () => editor?.chain().focus().undo().run())}
        {toolbarBtn('↪ Redo', () => editor?.chain().focus().redo().run())}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Hidden input to pass HTML to the form */}
      <input
        type="hidden"
        name={name}
        value={editorState?.html ?? ''}
        readOnly
      />
    </div>
  )
}
