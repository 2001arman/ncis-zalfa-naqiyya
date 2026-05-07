'use client'

import { useEditor, EditorContent } from '@tiptap/react'
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
        {toolbarBtn('H2', () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), editor?.isActive('heading', { level: 2 }))}
        {toolbarBtn('H3', () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), editor?.isActive('heading', { level: 3 }))}
        {toolbarBtn('B', () => editor?.chain().focus().toggleBold().run(), editor?.isActive('bold'))}
        {toolbarBtn('I', () => editor?.chain().focus().toggleItalic().run(), editor?.isActive('italic'))}
        {toolbarBtn('• List', () => editor?.chain().focus().toggleBulletList().run(), editor?.isActive('bulletList'))}
        {toolbarBtn('1. List', () => editor?.chain().focus().toggleOrderedList().run(), editor?.isActive('orderedList'))}
        {toolbarBtn('Quote', () => editor?.chain().focus().toggleBlockquote().run(), editor?.isActive('blockquote'))}
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
        value={editor?.getHTML() ?? ''}
        readOnly
      />
    </div>
  )
}
