import { useEffect, useState } from 'react'
import { MdDirectionsCar, MdLockOutline } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const { session, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && session) navigate('/admin/dashboard', { replace: true })
  }, [authLoading, navigate, session])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (signInError) {
      setError(signInError.message || 'Unable to log in. Check your email and password.')
      setLoading(false)
      return
    }

    if (!data.session?.access_token) {
      setError('Login succeeded, but no access session was returned. Please try again.')
      setLoading(false)
      return
    }

    navigate(location.state?.from || '/admin/dashboard', { replace: true })
  }

  return (
    <main className="grid min-h-screen bg-brand-bg lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)]">
      <section className="relative hidden overflow-hidden bg-dark-nav lg:block">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(11,26,49,0.96),rgba(11,26,49,0.78)),url('/src/assets/riri%20banner/riri-showroom.jpg')] bg-cover bg-center" />
        <div className="relative flex h-full max-w-xl flex-col justify-between p-12 text-white xl:p-20">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded bg-primary text-2xl"><MdDirectionsCar /></span>
            <span className="text-lg font-bold tracking-wide">RIRI CARS</span>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-accent-light">Showroom operations</p>
            <h1 className="max-w-lg text-4xl font-bold leading-tight xl:text-5xl">Keep every vehicle detail ready for the next buyer.</h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/75">Manage the live showroom inventory from one secure workspace.</p>
          </div>
          <p className="text-sm text-white/55">Kiambu Road · Fourways Junction · Nairobi</p>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <div className="mb-8 flex items-center gap-3 text-dark"><span className="grid h-10 w-10 place-items-center rounded bg-primary text-xl text-white"><MdDirectionsCar /></span><span className="font-bold tracking-wide">RIRI CARS</span></div>
          </div>
          <div className="mb-8">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded bg-primary-subtle text-xl text-primary"><MdLockOutline /></div>
            <h2 className="text-3xl font-bold tracking-tight text-dark">Admin sign in</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Use your authorized Riri Cars staff account to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-semibold text-dark">Email<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="input-field mt-2" placeholder="you@riricars.co.ke" /></label>
            <label className="block text-sm font-semibold text-dark">Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="input-field mt-2" placeholder="Enter your password" /></label>
            {error && <p role="alert" className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-800">{error}</p>}
            <button type="submit" disabled={loading || authLoading} className="btn-primary min-h-12 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="mt-8 text-center text-xs leading-5 text-muted">Access is verified by the backend. An authenticated account without admin access will be denied.</p>
        </div>
      </section>
    </main>
  )
}