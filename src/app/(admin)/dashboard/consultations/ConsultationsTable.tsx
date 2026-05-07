'use client'

import { useTransition } from 'react'
import { updateConsultationStatus } from '@/lib/actions/consultation.actions'
import { formatDate } from '@/lib/utils'
import type { Consultation } from '@prisma/client'

interface Props {
  consultations: Consultation[]
}

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'Baru', className: 'text-secondary bg-secondary/10' },
  { value: 'CONTACTED', label: 'Dihubungi', className: 'text-tertiary bg-tertiary/10' },
  { value: 'RESOLVED', label: 'Selesai', className: 'text-primary bg-primary/10' },
] as const

export default function ConsultationsTable({ consultations }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleStatusChange(id: string, status: string) {
    startTransition(() => {
      updateConsultationStatus(id, status as 'NEW' | 'CONTACTED' | 'RESOLVED')
    })
  }

  return (
    <div className="bg-white rounded-scrapbook shadow-ambient overflow-x-auto">
      <table className="w-full text-sm font-body min-w-[640px]">
        <thead>
          <tr className="border-b border-surface-dim bg-surface-container">
            {['Nama', 'Telepon', 'Layanan', 'Pesan', 'Tanggal', 'Status'].map((h) => (
              <th
                key={h}
                className="px-5 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-dim">
          {consultations.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-text-muted">
                Belum ada konsultasi masuk.
              </td>
            </tr>
          ) : (
            consultations.map((c) => (
              <tr key={c.id} className="hover:bg-surface-container/50 transition-colors">
                <td className="px-5 py-3 font-medium text-text whitespace-nowrap">{c.name}</td>
                <td className="px-5 py-3 text-text-muted whitespace-nowrap">{c.phone}</td>
                <td className="px-5 py-3 text-text-muted">{c.service}</td>
                <td className="px-5 py-3 text-text-muted max-w-xs truncate">
                  {c.message ?? <span className="text-surface-dim italic">—</span>}
                </td>
                <td className="px-5 py-3 text-text-muted whitespace-nowrap">
                  {formatDate(c.createdAt)}
                </td>
                <td className="px-5 py-3">
                  <select
                    defaultValue={c.status}
                    disabled={isPending}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    className="rounded-xl border border-surface-dim px-2 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors bg-white"
                    aria-label={`Status konsultasi ${c.name}`}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
