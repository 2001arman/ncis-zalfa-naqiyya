'use client'

interface DeleteButtonProps {
  action: () => Promise<void>
  label?: string
  confirmText?: string
}

export default function DeleteButton({ action, label = 'Hapus', confirmText }: DeleteButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (confirmText && !confirm(confirmText)) e.preventDefault()
      }}
    >
      <button type="submit" className="text-xs font-medium text-secondary hover:underline">
        {label}
      </button>
    </form>
  )
}
