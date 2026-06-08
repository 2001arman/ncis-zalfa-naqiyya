'use client'

import { useActionState } from 'react'
import { useEffect, useRef } from 'react'
import { submitConsultation, type ConsultationFormState } from '@/lib/actions/consultation.actions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const SERVICES = [
  'Psychological Assessment',
  'Counseling',
  'Kids Growth Program',
  'Self Healing Activity',
  'Other Related Services',
  'TPA / Daycare',
  'KB (Kelompok Bermain)',
  'TK Alif',
  'Bimbingan Belajar',
]

const initialState: ConsultationFormState = {}

export default function ConsultationForm() {
  const [state, formAction, pending] = useActionState(submitConsultation, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state.success])

  return (
    <form
      id="consultation-form"
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-5"
      noValidate
    >
      {/* Success toast */}
      {state.success && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-scrapbook bg-primary/10 border border-primary/30 px-4 py-3 text-sm text-primary font-body"
        >
          ✅ {state.message}
        </div>
      )}

      {/* General error */}
      {!state.success && state.message && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-scrapbook bg-secondary/10 border border-secondary/30 px-4 py-3 text-sm text-secondary font-body"
        >
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="name"
          name="name"
          label="Nama Lengkap"
          placeholder="contoh: Budi Santoso"
          required
          error={state.errors?.name?.[0]}
          disabled={pending}
        />
        <Input
          id="phone"
          name="phone"
          label="Nomor WhatsApp"
          type="tel"
          placeholder="08xx-xxxx-xxxx"
          required
          error={state.errors?.phone?.[0]}
          disabled={pending}
        />
      </div>

      {/* Service select */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="service" className="text-sm font-medium text-text font-body">
          Layanan yang Diinginkan
        </label>
        <select
          id="service"
          name="service"
          required
          disabled={pending}
          className="w-full px-4 py-3 rounded-scrapbook border border-surface-dim bg-white text-text font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          defaultValue=""
        >
          <option value="" disabled>Pilih layanan…</option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {state.errors?.service && (
          <p className="text-xs text-secondary font-body">{state.errors.service[0]}</p>
        )}
      </div>

      {/* Message textarea */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-text font-body">
          Cerita Singkat <span className="text-text-muted font-normal">(opsional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Ceritakan kekhawatiran atau pertanyaan Anda…"
          disabled={pending}
          className="w-full px-4 py-3 rounded-scrapbook border border-surface-dim bg-white text-text font-body text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none placeholder:text-text-muted/60"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        isLoading={pending}
        disabled={pending}
        className="w-full sm:w-auto"
        id="submit-consultation"
      >
        {pending ? 'Mengirim…' : 'Kirim Permintaan Konsultasi'}
      </Button>
    </form>
  )
}
