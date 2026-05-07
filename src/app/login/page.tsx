'use client'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useActionState, Suspense } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface LoginState {
  error?: string
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  async function handleLogin(_: LoginState, formData: FormData): Promise<LoginState> {
    const result = await signIn('credentials', {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirect: false,
    })

    if (result?.error) {
      return { error: 'Email atau password salah.' }
    }

    router.push(callbackUrl)
    router.refresh()
    return {}
  }

  const [state, formAction, pending] = useActionState(handleLogin, {})

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error && (
        <div role="alert" className="rounded-scrapbook bg-secondary/10 border border-secondary/30 px-4 py-3 text-sm text-secondary font-body">
          {state.error}
        </div>
      )}

      <Input
        id="admin-email"
        name="email"
        type="email"
        label="Email"
        placeholder="admin@zalfa.id"
        required
        autoComplete="email"
        disabled={pending}
      />
      <Input
        id="admin-password"
        name="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        required
        autoComplete="current-password"
        disabled={pending}
      />

      <Button
        type="submit"
        size="lg"
        className="w-full"
        isLoading={pending}
        id="login-submit"
      >
        {pending ? 'Masuk…' : 'Masuk ke Dashboard'}
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">
            Zalfa Naqiyya
          </h1>
          <p className="text-text-muted font-body text-sm">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-scrapbook shadow-ambient-hover p-8">
          <h2 className="font-heading font-semibold text-xl text-text mb-6">Masuk</h2>
          <Suspense fallback={<div className="h-48 animate-pulse bg-surface-dim rounded-2xl" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
